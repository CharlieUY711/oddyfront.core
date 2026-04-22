import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');

// 1. Agregar barra con carrusel despues de </header>
const barra = `
      {/* Barra de modo */}
      <div style={{ position: 'fixed', top: headerHeight, left: 0, right: 0, width: '100%', height: '48px', backgroundColor: isSH ? '#FF6835' : '#6BB87A', transition: 'background-color 0.4s ease', zIndex: 299, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div ref={carouselRef} style={{ display: 'flex', gap: '6px', alignItems: 'center', overflow: 'hidden', height: '100%', padding: '6px 12px', width: '100%' }}>
          {Array(10).fill(null).flatMap(() => (isSH ? MP : SH)).map((p, idx) => (
            <div key={\`c\${p.id}-\${idx}\`} style={{ width: '36px', height: '36px', borderRadius: '6px', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.4)', flexShrink: 0, cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
              <img src={p.img} alt={p.n} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>`;

c = c.replace('      </header>', '      </header>' + barra);

// 2. Eliminar bloque HERO
const startMarker = '        {/* HERO */}';
const endMarker = '        {/* ── MARKET ── */}';
const startIdx = c.indexOf(startMarker);
const endIdx = c.indexOf(endMarker);
if (startIdx !== -1 && endIdx !== -1) {
  c = c.slice(0, startIdx) + c.slice(endIdx);
  console.log('Hero eliminado OK');
} else {
  console.log('Markers no encontrados:', startIdx, endIdx);
}

writeFileSync(file, c, 'utf8');
console.log('Listo');
