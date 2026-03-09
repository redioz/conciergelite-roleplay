'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Session {
  id: string;
  profile_name: string;
  score_total: number | null;
  duration_seconds: number | null;
  started_at: string;
  model: string | null;
}

interface UsageData {
  seconds_used: number;
  seconds_remaining: number;
  limit_seconds: number;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const supabase = createClient();

      // Fetch sessions
      const { data: sessionsData } = await supabase
        .from('roleplay_sessions')
        .select('id, profile_name, score_total, duration_seconds, started_at, model')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(50);

      if (sessionsData) setSessions(sessionsData);

      // Fetch usage
      try {
        const res = await fetch('/api/usage');
        if (res.ok) {
          const data = await res.json();
          setUsage(data);
        }
      } catch {}

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const usagePercent = usage ? Math.min(100, (usage.seconds_used / usage.limit_seconds) * 100) : 0;
  const minutesUsed = usage ? Math.floor(usage.seconds_used / 60) : 0;
  const minutesRemaining = usage ? Math.ceil(usage.seconds_remaining / 60) : 60;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-30 flex items-center justify-between px-6 py-4 rounded-none border-t-0 border-x-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center">
              <span className="text-gold font-bold text-sm">C</span>
            </div>
            <h1 className="text-lg font-bold tracking-wide">
              <span className="text-text-primary">CONCIERGE</span>
              <span className="text-gold">LITE</span>
            </h1>
          </Link>
          <span className="text-text-muted/40 text-sm">/ Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted hidden sm:block">{user?.email}</span>
          <button
            onClick={signOut}
            className="px-3 py-1.5 rounded-xl glass text-xs text-text-muted hover:text-red-400 transition-all"
          >
            D&eacute;connexion
          </button>
        </div>
      </header>

      <div className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full space-y-8">
        {/* Usage card */}
        <div className="glass rounded-2xl p-6 animate-slide-up">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Temps d&apos;appel aujourd&apos;hui</h2>
          <div className="flex items-center gap-8">
            {/* Circular gauge */}
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="8"
                />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke={usagePercent > 80 ? '#EF4444' : usagePercent > 50 ? '#F59E0B' : '#F4C842'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${usagePercent * 2.64} 264`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-text-primary">{minutesRemaining}</span>
                <span className="text-[10px] text-text-muted">min restantes</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Utilis&eacute;</span>
                <span className="text-text-primary font-medium">{minutesUsed} min</span>
              </div>
              <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${usagePercent}%`,
                    backgroundColor: usagePercent > 80 ? '#EF4444' : usagePercent > 50 ? '#F59E0B' : '#F4C842',
                  }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Limite quotidienne</span>
                <span className="text-text-primary font-medium">60 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions list */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Historique des sessions</h2>
          {sessions.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-text-muted">Aucune session pour le moment.</p>
              <Link href="/" className="inline-block mt-4 px-5 py-2.5 bg-gold text-bg font-semibold rounded-xl text-sm hover:bg-gold/90 transition-all">
                Lancer un roleplay
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="glass rounded-xl p-4 flex items-center gap-4">
                  {/* Score badge */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    session.score_total !== null && session.score_total >= 70
                      ? 'bg-green-500/10 text-green-400'
                      : session.score_total !== null && session.score_total >= 40
                      ? 'bg-orange-500/10 text-orange-400'
                      : 'bg-white/[0.04] text-text-muted'
                  }`}>
                    <span className="text-lg font-bold">
                      {session.score_total !== null ? session.score_total : '--'}
                    </span>
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{session.profile_name}</p>
                    <p className="text-xs text-text-muted">{formatDate(session.started_at)}</p>
                  </div>
                  {/* Duration */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-text-primary">{formatDuration(session.duration_seconds)}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-wide">dur&eacute;e</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to app */}
        <div className="text-center pt-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Link href="/" className="text-sm text-gold hover:underline">
            &#x2190; Retour au simulateur
          </Link>
        </div>
      </div>
    </div>
  );
}
