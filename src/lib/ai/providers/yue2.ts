import { Client } from '@gradio/client';
import { MusicEngineProvider, ProviderInfo, GenerationRequest, GenerationResponse } from '../types';

/**
 * YuE2 (HKUST / M-A-P) — Génération de chanson GRATUITE via HuggingFace Spaces.
 * Génère des chansons complètes avec vraies voix IA en utilisant des paroles
 * structurées en sections [Verse], [Chorus], [Bridge].
 * Aucune clé API requise — 100% gratuit.
 */
export class YuE2Provider implements MusicEngineProvider {
  private readonly spaceId = 'mrfakename/yue2-3b';

  getInfo(): ProviderInfo {
    return {
      id: 'yue2',
      name: 'YuE2 (HKUST/M-A-P) — Gratuit 🎤',
      description:
        'Modèle de génération musicale de pointe (HKUST) : compose des chansons complètes avec voix chantées en tout genre africain. 100% gratuit via HuggingFace.',
      status: 'configured',
      supportsVocals: true,
      supportsCustomLyrics: true,
      maxDurationSeconds: 240,
      documentationUrl: 'https://huggingface.co/spaces/mrfakename/yue2-3b',
    };
  }

  isAvailable(): boolean {
    return true;
  }

  /**
   * Nettoie et structure les paroles au format attendu par YuE2 (sections [Verse], [Chorus], etc.)
   */
  private formatLyricsForYuE(lyricsText: string): string {
    if (!lyricsText.trim()) {
      return '[verse]\nMelodic vocal expression\nRhythmic harmony rising\n\n[chorus]\nFeel the music, feel the soul\nLet the rhythm take control';
    }

    // Si déjà au bon format (contient [Verse] ou [Couplet], etc.)
    if (
      lyricsText.match(/\[(verse|couplet|chorus|refrain|bridge|intro|outro)\]/i)
    ) {
      // Normaliser les tags en anglais (YuE attend anglais)
      return lyricsText
        .replace(/\[couplet\s*\d*\]/gi, '[verse]')
        .replace(/\[refrain\]/gi, '[chorus]')
        .replace(/\[intro\]/gi, '[intro]')
        .replace(/\[outro\]/gi, '[outro]')
        .replace(/\[pont\]/gi, '[bridge]')
        .replace(/=== STRUCTURE.*===/gi, '')
        .trim();
    }

    // Découper les paroles en sections intelligemment
    const lines = lyricsText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('===') && !l.startsWith('('));

    if (lines.length <= 4) {
      return `[verse]\n${lines.slice(0, 2).join('\n')}\n\n[chorus]\n${lines.slice(2).join('\n')}`;
    }

