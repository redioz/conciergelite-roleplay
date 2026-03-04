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
}

export type AppScreen = 'welcome' | 'briefing' | 'call' | 'results';

export interface Settings {
  vapiPublicKey: string;
  model: 'gpt-4o' | 'gpt-4o-mini';
  duration: number;
}
