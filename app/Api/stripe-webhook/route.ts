import type Stripe from 'stripe';
import { getStripe } from '@/app/lib/stripeServer';
import { getSupabaseAdmin } from '@/app/lib/supabaseAdmin';

export const runtime = 'nodejs';

// Estados de suscripción que dan acceso Premium
const ACTIVE_STATUSES = ['active', 'trialing', 'past_due'];

// Stripe llama a esta ruta cada vez que pasa algo con un pago o una suscripción.
export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return Response.json({ error: 'Falta la firma.' }, { status: 400 });

  // Se necesita el texto crudo para poder verificar que el aviso viene de Stripe
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch {
    return Response.json({ error: 'Firma no válida.' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
      if (userId) {
        const { error } = await admin
          .from('profiles')
          .update({ is_premium: true, stripe_customer_id: customerId ?? null })
          .eq('id', userId);
        if (error) throw error;
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      const isActive = event.type === 'customer.subscription.updated' && ACTIVE_STATUSES.includes(sub.status);
      const userId = sub.metadata?.user_id;
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;

      const query = admin.from('profiles').update({ is_premium: isActive });
      const { error } = userId ? await query.eq('id', userId) : await query.eq('stripe_customer_id', customerId);
      if (error) throw error;
    }
  } catch (e) {
    console.error('webhook error', e);
    // 500 hace que Stripe reintente más tarde
    return Response.json({ error: 'Error procesando el aviso.' }, { status: 500 });
  }

  return Response.json({ received: true });
}
