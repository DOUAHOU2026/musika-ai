export type MusicGenreId =
  | 'afrobeat'
  | 'coupe-decale'
  | 'zouglou'
  | 'amapiano'
  | 'rap-ivoirien'
  | 'drill'
  | 'gospel'
  | 'rnb'
  | 'reggae'
  | 'dancehall'
  | 'hip-hop'
  | 'traditional-african';

export interface MusicGenre {
  id: MusicGenreId;
  name: string;
  origin: string;
  descriptionFr: string;
  descriptionEn: string;
  icon: string;
  defaultBpm: number;
  popularInstruments: string[];
}

export type VocalGender = 'male' | 'female' | 'duet' | 'none';

export type MusicMood =
  | 'energetic'
  | 'festive'
  | 'nostalgic'
  | 'spiritual'
  | 'melancholic'
  | 'romantic'
  | 'epic'
  | 'chill';

export type SongLanguage =
  | 'fr'
  | 'en'
  | 'lingala'
  | 'yoruba'
  | 'baoule'
  | 'swahili'
  | 'pidgin'
  | 'wolof'
  | 'instrumental';

export interface StudioGenerationParams {
  prompt: string;
  genre: MusicGenreId;
  lyricsMode: 'custom' | 'ai-generated' | 'instrumental';
  lyricsText: string;
  lyricsTopic?: string;
  vocalGender: VocalGender;
  mood: MusicMood;
  tempoBpm: number;
  language: SongLanguage;
  structureIntroChorusOutro: boolean;
  provider: 'lyria' | 'musicgen' | 'custom' | 'unconfigured';
}

export interface Track {
  id: string;
  title: string;
  genre: MusicGenreId;
  bpm: number;
  durationSeconds: number;
  audioUrl?: string;
  coverUrl?: string;
  prompt: string;
  lyrics?: string;
  vocalGender: VocalGender;
  mood: MusicMood;
  language: SongLanguage;
  isInstrumental: boolean;
  createdAt: string;
  creatorName: string;
  status: 'ready' | 'generating' | 'queued' | 'mock-demo';
  tags: string[];
  likesCount: number;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  plan: 'free' | 'creator' | 'studio-pro';
  remainingCredits: number;
  totalCreatedTracks: number;
  createdAt: string;
  preferredLanguage: 'fr' | 'en';
}

export type SupportedLocale = 'fr' | 'en';

