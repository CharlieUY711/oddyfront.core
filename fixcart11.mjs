import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Buscar la linea con fill="#FF6835" dentro del SVG del carrito
const fillIdx = lines.findIndex(l => l.includes('fill="#FF6835"') && l.includes('fontWeight="normal"'));
console.log('fill en linea:', fillIdx);

// El <text empieza 4 lineas antes
const textStart = fillIdx - 4;
// El </text> esta 9 lineas despues del fill
let textEnd = -1;
for (let i = fillIdx; i < fillIdx + 15; i++) {
  if (lines[i].includes('</text>')) { textEnd = i; break; }
}
// +1 para incluir la linea con "0"
console.log('Reemplazando lineas', textStart, 'a', textEnd + 1, '=', textEnd - textStart + 2, 'lineas');

lines.splice(textStart, textEnd - textStart + 2,
  "                {cartItems.length > 0 && (",
  "                  <text x=\"14\" y=\"11.5\" fontSize=\"9\" fill={isSH ? '#6BB87A' : '#FF6835'} fontWeight=\"bold\" textAnchor=\"middle\" dominantBaseline=\"middle\" style={{ fontFamily: 'Arial, sans-serif', pointerEvents: 'none' }}>",
  "                    {cartItems.length}",
  "                  </text>",
  "                )}"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
