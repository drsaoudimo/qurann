import React from 'react';
import { X, Palette, Check, Sparkles, Moon, Sun, Leaf, Compass } from 'lucide-react';
import { AppTheme } from '../types/quran';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

interface ThemeOption {
  id: AppTheme;
  name: string;
  subtitle: string;
  bgPreview: string;
  cardPreview: string;
  accentPreview: string;
  textPreview: string;
  isDark: boolean;
}

const THEMES: ThemeOption[] = [
  {
    id: 'paper',
    name: 'ورق المصحف',
    subtitle: 'أصيل ومريح للعين نهاراً مع حواف مذهبة',
    bgPreview: '#FBF9F5',
    cardPreview: '#FFFFFF',
    accentPreview: '#B45309',
    textPreview: '#1C1917',
    isDark: false,
  },
  {
    id: 'sepia',
    name: 'السيبيا العتيق',
    subtitle: 'درجات دافئة كالمخطوطات الإسلامية التاريخية',
    bgPreview: '#F3EBD9',
    cardPreview: '#FCF8EE',
    accentPreview: '#964817',
    textPreview: '#2A1F13',
    isDark: false,
  },
  {
    id: 'dark',
    name: 'الليل الهادئ (Dark)',
    subtitle: 'أسود فحمي مريح جداً للقراءة في الإضاءة الخافتة',
    bgPreview: '#121316',
    cardPreview: '#18191E',
    accentPreview: '#F59E0B',
    textPreview: '#F3F4F6',
    isDark: true,
  },
  {
    id: 'emerald',
    name: 'الروضة الخضراء',
    subtitle: 'أخضر إسلامي فاخر مستوحى من قباب الروضة الشريفة',
    bgPreview: '#081611',
    cardPreview: '#0E221B',
    accentPreview: '#10B981',
    textPreview: '#ECFDF5',
    isDark: true,
  },
  {
    id: 'navy',
    name: 'الكحلي الملوكي',
    subtitle: 'أزرق ليلي عميق مع إشراق ذهبي وسماوي رصين',
    bgPreview: '#0A1220',
    cardPreview: '#0F1C31',
    accentPreview: '#38BDF8',
    textPreview: '#F0F6FF',
    isDark: true,
  },
];

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#FBF9F5] dark:bg-[#16171B] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[90vh] overflow-hidden text-stone-900 dark:text-stone-100"
        dir="rtl"
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto my-3" />

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-700 dark:text-amber-400 border border-amber-600/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-quran leading-tight">
                اختر مظهر المصحف (الثيم)
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                5 ثيمات مخصصة لراحة العين أثناء التلاوة والقراءة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Themes Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;

            return (
              <button
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme.id);
                  onClose();
                }}
                className={`w-full text-right p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 min-h-[58px] ${
                  isSelected
                    ? 'ring-2 ring-amber-500 border-amber-500 shadow-md scale-[1.01]'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600'
                }`}
                style={{ backgroundColor: theme.bgPreview }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Visual Color Palette Swatch */}
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center shadow-xs border shrink-0"
                    style={{ 
                      backgroundColor: theme.cardPreview, 
                      borderColor: theme.accentPreview + '50'
                    }}
                  >
                    <span 
                      className="font-quran text-lg font-bold"
                      style={{ color: theme.accentPreview }}
                    >
                      ق
                    </span>
                  </div>

                  {/* Name and subtitle */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span 
                        className="font-bold text-base font-cairo leading-tight block"
                        style={{ color: theme.textPreview }}
                      >
                        {theme.name}
                      </span>
                    </div>
                    <p 
                      className="text-xs truncate mt-0.5"
                      style={{ color: theme.isDark ? '#9CA3AF' : '#78716C' }}
                    >
                      {theme.subtitle}
                    </p>
                  </div>
                </div>

                {/* Selection Checkmark */}
                <div className="shrink-0">
                  {isSelected ? (
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: theme.accentPreview }}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div 
                      className="w-6 h-6 rounded-full border opacity-50"
                      style={{ borderColor: theme.textPreview }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 flex items-center justify-between pb-safe">
          <span className="text-xs text-stone-500 dark:text-stone-400">
            يتم حفظ الثيم المختار تلقائياً في هاتفك
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium text-xs rounded-xl hover:bg-stone-800 dark:hover:bg-white transition-colors min-h-[44px]"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
