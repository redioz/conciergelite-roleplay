'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split('@')[0] },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/verify?email=${encodeURIComponent(email)}`);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-5">
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
        <h2 className="text-2xl font-bold text-text-primary">Cr&eacute;er un compte</h2>
        <p className="text-sm text-text-muted mt-1">Rejoins le simulateur roleplay</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Prénom / Nom"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
        />
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
          placeholder="Mot de passe (min. 6 caractères)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gold text-bg font-semibold rounded-xl hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Création...' : 'Créer mon compte'}
      </button>

      <p className="text-center text-sm text-text-muted">
        D&eacute;j&agrave; un compte ?{' '}
        <Link href="/login" className="text-gold hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
