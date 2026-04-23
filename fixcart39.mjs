import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Cambiar el div wrapper a position relative
const cartDivIdx = lines.findIndex((l, i) => i > 2858 && i < 2862 && l.includes('oddy-cart'));
console.log('cart div:', cartDivIdx, lines[cartDivIdx]);
lines[cartDivIdx] = "            <div className=\"oddy-cart\" onClick={() => setShowCart(!showCart)} style={{ cursor: 'pointer', position: 'relative' }}>";

// Reemplazar el text por nada (solo dejar el SVG limpio)
const textIdx = lines.findIndex((l, i) => i > 2864 && i < 2875 && l.includes('<text'));
const textEndIdx = lines.findIndex((l, i) => i > textIdx && i < textIdx + 5 && l.includes('</text>'));
console.log('text:', textIdx, 'end:', textEndIdx);
lines.splice(textIdx, textEndIdx - textIdx + 1);

// Agregar span despues del SVG
const svgEndIdx = lines.findIndex((l, i) => i > 2864 && i < 2875 && l.trim() === '</svg>');
console.log('svg end:', svgEndIdx);
lines.splice(svgEndIdx + 1, 0,
  "              {cartItems.length > 0 && <span style={{ position: 'absolute', top: '0', right: '0', fontSize: '10px', color: isSH ? '#6BB87A' : '#FF6835', fontFamily: \"'Arial', sans-serif\", fontWeight: 'normal', lineHeight: 1 }}>{cartItems.length}</span>}"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
