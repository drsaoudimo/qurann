import React from 'react';
import { X, Bookmark, Trash2, ArrowLeft, History, Play } from 'lucide-react';
import { Bookmark as BookmarkType, LastReadPosition } from '../types/quran';
import { SURAHS_LIST } from '../data/surahs';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkType[];
  lastRead: LastReadPosition | null;
  onSelectBookmark: (surahNumber: number, ayahNumber: number) => void;
  onDeleteBookmark: (id: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  lastRead,
  onSelectBookmark,
  onDeleteBookmark,
}) => {
  if (!isOpen) return null;

  const lastReadSurah = lastRead 
    ? SURAHS_LIST.find((s) => s.number === lastRead.surahNumber) 
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch justify-start bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full sm:max-w-md bg-[#FBF9F5] dark:bg-[#16171B] h-[88vh] sm:h-full rounded-t-3xl sm:rounded-none shadow-2xl flex flex-col sm:border-l border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 animate-in slide-in-from-bottom sm:slide-in-from-right duration-200"
        dir="rtl"
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="px-4 py-3 sm:p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-700 dark:text-amber-400 fill-current" />
            <h2 className="text-base sm:text-lg font-bold font-quran">العلامات المرجعية</h2>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-safe">
          {/* Last Read Position Card */}
          {lastReadSurah && (
            <div className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
                <History className="w-4 h-4" />
                <span>آخر موضع قراءة:</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base font-quran text-stone-900 dark:text-stone-100">
                    سورة {lastReadSurah.name}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-mono tabular-nums">
                    الآية {lastRead?.ayahNumber}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (lastRead) {
                      onSelectBookmark(lastRead.surahNumber, lastRead.ayahNumber);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-medium transition-colors min-h-[40px]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>متابعة</span>
                </button>
              </div>
            </div>
          )}

          {/* Bookmarks List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400">
                الآيات المحفوظة ({bookmarks.length})
              </h3>
            </div>

            {bookmarks.length === 0 ? (
              <div className="p-8 text-center text-stone-400 dark:text-stone-500 bg-white/50 dark:bg-stone-800/50 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">لم تقم بحفظ أي آية بعد</p>
                <p className="text-xs mt-1 text-stone-400">
                  انقر على أيقونة الإشارة المرجعية بجانب أي آية لحفظها هنا
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="bg-white dark:bg-stone-800/80 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700/80 hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5">
                      <span className="font-bold text-stone-800 dark:text-stone-200 font-quran text-sm">
                        سورة {bm.surahName} : الآية {bm.ayahNumber}
                      </span>
                      <button
                        onClick={() => onDeleteBookmark(bm.id)}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-red-600 transition-colors"
                        title="حذف الإشارة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p 
                      onClick={() => {
                        onSelectBookmark(bm.surahNumber, bm.ayahNumber);
                        onClose();
                      }}
                      className="font-quran text-base line-clamp-2 text-stone-800 dark:text-stone-200 cursor-pointer hover:text-amber-700 dark:hover:text-amber-400 transition-colors leading-relaxed"
                    >
                      {bm.ayahText}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-[11px] text-stone-400">
                      <span>{new Date(bm.createdAt).toLocaleDateString('ar-EG')}</span>
                      <button
                        onClick={() => {
                          onSelectBookmark(bm.surahNumber, bm.ayahNumber);
                          onClose();
                        }}
                        className="text-amber-700 dark:text-amber-400 font-medium hover:underline flex items-center gap-1 min-h-[36px]"
                      >
                        <span>الانتقال والاستماع</span>
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden sm:block flex-1" onClick={onClose} />
    </div>
  );
};
