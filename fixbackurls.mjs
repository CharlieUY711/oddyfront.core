import { readFileSync, writeFileSync } from 'fs';
const file = 'supabase/functions/create_preference/index.ts';
let c = readFileSync(file, 'utf8');

c = c.replace(
  '"http://localhost:5173/success"',
  '"https://oddyfront.core.com.uy/success"'
).replace(
  '"http://localhost:5173/failure"',
  '"https://oddyfront.core.com.uy/failure"'
).replace(
  '"http://localhost:5173/pending"',
  '"https://oddyfront.core.com.uy/pending"'
);

writeFileSync(file, c, 'utf8');
console.log('OK');
