import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Volver SVG a 29px
lines[2860] = '              <svg viewBox="0 0 24 24" width="29" height="29" fill="none" stroke="currentColor" strokeWidth="1.5">';

// Sacar el text del SVG - reemplazar el condicional con nada
lines.splice(2865, 5);

// Cambiar el div del carrito a position relative y agregar numero como overlay
lines[2859] = '            <div className="oddy-cart" onClick={() => setShowCart(!showCart)} style={{ cursor: "pointer", position: "relative" }}>';

// Buscar el </svg> y agregar el numero despues
const svgCloseIdx = lines.findIndex((l, i) => i > 2859 && i < 2875 && l.trim() === '</svg>');
console.log("SVG close en:", svgCloseIdx);
lines.splice(svgCloseIdx + 1, 0,
  "              {cartItems.length > 0 && (",
  "                <span style={{ position: 'absolute', top: '0px', right: '-2px', fontSize: '9px', fontFamily: \"'DM Sans', sans-serif\", fontWeight: '400', color: isSH ? '#6BB87A' : '#FF6835', lineHeight: 1 }}>",
  "                  {cartItems.length}",
  "                </span>",
  "              )}"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
