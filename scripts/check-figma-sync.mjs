// Figma에서 새로 추출한 JSON과 scripts/figma-tokens.json을 비교해요. 다르면 목록을 출력하고 exit 1.
// 사용법: node scripts/check-figma-sync.mjs <새로 추출한 json 경로>
import { readFileSync } from 'node:fs';

const [, , freshPath] = process.argv;
if (!freshPath) {
  console.error('사용법: node scripts/check-figma-sync.mjs <figma-export 결과 json>');
  process.exit(2);
}
const flat = (o, p = '', out = {}) => {
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, key, out);
    else out[key] = JSON.stringify(v);
  }
  return out;
};
const committed = flat(JSON.parse(readFileSync(new URL('./figma-tokens.json', import.meta.url))));
const fresh = flat(JSON.parse(readFileSync(freshPath)));
const diffs = [...new Set([...Object.keys(committed), ...Object.keys(fresh)])]
  .filter(k => committed[k] !== fresh[k])
  .map(k => `${k}: ${committed[k] ?? '(없음)'} → ${fresh[k] ?? '(없음)'}`);

if (diffs.length) {
  console.log(`Figma와 다른 값 ${diffs.length}개:\n  ${diffs.join('\n  ')}\n→ 새 값을 scripts/figma-tokens.json에 저장하고 npm run tokens 실행`);
  process.exit(1);
}
console.log('Figma와 figma-tokens.json이 같아요.');
