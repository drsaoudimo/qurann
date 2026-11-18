import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Layers, 
  Mic2, 
  Share2, 
  RotateCcw,
  Volume2,
  Check,
  Search,
  Palette,
  Columns,
  ListFilter
} from 'lucide-react';

import { SURAHS_LIST } from './data/surahs';
import { RECITERS_LIST } from './data/reciters';
import { INITIAL_FATIHA_AYAHS } from './data/initialSurahs';
import { 
  SurahMeta, 
  Ayah, 
  Reciter, 
  PlaybackState, 
  Bookmark, 
  LastReadPosition, 
  AppSettings,
  AppTheme,
  AudioSourceType 
} from './types/quran';
import { fetchSurahAyahs, getAyahAudioUrls } from './services/quranApi';

import { Header } from './components/Header';
import { SurahDrawer } from './components/SurahDrawer';
import { ReciterModal } from './components/ReciterModal';
import { AyahItem } from './components/AyahItem';
import { MushafPageView } from './components/MushafPageView';
import { AudioBar } from './components/AudioBar';
import { TafsirModal } from './components/TafsirModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { SettingsModal } from './components/SettingsModal';
import { ThemeModal } from './components/ThemeModal';

const DEFAULT_SETTINGS: AppSettings = {
  fontFamily: 'font-quran',
  fontSize: 28,
  showTranslation: false,
  showTafsirInline: false,
  theme: 'paper',
  audioSource: 'everyayah',
  memorizationMode: false,
};

