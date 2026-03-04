'use client';

import { useEffect, useState } from 'react';
import { Profile, ScoringResult } from '@/types';
import { getVerdict } from '@/lib/scoring';

interface ResultsScreenProps {
  profile: Profile;
  scoring: ScoringResult;
  onNewRoleplay: () => void;
  onRetryProfile: () => void;
}

export default function ResultsScreen({ profile, scoring, onNewRoleplay, onRetryProfile }: ResultsScreenProps) {
  const verdict = getVerdict(scoring.total);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score counter
  useEffect(() => {
    const target = scoring.total;
    const duration = 1500;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [scoring.total]);

  // SVG circle params
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <h1 className="font-display text-xl tracking-wider text-gold">CONCIERGÉLITE</h1>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span>{profile.icon}</span>
          <span>{profile.name}</span>
        </div>
      </header>

      <div className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto animate-slide-up">
          {/* Score circle */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-40 h-40 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50" cy="50" r={radius}
                  fill="none" stroke="#2A2A45" strokeWidth="6"
                />
                {/* Score arc */}
                <circle
                  cx="50" cy="50" r={radius}
                  fill="none" stroke="#C8A951" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="score-arc"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-text-primary tabular-nums">
                  {animatedScore}
                </span>
                <span className="text-xs text-text-muted">/100</span>
              </div>
            </div>

            {/* Verdict */}
            <div className="text-center">
              <p className="text-2xl mb-1">
                {verdict.emoji} <span className="font-display text-text-primary">{verdict.label}</span>
              </p>
              <p className="text-sm text-text-muted">{verdict.description}</p>
            </div>
          </div>

          {/* Score details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {scoring.details.map((detail) => (
              <div key={detail.label} className="bg-card border border-border rounded-xl px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">{detail.label}</span>
                  <span className="text-sm font-semibold text-text-primary tabular-nums">
                    {detail.value}/{detail.max}
                  </span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${(detail.value / detail.max) * 100}%`,
                      backgroundColor: detail.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Feedback */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8 space-y-5">
            {/* Points forts */}
            <div>
              <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Points forts
              </h3>
              <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                {scoring.pointsForts}
              </p>
            </div>

            {/* Axes d'amélioration */}
            <div>
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                Axes d&apos;amélioration
              </h3>
              <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                {scoring.axesAmelioration}
              </p>
            </div>

            {/* Conseil principal */}
            <div className="bg-surface border border-gold/20 rounded-xl px-5 py-4">
              <h3 className="text-sm font-semibold text-gold uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                Conseil principal
              </h3>
              <p className="text-sm text-gold/80 leading-relaxed">
                {scoring.conseilPrincipal}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pb-8">
            <button
              onClick={onNewRoleplay}
              className="flex-1 px-6 py-3.5 rounded-lg border border-border text-text-muted
                         hover:border-text-muted/50 hover:text-text-primary transition-all text-sm font-medium"
            >
              ← Nouveau roleplay
            </button>
            <button
              onClick={onRetryProfile}
              className="flex-1 px-6 py-3.5 rounded-lg bg-gold hover:bg-gold-light text-bg
                         font-semibold transition-colors text-sm"
            >
              🔄 Refaire ce profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
