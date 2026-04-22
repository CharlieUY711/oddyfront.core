import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Solo cambiar el div wrapper a position relative
lines[2859] = "            <div className=\"oddy-cart\" onClick={() => setShowCart(!showCart)} style={{ cursor: 'pointer', position: 'relative', marginLeft: '8px' }}>";

// Buscar </svg> y agregar badge despues
const svgClose = lines.findIndex((l, i) => i > 2859 && i < 2890 && l.trim() === '</svg>');
console.log('SVG close en:', svgClose, lines[svgClose]);

lines.splice(svgClose + 1, 0,
  "              {cartItems.length > 0 && (",
  "                <span style={{ position: 'absolute', top: '-4px', right: '-4px', minWidth: '16px', height: '16px', borderRadius: '8px', backgroundColor: isSH ? '#6BB87A' : '#FF6835', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontFamily: \"'DM Sans', sans-serif\", fontWeight: '400', color: '#fff', padding: '0 3px', boxSizing: 'border-box' }}>",
  "                  {cartItems.length}",
  "                </span>",
  "              )}"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
