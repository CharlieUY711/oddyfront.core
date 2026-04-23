import { readFileSync, writeFileSync } from 'fs';

// 1. Supabase client
const clientFile = 'src/utils/supabase/client.ts';
let client = readFileSync(clientFile, 'utf8');
if (!client.includes('import.meta.env')) {
  client = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`;
  writeFileSync(clientFile, client, 'utf8');
  console.log('client.ts actualizado');
}

// 2. info.ts
const infoFile = 'src/utils/supabase/info.ts';
writeFileSync(infoFile, `export const projectId = import.meta.env.VITE_SUPABASE_URL?.split('.')?.[0]?.replace('https://', '') ?? '';
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
`, 'utf8');
console.log('info.ts actualizado');

// 3. Reemplazar URLs hardcodeadas en CheckoutPage
const checkoutFile = 'src/app/public/CheckoutPage.tsx';
let checkout = readFileSync(checkoutFile, 'utf8');
checkout = checkout
  .replace(
    'const CREAR_ORDEN_URL = "https://pukbgsgrtjqprijpecob.supabase.co/functions/v1/crear-orden";',
    'const CREAR_ORDEN_URL = `${import.meta.env.VITE_API_URL}/crear-orden`;'
  )
  .replace(
    'const CREATE_PREF_URL = "https://pukbgsgrtjqprijpecob.supabase.co/functions/v1/create_preference";',
    'const CREATE_PREF_URL = `${import.meta.env.VITE_API_URL}/create_preference`;'
  );
writeFileSync(checkoutFile, checkout, 'utf8');
console.log('CheckoutPage actualizado');

console.log('OK - todas las variables migradas a import.meta.env');
