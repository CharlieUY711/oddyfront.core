import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Reemplazar el text completo de una vez
const textIdx = lines.findIndex((l, i) => i > 2864 && i < 2880 && l.includes('<text'));
console.log('text en:', textIdx);
lines[textIdx] = "                <text x=\"14\" y=\"11.5\" fontSize=\"11\" textAnchor=\"middle\" dominantBaseline=\"middle\" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'normal', fill: cartItems.length > 0 ? (isSH ? '#6BB87A' : '#FF6835') : 'transparent', stroke: 'none', pointerEvents: 'none' }}>";

// Eliminar los atributos individuales que siguen (hasta el >)
let closeIdx = -1;
for (let i = textIdx + 1; i < textIdx + 15; i++) {
  if (lines[i] && lines[i].trim() === '>') { closeIdx = i; break; }
}
console.log('close en:', closeIdx);
if (closeIdx !== -1) lines.splice(textIdx + 1, closeIdx - textIdx);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
