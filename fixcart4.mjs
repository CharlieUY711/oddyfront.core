import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Linea 2866 = index 2865, buscar hasta </text> y la linea de "0"
let textStart = 2865;
let textEnd = -1;
for (let i = textStart; i < textStart + 15; i++) {
  if (lines[i].includes('</text>')) { textEnd = i; break; }
}
console.log('text:', textStart, 'a', textEnd);
console.log('Lineas:', textEnd - textStart + 1);

// Incluir la linea con "0" que viene despues de >
lines.splice(textStart, textEnd - textStart + 2,
  "                {cartItems.length > 0 && (",
  "                  <text x=\"14\" y=\"11.5\" fontSize=\"9\" fill={isSH ? '#6BB87A' : '#FF6835'} fontWeight=\"bold\" textAnchor=\"middle\" dominantBaseline=\"middle\" style={{ fontFamily: 'Arial, sans-serif', pointerEvents: 'none' }}>",
  "                    {cartItems.length}",
  "                  </text>",
  "                )}"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
