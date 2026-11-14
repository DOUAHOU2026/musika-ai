import { MusicEngineProvider, ProviderInfo, GenerationRequest, GenerationResponse } from '../types';

/**
 * Adaptateur pour MusicGen (AudioCraft / HuggingFace Inference).
 * Alternative open-source respectant le budget 0 €.
 */
export class MusicGenProvider implements MusicEngineProvider {
  protected apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.HUGGINGFACE_API_KEY;
  }

  getInfo(): ProviderInfo {
    const isConfigured = Boolean(this.apiKey && this.apiKey.length > 5);

    return {
      id: 'musicgen-open',
      name: 'MusicGen Open Source',
      description: 'Modèle audio ouvert basé sur AudioCraft (Meta / Hugging Face).',
      status: isConfigured ? 'configured' : 'pending_api_key',
      supportsVocals: false,
      supportsCustomLyrics: false,
      maxDurationSeconds: 60,
      documentationUrl: 'https://huggingface.co/facebook/musicgen-small',
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
        providerId: 'musicgen-open',
        statusMessage: `Moteur MusicGen en attente de configuration pour le genre ${request.params.genre}. Renseignez une clé Hugging Face (gratuite) pour activer l’inférence.`,
        error: 'ENGINE_PENDING_CONFIGURATION',
      };
    }

    return {
      success: false,
      isEngineReady: true,
      providerId: 'musicgen-open',
      statusMessage: 'Connexion MusicGen prête.',
    };
  }
}
