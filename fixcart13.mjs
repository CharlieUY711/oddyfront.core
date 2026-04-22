import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// fill="#FF6835" esta en linea 2869 (index 2868 en base 0... pero el find dio 2869)
// El <text empieza index 2869 - 4 = 2865
const fillIdx = 2869;
const textStart = fillIdx - 4;
let textEnd = -1;
for (let i = fillIdx; i < fillIdx + 15; i++) {
  if (lines[i] && lines[i].trim() === '</text>') { textEnd = i; break; }
}
console.log('textStart:', textStart, 'textEnd:', textEnd);
console.log('Primera:', lines[textStart]);
console.log('Ultima:', lines[textEnd + 1]);

lines.splice(textStart, textEnd - textStart + 2,
  '                {cartItems.length > 0 && (',
  '                  <text x="14" y="11.5" fontSize="9" fill={isSH ? \'#6BB87A\' : \'#FF6835\'} fontWeight="bold" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: \'Arial, sans-serif\', pointerEvents: \'none\' }}>',
  '                    {cartItems.length}',
  '                  </text>',
  '                )}'
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