    const mid = Math.floor(lines.length / 2);
    return `[verse]\n${lines.slice(0, mid).join('\n')}\n\n[chorus]\n${lines.slice(mid).join('\n')}`;
  }

  /**
   * Construit le style descriptor pour YuE2 avec les caractéristiques musicales africaines.
   */
  private buildStyleDescriptor(genre: string, mood: string, vocalGender: string, bpm: number): string {
    const genreMap: Record<string, string> = {
      afrobeat: 'Afrobeat, West African groove, brass section, talking drum, melodic guitar riffs',
      'coupe-decale': 'Coupé-décalé, Ivorian dance music, frenetic percussion, festive atmosphere',
      zouglou: 'Zouglou, Ivorian folk music, acoustic guitar, hand percussion, philosophical lyrics',
      amapiano: 'Amapiano, South African piano house, log drum bass, jazzy chords, smooth groove',
      'rap-ivoirien': 'Ivorian rap, nouchi slang flow, trap 808 bass, urban African street sound',
      drill: 'Afro drill, sliding 808 bass, dark piano stabs, rapid hi-hats, aggressive flow',
      gospel: 'African gospel, mass choir, organ, worship, uplifting praise',
      rnb: 'African R&B, Neo soul, Rhodes piano, smooth bass, tender vocals',
      reggae: 'Roots reggae, skank guitar, dub bass, one-drop rhythm, Rastafari spirit',
      dancehall: 'Dancehall, Jamaican riddim, bouncy bass, energetic dance',
      'hip-hop': 'African hip-hop, boom bap, sample chopping, wordplay, lyricism',
      'traditional-african': 'Traditional African music, kora, balafon, djembe, griot storytelling, pentatonic',
    };

    const moodMap: Record<string, string> = {
      energetic: 'energetic, vibrant, uplifting',
      festive: 'festive, joyful, party',
      nostalgic: 'nostalgic, warm, emotional',
      spiritual: 'spiritual, sacred, transcendent',
      melancholic: 'melancholic, bittersweet, introspective',
      romantic: 'romantic, intimate, passionate',
      epic: 'epic, powerful, cinematic',
      chill: 'relaxed, smooth, laid-back',
    };

    const vocalDesc =
      vocalGender === 'female'
        ? 'female lead vocal, beautiful soprano range, clear articulation'
        : vocalGender === 'duet'
        ? 'male and female harmony vocals, call and response singing'
        : 'male lead vocal, baritone, expressive singing';

    return `${genreMap[genre] || genre}, ${vocalDesc}, ${moodMap[mood] || mood}, ${bpm} BPM, studio quality production`;
  }

  async generateMusic(request: GenerationRequest): Promise<GenerationResponse> {
    const { genre, mood, vocalGender, tempoBpm, lyricsText, lyricsMode, prompt } = request.params;

    const isInstrumental = lyricsMode === 'instrumental';
    const formattedLyrics = isInstrumental
      ? '[verse]\nInstrumental musical expression\nMelodic journey without words\n\n[chorus]\nPure music speaking\nSoul of the rhythm'
      : this.formatLyricsForYuE(lyricsText || prompt || '');

    const styleDescriptor = this.buildStyleDescriptor(genre, mood, isInstrumental ? 'none' : vocalGender, tempoBpm);

    try {
      console.log(`[YuE2] Connecting to HuggingFace Space: ${this.spaceId}`);
      console.log(`[YuE2] Style: ${styleDescriptor}`);

      const client = await Client.connect(this.spaceId);

      const result = await client.predict('/generate_song', {
        style: styleDescriptor,
        lyrics: formattedLyrics,
        planning_mode: 'Melody + chords',
        render_quality: 'Fast · 16 steps',
        seed: Math.floor(Math.random() * 999999),
      });

      const data = result.data as unknown[];
      if (!data || data.length === 0) {
        throw new Error('Aucun flux audio renvoyé par YuE2.');
      }

      const audioResult = data[0];
      let audioUrl: string | undefined;

      if (typeof audioResult === 'string') {
        audioUrl = audioResult;
      } else if (audioResult && typeof audioResult === 'object') {
        const obj = audioResult as { url?: string; path?: string; name?: string };
        audioUrl = obj.url || obj.path || obj.name;
      }

      if (!audioUrl) {
        throw new Error("Impossible d'extraire l'URL audio de la réponse YuE2.");
      }

      console.log('[YuE2] Audio generated successfully:', audioUrl);

      return {
        success: true,
        isEngineReady: true,
        providerId: 'yue2',
        statusMessage: 'Chanson générée avec succès par YuE2 (Chant IA HKUST) !',
        track: {
          id: `yue2-${Date.now()}`,
          title: prompt?.slice(0, 32) || `${genre.toUpperCase()} YuE2 Song`,
          genre: genre,
          bpm: tempoBpm,
          durationSeconds: 180,
          audioUrl: audioUrl,
          prompt: prompt || styleDescriptor,
          lyrics: lyricsText || formattedLyrics,
          vocalGender: isInstrumental ? 'none' : vocalGender,
          mood: mood,
          language: request.params.language,
          isInstrumental: isInstrumental,
          createdAt: new Date().toISOString(),
          creatorName: 'YuE2 IA (HKUST/M-A-P)',
          status: 'ready',
          tags: [genre, `${tempoBpm} BPM`, 'YuE2', 'Chant IA Gratuit'],
          likesCount: 0,
        },
      };
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[YuE2] Generation error:', error.message);
      return {
        success: false,
        isEngineReady: true,
        providerId: 'yue2',
        statusMessage: `Erreur YuE2 : ${error.message}`,
        error: error.message,
      };
    }
  }
}

