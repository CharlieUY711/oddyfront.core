import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Fix texto - agregar stroke none y agrandar SVG a 32px
lines[2860] = '              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">';
lines[2866] = "                  <text x=\"14\" y=\"9.5\" fontSize=\"9\" fill={isSH ? '#6BB87A' : '#FF6835'} stroke=\"none\" strokeWidth=\"0\" textAnchor=\"middle\" dominantBaseline=\"middle\" style={{ fontFamily: \"'DM Sans', sans-serif\", fontWeight: '400', pointerEvents: 'none' }}>";

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
