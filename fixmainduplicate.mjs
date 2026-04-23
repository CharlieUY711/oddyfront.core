import { readFileSync, writeFileSync } from 'fs';
const file = 'src/main.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Eliminar lineas duplicadas de ErrorBoundary
const seen = new Set();
const result = lines.filter(l => {
  if (l.includes('ErrorBoundary') && seen.has(l)) return false;
  if (l.includes('ErrorBoundary')) seen.add(l);
  return true;
});

writeFileSync(file, result.join('\r\n'), 'utf8');
console.log('OK');
