import { readFileSync, writeFileSync } from 'fs';
import { readdirSync } from 'fs';

const pages = [
  'src/app/admin/pages/AdminDashboard.tsx',
  'src/app/admin/pages/AdminProfile.tsx',
  'src/app/admin/pages/AdminOrders.tsx',
  'src/app/admin/pages/AdminProducts.tsx',
  'src/app/admin/pages/AdminAnalytics.tsx',
  'src/app/admin/pages/AdminML.tsx',
  'src/app/admin/pages/AdminCatalog.tsx',
  'src/app/admin/pages/AdminPublicaciones.tsx',
];

pages.forEach(path => {
  try {
    let c = readFileSync(path, 'utf8');
    // Eliminar h2 que es el primer elemento del return (título de la página)
    const before = c.length;
    c = c.replace(/<h2 style=\{\{ margin:0, fontSize:"1\.25rem", fontWeight:700 \}\}>[^<]+<\/h2>\s*/g, '');
    if (c.length !== before) console.log('Fixed:', path);
    else console.log('No h2 found:', path);
    writeFileSync(path, c, 'utf8');
  } catch(e) { console.log('Skip:', path, e.message); }
});
