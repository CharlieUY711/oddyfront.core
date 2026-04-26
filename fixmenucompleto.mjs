import { readFileSync, writeFileSync } from "fs";
const file = "src/app/public/OddyStorefront.tsx";
let c = readFileSync(file, "utf8");

// Encontrar el bloque del menu completo y reemplazarlo
const menuStart = c.indexOf('<div className="oddy-categories-menu">');
const menuEnd   = c.indexOf('</div>', menuStart) + 6; // cierra oddy-categories-menu

if (menuStart === -1) {
  console.log("ERROR: no se encontro oddy-categories-menu");
  process.exit(1);
}

// Encontrar el cierre real del div (puede tener divs internos)
let depth = 0;
let i = menuStart;
let realEnd = -1;
while (i < c.length) {
  if (c.slice(i, i+4) === '<div') depth++;
  if (c.slice(i, i+6) === '</div>') {
    depth--;
    if (depth === 0) { realEnd = i + 6; break; }
  }
  i++;
}

console.log("Menu encontrado en:", menuStart, "hasta:", realEnd);

const newMenu = `<div className="oddy-categories-menu">
          {(departamentos || []).map((depto) => {
            const menuItem = depto.nombre;
            const deptoCats = (depto.categorias || []).map((cat) => cat.nombre);
            const isOpen = openDropdown === menuItem;
            return (
              <div
                key={menuItem}
                className="oddy-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(isOpen ? null : menuItem);
                }}
              >
                <span>{menuItem}</span>
                {deptoCats.length > 0 && (
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                )}
                {isOpen && deptoCats.length > 0 && (
                  <div className="oddy-dropdown">
                    {deptoCats.map((category) => (
                      <div
                        key={category}
                        className="oddy-dropdown-item"
                        onClick={() => {
                          setSelectedCategory(null);
                          setOpenDropdown(null);
                        }}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>`;

c = c.slice(0, menuStart) + newMenu + c.slice(realEnd);

// Eliminar getCategoriesForMenu si todavia existe
const fnStart = c.indexOf("  const getCategoriesForMenu");
if (fnStart !== -1) {
  let depth2 = 0;
  let j = fnStart;
  let fnEnd = -1;
  while (j < c.length) {
    if (c[j] === "{") depth2++;
    if (c[j] === "}") { depth2--; if (depth2 === 0) { fnEnd = j + 1; break; } }
    j++;
  }
  if (fnEnd !== -1) {
    c = c.slice(0, fnStart) + c.slice(fnEnd);
    console.log("getCategoriesForMenu eliminada");
  }
}

// Eliminar cualquier link corrupto que quede
c = c.split("[departamentos.map](http://departamentos.map)").join("departamentos.map");
c = c.split("[depts.map](http://depts.map)").join("depts.map");
c = c.split("[d.id](http://d.id)").join("d.id");

writeFileSync(file, c, "utf8");
console.log("OK - menu reescrito limpio");
console.log("usa departamentos.map:", c.includes("(departamentos || []).map"));
