'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Profile, TranscriptEntry, ScoringResult, Settings } from '@/types';
import { parseScoring } from '@/lib/scoring';
import { getAdminSettings, AdminGlobalSettings, DEFAULT_ADMIN_SETTINGS } from '@/lib/adminStore';

// Safe error message extraction — handles circular refs, nested objects, etc.
function extractErrorMessage(err: any): string {
  // Try nested paths common in Vapi error objects
  const candidates = [
    err?.error?.message,
    err?.error?.statusMessage,
    err?.error?.error,
    err?.message,
    err?.errorMessage,
    err?.statusMessage,
    err?.msg,
    err?.reason,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.length > 0) return c;
  }
  // If it's a string itself
  if (typeof err === 'string' && err.length > 0) return err;
  // Try JSON.stringify with circular ref safety
  try {
    const str = JSON.stringify(err, (key, value) => {
      if (key === '' || typeof value !== 'object' || value === null) return value;
      // Skip potential circular refs or DOM nodes
      if (typeof value === 'function') return '[Function]';
      return value;
    }, 2);
    if (str && str !== '{}' && str !== 'null') return str;
  } catch {}
  // Last resort
  return String(err) || 'Erreur inconnue';
}

// Validate and sanitize admin settings to prevent 400 errors
function sanitizeAdminSettings(admin: AdminGlobalSettings): AdminGlobalSettings {
  const defaults = DEFAULT_ADMIN_SETTINGS;
  const clamp = (val: any, min: number, max: number, fallback: number): number => {
    const n = typeof val === 'string' ? parseFloat(val) : Number(val);
    if (isNaN(n) || !isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  };
  const validStr = (val: any, fallback: string): string => {
    if (typeof val === 'string' && val.trim().length > 0) return val.trim();
    return fallback;
  };

  // Validate keywords — Vapi requires format 'word' or 'word:number' (NO spaces, NO hyphens)
  let keywords = defaults.keywords;
  if (Array.isArray(admin.keywords)) {
    const raw = admin.keywords.filter((k: any) => typeof k === 'string' && k.trim().length > 0);
    const expanded: string[] = [];
    for (const kw of raw) {
      const trimmed = kw.trim();
      // Extract boost if present (e.g. "courte durée:3" → boost=":3")
      const colonIdx = trimmed.lastIndexOf(':');
      let wordPart: string;
      let boost = '';
      if (colonIdx > 0 && /^\d+(\.\d+)?$/.test(trimmed.slice(colonIdx + 1))) {
        wordPart = trimmed.slice(0, colonIdx);
        boost = trimmed.slice(colonIdx);
      } else {
        wordPart = trimmed;
      }
      // Remove hyphens (check-in → checkin) and split spaces into separate keywords
      const cleaned = wordPart.replace(/-/g, '');
      for (const w of cleaned.split(/\s+/)) {
        if (w.length > 0) expanded.push(w + boost);
      }
    }
    keywords = expanded.length > 0 ? expanded : defaults.keywords;
  }

  return {
    ...admin,
    deepgramModel: validStr(admin.deepgramModel, defaults.deepgramModel),
    deepgramLanguage: validStr(admin.deepgramLanguage, defaults.deepgramLanguage),
    keywords,
    voiceStability: clamp(admin.voiceStability, 0, 1, defaults.voiceStability),
    voiceSimilarityBoost: clamp(admin.voiceSimilarityBoost, 0, 1, defaults.voiceSimilarityBoost),
    temperature: clamp(admin.temperature, 0, 2, defaults.temperature),
    maxTokens: clamp(admin.maxTokens, 50, 4096, defaults.maxTokens),
  };
}

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
  const callProfileRef = useRef<{ id: string; name: string } | null>(null);
  const callModelRef = useRef<string>('');
  const callStartTimeRef = useRef<string>('');

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

        // Log transcript to backend
        const durationMs = Date.now() - new Date(callStartTimeRef.current).getTime();
        setTranscript((currentTranscript) => {
          // Use callback to get latest transcript state
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
          return currentTranscript; // Don't modify state
        });
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
          const isFinal = message.transcriptType === 'final';

          if (isFinal) {
            fullTranscriptRef.current += `\n${role === 'assistant' ? 'ASSISTANT' : 'USER'}: ${text}`;
          }

          setTranscript((prev) => {
            const newTranscript = [...prev];
            const lastIdx = newTranscript.length - 1;
            const lastEntry = lastIdx >= 0 ? newTranscript[lastIdx] : null;

            if (isFinal) {
              // FINAL transcript: replace last entry ONLY if it was a partial of the same role
              if (lastEntry && lastEntry.role === role && !lastEntry.isFinal) {
                newTranscript[lastIdx] = { role, text, timestamp: Date.now(), isFinal: true };
              } else {
                // New final from same or different role — always push
                newTranscript.push({ role, text, timestamp: Date.now(), isFinal: true });
              }
            } else {
              // PARTIAL transcript: update live text
              if (lastEntry && lastEntry.role === role && !lastEntry.isFinal) {
                // Update existing partial (live typing effect)
                newTranscript[lastIdx] = { role, text, timestamp: Date.now(), isFinal: false };
              } else {
                // New utterance starting — push new partial entry
                newTranscript.push({ role, text, timestamp: Date.now(), isFinal: false });
              }
            }

            return newTranscript;
          });

          // Track user speaking state
          if (role === 'user') {
            setUserSpeaking(true);
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

      // Listen to progress events for debugging
      vapi.on('call-start-progress', (progress: any) => {
        console.log('Vapi progress:', JSON.stringify(progress));
        if (progress?.status === 'failed') {
          console.error('Vapi stage failed:', progress);
        }
      });

      vapi.on('error', (err: any) => {
        console.error('Vapi error (full):', JSON.stringify(err, null, 2));
        const msg = extractErrorMessage(err);
        // Detect 400 errors (invalid config)
        const statusCode = err?.error?.statusCode || err?.statusCode || err?.code;
        if (statusCode === 400 || msg.includes('400') || msg.includes('Bad Request')) {
          setError(`Erreur 400 Vapi: ${msg.substring(0, 200)}`);
        } else if (msg.includes('pipeline') || msg.includes('provider')) {
          setError(`Erreur provider: ${msg.substring(0, 200)}`);
        } else {
          setError(`Erreur Vapi: ${msg.substring(0, 200)}`);
        }
        setConnecting(false);
        setCallActive(false);
      });

      // Store call metadata for post-call logging
      callProfileRef.current = { id: profile.id, name: profile.name };
      callModelRef.current = settings.model;
      callStartTimeRef.current = new Date().toISOString();
      fullTranscriptRef.current = '';

      // Load admin settings and sanitize them to prevent 400 errors
      const rawAdmin: AdminGlobalSettings = getAdminSettings();
      const admin = sanitizeAdminSettings(rawAdmin);

      // French language enforcement prefix — injected before every system prompt
      const frenchPrefix = `[LANGUE OBLIGATOIRE]
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

`;

      // Build model config based on provider
      const systemPrompt = frenchPrefix + profile.systemPrompt;
      const isAnthropic = settings.model.startsWith('claude');
      const modelConfig = isAnthropic
        ? {
            provider: 'anthropic' as const,
            model: settings.model,
            messages: [{ role: 'system' as const, content: systemPrompt }],
            temperature: admin.temperature,
            maxTokens: admin.maxTokens,
          }
        : {
            provider: 'openai' as const,
            model: settings.model,
            messages: [{ role: 'system' as const, content: systemPrompt }],
            temperature: admin.temperature,
            maxTokens: admin.maxTokens,
          };

      // Build assistant config
      const assistantConfig = {
        name: profile.name,
        firstMessage: profile.firstMessage,
        transcriber: {
          provider: 'deepgram' as const,
          model: admin.deepgramModel,
          language: admin.deepgramLanguage,
          smartFormat: true,
          keywords: admin.keywords,
        },
        model: modelConfig,
        voice: {
          provider: '11labs' as const,
          model: 'eleven_multilingual_v2',
          voiceId: profile.voiceId,
          stability: admin.voiceStability,
          similarityBoost: admin.voiceSimilarityBoost,
          language: 'fr',
        },
        maxDurationSeconds: settings.duration + 120,
        silenceTimeoutSeconds: 30,
        endCallMessage: 'Au revoir et bonne continuation.',
        clientMessages: ['transcript', 'tool-calls', 'hang', 'speech-update'],
      };

      // Log config for debugging (remove sensitive data)
      console.log('Vapi config:', JSON.stringify({
        ...assistantConfig,
        model: { ...assistantConfig.model, messages: '[REDACTED]' },
      }, null, 2));

      // Start the call
      await vapi.start(assistantConfig as any);
    } catch (err: any) {
      console.error('Start call error:', err);
      const rawMsg = extractErrorMessage(err);
      let msg = rawMsg || 'Impossible de démarrer l\'appel';
      // Detect common issues
      if (msg.includes('Permission') || msg.includes('NotAllowed') || msg.includes('getUserMedia')) {
        msg = 'Autorise l\'accès au microphone dans ton navigateur puis réessaie.';
      } else if (msg.includes('NotFound') || msg.includes('DevicesNotFound')) {
        msg = 'Aucun microphone détecté. Branche un micro et réessaie.';
      } else if (msg.includes('401') || msg.includes('Unauthorized')) {
        msg = 'Clé Vapi invalide ou expirée. Vérifie dans ⚙️ Paramètres.';
      } else if (msg.includes('403') || msg.includes('Forbidden')) {
        msg = 'Accès refusé par Vapi. Vérifie tes crédits sur dashboard.vapi.ai.';
      } else if (msg.includes('400') || msg.includes('Bad Request')) {
        msg = 'Configuration rejetée par Vapi (400). Essaie de réinitialiser les paramètres admin.';
      }
      setError(msg);
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
