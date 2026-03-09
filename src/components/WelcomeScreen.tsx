'use client';

import { Profile, Difficulty, SimMode } from '@/types';
import ProfileCard from './ProfileCard';
import MysteryCard from './MysteryCard';
import Link from 'next/link';

interface WelcomeScreenProps {
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
  onOpenSettings: () => void;
  // Simulation mode props
  simMode: SimMode;
  difficulty: Difficulty;
  onModeChange: (mode: SimMode) => void;
  onDifficultyChange: (diff: Difficulty) => void;
  onStartSimulation: () => void;
}

const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: 'facile', label: 'Facile', color: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' },
  { value: 'moyen', label: 'Moyen', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30' },
  { value: 'difficile', label: 'Difficile', color: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30' },
  { value: 'aleatoire', label: '🎲 Aléatoire', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30' },
];

export default function WelcomeScreen({
  profiles,
  onSelectProfile,
  onOpenSettings,
  simMode,
  difficulty,
  onModeChange,
  onDifficultyChange,
  onStartSimulation,
}: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-30 flex items-center justify-between px-6 py-4 rounded-none border-t-0 border-x-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center">
            <span className="text-gold font-bold text-sm">C</span>
          </div>
          <h1 className="text-lg font-bold tracking-wide">
            <span className="text-text-primary">CONCIERGE</span>
            <span className="text-gold">LITE</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="p-2.5 rounded-xl glass hover:bg-white/[0.07] text-text-muted hover:text-gold transition-all"
            title="Administration"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
          </Link>
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl glass hover:bg-white/[0.07] text-text-muted hover:text-gold transition-all"
            title="Configuration"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-text-muted mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-glow" />
            Simulateur vocal IA
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-5 leading-tight tracking-tight">
            Entra&icirc;ne-toi face &agrave; un vrai
            <br />
            <span className="text-gold">propri&eacute;taire IA</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto leading-relaxed">
            {simMode === 'training'
              ? 'Choisis un profil, lance l\u2019appel, et perfectionne ton pitch'
              : 'Prospect inconnu, difficult\u00E9 ajustable \u2014 comme un vrai appel'}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 p-1 glass rounded-2xl mb-8 animate-slide-up">
          <button
            onClick={() => onModeChange('training')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              simMode === 'training'
                ? 'bg-white/[0.1] text-gold shadow-[0_0_12px_rgba(244,200,66,0.1)]'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            &#x1F3AF; Entra&icirc;nement
          </button>
          <button
            onClick={() => onModeChange('simulation')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              simMode === 'simulation'
                ? 'bg-white/[0.1] text-gold shadow-[0_0_12px_rgba(244,200,66,0.1)]'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            &#x1F3B2; Simulation
          </button>
        </div>

        {/* Training mode: profile grid */}
        {simMode === 'training' && (
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5 px-4">
            {profiles.map((profile, i) => (
              <div key={profile.id} style={{ animationDelay: `${i * 100}ms` }} className="animate-slide-up">
                <ProfileCard profile={profile} onSelect={onSelectProfile} />
              </div>
            ))}
          </div>
        )}

        {/* Simulation mode: difficulty selector + mystery card */}
        {simMode === 'simulation' && (
          <div className="w-full max-w-lg animate-slide-up">
            {/* Difficulty selector */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => onDifficultyChange(d.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                    difficulty === d.value
                      ? d.color + ' shadow-sm'
                      : 'glass text-text-muted hover:text-text-primary border-transparent'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Mystery card */}
            <MysteryCard
              difficulty={difficulty}
              onStart={onStartSimulation}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-text-muted/40">
        ConciergElite Maroc &middot; Roleplay Trainer &middot; v6.0
      </footer>
    </div>
  );
}
