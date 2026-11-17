// SOLO PARA EL SERVIDOR (carpeta app/api). Nunca importar desde un componente.
import Stripe from 'stripe';

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Falta STRIPE_SECRET_KEY');
  return new Stripe(key);
}
