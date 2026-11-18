import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Repeat1, 
  Mic2, 
  Clock, 
  Radio, 
  ChevronUp, 
  ChevronDown,
  Info,
  Maximize2
} from 'lucide-react';
import { Reciter, SurahMeta, PlaybackState, LoopMode, AudioSourceType } from '../types/quran';

interface AudioBarProps {
  currentSurah: SurahMeta;
  currentReciter: Reciter;
  playbackState: PlaybackState;
  onTogglePlay: () => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  onSeekAyah: (ayahNumInSurah: number) => void;
  onUpdatePlaybackState: (updates: Partial<PlaybackState>) => void;
  onOpenReciterList: () => void;
  currentTime: number;
  duration: number;
  onSeekTime: (time: number) => void;
  isBuffering: boolean;
  audioError: string | null;
  onRetryAudio: () => void;
}

export const AudioBar: React.FC<AudioBarProps> = ({
  currentSurah,
  currentReciter,
  playbackState,
  onTogglePlay,
  onNextAyah,
  onPrevAyah,
  onSeekAyah,
  onUpdatePlaybackState,
  onOpenReciterList,
  currentTime,
  duration,
  onSeekTime,
  isBuffering,
  audioError,
  onRetryAudio,
}) => {
  const [showHifzPanel, setShowHifzPanel] = useState(false);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FBF9F5]/98 dark:bg-[#121316]/98 backdrop-blur-lg border-t border-stone-200/90 dark:border-stone-800 shadow-2xl transition-all pb-safe" dir="rtl">
      {/* Expanded Hifz / Memorization Repeat Panel */}
      {showHifzPanel && (
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-100/90 dark:bg-stone-900/90 animate-in slide-in-from-bottom duration-200 max-h-[60vh] overflow-y-auto">
          {/* Mobile Handle */}
          <div className="sm:hidden w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-3" />

          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs">
            {/* Repetition Mode Tabs */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                وضع التكرار (للتحفيظ):
              </span>
              <div className="grid grid-cols-3 sm:flex items-center bg-white dark:bg-stone-800 p-0.5 rounded-lg border border-stone-300 dark:border-stone-700">
                <button
                  onClick={() => onUpdatePlaybackState({ loopMode: 'none' })}
                  className={`px-2 py-1.5 sm:px-2.5 sm:py-1 rounded-md font-medium text-center transition-colors min-h-[36px] sm:min-h-0 ${
                    playbackState.loopMode === 'none'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  بدون تكرار
                </button>
                <button
                  onClick={() => onUpdatePlaybackState({ loopMode: 'verse' })}
                  className={`px-2 py-1.5 sm:px-2.5 sm:py-1 rounded-md font-medium text-center transition-colors min-h-[36px] sm:min-h-0 ${
                    playbackState.loopMode === 'verse'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  تكرار الآية
                </button>
                <button
                  onClick={() => onUpdatePlaybackState({ loopMode: 'range' })}
                  className={`px-2 py-1.5 sm:px-2.5 sm:py-1 rounded-md font-medium text-center transition-colors min-h-[36px] sm:min-h-0 ${
                    playbackState.loopMode === 'range'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  تكرار مقطع
                </button>
              </div>
            </div>

            {/* Repeat count selector */}
            {playbackState.loopMode !== 'none' && (
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2">
                <span className="font-semibold text-stone-700 dark:text-stone-300 shrink-0">
                  التكرار:
                </span>
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {[1, 2, 3, 5, 10, Infinity].map((count) => (
                    <button
                      key={count}
                      onClick={() => onUpdatePlaybackState({ repeatTimes: count, currentRepeatCount: 0 })}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors border min-h-[36px] ${
                        playbackState.repeatTimes === count
                          ? 'bg-amber-700 text-white border-amber-700'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                      }`}
                    >
                      {count === Infinity ? 'مستمر' : `${count}x`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Range controls if in range mode */}
            {playbackState.loopMode === 'range' && (
              <div className="w-full sm:w-auto flex items-center justify-between gap-2 bg-white dark:bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700">
                <div className="flex items-center gap-1">
                  <span>من آية:</span>
                  <input
                    type="number"
                    min={1}
                    max={currentSurah.numberOfAyahs}
                    value={playbackState.rangeStartAyah}
                    onChange={(e) => onUpdatePlaybackState({ rangeStartAyah: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-12 py-1 text-center font-mono border rounded dark:bg-stone-700 min-h-[36px]"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span>إلى:</span>
                  <input
                    type="number"
                    min={playbackState.rangeStartAyah}
                    max={currentSurah.numberOfAyahs}
                    value={playbackState.rangeEndAyah}
                    onChange={(e) => onUpdatePlaybackState({ rangeEndAyah: Math.min(currentSurah.numberOfAyahs, parseInt(e.target.value) || currentSurah.numberOfAyahs) })}
                    className="w-12 py-1 text-center font-mono border rounded dark:bg-stone-700 min-h-[36px]"
                  />
                </div>
              </div>
            )}

            {/* Pause duration between verses */}
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2">
              <div className="flex items-center gap-1 text-stone-700 dark:text-stone-300">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span className="font-semibold">وقفة ترديد:</span>
              </div>
              <div className="flex items-center gap-1">
                {[0, 2, 4, 6].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => onUpdatePlaybackState({ delayBetweenAyahs: sec })}
                    className={`px-2.5 py-1 rounded text-xs transition-colors min-h-[36px] ${
                      playbackState.delayBetweenAyahs === sec
                        ? 'bg-amber-600 text-white'
                        : 'bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {sec === 0 ? 'بدون' : `${sec}ث`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seek Progress Bar */}
      <div 
        className="w-full h-2 bg-stone-200 dark:bg-stone-800 cursor-pointer relative group touch-none"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = 1 - (clickX / rect.width);
          onSeekTime(ratio * duration);
        }}
      >
        <div 
          className="h-full bg-amber-600 dark:bg-amber-500 transition-all group-hover:bg-amber-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Player Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Reciter & Current Ayah Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial sm:max-w-xs">
          <button
            onClick={onOpenReciterList}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-700 dark:text-amber-400 border border-amber-600/20 active:scale-95 transition-transform shrink-0 min-h-[44px] min-w-[44px]"
            title="تغيير القارئ"
          >
            <Mic2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="min-w-0 flex-1">
            <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate block">
              {currentReciter.name}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 truncate">
              <span>{currentSurah.name}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                آية {playbackState.ayahNumberInSurah}/{currentSurah.numberOfAyahs}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Playback Controls (Thumb-friendly 44px+ hitboxes) */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* Prev Ayah */}
          <button
            onClick={onPrevAyah}
            disabled={playbackState.ayahNumberInSurah <= 1}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-25 transition-colors"
            title="الآية السابقة"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Play/Pause Button (Primary touch anchor 48px) */}
          <button
            onClick={onTogglePlay}
            className={`w-11 h-11 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center text-white transition-all shadow-md active:scale-95 ${
              playbackState.isPlaying
                ? 'bg-amber-700 hover:bg-amber-800'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
            title={playbackState.isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isBuffering ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : playbackState.isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Next Ayah */}
          <button
            onClick={onNextAyah}
            disabled={playbackState.ayahNumberInSurah >= currentSurah.numberOfAyahs}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-25 transition-colors"
            title="الآية التالية"
          >
            <SkipBack className="w-5 h-5" />
          </button>
        </div>

        {/* Left/Right Controls: Repeat & Timing */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Hifz Repeat Mode Toggle */}
          <button
            onClick={() => setShowHifzPanel(!showHifzPanel)}
            className={`min-h-[44px] px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 border ${
              playbackState.loopMode !== 'none' || showHifzPanel
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                : 'hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800'
            }`}
            title="إعدادات التحفيظ والتكرار"
          >
            {playbackState.loopMode === 'verse' ? (
              <Repeat1 className="w-4 h-4 text-amber-600" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            <span className="hidden md:inline">التحفيظ</span>
            {showHifzPanel ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {/* Speed Toggle (Click to cycle through speeds 1x -> 1.25x -> 1.5x -> 0.75x) */}
          <button
            onClick={() => {
              const speeds = [0.75, 1, 1.25, 1.5];
              const nextIndex = (speeds.indexOf(playbackState.playbackSpeed) + 1) % speeds.length;
              onUpdatePlaybackState({ playbackSpeed: speeds[nextIndex] });
            }}
            className="min-h-[44px] min-w-[40px] px-2 rounded-xl text-[11px] font-mono tabular-nums font-bold hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors flex items-center justify-center border border-stone-200 dark:border-stone-800"
            title="سرعة التلاوة (انقر للتغيير)"
          >
            {playbackState.playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Audio Error Banner */}
      {audioError && (
        <div className="bg-red-500/10 border-t border-red-500/20 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <Info className="w-4 h-4 shrink-0" />
            <span className="truncate">{audioError}</span>
          </div>
          <button
            onClick={onRetryAudio}
            className="underline font-medium hover:text-red-700 dark:hover:text-red-300 shrink-0 mr-2 min-h-[36px] flex items-center"
          >
            إعادة المحاولة
          </button>
        </div>
      )}
    </div>
  );
};
