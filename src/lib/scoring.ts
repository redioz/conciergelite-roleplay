import { ScoringResult } from '@/types';
import { SCORE_LABELS } from './constants';

export function parseScoring(fullTranscript: string): ScoringResult | null {
  const text = fullTranscript;

  // Parse individual scores
  const ecouteMatch = text.match(/SCORE\s*[ÉE]COUTE\s*(?:ACTIVE)?\s*:\s*(\d+)/i);
  const objectionsMatch = text.match(/SCORE\s*GESTION\s*(?:DES\s*)?OBJECTIONS?\s*:\s*(\d+)/i);
  const produitMatch = text.match(/SCORE\s*CONNAISSANCE\s*(?:DU\s*)?PRODUIT\s*:\s*(\d+)/i);
  const confianceMatch = text.match(/SCORE\s*CR[ÉE]ATION\s*(?:DE\s*)?CONFIANCE\s*:\s*(\d+)/i);
  const closingMatch = text.match(/SCORE\s*TECHNIQUE\s*(?:DE\s*)?CLOSING\s*:\s*(\d+)/i);
  const totalMatch = text.match(/SCORE\s*TOTAL\s*:\s*(\d+)/i);

  // Parse feedback sections
  const fortsMatch = text.match(/POINTS?\s*FORTS?\s*:(.*?)(?=AXES?|CONSEIL|$)/is);
  const amelMatch = text.match(/AXES?\s*D['']AM[ÉE]LIORATION\s*:(.*?)(?=CONSEIL|$)/is);
  const conseilMatch = text.match(/CONSEIL\s*PRINCIPAL\s*:(.*?)$/is);

  const scores = [
    ecouteMatch ? parseInt(ecouteMatch[1]) : null,
    objectionsMatch ? parseInt(objectionsMatch[1]) : null,
    produitMatch ? parseInt(produitMatch[1]) : null,
    confianceMatch ? parseInt(confianceMatch[1]) : null,
    closingMatch ? parseInt(closingMatch[1]) : null,
  ];

  // Need at least 3 scores to consider valid
  const validScores = scores.filter((s) => s !== null);
  if (validScores.length < 3) return null;

  const details = SCORE_LABELS.map((label, i) => ({
    label: label.label,
    value: scores[i] ?? 0,
    max: 20,
    color: label.color,
  }));

  const total = totalMatch
    ? parseInt(totalMatch[1])
    : details.reduce((sum, d) => sum + d.value, 0);

  return {
    total,
    details,
    pointsForts: cleanFeedback(fortsMatch?.[1] || 'Non disponible'),
    axesAmelioration: cleanFeedback(amelMatch?.[1] || 'Non disponible'),
    conseilPrincipal: cleanFeedback(conseilMatch?.[1] || 'Non disponible'),
  };
}

function cleanFeedback(raw: string): string {
  return raw
    .replace(/^[\s\n-]+/, '')
    .replace(/[\s\n]+$/, '')
    .replace(/\n/g, '\n')
    .trim();
}

export function getVerdict(total: number) {
  if (total >= 85) return { emoji: '🏆', label: 'Excellent !', description: 'Tu maîtrises parfaitement ce profil.' };
  if (total >= 70) return { emoji: '✅', label: 'Très bien !', description: 'Quelques ajustements et tu seras au top.' };
  if (total >= 50) return { emoji: '📈', label: 'En progression', description: "Continue à t'entraîner sur les objections clés." };
  return { emoji: '💪', label: 'À retravailler', description: 'Revois les réponses aux objections et retente !' };
}
