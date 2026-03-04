'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Profile, TranscriptEntry, ScoringResult, Settings } from '@/types';
import { parseScoring } from '@/lib/scoring';

interface UseVapiReturn {
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

export function useVapi(): UseVapiReturn {
  const vapiRef = useRef<any>(null);
  const [connecting, setConnecting] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [scoring, setScoring] = useState<ScoringResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fullTranscriptRef = useRef('');

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        try { vapiRef.current.stop(); } catch {}
        vapiRef.current = null;
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
      const { default: Vapi } = await import('@vapi-ai/web');
      const vapi = new Vapi(settings.vapiPublicKey);
      vapiRef.current = vapi;

      // Event handlers
      vapi.on('call-start', () => {
        setConnecting(false);
        setCallActive(true);
      });

      vapi.on('call-end', () => {
        setCallActive(false);
        setIsSpeaking(false);
        setUserSpeaking(false);

        // Parse scoring from full transcript
        const result = parseScoring(fullTranscriptRef.current);
        if (result) {
          setScoring(result);
        }
      });

      vapi.on('speech-start', () => {
        setIsSpeaking(true);
      });

      vapi.on('speech-end', () => {
        setIsSpeaking(false);
      });

      vapi.on('message', (message: any) => {
        if (message.type === 'transcript') {
          const role = message.role === 'assistant' ? 'assistant' : 'user';
          const text = message.transcript || '';

          if (message.transcriptType === 'final') {
            fullTranscriptRef.current += `\n${role === 'assistant' ? 'ASSISTANT' : 'USER'}: ${text}`;

            setTranscript((prev) => {
              // Replace last partial with final, or append
              const newTranscript = [...prev];
              const lastIdx = newTranscript.length - 1;
              if (lastIdx >= 0 && newTranscript[lastIdx].role === role) {
                newTranscript[lastIdx] = { role, text, timestamp: Date.now() };
              } else {
                newTranscript.push({ role, text, timestamp: Date.now() });
              }
              return newTranscript;
            });
          } else {
            // Partial transcript
            setTranscript((prev) => {
              const newTranscript = [...prev];
              const lastIdx = newTranscript.length - 1;
              if (lastIdx >= 0 && newTranscript[lastIdx].role === role) {
                newTranscript[lastIdx] = { role, text, timestamp: Date.now() };
              } else {
                newTranscript.push({ role, text, timestamp: Date.now() });
              }
              return newTranscript;
            });
          }

          // Track user speaking state
          if (role === 'user') {
            setUserSpeaking(true);
            // Reset after a short delay
            setTimeout(() => setUserSpeaking(false), 500);
          }
        }

        if (message.type === 'speech-update') {
          if (message.status === 'started' && message.role === 'assistant') {
            setIsSpeaking(true);
          } else if (message.status === 'stopped' && message.role === 'assistant') {
            setIsSpeaking(false);
          }
        }
      });

      vapi.on('error', (err: any) => {
        console.error('Vapi error:', err);
        setError(err?.message || 'Erreur de connexion Vapi');
        setConnecting(false);
        setCallActive(false);
      });

      // Start the call with transient assistant config
      await vapi.start({
        name: profile.name,
        firstMessage: profile.firstMessage,
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'multi',       // multi-language pour capter français + darija + arabe
          smartFormat: true,        // ponctuation et formatage automatique
          keywords: [               // mots-clés métier pour améliorer la reconnaissance
            'ConciergÉlite:3',
            'conciergerie:3',
            'Airbnb:3',
            'courte durée:3',
            'longue durée:2',
            'Marrakech:2',
            'Guéliz:2',
            'Tanger:2',
            'Casablanca:2',
            'fiches de police:3',
            'check-in:2',
            'check-out:2',
            'taux d\'occupation:3',
            'MAD:2',
            'dirhams:2',
            'taxe de séjour:3',
            'rendement:2',
            'commission:2',
          ],
        },
        model: {
          provider: 'openai',
          model: settings.model,
          messages: [{ role: 'system', content: profile.systemPrompt }],
          temperature: 0.8,
          maxTokens: 800,          // augmenté pour réponses + riches et scoring complet
        },
        voice: {
          provider: '11labs',
          model: 'eleven_multilingual_v2',
          voiceId: profile.voiceId,
          stability: 0.5,          // légèrement baissé pour plus de naturel/émotion
          similarityBoost: 0.8,
        },
        maxDurationSeconds: settings.duration + 120,
        silenceTimeoutSeconds: 30,
        endCallMessage: 'Au revoir et bonne continuation.',
        clientMessages: ['transcript', 'tool-calls', 'hang', 'speech-update'],
      } as any);
    } catch (err: any) {
      console.error('Start call error:', err);
      setError(err?.message || 'Impossible de démarrer l\'appel');
      setConnecting(false);
    }
  }, []);

  const stopCall = useCallback(() => {
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
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
