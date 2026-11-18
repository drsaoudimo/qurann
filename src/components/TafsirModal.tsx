import React, { useState } from 'react';
import { X, BookOpen, Copy, Check, Play, Volume2 } from 'lucide-react';
import { Ayah, SurahMeta } from '../types/quran';
import { toArabicNumerals } from './AyahItem';

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  ayah: Ayah | null;
  surah: SurahMeta;
  onPlayAyah: (ayahNum: number) => void;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  isOpen,
  onClose,
  ayah,
  surah,
  onPlayAyah,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !ayah) return null;

  const handleCopy = () => {
    const text = `﴿${ayah.text}﴾ [${surah.name}: ${ayah.numberInSurah}]\n\nالتفسير الميسر:\n${ayah.tafsir || 'لا يتوفر تفسير'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#FBF9F5] dark:bg-[#16171B] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col h-[88vh] sm:h-auto sm:max-h-[85vh] overflow-hidden text-stone-900 dark:text-stone-100"
        dir="rtl"
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="px-4 py-3 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 bg-amber-500/5 dark:bg-amber-400/5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-700 dark:text-amber-400 border border-amber-600/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-quran leading-tight">
                التفسير الميسر
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                سورة {surah.name} · الآية {ayah.numberInSurah}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 pb-safe">
          {/* Ayah Box */}
          <div className="bg-white dark:bg-stone-800/80 p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 text-right">
            <div className="font-quran text-xl sm:text-3xl leading-loose text-stone-900 dark:text-stone-100 font-medium">
              {ayah.text}
              <span className="inline-flex items-center justify-center mx-2 text-amber-700 dark:text-amber-400 font-amiri font-bold">
                ﴿ {toArabicNumerals(ayah.numberInSurah)} ﴾
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700 flex items-center justify-between gap-2">
              <button
                onClick={() => onPlayAyah(ayah.numberInSurah)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 text-white rounded-xl text-xs font-medium hover:bg-amber-700 transition-colors min-h-[40px]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>استماع للآية</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs text-stone-600 dark:text-stone-300 transition-colors min-h-[40px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ التفسير'}</span>
              </button>
            </div>
          </div>

          {/* Tafsir text */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>معنى الآية وبيانها:</span>
            </div>
            <div className="bg-amber-500/5 dark:bg-amber-400/5 p-4 sm:p-5 rounded-2xl border border-amber-500/10 text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed">
              {ayah.tafsir || 'جاري تحميل التفسير...'}
            </div>
          </div>

          {/* Translation if exists */}
          {ayah.translation && (
            <div className="space-y-1 text-left" dir="ltr">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                English Translation (Sahih International):
              </span>
              <p className="text-sm text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                {ayah.translation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 flex justify-end pb-safe shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition-colors min-h-[44px]"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
