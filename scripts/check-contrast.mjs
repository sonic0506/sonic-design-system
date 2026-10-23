// 글자/바탕 토큰 쌍의 대비를 Light·Dark 모두 계산해요 (WCAG 2.x). 4.5:1 미만이면 exit 1.
// 사용법: node scripts/check-contrast.mjs [figma-tokens.json 경로]
import { readFileSync } from 'node:fs';

const path = process.argv[2] ?? new URL('./figma-tokens.json', import.meta.url);
const { collections } = JSON.parse(readFileSync(path));
const prim = collections.Primitives.variables;
const sem = collections.Semantic.variables;

// [글자, 바탕] — 실제로 함께 쓰는 조합만
const PAIRS = [
  ['text/default', 'bg/canvas'], ['text/default', 'bg/surface'], ['text/muted', 'bg/surface'],
  ['text/on-primary', 'bg/primary'], ['text/on-danger', 'bg/danger'], ['text/danger', 'bg/surface'],
  ['text/inverse', 'bg/inverse'],
  ['text/on-success', 'bg/success'], ['text/success', 'bg/success-subtle'], ['text/success', 'bg/surface'],
  ['text/on-warning', 'bg/warning'], ['text/warning', 'bg/warning-subtle'], ['text/warning', 'bg/surface'],
  ['text/danger', 'bg/danger-subtle'], ['text/default', 'bg/subtle'],
  ['text/default', 'bg/selected'], ['text/muted', 'bg/selected'],
];

const lum = hex => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const resolve = (name, mode) => { const v = sem[`color/${name}`]?.values[mode]; return v && prim[v.alias].values.Value; };

let fail = 0;
const rows = [];
for (const mode of ['Light', 'Dark']) for (const [fg, bg] of PAIRS) {
  const a = resolve(fg, mode), b = resolve(bg, mode);
  if (!a || !b) { rows.push(`${mode.padEnd(5)} ${fg} on ${bg}: 토큰 없음`); fail++; continue; }
  const r = ratio(a, b); const ok = r >= 4.5; if (!ok) fail++;
  rows.push(`${mode.padEnd(5)} ${(fg + ' on ' + bg).padEnd(38)} ${a} / ${b}  ${r.toFixed(2)}:1 ${ok ? 'OK' : 'FAIL'}`);
}
console.log(rows.join('\n'));
console.log(fail ? `\n기준(4.5:1) 미달 ${fail}개` : '\n모든 조합 4.5:1 이상');
process.exit(fail ? 1 : 0);
