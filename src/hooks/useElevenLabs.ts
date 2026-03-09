'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Profile, TranscriptEntry, ScoringResult, Settings } from '@/types';
import { parseScoring } from '@/lib/scoring';

interface UseElevenLabsReturn {
  startCall: (profile: Profile, settings: Settings) => Promise<void>;
  stopCall: () => void;
  connecting: boolean;
  callActive: boolean;
  isSpeaking: boolean;
  userSpeaking: boolean;
  transcript: TranscriptEntry[];
  scoring: ScoringResult | null;
  error: string | null;
}

// French language enforcement prefix — injected before every system prompt
const FRENCH_PREFIX = `[LANGUE OBLIGATOIRE]
Tu DOIS parler UNIQUEMENT en français. Jamais un seul mot en anglais.
- Dis "pour cent" et JAMAIS "percent"
- Dis "cinq cents dirhams" et JAMAIS "5 0 0 dirhams" — prononce TOUJOURS les nombres en toutes lettres de manière naturelle
- Dis "mille" pas "one thousand", "deux mille" pas "two thousand"
- Utilise les expressions françaises/marocaines naturelles
- Si tu dois mentionner un terme technique anglais (Airbnb, check-in), prononce-le naturellement mais tout le reste DOIT être en français

[PRONONCIATION DES NOMBRES]
- 500 → "cinq cents"
- 5 500 → "cinq mille cinq cents"
- 10 000 → "dix mille"
- 15 000 → "quinze mille"
- 18% → "dix-huit pour cent"
- 3% → "trois pour cent"
Ne JAMAIS épeler les chiffres un par un. Toujours les prononcer comme un nombre naturel.

[COMPRÉHENSION INTELLIGENTE]
La transcription vocale peut être imparfaite. Tu DOIS interpréter ce que dit ton interlocuteur en utilisant le CONTEXTE de la conversation, même si certains mots sont mal transcrits.
Exemples de corrections à faire mentalement :
- "prix la" ou "price lab" → PriceLabs (outil de tarification)
- "air bee tics" ou "air beatix" → Airbtics (outil d'analyse)
- "concierge élite" ou "conciergerie lite" → ConciergÉlite
- "courte durée" même si transcrit "court duré" ou "courte durer"
- "check-in" même si transcrit "chekin" ou "check wine"
- "longue durée" même si transcrit "long duré"
- "taux d'occupation" même si transcrit "tôt d'occupation" ou "taux doccupation"
- "rendement" même si transcrit "rendeman" ou "rendemment"
Ne JAMAIS demander de répéter sauf si tu ne comprends vraiment pas du tout le sens. Déduis le sens par le contexte.

`;

export function useElevenLabs(): UseElevenLabsReturn {
  const conversationRef = useRef<any>(null);
  const [connecting, setConnecting] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [scoring, setScoring] = useState<ScoringResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fullTranscriptRef = useRef('');
  const callProfileRef = useRef<{ id: string; name: string } | null>(null);
  const callModelRef = useRef<string>('');
  const callStartTimeRef = useRef<string>('');

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        try { conversationRef.current.endSession(); } catch {}
        conversationRef.current = null;
      }
    };
  }, []);

  const startCall = useCallback(async (profile: Profile, settings: Settings) => {
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

      // Build system prompt with French enforcement
      const systemPrompt = FRENCH_PREFIX + profile.systemPrompt;

      // Start the ElevenLabs conversation
      const conversation = await Conversation.startSession({
        signedUrl,
        overrides: {
          agent: {
            prompt: {
              prompt: systemPrompt,
            },
            firstMessage: profile.firstMessage,
            language: 'fr',
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
          setCallActive(false);
          setIsSpeaking(false);
          setUserSpeaking(false);

          // Parse scoring from full transcript
          const result = parseScoring(fullTranscriptRef.current);
          if (result) {
            setScoring(result);
          }

          // Log transcript to backend
          const durationMs = Date.now() - new Date(callStartTimeRef.current).getTime();
          setTranscript((currentTranscript) => {
            fetch('/api/transcript', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                profile_id: callProfileRef.current?.id || 'unknown',
                profile_name: callProfileRef.current?.name || 'unknown',
                transcript: currentTranscript,
                full_transcript: fullTranscriptRef.current,
                scoring: result || null,
                duration_seconds: Math.round(durationMs / 1000),
                model: callModelRef.current,
                started_at: callStartTimeRef.current,
              }),
            })
              .then((r) => r.json())
              .then((data) => console.log('[ConciergElite] Transcript saved:', data))
              .catch((err) => console.error('[ConciergElite] Failed to save transcript:', err));
            return currentTranscript;
          });
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
    transcript,
    scoring,
    error,
  };
}
