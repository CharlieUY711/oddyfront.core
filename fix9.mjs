import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const barraIdx = lines.findIndex(l => l.includes('Barra de modo'));

// Linea del div padre - quitar overflow visible, ya esta ok
// Linea del div carrusel - quitar flex:1 duplicado, dejar flex:1
lines[barraIdx + 2] = "        <div ref={carouselRef} style={{ display: 'flex', gap: '6px', alignItems: 'center', overflow: 'hidden', height: '100%', padding: '6px 12px', flex: 1 }}>";

// Buscar el boton y moverlo afuera del div del carrusel
// El boton esta actualmente dentro del div del carrusel, necesita estar afuera
const btnIdx = lines.findIndex(l => l.includes("setMode(isSH ? 'mkt' : 'sh')") && l.includes('flexShrink'));
console.log('Boton en linea:', btnIdx);
console.log('Contexto:', lines[btnIdx-1], '|', lines[btnIdx+2]);

// El boton esta entre ))} y </div></div>
// Necesitamos que quede: </div> (cierre carrusel) boton </div> (cierre barra)
// Actualmente: boton </div> </div>
// Lo movemos despues del primer </div>
const closeDivIdx = lines.findIndex((l, i) => i > btnIdx && l.trim() === '</div>');
console.log('Primer cierre div en:', closeDivIdx);

// Sacar el boton de donde esta (3 lineas) y ponerlo despues del </div>
const btnLines = lines.splice(btnIdx, 3);
const newCloseDivIdx = lines.findIndex((l, i) => i > btnIdx - 1 && l.trim() === '</div>');
lines.splice(newCloseDivIdx + 1, 0, ...btnLines);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
