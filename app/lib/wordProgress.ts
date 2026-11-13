import { supabase } from '@/app/lib/supabaseClient';
import type { Word } from '@/app/lib/vocabData';

export type WordStats = { correct_count: number; wrong_count: number };
export type ProgressMap = Record<string, WordStats>;

// Una palabra cuenta como "dominada" con al menos 2 aciertos y más aciertos que fallos.
export function isMastered(stats?: WordStats): boolean {
  if (!stats) return false;
  return stats.correct_count >= 2 && stats.correct_count > stats.wrong_count;
}

// Una palabra "por repasar" es una que has fallado más de lo que has acertado.
export function needsReview(stats?: WordStats): boolean {
  if (!stats) return false;
  return stats.wrong_count > stats.correct_count;
}

// Mientras más alto el puntaje, más pronto debe aparecer la palabra.
// Falladas (positivo) > nunca vistas (0.5) > bien sabidas (negativo)
function priority(stats?: WordStats): number {
  if (!stats) return 0.5;
  return stats.wrong_count * 2 - stats.correct_count;
}

// Ordena las palabras de una categoría según qué tanto necesitas repasarlas.
// El pequeño valor al azar solo desempata entre palabras con el mismo puntaje.
// Se debe llamar desde un clic (evento), nunca durante el render, por el Math.random.
export function orderForReview(category: string, words: Word[], progress: ProgressMap): Word[] {
  return words
    .map((w) => ({
      word: w,
      score: priority(progress[`${category}|${w.word}`]) + Math.random() * 0.4,
    }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.word);
}

export async function loadAllProgress(userId: string): Promise<ProgressMap> {
  const { data } = await supabase
    .from('word_progress')
    .select('category, word, correct_count, wrong_count')
    .eq('user_id', userId);

  const map: ProgressMap = {};
  for (const row of data ?? []) {
    map[`${row.category}|${row.word}`] = {
      correct_count: row.correct_count,
      wrong_count: row.wrong_count,
    };
  }
  return map;
}

export async function recordAnswer(userId: string, category: string, word: string, correct: boolean) {
  const { data } = await supabase
    .from('word_progress')
    .select('correct_count, wrong_count')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('word', word)
    .maybeSingle();

  await supabase.from('word_progress').upsert(
    {
      user_id: userId,
      category,
      word,
      correct_count: (data?.correct_count ?? 0) + (correct ? 1 : 0),
      wrong_count: (data?.wrong_count ?? 0) + (correct ? 0 : 1),
      last_seen: new Date().toISOString(),
    },
    { onConflict: 'user_id,category,word' },
  );
}
