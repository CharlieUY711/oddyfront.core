import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Reemplazar todo el bloque del carrito (24 lineas desde index 2859)
// con version limpia: sin texto hardcodeado, con numero dinamico
lines.splice(2859, 24,
  "            <div className=\"oddy-cart\" onClick={() => setShowCart(!showCart)} style={{ cursor: 'pointer', marginLeft: '8px', marginRight: '4px' }}>",
  "              <svg viewBox=\"0 0 24 24\" width=\"26\" height=\"26\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.5\">",
  "                <circle cx=\"9\" cy=\"21\" r=\"1\"/>",
  "                <circle cx=\"20\" cy=\"21\" r=\"1\"/>",
  "                <path d=\"M5 1l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6\" strokeLinecap=\"round\" strokeLinejoin=\"round\"/>",
  "                <path d=\"M5 1L1 1\" strokeLinecap=\"round\"/>",
  "                {cartItems.length > 0 && (",
  "                  <text x=\"14\" y=\"11.5\" fontSize=\"9\" fill={isSH ? '#6BB87A' : '#FF6835'} fontWeight=\"bold\" textAnchor=\"middle\" dominantBaseline=\"middle\" style={{ fontFamily: 'Arial, sans-serif', pointerEvents: 'none' }}>",
  "                    {cartItems.length}",
  "                  </text>",
  "                )}",
  "              </svg>",
  "            </div>",
  "          </div>",
  "        </div>"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
