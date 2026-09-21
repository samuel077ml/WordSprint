'use client';

import { useEffect, useState } from 'react';

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
export const XP_PER_LEVEL = 6;
export const B1_INDEX = LEVELS.indexOf('B1');

export type NativeLang = 'es' | 'pt' | 'fr' | 'en';

type PlayerState = {
  onboarded: boolean;
  nativeLang: NativeLang;
  xp: number;
};

const STORAGE_KEY = 'wordsprint_player';
const DEFAULT_STATE: PlayerState = { onboarded: false, nativeLang: 'es', xp: 0 };

export function usePlayerState() {
  const [state, setState] = useState<PlayerState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  // Cargar el progreso guardado una sola vez al montar el componente.
  // Esto SÍ es un uso correcto de useEffect: sincronizar con un sistema
  // externo (localStorage), no calcular algo a partir del render.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      // si falla, se queda con el estado por defecto
    }
    setLoaded(true);
  }, []);

  // Guardar cada vez que el estado cambie, después de la carga inicial.
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignorar si el almacenamiento no está disponible
    }
  }, [state, loaded]);

  function completeOnboarding(nativeLang: NativeLang, startLevel: string) {
    const levelIndex = Math.max(LEVELS.indexOf(startLevel as (typeof LEVELS)[number]), 0);
    setState({ onboarded: true, nativeLang, xp: levelIndex * XP_PER_LEVEL });
  }

  function addXp(amount: number) {
    setState((s) => ({ ...s, xp: s.xp + amount }));
  }

  const levelIndex = Math.min(Math.floor(state.xp / XP_PER_LEVEL), LEVELS.length - 1);
  const level = LEVELS[levelIndex];
  const englishOnly = levelIndex >= B1_INDEX;
  const progressPct =
    levelIndex >= LEVELS.length - 1 ? 100 : ((state.xp - levelIndex * XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

  return {
    loaded,
    onboarded: state.onboarded,
    nativeLang: state.nativeLang,
    xp: state.xp,
    level,
    levelIndex,
    englishOnly,
    progressPct,
    completeOnboarding,
    addXp,
  };
}
