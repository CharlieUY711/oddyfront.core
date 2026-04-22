import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const cartIdx = lines.findIndex(l => l.includes('oddy-cart') && l.includes('setShowCart') && !l.includes('mobile'));
console.log('Cart en:', cartIdx);

// Solo modificar el div del carrito - agregar marginLeft y marginRight
lines[cartIdx] = "            <div className=\"oddy-cart\" onClick={() => setShowCart(!showCart)} style={{ cursor: 'pointer', marginLeft: '8px', marginRight: '4px' }}>";

// Buscar el texto "0" hardcodeado y reemplazar el bloque text completo
const textStartIdx = lines.findIndex((l, i) => i > cartIdx && l.includes('<text') && l.includes('x="14"'));
console.log('Text en:', textStartIdx);

// Reemplazar desde <text hasta </text> (7 lineas) con condicional
const textEndIdx = lines.findIndex((l, i) => i > textStartIdx && l.includes('</text>'));
console.log('Text end en:', textEndIdx);

lines.splice(textStartIdx, textEndIdx - textStartIdx + 2,
  "                {cartItems.length > 0 && (",
  "                  <text x=\"14\" y=\"11.5\" fontSize=\"9\" fill={isSH ? '#6BB87A' : '#FF6835'} fontWeight=\"bold\" textAnchor=\"middle\" dominantBaseline=\"middle\" style={{ fontFamily: 'Arial, sans-serif', pointerEvents: 'none' }}>",
  "                    {cartItems.length}",
  "                  </text>",
  "                )}"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
