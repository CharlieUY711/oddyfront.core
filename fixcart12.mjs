import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');

// Detectar line ending
const eol = c.includes('\r\n') ? '\r\n' : '\n';
console.log('EOL:', eol === '\r\n' ? 'CRLF' : 'LF');
const lines = c.split(eol);

const fillIdx = lines.findIndex(l => l.includes('fill="#FF6835"') && l.includes('fontWeight="normal"'));
console.log('fill en linea:', fillIdx);

if (fillIdx === -1) {
  // Buscar sin el segundo criterio
  const idx2 = lines.findIndex(l => l.includes('fill="#FF6835"'));
  console.log('fill simple en:', idx2);
  console.log('contexto:', lines[idx2-2], '|', lines[idx2], '|', lines[idx2+2]);
  process.exit(1);
}

const textStart = fillIdx - 4;
let textEnd = -1;
for (let i = fillIdx; i < fillIdx + 15; i++) {
  if (lines[i] && lines[i].includes('</text>')) { textEnd = i; break; }
}
console.log('Reemplazando:', textStart, 'a', textEnd + 1);

lines.splice(textStart, textEnd - textStart + 2,
  '                {cartItems.length > 0 && (',
  '                  <text x="14" y="11.5" fontSize="9" fill={isSH ? \'#6BB87A\' : \'#FF6835\'} fontWeight="bold" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: \'Arial, sans-serif\', pointerEvents: \'none\' }}>',
  '                    {cartItems.length}',
  '                  </text>',
  '                )}'
);

writeFileSync(file, lines.join(eol), 'utf8');
console.log('OK');
