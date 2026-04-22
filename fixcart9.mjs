import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Solo reemplazar el bloque <text> hardcodeado dentro del carrito del header
// Linea 2866 hasta 2881 = 16 lineas (text + 0 + /text)
let start = 2865; // index del <text
let end = -1;
for (let i = start; i < start + 20; i++) {
  if (lines[i].includes('</text>')) { end = i; break; }
}
// Incluir la linea "0" que esta entre > y </text>
console.log('Reemplazando', end - start + 2, 'lineas desde', start);
console.log(lines[start]);
console.log(lines[end + 1]);

lines.splice(start, end - start + 2,
  "                {cartItems.length > 0 && (",
  "                  <text x=\"14\" y=\"11.5\" fontSize=\"9\" fill={isSH ? '#6BB87A' : '#FF6835'} fontWeight=\"bold\" textAnchor=\"middle\" dominantBaseline=\"middle\" style={{ fontFamily: 'Arial, sans-serif', pointerEvents: 'none' }}>",
  "                    {cartItems.length}",
  "                  </text>",
  "                )}"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
