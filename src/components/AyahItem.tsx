import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  BookOpen, 
  Bookmark, 
  Copy, 
  Check, 
  Volume2, 
  Eye, 
  Share2, 
  Sparkles,
  ArrowRightToLine,
  ArrowLeftToLine
} from 'lucide-react';
import { Ayah, AppSettings } from '../types/quran';

interface AyahItemProps {
  ayah: Ayah;
  surahNumber: number;
  surahName: string;
  isCurrentlyPlaying: boolean;
  isBookmarked: boolean;
  onPlay: () => void;
  onPause: () => void;
  onBookmark: () => void;
  onOpenTafsir: () => void;
  settings: AppSettings;
  onSetRangeStart?: (ayahNum: number) => void;
  onSetRangeEnd?: (ayahNum: number) => void;
}

// Convert western digits to Arabic-Indic digits
export function toArabicNumerals(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num)
    .split('')
    .map((d) => arabicDigits[parseInt(d, 10)] || d)
    .join('');
}

export const AyahItem: React.FC<AyahItemProps> = ({
  ayah,
  surahNumber,
  surahName,
  isCurrentlyPlaying,
  isBookmarked,
  onPlay,
  onPause,
  onBookmark,
  onOpenTafsir,
  settings,
  onSetRangeStart,
  onSetRangeEnd,
}) => {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleCopy = () => {
    const textToCopy = `﴿${ayah.text}﴾ [سورة ${surahName}: ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBlurred = settings.memorizationMode && !revealed;

  return (
    <div
      id={`ayah-${ayah.numberInSurah}`}
      className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-300 border ${
        isCurrentlyPlaying
          ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/50 dark:border-amber-500/50 shadow-md ring-2 ring-amber-500/20'
          : 'bg-white/70 dark:bg-[#16171B]/70 border-stone-200/80 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700'
      }`}
    >
      {/* Top Action Ribbon - Optimized for touch on mobile */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-stone-100 dark:border-stone-800/60 text-xs text-stone-500 dark:text-stone-400">
        {/* Ayah Reference */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono tabular-nums text-xs sm:text-sm">
            {surahNumber}:{ayah.numberInSurah}
          </span>
          {ayah.juz && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[11px] sm:text-xs">الجزء {ayah.juz}</span>
            </>
          )}
          {ayah.page && (
            <>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span className="text-[11px] sm:text-xs hidden sm:inline">ص {ayah.page}</span>
            </>
          )}
          {ayah.sajda && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium text-[11px]">سجدة</span>
            </>
          )}
        </div>

        {/* Action Buttons (Touch Target Ergonomics min 40px - 44px) */}
        <div className="flex items-center gap-1">
          {/* Play/Pause Button */}
          <button
            onClick={isCurrentlyPlaying ? onPause : onPlay}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-colors min-h-[40px] ${
              isCurrentlyPlaying
                ? 'bg-amber-600 text-white shadow-sm'
                : 'hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60'
            }`}
            title={isCurrentlyPlaying ? 'إيقاف مؤقت' : 'تلاوة هذه الآية'}
          >
            {isCurrentlyPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>إيقاف</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>استماع</span>
              </>
            )}
          </button>

          {/* Tafsir */}
          <button
            onClick={onOpenTafsir}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            title="تفسير الميسر"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Bookmark */}
          <button
            onClick={onBookmark}
            className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-colors ${
              isBookmarked
                ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
            title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ كعلامة مرجعية'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            title="نسخ نص الآية"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Range Repeat Start/End for Hifz (Desktop) */}
          {onSetRangeStart && (
            <button
              onClick={() => onSetRangeStart(ayah.numberInSurah)}
              className="hidden lg:flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              title="بداية التكرار للتحفيظ"
            >
              <ArrowRightToLine className="w-3.5 h-3.5" />
            </button>
          )}
          {onSetRangeEnd && (
            <button
              onClick={() => onSetRangeEnd(ayah.numberInSurah)}
              className="hidden lg:flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              title="نهاية التكرار للتحفيظ"
            >
              <ArrowLeftToLine className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Quranic Calligraphy Body */}
      <div 
        className={`my-2 text-right leading-loose transition-all select-text ${
          settings.fontFamily
        } ${isBlurred ? 'filter blur-md select-none cursor-pointer' : ''}`}
        style={{ fontSize: `clamp(22px, 5vw, ${settings.fontSize}px)`, lineHeight: 2.2 }}
        onClick={() => {
          if (settings.memorizationMode) setRevealed(!revealed);
        }}
        dir="rtl"
      >
        <span className="text-stone-900 dark:text-stone-100 font-medium">
          {ayah.text}
        </span>

        {/* Ornamental Ayah Number Medallion */}
        <span 
          className="inline-flex items-center justify-center mx-2 text-amber-700 dark:text-amber-400 select-none align-middle font-bold text-lg font-amiri"
          title={`الآية ${ayah.numberInSurah}`}
        >
          <span className="text-xl">﴿</span>
          <span className="text-sm px-0.5 font-bold font-mono tabular-nums">
            {toArabicNumerals(ayah.numberInSurah)}
          </span>
          <span className="text-xl">﴾</span>
        </span>
      </div>

      {/* Memorization Reveal Hint */}
      {settings.memorizationMode && isBlurred && (
        <div 
          onClick={() => setRevealed(true)}
          className="my-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-emerald-500/20 transition-colors min-h-[44px]"
        >
          <Eye className="w-4 h-4 shrink-0" />
          <span>وضع التحفيظ مفعل: انقر هنا لإظهار نص الآية والتأكد من حفظك</span>
        </div>
      )}

      {/* Optional Inline Tafsir */}
      {settings.showTafsirInline && ayah.tafsir && (
        <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/60 text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-amber-500/5 dark:bg-amber-400/5 p-3 sm:p-4 rounded-xl border border-amber-500/10">
          <div className="font-semibold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>التفسير الميسر:</span>
          </div>
          <p>{ayah.tafsir}</p>
        </div>
      )}

      {/* Optional English Translation */}
      {settings.showTranslation && ayah.translation && (
        <div className="mt-2.5 pt-2.5 border-t border-stone-100 dark:border-stone-800/60 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-sans leading-normal text-left" dir="ltr">
          <p>{ayah.translation}</p>
        </div>
      )}
    </div>
  );
};
