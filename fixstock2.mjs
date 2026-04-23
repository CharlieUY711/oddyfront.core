import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');

// Reemplazar con regex flexible que ignore whitespace
const before = c.length;
c = c.replace(
  /<button className="oddy-add-btn" onClick={handleAdd} style={btnStyle}>\s*\{label\}\s*<\/button>/g,
  `<button className="oddy-add-btn" onClick={handleAdd} disabled={p.stock === 0} style={p.stock === 0 ? { background: '#ccc', cursor: 'not-allowed', color: '#888' } : btnStyle}>
              {p.stock === 0 ? 'Sin stock' : label}
            </button>`
);

const count = (c.match(/Sin stock/g) || []).length;
console.log('Reemplazos:', count, '| Cambio chars:', c.length - before);
writeFileSync(file, c, 'utf8');
