import { Profile, Settings } from '@/types';
import { PROFILES } from './profiles';
import { DEFAULT_SETTINGS } from './constants';

const STORAGE_KEY_PROFILES = 'admin_custom_profiles';
const STORAGE_KEY_SETTINGS = 'admin_global_settings';

export interface AdminGlobalSettings {
  vapiPublicKey: string;
  model: 'gpt-4o' | 'gpt-4o-mini' | 'claude-sonnet-4-20250514' | 'claude-opus-4-20250514';
  duration: number;
  // Deepgram
  deepgramModel: string;
  deepgramLanguage: string;
  keywords: string[];
  // Voice defaults
  voiceStability: number;
  voiceSimilarityBoost: number;
  // LLM
  temperature: number;
  maxTokens: number;
}

export const DEFAULT_ADMIN_SETTINGS: AdminGlobalSettings = {
  vapiPublicKey: DEFAULT_SETTINGS.vapiPublicKey,
  model: DEFAULT_SETTINGS.model as AdminGlobalSettings['model'],
  duration: DEFAULT_SETTINGS.duration,
  deepgramModel: 'nova-2',
  deepgramLanguage: 'multi',
  keywords: [
    'ConciergÉlite:3', 'conciergerie:3', 'Airbnb:3',
    'courte:2', 'durée:2', 'longue:2',
    'Marrakech:2', 'Guéliz:2', 'Tanger:2', 'Casablanca:2',
    'checkin:2', 'checkout:2',
    'occupation:2', 'MAD:2', 'dirhams:2',
    'séjour:2', 'taxe:2', 'rendement:2', 'commission:2',
  ],
  voiceStability: 0.5,
  voiceSimilarityBoost: 0.8,
  temperature: 0.8,
  maxTokens: 800,
};

// ── Profiles ──

export function getCustomProfiles(): Record<string, Partial<Profile>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCustomProfile(id: string, overrides: Partial<Profile>): void {
  const all = getCustomProfiles();
  all[id] = overrides;
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(all));
}

export function resetProfile(id: string): void {
  const all = getCustomProfiles();
  delete all[id];
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(all));
}

export function resetAllProfiles(): void {
  localStorage.removeItem(STORAGE_KEY_PROFILES);
}

/** Get merged profiles: defaults + any custom overrides */
export function getMergedProfiles(): Profile[] {
  const custom = getCustomProfiles();
  return PROFILES.map((p) => {
    const overrides = custom[p.id];
    if (!overrides) return p;
    return { ...p, ...overrides, id: p.id };
  });
}

// ── Global Settings ──

export function getAdminSettings(): AdminGlobalSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      return { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {}
  return { ...DEFAULT_ADMIN_SETTINGS };
}

export function saveAdminSettings(settings: AdminGlobalSettings): void {
  // Sanitize numeric values before saving
  const sanitized: AdminGlobalSettings = {
    ...settings,
    temperature: typeof settings.temperature === 'number' && isFinite(settings.temperature)
      ? settings.temperature : DEFAULT_ADMIN_SETTINGS.temperature,
    maxTokens: typeof settings.maxTokens === 'number' && isFinite(settings.maxTokens)
      ? Math.round(settings.maxTokens) : DEFAULT_ADMIN_SETTINGS.maxTokens,
    voiceStability: typeof settings.voiceStability === 'number' && isFinite(settings.voiceStability)
      ? settings.voiceStability : DEFAULT_ADMIN_SETTINGS.voiceStability,
    voiceSimilarityBoost: typeof settings.voiceSimilarityBoost === 'number' && isFinite(settings.voiceSimilarityBoost)
      ? settings.voiceSimilarityBoost : DEFAULT_ADMIN_SETTINGS.voiceSimilarityBoost,
    duration: typeof settings.duration === 'number' && isFinite(settings.duration)
      ? settings.duration : DEFAULT_ADMIN_SETTINGS.duration,
    keywords: Array.isArray(settings.keywords)
      ? settings.keywords.filter((k) => typeof k === 'string' && k.trim().length > 0)
      : DEFAULT_ADMIN_SETTINGS.keywords,
  };
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(sanitized));
  // Also sync the basic settings keys used by main app
  localStorage.setItem('vapi_public_key', sanitized.vapiPublicKey);
  localStorage.setItem('vapi_model', sanitized.model);
  localStorage.setItem('call_duration', String(sanitized.duration));
}

export function resetAdminSettings(): void {
  localStorage.removeItem(STORAGE_KEY_SETTINGS);
}
