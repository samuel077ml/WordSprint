// Meta de la misión diaria y XP extra al cumplirla
export const DAILY_GOAL = 10;
export const DAILY_BONUS_XP = 3;

// Fecha local del dispositivo en formato AAAA-MM-DD
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayAndYesterday() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return { today: dateKey(now), yesterday: dateKey(yesterday) };
}

// Elige la "palabra del día": todos los usuarios ven la misma el mismo día,
// y cambia sola cada día recorriendo la lista en orden.
export function wordOfTheDay<T>(items: T[], key: string): T {
  const [y, m, d] = key.split('-').map(Number);
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  return items[dayNumber % items.length];
}
