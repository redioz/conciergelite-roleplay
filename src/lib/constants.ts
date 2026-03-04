export const SCORE_COLORS = {
  ecoute: '#4CAF50',
  objections: '#4A90D9',
  produit: '#F6A623',
  confiance: '#E53E3E',
  closing: '#9B59B6',
} as const;

export const SCORE_LABELS = [
  { key: 'ecoute', label: 'Écoute Active', color: SCORE_COLORS.ecoute },
  { key: 'objections', label: 'Gestion des Objections', color: SCORE_COLORS.objections },
  { key: 'produit', label: 'Connaissance Produit', color: SCORE_COLORS.produit },
  { key: 'confiance', label: 'Création de Confiance', color: SCORE_COLORS.confiance },
  { key: 'closing', label: 'Technique de Closing', color: SCORE_COLORS.closing },
] as const;

export const VERDICTS = [
  { min: 85, emoji: '🏆', label: 'Excellent !', description: 'Tu maîtrises parfaitement ce profil.' },
  { min: 70, emoji: '✅', label: 'Très bien !', description: 'Quelques ajustements et tu seras au top.' },
  { min: 50, emoji: '📈', label: 'En progression', description: "Continue à t'entraîner sur les objections clés." },
  { min: 0, emoji: '💪', label: 'À retravailler', description: 'Revois les réponses aux objections et retente !' },
] as const;

export const DEFAULT_SETTINGS = {
  vapiPublicKey: 'c120595b-6506-417e-91d5-674632fbc5a8',
  model: 'gpt-4o' as const,
  duration: 900, // 15 minutes
};

export const DURATION_OPTIONS = [
  { label: '10 minutes', value: 600 },
  { label: '15 minutes', value: 900 },
  { label: '20 minutes', value: 1200 },
];

export const MODEL_OPTIONS = [
  { label: 'GPT-4o (recommandé)', value: 'gpt-4o' },
  { label: 'GPT-4o Mini (économique)', value: 'gpt-4o-mini' },
];
