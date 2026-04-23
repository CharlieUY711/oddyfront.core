import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');

const TRACK_URL = `\${import.meta.env.VITE_API_URL}/track-event`;

// 1. Agregar helper trackEvent despues del primer import
const helperFn = `
async function trackEvent(eventType: string, metadata: Record<string, unknown> = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(\`\${import.meta.env.VITE_API_URL}/track-event\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { 'Authorization': \`Bearer \${session.access_token}\` } : {}),
      },
      body: JSON.stringify({ event_type: eventType, metadata }),
    });
  } catch (_) {}
}
`;

// Insertar despues de los imports
c = c.replace(
  '// ── Sub-components',
  helperFn + '\n// ── Sub-components'
);

// 2. Trackear add_to_cart en addToCart
c = c.replace(
  "await agregarAlCarrito(",
  `void trackEvent('add_to_cart', { product_id: String(p.id), product_name: p.n, tipo: m });\n      await agregarAlCarrito(`
);

// 3. Trackear checkout_started
c = c.replace(
  "navigate('/checkout')",
  `void trackEvent('checkout_started', { items_count: cartItems.length });\n        navigate('/checkout')`
);

writeFileSync(file, c, 'utf8');
console.log('OK');
