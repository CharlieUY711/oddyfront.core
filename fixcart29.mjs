import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

lines[2868] = "                  fontSize=\"11\"";
lines[2874] = "                    fontFamily: 'Arial, sans-serif',";

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
