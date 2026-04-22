import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');

const oldBtn = [
  '            <button ',
  '              className="oddy-market-btn"',
  '              onClick={() => setMode(isSH ? \'mkt\' : \'sh\')}',
  '            >',
  '              {isSH ? \'Market\' : \'Second Hand\'}',
  '            </button>'
].join('\r\n');

const newLabel = [
  '            <span style={{ color: \'#fff\', fontWeight: 800, fontSize: \'1.05rem\' }}>',
  '              {isSH ? \'Second Hand\' : \'Market\'}',
  '            </span>'
].join('\r\n');

if (c.includes(oldBtn)) {
  c = c.replace(oldBtn, newLabel);
  writeFileSync(file, c, 'utf8');
  console.log('OK');
} else {
  console.log('FAIL');
  const lines = c.split('\r\n');
  console.log(JSON.stringify(lines[2848]));
  console.log(JSON.stringify(lines[2849]));
}
