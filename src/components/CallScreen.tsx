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

  const statusLabel = isSpeaking
    ? 'Propri\u00e9taire parle...'
    : userSpeaking
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
              ${userSpeaking ? 'animate-pulse-blue shadow-[0_0_50px_rgba(74,144,217,0.15)]' : ''}
            `}
          >
            <Avatar profileId={profile.id} size={112} />
          </div>
          {/* Status dot */}
          <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-bg
            ${isSpeaking ? 'bg-gold' : userSpeaking ? 'bg-blue-400' : 'bg-text-muted/30'}
          `} />
        </div>

        {/* Status */}
        <p
          className={`text-sm font-medium ${
            isSpeaking ? 'text-gold' : userSpeaking ? 'text-blue-400' : 'text-text-muted/60'
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
