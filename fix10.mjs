import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const barraIdx = lines.findIndex(l => l.includes('Barra de modo'));

// Reemplazar toda la barra con estructura: boton | carrusel
lines[barraIdx + 1] = "      <div style={{ position: 'fixed', top: headerHeight, left: 0, right: 0, width: '100%', height: '48px', backgroundColor: isSH ? '#FF6835' : '#6BB87A', transition: 'background-color 0.4s ease', zIndex: 299, display: 'flex', alignItems: 'center' }}>";
lines[barraIdx + 2] = "        <button onClick={() => setMode(isSH ? 'mkt' : 'sh')} style={{ flexShrink: 0, marginLeft: '12px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.6)', color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>";
lines.splice(barraIdx + 3, 0,
  "          {isSH ? '🛍 Market' : '♻️ Second Hand'}",
  "        </button>",
  "        <div ref={carouselRef} style={{ display: 'flex', gap: '6px', alignItems: 'center', overflow: 'hidden', height: '100%', padding: '6px 12px', flex: 1 }}>"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
