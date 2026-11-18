import React from 'react';
import { X, Settings2, Type, Globe, BookOpen, Eye, Radio, Palette } from 'lucide-react';
import { AppSettings, AudioSourceType, AppTheme } from '../types/quran';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
  onOpenThemeModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenThemeModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#FBF9F5] dark:bg-[#16171B] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-hidden text-stone-900 dark:text-stone-100"
        dir="rtl"
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="px-4 py-3 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-700 dark:text-amber-400 border border-amber-600/20 shrink-0">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-quran leading-tight">
                إعدادات المصحف والتلاوة
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                تخصيص الخط، المظهر، السيرفر، ووضع التحفيظ
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 pb-safe">
          {/* Quick Theme Switch Banner */}
          <div className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-stone-900 dark:text-stone-100 block">
                  مظهر المصحف (الثيم)
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  5 ثيمات: ورق المصحف، الليل الهادئ، الروضة الخضراء، الكحلي، والسيبيا
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenThemeModal();
              }}
              className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0 min-h-[40px]"
            >
              تغيير الثيم
            </button>
          </div>

          {/* Font Family */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300">
              <Type className="w-4 h-4 text-amber-600" />
              <span>نوع الخط القرآني:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onUpdateSettings({ fontFamily: 'font-quran' })}
                className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all min-h-[52px] ${
                  settings.fontFamily === 'font-quran'
                    ? 'bg-amber-500/10 border-amber-600 text-amber-900 dark:text-amber-200 font-bold shadow-xs'
                    : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span className="font-quran text-base sm:text-lg block">أميري قرآن</span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">عثماني أصيل</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ fontFamily: 'font-scheherazade' })}
                className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all min-h-[52px] ${
                  settings.fontFamily === 'font-scheherazade'
                    ? 'bg-amber-500/10 border-amber-600 text-amber-900 dark:text-amber-200 font-bold shadow-xs'
                    : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span className="font-scheherazade text-base sm:text-lg block">شهرزاد</span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">وضوح فائق</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ fontFamily: 'font-amiri' })}
                className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all min-h-[52px] ${
                  settings.fontFamily === 'font-amiri'
                    ? 'bg-amber-500/10 border-amber-600 text-amber-900 dark:text-amber-200 font-bold shadow-xs'
                    : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span className="font-amiri text-base sm:text-lg block">الأميري</span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">النسخ الكلاسيكي</span>
              </button>
            </div>
          </div>

          {/* Font Size Adjustment */}
          <div className="space-y-2 bg-white dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
              <span>حجم خط الآيات:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateSettings({ fontSize: Math.max(20, settings.fontSize - 2) })}
                  className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center font-bold text-sm"
                >
                  -
                </button>
                <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400 font-bold">
                  {settings.fontSize}px
                </span>
                <button
                  onClick={() => onUpdateSettings({ fontSize: Math.min(48, settings.fontSize + 2) })}
                  className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>
            <input
              type="range"
              min={20}
              max={44}
              step={2}
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: parseInt(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer h-2"
            />
            {/* Live preview */}
            <div 
              className={`text-center py-2 text-stone-900 dark:text-stone-100 ${settings.fontFamily}`}
              style={{ fontSize: `${settings.fontSize}px` }}
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
          </div>

          {/* Audio Source Preference */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300">
              <Radio className="w-4 h-4 text-amber-600" />
              <span>سيرفر التلاوة الصوتي:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onUpdateSettings({ audioSource: 'archive' })}
                className={`p-3 rounded-xl border text-right transition-all min-h-[54px] ${
                  settings.audioSource === 'archive'
                    ? 'bg-amber-500/10 border-amber-600 text-amber-900 dark:text-amber-200 font-bold'
                    : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span className="font-bold block">موقع أرشيف Archive.org</span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  خوادم أرشيف المباشرة
                </span>
              </button>

              <button
                onClick={() => onUpdateSettings({ audioSource: 'everyayah' })}
                className={`p-3 rounded-xl border text-right transition-all min-h-[54px] ${
                  settings.audioSource === 'everyayah'
                    ? 'bg-amber-500/10 border-amber-600 text-amber-900 dark:text-amber-200 font-bold'
                    : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span className="font-bold block">إيفري آية CDN (موصى به)</span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  شبكة توزيع سريعة مخصصة
                </span>
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 bg-white dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
            {/* Show Translation */}
            <label className="flex items-center justify-between cursor-pointer min-h-[44px]">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-stone-500 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    عرض الترجمة الإنجليزية (English)
                  </span>
                  <span className="text-[11px] text-stone-400">ترجمة صحيح انترناشيونال</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showTranslation}
                onChange={(e) => onUpdateSettings({ showTranslation: e.target.checked })}
                className="w-5 h-5 accent-amber-600 rounded"
              />
            </label>

            {/* Show Inline Tafsir */}
            <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-stone-100 dark:border-stone-700 min-h-[44px]">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-stone-500 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    عرض التفسير الميسر تلقائياً
                  </span>
                  <span className="text-[11px] text-stone-400">إظهار تفسير الآية داخل كل بطاقة</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showTafsirInline}
                onChange={(e) => onUpdateSettings({ showTafsirInline: e.target.checked })}
                className="w-5 h-5 accent-amber-600 rounded"
              />
            </label>

            {/* Memorization Mode */}
            <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-stone-100 dark:border-stone-700 min-h-[44px]">
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    وضع التحفيظ (إخفاء النص لاختبار الحفظ)
                  </span>
                  <span className="text-[11px] text-stone-400">حجب الآية بالضباب والنقر لإظهارها</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.memorizationMode}
                onChange={(e) => onUpdateSettings({ memorizationMode: e.target.checked })}
                className="w-5 h-5 accent-emerald-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 flex justify-end pb-safe shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition-colors min-h-[44px]"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
