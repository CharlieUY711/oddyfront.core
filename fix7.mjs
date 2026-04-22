import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Buscar la barra de modo
const barraIdx = lines.findIndex(l => l.includes('Barra de modo'));
console.log('Barra en linea:', barraIdx);

// Buscar el cierre del div interno del carrusel (primer </div> seguido de </div>)
for (let i = barraIdx; i < barraIdx + 25; i++) {
  if (lines[i] && lines[i].trim() === '</div>' && lines[i+1] && lines[i+1].trim() === '</div>') {
    console.log('Insertando boton en linea:', i);
    lines.splice(i, 0,
      '        <button onClick={() => setMode(isSH ? \'mkt\' : \'sh\')} style={{ flexShrink: 0, marginRight: \'12px\', padding: \'6px 14px\', borderRadius: \'20px\', backgroundColor: \'rgba(255,255,255,0.25)\', border: \'1.5px solid rgba(255,255,255,0.6)\', color: \'#fff\', fontWeight: 700, fontSize: \'0.8rem\', cursor: \'pointer\', whiteSpace: \'nowrap\' }}>',
      '          {isSH ? \'🛍 Market\' : \'♻️ Second Hand\'}',
      '        </button>'
    );
    break;
  }
}

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
