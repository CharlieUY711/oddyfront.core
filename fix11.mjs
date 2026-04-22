import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Buscar y eliminar el boton de la derecha (el que tiene marginRight)
const btnIdx = lines.findIndex(l => l.includes('marginRight') && l.includes('setMode'));
if (btnIdx !== -1) {
  console.log('Boton derecha en linea:', btnIdx);
  lines.splice(btnIdx, 3);
  console.log('Eliminado OK');
} else {
  console.log('No encontrado');
}

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
