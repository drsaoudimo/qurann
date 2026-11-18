import React from 'react';
import { 
  BookOpen, 
  Mic2, 
  Bookmark, 
  Settings2, 
  Palette,
  ListFilter,
  Eye,
  Columns
} from 'lucide-react';
import { Reciter, SurahMeta, AppTheme } from '../types/quran';

interface HeaderProps {
  currentSurah: SurahMeta;
  currentReciter: Reciter;
  viewMode: 'verses' | 'mushaf';
  setViewMode: (mode: 'verses' | 'mushaf') => void;
  onOpenSurahList: () => void;
  onOpenReciterList: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
  onOpenThemeModal: () => void;
  currentTheme: AppTheme;
  memorizationMode: boolean;
  onToggleMemorization: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSurah,
  currentReciter,
  viewMode,
  setViewMode,
  onOpenSurahList,
  onOpenReciterList,
  onOpenBookmarks,
  onOpenSettings,
  onOpenThemeModal,
  currentTheme,
  memorizationMode,
  onToggleMemorization,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 dark:bg-[#121316]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors pt-safe">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenSurahList}
            className="flex items-center gap-2 text-stone-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors group text-right min-h-[44px]"
            title="فتح فهرس السور"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-700 dark:text-amber-400 border border-amber-600/20 group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold font-quran tracking-tight block leading-tight">
                القرآن الكريم
              </span>
              <span className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 hidden md:block">
                تلاوة آية بآية
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean Single-Line Controls) */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300">
          {/* Current Surah Button */}
          <button
            onClick={onOpenSurahList}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 border border-stone-300/40 dark:border-stone-700/50 min-h-[40px]"
            title="تغيير السورة"
          >
            <ListFilter className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
            <span className="font-semibold text-stone-900 dark:text-stone-100 font-quran text-sm sm:text-base">
              {currentSurah.name}
            </span>
          </button>

          {/* Current Reciter Button */}
          <button
            onClick={onOpenReciterList}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 border border-stone-300/40 dark:border-stone-700/50 min-h-[40px]"
            title="اختيار القارئ (أرشيف وإيفري آية)"
          >
            <Mic2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
            <span className="font-medium text-stone-900 dark:text-stone-100 truncate max-w-[85px] sm:max-w-[150px]">
              {currentReciter.name.split(' ')[0]} {currentReciter.name.split(' ')[1] || ''}
            </span>
          </button>

          {/* View Mode Toggle: Verses vs Mushaf (Desktop) */}
          <div className="hidden lg:flex items-center bg-stone-200/70 dark:bg-stone-800/80 p-0.5 rounded-lg border border-stone-300/50 dark:border-stone-700/50">
            <button
              onClick={() => setViewMode('verses')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap ${
                viewMode === 'verses'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              عرض الآيات
            </button>
            <button
              onClick={() => setViewMode('mushaf')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap ${
                viewMode === 'mushaf'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              المصحف
            </button>
          </div>

          {/* Memorization Mode Quick Toggle */}
          <button
            onClick={onToggleMemorization}
            className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
              memorizationMode
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
            title={memorizationMode ? 'إلغاء وضع التحفيظ' : 'تفعيل وضع التحفيظ (إخفاء النص لاختبار الحفظ)'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>التحفيظ</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Theme, Bookmarks, Settings) */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
          {/* Quick Theme Switcher Button */}
          <button
            onClick={onOpenThemeModal}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            title="تغيير الثيم (المظهر)"
          >
            <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            title="العلامات المرجعية"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            title="الإعدادات والخط"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
