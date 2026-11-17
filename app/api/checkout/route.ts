import { getStripe } from '@/app/lib/stripeServer';
import { getSupabaseAdmin } from '@/app/lib/supabaseAdmin';

export const runtime = 'nodejs';

// Crea la página de pago de Stripe para el usuario que lo pide.
export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return Response.json({ error: 'Inicia sesión primero.' }, { status: 401 });

    const admin = getSupabaseAdmin();
    const { data, error } = await admin.auth.getUser(token);
    if (error || !data.user) return Response.json({ error: 'Sesión no válida.' }, { status: 401 });
    const user = data.user;

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) return Response.json({ error: 'Falta STRIPE_PRICE_ID en el servidor.' }, { status: 500 });

    const origin = new URL(req.url).origin;

    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      // Así, los avisos de la suscripción saben a qué usuario pertenecen
      subscription_data: { metadata: { user_id: user.id } },
      success_url: `${origin}/?premium=success`,
      cancel_url: `${origin}/`,
    });

    return Response.json({ url: session.url });
  } catch (e) {
    console.error('checkout error', e);
    return Response.json({ error: 'No se pudo iniciar el pago. Intenta de nuevo.' }, { status: 500 });
  }
}
