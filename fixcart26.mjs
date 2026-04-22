import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Buscar el span del badge y simplificarlo - sin circulo
const badgeIdx = lines.findIndex(l => l.includes("top: '-4px'") && l.includes('borderRadius'));
console.log('Badge en:', badgeIdx);
lines[badgeIdx] = "                <span style={{ position: 'absolute', top: '2px', right: '-2px', fontSize: '9px', fontFamily: \"'DM Sans', sans-serif\", fontWeight: '400', color: isSH ? '#6BB87A' : '#FF6835' }}>";

// Sacar el texto hardcodeado del SVG (el "0" original)
const oldTextIdx = lines.findIndex(l => l.includes('<text') && l.includes('fill="#FF6835"'));
console.log('Texto viejo en:', oldTextIdx);
if (oldTextIdx !== -1) {
  let endIdx = -1;
  for (let i = oldTextIdx; i < oldTextIdx + 20; i++) {
    if (lines[i] && lines[i].includes('</text>')) { endIdx = i; break; }
  }
  lines.splice(oldTextIdx, endIdx - oldTextIdx + 2);
  console.log('Texto viejo eliminado');
}

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
