'use client';

import MatchingRound from '@/app/components/MatchingRound';
import { Word } from '@/app/lib/vocabData';
import { useState } from 'react';

type Mode = 'multiple' | 'type' | 'listen' | 'order';

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

function cleanSentence(sentence: string, word: string): string {
  return sentence.replace('___', word).replace(/[.?!]$/, '');
}

type Round = { index: number; mode: Mode; options: string[]; tokens: string[] };

function pickRound(index: number, words: Word[]): Round {
  const word = words[index];
  const modes: Mode[] = ['multiple', 'type', 'listen', 'order'];
  const mode = modes[Math.floor(Math.random() * modes.length)];
  const options = shuffle([word.translation, ...word.distractors]);
  const fullSentence = cleanSentence(word.sentence, word.word);
  const tokens = shuffle(fullSentence.split(' '));
  return { index, mode, options, tokens };
}

export default function Challenge({
  categoryName,
  words,
  englishOnly,
  onAnswer,
}: {
  categoryName: string;
  words: Word[];
  englishOnly: boolean;
  onAnswer: (word: string, correct: boolean) => void;
}) {
  const [round, setRound] = useState<Round>(() => pickRound(0, words));
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [matchingDone, setMatchingDone] = useState(false);

  const done = round.index >= words.length;
  const current = !done ? words[round.index] : null;

  function answerCorrect() {
    if (!current) return;
    setScore((s) => s + 1);
    setFeedback('correct');
    onAnswer(current.word, true);
  }
  function answerWrong() {
    if (!current) return;
    setFeedback('wrong');
    onAnswer(current.word, false);
  }

  function checkChoice(choice: string) {
    if (feedback || !current) return;
    choice === current.translation ? answerCorrect() : answerWrong();
  }

  function checkTyped() {
    if (feedback || !current) return;
    const clean = typedAnswer.trim().toLowerCase();
    clean === current.word.toLowerCase() ? answerCorrect() : answerWrong();
  }

  function tapToken(token: string, fromAvailable: boolean) {
    if (feedback) return;
    if (fromAvailable) {
      setSelectedTokens((prev) => [...prev, token]);
    } else {
      setSelectedTokens((prev) => {
        const idx = prev.indexOf(token);
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      });
    }
  }

  function checkOrder() {
    if (feedback || !current) return;
    const built = selectedTokens.join(' ').toLowerCase();
    const correct = cleanSentence(current.sentence, current.word).toLowerCase();
    built === correct ? answerCorrect() : answerWrong();
  }

  function next() {
    setTypedAnswer('');
    setSelectedTokens([]);
    setFeedback(null);
    const nextIndex = round.index + 1;
    setRound(
      nextIndex >= words.length
        ? { index: nextIndex, mode: 'multiple', options: [], tokens: [] }
        : pickRound(nextIndex, words),
    );
  }

  if (done) {
    if (!matchingDone) {
      return <MatchingRound words={words.slice(0, 6)} onComplete={() => setMatchingDone(true)} />;
    }
    return (
      <div className='rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center'>
        <h2 className='mb-2 text-2xl font-bold text-[var(--ink)]'>¡Sección completa!</h2>
        <p className='text-[var(--ink-soft)]'>
          Acertaste {score} de {words.length} en {categoryName}.
        </p>
      </div>
    );
  }

  const availableTokens = round.tokens.filter((t, i) => {
    const usedCount = selectedTokens.filter((s) => s === t).length;
    const seenBefore = round.tokens.slice(0, i).filter((x) => x === t).length;
    return seenBefore >= usedCount;
  });

  return (
    <div className='rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8'>
      <p className='mb-4 text-xs font-bold uppercase tracking-wide text-[var(--primary)]'>
        {categoryName} · Palabra {round.index + 1} de {words.length}
      </p>

      {current && (
        <div className='mb-5 flex items-start gap-3 rounded-lg border border-dashed border-[var(--gold)] bg-[var(--surface-2)] px-4 py-3 text-sm'>
          <span className='mt-0.5'>💡</span>
          <span className='text-[var(--ink)]'>{englishOnly ? current.hint_en : current.hint_es}</span>
        </div>
      )}

      {round.mode === 'multiple' && current && (
        <>
          <p className='mb-6 text-lg text-[var(--ink)]'>{current.sentence.replace('___', `[ ${current.word} ]`)}</p>
          <div className='grid gap-3'>
            {round.options.map((opt) => (
              <button
                key={opt}
                onClick={() => checkChoice(opt)}
                className={`rounded-lg border px-4 py-3 text-left ${
                  feedback && opt === current.translation
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : 'border-[var(--border)] bg-[var(--surface-2)]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {round.mode === 'type' && current && (
        <>
          <p className='mb-2 text-sm text-[var(--ink-soft)]'>
            Traducción: <strong className='text-[var(--ink)]'>{current.translation}</strong>
          </p>
          <p className='mb-6 text-lg text-[var(--ink)]'>{current.sentence.replace('___', '_____')}</p>
          <input
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            placeholder='Escribe la palabra en inglés'
            className='mb-3 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--ink)]'
          />
          <button
            onClick={checkTyped}
            className='rounded-lg bg-[var(--primary)] px-5 py-2 font-semibold text-[#0B0E1A]'
          >
            Comprobar
          </button>
        </>
      )}

      {round.mode === 'listen' && current && (
        <>
          <button
            onClick={() => speak(current.word)}
            className='mb-6 rounded-full bg-[var(--surface-2)] px-6 py-4 text-2xl'
          >
            🔊 Reproducir
          </button>
          <div className='grid gap-3'>
            {round.options.map((opt) => (
              <button
                key={opt}
                onClick={() => checkChoice(opt)}
                className={`rounded-lg border px-4 py-3 text-left ${
                  feedback && opt === current.translation
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : 'border-[var(--border)] bg-[var(--surface-2)]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {round.mode === 'order' && current && (
        <>
          <p className='mb-2 text-sm text-[var(--ink-soft)]'>Ordena las palabras para formar la oración correcta:</p>
          <div className='mb-4 flex min-h-[52px] flex-wrap gap-2 rounded-lg border border-dashed border-[var(--border)] p-3'>
            {selectedTokens.map((token, i) => (
              <button
                key={i}
                onClick={() => tapToken(token, false)}
                className='rounded-md bg-[var(--primary)] px-3 py-1.5 text-sm font-semibold text-[#0B0E1A]'
              >
                {token}
              </button>
            ))}
          </div>
          <div className='mb-6 flex flex-wrap gap-2'>
            {availableTokens.map((token, i) => (
              <button
                key={i}
                onClick={() => tapToken(token, true)}
                className='rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-sm text-[var(--ink)]'
              >
                {token}
              </button>
            ))}
          </div>
          <button
            onClick={checkOrder}
            disabled={selectedTokens.length !== round.tokens.length}
            className='rounded-lg bg-[var(--primary)] px-5 py-2 font-semibold text-[#0B0E1A] disabled:opacity-40'
          >
            Comprobar
          </button>
        </>
      )}

      {feedback && (
        <div className='mt-6 flex items-center justify-between'>
          <span className={feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'}>
            {feedback === 'correct' ? '¡Correcto!' : `Era: ${current && cleanSentence(current.sentence, current.word)}`}
          </span>
          <button onClick={next} className='rounded-lg bg-[var(--ink)] px-5 py-2 font-semibold text-[var(--bg)]'>
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
