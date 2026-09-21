'use client';

import { useState } from 'react';
import { categories } from '@/app/lib/vocabData';
import Challenge from '@/app/components/Challenge';

const styles: Record<string, { gradient: string; accent: string; level: string }> = {
  Deportes: { gradient: 'from-cyan-500/20 to-blue-900/40', accent: 'text-cyan-300', level: 'PRINCIPIANTE' },
  Comida: { gradient: 'from-amber-500/20 to-orange-900/40', accent: 'text-amber-300', level: 'PRINCIPIANTE' },
  Formal: { gradient: 'from-violet-500/20 to-purple-900/40', accent: 'text-violet-300', level: 'INTERMEDIO' },
  Negocios: { gradient: 'from-emerald-500/20 to-teal-900/40', accent: 'text-emerald-300', level: 'INTERMEDIO' },
  Estudios: { gradient: 'from-rose-500/20 to-pink-900/40', accent: 'text-rose-300', level: 'PRINCIPIANTE' },
};

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = categories.find((c) => c.name === selected);

  return (
    <main className="min-h-screen bg-[var(--bg)] px-6 py-10 md:px-16">
      <header className="mb-12 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">Fichero</h1>
        {selected && (
          <button onClick={() => setSelected(null)} className="text-sm text-[var(--ink-soft)]">
            ← Volver a categorías
          </button>
        )}
      </header>

      {!selected && (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const style = styles[cat.name];
            return (
              <button
                key={cat.name}
                onClick={() => setSelected(cat.name)}
                className={`rounded-2xl border border-[var(--border)] bg-gradient-to-br ${style.gradient} bg-[var(--surface)] p-6 text-left transition hover:-translate-y-1 hover:border-[var(--primary)]`}
              >
                <p className="mb-3 text-xs font-semibold tracking-wide text-[var(--ink-soft)]">
                  {cat.words.length} PALABRAS
                </p>
                <h3 className="mb-2 text-2xl font-bold text-[var(--ink)]">{cat.name}</h3>
                <p className="mb-5 text-sm text-[var(--ink-soft)]">
                  Practica el vocabulario esencial para desenvolverte en este tema.
                </p>
                <span className={`inline-block rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-bold ${style.accent}`}>
                  {style.level}
                </span>
              </button>
            );
          })}
        </section>
      )}

      {active && <Challenge key={active.name} categoryName={active.name} words={active.words} />}
    </main>
  );
}
