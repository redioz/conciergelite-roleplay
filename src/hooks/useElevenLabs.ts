'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Profile, TranscriptEntry, ScoringResult, Settings } from '@/types';
import { parseScoring } from '@/lib/scoring';

interface UseElevenLabsReturn {
  startCall: (profile: Profile, settings: Settings, userId?: string) => Promise<void>;
  stopCall: () => void;
  connecting: boolean;
  callActive: boolean;
  isSpeaking: boolean;
  userSpeaking: boolean;
  inputVolume: number;   // 0-1 real-time microphone volume level
  evaluating: boolean;   // true while post-call AI evaluation is running
  transcript: TranscriptEntry[];
  scoring: ScoringResult | null;
  error: string | null;
}

// Language instructions are now baked into the ElevenLabs agent base prompt
// (temperature, keywords, latency, eagerness all configured server-side)
// Only the profile-specific system prompt is sent as override per call.

export function useElevenLabs(): UseElevenLabsReturn {
  const conversationRef = useRef<any>(null);
  const [connecting, setConnecting] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [scoring, setScoring] = useState<ScoringResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputVolume, setInputVolume] = useState(0);
  const [evaluating, setEvaluating] = useState(false);
  const fullTranscriptRef = useRef('');
  const callProfileRef = useRef<{ id: string; name: string } | null>(null);
  const callModelRef = useRef<string>('');
  const callStartTimeRef = useRef<string>('');
  const callUserIdRef = useRef<string | undefined>(undefined);
  const volumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
        volumeIntervalRef.current = null;
      }
      if (conversationRef.current) {
        try { conversationRef.current.endSession(); } catch {}
        conversationRef.current = null;
      }
    };
  }, []);

  const startCall = useCallback(async (profile: Profile, settings: Settings, userId?: string) => {
    setError(null);
    setScoring(null);
    setTranscript([]);
    setConnecting(true);
    fullTranscriptRef.current = '';

    try {
      // Dynamic import to avoid SSR issues
      const { Conversation } = await import('@elevenlabs/client');

      // Get the agent ID
      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
      if (!agentId) {
        throw new Error('NEXT_PUBLIC_ELEVENLABS_AGENT_ID non configuré');
      }

      // Get signed URL from our API route
      const signedUrlRes = await fetch(`/api/elevenlabs/signed-url?agentId=${agentId}`);
      if (!signedUrlRes.ok) {
        const errData = await signedUrlRes.json().catch(() => ({}));
        throw new Error(errData.error || `Erreur ${signedUrlRes.status} lors de la récupération de l'URL signée`);
      }
      const { signedUrl } = await signedUrlRes.json();

      // Store call metadata for post-call logging
      callProfileRef.current = { id: profile.id, name: profile.name };
      callModelRef.current = settings.model;
      callStartTimeRef.current = new Date().toISOString();
      callUserIdRef.current = userId;

      // Start the ElevenLabs conversation
      // Language instructions & ASR keywords are in the agent base config (server-side)
      // We only override the profile-specific prompt, firstMessage, and voiceId
      const conversation = await Conversation.startSession({
        signedUrl,
        overrides: {
          agent: {
            prompt: {
              prompt: profile.systemPrompt,
            },
            firstMessage: profile.firstMessage,
          },
          tts: {
            voiceId: profile.voiceId,
          },
        },
        onConnect: () => {
          console.log('[ElevenLabs] Connected');
          setConnecting(false);
          setCallActive(true);
        },
        onDisconnect: (details: any) => {
          console.log('[ElevenLabs] Disconnected — reason:', details?.reason, 'message:', details?.message, 'full:', JSON.stringify(details));
          // Stop volume polling
          if (volumeIntervalRef.current) {
            clearInterval(volumeIntervalRef.current);
            volumeIntervalRef.current = null;
          }
          setCallActive(false);
          setIsSpeaking(false);
          setUserSpeaking(false);
          setInputVolume(0);

          // Helper: save transcript + scoring to backend
          const durationMs = Date.now() - new Date(callStartTimeRef.current).getTime();
          const saveTranscript = (finalScoring: ScoringResult | null) => {
            setTranscript((currentTranscript) => {
              fetch('/api/transcript', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  profile_id: callProfileRef.current?.id || 'unknown',
                  profile_name: callProfileRef.current?.name || 'unknown',
                  transcript: currentTranscript,
                  full_transcript: fullTranscriptRef.current,
                  scoring: finalScoring,
                  duration_seconds: Math.round(durationMs / 1000),
                  model: callModelRef.current,
                  started_at: callStartTimeRef.current,
                  user_id: callUserIdRef.current || null,
                }),
              })
                .then((r) => r.json())
                .then((data) => console.log('[ConciergElite] Transcript saved:', data))
                .catch((err) => console.error('[ConciergElite] Failed to save transcript:', err));
              return currentTranscript;
            });
          };

          // Parse scoring from full transcript (agent may have given inline scores)
          const result = parseScoring(fullTranscriptRef.current);
          if (result) {
            setScoring(result);
            saveTranscript(result);
          } else if (fullTranscriptRef.current.trim().length > 50) {
            // No inline scores — call AI evaluation endpoint
            setEvaluating(true);
            fetch('/api/evaluate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transcript: fullTranscriptRef.current,
                profileName: callProfileRef.current?.name || 'inconnu',
              }),
            })
              .then((r) => r.json())
              .then((data) => {
                if (data.evaluation) {
                  const aiResult = parseScoring(data.evaluation);
                  if (aiResult) {
                    setScoring(aiResult);
                    saveTranscript(aiResult);
                    return;
                  }
                }
                // No valid scoring from AI — save without scoring
                saveTranscript(null);
              })
              .catch((err) => {
                console.error('[Evaluate] Post-call evaluation failed:', err);
                saveTranscript(null);
              })
              .finally(() => setEvaluating(false));
          } else {
            // Transcript too short — save without scoring
            saveTranscript(null);
          }
        },
        onMessage: (message: { message: string; source: string }) => {
          const role = message.source === 'ai' ? 'assistant' : 'user';
          const text = message.message || '';

          if (!text.trim()) return;

          // Accumulate full transcript
          fullTranscriptRef.current += `\n${role === 'assistant' ? 'ASSISTANT' : 'USER'}: ${text}`;

          // Add to transcript entries (ElevenLabs sends final messages only)
          setTranscript((prev) => [
            ...prev,
            { role, text, timestamp: Date.now(), isFinal: true },
          ]);

          // Track user speaking state
          if (role === 'user') {
            setUserSpeaking(true);
            setTimeout(() => setUserSpeaking(false), 500);
          }
        },
        onModeChange: (mode: { mode: string }) => {
          if (mode.mode === 'speaking') {
            setIsSpeaking(true);
          } else {
            setIsSpeaking(false);
          }
        },
        onError: (message: string, context?: any) => {
          console.error('[ElevenLabs] Error:', message, 'context:', context);
          setError(message || 'Erreur ElevenLabs inconnue');
          setConnecting(false);
          setCallActive(false);
        },
      });

      conversationRef.current = conversation;

      // Poll microphone input volume at ~20fps for real-time visual feedback
      volumeIntervalRef.current = setInterval(() => {
        if (conversationRef.current) {
          try {
            const vol = conversationRef.current.getInputVolume();
            setInputVolume(typeof vol === 'number' ? vol : 0);
          } catch {
            // Ignore — session may have ended
          }
        }
      }, 50);
    } catch (err: any) {
      console.error('Start call error:', err);
      let msg = err?.message || 'Impossible de démarrer l\'appel';
      if (msg.includes('Permission') || msg.includes('NotAllowed') || msg.includes('getUserMedia')) {
        msg = 'Autorise l\'accès au microphone dans ton navigateur puis réessaie.';
      } else if (msg.includes('NotFound') || msg.includes('DevicesNotFound')) {
        msg = 'Aucun microphone détecté. Branche un micro et réessaie.';
      }
      setError(msg);
      setConnecting(false);
    }
  }, []);

  const stopCall = useCallback(() => {
    if (conversationRef.current) {
      try {
        conversationRef.current.endSession();
      } catch (err) {
        console.error('Stop error:', err);
      }
    }
  }, []);

  return {
    startCall,
    stopCall,
    connecting,
    callActive,
    isSpeaking,
    userSpeaking,
    inputVolume,
    evaluating,
    transcript,
    scoring,
    error,
  };
}
