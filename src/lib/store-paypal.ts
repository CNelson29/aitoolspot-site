// PayPal REST — cobro de precio fijo por un producto digital del catálogo.
// Vars en Vercel (proyecto aitoolspot):
//   PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_ENV ('sandbox' | 'live')
//   PUBLIC_PAYPAL_CLIENT_ID (para el SDK del navegador)

function baseUrl(): string {
  return import.meta.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

async function getAccessToken(): Promise<string> {
  const creds = Buffer.from(
    `${import.meta.env.PAYPAL_CLIENT_ID}:${import.meta.env.PAYPAL_SECRET}`
  ).toString('base64');
  const res = await fetch(`${baseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`PayPal auth failed: ${data.error_description || JSON.stringify(data)}`);
  return data.access_token;
}

export async function createStoreOrder(priceUsd: number, itemName: string): Promise<string> {
  const token = await getAccessToken();
  const res = await fetch(`${baseUrl()}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        { description: itemName.slice(0, 127), amount: { currency_code: 'USD', value: priceUsd.toFixed(2) } },
      ],
      application_context: {
        brand_name: 'AIToolSpot',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    }),
  });
  const data = await res.json();
  if (!data.id) throw new Error(`PayPal createOrder failed: ${JSON.stringify(data)}`);
  return data.id;
}

// Captura y verifica que el pago se completó por el monto esperado antes de entregar el archivo.
export async function captureStoreOrder(orderId: string, expectedUsd: number): Promise<boolean> {
  const token = await getAccessToken();
  const res = await fetch(`${baseUrl()}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (data.status !== 'COMPLETED') return false;
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  const paid = parseFloat(capture?.amount?.value ?? '0');
  return capture?.status === 'COMPLETED' && paid + 0.01 >= expectedUsd;
}
