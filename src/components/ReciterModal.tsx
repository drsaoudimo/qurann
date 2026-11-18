import React, { useState, useMemo } from 'react';
import { Search, X, Mic2, Check, Radio, Disc3, Database, Globe } from 'lucide-react';
import { RECITERS_LIST } from '../data/reciters';
import { Reciter, AudioSourceType } from '../types/quran';

interface ReciterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
  audioSource: AudioSourceType;
  onChangeAudioSource: (source: AudioSourceType) => void;
}

export const ReciterModal: React.FC<ReciterModalProps> = ({
  isOpen,
  onClose,
  selectedReciter,
  onSelectReciter,
  audioSource,
  onChangeAudioSource,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'مرتل' | 'مجود' | 'معلم' | 'other'>('all');

  const filteredReciters = useMemo(() => {
    return RECITERS_LIST.filter((reciter) => {
      const matchSearch =
        reciter.name.includes(searchTerm) ||
        reciter.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reciter.riwayah.includes(searchTerm);

      if (!matchSearch) return false;

      if (activeTab === 'all') return true;
      if (activeTab === 'other') return reciter.riwayah !== 'حفص عن عاصم';
      return reciter.style === activeTab;
    });
  }, [searchTerm, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#FBF9F5] dark:bg-[#16171B] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col h-[92vh] sm:h-auto sm:max-h-[88vh] overflow-hidden text-stone-900 dark:text-stone-100"
        dir="rtl"
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto my-3 shrink-0" />

        {/* Modal Header */}
        <div className="px-4 py-3 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-700 dark:text-amber-400 border border-amber-600/20 shrink-0">
              <Mic2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-quran leading-tight">
                اختيار القارئ (جميع القراء)
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
                تسجيلات آية بآية من أرشيف وإيفري آية
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

        {/* Audio Source Switcher */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-amber-500/5 dark:bg-amber-400/5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
            <Database className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs">سيرفر التلاوة:</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeAudioSource('archive')}
              className={`px-2 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-colors flex items-center gap-1 min-h-[32px] ${
                audioSource === 'archive'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>موقع أرشيف</span>
            </button>
            <button
              onClick={() => onChangeAudioSource('everyayah')}
              className={`px-2 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-colors flex items-center gap-1 min-h-[32px] ${
                audioSource === 'everyayah'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              <Disc3 className="w-3 h-3" />
              <span>إيفري آية CDN</span>
            </button>
          </div>
        </div>

        {/* Search and Tabs */}
        <div className="p-3 sm:p-4 border-b border-stone-200 dark:border-stone-800 space-y-2.5 bg-stone-100/50 dark:bg-stone-900/50 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-3.5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث عن قارئك المفضل (العفاسي، المنشاوي، عبد الباسط، الحصري...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2.5 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-stone-900 dark:text-stone-100 min-h-[44px]"
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

          {/* Style Categories Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                activeTab === 'all'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              الكل ({RECITERS_LIST.length})
            </button>
            <button
              onClick={() => setActiveTab('مرتل')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                activeTab === 'مرتل'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              المرتل
            </button>
            <button
              onClick={() => setActiveTab('مجود')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                activeTab === 'مجود'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              المجود
            </button>
            <button
              onClick={() => setActiveTab('معلم')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                activeTab === 'معلم'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              المصحف المعلم
            </button>
            <button
              onClick={() => setActiveTab('other')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                activeTab === 'other'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              روايات أخرى
            </button>
          </div>
        </div>

        {/* Reciters List Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pb-safe">
          {filteredReciters.length === 0 ? (
            <div className="col-span-1 sm:col-span-2 p-8 text-center text-stone-500 dark:text-stone-400">
              <p className="text-sm">لم يتم العثور على أي قارئ بهذا الاسم</p>
            </div>
          ) : (
            filteredReciters.map((reciter) => {
              const isSelected = reciter.id === selectedReciter.id;
              return (
                <button
                  key={reciter.id}
                  onClick={() => {
                    onSelectReciter(reciter);
                    onClose();
                  }}
                  className={`text-right p-3 sm:p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 min-h-[56px] active:scale-[0.99] ${
                    isSelected
                      ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-600 dark:border-amber-500 shadow-xs'
                      : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700/80 hover:border-amber-400'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 font-cairo block leading-tight">
                      {reciter.name}
                    </span>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                      {reciter.englishName}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mt-1.5">
                      <span className="text-amber-700 dark:text-amber-400 font-medium">
                        {reciter.riwayah}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{reciter.style}</span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-stone-300 dark:border-stone-600" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pb-safe shrink-0">
          <span className="truncate max-w-[200px] sm:max-w-none">تلاوة آية بآية مع الانتقال التلقائي.</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium rounded-xl hover:bg-stone-800 dark:hover:bg-white transition-colors min-h-[44px]"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
};
