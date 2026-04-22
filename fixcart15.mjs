import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

console.log('2865:', lines[2865]);
console.log('2880:', lines[2880]);
console.log('2881:', lines[2881]);

// <text en 2865, </text> en 2880 = 16 lineas, </svg> en 2881 NO tocar
lines.splice(2865, 16,
  '                {cartItems.length > 0 && (',
  '                  <text x="14" y="11.5" fontSize="9" fill={isSH ? \'#6BB87A\' : \'#FF6835\'} fontWeight="bold" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: \'Arial, sans-serif\', pointerEvents: \'none\' }}>',
  '                    {cartItems.length}',
  '                  </text>',
  '                )}'
);

console.log('despues 2865:', lines[2865]);
console.log('despues 2870:', lines[2870]);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
