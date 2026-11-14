'use client';

import React from 'react';
import Link from 'next/link';
import { Music, ShieldCheck, Heart, Terminal } from 'lucide-react';

export function Footer() {

  return (
    <footer className="border-t border-white/10 bg-[#090b10] text-zinc-400 pb-28 pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-bold">
                <Music className="h-4 w-4 text-black" />
              </div>
              <span className="font-bold text-white tracking-wide">MUSIKA AI</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Plateforme internationale de production musicale assistée par intelligence artificielle, dédiée aux rythmes africains et contemporains.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md w-fit">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Conception 0 € sans frais cachés</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Studio & Musique
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/studio" className="hover:text-amber-400 transition-colors">
                  Studio Virtuel
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-amber-400 transition-colors">
                  Bibliothèque des Pistes
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-amber-400 transition-colors">
                  Formule Découverte 0 €
                </Link>
              </li>
              <li>
                <span className="text-zinc-500">Google Lyria (Architecture prête)</span>
              </li>
            </ul>
          </div>

          {/* Genres focus */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Genres à l’Honneur
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Afrobeat & Amapiano</li>
              <li>Coupé-décalé & Zouglou</li>
              <li>Rap ivoirien & Drill</li>
              <li>Gospel & Traditionnel Africain</li>
            </ul>
          </div>

          {/* Architecture & Open Source */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Architecture Technique
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Construit avec Next.js App Router, TypeScript, Tailwind CSS et Supabase. Aucun moteur factice.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 bg-zinc-900 border border-white/10 px-2.5 py-1.5 rounded-lg">
              <Terminal className="h-3.5 w-3.5 text-amber-400" />
              <span>Modular Provider Adapter</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center gap-4">
            <p>© 2026 MUSIKA AI. Tous droits réservés.</p>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">
              CGU & Propriété IA
            </Link>
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">
              Confidentialité RGPD
            </Link>
            <Link href="/admin" className="text-amber-500/80 hover:text-amber-400 font-medium transition-colors">
              Console Admin
            </Link>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <span>Créé avec passion pour la culture musicale africaine & mondiale</span>
            <Heart className="h-3 w-3 text-red-500 fill-current inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
