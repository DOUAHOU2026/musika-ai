import { MusicEngineProvider, ProviderInfo, GenerationRequest, GenerationResponse } from '../types';

/**
 * Adaptateur officiel prévu pour Google Lyria (DeepMind).
 * Lyria est le modèle de pointe de Google pour la génération musicale.
 * Si l'API officielle publique n'est pas encore accessible ou si aucune clé n'est configurée,
 * l'adaptateur refuse expressément de feindre une génération et affiche un statut transparent.
 */
export class GoogleLyriaProvider implements MusicEngineProvider {
  protected apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_LYRIA_API_KEY;
  }

  getInfo(): ProviderInfo {
    const isConfigured = Boolean(this.apiKey && this.apiKey.length > 5);

    return {
      id: 'google-lyria',
      name: 'Google Lyria (DeepMind)',
      description: 'Moteur de génération musicale haute fidélité développé par Google DeepMind.',
      status: isConfigured ? 'configured' : 'pending_api_key',
      supportsVocals: true,
      supportsCustomLyrics: true,
      maxDurationSeconds: 180,
      documentationUrl: 'https://deepmind.google/technologies/lyria/',
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
        providerId: 'google-lyria',
        statusMessage: `Le connecteur Google Lyria est prêt pour le genre ${request.params.genre}, mais aucune clé API active n’est configurée (Budget 0 € conservé). Aucune génération factice n’a été déclenchée.`,
        error: 'ENGINE_PENDING_CONFIGURATION',
      };
    }

    // Lorsque l'API Google Lyria sera accessible au public via Google AI Studio / Vertex AI,
    // l'appel HTTP streaming ou REST se branchera directement ici.
    return {
      success: false,
      isEngineReady: true,
      providerId: 'google-lyria',
      statusMessage: 'Intégration Lyria en phase de test de connectivité.',
      error: 'API_ENDPOINT_NOT_FINALIZED',
    };
  }
}
