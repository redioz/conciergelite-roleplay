'use client';

import { useCallback, useEffect, useState } from 'react';
import { Profile } from '@/types';
import { PROFILES } from '@/lib/profiles';
import {
  AdminGlobalSettings,
  DEFAULT_ADMIN_SETTINGS,
  getAdminSettings,
  getCustomProfiles,
  getMergedProfiles,
  resetAdminSettings,
  resetProfile,
  saveAdminSettings,
  saveCustomProfile,
} from '@/lib/adminStore';
import Link from 'next/link';

const ADMIN_CODE = 'Admin123-';

type Tab = 'profiles' | 'settings';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [tab, setTab] = useState<Tab>('profiles');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [globalSettings, setGlobalSettings] = useState<AdminGlobalSettings>(DEFAULT_ADMIN_SETTINGS);
  const [saved, setSaved] = useState(false);

  // Check if already authenticated this session
  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === '1') {
      setAuthenticated(true);
    }
  }, []);

  // Load data
  useEffect(() => {
    if (!authenticated) return;
    setProfiles(getMergedProfiles());
    const s = getAdminSettings();
    setGlobalSettings(s);
  }, [authenticated]);

  // Show save confirmation briefly
  const flashSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  // ── Profile editing ──

  const handleEditProfile = useCallback((profile: Profile) => {
    setEditingId(profile.id);
    setEditForm({ ...profile });
  }, []);

  const handleSaveProfile = useCallback(() => {
    if (!editingId || !editForm) return;
    // Only save fields that differ from default
    const original = PROFILES.find((p) => p.id === editingId);
    if (!original) return;

    const overrides: Partial<Profile> = {};
    const keys: (keyof Profile)[] = [
      'name', 'age', 'job', 'city', 'context', 'personality',
      'firstMessage', 'voiceId', 'systemPrompt', 'icon',
    ];
    for (const key of keys) {
      if (editForm[key] !== undefined && editForm[key] !== original[key]) {
        (overrides as any)[key] = editForm[key];
      }
    }
    // Tags
    if (editForm.tags && JSON.stringify(editForm.tags) !== JSON.stringify(original.tags)) {
      overrides.tags = editForm.tags;
    }

    saveCustomProfile(editingId, overrides);
    setProfiles(getMergedProfiles());
    setEditingId(null);
    flashSaved();
  }, [editingId, editForm, flashSaved]);

  const handleResetProfile = useCallback((id: string) => {
    resetProfile(id);
    setProfiles(getMergedProfiles());
    if (editingId === id) {
      const original = PROFILES.find((p) => p.id === id);
      if (original) setEditForm({ ...original });
    }
    flashSaved();
  }, [editingId, flashSaved]);

  const isModified = useCallback((id: string) => {
    const custom = getCustomProfiles();
    return !!custom[id] && Object.keys(custom[id]).length > 0;
  }, []);

  // ── Global Settings ──

  const handleSaveSettings = useCallback(() => {
    saveAdminSettings(globalSettings);
    flashSaved();
  }, [globalSettings, flashSaved]);

  const handleResetSettings = useCallback(() => {
    resetAdminSettings();
    setGlobalSettings({ ...DEFAULT_ADMIN_SETTINGS });
    flashSaved();
  }, [flashSaved]);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeInput === ADMIN_CODE) {
      setAuthenticated(true);
      sessionStorage.setItem('admin_auth', '1');
      setCodeError(false);
    } else {
      setCodeError(true);
      setCodeInput('');
    }
  };

  // ── Code gate ──
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="glass rounded-2xl p-8 space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4C842" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">Administration</h1>
              <p className="text-sm text-text-muted mt-1">Entre le code d&apos;acc&egrave;s</p>
            </div>
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <input
                type="password"
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value); setCodeError(false); }}
                placeholder="Code admin"
                autoFocus
                className={`w-full bg-bg border rounded-xl px-4 py-3 text-sm text-text-primary text-center tracking-widest placeholder-text-muted focus:outline-none transition-colors ${
                  codeError ? 'border-red-500/50 focus:border-red-500' : 'border-border focus:border-gold/50'
                }`}
              />
              {codeError && (
                <p className="text-xs text-red-400">Code incorrect</p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-gold text-bg font-semibold rounded-xl text-sm hover:bg-gold/90 transition-all"
              >
                Acc&eacute;der
              </button>
            </form>
            <Link href="/" className="text-xs text-text-muted hover:text-gold transition-colors">
              &#x2190; Retour au simulateur
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-text-muted hover:text-gold transition-colors text-sm flex items-center gap-1"
            >
              <span>←</span> Retour
            </Link>
            <div className="w-px h-6 bg-border" />
            <h1 className="text-xl font-bold text-gold">
              Administration
            </h1>
          </div>

          {saved && (
            <span className="text-sm text-green-400 animate-fade-in">
              Sauvegardé
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          <button
            onClick={() => setTab('profiles')}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              tab === 'profiles'
                ? 'bg-surface text-gold border-t border-l border-r border-border'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Profils
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              tab === 'settings'
                ? 'bg-surface text-gold border-t border-l border-r border-border'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Paramètres Globaux
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* ═══════════ PROFILES TAB ═══════════ */}
        {tab === 'profiles' && (
          <div className="space-y-6">
            <p className="text-text-muted text-sm">
              Modifie les profils, instructions système, personnalité et contexte de chaque personnage IA.
            </p>

            {/* Profile cards */}
            {!editingId && (
              <div className="grid gap-4">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="bg-card border border-border rounded-xl p-6 flex items-start gap-5 hover:border-gold/30 transition-colors"
                  >
                    <span className="text-4xl">{profile.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-text-primary">
                          {profile.name}
                        </h3>
                        <span className="text-xs text-text-muted">
                          {profile.age} ans — {profile.job}
                        </span>
                        {isModified(profile.id) && (
                          <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">
                            modifié
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-muted mt-1 line-clamp-2">
                        {profile.context}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {profile.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-surface text-text-muted px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {isModified(profile.id) && (
                        <button
                          onClick={() => handleResetProfile(profile.id)}
                          className="px-3 py-1.5 text-xs text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
                        >
                          Reset
                        </button>
                      )}
                      <button
                        onClick={() => handleEditProfile(profile)}
                        className="px-4 py-1.5 text-sm bg-gold/10 text-gold border border-gold/30 rounded-lg hover:bg-gold/20 transition-colors"
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Profile Editor */}
            {editingId && editForm && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gold flex items-center gap-2">
                    <span>{editForm.icon}</span>
                    Modifier — {editForm.name}
                  </h2>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-text-muted hover:text-text-primary text-sm"
                  >
                    Annuler
                  </button>
                </div>

                {/* Basic Info Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FieldInput
                    label="Nom"
                    value={editForm.name || ''}
                    onChange={(v) => setEditForm({ ...editForm, name: v })}
                  />
                  <FieldInput
                    label="Âge"
                    value={String(editForm.age || '')}
                    onChange={(v) => setEditForm({ ...editForm, age: parseInt(v) || 0 })}
                    type="number"
                  />
                  <FieldInput
                    label="Métier"
                    value={editForm.job || ''}
                    onChange={(v) => setEditForm({ ...editForm, job: v })}
                  />
                  <FieldInput
                    label="Ville"
                    value={editForm.city || ''}
                    onChange={(v) => setEditForm({ ...editForm, city: v })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldInput
                    label="Icône (emoji)"
                    value={editForm.icon || ''}
                    onChange={(v) => setEditForm({ ...editForm, icon: v })}
                  />
                  <FieldInput
                    label="Voice ID (ElevenLabs)"
                    value={editForm.voiceId || ''}
                    onChange={(v) => setEditForm({ ...editForm, voiceId: v })}
                  />
                </div>

                {/* Context */}
                <FieldTextarea
                  label="Contexte (description du profil)"
                  value={editForm.context || ''}
                  onChange={(v) => setEditForm({ ...editForm, context: v })}
                  rows={3}
                />

                {/* Personality */}
                <FieldTextarea
                  label="Personnalité"
                  value={editForm.personality || ''}
                  onChange={(v) => setEditForm({ ...editForm, personality: v })}
                  rows={3}
                />

                {/* First message */}
                <FieldInput
                  label="Premier message (ce que l'IA dit en décrochant)"
                  value={editForm.firstMessage || ''}
                  onChange={(v) => setEditForm({ ...editForm, firstMessage: v })}
                />

                {/* Tags */}
                <FieldInput
                  label="Tags (séparés par des virgules)"
                  value={(editForm.tags || []).join(', ')}
                  onChange={(v) =>
                    setEditForm({
                      ...editForm,
                      tags: v.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                />

                {/* System Prompt — THE BIG ONE */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Instruction Système (System Prompt)
                  </label>
                  <p className="text-xs text-text-muted mb-2">
                    C&apos;est le prompt complet envoyé à GPT-4o. Il définit la personnalité, les objections, le comportement et le format de scoring.
                  </p>
                  <textarea
                    value={editForm.systemPrompt || ''}
                    onChange={(e) => setEditForm({ ...editForm, systemPrompt: e.target.value })}
                    rows={20}
                    className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold/50 resize-y font-mono leading-relaxed"
                    spellCheck={false}
                  />
                  <p className="text-xs text-text-muted mt-1">
                    {(editForm.systemPrompt || '').length} caractères
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2.5 bg-gold text-bg font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-6 py-2.5 border border-border text-text-muted rounded-lg hover:bg-surface transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      const original = PROFILES.find((p) => p.id === editingId);
                      if (original) setEditForm({ ...original });
                    }}
                    className="px-6 py-2.5 border border-border text-text-muted rounded-lg hover:bg-surface transition-colors ml-auto"
                  >
                    Restaurer l&apos;original
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ SETTINGS TAB ═══════════ */}
        {tab === 'settings' && (
          <div className="space-y-8">
            <p className="text-text-muted text-sm">
              Configure les paramètres globaux : modèle IA, voix, durée.
            </p>

            {/* LLM Settings */}
            <Section title="Modèle IA & Appel">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Modèle</label>
                  <select
                    value={globalSettings.model}
                    onChange={(e) =>
                      setGlobalSettings({
                        ...globalSettings,
                        model: e.target.value as AdminGlobalSettings['model'],
                      })
                    }
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold/50"
                  >
                    <option value="claude-sonnet-4-20250514">Claude Sonnet 4 (recommandé)</option>
                    <option value="claude-opus-4-20250514">Claude Opus 4 (premium)</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4o-mini">GPT-4o Mini (économique)</option>
                  </select>
                </div>
                <FieldInput
                  label="Température"
                  value={String(globalSettings.temperature)}
                  onChange={(v) =>
                    setGlobalSettings({ ...globalSettings, temperature: parseFloat(v) || 0.8 })
                  }
                  type="number"
                  placeholder="0.8"
                />
                <FieldInput
                  label="Max Tokens"
                  value={String(globalSettings.maxTokens)}
                  onChange={(v) =>
                    setGlobalSettings({ ...globalSettings, maxTokens: parseInt(v) || 800 })
                  }
                  type="number"
                  placeholder="800"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Durée d&apos;appel</label>
                  <select
                    value={globalSettings.duration}
                    onChange={(e) =>
                      setGlobalSettings({ ...globalSettings, duration: parseInt(e.target.value) })
                    }
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold/50"
                  >
                    <option value={600}>10 minutes</option>
                    <option value={900}>15 minutes</option>
                    <option value={1200}>20 minutes</option>
                  </select>
                </div>
              </div>
            </Section>

            {/* Voice */}
            <Section title="Voix (ElevenLabs)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Stabilité ({globalSettings.voiceStability})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={globalSettings.voiceStability}
                    onChange={(e) =>
                      setGlobalSettings({
                        ...globalSettings,
                        voiceStability: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-gold"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Bas = plus expressif. Haut = plus stable.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Similarity Boost ({globalSettings.voiceSimilarityBoost})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={globalSettings.voiceSimilarityBoost}
                    onChange={(e) =>
                      setGlobalSettings({
                        ...globalSettings,
                        voiceSimilarityBoost: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-gold"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Haut = voix plus fidèle au modèle original.
                  </p>
                </div>
              </div>
            </Section>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2.5 bg-gold text-bg font-semibold rounded-lg hover:bg-gold/90 transition-colors"
              >
                Sauvegarder les paramètres
              </button>
              <button
                onClick={handleResetSettings}
                className="px-6 py-2.5 border border-red-400/30 text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
              >
                Réinitialiser tout
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ── Reusable form components ──

function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold/50"
      />
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold/50 resize-y"
      />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h3 className="text-base font-semibold text-gold">{title}</h3>
      {children}
    </div>
  );
}
