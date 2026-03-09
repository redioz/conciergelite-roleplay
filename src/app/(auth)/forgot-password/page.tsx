'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Email envoy&eacute;</h2>
          <p className="text-sm text-text-muted">
            Si un compte existe avec <span className="text-gold">{email}</span>,
            tu recevras un lien pour r&eacute;initialiser ton mot de passe.
          </p>
        </div>
        <Link
          href="/login"
          className="block w-full py-3 bg-gold text-bg font-semibold rounded-xl text-center hover:bg-gold/90 transition-all"
        >
          Retour &agrave; la connexion
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleReset} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Mot de passe oubli&eacute;</h2>
        <p className="text-sm text-text-muted mt-1">
          Entre ton email pour recevoir un lien de r&eacute;initialisation
        </p>
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gold text-bg font-semibold rounded-xl hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Envoi...' : 'Envoyer le lien'}
      </button>

      <p className="text-center text-sm text-text-muted">
        <Link href="/login" className="text-gold hover:underline">
          Retour &agrave; la connexion
        </Link>
      </p>
    </form>
  );
}
