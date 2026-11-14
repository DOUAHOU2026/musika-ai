'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Track } from '@/types';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentLyricLine: string;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  pauseTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerContextType>({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  currentLyricLine: '',
  playTrack: () => {},
  togglePlay: () => {},
  pauseTrack: () => {},
  seek: () => {},
  setVolume: () => {},
});

// Gammes et accords harmoniques riches par genre musical
const GENRE_SCALES: Record<string, { chords: number[][]; bass: number[]; kickPattern: number[]; name: string }> = {
  afrobeat: {
    chords: [
      [293.66, 349.23, 440.0, 523.25], // D4, F4, A4, C5
      [196.0, 261.63, 293.66, 349.23],  // G3, C4, D4, F4
      [220.0, 261.63, 329.63, 392.0],   // A3, C4, E4, G4
      [293.66, 349.23, 440.0, 523.25], // D4, F4, A4, C5
    ],
    bass: [73.42, 98.0, 110.0, 73.42], // D2, G2, A2, D2
    kickPattern: [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    name: 'Afrobeat',
  },
  amapiano: {
    chords: [
      [369.99, 440.0, 554.37, 659.25], // F#4, A4, C#5, E5
      [246.94, 293.66, 369.99, 440.0], // B3, D4, F#4, A4
      [164.81, 196.0, 246.94, 293.66],  // E3, G3, B3, D4
      [220.0, 277.18, 329.63, 392.0],   // A3, C#4, E4, G4
    ],
    bass: [46.25, 61.74, 82.41, 55.0], // F#1, B1, E2, A1
    kickPattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    name: 'Amapiano',
  },
  'coupe-decale': {
    chords: [
      [261.63, 329.63, 392.0, 523.25], // C4, E4, G4, C5
      [349.23, 440.0, 523.25, 698.46], // F4, A4, C5, F5
      [392.0, 493.88, 587.33, 783.99], // G4, B4, D5, G5
      [261.63, 329.63, 392.0, 523.25], // C4, E4, G4, C5
    ],
    bass: [65.41, 87.31, 98.0, 65.41],
    kickPattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    name: 'Coupé-décalé',
  },
  zouglou: {
    chords: [
      [220.0, 261.63, 329.63, 440.0],  // A3, C4, E4, A4
      [174.61, 220.0, 261.63, 349.23], // F3, A3, C4, F4
      [261.63, 329.63, 392.0, 523.25], // C4, E4, G4, C5
      [196.0, 246.94, 293.66, 392.0],  // G3, B3, D4, G4
    ],
    bass: [55.0, 43.65, 65.41, 49.0],
    kickPattern: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
    name: 'Zouglou',
  },
  'traditional-african': {
    chords: [
      [293.66, 369.99, 440.0, 587.33], // D4, F#4, A4, D5
      [329.63, 392.0, 493.88, 659.25], // E4, G4, B4, E5
      [369.99, 440.0, 554.37, 739.99], // F#4, A4, C#5, F#5
      [293.66, 369.99, 440.0, 587.33], // D4, F#4, A4, D5
    ],
    bass: [73.42, 82.41, 92.5, 73.42],
    kickPattern: [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    name: 'Traditionnel',
  },
};

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(120);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [currentLyricLine, setCurrentLyricLine] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const sequencerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStepRef = useRef<number>(0);

  // Synchronisation du chronomètre de lecture
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration]);

  // Arrêt complet du lecteur
  const stopWebAudioDemo = useCallback(() => {
    if (sequencerIntervalRef.current) {
      clearInterval(sequencerIntervalRef.current);
      sequencerIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // Ignore
      }
      audioCtxRef.current = null;
    }
    masterGainRef.current = null;
    currentStepRef.current = 0;
    setCurrentLyricLine('');
  }, []);

  // Moteur musical Web Audio DAW (Vrais rythmes, percussions et harmonies)
  const playWebAudioDemo = useCallback((trackGenre: string, bpm: number) => {
    stopWebAudioDemo();

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-20, ctx.currentTime);
      compressor.knee.setValueAtTime(40, ctx.currentTime);
      compressor.ratio.setValueAtTime(8, ctx.currentTime);
      compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      compressor.release.setValueAtTime(0.25, ctx.currentTime);
      compressor.connect(ctx.destination);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      masterGain.connect(compressor);
      masterGainRef.current = masterGain;

      const genreConfig = GENRE_SCALES[trackGenre] || GENRE_SCALES.afrobeat;
      const stepDurationMs = (60 / bpm / 4) * 1000;

      const triggerKick = (time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, time);
        osc.frequency.exponentialRampToValueAtTime(38, time + 0.18);
        gain.gain.setValueAtTime(0.9, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(time);
        osc.stop(time + 0.25);
      };

      const triggerShaker = (time: number, isAccent: boolean) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isAccent ? 3500 : 2800, time);
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1800, time);

        gain.gain.setValueAtTime(isAccent ? 0.15 : 0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.start(time);
        osc.stop(time + 0.06);
      };

      const triggerBass = (freq: number, time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, time);
        filter.Q.setValueAtTime(2, time);

        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.start(time);
        osc.stop(time + 0.4);
      };

      const triggerChord = (notes: number[], time: number) => {
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = trackGenre === 'traditional-african' ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, time);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1600, time);

          gain.gain.setValueAtTime(0.06, time + idx * 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);
          osc.start(time + idx * 0.02);
          osc.stop(time + 0.7);
        });
      };

      sequencerIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        const step = currentStepRef.current % 16;
        const chordIndex = Math.floor(step / 4);

        if (genreConfig.kickPattern[step] === 1) {
          triggerKick(now);
        }

        const isAccent = step % 4 === 2 || step % 4 === 3;
        triggerShaker(now, isAccent);

        if (step === 0 || step === 6 || step === 8 || step === 12) {
          triggerBass(genreConfig.bass[chordIndex], now);
        }

        if (step % 4 === 0) {
          triggerChord(genreConfig.chords[chordIndex], now);
        }

        currentStepRef.current = step + 1;
      }, stepDurationMs);
    } catch {
      // Ignorer si permissions restreintes
    }
  }, [stopWebAudioDemo, volume]);

  // Écouteurs sur l'élément audio HTML5 natif pour les vrais fichiers MP3
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playTrack = (track: Track) => {
    stopWebAudioDemo();
    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.durationSeconds || 120);
    setIsPlaying(true);

    if (track.audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.volume = volume;
        audioRef.current.play().catch(() => {});
      }
    } else {
      // Si pas de fichier MP3, utilise le groove musical polyphonique
      playWebAudioDemo(track.genre, track.bpm);
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopWebAudioDemo();
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      setIsPlaying(true);
      if (currentTrack.audioUrl && audioRef.current) {
        audioRef.current.play().catch(() => {});
      } else {
        playWebAudioDemo(currentTrack.genre, currentTrack.bpm);
      }
    }
  };

  const seek = (seconds: number) => {
    setCurrentTime(seconds);
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (masterGainRef.current && audioCtxRef.current) {
      try {
        masterGainRef.current.gain.setValueAtTime(val * 0.4, audioCtxRef.current.currentTime);
      } catch {
        // Ignore
      }
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        currentLyricLine,
        playTrack,
        togglePlay,
        pauseTrack,
        seek,
        setVolume,
      }}
    >
      <audio ref={audioRef} />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
