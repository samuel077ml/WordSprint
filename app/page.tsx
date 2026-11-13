'use client';

import { useEffect, useState } from 'react';
import { categories, type Word } from '@/app/lib/vocabData';
import { scenarios } from '@/app/lib/scenarios';
import Challenge from '@/app/components/Challenge';
import Conversation from '@/app/components/Conversation';
import DailyPanel from '@/app/components/DailyPanel';
import UpgradeModal from '@/app/components/UpgradeModal';
import Onboarding from '@/app/components/Onboarding';
import AuthForm from '@/app/components/AuthForm';
import { usePlayerState } from '@/app/lib/usePlayerState';
import { dateKey, wordOfTheDay } from '@/app/lib/daily';
import { canOpenCategory, canOpenScenario } from '@/app/lib/access';
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

// Todas las palabras juntas, para elegir la palabra del día
const allWords: Word[] = categories.flatMap((c) => c.words);

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [sessionWords, setSessionWords] = useState<Word[] | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  // Se calcula una sola vez al abrir la página; no se muestra hasta que cargue el usuario
  const [todayWord] = useState<Word>(() => wordOfTheDay(allWords, dateKey(new Date())));
  const player = usePlayerState();
  const userId = player.user?.id;
  const activeScenario = scenarios.find((s) => s.id === scenarioId);
  const inActivity = selected !== null || scenarioId !== null;

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

  // Si el contenido es Premium y el usuario no lo tiene, se muestra la invitación en vez de abrirlo
  function tryOpenCategory(name: string) {
    if (!player.loaded) return;
    if (!canOpenCategory(name, player.isPremium)) {
      setShowUpgrade(true);
      return;
    }
    openCategory(name);
  }

  function tryOpenScenario(id: string) {
    if (!player.loaded) return;
    if (!canOpenScenario(id, player.isPremium)) {
      setShowUpgrade(true);
      return;
    }
    setScenarioId(id);
  }

  function goBack() {
    setSelected(null);
    setScenarioId(null);
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
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      <header className='mb-6 flex items-center justify-between'>
        <h1 className='text-xl font-bold tracking-tight text-[var(--ink)]'>WordSprint</h1>
        <div className='flex items-center gap-4'>
          {inActivity && (
            <button onClick={goBack} className='text-sm text-[var(--ink-soft)]'>
              ← Volver al inicio
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

      {!inActivity && player.loaded && player.user && player.onboarded && (
        <DailyPanel answers={player.dailyAnswers} word={todayWord} englishOnly={player.englishOnly} />
      )}

      {!inActivity && (
        <>
          <h2 className='mb-4 text-xl font-bold text-[var(--ink)]'>Vocabulario por temas</h2>
          <section className='mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {categories.map((cat) => {
              const style = styles[cat.name];
              const mastered = cat.words.filter((w) => isMastered(visibleProgress[`${cat.name}|${w.word}`])).length;
              const toReview = cat.words.filter((w) => needsReview(visibleProgress[`${cat.name}|${w.word}`])).length;
              const locked = player.loaded && !canOpenCategory(cat.name, player.isPremium);
              return (
                <button
                  key={cat.name}
                  onClick={() => tryOpenCategory(cat.name)}
                  className={`rounded-2xl border border-[var(--border)] bg-gradient-to-br ${style.gradient} bg-[var(--surface)] p-6 text-left transition hover:-translate-y-1 hover:border-[var(--primary)]`}
                >
                  <p className='mb-3 text-xs font-semibold tracking-wide text-[var(--ink-soft)]'>
                    {locked ? '🔒 PREMIUM' : `${mastered}/${cat.words.length} DOMINADAS`}
                  </p>
                  <h3 className='mb-2 text-2xl font-bold text-[var(--ink)]'>{cat.name}</h3>
                  <p className='mb-4 text-sm text-[var(--ink-soft)]'>
                    Practica el vocabulario esencial para desenvolverte en este tema.
                  </p>
                  {!locked && toReview > 0 && (
                    <p className='mb-3 text-xs font-bold text-amber-300'>🔁 {toReview} por repasar</p>
                  )}
                  <span
                    className={`inline-block rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-bold ${style.accent}`}
                  >
                    {style.level}
                  </span>
                </button>
              );
            })}
          </section>

          <h2 className='mb-1 text-xl font-bold text-[var(--ink)]'>Situaciones reales</h2>
          <p className='mb-4 text-sm text-[var(--ink-soft)]'>
            Practica conversaciones completas eligiendo la respuesta más natural.
          </p>
          <section className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {scenarios.map((sc) => {
              const locked = player.loaded && !canOpenScenario(sc.id, player.isPremium);
              return (
                <button
                  key={sc.id}
                  onClick={() => tryOpenScenario(sc.id)}
                  className={`rounded-2xl border border-[var(--border)] bg-gradient-to-br ${sc.gradient} bg-[var(--surface)] p-6 text-left transition hover:-translate-y-1 hover:border-[var(--primary)]`}
                >
                  <p className='mb-3 text-xs font-semibold tracking-wide text-[var(--ink-soft)]'>
                    {locked ? '🔒 PREMIUM' : `CONVERSACIÓN · ${sc.turns.length} TURNOS`}
                  </p>
                  <h3 className='mb-4 text-2xl font-bold text-[var(--ink)]'>
                    {sc.emoji} {sc.name}
                  </h3>
                  <span
                    className={`inline-block rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-bold ${sc.accent}`}
                  >
                    {sc.level}
                  </span>
                </button>
              );
            })}
          </section>
        </>
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

      {activeScenario && (
        <Conversation
          key={activeScenario.id}
          scenario={activeScenario}
          englishOnly={player.englishOnly}
          onAnswer={(correct) => player.registerAnswer(correct)}
        />
      )}
    </main>
  );
}
