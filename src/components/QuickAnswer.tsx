import React from 'react';
import { Sparkles } from 'lucide-react';

interface QuickAnswerProps {
  question: string;
  answer: string;
  facts?: Array<{ label: string; value: string }>;
}

/**
 * Answer-first summary block. Written to be 40–60 words so it can be lifted
 * directly into featured snippets, People Also Ask boxes and AI answers.
 * Annotated with `speakable` + `#quick-answer` in the WebPage schema.
 */
export const QuickAnswer: React.FC<QuickAnswerProps> = ({ question, answer, facts }) => {
  return (
    <section
      id="quick-answer"
      aria-labelledby="quick-answer-question"
      className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
            Quick answer
          </p>
          <h2 id="quick-answer-question" className="mt-1.5 text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            {question}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">{answer}</p>
        </div>
      </div>

      {facts && facts.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-slate-50 px-3 py-2.5 text-center">
              <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                {fact.label}
              </dt>
              <dd className="mt-0.5 text-xs font-bold text-slate-900">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};
