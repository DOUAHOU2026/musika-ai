import { Client } from '@gradio/client';
import { MusicEngineProvider, ProviderInfo, GenerationRequest, GenerationResponse } from '../types';

/**
 * DiffRhythm (ASLP-lab) — Génération vocale GRATUITE via HuggingFace Spaces.
 * Produit des chansons complètes avec voix chantées réelles à partir de paroles
 * au format LRC et d'un style prompt textuel.
 * Aucune clé API requise — 100% gratuit.
 */
export class DiffRhythmProvider implements MusicEngineProvider {
  private readonly spaceId = 'ASLP-lab/DiffRhythm';

  getInfo(): ProviderInfo {
    return {
      id: 'diffrhythm',
      name: 'DiffRhythm (ASLP-lab) — Gratuit 🎵',
      description:
        'Modèle open-source de chant IA : génère des chansons complètes avec vraies voix chantées à partir de paroles LRC + style. 100% gratuit via HuggingFace.',
      status: 'configured',
      supportsVocals: true,
      supportsCustomLyrics: true,
      maxDurationSeconds: 285, // 4m45s
      documentationUrl: 'https://huggingface.co/spaces/ASLP-lab/DiffRhythm',
    };
  }

  isAvailable(): boolean {
    return true; // Toujours disponible (space HuggingFace gratuit)
  }

  /**
   * Convertit les paroles au format LRC (timestampé) attendu par DiffRhythm.
   * Les timestamps sont répartis automatiquement selon la durée estimée.
   */
  private toLrcFormat(lyricsText: string, bpm: number): string {
    if (!lyricsText.trim()) {
      return '[00:05.00] Melodic vocal harmony\n[00:15.00] Rising musical expression\n[00:25.00] Rhythmic vocal flow\n[00:35.00] Harmonic resolution';
    }

    // Si déjà au format LRC (contient des timestamps), retourner tel quel
    if (lyricsText.includes('[0') && lyricsText.match(/\[\d\d:\d\d\.\d\d\]/)) {
      return lyricsText;
    }

    // Convertir les paroles normales en LRC avec des timestamps calculés selon le BPM
    const lines = lyricsText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('==='));

    const secondsPerBeat = 60 / bpm;
    const secondsPerLine = secondsPerBeat * 8; // ~8 beats par ligne
    let currentSeconds = 5;

