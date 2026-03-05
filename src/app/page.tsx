'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppScreen, Profile, Settings, ScoringResult } from '@/types';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { getAdminSettings, getMergedProfiles } from '@/lib/adminStore';
import { useVapi } from '@/hooks/useVapi';
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

  const {
    startCall,
    stopCall,
    connecting,
    callActive,
    isSpeaking,
    userSpeaking,
    transcript,
    scoring,
    error,
  } = useVapi();

  // Version-based cache migration — forces clean state on new deployments
  useEffect(() => {
    const APP_VERSION = '2.2.0-no-hyphens';
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
        vapiPublicKey: admin.vapiPublicKey || DEFAULT_SETTINGS.vapiPublicKey,
        model: admin.model || DEFAULT_SETTINGS.model,
        duration: admin.duration || DEFAULT_SETTINGS.duration,
      });
      console.log('[ConciergElite] Settings loaded:', { model: admin.model, key: admin.vapiPublicKey?.substring(0, 8) + '...' });
    } catch {}
    // Load merged profiles (defaults + admin overrides)
    setProfiles(getMergedProfiles());
  }, []);

  // Save settings
  const handleSaveSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('vapi_public_key', newSettings.vapiPublicKey);
      localStorage.setItem('vapi_model', newSettings.model);
      localStorage.setItem('call_duration', String(newSettings.duration));
    } catch {}
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

  // When scoring is ready from Vapi, show results
  useEffect(() => {
    if (scoring && !callActive) {
      setFinalScoring(scoring);
      setScreen('results');
    }
  }, [scoring, callActive]);

  // When call ends without scoring (user hung up early or no scoring detected)
  useEffect(() => {
    if (!callActive && !connecting && screen === 'call' && !scoring) {
      // Wait a moment for any final transcript processing
      const timeout = setTimeout(() => {
        if (!scoring) {
          // Generate a fallback "no scoring" result
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
            pointsForts: "L'appel s'est terminé avant que l'évaluation ne soit donnée.",
            axesAmelioration: "Essaie de maintenir l'appel plus longtemps pour obtenir une évaluation complète.",
            conseilPrincipal: "Relance le roleplay et laisse l'IA terminer son évaluation avant de raccrocher.",
          });
          setScreen('results');
        }
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [callActive, connecting, screen, scoring]);

  // Profile selection
  const handleSelectProfile = useCallback((profile: Profile) => {
    setSelectedProfile(profile);
    setScreen('briefing');
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
    setScreen('welcome');
  }, []);

  const handleNewRoleplay = useCallback(() => {
    setSelectedProfile(null);
    setFinalScoring(null);
    setScreen('welcome');
  }, []);

  const handleRetryProfile = useCallback(() => {
    setFinalScoring(null);
    setScreen('briefing');
  }, []);

  const hasApiKey = settings.vapiPublicKey.length > 0;

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
          hasApiKey={hasApiKey}
          profiles={profiles}
          onSelectProfile={handleSelectProfile}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {screen === 'briefing' && selectedProfile && (
        <BriefingScreen
          profile={selectedProfile}
          onBack={handleBack}
          onStartCall={handleStartCall}
          hasApiKey={hasApiKey}
        />
      )}

      {screen === 'call' && selectedProfile && (
        <CallScreen
          profile={selectedProfile}
          timeLeft={timeLeft}
          maxDuration={settings.duration}
          isSpeaking={isSpeaking}
          userSpeaking={userSpeaking}
          transcript={transcript}
          connecting={connecting}
          onHangUp={handleHangUp}
        />
      )}

      {screen === 'results' && selectedProfile && finalScoring && (
        <ResultsScreen
          profile={selectedProfile}
          scoring={finalScoring}
          onNewRoleplay={handleNewRoleplay}
          onRetryProfile={handleRetryProfile}
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
