import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { type FAQItem } from './SEOHead';

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  title = 'Frequently Asked Questions (FAQ)',
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // Open first item by default

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="glass-card p-6 sm:p-8 space-y-6 my-8">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-emerald-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndexes.includes(index);
          return (
            <div
              key={index}
              className="rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-emerald-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
