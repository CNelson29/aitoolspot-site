import type { APIRoute } from 'astro';
import { rateLimit, rateLimitedResponse } from '../../../lib/rate-limit';
import { getProduct } from '../../../lib/store-catalog';
import { createStoreOrder } from '../../../lib/store-paypal';

export const prerender = false;

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  const limited = rateLimit(request, 'store-create-order', 12, 60);
  if (!limited.allowed) return rateLimitedResponse(limited);

  let slug: string;
  try {
    ({ slug } = await request.json());
  } catch {
    return json({ error: 'Body inválido' }, 400);
  }

  const product = getProduct(slug);
  if (!product) return json({ error: 'Producto no encontrado' }, 404);

  try {
    const orderID = await createStoreOrder(product.priceUsd, product.name);
    return json({ orderID });
  } catch (err: any) {
    return json({ error: err?.message || 'Error creando la orden' }, 502);
  }
};
