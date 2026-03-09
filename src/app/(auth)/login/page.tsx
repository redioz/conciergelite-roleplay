'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect'
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {/* Tutoriel banner */}
      <a
        href="https://www.loom.com/share/878f07dafd1a46b980c1e86bd571436b"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 w-full px-4 py-3 bg-gold/10 border border-gold/20 rounded-xl hover:bg-gold/15 transition-all group"
      >
        <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6.5 4L12 8L6.5 12V4Z" fill="#F4C842"/>
          </svg>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-gold">Tutoriel</p>
          <p className="text-[11px] text-text-muted">Comment utiliser le simulateur</p>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gold/50 group-hover:text-gold transition-colors flex-shrink-0">
          <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Connexion</h2>
        <p className="text-sm text-text-muted mt-1">Acc&egrave;de au simulateur roleplay</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
        />
      </div>

      <div className="text-right">
        <Link href="/forgot-password" className="text-xs text-gold/70 hover:text-gold transition-colors">
          Mot de passe oubli&eacute; ?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gold text-bg font-semibold rounded-xl hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>

      <p className="text-center text-sm text-text-muted">
        Pas encore de compte ?{' '}
        <Link href="/signup" className="text-gold hover:underline">
          Cr&eacute;er un compte
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-gold/20 border-t-gold animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
