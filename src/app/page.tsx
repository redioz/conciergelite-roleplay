'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppScreen, Profile, Settings, ScoringResult, Difficulty, SimMode, GeneratedScenario } from '@/types';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { getAdminSettings, getMergedProfiles } from '@/lib/adminStore';
import { generateScenario } from '@/lib/scenarioGenerator';
import { useElevenLabs } from '@/hooks/useElevenLabs';
import WelcomeScreen from '@/components/WelcomeScreen';
import BriefingScreen from '@/components/BriefingScreen';
import CallScreen from '@/components/CallScreen';
import ResultsScreen from '@/components/ResultsScreen';
import SettingsModal from '@/components/SettingsModal';

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [finalScoring, setFinalScoring] = useState<ScoringResult | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Simulation state ──
  const [simMode, setSimMode] = useState<SimMode>('training');
  const [difficulty, setDifficulty] = useState<Difficulty>('moyen');
  const [scenario, setScenario] = useState<GeneratedScenario | null>(null);

  const {
    startCall,
    stopCall,
    connecting,
    callActive,
    isSpeaking,
    userSpeaking,
    inputVolume,
    evaluating,
    transcript,
    scoring,
    error,
  } = useElevenLabs();

  // Version-based cache migration — forces clean state on new deployments
  useEffect(() => {
    const APP_VERSION = '6.0.0-elevenlabs';
    try {
      const storedVersion = localStorage.getItem('app_version');
      if (storedVersion !== APP_VERSION) {
        // New version — clear all old settings to prevent config corruption
        console.log(`[ConciergElite] Upgrade ${storedVersion || 'none'} → ${APP_VERSION}: resetting settings`);
        localStorage.removeItem('admin_global_settings');
        localStorage.removeItem('vapi_public_key');
        localStorage.removeItem('vapi_model');
        localStorage.removeItem('call_duration');
        localStorage.setItem('app_version', APP_VERSION);
      }
    } catch {}

    // Load settings from admin store (single source of truth)
    try {
      const admin = getAdminSettings();
      setSettings({
        model: admin.model || DEFAULT_SETTINGS.model,
        duration: admin.duration || DEFAULT_SETTINGS.duration,
      });
      console.log('[ConciergElite] Settings loaded:', { model: admin.model });
    } catch {}
    // Load merged profiles (defaults + admin overrides)
    setProfiles(getMergedProfiles());
  }, []);

  // Save settings
  const handleSaveSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (callActive && !connecting) {
      setTimeLeft(settings.duration);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up, stop call
            stopCall();
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callActive, connecting, settings.duration, stopCall]);

  // When scoring is ready, show results
  useEffect(() => {
    if (scoring && !callActive) {
      setFinalScoring(scoring);
      setScreen('results');
    }
  }, [scoring, callActive]);

  // When call ends without scoring — wait for AI evaluation or show fallback
  useEffect(() => {
    if (!callActive && !connecting && screen === 'call' && !scoring && !evaluating) {
      // Evaluation finished but no scoring = truly no data (transcript too short)
      const timeout = setTimeout(() => {
        if (!scoring) {
          setFinalScoring({
            total: 0,
            details: [
              { label: 'Découverte & Écoute', value: 0, max: 15, color: '#4CAF50' },
              { label: 'Gestion des Objections', value: 0, max: 15, color: '#4A90D9' },
              { label: 'Connaissance Produit', value: 0, max: 15, color: '#F6A623' },
              { label: 'Proposition de Valeur', value: 0, max: 15, color: '#00BCD4' },
              { label: 'Création de Confiance', value: 0, max: 15, color: '#E53E3E' },
              { label: 'Gestion du Rythme', value: 0, max: 10, color: '#FF9800' },
              { label: 'Closing & Résilience', value: 0, max: 15, color: '#9B59B6' },
            ],
            pointsForts: "L'appel était trop court pour être évalué.",
            axesAmelioration: "Essaie de maintenir l'appel plus longtemps pour avoir assez de matière à évaluer.",
            conseilPrincipal: "Relance le roleplay et tiens au moins 1-2 minutes de conversation.",
          });
          setScreen('results');
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [callActive, connecting, screen, scoring, evaluating]);

  // ── Training mode: profile selection ──
  const handleSelectProfile = useCallback((profile: Profile) => {
    setSelectedProfile(profile);
    setScenario(null);
    setScreen('briefing');
  }, []);

  // ── Simulation mode: generate random scenario ──
  const handleStartSimulation = useCallback(() => {
    const generated = generateScenario(difficulty);
    setScenario(generated);
    setSelectedProfile(generated.profile);
    setScreen('briefing');
  }, [difficulty]);

  // ── Mode & difficulty handlers ──
  const handleModeChange = useCallback((mode: SimMode) => {
    setSimMode(mode);
  }, []);

  const handleDifficultyChange = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
  }, []);

  // Start call
  const handleStartCall = useCallback(async () => {
    if (!selectedProfile) return;
    setScreen('call');
    setFinalScoring(null);
    await startCall(selectedProfile, settings);
  }, [selectedProfile, settings, startCall]);

  // Hang up
  const handleHangUp = useCallback(() => {
    stopCall();
  }, [stopCall]);

  // Navigation
  const handleBack = useCallback(() => {
    setSelectedProfile(null);
    setScenario(null);
    setScreen('welcome');
  }, []);

  const handleNewRoleplay = useCallback(() => {
    setSelectedProfile(null);
    setFinalScoring(null);
    setScenario(null);
    setScreen('welcome');
  }, []);

  const handleRetryProfile = useCallback(() => {
    setFinalScoring(null);
    // In simulation mode, generate a fresh scenario
    if (simMode === 'simulation') {
      const generated = generateScenario(difficulty);
      setScenario(generated);
      setSelectedProfile(generated.profile);
    }
    setScreen('briefing');
  }, [simMode, difficulty]);

  const isSimulation = simMode === 'simulation' && scenario !== null;

  return (
    <main className="min-h-screen bg-bg">
      {/* Error alert */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-up">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-3 backdrop-blur-md flex items-start gap-3">
            <span className="text-red-400 mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="text-sm text-red-300">{error}</p>
            </div>
            <button
              onClick={() => {
                setScreen('welcome');
                setSelectedProfile(null);
                setScenario(null);
              }}
              className="text-red-400/60 hover:text-red-400 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Screens */}
      {screen === 'welcome' && (
        <WelcomeScreen
          profiles={profiles}
          onSelectProfile={handleSelectProfile}
          onOpenSettings={() => setShowSettings(true)}
          simMode={simMode}
          difficulty={difficulty}
          onModeChange={handleModeChange}
          onDifficultyChange={handleDifficultyChange}
          onStartSimulation={handleStartSimulation}
        />
      )}

      {screen === 'briefing' && selectedProfile && (
        <BriefingScreen
          profile={selectedProfile}
          onBack={handleBack}
          onStartCall={handleStartCall}
          isSimulation={isSimulation}
          scenario={scenario ?? undefined}
        />
      )}

      {screen === 'call' && selectedProfile && (
        <CallScreen
          profile={selectedProfile}
          timeLeft={timeLeft}
          maxDuration={settings.duration}
          isSpeaking={isSpeaking}
          userSpeaking={userSpeaking}
          inputVolume={inputVolume}
          transcript={transcript}
          connecting={connecting}
          onHangUp={handleHangUp}
        />
      )}

      {/* Evaluating overlay — shown after call ends while AI scores the transcript */}
      {screen === 'call' && !callActive && evaluating && (
        <div className="fixed inset-0 z-40 bg-bg flex flex-col items-center justify-center gap-6 animate-slide-up">
          <div className="w-16 h-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
          <div className="text-center">
            <p className="text-lg font-semibold text-text-primary mb-2">Évaluation en cours...</p>
            <p className="text-sm text-text-muted">L&apos;IA analyse ta performance</p>
          </div>
        </div>
      )}

      {screen === 'results' && selectedProfile && finalScoring && (
        <ResultsScreen
          profile={selectedProfile}
          scoring={finalScoring}
          onNewRoleplay={handleNewRoleplay}
          onRetryProfile={handleRetryProfile}
          isSimulation={isSimulation}
          scenario={scenario ?? undefined}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </main>
  );
}
