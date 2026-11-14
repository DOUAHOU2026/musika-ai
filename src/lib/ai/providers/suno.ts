import { MusicEngineProvider, ProviderInfo, GenerationRequest, GenerationResponse } from '../types';

/**
 * Adaptateur pour l'API Suno AI (V3.5 / V4).
 * Génère de véritables chansons complètes avec voix humaines chantées,
 * couplets, refrains et arrangements instrumentaux de qualité commerciale.
 */
export class SunoAiProvider implements MusicEngineProvider {
  protected apiKey: string | undefined;
  protected apiEndpoint: string;

  constructor(apiKey?: string, endpoint?: string) {
    this.apiKey = apiKey || process.env.SUNO_API_KEY;
    this.apiEndpoint = endpoint || process.env.SUNO_API_URL || 'https://api.aimusicapi.ai/api/v1/sonic';
  }

  getInfo(): ProviderInfo {
    const isConfigured = Boolean(this.apiKey && this.apiKey.length > 5);

    return {
      id: 'suno-ai',
      name: 'Suno AI v3.5 / v4 (Moteur Chant & Voix Humaine)',
      description: 'Moteur de pointe mondial générant de vraies voix chantées réalistes (Afrobeat, RnB, Coupé-décalé, etc.) et des productions musicales complètes.',
      status: isConfigured ? 'configured' : 'pending_api_key',
      supportsVocals: true,
      supportsCustomLyrics: true,
      maxDurationSeconds: 240,
      documentationUrl: 'https://suno.com',
    };
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  async generateMusic(request: GenerationRequest): Promise<GenerationResponse> {
    if (!this.isAvailable()) {
      return {
        success: false,
        isEngineReady: false,
        providerId: 'suno-ai',
        statusMessage:
          'Clé Suno API manquante. Renseignez votre clé SUNO_API_KEY dans votre fichier .env.local ou dans votre Profil pour activer la génération vocale réelle.',
        error: 'SUNO_KEY_REQUIRED',
      };
    }

    try {
      const isCustom = request.params.lyricsMode === 'custom' && Boolean(request.params.lyricsText);
      const vocalTag =
        request.params.vocalGender === 'female'
          ? 'female lead vocals'
          : request.params.vocalGender === 'duet'
          ? 'male and female duet vocals'
          : 'male lead vocals';
      const fullTags = `${request.params.genre}, ${vocalTag}, ${request.params.mood}, ${request.params.tempoBpm} BPM, radio production`;

      const createRes = await fetch(`${this.apiEndpoint}/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: isCustom ? request.params.lyricsText : request.params.prompt,
          tags: fullTags,
          title: request.params.prompt?.slice(0, 40) || `${request.params.genre.toUpperCase()} Hit`,
          instrumental: request.params.lyricsMode === 'instrumental',
          mv: 'chirp-v4',
        }),
      });

      if (!createRes.ok) {
        const errorText = await createRes.text();
        throw new Error(`Suno API error (${createRes.status}): ${errorText}`);
      }

      const taskData = await createRes.json();
      const taskId = taskData.task_id || taskData.id || taskData.data?.task_id;

      return {
        success: true,
        isEngineReady: true,
        providerId: 'suno-ai',
        statusMessage: 'Tâche de génération vocale Suno initiée avec succès.',
        track: {
          id: taskId || `suno-${Date.now()}`,
          title: request.params.prompt?.slice(0, 32) || 'Suno AI Vocal Track',
          genre: request.params.genre,
          bpm: request.params.tempoBpm,
          durationSeconds: 180,
          audioUrl: taskData.audio_url || taskData.data?.audio_url || undefined,
          prompt: request.params.prompt,
          lyrics: request.params.lyricsText,
          vocalGender: request.params.vocalGender,
          mood: request.params.mood,
          language: request.params.language,
          isInstrumental: request.params.lyricsMode === 'instrumental',
          createdAt: new Date().toISOString(),
          creatorName: 'Suno AI Vocal Model (v4)',
          status: 'generating',
          tags: [request.params.genre, `${request.params.tempoBpm} BPM`, 'Chant IA Suno'],
          likesCount: 0,
        },
      };
    } catch (err: unknown) {
      const error = err as Error;
      return {
        success: false,
        isEngineReady: false,
        providerId: 'suno-ai',
        statusMessage: `Erreur lors de l'appel à l'API Suno: ${error.message}`,
        error: error.message,
      };
    }
  }
}
