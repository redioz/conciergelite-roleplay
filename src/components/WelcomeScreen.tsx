'use client';

import { Profile } from '@/types';
import { PROFILES } from '@/lib/profiles';
import ProfileCard from './ProfileCard';

interface WelcomeScreenProps {
  hasApiKey: boolean;
  onSelectProfile: (profile: Profile) => void;
  onOpenSettings: () => void;
}

export default function WelcomeScreen({ hasApiKey, onSelectProfile, onOpenSettings }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <h1 className="font-display text-xl tracking-wider text-gold">
          CONCIERGÉLITE
        </h1>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-surface border border-border hover:border-gold/30
                     text-text-muted hover:text-gold transition-all"
          title="Configuration"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </header>

      {/* Warning banner */}
      {!hasApiKey && (
        <div className="mx-6 mt-4 px-4 py-3 bg-[#2A1A0A] border border-[#C8A951]/30 rounded-lg flex items-start gap-3">
          <span className="text-gold mt-0.5">⚠️</span>
          <div>
            <p className="text-sm text-gold/90 font-medium">Clé Vapi non configurée</p>
            <p className="text-xs text-text-muted mt-0.5">
              Clique sur ⚙️ pour ajouter ta clé publique Vapi avant de lancer un appel.
            </p>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-text-primary mb-4 leading-tight">
            Entraîne-toi face à un vrai propriétaire IA
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Choisis un profil, lance l&apos;appel, et perfectionne ton pitch
          </p>
        </div>

        {/* Profiles grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {PROFILES.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} onSelect={onSelectProfile} />
          ))}
        </div>
      </div>
    </div>
  );
}
