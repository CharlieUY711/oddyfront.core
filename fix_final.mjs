import { readFileSync, writeFileSync } from 'fs';
const files = [
  'src/app/hooks/useProductos.ts',
  'src/app/public/OddyStorefront.tsx',
];
for (const file of files) {
  try {
    let c = readFileSync(file, 'utf8');
    // Use split/join to avoid regex $1 issues
    // Find all [word.word](http://...) patterns and replace
    let changed = 0;
    let prev = '';
    while (prev !== c) {
      prev = c;
      c = c.replace(/\[([a-zA-Z_][a-zA-Z0-9_.]*)\]\(https?:\/\/[^)]*\)/g, (match, p1) => { changed++; return p1; });
    }
    writeFileSync(file, c, 'utf8');
    console.log(file + ': fixed ' + changed);
  } catch(e) {
    console.log('skip ' + file + ': ' + e.message);
  }
}

