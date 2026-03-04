'use client';

import { useEffect, useRef, useState } from 'react';
import { Profile, TranscriptEntry } from '@/types';

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
    ? 'Propriétaire parle...'
    : userSpeaking
      ? 'Tu parles...'
      : 'À ton tour...';

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Connecting overlay */}
      {connecting && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-bg/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
          <p className="text-gold font-display text-lg">Connexion avec {profile.name}...</p>
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-card border-b border-border/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{profile.icon}</span>
          <div>
            <p className="text-sm font-medium text-text-primary">{profile.name}</p>
            <p className="text-xs text-text-muted">{profile.job}</p>
          </div>
        </div>

        {/* Timer */}
        <div
          className={`
            tabular-nums text-2xl font-semibold px-4 py-1.5 rounded-lg
            ${isCritical ? 'text-red-400 animate-pulse-critical bg-red-400/10' : ''}
            ${isWarning && !isCritical ? 'text-orange-400 bg-orange-400/10' : ''}
            ${!isWarning && !isCritical ? 'text-text-primary bg-surface' : ''}
          `}
        >
          {formattedTime}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
        {/* Avatar */}
        <div className="relative">
          <div
            className={`
              w-32 h-32 rounded-full bg-surface border-4 flex items-center justify-center text-5xl
              transition-all duration-300
              ${isSpeaking ? 'border-gold animate-pulse-gold shadow-[0_0_40px_rgba(200,169,81,0.2)]' : ''}
              ${userSpeaking ? 'border-blue-400 animate-pulse-blue shadow-[0_0_40px_rgba(74,144,217,0.2)]' : ''}
              ${!isSpeaking && !userSpeaking ? 'border-border' : ''}
            `}
          >
            {profile.icon}
          </div>
        </div>

        {/* Status */}
        <p
          className={`text-sm font-medium ${
            isSpeaking ? 'text-gold' : userSpeaking ? 'text-blue-400' : 'text-text-muted'
          }`}
        >
          {statusLabel}
        </p>

        {/* Transcript */}
        <div
          ref={transcriptRef}
          className="w-full max-w-2xl flex-1 max-h-[300px] overflow-y-auto bg-card border border-border
                     rounded-xl p-4 space-y-3"
        >
          {transcript.length === 0 && (
            <p className="text-center text-text-muted/50 text-sm py-8">
              La transcription apparaîtra ici...
            </p>
          )}
          {transcript.map((entry, i) => (
            <div
              key={i}
              className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] px-4 py-2 rounded-xl text-sm leading-relaxed
                  ${
                    entry.role === 'user'
                      ? 'bg-blue-500/10 text-blue-200 border border-blue-500/20'
                      : 'bg-gold/10 text-gold/90 border border-gold/20'
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
          className="px-8 py-3.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full
                     transition-colors text-sm shadow-lg shadow-red-500/20"
        >
          📞 Raccrocher
        </button>
      </div>
    </div>
  );
}
