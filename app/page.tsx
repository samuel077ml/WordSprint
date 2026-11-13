'use client';

import { useEffect, useState } from 'react';
import { categories, type Word } from '@/app/lib/vocabData';
import Challenge from '@/app/components/Challenge';
import Onboarding from '@/app/components/Onboarding';
import AuthForm from '@/app/components/AuthForm';
import { usePlayerState } from '@/app/lib/usePlayerState';
import {
  loadAllProgress,
  recordAnswer,
  isMastered,
  needsReview,
  orderForReview,
  type ProgressMap,
} from '@/app/lib/wordProgress';

const styles: Record<string, { gradient: string; accent: string; level: string }> = {
  Deportes: { gradient: 'from-cyan-500/20 to-blue-900/40', accent: 'text-cyan-300', level: 'PRINCIPIANTE' },
  Comida: { gradient: 'from-amber-500/20 to-orange-900/40', accent: 'text-amber-300', level: 'PRINCIPIANTE' },
  Formal: { gradient: 'from-violet-500/20 to-purple-900/40', accent: 'text-violet-300', level: 'INTERMEDIO' },
  Negocios: { gradient: 'from-emerald-500/20 to-teal-900/40', accent: 'text-emerald-300', level: 'INTERMEDIO' },
  Estudios: { gradient: 'from-rose-500/20 to-pink-900/40', accent: 'text-rose-300', level: 'PRINCIPIANTE' },
};

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const [sessionWords, setSessionWords] = useState<Word[] | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  const player = usePlayerState();
  const userId = player.user?.id;

  // Cargar el progreso guardado cuando hay un usuario logueado
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    loadAllProgress(userId).then((data) => {
      if (!cancelled) setProgress(data);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const visibleProgress: ProgressMap = userId ? progress : {};

  // Se ejecuta en un clic (no durante el render), así que puede usar azar sin problema.
  function openCategory(name: string) {
    const cat = categories.find((c) => c.name === name);
    if (!cat) return;
    setSessionWords(orderForReview(name, cat.words, visibleProgress).slice(0, 10));
    setSelected(name);
  }

  function goBack() {
    setSelected(null);
    setSessionWords(null);
  }

  function handleAnswer(category: string, word: string, correct: boolean) {
    player.registerAnswer(correct);
    if (!userId) return;

    const key = `${category}|${word}`;
    setProgress((prev) => {
      const old = prev[key] ?? { correct_count: 0, wrong_count: 0 };
      return {
        ...prev,
        [key]: {
          correct_count: old.correct_count + (correct ? 1 : 0),
          wrong_count: old.wrong_count + (correct ? 0 : 1),
        },
      };
    });
    recordAnswer(userId, category, word, correct);
  }

  return (
    <main className='min-h-screen bg-[var(--bg)] px-6 py-10 md:px-16'>
      {player.loaded && !player.user && <AuthForm />}
      {player.loaded && player.user && !player.onboarded && (
        <Onboarding onComplete={(lang, level) => player.completeOnboarding(lang, level)} />
      )}

      <header className='mb-6 flex items-center justify-between'>
        <h1 className='text-xl font-bold tracking-tight text-[var(--ink)]'>WordSprint</h1>
        <div className='flex items-center gap-4'>
          {selected && (
            <button onClick={goBack} className='text-sm text-[var(--ink-soft)]'>
              ← Volver a categorías
            </button>
          )}
          {player.user && (
            <button onClick={() => player.signOut()} className='text-sm text-[var(--ink-soft)] underline'>
              Cerrar sesión
            </button>
          )}
        </div>
      </header>

      <div className='mb-10 flex items-center gap-3'>
        <span className='rounded-full bg-[var(--ink)] px-3 py-1 text-xs font-bold text-[var(--bg)]'>
          {player.level}
        </span>
        <span className='rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-bold text-orange-300'>
          🔥 {player.streak}
        </span>
        <div className='h-3 flex-1 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-2)]'>
          <div
            className='h-full rounded-full bg-[var(--gold)] transition-all duration-500'
            style={{ width: `${player.progressPct}%` }}
          />
        </div>
      </div>

      {!selected && (
        <section className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {categories.map((cat) => {
            const style = styles[cat.name];
            const mastered = cat.words.filter((w) => isMastered(visibleProgress[`${cat.name}|${w.word}`])).length;
            const toReview = cat.words.filter((w) => needsReview(visibleProgress[`${cat.name}|${w.word}`])).length;
            return (
              <button
                key={cat.name}
                onClick={() => openCategory(cat.name)}
                className={`rounded-2xl border border-[var(--border)] bg-gradient-to-br ${style.gradient} bg-[var(--surface)] p-6 text-left transition hover:-translate-y-1 hover:border-[var(--primary)]`}
              >
                <p className='mb-3 text-xs font-semibold tracking-wide text-[var(--ink-soft)]'>
                  {mastered}/{cat.words.length} DOMINADAS
                </p>
                <h3 className='mb-2 text-2xl font-bold text-[var(--ink)]'>{cat.name}</h3>
                <p className='mb-4 text-sm text-[var(--ink-soft)]'>
                  Practica el vocabulario esencial para desenvolverte en este tema.
                </p>
                {toReview > 0 && <p className='mb-3 text-xs font-bold text-amber-300'>🔁 {toReview} por repasar</p>}
                <span
                  className={`inline-block rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-bold ${style.accent}`}
                >
                  {style.level}
                </span>
              </button>
            );
          })}
        </section>
      )}

      {selected && sessionWords && (
        <Challenge
          key={selected}
          categoryName={selected}
          words={sessionWords}
          englishOnly={player.englishOnly}
          onAnswer={(word, correct) => handleAnswer(selected, word, correct)}
        />
      )}
    </main>
  );
}
