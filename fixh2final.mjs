import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const dir = 'src/app/admin/pages';
const files = readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(filename => {
  const path = join(dir, filename);
  let c = readFileSync(path, 'utf8');
  const before = c;

  // Eliminar cualquier h2 que sea el titulo de la pagina (primera linea del return)
  c = c.replace(/<h2[^>]*>[\s\S]*?<\/h2>\n?/g, (match) => {
    // Solo eliminar si es un titulo simple (sin componentes complejos adentro)
    if (!match.includes('<') || match.replace(/<[^>]+>/g, '').trim().length < 60) {
      return '';
    }
    return match;
  });

  if (c !== before) {
    writeFileSync(path, c, 'utf8');
    console.log('✓ Cleaned:', filename);
  } else {
    console.log('- No change:', filename);
  }
});
