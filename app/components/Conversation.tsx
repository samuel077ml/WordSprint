'use client';

import { useState } from 'react';
import type { Scenario } from '@/app/lib/scenarios';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speak(text: string) {
  if (typeof window === 'undefined') return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

type HistoryItem = { partner: string; reply: string; ok: boolean };

export default function Conversation({
  scenario,
  englishOnly,
  onAnswer,
}: {
  scenario: Scenario;
  englishOnly: boolean;
  onAnswer: (correct: boolean) => void;
}) {
  // El orden de las opciones se mezcla una sola vez, al abrir la situación
  const [turns] = useState(() => scenario.turns.map((t) => ({ ...t, options: shuffle(t.options) })));
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [score, setScore] = useState(0);

  const done = index >= turns.length;
  const turn = done ? null : turns[index];

  function choose(option: string) {
    if (chosen !== null || !turn) return;
    const ok = option === turn.answer;
    setChosen(option);
    if (ok) setScore((s) => s + 1);
    onAnswer(ok);
  }

  function next() {
    if (!turn || chosen === null) return;
    setHistory((h) => [...h, { partner: turn.partner, reply: chosen, ok: chosen === turn.answer }]);
    setChosen(null);
    setIndex((i) => i + 1);
  }

  if (done) {
    return (
      <div className='rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8'>
        <h2 className='mb-1 text-2xl font-bold text-[var(--ink)]'>¡Situación completa!</h2>
        <p className='mb-6 text-[var(--ink-soft)]'>
          Acertaste {score} de {turns.length} en «{scenario.name}».
        </p>
        <p className='mb-3 text-sm font-bold text-[var(--ink)]'>La conversación completa, para repasarla:</p>
        <div className='grid gap-3'>
          {turns.map((t) => (
            <div key={t.partner} className='grid gap-2'>
              <div className='max-w-[85%] rounded-2xl rounded-bl-sm bg-[var(--surface-2)] px-4 py-2 text-sm text-[var(--ink)]'>
                <span className='mb-0.5 block text-xs font-bold text-[var(--ink-soft)]'>{scenario.partnerRole}</span>
                {t.partner}
              </div>
              <div className='ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[#0B0E1A]'>
                {t.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isLast = index === turns.length - 1;

  return (
    <div className='rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8'>
      <p className='mb-4 text-xs font-bold uppercase tracking-wide text-[var(--primary)]'>
        {scenario.emoji} {scenario.name} · Turno {index + 1} de {turns.length}
      </p>

      {index === 0 && (
        <div className='mb-5 flex items-start gap-3 rounded-lg border border-dashed border-[var(--gold)] bg-[var(--surface-2)] px-4 py-3 text-sm'>
          <span className='mt-0.5'>💡</span>
          <span className='text-[var(--ink)]'>{englishOnly ? scenario.intro_en : scenario.intro_es}</span>
        </div>
      )}

      <div className='mb-5 grid gap-3'>
        {history.map((h) => (
          <div key={h.partner} className='grid gap-2'>
            <div className='max-w-[85%] rounded-2xl rounded-bl-sm bg-[var(--surface-2)] px-4 py-2 text-sm text-[var(--ink-soft)]'>
              {h.partner}
            </div>
            <div
              className={`ml-auto max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2 text-sm ${
                h.ok ? 'bg-emerald-500/20 text-[var(--ink)]' : 'bg-rose-500/20 text-[var(--ink)]'
              }`}
            >
              {h.ok ? '✅ ' : '❌ '}
              {h.reply}
            </div>
          </div>
        ))}

        {turn && (
          <div className='flex items-start gap-2'>
            <div className='max-w-[85%] rounded-2xl rounded-bl-sm bg-[var(--surface-2)] px-4 py-3 text-[var(--ink)]'>
              <span className='mb-0.5 block text-xs font-bold text-[var(--ink-soft)]'>{scenario.partnerRole}</span>
              {turn.partner}
            </div>
            <button
              onClick={() => speak(turn.partner)}
              aria-label='Escuchar la frase'
              className='rounded-full bg-[var(--surface-2)] px-3 py-2 text-lg'
            >
              🔊
            </button>
          </div>
        )}
      </div>

      {turn && (
        <div className='grid gap-3'>
          {turn.options.map((opt) => {
            const isAnswer = opt === turn.answer;
            const isChosenWrong = chosen === opt && !isAnswer;
            return (
              <button
                key={opt}
                onClick={() => choose(opt)}
                disabled={chosen !== null}
                className={`rounded-lg border px-4 py-3 text-left ${
                  chosen !== null && isAnswer
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : isChosenWrong
                      ? 'border-rose-400 bg-rose-500/20'
                      : 'border-[var(--border)] bg-[var(--surface-2)]'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {turn && chosen !== null && (
        <div className='mt-5'>
          <p className={`mb-1 text-sm font-bold ${chosen === turn.answer ? 'text-emerald-400' : 'text-rose-400'}`}>
            {chosen === turn.answer ? '¡Correcto!' : 'Casi. La respuesta natural era la marcada en verde.'}
          </p>
          <p className='mb-4 text-sm text-[var(--ink-soft)]'>{englishOnly ? turn.explain_en : turn.explain_es}</p>
          <button onClick={next} className='rounded-lg bg-[var(--ink)] px-5 py-2 font-semibold text-[var(--bg)]'>
            {isLast ? 'Ver resultado' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  );
}
