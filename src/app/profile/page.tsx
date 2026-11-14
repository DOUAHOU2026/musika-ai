'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { MUSIC_GENRES } from '@/lib/genres';
import { MusicGenreId, VocalGender } from '@/types';
import {
  User,
  Sliders,
  Key,
  Save,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function ProfilePage() {
  const { t } = useLanguage();

  const [artistName, setArtistName] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('musika_profile_name');
        if (saved) return saved;
      } catch {
        // Ignore
      }
    }
    return 'Créateur Musika';
  });

  const [email, setEmail] = useState('artiste@musika-ai.com');

  const [favoriteGenre, setFavoriteGenre] = useState<MusicGenreId>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('musika_profile_genre') as MusicGenreId;
        if (saved) return saved;
      } catch {
        // Ignore
      }
    }
    return 'afrobeat';
  });

  const [favoriteVocal, setFavoriteVocal] = useState<VocalGender>('male');
  const [sunoApiKey, setSunoApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('musika_suno_key') || '';
      } catch {
        // Ignore
      }
    }
    return '';
  });
  const [huggingFaceKey, setHuggingFaceKey] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('musika_hf_key') || '';
      } catch {
        // Ignore
      }
    }
    return '';
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('musika_profile_name', artistName);
        localStorage.setItem('musika_profile_genre', favoriteGenre);
        if (sunoApiKey.trim()) {
          localStorage.setItem('musika_suno_key', sunoApiKey.trim());
        } else {
          localStorage.removeItem('musika_suno_key');
        }
        if (huggingFaceKey.trim()) {
          localStorage.setItem('musika_hf_key', huggingFaceKey.trim());
        } else {
          localStorage.removeItem('musika_hf_key');
        }
      } catch {
        // Ignore
      }
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <User className="h-4 w-4" />
          <span>Espace Créateur</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">{t.profile.title}</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">{t.profile.subtitle}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal info card */}
        <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <User className="h-4 w-4 text-amber-400" />
            <span>{t.profile.personalInfo}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-medium">
                {t.profile.nameLabel}
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-medium">
                {t.profile.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Music preferences card */}
        <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Sliders className="h-4 w-4 text-amber-400" />
            <span>{t.profile.musicPreferences}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-medium">
                {t.profile.defaultGenre}
              </label>
              <select
                value={favoriteGenre}
                onChange={(e) => setFavoriteGenre(e.target.value as MusicGenreId)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
              >
                {MUSIC_GENRES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-medium">
                {t.profile.defaultVocal}
              </label>
              <select
                value={favoriteVocal}
                onChange={(e) => setFavoriteVocal(e.target.value as VocalGender)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="male">Voix Masculine</option>
                <option value="female">Voix Féminine</option>
                <option value="duet">Duo Mixte</option>
                <option value="none">Instrumental (Sans voix)</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Settings card: Suno AI (Vocal Singing) + Hugging Face */}
        <div className="rounded-2xl bg-zinc-900/60 border border-amber-500/30 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Connecteurs d’Intelligence Artificielle Vocale</span>
            </h2>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold">
              Chant & Voix Humaine
            </span>
          </div>

          {/* Section Suno AI */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-amber-400" />
                <span>Clé d’API Suno AI (Génération de voix chantées)</span>
              </label>
              <a
                href="https://aimusicapi.ai"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-2"
              >
                <span>Obtenir une clé Suno</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Connecte le moteur Suno AI v3.5 / v4 pour chanter directement vos paroles (couplets, refrains, harmonies) avec de vraies voix humaines en Afrobeat, Amapiano, Coupé-décalé, RnB, etc.
            </p>
            <input
              type="password"
              value={sunoApiKey}
              onChange={(e) => setSunoApiKey(e.target.value)}
              placeholder="Ex: sk-suno-... ou clé aimusicapi"
              className="w-full rounded-xl bg-black/50 border border-amber-500/40 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-400 focus:outline-none font-mono"
            />
          </div>

          {/* Section Hugging Face */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="text-xs font-semibold text-zinc-300">
              Jeton Hugging Face (Optionnel pour Meta MusicGen Instrumental)
            </label>
            <input
              type="password"
              value={huggingFaceKey}
              onChange={(e) => setHuggingFaceKey(e.target.value)}
              placeholder="hf_..."
              className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Save button & confirmation */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:scale-105 active:scale-95 transition-all shadow-md shadow-amber-500/25"
          >
            <Save className="h-4 w-4" />
            <span>{t.profile.saveChanges}</span>
          </button>

          {isSaved && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-fadeIn">
              <CheckCircle2 className="h-4 w-4" />
              <span>Vos identifiants et clés API ont été sauvegardés !</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
