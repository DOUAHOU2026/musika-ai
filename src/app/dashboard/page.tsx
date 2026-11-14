'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { usePlayer } from '@/lib/player/context';
import { DEMO_TRACKS } from '@/lib/demo-tracks';
import {
  LayoutDashboard,
  Music,
  Sparkles,
  Clock,
  Flame,
  ArrowRight,
  Play,
  Pause,
  Database,
  Cpu,
  ShieldCheck,
  Sliders,
} from 'lucide-react';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const stats = [
    {
      label: t.dashboard.statTotalTracks,
      value: '6',
      subtext: 'Prototypes actifs',
      icon: Music,
      color: 'text-amber-400',
    },
    {
      label: t.dashboard.statCredits,
      value: '5 / 5',
      subtext: 'Offre gratuite 0 €',
      icon: Sparkles,
      color: 'text-emerald-400',
    },
    {
      label: t.dashboard.statMinutes,
      value: '16.5',
      subtext: 'Durée totale',
      icon: Clock,
      color: 'text-blue-400',
    },
    {
      label: t.dashboard.statTopGenre,
      value: 'Afrobeat',
      subtext: '104 BPM moyen',
      icon: Flame,
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Title & CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <LayoutDashboard className="h-4 w-4" />
            <span>Vue d’Ensemble Artiste</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{t.dashboard.title}</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">{t.dashboard.subtitle}</p>
        </div>

        <Link
          href="/studio"
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:scale-105 transition-all shadow-md shadow-amber-500/25 w-fit"
        >
          <Sliders className="h-4 w-4" />
          <span>{t.dashboard.quickStudio}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-2xl bg-zinc-900/50 border border-white/10 p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-zinc-400 font-medium">{stat.label}</p>
                <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{stat.subtext}</p>
              </div>
              <div className={`p-3 rounded-xl bg-zinc-800/80 border border-white/5 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle section: Recent activity + Infrastructure Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent sessions (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-zinc-900/50 border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Music className="h-4 w-4 text-amber-400" />
              <span>{t.dashboard.recentActivity}</span>
            </h2>
            <Link
              href="/library"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Voir tout
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_TRACKS.slice(0, 4).map((track) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;
              return (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 hover:border-amber-500/20 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => playTrack(track)}
                      className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center transition-all ${
                        isThisPlaying
                          ? 'bg-amber-500 text-black'
                          : 'bg-zinc-800 text-amber-400 hover:bg-amber-500 hover:text-black'
                      }`}
                    >
                      {isThisPlaying ? (
                        <Pause className="h-4 w-4 fill-current" />
                      ) : (
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{track.title}</p>
                      <p className="text-[11px] text-zinc-400">{track.genre} • {track.bpm} BPM</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-zinc-500 font-mono">
                    {track.durationSeconds}s
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Infrastructure & Services Status (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-zinc-900/50 border border-white/10 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
            <Cpu className="h-4 w-4 text-amber-400" />
            <span>{t.dashboard.systemHealth}</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-2 text-zinc-300">
                <Database className="h-4 w-4 text-emerald-400" />
                <span>Supabase Auth & DB</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Prêt (Free Tier)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-2 text-zinc-300">
                <Cpu className="h-4 w-4 text-amber-400" />
                <span>Google Lyria Adapter</span>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                Prêt pour API
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-2 text-zinc-300">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                <span>Budget & Facturation</span>
              </div>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                0 € (100% Gratuit)
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/pricing"
              className="block w-full py-2.5 rounded-xl text-center text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 transition-colors"
            >
              Voir le détail des formules
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