export default function App() {
  // App Settings (including 5 themes)
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quran_settings_v2');
      if (saved) {
        try {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        } catch (e) {}
      }
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('quran_settings_v2', JSON.stringify(next));
      return next;
    });
  };

  // Sync Theme classes to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-paper', 'theme-sepia', 'theme-dark', 'theme-emerald', 'theme-navy');
    root.classList.add(`theme-${settings.theme}`);

    const isDarkTheme = settings.theme === 'dark' || settings.theme === 'emerald' || settings.theme === 'navy';
    if (isDarkTheme) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Current Surah & Reciter state
  const [currentSurah, setCurrentSurah] = useState<SurahMeta>(SURAHS_LIST[0]); // Al-Fatihah
  const [currentReciter, setCurrentReciter] = useState<Reciter>(RECITERS_LIST[0]); // Alafasy
  const [ayahs, setAyahs] = useState<Ayah[]>(INITIAL_FATIHA_AYAHS);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false);
  const [viewMode, setViewMode] = useState<'verses' | 'mushaf'>('verses');

  // Playback state
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    surahNumber: 1,
    ayahNumberInSurah: 1,
    reciterId: RECITERS_LIST[0].id,
    playbackSpeed: 1,
    loopMode: 'none',
    repeatTimes: 1,
    currentRepeatCount: 0,
    rangeStartAyah: 1,
    rangeEndAyah: 7,
    delayBetweenAyahs: 0,
    sourceType: 'everyayah',
  });

  const updatePlaybackState = (updates: Partial<PlaybackState>) => {
    setPlaybackState((prev) => ({ ...prev, ...updates }));
  };

  // Bookmarks & History
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quran_bookmarks');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  const [lastRead, setLastRead] = useState<LastReadPosition | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quran_last_read');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return null;
  });

  // Modals & Drawers visibility
  const [isSurahDrawerOpen, setIsSurahDrawerOpen] = useState(false);
  const [isReciterModalOpen, setIsReciterModalOpen] = useState(false);
  const [isBookmarksDrawerOpen, setIsBookmarksDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [selectedTafsirAyah, setSelectedTafsirAyah] = useState<Ayah | null>(null);

  // Audio HTML5 element & timing
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const fallbackUrlsRef = useRef<string[]>([]);
  const currentFallbackIndexRef = useRef(0);
  const delayTimerRef = useRef<any>(null);

  // Load Surah Ayahs when currentSurah changes
  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      setIsLoadingAyahs(true);
      try {
        const fetched = await fetchSurahAyahs(currentSurah.number);
        if (!isCancelled) {
          setAyahs(fetched);
          setPlaybackState((prev) => ({
            ...prev,
            surahNumber: currentSurah.number,
            rangeStartAyah: 1,
            rangeEndAyah: currentSurah.numberOfAyahs,
          }));
        }
      } catch (err) {
        console.error('Failed to load ayahs:', err);
      } finally {
        if (!isCancelled) setIsLoadingAyahs(false);
      }
    };

    load();
    return () => {
      isCancelled = true;
    };
  }, [currentSurah.number]);

  // Audio loading & playback synchronization
  const playAyahAudio = useCallback((surahNum: number, ayahNum: number) => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }

    const urls = getAyahAudioUrls(
      currentReciter,
      surahNum,
      ayahNum,
      settings.audioSource
    );

    fallbackUrlsRef.current = urls;
    currentFallbackIndexRef.current = 0;
    setAudioError(null);

    if (audioRef.current && urls.length > 0) {
      audioRef.current.src = urls[0];
      audioRef.current.playbackRate = playbackState.playbackSpeed;
      audioRef.current.load();
      audioRef.current.play().catch((err) => {
        console.warn('Audio auto-play caught:', err);
      });
      updatePlaybackState({
        isPlaying: true,
        surahNumber: surahNum,
        ayahNumberInSurah: ayahNum,
      });

      // Save last read position
      const pos: LastReadPosition = {
        surahNumber: surahNum,
        ayahNumber: ayahNum,
        timestamp: Date.now(),
      };
      setLastRead(pos);
      localStorage.setItem('quran_last_read', JSON.stringify(pos));

      // Auto-scroll to ayah
      setTimeout(() => {
        const el = document.getElementById(`ayah-${ayahNum}`) || document.getElementById(`mushaf-ayah-${ayahNum}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
    }
  }, [currentReciter, settings.audioSource, playbackState.playbackSpeed]);

  // Audio Events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => {
      setIsBuffering(false);
      setAudioError(null);
    };

    const onError = () => {
      setIsBuffering(false);
      currentFallbackIndexRef.current += 1;
      const nextUrl = fallbackUrlsRef.current[currentFallbackIndexRef.current];
      if (nextUrl) {
        console.log('Switching to fallback audio server:', nextUrl);
        audio.src = nextUrl;
        audio.play().catch(() => {});
      } else {
        setAudioError('تعذر تشغيل الصوت من الخادم. يرجى تجربة قارئ آخر أو إعادة المحاولة.');
        updatePlaybackState({ isPlaying: false });
      }
    };

    const onEnded = () => {
      const { loopMode, repeatTimes, currentRepeatCount, rangeStartAyah, rangeEndAyah, delayBetweenAyahs, ayahNumberInSurah } = playbackState;

      // Single Verse Loop
      if (loopMode === 'verse') {
        const nextCount = currentRepeatCount + 1;
        if (repeatTimes === Infinity || nextCount < repeatTimes) {
          updatePlaybackState({ currentRepeatCount: nextCount });
          if (delayBetweenAyahs > 0) {
            delayTimerRef.current = setTimeout(() => {
              playAyahAudio(currentSurah.number, ayahNumberInSurah);
            }, delayBetweenAyahs * 1000);
          } else {
            playAyahAudio(currentSurah.number, ayahNumberInSurah);
          }
          return;
        } else {
          updatePlaybackState({ currentRepeatCount: 0 });
        }
      }

      // Range Loop
      if (loopMode === 'range') {
        if (ayahNumberInSurah < rangeEndAyah) {
          const nextAyah = ayahNumberInSurah + 1;
          if (delayBetweenAyahs > 0) {
            delayTimerRef.current = setTimeout(() => {
              playAyahAudio(currentSurah.number, nextAyah);
            }, delayBetweenAyahs * 1000);
          } else {
            playAyahAudio(currentSurah.number, nextAyah);
          }
          return;
        } else {
          const nextCount = currentRepeatCount + 1;
          if (repeatTimes === Infinity || nextCount < repeatTimes) {
            updatePlaybackState({ currentRepeatCount: nextCount });
            if (delayBetweenAyahs > 0) {
              delayTimerRef.current = setTimeout(() => {
                playAyahAudio(currentSurah.number, rangeStartAyah);
              }, delayBetweenAyahs * 1000);
            } else {
              playAyahAudio(currentSurah.number, rangeStartAyah);
            }
            return;
          } else {
            updatePlaybackState({ isPlaying: false, currentRepeatCount: 0 });
            return;
          }
        }
      }

      // Continuous mode
      if (ayahNumberInSurah < currentSurah.numberOfAyahs) {
        const nextAyah = ayahNumberInSurah + 1;
        if (delayBetweenAyahs > 0) {
          delayTimerRef.current = setTimeout(() => {
            playAyahAudio(currentSurah.number, nextAyah);
          }, delayBetweenAyahs * 1000);
        } else {
          playAyahAudio(currentSurah.number, nextAyah);
        }
      } else {
        if (currentSurah.number < 114) {
          const nextSurahMeta = SURAHS_LIST[currentSurah.number];
          if (nextSurahMeta) {
            setCurrentSurah(nextSurahMeta);
            setTimeout(() => {
              playAyahAudio(nextSurahMeta.number, 1);
            }, 600);
          }
        } else {
          updatePlaybackState({ isPlaying: false });
        }
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
    };
  }, [playbackState, currentSurah, playAyahAudio]);

  // Sync playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackState.playbackSpeed;
    }
  }, [playbackState.playbackSpeed]);

  // Play/Pause Toggle
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playbackState.isPlaying) {
      audioRef.current.pause();
      updatePlaybackState({ isPlaying: false });
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    } else {
      if (!audioRef.current.src || audioRef.current.src === '' || audioRef.current.src === window.location.href) {
        playAyahAudio(currentSurah.number, playbackState.ayahNumberInSurah);
      } else {
        audioRef.current.play().catch(() => {
          playAyahAudio(currentSurah.number, playbackState.ayahNumberInSurah);
        });
        updatePlaybackState({ isPlaying: true });
      }
    }
  };

  const handleNextAyah = () => {
    if (playbackState.ayahNumberInSurah < currentSurah.numberOfAyahs) {
      playAyahAudio(currentSurah.number, playbackState.ayahNumberInSurah + 1);
    }
  };

  const handlePrevAyah = () => {
    if (playbackState.ayahNumberInSurah > 1) {
      playAyahAudio(currentSurah.number, playbackState.ayahNumberInSurah - 1);
    }
  };

  const handleSeekTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Bookmark Toggle
  const toggleBookmark = (ayah: Ayah) => {
    setBookmarks((prev) => {
      const exists = prev.some(
        (b) => b.surahNumber === currentSurah.number && b.ayahNumber === ayah.numberInSurah
      );
      let updated: Bookmark[];
      if (exists) {
        updated = prev.filter(
          (b) => !(b.surahNumber === currentSurah.number && b.ayahNumber === ayah.numberInSurah)
        );
      } else {
        const newBm: Bookmark = {
          id: `${currentSurah.number}_${ayah.numberInSurah}_${Date.now()}`,
          surahNumber: currentSurah.number,
          surahName: currentSurah.name,
          ayahNumber: ayah.numberInSurah,
          ayahText: ayah.text,
          createdAt: Date.now(),
        };
        updated = [newBm, ...prev];
      }
      localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteBookmark = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectBookmark = (surahNumber: number, ayahNumber: number) => {
    const surah = SURAHS_LIST.find((s) => s.number === surahNumber);
    if (surah) {
      setCurrentSurah(surah);
      setTimeout(() => {
        playAyahAudio(surahNumber, ayahNumber);
      }, 300);
    }
  };

  const goToNextSurah = () => {
    if (currentSurah.number < 114) {
      const next = SURAHS_LIST[currentSurah.number];
      setCurrentSurah(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevSurah = () => {
    if (currentSurah.number > 1) {
      const prev = SURAHS_LIST[currentSurah.number - 2];
      setCurrentSurah(prev);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] dark:bg-[#121316] text-stone-900 dark:text-stone-100 transition-colors pb-36 sm:pb-32">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="auto" />

      {/* Top Bar Header */}
      <Header
        currentSurah={currentSurah}
        currentReciter={currentReciter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenSurahList={() => setIsSurahDrawerOpen(true)}
        onOpenReciterList={() => setIsReciterModalOpen(true)}
        onOpenBookmarks={() => setIsBookmarksDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        currentTheme={settings.theme}
        memorizationMode={settings.memorizationMode}
        onToggleMemorization={() => updateSettings({ memorizationMode: !settings.memorizationMode })}
      />

      {/* Mobile Floating Quick Mode Switcher */}
      <div className="lg:hidden sticky top-14 z-30 bg-[#FBF9F5]/90 dark:bg-[#121316]/90 backdrop-blur-md px-4 py-2 border-b border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-stone-200/70 dark:bg-stone-800/80 p-0.5 rounded-xl border border-stone-300/40 dark:border-stone-700/50 flex-1">
          <button
            onClick={() => setViewMode('verses')}
            className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-colors text-center ${
              viewMode === 'verses'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            عرض الآيات
          </button>
          <button
            onClick={() => setViewMode('mushaf')}
            className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-colors text-center ${
              viewMode === 'mushaf'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            صفحة المصحف
          </button>
        </div>

        <button
          onClick={() => updateSettings({ memorizationMode: !settings.memorizationMode })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1 min-h-[36px] ${
            settings.memorizationMode
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-stone-200/70 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300'
          }`}
        >
          <span>التحفيظ</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {/* Surah Majestic Banner */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-400/10 dark:via-amber-400/5 border border-amber-500/20 dark:border-amber-500/20 p-5 sm:p-10 text-center mb-6 sm:mb-8 shadow-xs">
          <div className="flex items-center justify-center gap-3 text-amber-700 dark:text-amber-400 mb-2 sm:mb-3 opacity-80">
            <span className="h-px w-8 sm:w-12 bg-amber-600/30" />
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="h-px w-8 sm:w-12 bg-amber-600/30" />
          </div>

          <h1 className="text-2xl sm:text-5xl font-bold font-quran text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
            سُورَةُ {currentSurah.name}
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            {currentSurah.englishName} · {currentSurah.englishNameTranslation}
          </p>

          {/* Surah Metadata */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs text-stone-600 dark:text-stone-400 mt-3 sm:mt-4">
            <span>{currentSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
            <span aria-hidden="true">·</span>
            <span>{currentSurah.numberOfAyahs} آيات</span>
            <span aria-hidden="true">·</span>
            <span>الجزء {currentSurah.juz}</span>
            <span aria-hidden="true">·</span>
            <span>صفحة {currentSurah.page}</span>
          </div>

          {/* Bismillah Calligraphy */}
          {currentSurah.number !== 9 && (
            <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-amber-500/15 dark:border-amber-400/15">
              <p className="font-quran text-xl sm:text-3xl text-amber-900 dark:text-amber-200 select-none">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          )}
        </section>

        {/* Loading Spinner */}
        {isLoadingAyahs ? (
          <div className="py-20 sm:py-24 text-center space-y-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
              جاري تحميل آيات سورة {currentSurah.name} وتفسيرها الميسر...
            </p>
          </div>
        ) : viewMode === 'verses' ? (
          /* Verse-by-Verse List View */
          <div className="space-y-3 sm:space-y-4">
            {ayahs.map((ayah) => {
              const isPlayingThis =
                playbackState.isPlaying &&
                playbackState.surahNumber === currentSurah.number &&
                playbackState.ayahNumberInSurah === ayah.numberInSurah;

              const isBookmarked = bookmarks.some(
                (b) => b.surahNumber === currentSurah.number && b.ayahNumber === ayah.numberInSurah
              );

              return (
                <AyahItem
                  key={ayah.numberInSurah}
                  ayah={ayah}
                  surahNumber={currentSurah.number}
                  surahName={currentSurah.name}
                  isCurrentlyPlaying={isPlayingThis}
                  isBookmarked={isBookmarked}
                  onPlay={() => playAyahAudio(currentSurah.number, ayah.numberInSurah)}
                  onPause={togglePlay}
                  onBookmark={() => toggleBookmark(ayah)}
                  onOpenTafsir={() => setSelectedTafsirAyah(ayah)}
                  settings={settings}
                  onSetRangeStart={(num) => updatePlaybackState({ rangeStartAyah: num, loopMode: 'range' })}
                  onSetRangeEnd={(num) => updatePlaybackState({ rangeEndAyah: num, loopMode: 'range' })}
                />
              );
            })}
          </div>
        ) : (
          /* Continuous Mushaf Page View */
          <MushafPageView
            ayahs={ayahs}
            surahNumber={currentSurah.number}
            surahName={currentSurah.name}
            currentPlayingAyah={
              playbackState.isPlaying && playbackState.surahNumber === currentSurah.number
                ? playbackState.ayahNumberInSurah
                : null
            }
            isPlaying={playbackState.isPlaying}
            onSelectAyah={(num) => playAyahAudio(currentSurah.number, num)}
            onOpenTafsir={(ayah) => setSelectedTafsirAyah(ayah)}
            settings={settings}
          />
        )}

        {/* Surah Navigation Footer Strip (Mobile Thumb 44px+) */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 sm:gap-4">
          <button
            onClick={goToPrevSurah}
            disabled={currentSurah.number <= 1}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none transition-colors text-xs sm:text-sm font-medium min-h-[44px]"
          >
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-none">
              السابقة ({currentSurah.number > 1 ? SURAHS_LIST[currentSurah.number - 2].name : ''})
            </span>
          </button>

          <button
            onClick={() => setIsSurahDrawerOpen(true)}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 min-h-[44px] px-2"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">فهرس السور</span>
          </button>

          <button
            onClick={goToNextSurah}
            disabled={currentSurah.number >= 114}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none transition-colors text-xs sm:text-sm font-medium min-h-[44px]"
          >
            <span className="truncate max-w-[120px] sm:max-w-none">
              التالية ({currentSurah.number < 114 ? SURAHS_LIST[currentSurah.number].name : ''})
            </span>
            <ChevronLeft className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </main>

      {/* Persistent Audio Bottom Bar */}
      <AudioBar
        currentSurah={currentSurah}
        currentReciter={currentReciter}
        playbackState={playbackState}
        onTogglePlay={togglePlay}
        onNextAyah={handleNextAyah}
        onPrevAyah={handlePrevAyah}
        onSeekAyah={(ayahNum) => playAyahAudio(currentSurah.number, ayahNum)}
        onUpdatePlaybackState={updatePlaybackState}
        onOpenReciterList={() => setIsReciterModalOpen(true)}
        currentTime={currentTime}
        duration={duration}
        onSeekTime={handleSeekTime}
        isBuffering={isBuffering}
        audioError={audioError}
        onRetryAudio={() => playAyahAudio(currentSurah.number, playbackState.ayahNumberInSurah)}
      />

      {/* Drawers & Modals */}
      <SurahDrawer
        isOpen={isSurahDrawerOpen}
        onClose={() => setIsSurahDrawerOpen(false)}
        currentSurahNumber={currentSurah.number}
        onSelectSurah={(surah) => {
          setCurrentSurah(surah);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <ReciterModal
        isOpen={isReciterModalOpen}
        onClose={() => setIsReciterModalOpen(false)}
        selectedReciter={currentReciter}
        onSelectReciter={(reciter) => {
          setCurrentReciter(reciter);
          updatePlaybackState({ reciterId: reciter.id });
          if (playbackState.isPlaying) {
            setTimeout(() => {
              playAyahAudio(currentSurah.number, playbackState.ayahNumberInSurah);
            }, 100);
          }
        }}
        audioSource={settings.audioSource}
        onChangeAudioSource={(source) => updateSettings({ audioSource: source })}
      />

      <BookmarksDrawer
        isOpen={isBookmarksDrawerOpen}
        onClose={() => setIsBookmarksDrawerOpen(false)}
        bookmarks={bookmarks}
        lastRead={lastRead}
        onSelectBookmark={handleSelectBookmark}
        onDeleteBookmark={deleteBookmark}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={settings.theme}
        onSelectTheme={(t) => updateSettings({ theme: t })}
      />

      <TafsirModal
        isOpen={Boolean(selectedTafsirAyah)}
        onClose={() => setSelectedTafsirAyah(null)}
        ayah={selectedTafsirAyah}
        surah={currentSurah}
        onPlayAyah={(num) => {
          setSelectedTafsirAyah(null);
          playAyahAudio(currentSurah.number, num);
        }}
      />
    </div>
  );
}
