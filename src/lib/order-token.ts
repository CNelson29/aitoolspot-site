// Token firmado (HMAC-SHA256) que ata una compra pagada a una descarga concreta, sin base de datos.
// Tras capturar el pago en PayPal, el servidor firma {slug, exp} y ese token es lo único que el
// cliente recibe; solo con un token válido puede pedir la descarga del ZIP real.
import crypto from 'node:crypto';

function secret(): string {
  const s = import.meta.env.STORE_SECRET || import.meta.env.PAYPAL_SECRET;
  if (!s) throw new Error('STORE_SECRET (o PAYPAL_SECRET) no configurado');
  return s;
}

const b64u = (buf: Buffer) => buf.toString('base64url');

export interface OrderPayload {
  slug: string;
  exp: number; // epoch ms de expiración
}

export function signOrderToken(payload: OrderPayload): string {
  const body = b64u(Buffer.from(JSON.stringify(payload)));
  const sig = b64u(crypto.createHmac('sha256', secret()).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyOrderToken(token: string): OrderPayload | null {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = b64u(crypto.createHmac('sha256', secret()).update(body).digest());
  const a = Buffer.from(sig || '');
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload: OrderPayload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  } catch {
    return null;
  }
  if (!payload?.slug || typeof payload.exp !== 'number' || Date.now() > payload.exp) return null;
  return payload;
}
