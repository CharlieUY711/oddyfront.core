import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/pages/AdminProfile.tsx';
let lines = readFileSync(file, 'utf8').split('\n');

// Eliminar lineas duplicadas de imports
const seen = new Set();
const clean = lines.filter(line => {
  const trimmed = line.trim();
  // Solo deduplicar lineas de import
  if (trimmed.startsWith('import ')) {
    if (seen.has(trimmed)) return false;
    seen.add(trimmed);
  }
  return true;
});

writeFileSync(file, clean.join('\n'), 'utf8');
console.log('OK - lines:', lines.length, '->', clean.length);
