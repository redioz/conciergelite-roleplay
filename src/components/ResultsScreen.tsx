'use client';

import { useEffect, useState } from 'react';
import { Profile, ScoringResult, GeneratedScenario } from '@/types';
import { getVerdict } from '@/lib/scoring';
import Avatar from './Avatar';

interface ResultsScreenProps {
  profile: Profile;
  scoring: ScoringResult;
  onNewRoleplay: () => void;
  onRetryProfile: () => void;
  isSimulation?: boolean;
  scenario?: GeneratedScenario;
}

export default function ResultsScreen({
  profile,
  scoring,
  onNewRoleplay,
  onRetryProfile,
  isSimulation = false,
  scenario,
}: ResultsScreenProps) {
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
      <header className="glass sticky top-0 z-30 flex items-center justify-between px-6 py-4 rounded-none border-t-0 border-x-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center">
            <span className="text-gold font-bold text-sm">C</span>
          </div>
          <h1 className="text-lg font-bold tracking-wide">
            <span className="text-text-primary">CONCIERGE</span>
            <span className="text-gold">LITE</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Avatar profileId={isSimulation ? profile.icon : profile.id} size={28} />
          <span className="text-sm text-text-muted">
            {isSimulation ? 'Simulation' : profile.name}
          </span>
        </div>
      </header>

      <div className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto animate-slide-up">
          {/* Score circle */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative w-44 h-44 mb-5">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50" cy="50" r={radius}
                  fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"
                />
                {/* Score arc */}
                <circle
                  cx="50" cy="50" r={radius}
                  fill="none" stroke="#F4C842" strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="score-arc"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(244, 200, 66, 0.3))' }}
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-text-primary tabular-nums">
                  {animatedScore}
                </span>
                <span className="text-xs text-text-muted/50 mt-0.5">/100</span>
              </div>
            </div>

            {/* Verdict */}
            <div className="text-center">
              <p className="text-2xl mb-1.5">
                {verdict.emoji}{' '}
                <span className="font-bold text-text-primary">{verdict.label}</span>
              </p>
              <p className="text-sm text-text-muted">{verdict.description}</p>
            </div>
          </div>

          {/* ── Profile reveal (simulation mode only) ── */}
          {isSimulation && scenario && (
            <div className="glass rounded-3xl p-6 mb-8 animate-slide-up">
              <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(244,200,66,0.5)]" />
                Fiche du prospect
              </h3>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="shrink-0">
                  <Avatar profileId={profile.icon} size={80} />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h4 className="text-lg font-bold text-text-primary mb-1">
                    {profile.name}, {profile.age} ans
                  </h4>
                  <p className="text-sm text-text-muted mb-2">{profile.job} &mdash; {profile.city}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                    {profile.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-white/[0.04] text-gold/80
                                   border border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm text-text-muted">
                    <p><span className="text-gold/70 font-medium">Bien :</span> {profile.context}</p>
                    <p><span className="text-gold/70 font-medium">Personnalit&eacute; :</span> {profile.personality}</p>
                    <p><span className="text-gold/70 font-medium">Source :</span> {scenario.sourceLabel}</p>
                    <p>
                      <span className="text-gold/70 font-medium">Difficult&eacute; :</span>{' '}
                      <DifficultyInline difficulty={scenario.difficulty} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Score details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {scoring.details.map((detail) => (
              <div key={detail.label} className="glass rounded-2xl px-4 py-3.5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs text-text-muted leading-tight">{detail.label}</span>
                  <span className="text-xs font-bold text-text-primary tabular-nums ml-2 whitespace-nowrap">
                    {detail.value}/{detail.max}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${(detail.value / detail.max) * 100}%`,
                      backgroundColor: detail.color,
                      boxShadow: `0 0 8px ${detail.color}40`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Feedback */}
          <div className="glass rounded-3xl p-6 mb-8 space-y-5">
            {/* Points forts */}
            <div>
              <h3 className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
                Points forts
              </h3>
              <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                {scoring.pointsForts}
              </p>
            </div>

            {/* Axes d'amelioration */}
            <div>
              <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.5)]" />
                Axes d&apos;am&eacute;lioration
              </h3>
              <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                {scoring.axesAmelioration}
              </p>
            </div>

            {/* Conseil principal */}
            <div className="glass-gold rounded-2xl px-5 py-4">
              <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(244,200,66,0.5)]" />
                Conseil principal
              </h3>
              <p className="text-sm text-gold/80 leading-relaxed">
                {scoring.conseilPrincipal}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pb-8">
            <button
              onClick={onNewRoleplay}
              className="flex-1 px-6 py-3.5 rounded-2xl glass text-text-muted
                         hover:bg-white/[0.07] hover:text-text-primary transition-all text-sm font-medium"
            >
              &larr; {isSimulation ? 'Nouvelle simulation' : 'Nouveau roleplay'}
            </button>
            <button
              onClick={onRetryProfile}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-gold hover:bg-gold-light text-bg
                         font-semibold transition-all text-sm
                         shadow-[0_0_30px_rgba(244,200,66,0.15)] hover:shadow-[0_0_40px_rgba(244,200,66,0.25)]"
            >
              &#x1F504; {isSimulation ? 'Nouvelle simulation' : 'Refaire ce profil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DifficultyInline({ difficulty }: { difficulty: string }) {
  const labels: Record<string, { emoji: string; label: string; color: string }> = {
    facile: { emoji: '🟢', label: 'Facile', color: 'text-green-400' },
    moyen: { emoji: '🟠', label: 'Moyen', color: 'text-orange-400' },
    difficile: { emoji: '🔴', label: 'Difficile', color: 'text-red-400' },
  };
  const d = labels[difficulty] || labels.moyen;
  return <span className={d.color}>{d.emoji} {d.label}</span>;
}
