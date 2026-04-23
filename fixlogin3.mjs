import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Linea 2153 (index 2152) - reemplazar navigate('/admin') con redirect param
console.log('antes:', lines[2152]);
lines[2152] = "        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/';";
lines.splice(2153, 0, 
  "        window.history.replaceState({}, '', window.location.pathname);",
  "        navigate(redirectTo);"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
