export interface Profile {
  id: string;
  icon: string;
  name: string;
  age: number;
  job: string;
  city: string;
  context: string;
  personality: string;
  firstMessage: string;
  voiceId: string;
  tags: string[];
  systemPrompt: string;
}

export interface ScoreDetail {
  label: string;
  value: number;
  max: number;
  color: string;
}

export interface ScoringResult {
  total: number;
  details: ScoreDetail[];
  pointsForts: string;
  axesAmelioration: string;
  conseilPrincipal: string;
}

export interface TranscriptEntry {
  role: 'assistant' | 'user';
  text: string;
  timestamp: number;
  isFinal?: boolean;
}

export type AppScreen = 'welcome' | 'briefing' | 'call' | 'results';

export type Difficulty = 'facile' | 'moyen' | 'difficile' | 'aleatoire';
export type SimMode = 'training' | 'simulation';

export interface GeneratedScenario {
  profile: Profile;
  difficulty: Difficulty; // Resolved difficulty (never 'aleatoire')
  contactSource: string; // e.g. "Avito longue durée"
  sourceLabel: string;   // Display label for briefing screen
}

export interface Settings {
  model: 'gpt-4o' | 'gpt-4o-mini' | 'claude-sonnet-4-20250514' | 'claude-opus-4-20250514';
  duration: number;
}
