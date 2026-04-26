import { readFileSync, writeFileSync } from "fs";

const files = [
  "src/app/public/OddyStorefront.tsx",
  "src/app/hooks/useProductos.ts",
  "src/app/services/departamentosApi.ts",
];

// Lista de todos los patrones corruptos conocidos
const fixes = [
  ["[departamentos.map](http://departamentos.map)", "departamentos.map"],
  ["[deptoCats.map](http://deptoCats.map)", "deptoCats.map"],
  ["[depts.map](http://depts.map)", "depts.map"],
  ["[d.id](http://d.id)", "d.id"],
  ["[d.nombre](http://d.nombre)", "d.nombre"],
  ["[categorias.map](http://categorias.map)", "categorias.map"],
  ["[depto.categorias.map](http://depto.categorias.map)", "depto.categorias.map"],
  ["[cats.map](http://cats.map)", "cats.map"],
  ["[cat.nombre](http://cat.nombre)", "cat.nombre"],
  ["[profiles.id](http://profiles.id)", "profiles.id"],
  ["[System.IO](http://System.IO)", "System.IO"],
  ["[ModuleJob.run](http://ModuleJob.run)", "ModuleJob.run"],
];

for (const file of files) {
  try {
    let c = readFileSync(file, "utf8");
    let changed = false;
    for (const [bad, good] of fixes) {
      if (c.includes(bad)) {
        c = c.split(bad).join(good);
        console.log(`Fixed in ${file}: ${bad} → ${good}`);
        changed = true;
      }
    }
    if (changed) writeFileSync(file, c, "utf8");
    else console.log(`${file}: clean`);
  } catch(e) {
    console.log(`Skip ${file}: ${e.message}`);
  }
}
console.log("Done");
