'use client';

import { useState } from 'react';
import { Word } from '@/app/lib/vocabData';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchingRound({
  words,
  onComplete,
}: {
  words: Word[];
  onComplete: () => void;
}) {
  const [leftOrder] = useState(() => shuffle(words.map((w) => w.word)));
  const [rightOrder] = useState(() => shuffle(words.map((w) => w.translation)));
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  function translationFor(word: string) {
    return words.find((w) => w.word === word)?.translation;
  }

  function pickLeft(word: string) {
    if (matched.has(word)) return;
    setSelectedLeft(word);
  }

  function pickRight(translation: string) {
    if (!selectedLeft) return;
    const correct = translationFor(selectedLeft) === translation;

    if (correct) {
      const updated = new Set(matched);
      updated.add(selectedLeft);
      setMatched(updated);
      setSelectedLeft(null);
      if (updated.size === words.length) {
        setTimeout(onComplete, 600);
      }
    } else {
      setWrongFlash(translation);
      setTimeout(() => setWrongFlash(null), 400);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
      <p className="mb-6 text-xs font-bold uppercase tracking-wide text-[var(--primary)]">
        Ronda final · Empareja las palabras
      </p>
      <div className="grid grid-cols-2 gap-6">
        <div className="grid gap-3">
          {leftOrder.map((word) => {
            const isMatched = matched.has(word);
            const isSelected = selectedLeft === word;
            return (
              <button
                key={word}
                onClick={() => pickLeft(word)}
                disabled={isMatched}
                className={`rounded-lg border px-4 py-3 text-left font-medium ${
                  isMatched
                    ? 'border-[var(--border)] bg-transparent text-[var(--ink-soft)] opacity-40'
                    : isSelected
                    ? 'border-[var(--primary)] bg-[var(--surface-2)] text-[var(--ink)]'
                    : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--ink)]'
                }`}
              >
                {word}
              </button>
            );
          })}
        </div>
        <div className="grid gap-3">
          {rightOrder.map((translation) => {
            const isMatched = [...matched].some((w) => translationFor(w) === translation);
            const isWrong = wrongFlash === translation;
            return (
              <button
                key={translation}
                onClick={() => pickRight(translation)}
                disabled={isMatched}
                className={`rounded-lg border px-4 py-3 text-left ${
                  isMatched
                    ? 'border-[var(--border)] bg-transparent text-[var(--ink-soft)] opacity-40'
                    : isWrong
                    ? 'border-rose-400 bg-rose-500/20 text-[var(--ink)]'
                    : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--ink)]'
                }`}
              >
                {translation}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
