import { supabase } from '@/app/lib/supabaseClient';

// Pide al servidor la página de pago de Stripe y lleva al usuario allí.
// Devuelve un mensaje de error si algo sale mal; si todo va bien, la página cambia de dirección.
export async function startCheckout(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return 'Inicia sesión para continuar.';

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !json.url) return json.error ?? 'No se pudo iniciar el pago.';
    window.location.href = json.url;
    return null;
  } catch {
    return 'No se pudo conectar. Revisa tu internet e intenta de nuevo.';
  }
}
