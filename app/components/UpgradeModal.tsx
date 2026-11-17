'use client';

import { useState } from 'react';
import { PRICE_LABEL } from '@/app/lib/access';
import { startCheckout } from '@/app/lib/checkout';

export default function UpgradeModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);
    const message = await startCheckout();
    // Si no hubo error, el navegador ya se está yendo a Stripe
    if (message) {
      setError(message);
      setLoading(false);
    }
  }

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

        {error && (
          <p className='mb-4 rounded-lg border border-rose-400 bg-rose-500/10 px-4 py-3 text-sm text-rose-300'>
            {error}
          </p>
        )}

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className='mb-3 w-full rounded-lg bg-[var(--gold)] px-5 py-3 font-bold text-[#0B0E1A] disabled:opacity-60'
        >
          {loading ? 'Abriendo el pago…' : `Hazte Premium · ${PRICE_LABEL}`}
        </button>
        <button onClick={onClose} className='w-full px-5 py-2 text-sm text-[var(--ink-soft)]'>
          Ahora no
        </button>
      </div>
    </div>
  );
}
