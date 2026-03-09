'use client';

import { useEffect, useRef, useState } from 'react';
import { Profile, TranscriptEntry } from '@/types';
import Avatar from './Avatar';

interface CallScreenProps {
  profile: Profile;
  timeLeft: number;
  maxDuration: number;
  isSpeaking: boolean;
  userSpeaking: boolean;
  inputVolume: number;
  transcript: TranscriptEntry[];
  connecting: boolean;
  onHangUp: () => void;
}

export default function CallScreen({
  profile,
  timeLeft,
  maxDuration,
  isSpeaking,
  userSpeaking,
  inputVolume,
  transcript,
  connecting,
  onHangUp,
}: CallScreenProps) {
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [formattedTime, setFormattedTime] = useState('');

  // Format timer
  useEffect(() => {
    const mins = Math.floor(Math.max(0, timeLeft) / 60);
    const secs = Math.max(0, timeLeft) % 60;
    setFormattedTime(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
  }, [timeLeft]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const isWarning = timeLeft <= 180 && timeLeft > 60;
  const isCritical = timeLeft <= 60;

  // Derive "user is actively speaking" from real-time mic volume
  const micActive = inputVolume > 0.05;

  const statusLabel = isSpeaking
    ? 'Propri\u00e9taire parle...'
    : micActive || userSpeaking
      ? 'Tu parles...'
      : '\u00c0 ton tour...';

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Connecting overlay */}
      {connecting && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-bg/90 backdrop-blur-md">
          <div className="w-14 h-14 border-2 border-gold/20 border-t-gold rounded-full animate-spin mb-5" />
          <p className="text-gold font-medium text-lg">Connexion avec {profile.name}...</p>
          <p className="text-text-muted text-sm mt-1">Pr&eacute;paration de l&apos;appel</p>
        </div>
      )}

      {/* Status bar */}
      <div className="glass flex items-center justify-between px-6 py-3 rounded-none border-t-0 border-x-0">
        <div className="flex items-center gap-3">
          <Avatar profileId={profile.id} size={36} />
          <div>
            <p className="text-sm font-medium text-text-primary">{profile.name}</p>
            <p className="text-xs text-text-muted">{profile.job}</p>
          </div>
        </div>

        {/* Timer */}
        <div
          className={`
            tabular-nums text-2xl font-bold px-4 py-1.5 rounded-2xl
            ${isCritical ? 'text-red-400 animate-pulse-critical bg-red-400/10 border border-red-400/20' : ''}
            ${isWarning && !isCritical ? 'text-orange-400 bg-orange-400/10 border border-orange-400/20' : ''}
            ${!isWarning && !isCritical ? 'text-text-primary glass' : ''}
          `}
        >
          {formattedTime}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-5">
        {/* Avatar with pulse */}
        <div className="relative">
          <div
            className={`
              w-28 h-28 rounded-full flex items-center justify-center
              transition-all duration-300
              ${isSpeaking ? 'animate-pulse-gold shadow-[0_0_50px_rgba(244,200,66,0.15)]' : ''}
              ${micActive || userSpeaking ? 'animate-pulse-blue shadow-[0_0_50px_rgba(74,144,217,0.15)]' : ''}
            `}
          >
            <Avatar profileId={profile.id} size={112} />
          </div>
          {/* Status dot */}
          <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-bg transition-colors duration-150
            ${isSpeaking ? 'bg-gold' : micActive || userSpeaking ? 'bg-emerald-400' : 'bg-text-muted/30'}
          `} />
        </div>

        {/* Status */}
        <p
          className={`text-sm font-medium transition-colors duration-150 ${
            isSpeaking ? 'text-gold' : micActive || userSpeaking ? 'text-emerald-400' : 'text-text-muted/60'
          }`}
        >
          {statusLabel}
        </p>

        {/* Transcript */}
        <div
          ref={transcriptRef}
          className="w-full max-w-2xl flex-1 max-h-[300px] overflow-y-auto glass rounded-3xl p-5 space-y-3"
        >
          {transcript.length === 0 && (
            <p className="text-center text-text-muted/30 text-sm py-8">
              La transcription appara&icirc;tra ici...
            </p>
          )}
          {transcript.map((entry, i) => (
            <div
              key={i}
              className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${
                    entry.role === 'user'
                      ? 'bg-blue-500/10 text-blue-200/90 border border-blue-500/15'
                      : 'bg-gold/[0.08] text-gold/85 border border-gold/15'
                  }
                `}
              >
                {entry.text}
              </div>
            </div>
          ))}
        </div>

        {/* Mic indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`
              relative w-12 h-12 rounded-full flex items-center justify-center
              transition-all duration-150
              ${micActive
                ? 'bg-emerald-400/15 border border-emerald-400/40 shadow-[0_0_20px_rgba(52,211,153,0.25)]'
                : 'bg-white/[0.04] border border-white/10'}
            `}
          >
            {/* Pulsing ring when speaking */}
            {micActive && (
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping" />
            )}
            {/* Mic SVG */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-colors duration-150 ${micActive ? 'text-emerald-400' : 'text-text-muted/40'}`}
            >
              <path
                d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z"
                fill="currentColor"
              />
              <path
                d="M19 10v2a7 7 0 0 1-14 0v-2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 19v4m-4 0h8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Volume bars */}
          <div className="flex items-end gap-0.5 h-6">
            {[0.08, 0.15, 0.25, 0.4, 0.6].map((threshold, i) => (
              <div
                key={i}
                className={`
                  w-1 rounded-full transition-all duration-75
                  ${inputVolume > threshold
                    ? 'bg-emerald-400'
                    : 'bg-white/10'}
                `}
                style={{ height: `${8 + i * 4}px` }}
              />
            ))}
          </div>
        </div>

        {/* Hang up */}
        <button
          onClick={onHangUp}
          className="px-10 py-3.5 bg-red-500/90 hover:bg-red-500 text-white font-semibold rounded-full
                     transition-all text-sm shadow-[0_0_30px_rgba(239,68,68,0.2)]
                     hover:shadow-[0_0_40px_rgba(239,68,68,0.3)]"
        >
          &#x1F4DE; Raccrocher
        </button>
      </div>
    </div>
  );
}
