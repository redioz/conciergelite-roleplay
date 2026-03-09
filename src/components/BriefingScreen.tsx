'use client';

import { Profile, GeneratedScenario } from '@/types';
import Avatar from './Avatar';
import { CONTACT_SOURCES } from '@/lib/promptBuilder';

interface BriefingScreenProps {
  profile: Profile;
  onBack: () => void;
  onStartCall: () => void;
  isSimulation?: boolean;
  scenario?: GeneratedScenario;
}

export default function BriefingScreen({
  profile,
  onBack,
  onStartCall,
  isSimulation = false,
  scenario,
}: BriefingScreenProps) {
  // Build context description for simulation mode
  const sourceContext = scenario
    ? CONTACT_SOURCES.find((s) => s.id === scenario.contactSource)?.context || ''
    : '';

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
        <span className="text-xs text-text-muted px-3 py-1.5 rounded-full glass">
          {isSimulation ? 'Simulation' : 'Briefing'}
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full animate-slide-up">
          {/* Profile header card */}
          <div className="glass rounded-3xl p-8 mb-5">
            {isSimulation ? (
              /* ── Simulation mode: limited info ── */
              <div className="text-center mb-8">
                <div className="mb-5 flex justify-center">
                  <Avatar profileId={profile.icon} size={100} />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Prospect inconnu
                </h2>
                <p className="text-sm text-text-muted mb-4">
                  Tu ne connais ni son nom, ni sa situation. D&eacute;couvre-le pendant l&apos;appel.
                </p>

                {/* Difficulty badge */}
                {scenario && (
                  <div className="flex justify-center mb-5">
                    <DifficultyBadge difficulty={scenario.difficulty} />
                  </div>
                )}

                {/* Source context */}
                {sourceContext && (
                  <div className="glass-gold rounded-2xl px-5 py-3.5 text-left">
                    <h3 className="text-xs font-semibold text-gold/70 uppercase tracking-widest mb-2">
                      Contexte
                    </h3>
                    <p className="text-sm text-gold/80 leading-relaxed">
                      {sourceContext}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* ── Training mode: full info ── */
              <>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                  <div className="shrink-0">
                    <Avatar profileId={profile.id} size={100} />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-text-primary mb-1">
                      {profile.name}, {profile.age} ans
                    </h2>
                    <p className="text-text-muted">{profile.job} &mdash; {profile.city}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
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
                  </div>
                </div>

                {/* Info sections */}
                <div className="space-y-5">
                  <InfoSection title="Contexte" text={profile.context} />
                  <InfoSection title="Personnalit&eacute;" text={profile.personality} />

                  {/* First message */}
                  <div>
                    <h3 className="text-xs font-semibold text-gold/70 uppercase tracking-widest mb-2">
                      Premi&egrave;re r&eacute;plique
                    </h3>
                    <p className="text-sm text-text-primary italic glass-gold rounded-2xl px-5 py-3.5">
                      &ldquo;{profile.firstMessage}&rdquo;
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Advice box */}
          <div className="glass-gold rounded-2xl px-6 py-4 mb-8">
            <p className="text-sm text-gold/90 leading-relaxed">
              <span className="font-semibold">Ton r&ocirc;le :</span> Tu g&egrave;res ta propre conciergerie
              (cr&eacute;&eacute;e avec l&apos;accompagnement ConciergElite). Tu appelles ce propri&eacute;taire
              pour lui proposer de passer son bien en gestion courte dur&eacute;e.
              &Eacute;coute, rassure, et convaincs-le avec des arguments solides.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3.5 rounded-2xl glass text-text-muted
                         hover:bg-white/[0.07] hover:text-text-primary transition-all text-sm font-medium"
            >
              &larr; {isSimulation ? 'Retour' : 'Changer de profil'}
            </button>
            <button
              onClick={onStartCall}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-gold hover:bg-gold-light text-bg
                         font-semibold transition-all text-sm
                         shadow-[0_0_30px_rgba(244,200,66,0.15)] hover:shadow-[0_0_40px_rgba(244,200,66,0.25)]"
            >
              &#x1F4DE; {isSimulation ? 'D\u00E9crocher' : 'Lancer l\u2019appel'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function InfoSection({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gold/70 uppercase tracking-widest mb-2">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{text}</p>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    facile: 'bg-green-400/10 border-green-400/20 text-green-400',
    moyen: 'bg-orange-400/10 border-orange-400/20 text-orange-400',
    difficile: 'bg-red-400/10 border-red-400/20 text-red-400',
  };
  const labels: Record<string, string> = {
    facile: '🟢 Facile',
    moyen: '🟠 Moyen',
    difficile: '🔴 Difficile',
  };

  return (
    <span className={`text-xs px-4 py-1.5 rounded-full border ${styles[difficulty] || styles.moyen}`}>
      {labels[difficulty] || difficulty}
    </span>
  );
}
