'use client';

import { PRICE_LABEL } from '@/app/lib/access';

export default function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5'
      role='dialog'
      aria-modal='true'
      aria-labelledby='upgrade-title'
    >
      <div className='w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8'>
        <h2 id='upgrade-title' className='mb-1 text-2xl font-bold text-[var(--ink)]'>
          WordSprint Premium
        </h2>
        <p className='mb-5 text-sm text-[var(--ink-soft)]'>Este contenido es parte de Premium, por {PRICE_LABEL}.</p>

        <ul className='mb-6 grid gap-2 text-sm text-[var(--ink)]'>
          <li>✅ Todas las categorías de vocabulario</li>
          <li>✅ Todas las situaciones reales (restaurante, entrevista, hotel)</li>
          <li>✅ Todo lo que se agregue después</li>
        </ul>

        <p className='mb-5 rounded-lg border border-dashed border-[var(--gold)] bg-[var(--surface-2)] px-4 py-3 text-xs text-[var(--ink-soft)]'>
          El pago todavía no está disponible: lo estamos terminando.
        </p>

        <button onClick={onClose} className='w-full rounded-lg bg-[var(--gold)] px-5 py-3 font-bold text-[#0B0E1A]'>
          Entendido
        </button>
      </div>
    </div>
  );
}
