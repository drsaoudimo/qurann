import React, { useState, useMemo } from 'react';
import { Search, X, Layers, Sparkles } from 'lucide-react';
import { SURAHS_LIST } from '../data/surahs';
import { SurahMeta } from '../types/quran';

interface SurahDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSurahNumber: number;
  onSelectSurah: (surah: SurahMeta) => void;
}

export const SurahDrawer: React.FC<SurahDrawerProps> = ({
  isOpen,
  onClose,
  currentSurahNumber,
  onSelectSurah,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);

  const filteredSurahs = useMemo(() => {
    return SURAHS_LIST.filter((s) => {
      const matchesSearch =
        s.name.includes(searchTerm) ||
        s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(s.number).includes(searchTerm);

      const matchesType =
        filterType === 'all' ? true : s.revelationType === filterType;

      const matchesJuz =
        selectedJuz === null ? true : s.juz === selectedJuz;

      return matchesSearch && matchesType && matchesJuz;
    });
  }, [searchTerm, filterType, selectedJuz]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch justify-start bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full sm:max-w-md bg-[#FBF9F5] dark:bg-[#16171B] h-[92vh] sm:h-full rounded-t-3xl sm:rounded-none shadow-2xl flex flex-col sm:border-l border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 animate-in slide-in-from-bottom sm:slide-in-from-right duration-200"
        dir="rtl"
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto my-3" />

        {/* Drawer Header */}
        <div className="px-4 py-3 sm:p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold font-quran">فهرس سور القرآن الكريم</h2>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              ({SURAHS_LIST.length} سورة)
            </span>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-3 sm:p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-3.5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث بالسورة أو رقمها (مثال: الكهف أو 18)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2.5 text-sm bg-white dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-stone-900 dark:text-stone-100 min-h-[44px]"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-3 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
              >
                مسح
              </button>
            )}
          </div>

          {/* Revelation Type Filter Tabs */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <button
              onClick={() => { setFilterType('all'); setSelectedJuz(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg text-center transition-colors min-h-[38px] ${
                filterType === 'all' && selectedJuz === null
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-stone-400'
              }`}
            >
              جميع السور
            </button>
            <button
              onClick={() => { setFilterType('Meccan'); setSelectedJuz(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg text-center transition-colors min-h-[38px] ${
                filterType === 'Meccan'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-stone-400'
              }`}
            >
              مكية (86)
            </button>
            <button
              onClick={() => { setFilterType('Medinan'); setSelectedJuz(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg text-center transition-colors min-h-[38px] ${
                filterType === 'Medinan'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-stone-400'
              }`}
            >
              مدنية (28)
            </button>
          </div>
        </div>

        {/* Surahs List (Touch-friendly 56px+ height) */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-200/70 dark:divide-stone-800/70 pb-safe">
          {filteredSurahs.length === 0 ? (
            <div className="p-8 text-center text-stone-500 dark:text-stone-400">
              <p className="text-sm">لم يتم العثور على أي سورة مطابقة للبحث</p>
            </div>
          ) : (
            filteredSurahs.map((surah) => {
              const isSelected = surah.number === currentSurahNumber;
              return (
                <button
                  key={surah.number}
                  onClick={() => {
                    onSelectSurah(surah);
                    onClose();
                  }}
                  className={`w-full text-right p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors min-h-[56px] active:bg-amber-500/10 ${
                    isSelected
                      ? 'bg-amber-500/10 dark:bg-amber-500/15 border-r-4 border-amber-600 dark:border-amber-500'
                      : 'hover:bg-stone-200/40 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-200/80 dark:bg-stone-800 flex items-center justify-center font-mono text-xs font-bold text-stone-700 dark:text-stone-300 tabular-nums shrink-0">
                      {surah.number}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base font-quran text-stone-900 dark:text-stone-100">
                          سورة {surah.name}
                        </span>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          {surah.englishName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        <span>{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{surah.numberOfAyahs} آية</span>
                        <span aria-hidden="true">·</span>
                        <span>الجزء {surah.juz}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="text-xs text-stone-400 dark:text-stone-500 block font-mono tabular-nums">
                      ص {surah.page}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="hidden sm:block flex-1" onClick={onClose} />
    </div>
  );
};
