import { readFileSync, writeFileSync } from 'fs';
const file = 'src/main.tsx';
let c = readFileSync(file, 'utf8');
c = c.replace(
  'import App from "./app/App.tsx";',
  'import App from "./app/App.tsx";\nimport { ErrorBoundary } from "./app/components/ErrorBoundary";'
);
c = c.replace(
  'createRoot(document.getElementById("root")!).render(<App />);',
  'createRoot(document.getElementById("root")!).render(\n  <ErrorBoundary>\n    <App />\n  </ErrorBoundary>\n);'
);
writeFileSync(file, c, 'utf8');
console.log('OK');
