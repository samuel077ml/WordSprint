// Qué es gratis y qué es Premium. Para cambiar el reparto, edita estas dos listas.
export const FREE_CATEGORIES = ['Deportes', 'Comida'];
export const FREE_SCENARIOS = ['airport'];

export const PRICE_LABEL = '$5/mes';

export function canOpenCategory(name: string, isPremium: boolean): boolean {
  return isPremium || FREE_CATEGORIES.includes(name);
}

export function canOpenScenario(id: string, isPremium: boolean): boolean {
  return isPremium || FREE_SCENARIOS.includes(id);
}
