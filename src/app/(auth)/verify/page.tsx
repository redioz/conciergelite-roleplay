'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    const supabase = createClient();
    await supabase.auth.resend({ type: 'signup', email });
    setResending(false);
    setResent(true);
  };

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">V&eacute;rifie ton email</h2>
        <p className="text-sm text-text-muted">
          On a envoy&eacute; un lien de confirmation &agrave;
        </p>
        {email && <p className="text-sm text-gold font-medium mt-1">{email}</p>}
      </div>

      <p className="text-xs text-text-muted">
        Clique sur le lien dans l&apos;email pour activer ton compte.
        <br />
        V&eacute;rifie aussi tes spams.
      </p>

      <div className="space-y-3 pt-2">
        <button
          onClick={handleResend}
          disabled={resending || resent || !email}
          className="w-full py-3 glass rounded-xl text-sm text-text-muted hover:text-text-primary transition-all disabled:opacity-50"
        >
          {resent ? 'Email renvoy\u00e9 !' : resending ? 'Envoi...' : 'Renvoyer l\u2019email'}
        </button>

        <Link
          href="/login"
          className="block w-full py-3 bg-gold text-bg font-semibold rounded-xl text-center hover:bg-gold/90 transition-all"
        >
          Retour &agrave; la connexion
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-gold/20 border-t-gold animate-spin" /></div>}>
      <VerifyContent />
    </Suspense>
  );
}
