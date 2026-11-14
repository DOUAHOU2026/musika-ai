import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@gradio/client';
import { DiffRhythmProvider } from '@/lib/ai/providers/diffrhythm';
import { YuE2Provider } from '@/lib/ai/providers/yue2';
import { MusicGenreId, VocalGender, MusicMood, SongLanguage } from '@/types';

type FreeProvider = 'diffrhythm' | 'yue2' | 'musicgen';

/**
 * Route API unifiée pour la génération musicale gratuite via HuggingFace Spaces.
 * Supporte DiffRhythm, YuE2 et MusicGen (tous 100% gratuits).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      provider = 'diffrhythm',
      prompt,
      lyrics,
      genre = 'afrobeat',
      vocalGender = 'male',
      mood = 'energetic',
      tempoBpm = 104,
      isInstrumental = false,
      language = 'fr',
    } = body as {
      provider: FreeProvider;
      prompt: string;
      lyrics: string;
      genre: MusicGenreId;
      vocalGender: VocalGender;
      mood: MusicMood;
      tempoBpm: number;
      isInstrumental: boolean;
      language: SongLanguage;
    };

    const request = {
      params: {
        prompt,
        genre,
        lyricsMode: (isInstrumental ? 'instrumental' : lyrics ? 'custom' : 'ai-generated') as 'instrumental' | 'custom' | 'ai-generated',
        lyricsText: lyrics || '',
        vocalGender,
        mood,
        tempoBpm,
        language,
        structureIntroChorusOutro: true,
        provider: 'musicgen' as 'lyria' | 'musicgen' | 'custom' | 'unconfigured',
      },
    };

    if (provider === 'diffrhythm') {
      console.log('[Free API] Using DiffRhythm (ASLP-lab) — 100% free');
      const diffRhythm = new DiffRhythmProvider();
      const result = await diffRhythm.generateMusic(request);
      return NextResponse.json(result);
    }

    if (provider === 'yue2') {
      console.log('[Free API] Using YuE2 (HKUST/M-A-P) — 100% free');
      const yue2 = new YuE2Provider();
      const result = await yue2.generateMusic(request);
      return NextResponse.json(result);
    }

    if (provider === 'musicgen') {
      console.log('[Free API] Using Meta MusicGen — 100% free instrumental');
      const apiKey = process.env.HUGGINGFACE_API_KEY || 'YOUR_HF_API_KEY'; // Replace with your Hugging Face API key (do not commit actual secret)
      const fullPrompt = `${genre} music, ${prompt || 'energetic groove with percussion and brass'}, ${tempoBpm} BPM, ${mood}, studio quality`;

      const app = await Client.connect('facebook/MusicGen', {
        token: (apiKey.startsWith('hf_') ? apiKey : `hf_${apiKey}`) as `hf_${string}`,
      });

      const result = await app.predict('/predict_batched', [fullPrompt, null]);
      const data = result.data as unknown[];
      if (!data || data.length === 0) throw new Error('Aucun audio MusicGen généré.');

      const audioObj = data[0] as { url?: string; path?: string };
      const audioUrl = audioObj?.url || audioObj?.path;
      if (!audioUrl) throw new Error('URL audio MusicGen introuvable.');

      return NextResponse.json({
        success: true,
        isEngineReady: true,
        providerId: 'musicgen',
        statusMessage: 'Instrumental MusicGen généré avec succès !',
        track: {
          id: `musicgen-${Date.now()}`,
          title: prompt?.slice(0, 32) || `${genre.toUpperCase()} Instrumental`,
          genre,
          bpm: tempoBpm,
          durationSeconds: 30,
          audioUrl,
          prompt,
          vocalGender: 'none',
          mood,
          language,
          isInstrumental: true,
          createdAt: new Date().toISOString(),
          creatorName: 'Meta MusicGen IA',
          status: 'ready',
          tags: [genre, `${tempoBpm} BPM`, 'Instrumental', 'MusicGen'],
          likesCount: 0,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provider non reconnu. Utilisez diffrhythm, yue2 ou musicgen.' },
      { status: 400 }
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[Free API] Error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur interne' },
      { status: 500 }
    );
  }
}

/**
 * GET — Infos sur les providers gratuits disponibles
 */
export async function GET() {
  return NextResponse.json({
    providers: [
      {
        id: 'diffrhythm',
        name: 'DiffRhythm (ASLP-lab)',
        free: true,
        supportsVocals: true,
        maxDuration: '95s',
        space: 'https://huggingface.co/spaces/ASLP-lab/DiffRhythm',
      },
      {
        id: 'yue2',
        name: 'YuE2 (HKUST/M-A-P)',
        free: true,
        supportsVocals: true,
        maxDuration: '240s',
        space: 'https://huggingface.co/spaces/mrfakename/yue2-3b',
      },
      {
        id: 'musicgen',
        name: 'Meta MusicGen',
        free: true,
        supportsVocals: false,
        maxDuration: '30s',
        space: 'https://huggingface.co/spaces/facebook/MusicGen',
      },
    ],
  });
}

