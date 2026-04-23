import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Solo cambiar el fill del text para que sea transparente cuando carrito vacio
// Linea 2869 tiene fill="#FF6835"
console.log('2869:', lines[2869]);
lines[2869] = "                  fill={cartItems.length > 0 ? (isSH ? '#6BB87A' : '#FF6835') : 'transparent'}";

// Linea 2880 tiene el "0" - reemplazarlo con el count real
console.log('2879:', lines[2879]);
lines[2879] = '                  {cartItems.length || ""}';

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
