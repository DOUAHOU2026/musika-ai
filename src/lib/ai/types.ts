import { StudioGenerationParams, Track } from '@/types';

export type ProviderStatus = 'configured' | 'pending_api_key' | 'coming_soon' | 'maintenance';

export interface ProviderInfo {
  id: string;
  name: string;
  description: string;
  status: ProviderStatus;
  supportsVocals: boolean;
  supportsCustomLyrics: boolean;
  maxDurationSeconds: number;
  documentationUrl?: string;
}

export interface GenerationRequest {
  params: StudioGenerationParams;
  userId?: string;
}

export interface GenerationResponse {
  success: boolean;
  track?: Track;
  statusMessage: string;
  isEngineReady: boolean;
  providerId: string;
  error?: string;
  estimatedDurationMs?: number;
}

export interface MusicEngineProvider {
  getInfo(): ProviderInfo;
  isAvailable(): boolean;
  generateMusic(request: GenerationRequest): Promise<GenerationResponse>;
}

