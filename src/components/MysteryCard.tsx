'use client';

import { Difficulty } from '@/types';
import Avatar from './Avatar';

interface MysteryCardProps {
  difficulty: Difficulty;
  onStart: () => void;
}

const DIFFICULTY_STYLES: Record<Exclude<Difficulty, 'aleatoire'>, { label: string; color: string; bg: string }> = {
  facile: { label: '🟢 Facile', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  moyen: { label: '🟠 Moyen', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
  difficile: { label: '🔴 Difficile', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
};

export default function MysteryCard({ difficulty, onStart }: MysteryCardProps) {
  const resolvedDiff = difficulty === 'aleatoire' ? null : difficulty;

  return (
    <div className="glass rounded-3xl p-8 max-w-md mx-auto text-center">
      {/* Mystery avatar */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <Avatar profileId="mystery" size={130} />
          {/* Pulse glow ring */}
          <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-pulse" />
        </div>
      </div>

      {/* Context */}
      <h3 className="text-xl font-bold text-text-primary mb-2">Prospect inconnu</h3>
      <p className="text-sm text-text-muted leading-relaxed mb-5">
        Un propri&eacute;taire marocain va d&eacute;crocher. Tu ne sais rien de lui.
        <br />
        Comme un vrai appel de prospection.
      </p>

      {/* Difficulty badge */}
      <div className="flex justify-center mb-6">
        {resolvedDiff ? (
          <span className={`text-xs px-4 py-1.5 rounded-full border ${DIFFICULTY_STYLES[resolvedDiff].bg} ${DIFFICULTY_STYLES[resolvedDiff].color}`}>
            {DIFFICULTY_STYLES[resolvedDiff].label}
          </span>
        ) : (
          <span className="text-xs px-4 py-1.5 rounded-full border bg-purple-400/10 border-purple-400/20 text-purple-400">
            🎲 Al&eacute;atoire
          </span>
        )}
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="w-full px-6 py-4 rounded-2xl bg-gold hover:bg-gold-light text-bg
                   font-bold transition-all text-sm
                   shadow-[0_0_30px_rgba(244,200,66,0.15)] hover:shadow-[0_0_40px_rgba(244,200,66,0.25)]"
      >
        &#x1F3AF; Lancer la simulation
      </button>

    </div>
  );
}
