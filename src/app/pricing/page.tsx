'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import {
  CreditCard,
  Check,
  ShieldCheck,
} from 'lucide-react';

export default function PricingPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 mb-4">
          <CreditCard className="h-4 w-4" />
          <span>Modèle Économique Transparent</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">
          {t.pricing.title}
        </h1>
        <p className="text-base text-zinc-400 leading-relaxed">
          {t.pricing.subtitle}
        </p>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {/* Plan 1: Gratuit 0€ */}
        <div className="relative rounded-3xl bg-zinc-900/60 border-2 border-amber-500/50 p-8 flex flex-col justify-between shadow-xl shadow-amber-500/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-[11px] uppercase tracking-wider">
            {t.pricing.currentPlanBadge}
          </div>

          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">{t.pricing.freeTitle}</h3>
              <p className="text-xs text-zinc-400 mt-1">{t.pricing.freeDescription}</p>
            </div>

            <div className="flex items-baseline gap-1 my-6">
              <span className="text-4xl sm:text-5xl font-black text-white">{t.pricing.freePrice}</span>
              <span className="text-xs text-zinc-400">{t.pricing.freePeriod}</span>
            </div>

            <ul className="space-y-3 text-xs text-zinc-300 mb-8 border-t border-white/5 pt-6">
              {t.pricing.freeFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/studio"
            className="w-full py-3 rounded-xl text-center text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all"
          >
            Utiliser gratuitement
          </Link>
        </div>

        {/* Plan 2: Créateur Pro */}
        <div className="rounded-3xl bg-zinc-900/40 border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">{t.pricing.creatorTitle}</h3>
              <p className="text-xs text-zinc-400 mt-1">{t.pricing.creatorDescription}</p>
            </div>

            <div className="flex items-baseline gap-1 my-6">
              <span className="text-4xl sm:text-5xl font-black text-white">{t.pricing.creatorPrice}</span>
              <span className="text-xs text-zinc-400">{t.pricing.creatorPeriod}</span>
            </div>

            <ul className="space-y-3 text-xs text-zinc-300 mb-8 border-t border-white/5 pt-6">
              {t.pricing.creatorFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => alert('La souscription payante sera activée lors de la phase commerciale ultérieure.')}
            className="w-full py-3 rounded-xl text-center text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 transition-colors"
          >
            {t.pricing.choosePlanBtn}
          </button>
        </div>

        {/* Plan 3: Studio & Label */}
        <div className="rounded-3xl bg-zinc-900/40 border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">{t.pricing.studioTitle}</h3>
              <p className="text-xs text-zinc-400 mt-1">{t.pricing.studioDescription}</p>
            </div>

            <div className="flex items-baseline gap-1 my-6">
              <span className="text-4xl sm:text-5xl font-black text-white">{t.pricing.studioPrice}</span>
              <span className="text-xs text-zinc-400">{t.pricing.studioPeriod}</span>
            </div>

            <ul className="space-y-3 text-xs text-zinc-300 mb-8 border-t border-white/5 pt-6">
              {t.pricing.studioFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => alert('La souscription Label sera activée lors de la phase commerciale.')}
            className="w-full py-3 rounded-xl text-center text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 transition-colors"
          >
            {t.pricing.choosePlanBtn}
          </button>
        </div>
      </div>

      {/* Zero budget security commitment banner */}
      <div className="max-w-4xl mx-auto rounded-2xl bg-zinc-900/80 border border-amber-500/20 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <ShieldCheck className="h-10 w-10 text-amber-400 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Garantie Démarrage 0 €</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {t.pricing.zeroBudgetNotice} Aucune carte de crédit requise. Développé avec des technologies open-source gratuites et le palier gratuit sécurisé de Supabase.
          </p>
        </div>
      </div>
    </div>
  );
}

