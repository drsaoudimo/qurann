import React from 'react';
import { Ayah, AppSettings } from '../types/quran';
import { toArabicNumerals } from './AyahItem';

interface MushafPageViewProps {
  ayahs: Ayah[];
  surahNumber: number;
  surahName: string;
  currentPlayingAyah: number | null;
  isPlaying: boolean;
  onSelectAyah: (ayahNumberInSurah: number) => void;
  onOpenTafsir: (ayah: Ayah) => void;
  settings: AppSettings;
}

export const MushafPageView: React.FC<MushafPageViewProps> = ({
  ayahs,
  surahNumber,
  surahName,
  currentPlayingAyah,
  isPlaying,
  onSelectAyah,
  onOpenTafsir,
  settings,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-1 sm:px-8 py-3 sm:py-8">
      {/* Decorative Mushaf Page Frame */}
      <div className="relative bg-[#FFFDF9] dark:bg-[#16171B] border sm:border-2 border-stone-200/80 dark:border-stone-800 rounded-2xl sm:rounded-3xl p-4 sm:p-12 shadow-xl ring-1 ring-amber-500/10">
        {/* Mushaf Page Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-6 mb-4 sm:mb-8 border-b border-stone-200 dark:border-stone-800 text-[11px] sm:text-xs text-stone-500 dark:text-stone-400">
          <span className="font-semibold text-amber-700 dark:text-amber-400 font-quran text-xs sm:text-sm">
            سورة {surahName}
          </span>
          <span className="font-mono tabular-nums">
            الجزء {ayahs[0]?.juz || 1}
          </span>
          <span className="font-mono tabular-nums">
            ص {ayahs[0]?.page || 1}
          </span>
        </div>

        {/* Continuous Flow of Ayahs */}
        <div 
          className={`text-right leading-loose ${settings.fontFamily}`}
          style={{ 
            fontSize: `clamp(20px, 5.2vw, ${settings.fontSize}px)`, 
            lineHeight: 2.3 
          }}
          dir="rtl"
        >
          {ayahs.map((ayah) => {
            const isPlayingThis = currentPlayingAyah === ayah.numberInSurah;

            return (
              <span
                key={ayah.numberInSurah}
                id={`mushaf-ayah-${ayah.numberInSurah}`}
                onClick={() => onSelectAyah(ayah.numberInSurah)}
                className={`inline cursor-pointer rounded-lg px-0.5 sm:px-1 transition-all group ${
                  isPlayingThis
                    ? 'bg-amber-400/25 dark:bg-amber-400/20 text-amber-950 dark:text-amber-100 font-semibold ring-1 ring-amber-500/40 shadow-xs'
                    : 'hover:bg-amber-500/10 dark:hover:bg-amber-400/10'
                }`}
                title={`الآية ${ayah.numberInSurah} (انقر للاستماع)`}
              >
                <span>{ayah.text}</span>

                {/* Inline Ayah Medallion */}
                <span 
                  className={`inline-flex items-center justify-center mx-1 sm:mx-1.5 select-none font-amiri font-bold ${
                    isPlayingThis 
                      ? 'text-amber-700 dark:text-amber-300 scale-110' 
                      : 'text-amber-600/80 dark:text-amber-400/80 group-hover:text-amber-700 dark:group-hover:text-amber-300'
                  }`}
                >
                  <span className="text-base sm:text-lg">﴿</span>
                  <span className="text-xs sm:text-sm px-0.5 font-mono tabular-nums font-bold">
                    {toArabicNumerals(ayah.numberInSurah)}
                  </span>
                  <span className="text-base sm:text-lg">﴾</span>
                </span>
              </span>
            );
          })}
        </div>

        {/* Mushaf Page Footer */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] sm:text-xs text-stone-400 dark:text-stone-500 font-mono">
          <span>{ayahs.length} آيات</span>
          <span className="truncate max-w-[200px] sm:max-w-none">انقر على أي آية لبدء التلاوة من عندها</span>
        </div>
      </div>
    </div>
  );
};
