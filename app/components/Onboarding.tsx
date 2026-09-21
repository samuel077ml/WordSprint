'use client';

import { useState } from 'react';
import { LEVELS, NativeLang } from '@/app/lib/usePlayerState';

const NATIVE_LANGS: { code: NativeLang; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
];

export default function Onboarding({
  onComplete,
}: {
  onComplete: (nativeLang: NativeLang, startLevel: string) => void;
}) {
  const [lang, setLang] = useState<NativeLang>('es');
  const [level, setLevel] = useState<string>('A1');

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5'>
      <div className='w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center'>
        <h2 className='mb-2 text-2xl font-bold text-[var(--ink)]'>¡Bienvenido a WordSprint!</h2>
        <p className='mb-6 text-sm text-[var(--ink-soft)]'>Cuéntanos un par de cosas para adaptar tus explicaciones.</p>

        <p className='mb-2 text-left text-xs font-bold text-[var(--ink-soft)]'>Tu idioma nativo</p>
        <div className='mb-6 flex flex-wrap gap-2'>
          {NATIVE_LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                lang === l.code
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-[#0B0E1A]'
                  : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--ink)]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <p className='mb-2 text-left text-xs font-bold text-[var(--ink-soft)]'>Tu nivel de inglés actual</p>
        <div className='mb-8 flex flex-wrap gap-2'>
          {LEVELS.filter((_, i) => i <= LEVELS.indexOf('B1')).map((lv) => (
            <button
              key={lv}
              onClick={() => setLevel(lv)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                level === lv
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-[#0B0E1A]'
                  : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--ink)]'
              }`}
            >
              {lv}
            </button>
          ))}
        </div>

        <button
          onClick={() => onComplete(lang, level)}
          className='w-full rounded-lg bg-[var(--gold)] px-5 py-3 font-bold text-[#0B0E1A]'
        >
          Empezar a aprender
        </button>
      </div>
    </div>
  );
}
