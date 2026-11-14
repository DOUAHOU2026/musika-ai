'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { usePlayer } from '@/lib/player/context';
import { DEMO_TRACKS } from '@/lib/demo-tracks';
import { Track } from '@/types';
import {
  Library,
  Play,
  Pause,
  Search,
  Filter,
  Download,
  Share2,
  Sliders,
  FileText,
  X,
} from 'lucide-react';

export default function LibraryPage() {
  const { t } = useLanguage();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterGenre, setSelectedFilterGenre] = useState<string>('all');
  const [activeLyricsTrack, setActiveLyricsTrack] = useState<Track | null>(null);

  const filteredTracks = DEMO_TRACKS.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedFilterGenre === 'all' || track.genre === selectedFilterGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Library className="h-4 w-4" />
            <span>Gestion des Compositions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{t.library.title}</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">{t.library.subtitle}</p>
        </div>

        <Link
          href="/studio"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:scale-105 transition-all shadow-md shadow-amber-500/20 w-fit"
        >
          <Sliders className="h-4 w-4" />
          <span>{t.library.startCreating}</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-zinc-900/60 border border-white/10 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.library.searchPlaceholder}
            className="w-full rounded-xl bg-black/40 border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-zinc-400 shrink-0" />
          <select
            value={selectedFilterGenre}
            onChange={(e) => setSelectedFilterGenre(e.target.value)}
            className="w-full sm:w-auto rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">{t.library.filterAll}</option>
            <option value="afrobeat">Afrobeat</option>
            <option value="coupe-decale">Coupé-décalé</option>
            <option value="amapiano">Amapiano</option>
            <option value="zouglou">Zouglou</option>
            <option value="rap-ivoirien">Rap ivoirien</option>
            <option value="traditional-african">Traditionnel Africain</option>
          </select>
        </div>
      </div>

      {/* Tracks List */}
      {filteredTracks.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-zinc-900/30 border border-dashed border-white/10">
          <p className="text-sm text-zinc-400 mb-4">{t.library.noTracks}</p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-colors"
          >
            {t.library.startCreating}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTracks.map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;

            return (
              <div
                key={track.id}
                className="group rounded-2xl bg-zinc-900/50 border border-white/10 p-5 hover:border-amber-500/40 hover:bg-zinc-900/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => playTrack(track)}
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
                          isThisPlaying
                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                            : 'bg-zinc-800 text-amber-400 hover:bg-amber-500 hover:text-black border border-white/10'
                        }`}
                        aria-label={`Écouter ${track.title}`}
                      >
                        {isThisPlaying ? (
                          <Pause className="h-5 w-5 fill-current" />
                        ) : (
                          <Play className="h-5 w-5 fill-current ml-0.5" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-sm truncate group-hover:text-amber-300 transition-colors">
                          {track.title}
                        </h3>
                        <p className="text-xs text-zinc-400 truncate">{track.creatorName}</p>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {track.genre}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 line-clamp-2 mb-4 leading-relaxed">
                    {track.prompt}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                    <span>{track.bpm} BPM</span>
                    <span>•</span>
                    <span>{track.durationSeconds}s</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {track.lyrics && (
                      <button
                        onClick={() => setActiveLyricsTrack(track)}
                        title="Voir les paroles"
                        className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      title={t.library.share}
                      onClick={() => alert(`Lien de partage copié pour ${track.title}`)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      title={t.library.download}
                      onClick={() => alert(`Téléchargement de ${track.title} (Fichier libre de droits)`)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lyrics Modal Viewer */}
      {activeLyricsTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl rounded-3xl bg-[#10131d] border border-amber-500/40 p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{activeLyricsTrack.title}</h3>
                <p className="text-xs text-zinc-400">
                  Genre : {activeLyricsTrack.genre} • Paroles de studio
                </p>
              </div>
              <button
                onClick={() => setActiveLyricsTrack(null)}
                className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
              {activeLyricsTrack.lyrics}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

