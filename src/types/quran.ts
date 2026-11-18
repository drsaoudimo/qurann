export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  juz: number;
  page: number;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  tafsir?: string;
  translation?: string;
  juz?: number;
  page?: number;
  sajda?: boolean;
}

export interface Reciter {
  id: string;
  name: string;
  englishName: string;
  subfolder: string;
  riwayah: string;
  style: 'مرتل' | 'مجود' | 'معلم';
  archiveIdentifier?: string;
  bitrate?: string;
}

export type AudioSourceType = 'everyayah' | 'archive' | 'cloud';

export type LoopMode = 'none' | 'verse' | 'range' | 'surah';

export interface PlaybackState {
  isPlaying: boolean;
  surahNumber: number;
  ayahNumberInSurah: number;
  reciterId: string;
  playbackSpeed: number;
  loopMode: LoopMode;
  repeatTimes: number; // e.g. 1, 2, 3, 5, Infinity
  currentRepeatCount: number;
  rangeStartAyah: number;
  rangeEndAyah: number;
  delayBetweenAyahs: number; // in seconds (e.g., 0, 1, 2, 3, 5)
  sourceType: AudioSourceType;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  createdAt: number;
  note?: string;
}

export interface LastReadPosition {
  surahNumber: number;
  ayahNumber: number;
  timestamp: number;
}

export type AppTheme = 'paper' | 'dark' | 'emerald' | 'navy' | 'sepia';

export interface AppSettings {
  fontFamily: 'font-quran' | 'font-amiri' | 'font-scheherazade';
  fontSize: number; // in px, e.g. 26 to 48
  showTranslation: boolean;
  showTafsirInline: boolean;
  theme: AppTheme;
  audioSource: AudioSourceType;
  memorizationMode: boolean; // hide text with blur/mask for testing memory
}
