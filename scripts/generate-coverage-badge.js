const fs = require('node:fs');
const path = require('node:path');

const summaryPath = path.resolve(__dirname, '../coverage/coverage-summary.json');
const badgePath = path.resolve(__dirname, '../docs/coverage-badge.svg');

if (!fs.existsSync(summaryPath)) {
  console.error('coverage-summary.json não encontrado. Execute npm run test:coverage primeiro.');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
const pct = Number(summary.total.lines.pct).toFixed(1).replace('.0', '');
const num = Number(summary.total.lines.pct);
const color = num >= 90 ? '#22c55e' : num >= 80 ? '#38bdf8' : '#ef4444';
const label = 'cobertura (lcov)';
const value = `${pct}% (meta >=80%)`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="230" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="230" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="105" height="20" fill="#334155"/>
    <rect x="105" width="125" height="20" fill="${color}"/>
    <rect width="230" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="535" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${label}</text>
    <text x="535" y="140" transform="scale(.1)" fill="#fff">${label}</text>
    <text aria-hidden="true" x="1665" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${value}</text>
    <text x="1665" y="140" transform="scale(.1)" fill="#0f172a" font-weight="bold">${value}</text>
  </g>
</svg>
`;

fs.writeFileSync(badgePath, svg, 'utf-8');
console.log(`Badge de cobertura gerado em docs/coverage-badge.svg: ${value}`);
