'use client';

import React, { useState } from 'react';
import { usePlayer } from '@/lib/player/context';
import { useLanguage } from '@/lib/i18n/context';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Disc,
  Mic2,
  FileText,
  X,
} from 'lucide-react';

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function GlobalAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    currentLyricLine,
    togglePlay,
    seek,
    setVolume,
  } = usePlayer();
  const { t } = useLanguage();
  const [showFullLyrics, setShowFullLyrics] = useState(false);

  if (!currentTrack) {
    return null;
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasLyrics = Boolean(currentTrack.lyrics && !currentTrack.isInstrumental && currentTrack.vocalGender !== 'none');

  return (
    <>
      {/* Modal complet des paroles si activé */}
      {showFullLyrics && currentTrack.lyrics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl rounded-3xl bg-[#10131d] border border-amber-500/50 p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Mic2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{currentTrack.title}</h3>
                  <p className="text-xs text-zinc-400">
                    Voix {currentTrack.vocalGender === 'female' ? 'Féminine' : 'Masculine'} • {currentTrack.genre}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFullLyrics(false)}
                className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <pre className="font-mono text-xs text-zinc-200 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed bg-black/50 p-4 rounded-xl border border-white/5">
              {currentTrack.lyrics}
            </pre>
          </div>
        </div>
      )}

      {/* Lecteur docké persistant */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0d0f18]/95 backdrop-blur-xl shadow-2xl">
        {/* Bandeau Karaoké Vocal en direct (si des paroles sont chantées) */}
        {hasLyrics && (
          <div className="w-full bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-300 truncate max-w-2xl mx-auto text-center justify-center">
              <Mic2 className="h-3.5 w-3.5 text-amber-400 animate-pulse shrink-0" />
              <span className="font-semibold truncate">
                {currentLyricLine ? (
                  <span className="text-amber-200">« {currentLyricLine} »</span>
                ) : (
                  <span className="text-zinc-400 italic">Prélude instrumental... La voix arrive en mesure 2</span>
                )}
              </span>
            </div>
            <button
              onClick={() => setShowFullLyrics(true)}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium shrink-0 ml-2"
            >
              Voir tout le texte
            </button>
          </div>
        )}

        {/* Top progress bar for quick seek */}
        <div
          className="group relative h-1.5 w-full bg-zinc-800 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            seek(clickPos * duration);
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 transition-all duration-150"
            style={{ width: `${progressPercentage}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 shadow-md transition-opacity"
            style={{ left: `calc(${progressPercentage}% - 7px)` }}
          />
        </div>

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 w-1/4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 shadow-inner overflow-hidden">
              <Disc className={`h-6 w-6 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="truncate text-sm font-semibold text-white">
                {currentTrack.title}
              </span>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="truncate">{currentTrack.creatorName}</span>
                <span className="inline-block h-1 w-1 rounded-full bg-zinc-600" />
                <span className="text-[10px] uppercase font-bold text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  {currentTrack.genre}
                </span>
                <span className="hidden sm:inline text-zinc-500">{currentTrack.bpm} BPM</span>
              </div>
            </div>
          </div>

          {/* Center Controls & Mini Visualizer */}
          <div className="flex flex-col items-center justify-center gap-1.5 flex-1 max-w-md">
            <div className="flex items-center gap-4">
              {/* Visualizer bars */}
              <div className="hidden sm:flex items-center gap-0.5 h-4">
                {[40, 75, 50, 90, 60, 100, 45, 80].map((h, i) => (
                  <span
                    key={i}
                    className="w-0.5 rounded-full bg-amber-500/60 transition-all duration-300"
                    style={{
                      height: isPlaying ? `${Math.max(20, (h * Math.sin(currentTime + i) + 100) / 2)}%` : '20%',
                    }}
                  />
                ))}
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
                aria-label={isPlaying ? t.player.pauseTrack : t.player.playTrack}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current text-black" />
                ) : (
                  <Play className="h-5 w-5 fill-current text-black ml-0.5" />
                )}
              </button>

              <div className="hidden sm:flex items-center gap-0.5 h-4">
                {[80, 45, 100, 60, 90, 50, 75, 40].map((h, i) => (
                  <span
                    key={i}
                    className="w-0.5 rounded-full bg-amber-500/60 transition-all duration-300"
                    style={{
                      height: isPlaying ? `${Math.max(20, (h * Math.cos(currentTime + i) + 100) / 2)}%` : '20%',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Time tracker */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
              <span>{formatSeconds(currentTime)}</span>
              <span>/</span>
              <span>{formatSeconds(duration)}</span>
            </div>
          </div>

          {/* Volume & Actions */}
          <div className="flex items-center justify-end gap-3 w-1/4">
            {hasLyrics && (
              <button
                onClick={() => setShowFullLyrics(!showFullLyrics)}
                title="Afficher les paroles"
                className="p-1.5 text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg transition-colors"
              >
                <FileText className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label={volume === 0 ? t.player.unmute : t.player.mute}
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4 text-red-400" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-amber-500 h-1 bg-zinc-700 rounded-lg cursor-pointer hidden md:block"
            />
          </div>
        </div>
      </div>
    </>
  );
}
