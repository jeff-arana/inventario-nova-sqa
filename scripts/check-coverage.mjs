import fs from 'node:fs';
const scopes = [
  'backend/coverage/coverage-summary.json',
  'frontend/coverage/coverage-summary.json',
];
let failed = false;
for (const path of scopes) {
  if (!fs.existsSync(path)) { console.error(`Falta cobertura: ${path}`); failed = true; continue; }
  const stats = JSON.parse(fs.readFileSync(path, 'utf8')).total;
  for (const field of ['lines', 'branches', 'functions', 'statements']) {
    const pct = stats[field]?.pct ?? -1;
    console.log(`${path} ${field}: ${pct}%`);
    if (pct < 60) { console.error(`QUALITY GATE FALLÓ: ${field} < 60%`); failed = true; }
  }
}
if (failed) process.exit(1);
console.log('QUALITY GATE APROBADO: ambas coberturas >= 60%.');
