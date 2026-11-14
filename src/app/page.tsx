'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { usePlayer } from '@/lib/player/context';
import { DEMO_TRACKS } from '@/lib/demo-tracks';
import { MUSIC_GENRES } from '@/lib/genres';
import {
  Sliders,
  Play,
  Pause,
  Disc,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Flame,
  Globe2,
  Volume2,
} from 'lucide-react';

export default function HomePage() {
  const { t, locale } = useLanguage();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  return (
    <div className="relative overflow-hidden">
      {/* Background Studio Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/15 via-orange-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[600px] -left-40 w-[500px] h-[500px] bg-violet-600/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] -right-40 w-[500px] h-[500px] bg-amber-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 text-xs font-semibold text-amber-300 shadow-inner mb-6">
          <Flame className="h-4 w-4 text-amber-400" />
          <span>{t.hero.badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
          {t.hero.headlinePart1}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">
            {t.hero.headlineHighlight}
          </span>{' '}
          {t.hero.headlinePart2}
        </h1>

        <p className="text-lg sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          {t.hero.subheadline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/studio"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-black shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sliders className="h-5 w-5" />
            <span>{t.hero.ctaStudio}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#demo-showcase"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-semibold bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-white/10 transition-all"
          >
            <Disc className="h-5 w-5 text-amber-400" />
            <span>{t.hero.ctaExplore}</span>
          </a>
        </div>

        {/* Hero Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-y border-white/10 py-6 max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">12+</span>
            <span className="text-xs text-zinc-400 mt-0.5">{t.hero.statsGenres}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">0 €</span>
            <span className="text-xs text-zinc-400 mt-0.5">Budget d’amorçage</span>
          </div>
          <div className="col-span-2 md:col-span-1 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">Google Lyria</span>
            <span className="text-xs text-zinc-400 mt-0.5">Architecture intégrable</span>
          </div>
        </div>
      </section>

      {/* 2. DEMO SHOWCASE (Interactive tracks) */}
      <section id="demo-showcase" className="py-16 bg-[#0c0e17] border-y border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Volume2 className="h-4 w-4" />
                <span>Console Sonore Interactive</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Écoutez la couleur de nos styles
              </h2>
            </div>
            <Link
              href="/library"
              className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Voir toute la bibliothèque</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Grid of demo cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEMO_TRACKS.map((track) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;
              return (
                <div
                  key={track.id}
                  className="group relative rounded-2xl bg-zinc-900/60 border border-white/10 p-5 hover:border-amber-500/40 hover:bg-zinc-900/90 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => playTrack(track)}
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                            isThisPlaying
                              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                              : 'bg-zinc-800 text-amber-400 border border-white/10 hover:bg-amber-500 hover:text-black'
                          }`}
                          aria-label={`Écouter ${track.title}`}
                        >
                          {isThisPlaying ? (
                            <Pause className="h-6 w-6 fill-current" />
                          ) : (
                            <Play className="h-6 w-6 fill-current ml-0.5" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-base truncate group-hover:text-amber-300 transition-colors">
                            {track.title}
                          </h3>
                          <p className="text-xs text-zinc-400 truncate">{track.creatorName}</p>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {track.genre}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-2 mb-4 leading-relaxed">
                      {track.prompt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-white/5">
                    <span className="font-mono text-zinc-400">{track.bpm} BPM</span>
                    <span className="capitalize text-zinc-400">{track.mood}</span>
                    <span className="text-amber-400 font-medium">Demo Studio</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 12 GENRES GRID (AFRO & WORLD) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 mb-3">
            <Globe2 className="h-3.5 w-3.5" />
            <span>Spécialisation Africaine & Internationale</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Tous vos genres favoris au bout des doigts
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Chaque style intègre des règles musicales authentiques (signatures rythmiques, instruments typiques, log drums, kora, guitares mandingues, 808).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MUSIC_GENRES.map((g) => (
            <div
              key={g.id}
              className="rounded-xl bg-zinc-900/40 border border-white/10 p-4 hover:border-amber-500/30 hover:bg-zinc-900/70 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-sm">{g.name}</h3>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    {g.defaultBpm} BPM
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                  {locale === 'en' ? g.descriptionEn : g.descriptionFr}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1">
                {g.popularInstruments.slice(0, 2).map((inst, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded"
                  >
                    {inst}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HONEST AI ARCHITECTURE (TRANSPARENCY NOTICE) */}
      <section className="py-16 bg-[#0a0c13] border-y border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-zinc-900 to-[#10131d] border border-amber-500/30 p-8 sm:p-10 shadow-2xl relative">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                  Transparence & Éthique d’Ingénierie
                </span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span className="text-xs text-zinc-400">Google Lyria Ready</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {t.studio.aiEngineNoticeTitle}
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                {t.studio.aiEngineNoticeDesc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Aucune dépense ni abonnement imposé (0 €)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Connecteurs prêts pour Google Lyria & Hugging Face</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Générateur de paroles bilingue et thématique inclus</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Code modulaire TypeScript & Next.js auditable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BOTTOM */}
      <section className="py-20 text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
          Prêt à créer votre prochain hit ?
        </h2>
        <p className="text-zinc-400 text-base max-w-xl mx-auto mb-8">
          Accédez au studio virtuel, configurez vos sonorités africaines ou urbaines et composez en toute liberté.
        </p>
        <Link
          href="/studio"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Sliders className="h-5 w-5" />
          <span>Accéder au Studio Musical</span>
        </Link>
      </section>
    </div>
  );
}
