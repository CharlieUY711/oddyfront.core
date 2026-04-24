import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/CatalogTree.tsx';
let c = readFileSync(file, 'utf8');
// Fix: useOutletContext no se usa en CatalogTree, quitarlo
c = c.replace(', memo, useCallback, useOutletContext', ', memo, useCallback');
writeFileSync(file, c, 'utf8');
console.log('OK');