    return lines
      .map((line) => {
        const mins = Math.floor(currentSeconds / 60);
        const secs = currentSeconds % 60;
        const timestamp = `[${String(mins).padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}]`;
        currentSeconds += secondsPerLine;
        return `${timestamp} ${line}`;
      })
      .join('\n');
  }

  /**
   * Construit le style prompt à partir des paramètres musicaux africains.
   */
  private buildStylePrompt(genre: string, mood: string, vocalGender: string, bpm: number): string {
    const genreStyles: Record<string, string> = {
      afrobeat: 'Afrobeat, brass section, rhythm guitar, percussion, African groove',
      'coupe-decale': 'Coupé-décalé, Ivorian club music, fast percussion, festive energy',
      zouglou: 'Zouglou, Ivorian folk, acoustic guitar, tam-tam drums, warm harmony',
      amapiano: 'Amapiano, South African, log drum bass, jazz piano chords, smooth',
      'rap-ivoirien': 'Ivorian rap, urban trap beat, modern African hip-hop',
      drill: 'Afro drill, sliding 808 bass, dark cinematic melody, hi-hat triplets',
      gospel: 'African gospel, choir harmonies, Hammond organ, uplifting worship',
      rnb: 'African R&B, smooth soul, Rhodes piano, warm bass, romantic',
      reggae: 'African reggae, roots sound, offbeat guitar, conscious lyrics',
      dancehall: 'Dancehall, Caribbean riddim, heavy bass, energetic',
      'hip-hop': 'African hip-hop, boom bap, samples, lyricism, vinyl',
      'traditional-african': 'Traditional African, kora strings, balafon, djembe, griot',
    };

    const moodMap: Record<string, string> = {
      energetic: 'energetic, vibrant, powerful',
      festive: 'festive, joyful, celebratory',
      nostalgic: 'nostalgic, warm, emotional',
      spiritual: 'spiritual, uplifting, soulful',
      melancholic: 'melancholic, deep, touching',
      romantic: 'romantic, sensual, smooth',
      epic: 'epic, grand, cinematic',
      chill: 'chill, relaxed, mellow',
    };

    const vocalStyle =
      vocalGender === 'female'
        ? 'female lead vocal, clear feminine singing voice'
        : vocalGender === 'duet'
        ? 'male and female duet vocals, harmonized singing'
        : 'male lead vocal, powerful masculine singing';

    const genre_style = genreStyles[genre] || `${genre}, African music`;
    const mood_style = moodMap[mood] || mood;

    return `${genre_style}, ${vocalStyle}, ${mood_style}, ${bpm} BPM, studio production quality, clear melodic singing`;
  }

  async generateMusic(request: GenerationRequest): Promise<GenerationResponse> {
    const { genre, mood, vocalGender, tempoBpm, lyricsText, lyricsMode, prompt } = request.params;

    const isInstrumental = lyricsMode === 'instrumental';
    const lyricsToUse = isInstrumental
      ? '[00:05.00] Instrumental melody\n[00:20.00] Musical expression\n[00:35.00] Harmonic flow'
      : this.toLrcFormat(lyricsText || prompt || '', tempoBpm);

    const stylePrompt = this.buildStylePrompt(genre, mood, isInstrumental ? 'none' : vocalGender, tempoBpm);

    try {
      console.log(`[DiffRhythm] Connecting to HuggingFace Space: ${this.spaceId}`);
      console.log(`[DiffRhythm] Style: ${stylePrompt}`);

      const client = await Client.connect(this.spaceId);

      const result = await client.predict('/infer_music', {
        lrc: lyricsToUse,
        ref_audio_path: null,
        text_prompt: stylePrompt,
        current_prompt_type: 'Text Prompt',
        seed: Math.floor(Math.random() * 100000),
        randomize_seed: true,
        steps: 32,
        cfg_strength: 4.0,
        file_type: 'wav',
        odeint_method: 'euler',
        Music_Duration: '95s',
      });

      const data = result.data as unknown[];
      if (!data || data.length === 0) {
        throw new Error('Aucun flux audio renvoyé par DiffRhythm.');
      }

      // Le résultat peut être un chemin de fichier ou un objet audio
      const audioResult = data[0];
      let audioUrl: string | undefined;

      if (typeof audioResult === 'string') {
        audioUrl = audioResult;
      } else if (audioResult && typeof audioResult === 'object') {
        const obj = audioResult as { url?: string; path?: string; name?: string };
        audioUrl = obj.url || obj.path || obj.name;
      }

      if (!audioUrl) {
        throw new Error("Impossible d'extraire l'URL audio de la réponse DiffRhythm.");
      }

      console.log('[DiffRhythm] Audio generated successfully:', audioUrl);

      return {
        success: true,
        isEngineReady: true,
        providerId: 'diffrhythm',
        statusMessage: 'Chanson générée avec succès par DiffRhythm (Voix chantées réelles) !',
        track: {
          id: `diffrhythm-${Date.now()}`,
          title: prompt?.slice(0, 32) || `${genre.toUpperCase()} DiffRhythm Song`,
          genre: genre,
          bpm: tempoBpm,
          durationSeconds: 95,
          audioUrl: audioUrl,
          prompt: prompt || stylePrompt,
          lyrics: lyricsText || lyricsToUse,
          vocalGender: isInstrumental ? 'none' : vocalGender,
          mood: mood,
          language: request.params.language,
          isInstrumental: isInstrumental,
          createdAt: new Date().toISOString(),
          creatorName: 'DiffRhythm IA (ASLP-lab)',
          status: 'ready',
          tags: [genre, `${tempoBpm} BPM`, 'DiffRhythm', 'Chant IA Gratuit'],
          likesCount: 0,
        },
      };
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[DiffRhythm] Generation error:', error.message);
      return {
        success: false,
        isEngineReady: true, // Le modèle existe, c'est une erreur transitoire
        providerId: 'diffrhythm',
        statusMessage: `Erreur DiffRhythm : ${error.message}`,
        error: error.message,
      };
    }
  }
}

