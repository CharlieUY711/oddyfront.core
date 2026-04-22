import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');

const oldBtn = [
  '            <button',
  '              className="oddy-market-btn"',
  '              onClick={() => setMode(isSH ? \'mkt\' : \'sh\')}',
  '            >',
  '              {isSH ? \'Market\' : \'Second Hand\'}',
  '            </button>'
].join('\n');

const newLabel = [
  '            <span style={{ color: \'#fff\', fontWeight: 800, fontSize: \'1.05rem\' }}>',
  '              {isSH ? \'Second Hand\' : \'Market\'}',
  '            </span>'
].join('\n');

if (c.includes(oldBtn)) {
  c = c.replace(oldBtn, newLabel);
  writeFileSync(file, c, 'utf8');
  console.log('OK - boton reemplazado');
} else {
  console.log('FAIL - texto no encontrado');
  // Debug: mostrar caracteres alrededor de la linea 2848
  const lines = c.split('\n');
  console.log(JSON.stringify(lines[2847]));
  console.log(JSON.stringify(lines[2848]));
}
