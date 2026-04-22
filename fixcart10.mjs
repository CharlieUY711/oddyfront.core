import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');

// Reemplazar solo el contenido del text - el "0" entre > y </text>
// usando el contexto unico de fill="#FF6835" fontWeight="normal"
const old = `                <text
                  x="14"
                  y="11.5"
                  fontSize="9"
                  fill="#FF6835"
                  fontWeight="normal"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: 'Times New Roman, serif',
                    fontWeight: 'normal',
                    pointerEvents: 'none'
                  }}
                >
                  0
                </text>`;

const nuevo = `                {cartItems.length > 0 && (
                  <text x="14" y="11.5" fontSize="9" fill={isSH ? '#6BB87A' : '#FF6835'} fontWeight="bold" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: 'Arial, sans-serif', pointerEvents: 'none' }}>
                    {cartItems.length}
                  </text>
                )}`;

if (c.includes(old)) {
  c = c.replace(old, nuevo);
  writeFileSync(file, c, 'utf8');
  console.log('OK');
} else {
  console.log('FAIL - no encontrado');
  // Debug
  const idx = c.indexOf('fill="#FF6835"');
  console.log('fill encontrado en pos:', idx);
  console.log(c.substring(idx - 100, idx + 100));
}
