import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Verificar que no hay barra previa
const barraExiste = lines.some(l => l.includes('Barra de modo'));
console.log('Barra previa:', barraExiste);
if (barraExiste) { console.log('ABORT - ya existe barra'); process.exit(1); }

// 1. Reemplazar boton market por span
const btnIdx = lines.findIndex(l => l.includes('oddy-market-btn') && l.includes('className'));
console.log('Boton en:', btnIdx);
lines.splice(btnIdx - 1, 6,
  "            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', minWidth: '140px', display: 'inline-block', textAlign: 'center' }}>",
  "              {isSH ? 'Second Hand' : 'Market'}",
  "            </span>"
);

// 2. Agregar barra despues de </header>
const headerCloseIdx = lines.findIndex(l => l.trim() === '</header>');
console.log('Header close en:', headerCloseIdx);
lines.splice(headerCloseIdx + 1, 0,
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
console.log('OK - barra insertada en:', headerCloseIdx + 1);
