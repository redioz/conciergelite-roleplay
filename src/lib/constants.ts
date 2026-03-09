export const SCORE_COLORS = {
  decouverte: '#4CAF50',
  objections: '#4A90D9',
  produit: '#F6A623',
  valeur: '#00BCD4',
  confiance: '#E53E3E',
  rythme: '#FF9800',
  closing: '#9B59B6',
} as const;

export const SCORE_LABELS = [
  { key: 'decouverte', label: 'Découverte & Écoute', color: SCORE_COLORS.decouverte, max: 15 },
  { key: 'objections', label: 'Gestion des Objections', color: SCORE_COLORS.objections, max: 15 },
  { key: 'produit', label: 'Connaissance Produit', color: SCORE_COLORS.produit, max: 15 },
  { key: 'valeur', label: 'Proposition de Valeur', color: SCORE_COLORS.valeur, max: 15 },
  { key: 'confiance', label: 'Création de Confiance', color: SCORE_COLORS.confiance, max: 15 },
  { key: 'rythme', label: 'Gestion du Rythme', color: SCORE_COLORS.rythme, max: 10 },
  { key: 'closing', label: 'Closing & Résilience', color: SCORE_COLORS.closing, max: 15 },
] as const;

export const VERDICTS = [
  { min: 85, emoji: '🏆', label: 'Excellent !', description: 'Tu maîtrises parfaitement ce profil.' },
  { min: 70, emoji: '✅', label: 'Très bien !', description: 'Quelques ajustements et tu seras au top.' },
  { min: 50, emoji: '📈', label: 'En progression', description: "Continue à t'entraîner sur les objections clés." },
  { min: 0, emoji: '💪', label: 'À retravailler', description: 'Revois les réponses aux objections et retente !' },
] as const;

export const DEFAULT_SETTINGS = {
  model: 'claude-sonnet-4-20250514' as const,
  duration: 900, // 15 minutes
};

export const DURATION_OPTIONS = [
  { label: '10 minutes', value: 600 },
  { label: '15 minutes', value: 900 },
  { label: '20 minutes', value: 1200 },
];

export const MODEL_OPTIONS = [
  { label: 'Claude Sonnet 4 (recommandé)', value: 'claude-sonnet-4-20250514' },
  { label: 'Claude Opus 4 (premium)', value: 'claude-opus-4-20250514' },
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-4o Mini (économique)', value: 'gpt-4o-mini' },
];
