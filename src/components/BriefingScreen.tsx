'use client';

import { Profile } from '@/types';

interface BriefingScreenProps {
  profile: Profile;
  onBack: () => void;
  onStartCall: () => void;
  hasApiKey: boolean;
}

export default function BriefingScreen({ profile, onBack, onStartCall, hasApiKey }: BriefingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <h1 className="font-display text-xl tracking-wider text-gold">CONCIERGÉLITE</h1>
        <span className="text-sm text-text-muted">Briefing</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full animate-slide-up">
          {/* Profile header */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-6">
            <div className="flex items-start gap-5 mb-6">
              <div className="text-6xl">{profile.icon}</div>
              <div>
                <h2 className="font-display text-2xl text-text-primary">
                  {profile.name}, {profile.age} ans
                </h2>
                <p className="text-text-muted mt-1">{profile.job} — {profile.city}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-surface text-gold/80 border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Context */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gold/80 uppercase tracking-wide mb-2">
                Contexte
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">{profile.context}</p>
            </div>

            {/* Personality */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gold/80 uppercase tracking-wide mb-2">
                Personnalité
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">{profile.personality}</p>
            </div>

            {/* First message */}
            <div>
              <h3 className="text-sm font-semibold text-gold/80 uppercase tracking-wide mb-2">
                Première réplique
              </h3>
              <p className="text-sm text-text-primary italic bg-surface rounded-lg px-4 py-3 border border-border">
                &ldquo;{profile.firstMessage}&rdquo;
              </p>
            </div>
          </div>

          {/* Advice box */}
          <div className="bg-surface border border-gold/20 rounded-xl px-6 py-4 mb-8">
            <p className="text-sm text-gold/90 leading-relaxed">
              <span className="font-semibold">Ton rôle :</span> Tu es un commercial ConciergÉlite
              qui appelle ce propriétaire pour lui proposer de passer son bien en gestion courte durée.
              Écoute, rassure, et convaincs-le avec des arguments solides.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3.5 rounded-lg border border-border text-text-muted
                         hover:border-text-muted/50 hover:text-text-primary transition-all text-sm font-medium"
            >
              ← Changer de profil
            </button>
            <button
              onClick={onStartCall}
              disabled={!hasApiKey}
              className="flex-1 px-6 py-3.5 rounded-lg bg-gold hover:bg-gold-light text-bg
                         font-semibold transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              📞 Lancer l&apos;appel
            </button>
          </div>

          {!hasApiKey && (
            <p className="text-xs text-center text-red-400/80 mt-3">
              Configure ta clé Vapi dans les paramètres avant de lancer un appel.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
