import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');

// Reemplazar todos los botones oddy-add-btn con version que verifica stock
c = c.replaceAll(
  '<button className="oddy-add-btn" onClick={handleAdd} style={btnStyle}>\n              {label}\n            </button>',
  `<button className="oddy-add-btn" onClick={handleAdd} disabled={p.stock === 0} style={p.stock === 0 ? { background: '#ccc', cursor: 'not-allowed', color: '#888' } : btnStyle}>\n              {p.stock === 0 ? 'Sin stock' : label}\n            </button>`
);

writeFileSync(file, c, 'utf8');

// Contar reemplazos
const count = (c.match(/Sin stock/g) || []).length;
console.log('Reemplazos:', count);
