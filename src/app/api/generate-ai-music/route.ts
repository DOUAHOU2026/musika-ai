import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@gradio/client';

export async function POST(req: NextRequest) {
  try {
    const { prompt, genre, mood, tempoBpm } = await req.json();

    const apiKey = process.env.HUGGINGFACE_API_KEY || 'YOUR_HF_API_KEY'; // Replace with your Hugging Face API key (do not commit actual secret)

    // Construction d'un prompt d'ingénierie musicale optimisé pour MusicGen
    const fullPrompt = `${genre || 'afrobeat'} music, ${prompt || 'energetic groove with percussion and brass'}, tempo ${tempoBpm || 104} BPM, ${mood || 'energetic'}, high studio fidelity production`;

    console.log('[AI MusicGen] Connecting to facebook/MusicGen space with prompt:', fullPrompt);

    const app = await Client.connect('facebook/MusicGen', {
      token: (apiKey.startsWith('hf_') ? apiKey : `hf_${apiKey}`) as `hf_${string}`,
    });

    // Appel à l'inférence neuronale de Meta MusicGen
    const result = await app.predict('/predict_batched', [
      fullPrompt,
      null, // pas de mélodie audio d'entrée (text-to-music pur)
    ]);

    const data = result.data as unknown[];
    if (!data || data.length === 0) {
      throw new Error('Aucun flux audio généré par le modèle.');
    }

    const audioObj = data[0] as { url?: string; path?: string };
    const audioUrl = audioObj?.url || audioObj?.path;

    if (!audioUrl) {
      throw new Error('URL du fichier audio généré introuvable.');
    }

    console.log('[AI MusicGen] Audio generated successfully:', audioUrl);

    return NextResponse.json({
      success: true,
      audioUrl: audioUrl,
      title: `${genre?.toUpperCase() || 'AFROBEAT'} - AI Composition`,
      prompt: fullPrompt,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[AI MusicGen] Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Échec de la génération audio par IA.',
      },
      { status: 500 }
    );
  }
}

