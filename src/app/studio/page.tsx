'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { usePlayer } from '@/lib/player/context';
import { MUSIC_GENRES } from '@/lib/genres';
import { generateStructuredLyrics } from '@/lib/ai/lyrics-generator';
import {
  MusicGenreId,
  VocalGender,
  MusicMood,
  SongLanguage,
  Track,
} from '@/types';
import {
  Sliders,
  Sparkles,
  Music,
  Mic2,
  RotateCcw,
  Play,
  CheckCircle2,
  Disc,
  ArrowRight,
  Bot,
  Send,
  Zap,
  Wand2,
  Key,
  Radio,
  AlertCircle,
  Gift,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

type EngineId = 'diffrhythm' | 'yue2' | 'musicgen' | 'suno' | 'studio-master';

interface EngineOption {
  id: EngineId;
  name: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  description: string;
  isFree: boolean;
  supportsVocals: boolean;
}

export default function StudioPage() {
  const { t } = useLanguage();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const [studioMode, setStudioMode] = useState<'flow' | 'pro'>('flow');
  const [selectedEngine, setSelectedEngine] = useState<EngineId>('diffrhythm');

  // Clé Suno (optionnel, moteur premium)
  const [sunoApiKey, setSunoApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try { return localStorage.getItem('musika_suno_key') || ''; } catch { return ''; }
    }
    return '';
  });
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Studio params
  const [prompt, setPrompt] = useState('Chanson Afrobeat entraînante avec saxophone brillant, choeurs chauds et chant mélodieux célébrant la vie.');
  const [selectedGenre, setSelectedGenre] = useState<MusicGenreId>('afrobeat');
  const [lyricsMode, setLyricsMode] = useState<'ai-generated' | 'custom' | 'instrumental'>('ai-generated');
  const [lyricsTopic, setLyricsTopic] = useState('Célébration, succès et joie de vivre');
  const [lyricsText, setLyricsText] = useState(`[verse]
Le soleil se lève sur la ville, la foi dans le cœur
On a marché dans la poussière sans jamais avoir peur
Chaque pas vers l'horizon est une victoire
On écrit notre propre histoire

[chorus]
Dansez au rythme du courage, la lumière est là !
C'est notre moment, plus rien ne nous arrêtera !
Élévation, célébration, jusqu'au bout de la nuit !`);

  const [vocalGender, setVocalGender] = useState<VocalGender>('male');
  const [mood, setMood] = useState<MusicMood>('energetic');
  const [language, setLanguage] = useState<SongLanguage>('fr');
  const [tempoBpm, setTempoBpm] = useState<number>(104);

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text: '🎵 Salut ! Je suis votre Copilote IA Musika. Choisissez un moteur GRATUIT (DiffRhythm ou YuE2) pour générer de vraies chansons chantées, puis dites-moi votre style musical !',
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgressText, setGenerationProgressText] = useState('');
  const [generatedTrack, setGeneratedTrack] = useState<Track | null>(null);
  const [aiNoticeMessage, setAiNoticeMessage] = useState<{
    type: 'pending' | 'success' | 'info' | 'warning' | 'error';
    title: string;
    description: string;
  } | null>(null);

  // Les 5 moteurs disponibles
  const engines: EngineOption[] = [
    {
      id: 'diffrhythm',
      name: 'DiffRhythm (ASLP-lab)',
      badge: 'GRATUIT 🎵',
      badgeColor: 'bg-emerald-500 text-white',
      icon: <Mic2 className="h-3.5 w-3.5 text-emerald-400" />,
      description: 'Chant IA complet avec paroles LRC + style prompt. Open-source HuggingFace.',
      isFree: true,
      supportsVocals: true,
    },
    {
      id: 'yue2',
      name: 'YuE2 (HKUST/M-A-P)',
      badge: 'GRATUIT 🎤',
      badgeColor: 'bg-emerald-500 text-white',
      icon: <Sparkles className="h-3.5 w-3.5 text-emerald-400" />,
      description: 'Chanson complète [Verse]/[Chorus] avec voix chantées IA. HKUST Spaces.',
      isFree: true,
      supportsVocals: true,
    },
    {
      id: 'musicgen',
      name: 'Meta MusicGen',
      badge: 'GRATUIT 🎼',
      badgeColor: 'bg-blue-600 text-white',
      icon: <Music className="h-3.5 w-3.5 text-blue-400" />,
      description: 'Génération instrumentale par méta-apprentissage (sans chant). HuggingFace.',
      isFree: true,
      supportsVocals: false,
    },
    {
      id: 'suno',
      name: 'Suno AI v3.5 / v4',
      badge: 'CLÉ API',
      badgeColor: 'bg-amber-500 text-black',
      icon: <Mic2 className="h-3.5 w-3.5 text-amber-400" />,
      description: 'Chant vocal de qualité radio (nécessite une clé API Suno).',
      isFree: false,
      supportsVocals: true,
    },
    {
      id: 'studio-master',
      name: 'Master Studio 320k',
      badge: 'INSTANTANÉ',
      badgeColor: 'bg-zinc-700 text-zinc-200',
      icon: <Disc className="h-3.5 w-3.5 text-zinc-400" />,
      description: 'Lecture instantanée des masters studio intégrés (référence de calage).',
      isFree: true,
      supportsVocals: false,
    },
  ];

  const handleGenreChange = (genreId: MusicGenreId) => {
    setSelectedGenre(genreId);
    const g = MUSIC_GENRES.find((g) => g.id === genreId);
    if (g) setTempoBpm(g.defaultBpm);
  };

  const handleGenerateLyrics = () => {
    const generated = generateStructuredLyrics({ genre: selectedGenre, topic: lyricsTopic, language });
    setLyricsText(generated);
  };

  const applyQuickModifier = (text: string, genre?: MusicGenreId, bpm?: number) => {
    if (genre) setSelectedGenre(genre);
    if (bpm) setTempoBpm(bpm);
    setPrompt((prev) => `${prev} (${text})`);
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text },
      { id: `ai-${Date.now() + 1}`, sender: 'ai', text: `✅ Ajusté pour ${genre?.toUpperCase() || selectedGenre} à ${bpm || tempoBpm} BPM. Lancez la génération !` },
    ]);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userInput = chatInput.trim();
    setChatInput('');
    let g = selectedGenre, b = tempoBpm;
    const lower = userInput.toLowerCase();
    if (lower.includes('amapiano')) { g = 'amapiano'; b = 113; }
    else if (lower.includes('coupe') || lower.includes('coupé')) { g = 'coupe-decale'; b = 128; }
    else if (lower.includes('zouglou')) { g = 'zouglou'; b = 110; }
    else if (lower.includes('kora') || lower.includes('tradition')) { g = 'traditional-african'; b = 94; }
    else if (lower.includes('drill') || lower.includes('rap')) { g = 'drill'; b = 140; }
    setSelectedGenre(g); setTempoBpm(b); setPrompt(userInput);
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: userInput },
      { id: `ai-${Date.now() + 1}`, sender: 'ai', text: `🎵 Configuré pour ${g.toUpperCase()} à ${b} BPM. Cliquez « Générer » pour faire chanter l'IA !` },
    ]);
  };

  const handleGenerateMusic = async () => {
    setIsGenerating(true);
    setAiNoticeMessage(null);

    // ─── MOTEURS GRATUITS HUGGINGFACE ─────────────────────────────────────────
    if (['diffrhythm', 'yue2', 'musicgen'].includes(selectedEngine)) {
      const engineName = engines.find((e) => e.id === selectedEngine)?.name || selectedEngine;
      setGenerationProgressText(`⚡ Connexion à ${engineName} (HuggingFace)...`);

      try {
        const res = await fetch('/api/free-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: selectedEngine,
            prompt,
            lyrics: lyricsMode !== 'instrumental' ? lyricsText : undefined,
            genre: selectedGenre,
            vocalGender,
            mood,
            tempoBpm,
            isInstrumental: lyricsMode === 'instrumental',
            language,
          }),
        });

        const data = await res.json();

        if (data.success && data.track?.audioUrl) {
          const newTrack: Track = {
            ...data.track,
            status: 'ready' as const,
          };
          setGeneratedTrack(newTrack);
          setIsGenerating(false);
          playTrack(newTrack);
          setAiNoticeMessage({
            type: 'success',
            title: `🎉 Chanson générée avec succès par ${engineName} !`,
            description: data.statusMessage || `Votre morceau ${selectedGenre} chanté est prêt !`,
          });
          return;
        }

        // Si erreur retournée par le provider
        if (!data.success) {
          setAiNoticeMessage({
            type: 'error',
            title: `Erreur ${engineName}`,
            description: data.statusMessage || data.error || 'Le serveur HuggingFace est temporairement occupé. Réessayez dans quelques secondes.',
          });
          setIsGenerating(false);

          // Fallback automatique sur master studio
          setGenerationProgressText('Lecture du master studio en attendant...');
        }
      } catch (err) {
        console.warn(`[Studio] Erreur ${selectedEngine}:`, err);
        setAiNoticeMessage({
          type: 'warning',
          title: `${engineName} — Space HuggingFace en file d'attente`,
          description: 'Le Space est peut-être en train de démarrer (cold start ~30s). Réessayez dans quelques instants ou utilisez le Master Studio.',
        });
        setIsGenerating(false);
      }
    }

    // ─── MOTEUR SUNO (PREMIUM — CLÉ REQUISE) ─────────────────────────────────
    if (selectedEngine === 'suno') {
      setGenerationProgressText('Connexion au moteur vocal Suno AI (v4)...');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sunoApiKey.trim()) headers['x-suno-key'] = sunoApiKey.trim();

      try {
        const res = await fetch('/api/suno', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            prompt,
            lyrics: lyricsMode !== 'instrumental' ? lyricsText : undefined,
            genre: selectedGenre,
            vocalGender,
            mood,
            tempoBpm,
            isInstrumental: lyricsMode === 'instrumental',
            apiKey: sunoApiKey.trim() || undefined,
          }),
        });

        const data = await res.json();

        if (!res.ok && data.error === 'SUNO_KEY_REQUIRED') {
          setIsGenerating(false);
          setShowKeyModal(true);
          setAiNoticeMessage({
            type: 'warning',
            title: 'Clé Suno requise',
            description: 'Renseignez votre clé Suno dans le formulaire ci-dessous, ou utilisez DiffRhythm / YuE2 (100% gratuits) pour générer des chansons sans clé !',
          });
          return;
        }

        if (data.success && data.taskId) {
          setGenerationProgressText('Suno compose et enregistre les voix...');
          let attempts = 0;
          let audioUrl = data.audioUrl;

          while (!audioUrl && attempts < 15) {
            attempts++;
            await new Promise((r) => setTimeout(r, 3000));
            setGenerationProgressText(`Mixage Suno en cours... (${attempts * 3}s)`);
            try {
              const checkRes = await fetch(`/api/suno?taskId=${data.taskId}`, { headers });
              if (checkRes.ok) {
                const checkData = await checkRes.json();
                if (checkData.audioUrl) { audioUrl = checkData.audioUrl; break; }
              }
            } catch { /* Continue polling */ }
          }

          if (audioUrl) {
            const newTrack: Track = {
              id: data.taskId,
              title: prompt.slice(0, 32) || `${selectedGenre.toUpperCase()} Suno Vocal`,
              genre: selectedGenre, bpm: tempoBpm, durationSeconds: 180,
              audioUrl, prompt, lyrics: lyricsText || undefined,
              vocalGender: lyricsMode === 'instrumental' ? 'none' : vocalGender,
              mood, language, isInstrumental: lyricsMode === 'instrumental',
              createdAt: new Date().toISOString(), creatorName: 'Suno AI v4',
              status: 'ready', tags: [selectedGenre, `${tempoBpm} BPM`, 'Suno'], likesCount: 1,
            };
            setGeneratedTrack(newTrack);
            setIsGenerating(false);
            playTrack(newTrack);
            setAiNoticeMessage({
              type: 'success',
              title: '🎤 Suno AI — Chanson vocale prête !',
              description: `Votre morceau ${selectedGenre} chanté par Suno AI joue maintenant.`,
            });
            return;
          }
        }
      } catch (err) {
        console.warn('[Studio] Erreur Suno:', err);
      }

      setIsGenerating(false);
    }

    // ─── MASTER STUDIO FALLBACK / INSTANTANÉ ─────────────────────────────────
    setGenerationProgressText('Chargement master studio...');
    let sampleAudio = '/audio/afrobeat-groove.mp3';
    if (['coupe-decale', 'dancehall', 'drill', 'rap-ivoirien'].includes(selectedGenre)) {
      sampleAudio = '/audio/accralate-club.mp3';
    } else if (['traditional-african', 'zouglou', 'reggae', 'gospel'].includes(selectedGenre)) {
      sampleAudio = '/audio/digya-traditional.mp3';
    }

    const fallback: Track = {
      id: `studio-${Date.now()}`,
      title: prompt.slice(0, 32).trim() || `${selectedGenre.toUpperCase()} Master`,
      genre: selectedGenre, bpm: tempoBpm, durationSeconds: 180,
      audioUrl: sampleAudio, prompt, lyrics: lyricsText || undefined,
      vocalGender: lyricsMode === 'instrumental' ? 'none' : vocalGender,
      mood, language, isInstrumental: lyricsMode === 'instrumental',
      createdAt: new Date().toISOString(), creatorName: 'Studio Musika AI',
      status: 'ready', tags: [selectedGenre, `${tempoBpm} BPM`, mood], likesCount: 1,
    };
    setGeneratedTrack(fallback);
    setIsGenerating(false);
    playTrack(fallback);
    if (selectedEngine === 'studio-master' || !aiNoticeMessage) {
      setAiNoticeMessage({
        type: 'info',
        title: `🎼 Master Studio — ${fallback.title}`,
        description: `Piste ${selectedGenre} (${tempoBpm} BPM) chargée. Utilisez DiffRhythm ou YuE2 pour de vraies voix chantées générées à la volée !`,
      });
    }
  };

  const currentGenreInfo = MUSIC_GENRES.find((g) => g.id === selectedGenre);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* ─── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Gift className="h-4 w-4" />
            <span>Studio IA Gratuit — DiffRhythm · YuE2 · MusicGen · Suno (optionnel)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{t.studio.title}</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Créez de vraies chansons avec voix chantées IA — <span className="text-emerald-400 font-bold">100% gratuit</span>, aucune clé requise.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/10 p-1.5 rounded-2xl text-xs">
          <button type="button" onClick={() => setStudioMode('flow')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${studioMode === 'flow' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}>
            <Bot className="h-4 w-4" />
            <span>Mode Flow (Copilote IA)</span>
          </button>
          <button type="button" onClick={() => setStudioMode('pro')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${studioMode === 'pro' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}>
            <Sliders className="h-4 w-4" />
            <span>Mode Console DAW</span>
          </button>
        </div>
      </div>

      {/* ─── SÉLECTEUR MOTEUR IA ─────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-zinc-900/80 border border-emerald-500/30 p-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Choisir le Moteur de Chant IA :</span>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
            3 moteurs 100% GRATUITS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {engines.map((engine) => (
            <button
              key={engine.id}
              type="button"
              onClick={() => setSelectedEngine(engine.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedEngine === engine.id
                  ? 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/20'
                  : 'bg-black/30 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1 text-[11px] font-black text-zinc-100">
                  {engine.icon}
                  <span className="truncate">{engine.name}</span>
                </span>
              </div>
              <div className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded inline-block mb-1.5 ${engine.badgeColor}`}>
                {engine.badge}
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight">{engine.description}</p>
            </button>
          ))}
        </div>

        {/* Info moteur sélectionné */}
        {selectedEngine === 'suno' && (
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <span className="text-[11px] text-zinc-400">Clé Suno requise pour ce moteur premium :</span>
            <button type="button" onClick={() => setShowKeyModal(true)}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold underline underline-offset-2">
              <Key className="h-3 w-3" />
              <span>{sunoApiKey ? '✓ Clé configurée' : 'Configurer ma clé Suno'}</span>
            </button>
          </div>
        )}

        {(selectedEngine === 'diffrhythm' || selectedEngine === 'yue2') && (
          <div className="flex items-center gap-2 pt-1 border-t border-white/5">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-[11px] text-emerald-300">
              {selectedEngine === 'diffrhythm'
                ? '🎵 DiffRhythm utilise vos paroles (format LRC) + un style pour composer une chanson chantée complète gratuitement via HuggingFace.'
                : '🎤 YuE2 de HKUST génère une chanson structurée [Verse]/[Chorus] avec de vraies voix IA gratuitement via HuggingFace.'}
            </span>
          </div>
        )}
      </div>

      {/* ─── VIBE PILLS ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Wand2 className="h-3.5 w-3.5 text-amber-400" />
          <span>Vibes :</span>
        </span>
        {[
          { label: '🎷 Cuivres Afrobeat', genre: 'afrobeat' as MusicGenreId, bpm: 104, text: 'Saxophone mandingue chaud, guitare syncopée et chant vibrant' },
          { label: '🥁 Log Drums Amapiano', genre: 'amapiano' as MusicGenreId, bpm: 113, text: 'Basse log-drum profonde, piano jazz et voix sensuelle' },
          { label: '🔥 Coupé-décalé 128', genre: 'coupe-decale' as MusicGenreId, bpm: 128, text: 'Rythmique club rapide et animation festive abidjanaise' },
          { label: '🪕 Kora Tradition', genre: 'traditional-african' as MusicGenreId, bpm: 94, text: 'Kora cristalline, balafon et voix de griot africain' },
          { label: '⚡ Drill Ivoirienne', genre: 'drill' as MusicGenreId, bpm: 140, text: '808 slides glissantes, hi-hats rapides et flow percutant' },
          { label: '🎶 Zouglou Wôyô', genre: 'zouglou' as MusicGenreId, bpm: 110, text: 'Tam-tam acoustique, guitare chaleureuse et fraternité' },
        ].map((pill, idx) => (
          <button key={idx} type="button" onClick={() => applyQuickModifier(pill.text, pill.genre, pill.bpm)}
            className="shrink-0 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 hover:border-emerald-500/50 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95">
            <span>{pill.label}</span>
          </button>
        ))}
      </div>

      {/* ─── GRILLE PRINCIPALE ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">

          {studioMode === 'flow' ? (
            /* MODE FLOW — Copilote Conversationnel */
            <div className="rounded-3xl bg-zinc-900/60 border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Copilote Producteur IA</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {selectedGenre.toUpperCase()} • {tempoBpm} BPM
                </span>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3.5 ${m.sender === 'user' ? 'bg-emerald-500 text-black font-medium' : 'bg-zinc-800 border border-white/5 text-zinc-200'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChatMessage} className="pt-2">
                <div className="relative flex items-center">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ex: Fais chanter une voix féminine en lingala avec basse lourde..."
                    className="w-full rounded-2xl bg-black/50 border border-white/10 pl-4 pr-24 py-3.5 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none" />
                  <button type="submit" className="absolute right-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5">
                    <span>Envoyer</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* MODE CONSOLE DAW */
            <div className="space-y-6">
              <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>{t.studio.promptLabel}</span>
                  </label>
                  <button type="button" onClick={() => setPrompt('Chanson Afrobeat entraînante avec saxophone brillant et chant mélodieux.')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-medium">
                    + Exemple Afrobeat
                  </button>
                </div>
                <textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t.studio.promptPlaceholder}
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none resize-none" />
              </div>
              <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Music className="h-4 w-4 text-amber-400" />
                    <span>{t.studio.genreLabel}</span>
                  </label>
                  <span className="text-xs text-amber-400 font-mono">{currentGenreInfo?.name} ({currentGenreInfo?.defaultBpm} BPM)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {MUSIC_GENRES.map((g) => (
                    <button key={g.id} type="button" onClick={() => handleGenreChange(g.id)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${selectedGenre === g.id ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300' : 'bg-zinc-900/80 border-white/5 text-zinc-300 hover:border-white/20 hover:bg-zinc-800'}`}>
                      <span className="text-xs font-bold truncate w-full">{g.name}</span>
                      <span className="text-[10px] text-zinc-400 truncate w-full mt-0.5">{g.origin}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION PAROLES (commun aux deux modes) */}
          <div className="rounded-3xl bg-zinc-900/60 border border-emerald-500/30 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Mic2 className="h-4 w-4 text-emerald-400" />
                <span>Paroles à faire chanter par l&apos;IA</span>
              </label>
              <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-white/10 text-xs">
                {(['ai-generated', 'custom', 'instrumental'] as const).map((mode) => (
                  <button key={mode} type="button" onClick={() => setLyricsMode(mode)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${lyricsMode === mode ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}>
                    {mode === 'ai-generated' ? t.studio.lyricsModeAi : mode === 'custom' ? t.studio.lyricsModeCustom : t.studio.lyricsModeInstrumental}
                  </button>
                ))}
              </div>
            </div>

            {lyricsMode === 'ai-generated' && (
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input type="text" value={lyricsTopic} onChange={(e) => setLyricsTopic(e.target.value)}
                    placeholder={t.studio.lyricsTopicPlaceholder}
                    className="flex-1 rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none" />
                  <button type="button" onClick={handleGenerateLyrics}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Générer les Couplets & Refrains</span>
                  </button>
                </div>
                <textarea rows={6} value={lyricsText} onChange={(e) => setLyricsText(e.target.value)}
                  className="w-full font-mono text-xs rounded-xl bg-black/50 border border-emerald-500/30 p-3.5 text-zinc-200 focus:border-emerald-500 focus:outline-none" />
              </div>
            )}

            {lyricsMode === 'custom' && (
              <div className="space-y-2 pt-2">
                <p className="text-[11px] text-zinc-400">
                  Utilisez les balises <code className="text-emerald-400 bg-zinc-900 px-1 rounded">[verse]</code>, <code className="text-emerald-400 bg-zinc-900 px-1 rounded">[chorus]</code>, <code className="text-emerald-400 bg-zinc-900 px-1 rounded">[bridge]</code> pour structurer votre chanson :
                </p>
                <textarea rows={6} value={lyricsText} onChange={(e) => setLyricsText(e.target.value)}
                  placeholder={t.studio.lyricsCustomPlaceholder}
                  className="w-full font-mono text-xs rounded-xl bg-black/40 border border-white/10 p-3.5 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none" />
              </div>
            )}

            {lyricsMode === 'instrumental' && (
              <p className="text-xs text-zinc-400 italic py-2">Mode instrumental : morceau sans chant, uniquement instruments et arrangements.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">

          {/* Controls */}
          <div className="rounded-3xl bg-zinc-900/60 border border-white/10 p-6 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Mic2 className="h-4 w-4 text-emerald-400" />
              <span>Paramètres Vocaux & Audio</span>
            </h3>

            {/* Voix */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">{t.studio.vocalGenderLabel}</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ id: 'male', label: t.studio.vocalMale }, { id: 'female', label: t.studio.vocalFemale }, { id: 'duet', label: t.studio.vocalDuet }, { id: 'none', label: t.studio.vocalNone }].map((item) => (
                  <button key={item.id} type="button" disabled={lyricsMode === 'instrumental' && item.id !== 'none'} onClick={() => setVocalGender(item.id as VocalGender)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${vocalGender === item.id ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'} ${lyricsMode === 'instrumental' && item.id !== 'none' ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Langue */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">{t.studio.languageLabel}</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value as SongLanguage)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none">
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="lingala">Lingala (Congo)</option>
                <option value="yoruba">Yoruba (Nigeria)</option>
                <option value="baoule">Baoulé (Côte d&apos;Ivoire)</option>
                <option value="swahili">Swahili (Afrique de l&apos;Est)</option>
                <option value="pidgin">Pidgin English</option>
                <option value="wolof">Wolof (Sénégal)</option>
                <option value="instrumental">Instrumental</option>
              </select>
            </div>

            {/* Ambiance */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">{t.studio.moodLabel}</label>
              <select value={mood} onChange={(e) => setMood(e.target.value as MusicMood)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none">
                <option value="energetic">Énergique & Festif</option>
                <option value="festive">Ambiance Clubbing</option>
                <option value="nostalgic">Nostalgique & Doux</option>
                <option value="spiritual">Spirituel & Élevé</option>
                <option value="melancholic">Mélancolique & Profond</option>
                <option value="romantic">Romantique & Sensuel</option>
                <option value="epic">Épique & Puissant</option>
                <option value="chill">Chill & Relaxant</option>
              </select>
            </div>

            {/* BPM */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">{t.studio.tempoLabel}</span>
                <span className="font-mono text-emerald-400 font-bold">{tempoBpm} BPM</span>
              </div>
              <input type="range" min="60" max="180" step="1" value={tempoBpm} onChange={(e) => setTempoBpm(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer" />
            </div>

            {/* BOUTON GÉNÉRER */}
            <button type="button" disabled={isGenerating} onClick={handleGenerateMusic}
              className={`w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-xl transition-all ${isGenerating ? 'bg-zinc-800 text-zinc-400 cursor-wait' : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-black hover:scale-[1.02] active:scale-[0.98] shadow-emerald-500/25'}`}>
              {isGenerating ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin text-emerald-400" />
                  <span className="text-xs truncate">{generationProgressText || 'Génération IA en cours...'}</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 fill-current" />
                  <span>
                    {selectedEngine === 'diffrhythm' ? '🎵 Chanter avec DiffRhythm (Gratuit)'
                      : selectedEngine === 'yue2' ? '🎤 Chanter avec YuE2 (Gratuit)'
                      : selectedEngine === 'musicgen' ? '🎼 Composer avec MusicGen (Gratuit)'
                      : selectedEngine === 'suno' ? '🎙️ Chanter avec Suno AI'
                      : '▶ Écouter Master Studio'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Notice IA */}
          {aiNoticeMessage && (
            <div className={`rounded-2xl p-4 border text-xs leading-relaxed space-y-2 ${
              aiNoticeMessage.type === 'warning' ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
              : aiNoticeMessage.type === 'error' ? 'bg-red-950/40 border-red-500/50 text-red-200'
              : aiNoticeMessage.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              : 'bg-zinc-900 border-white/10 text-zinc-300'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {aiNoticeMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> : <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />}
                <span>{aiNoticeMessage.title}</span>
              </div>
              <p className="text-xs leading-relaxed">{aiNoticeMessage.description}</p>
              {(aiNoticeMessage.type === 'error' || aiNoticeMessage.type === 'warning') && (
                <div className="pt-1 border-t border-white/10">
                  <p className="text-[11px] text-zinc-400">
                    💡 Les spaces HuggingFace peuvent prendre 20-60s pour démarrer (cold start). Réessayez, ou utilisez le <button type="button" onClick={() => setSelectedEngine('studio-master')} className="text-emerald-400 underline">Master Studio</button> en attendant.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Track généré */}
          {generatedTrack && (
            <div className="rounded-3xl bg-zinc-900/90 border border-emerald-500/50 p-5 space-y-3 shadow-xl shadow-emerald-500/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {generatedTrack.creatorName}
                </span>
                <span className="text-xs font-mono text-zinc-400">{generatedTrack.bpm} BPM</span>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => playTrack(generatedTrack)}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${currentTrack?.id === generatedTrack.id && isPlaying ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/40' : 'bg-zinc-800 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-white/10'}`}>
                  <Disc className="h-6 w-6 animate-spin" style={{ animationDuration: '6s' }} />
                </button>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{generatedTrack.title}</h4>
                  <p className="text-xs text-zinc-400 capitalize">{generatedTrack.genre} • {generatedTrack.mood}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <button type="button" onClick={() => playTrack(generatedTrack)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Écouter</span>
                </button>
                <Link href="/library" className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]">
                  <span>Bibliothèque</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── MODAL CLÉ SUNO ─────────────────────────────────────────────────── */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Connexion Suno AI (Optionnel)</h3>
              </div>
              <button type="button" onClick={() => setShowKeyModal(false)} className="text-xs text-zinc-400 hover:text-white">✕</button>
            </div>
            <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/30 p-3 text-xs text-emerald-300">
              💡 <strong>Rappel :</strong> DiffRhythm et YuE2 génèrent de vraies chansons chantées <strong>GRATUITEMENT</strong>. Suno est un moteur premium optionnel pour une qualité encore supérieure.
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400">Clé Suno API (aimusicapi.ai) :</label>
              <input type="password" value={sunoApiKey} onChange={(e) => setSunoApiKey(e.target.value)}
                placeholder="sk-suno-... ou clé aimusicapi"
                className="w-full rounded-xl bg-black/60 border border-amber-500/30 p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none font-mono" />
            </div>
            <div className="rounded-xl bg-zinc-950 p-3 text-[11px] text-zinc-400 space-y-1 border border-white/5">
              <div className="font-bold text-zinc-200">Comment obtenir une clé :</div>
              <p>1. Visitez <a href="https://aimusicapi.ai" target="_blank" rel="noreferrer" className="text-amber-400 underline">aimusicapi.ai</a> ou <a href="https://apiframe.ai" target="_blank" rel="noreferrer" className="text-amber-400 underline">apiframe.ai</a></p>
              <p>2. Créez un compte et récupérez votre jeton API</p>
              <p>3. Collez votre clé ici — elle sera sauvegardée localement</p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowKeyModal(false)} className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white">Fermer</button>
              <button type="button" onClick={() => {
                try { if (sunoApiKey.trim()) localStorage.setItem('musika_suno_key', sunoApiKey.trim()); else localStorage.removeItem('musika_suno_key'); } catch { /* ignore */ }
                setShowKeyModal(false);
              }} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:scale-105 active:scale-95 transition-all shadow-md shadow-amber-500/20">
                Enregistrer la Clé
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
