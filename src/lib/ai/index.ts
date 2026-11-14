import { MusicEngineProvider, ProviderInfo, GenerationRequest, GenerationResponse } from './types';
import { GoogleLyriaProvider } from './providers/lyria';
import { MusicGenProvider } from './providers/musicgen';
import { SunoAiProvider } from './providers/suno';
import { DiffRhythmProvider } from './providers/diffrhythm';
import { YuE2Provider } from './providers/yue2';

export class MusicEngineManager {
  private static providers: Map<string, MusicEngineProvider> = new Map<string, MusicEngineProvider>([
    // Moteurs GRATUITS (100% HuggingFace — aucune clé requise)
    ['diffrhythm', new DiffRhythmProvider()],
    ['yue2', new YuE2Provider()],
    ['musicgen', new MusicGenProvider()],
    // Moteurs premium (clé API requise)
    ['suno', new SunoAiProvider()],
    ['lyria', new GoogleLyriaProvider()],
  ]);

  static getAvailableProviders(): ProviderInfo[] {
    return Array.from(this.providers.values()).map((provider) => provider.getInfo());
  }

  static getFreeProviders(): ProviderInfo[] {
    return ['diffrhythm', 'yue2', 'musicgen']
      .map((id) => this.providers.get(id))
      .filter(Boolean)
      .map((p) => p!.getInfo());
  }

  static getProvider(id: string): MusicEngineProvider | undefined {
    return this.providers.get(id);
  }

  static async requestGeneration(request: GenerationRequest): Promise<GenerationResponse> {
    const providerKey = request.params.provider === 'musicgen'
      ? 'musicgen'
      : request.params.provider === 'lyria'
      ? 'lyria'
      : 'diffrhythm'; // Défaut : DiffRhythm (gratuit avec chant)

    const provider = this.providers.get(providerKey);

    if (!provider) {
      return {
        success: false,
        isEngineReady: false,
        providerId: 'unknown',
        statusMessage: 'Aucun moteur d\u2019intelligence artificielle sélectionné.',
        error: 'NO_PROVIDER_SELECTED',
      };
    }

    return await provider.generateMusic(request);
  }
}

export * from './types';
export * from './lyrics-generator';
export * from './providers/suno';
export * from './providers/diffrhythm';
export * from './providers/yue2';
