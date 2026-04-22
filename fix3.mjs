import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
const lines = readFileSync(file, 'utf8').split('\n');

// 1. Reemplazar boton header (lineas 2848-2853, index 2847-2852)
lines.splice(2847, 6,
  `            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>`,
  `              {isSH ? 'Second Hand' : 'Market'}`,
  `            </span>`
);

// 2. Buscar la barra del carrusel y agregar boton
const barraIdx = lines.findIndex(l => l.includes('Barra de modo'));
console.log('Barra encontrada en linea:', barraIdx);

// Buscar el cierre de la barra (</div> despues de la barra)
for (let i = barraIdx; i < barraIdx + 20; i++) {
  if (lines[i] && lines[i].trim() === '</div>' && lines[i+1] && lines[i+1].trim() === '</div>') {
    lines.splice(i, 0,
      `        <button onClick={() => setMode(isSH ? 'mkt' : 'sh')} style={{ flexShrink: 0, marginRight: '12px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.6)', color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>`,
      `          {isSH ? '🛍 Market' : '♻️ Second Hand'}`,
      `        </button>`
    );
    console.log('Boton insertado en linea:', i);
    break;
  }
}

writeFileSync(file, lines.join('\n'), 'utf8');
console.log('OK');
