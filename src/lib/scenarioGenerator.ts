import { Profile, Difficulty, GeneratedScenario } from '@/types';
import { PROFILES } from './profiles';

const DIFFICULTIES: Difficulty[] = ['facile', 'moyen', 'difficile'];

export function generateScenario(difficulty: Difficulty): GeneratedScenario {
  // Pick a random profile
  const profile = PROFILES[Math.floor(Math.random() * PROFILES.length)];

  // Resolve difficulty
  const resolvedDifficulty: Difficulty =
    difficulty === 'aleatoire'
      ? DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)]
      : difficulty;

  // Pick a random contact source
  const sources = [
    'avito_courte_duree',
    'avito_longue_duree',
    'recommandation',
    'prospection_directe',
  ];
  const contactSource = sources[Math.floor(Math.random() * sources.length)];

  const sourceLabels: Record<string, string> = {
    avito_courte_duree: 'Annonce Avito — Courte durée',
    avito_longue_duree: 'Annonce Avito — Longue durée',
    recommandation: 'Recommandation d\'un client',
    prospection_directe: 'Prospection directe',
  };

  return {
    profile,
    difficulty: resolvedDifficulty,
    contactSource,
    sourceLabel: sourceLabels[contactSource] || contactSource,
  };
}
