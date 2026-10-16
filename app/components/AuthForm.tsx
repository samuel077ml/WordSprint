'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

export default function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setInfo(null);
    setLoading(true);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setInfo('Cuenta creada. Si tu proyecto pide confirmación por correo, revisa tu bandeja.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }

    setLoading(false);
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5'>
      <div className='w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8'>
        <h2 className='mb-1 text-2xl font-bold text-[var(--ink)]'>WordSprint</h2>
        <p className='mb-6 text-sm text-[var(--ink-soft)]'>
          {mode === 'signup' ? 'Crea tu cuenta para guardar tu progreso' : 'Inicia sesión para continuar'}
        </p>

        <input
          type='email'
          placeholder='Correo'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mb-3 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--ink)]'
        />
        <input
          type='password'
          placeholder='Contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mb-4 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[var(--ink)]'
        />

        {error && <p className='mb-3 text-sm text-rose-400'>{error}</p>}
        {info && <p className='mb-3 text-sm text-emerald-400'>{info}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className='mb-4 w-full rounded-lg bg-[var(--gold)] px-5 py-3 font-bold text-[#0B0E1A] disabled:opacity-40'
        >
          {loading ? 'Cargando...' : mode === 'signup' ? 'Crear cuenta' : 'Iniciar sesión'}
        </button>

        <button
          onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
          className='w-full text-center text-sm text-[var(--ink-soft)] underline'
        >
          {mode === 'signup' ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
}
