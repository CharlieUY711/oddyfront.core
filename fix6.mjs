import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Buscar la linea del boton
const btnIdx = lines.findIndex(l => l.includes('oddy-market-btn'));
console.log('btnIdx:', btnIdx, JSON.stringify(lines[btnIdx]));
console.log('prev:', JSON.stringify(lines[btnIdx-1]));
console.log('next:', JSON.stringify(lines[btnIdx+1]));
console.log('next2:', JSON.stringify(lines[btnIdx+2]));
console.log('next3:', JSON.stringify(lines[btnIdx+3]));
console.log('next4:', JSON.stringify(lines[btnIdx+4]));

// Reemplazar las 6 lineas del boton con el span
lines.splice(btnIdx - 1, 6,
  '            <span style={{ color: \'#fff\', fontWeight: 800, fontSize: \'1.05rem\' }}>',
  '              {isSH ? \'Second Hand\' : \'Market\'}',
  '            </span>'
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
