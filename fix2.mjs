import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');

// 1. Reemplazar boton en header por texto estatico
const oldBtn = `            <button
              className="oddy-market-btn"
              onClick={() => setMode(isSH ? 'mkt' : 'sh')}
            >
              {isSH ? 'Market' : 'Second Hand'}
            </button>`;
const newLabel = `            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.03em' }}>
              {isSH ? 'Second Hand' : 'Market'}
            </span>`;
c = c.replace(oldBtn, newLabel);

// 2. Agregar boton en la barra del carrusel antes del cierre
const oldBarra = `        </div>
      </div>
      {/* DEPT STRIP */}`;
const newBarra = `        </div>
        <button
          onClick={() => setMode(isSH ? 'mkt' : 'sh')}
          style={{ flexShrink: 0, marginRight: '12px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.6)', color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          {isSH ? '🛍 Market' : '♻️ Second Hand'}
        </button>
      </div>
      {/* DEPT STRIP */}`;
c = c.replace(oldBarra, newBarra);

writeFileSync(file, c, 'utf8');
console.log('reemplazos:', c.includes('Second Hand') ? 'OK' : 'FAIL');
