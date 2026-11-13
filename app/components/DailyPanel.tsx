'use client';

import type { Word } from '@/app/lib/vocabData';
import { DAILY_BONUS_XP, DAILY_GOAL } from '@/app/lib/daily';

function speak(text: string) {
  if (typeof window === 'undefined') return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export default function DailyPanel({
  answers,
  word,
  englishOnly,
}: {
  answers: number;
  word: Word;
  englishOnly: boolean;
}) {
  const done = answers >= DAILY_GOAL;
  const pct = Math.min(100, (answers / DAILY_GOAL) * 100);

  return (
    <section className='mb-8 grid grid-cols-1 gap-5 md:grid-cols-2'>
      <div className='rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6'>
        <h2 className='mb-1 text-lg font-bold text-[var(--ink)]'>Misión de hoy</h2>
        <p className='mb-4 text-sm text-[var(--ink-soft)]'>
          {done
            ? `¡Misión cumplida! Ganaste +${DAILY_BONUS_XP} XP extra.`
            : `Responde ${DAILY_GOAL} palabras hoy y gana +${DAILY_BONUS_XP} XP extra.`}
        </p>
        <div className='mb-2 h-3 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-2)]'>
          <div
            className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-emerald-400' : 'bg-[var(--primary)]'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className='text-xs font-semibold text-[var(--ink-soft)]'>
          {done ? '✅ ' : ''}
          {Math.min(answers, DAILY_GOAL)}/{DAILY_GOAL} respuestas
        </p>
      </div>

      <div className='rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6'>
        <h2 className='mb-3 text-lg font-bold text-[var(--ink)]'>Palabra del día</h2>
        <div className='mb-2 flex items-center gap-3'>
          <span className='text-3xl font-bold text-[var(--gold)]'>{word.word}</span>
          <button
            onClick={() => speak(word.word)}
            aria-label={`Escuchar ${word.word}`}
            className='rounded-full bg-[var(--surface-2)] px-3 py-2 text-lg'
          >
            🔊
          </button>
        </div>
        <p className='mb-3 text-sm font-semibold text-[var(--ink)]'>{word.translation}</p>
        <p className='mb-2 text-sm italic text-[var(--ink-soft)]'>{word.sentence.replace('___', word.word)}</p>
        <p className='text-xs text-[var(--ink-soft)]'>{englishOnly ? word.hint_en : word.hint_es}</p>
      </div>
    </section>
  );
}
