import type { APIRoute } from 'astro';
import { rateLimit, rateLimitedResponse } from '../../../lib/rate-limit';
import { getProduct } from '../../../lib/store-catalog';
import { captureStoreOrder } from '../../../lib/store-paypal';
import { signOrderToken } from '../../../lib/order-token';
import { recordOrder } from '../../../lib/orders-db';

export const prerender = false;

const DOWNLOAD_TTL_MS = 15 * 60 * 1000; // 15 min para descargar tras pagar

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  const limited = rateLimit(request, 'store-capture', 12, 60);
  if (!limited.allowed) return rateLimitedResponse(limited);

  let slug: string, orderID: string;
  try {
    ({ slug, orderID } = await request.json());
  } catch {
    return json({ error: 'Body inválido' }, 400);
  }

  const product = getProduct(slug);
  if (!product) return json({ error: 'Producto no encontrado' }, 404);
  if (!orderID || typeof orderID !== 'string') return json({ error: 'Falta orderID' }, 400);

  try {
    const paid = await captureStoreOrder(orderID, product.priceUsd);
    if (!paid) return json({ error: 'El pago no se completó.' }, 402);

    recordOrder({ productSlug: slug, paypalOrderId: orderID, amountUsd: product.priceUsd }).catch(() => {});

    const token = signOrderToken({ slug, exp: Date.now() + DOWNLOAD_TTL_MS });
    return json({ downloadUrl: `/api/store/download?token=${encodeURIComponent(token)}` });
  } catch (err: any) {
    return json({ error: err?.message || 'Error capturando el pago' }, 502);
  }
};
