import type { APIRoute } from 'astro';
import { rateLimit, rateLimitedResponse } from '../../../lib/rate-limit';
import { verifyOrderToken } from '../../../lib/order-token';
import { getProduct } from '../../../lib/store-catalog';
import { buildProductZip } from '../../../lib/store-zip';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const limited = rateLimit(request, 'store-download', 20, 60);
  if (!limited.allowed) return rateLimitedResponse(limited);

  const token = url.searchParams.get('token') || '';
  const payload = verifyOrderToken(token);
  if (!payload) {
    return new Response(JSON.stringify({ error: 'Enlace de descarga inválido o expirado.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const product = getProduct(payload.slug);
  if (!product) {
    return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const zip = await buildProductZip(product.filesDir);
    return new Response(zip, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${product.slug}.zip"`,
        'Content-Length': String(zip.length),
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Error generando la descarga' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
