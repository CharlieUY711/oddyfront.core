import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');

// 1. Reemplazar boton por texto estatico en header
c = c.replace(
  `            <button
              className="oddy-market-btn"
              onClick={() => setMode(isSH ? 'mkt' : 'sh')}
            >
              {isSH ? 'Market' : 'Second Hand'}
            </button>`,
  `            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em' }}>
              {isSH ? 'Second Hand' : 'Market'}
            </span>`
);

// 2. Agregar boton de cambio en la barra del carrusel (al final del div de la barra)
c = c.replace(
  `        </div>
      </div>
      {/* DEPT STRIP */}`,
  `          <button
            onClick={() => setMode(isSH ? 'mkt' : 'sh')}
            style={{ flexShrink: 0, marginLeft: 'auto', marginRight: '12px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.6)', color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap', backdropFilter: 'blur(4px)' }}
          >
            {isSH ? '🛍 Market' : '♻️ Second Hand'}
          </button>
        </div>
      </div>
      {/* DEPT STRIP */}`
);

writeFileSync(file, c, 'utf8');
console.log('OK');
