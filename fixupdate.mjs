import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Encontrar la barra existente y reemplazarla completa
const barraStart = lines.findIndex(l => l.includes('Barra de modo'));
console.log('Barra en:', barraStart);

// Encontrar el cierre de la barra (</div> seguido de comentario o DEPT STRIP)
let barraEnd = -1;
for (let i = barraStart + 1; i < barraStart + 25; i++) {
  if (lines[i] && lines[i].includes('DEPT STRIP')) {
    barraEnd = i;
    break;
  }
}
console.log('Barra termina en:', barraEnd);
console.log('Lineas a reemplazar:', barraEnd - barraStart);

// Reemplazar el bloque completo
lines.splice(barraStart, barraEnd - barraStart,
  "      {/* Barra de modo */}",
  "      <div style={{ position: 'fixed', top: headerHeight, left: 0, right: 0, width: '100%', height: '48px', backgroundColor: isSH ? '#FF6835' : '#6BB87A', transition: 'background-color 0.4s ease', zIndex: 299, display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', paddingRight: '12px' }}>",
  "        <div ref={carouselRef} style={{ display: 'flex', gap: '6px', alignItems: 'center', overflow: 'hidden', height: '100%', padding: '6px 0', flex: 1 }}>",
  "          {Array(10).fill(null).flatMap(() => (isSH ? MP : SH)).map((p, idx) => (",
  "            <div key={`c${p.id}-${idx}`} style={{ width: '36px', height: '36px', borderRadius: '6px', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.4)', flexShrink: 0, cursor: 'pointer', transition: 'transform 0.2s' }}",
  "              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}",
  "              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>",
  "              <img src={p.img} alt={p.n} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />",
  "            </div>",
  "          ))}",
  "        </div>",
  "        <button onClick={() => setMode(isSH ? 'mkt' : 'sh')} className=\"oddy-login-btn oddy-mode-btn\" style={{ flexShrink: 0, minWidth: '140px' }}>",
  "          {isSH ? '🛍 Market' : '♻️ Second Hand'}",
  "        </button>",
  "      </div>"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
