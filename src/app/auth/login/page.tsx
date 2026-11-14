'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Music, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!isSupabaseConfigured) {
      // Supabase n'est pas encore configuré avec les clés réelles :
      // On autorise la session locale démo sans bloquer l'expérience utilisateur
      setTimeout(() => {
        setIsLoading(false);
        router.push('/dashboard');
      }, 600);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch {
      setErrorMessage('Une erreur est survenue lors de la tentative de connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900/60 border border-white/10 p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-bold shadow-md shadow-amber-500/20">
              <Music className="h-5 w-5 text-black" />
            </div>
            <span className="font-black text-xl text-white tracking-wider">
              MUSIKA <span className="text-amber-500">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white">{t.auth.loginTitle}</h1>
          <p className="text-xs text-zinc-400 mt-1">{t.auth.loginSubtitle}</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!isSupabaseConfigured && (
          <div className="mb-6 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-300/90 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Mode Studio Démo actif (clés Supabase prêtes dans .env.example)</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              {t.auth.emailLabel}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full rounded-xl bg-black/40 border border-white/10 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              {t.auth.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-black/40 border border-white/10 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLoading ? 'Connexion en cours...' : t.auth.submitLogin}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          <Link
            href="/auth/register"
            className="hover:text-amber-400 transition-colors"
          >
            {t.auth.noAccount}
          </Link>
        </div>
      </div>
    </div>
  );
}

