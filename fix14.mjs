import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const btnIdx = lines.findIndex(l => l.includes('oddy-login-btn oddy-mode-btn'));
lines[btnIdx] = "        <button onClick={() => setMode(isSH ? 'mkt' : 'sh')} className=\"oddy-login-btn oddy-mode-btn\" style={{ flexShrink: 0, marginLeft: '12px', marginRight: '12px' }}>";

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
