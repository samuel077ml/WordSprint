'use client';

import { DAILY_BONUS_XP, DAILY_GOAL, todayAndYesterday } from '@/app/lib/daily';
import { supabase } from '@/app/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

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
  daily_answers: number;
  daily_date: string | null;
  is_premium: boolean;
};

export function usePlayerState() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [storedProfile, setStoredProfile] = useState<Profile | null>(null);

  // Escuchar la sesión de autenticación (sincronizar con un sistema externo: Supabase Auth)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Cuando hay un usuario logueado, cargar (o crear) su fila de progreso.
  useEffect(() => {
    if (!user) return;

    const userId = user.id;
    let cancelled = false;

    async function loadProfile() {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

      if (cancelled) return;

      if (data) {
        const { today, yesterday } = todayAndYesterday();
        const row = data as Profile;
        // Si la última práctica no fue hoy ni ayer, la racha ya se perdió
        const alive = row.last_active_date === today || row.last_active_date === yesterday;
        // Si la misión guardada es de otro día, hoy empieza en cero
        const sameDay = row.daily_date === today;
        setStoredProfile({
          ...row,
          streak_count: alive ? row.streak_count : 0,
          daily_answers: sameDay ? row.daily_answers : 0,
        });
      } else {
        // Importante: is_premium NO se envía al crear el perfil. Solo se puede cambiar desde Supabase o el servidor.
        const newProfile = {
          id: userId,
          native_lang: 'es' as NativeLang,
          xp: 0,
          onboarded: false,
          streak_count: 0,
          last_active_date: null,
          daily_answers: 0,
          daily_date: null,
        };
        await supabase.from('profiles').insert(newProfile);
        if (!cancelled) setStoredProfile({ ...newProfile, is_premium: false });
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // El perfil solo cuenta si pertenece al usuario actual. Así, al cerrar sesión
  // o cambiar de cuenta, el perfil anterior se ignora sin tener que borrarlo.
  const profile = user && storedProfile?.id === user.id ? storedProfile : null;

  // Listo para mostrar la app: ya sabemos si hay sesión y, si la hay, ya cargó su perfil
  const loaded = authChecked && (!user || profile !== null);

  async function completeOnboarding(nativeLang: NativeLang, startLevel: string) {
    if (!user) return;
    const levelIndex = Math.max(LEVELS.indexOf(startLevel as (typeof LEVELS)[number]), 0);
    const xp = levelIndex * XP_PER_LEVEL;
    setStoredProfile({
      id: user.id,
      native_lang: nativeLang,
      xp,
      onboarded: true,
      streak_count: 0,
      last_active_date: null,
      daily_answers: 0,
      daily_date: null,
      is_premium: profile?.is_premium ?? false,
    });
    await supabase.from('profiles').update({ native_lang: nativeLang, xp, onboarded: true }).eq('id', user.id);
  }

  // Se llama cada vez que el usuario responde una palabra (bien o mal).
  // Actualiza en una sola operación: XP, racha y misión del día.
  async function registerAnswer(correct: boolean) {
    if (!user || !profile) return;
    const { today, yesterday } = todayAndYesterday();

    // Racha: sube una sola vez por día
    let streak = profile.streak_count;
    if (profile.last_active_date !== today) {
      streak = profile.last_active_date === yesterday ? profile.streak_count + 1 : 1;
    }

    // Misión diaria: cuenta respuestas de hoy y da XP extra al llegar a la meta
    const before = profile.daily_date === today ? profile.daily_answers : 0;
    const after = before + 1;
    const bonus = before < DAILY_GOAL && after >= DAILY_GOAL ? DAILY_BONUS_XP : 0;

    const xp = profile.xp + (correct ? 1 : 0) + bonus;

    setStoredProfile({
      ...profile,
      xp,
      streak_count: streak,
      last_active_date: today,
      daily_answers: after,
      daily_date: today,
    });
    await supabase
      .from('profiles')
      .update({
        xp,
        streak_count: streak,
        last_active_date: today,
        daily_answers: after,
        daily_date: today,
      })
      .eq('id', user.id);
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
    dailyAnswers: profile?.daily_answers ?? 0,
    isPremium: profile?.is_premium ?? false,
    level,
    levelIndex,
    englishOnly,
    progressPct,
    completeOnboarding,
    registerAnswer,
    signOut,
  };
}
