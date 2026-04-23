import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/CheckoutPage.tsx';
let c = readFileSync(file, 'utf8');

c = c.replace(
  "estado: \"pendiente\",",
  "estado: \"pendiente\",\n        user_id: (await supabase.auth.getUser()).data.user?.id,"
);

writeFileSync(file, c, 'utf8');
console.log('OK');
