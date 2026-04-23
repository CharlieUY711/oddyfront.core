import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/CheckoutPage.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const navIdx = lines.findIndex(l => l.includes("navigate(`/orden/"));
console.log('navigate en:', navIdx, lines[navIdx]);
lines[navIdx] = "      navigate(`/orden/${data.order_id}?total=${data.total}&moneda=${monedaPago}`);";

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
