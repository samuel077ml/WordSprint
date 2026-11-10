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
  streak_count: number;
  last_active_date: string | null;
};

// Fecha local del dispositivo en formato AAAA-MM-DD
function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayAndYesterday() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return { today: dateKey(now), yesterday: dateKey(yesterday) };
}

export function usePlayerState() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Escuchar la sesión de autenticación (sincronizar con un sistema externo: Supabase Auth)
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
        // Si la última práctica no fue hoy ni ayer, la racha ya se perdió
        const { today, yesterday } = todayAndYesterday();
        const row = data as Profile;
        const alive = row.last_active_date === today || row.last_active_date === yesterday;
        setProfile({ ...row, streak_count: alive ? row.streak_count : 0 });
      } else {
        const defaultProfile: Profile = {
          id: userId,
          native_lang: 'es',
          xp: 0,
          onboarded: false,
          streak_count: 0,
          last_active_date: null,
        };
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
    setProfile({
      id: user.id,
      native_lang: nativeLang,
      xp,
      onboarded: true,
      streak_count: 0,
      last_active_date: null,
    });
    await supabase.from('profiles').update({ native_lang: nativeLang, xp, onboarded: true }).eq('id', user.id);
  }

  // Se llama cada vez que el usuario responde una palabra (bien o mal).
  // Suma XP si acertó, y actualiza la racha una sola vez por día.
  async function registerAnswer(correct: boolean) {
    if (!user || !profile) return;
    const { today, yesterday } = todayAndYesterday();

    let streak = profile.streak_count;
    if (profile.last_active_date !== today) {
      streak = profile.last_active_date === yesterday ? profile.streak_count + 1 : 1;
    }
    const xp = profile.xp + (correct ? 1 : 0);

    setProfile({ ...profile, xp, streak_count: streak, last_active_date: today });
    await supabase.from('profiles').update({ xp, streak_count: streak, last_active_date: today }).eq('id', user.id);
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
    streak: profile?.streak_count ?? 0,
    level,
    levelIndex,
    englishOnly,
    progressPct,
    completeOnboarding,
    registerAnswer,
    signOut,
  };
}
