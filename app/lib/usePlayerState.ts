'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
export const XP_PER_LEVEL = 6;
export const B1_INDEX = LEVELS.indexOf('B1');

export type NativeLang = 'es' | 'pt' | 'fr' | 'en';

type Profile = {
  id: string;
  native_lang: NativeLang;
  xp: number;
  onboarded: boolean;
};

export function usePlayerState() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Escuchar la sesión de autenticación: esto es sincronizar con un
  // sistema externo (Supabase Auth), el uso correcto de useEffect.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Cuando cambia el usuario logueado, cargar (o crear) su fila de progreso.
useEffect(() => {
  if (!user) {
    setProfile(null);
    setLoaded(true);
    return;
  }

  const userId = user.id;
  let cancelled = false;

  async function loadProfile() {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

    if (cancelled) return;

    if (data) {
      setProfile(data as Profile);
    } else {
      const defaultProfile: Profile = { id: userId, native_lang: 'es', xp: 0, onboarded: false };
      await supabase.from('profiles').insert(defaultProfile);
      if (!cancelled) setProfile(defaultProfile);
    }
    if (!cancelled) setLoaded(true);
  }

  loadProfile();
  return () => {
    cancelled = true;
  };
}, [user]);

  async function completeOnboarding(nativeLang: NativeLang, startLevel: string) {
    if (!user) return;
    const levelIndex = Math.max(LEVELS.indexOf(startLevel as (typeof LEVELS)[number]), 0);
    const xp = levelIndex * XP_PER_LEVEL;
    setProfile({ id: user.id, native_lang: nativeLang, xp, onboarded: true });
    await supabase.from('profiles').update({ native_lang: nativeLang, xp, onboarded: true }).eq('id', user.id);
  }

  async function addXp(amount: number) {
    if (!user || !profile) return;
    const newXp = profile.xp + amount;
    setProfile({ ...profile, xp: newXp });
    await supabase.from('profiles').update({ xp: newXp }).eq('id', user.id);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const xp = profile?.xp ?? 0;
  const levelIndex = Math.min(Math.floor(xp / XP_PER_LEVEL), LEVELS.length - 1);
  const level = LEVELS[levelIndex];
  const englishOnly = levelIndex >= B1_INDEX;
  const progressPct = levelIndex >= LEVELS.length - 1 ? 100 : ((xp - levelIndex * XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

  return {
    user,
    loaded,
    onboarded: profile?.onboarded ?? false,
    nativeLang: profile?.native_lang ?? 'es',
    xp,
    level,
    levelIndex,
    englishOnly,
    progressPct,
    completeOnboarding,
    addXp,
    signOut,
  };
}
