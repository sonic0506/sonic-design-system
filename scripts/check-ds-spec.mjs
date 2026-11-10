// ds-spec/required.json 규격을 지키는지 검사해요. 어기면 목록을 출력하고 exit 1.
// 사용법: node scripts/check-ds-spec.mjs [figma-tokens.json] [figma-structure 결과 json]
//   두 번째 인자(scripts/figma-structure.js 결과)가 있으면 페이지·문서·컴포넌트도 검사해요.
import { readFileSync } from 'node:fs';

const spec = JSON.parse(readFileSync(new URL('../ds-spec/required.json', import.meta.url)));
const [, , tokensPath = new URL('./figma-tokens.json', import.meta.url), structurePath] = process.argv;
const { collections, textStyles } = JSON.parse(readFileSync(tokensPath));
const errors = [];
const err = m => errors.push(m);

// 변수 컬렉션, 모드, 필수 토큰
for (const [name, rule] of Object.entries(spec.variables)) {
  const c = collections[name];
  if (!c) { err(`컬렉션 없음: ${name}`); continue; }
  if (c.modes.join() !== rule.modes.join()) err(`${name} 모드가 ${rule.modes.join('/')}가 아님: ${c.modes.join('/')}`);
  for (const v of rule.required ?? []) if (!c.variables[v]) err(`${name}에 ${v} 없음`);
}

// 팔레트: 그룹마다 11단계, 번호를 따라 어두워짐, 같은 hex 없음
const prim = collections.Primitives?.variables ?? {};
const lum = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
const groups = new Set(Object.keys(prim).filter(k => /^[a-z]+\/\d+$/.test(k)).map(k => k.split('/')[0]));
for (const g of groups) if (![...spec.palette.required, ...spec.palette.optional].includes(g)) err(`팔레트 그룹 규칙 밖: ${g} (색 이름 대신 역할 이름을 써요)`);
for (const g of spec.palette.required) if (!groups.has(g)) err(`팔레트 필수 그룹 없음: ${g}`);
for (const e of spec.palette.extra) if (!prim[e]) err(`팔레트에 ${e} 없음`);
const seen = {};
for (const g of groups) {
  let prev = Infinity;
  for (const s of spec.palette.steps) {
    const hex = prim[`${g}/${s}`]?.values.Value;
    if (!hex) { err(`${g}/${s} 없음`); continue; }
    if (seen[hex]) err(`같은 hex ${hex}: ${seen[hex]}, ${g}/${s}`);
    seen[hex] = `${g}/${s}`;
    const l = lum(hex);
    if (l >= prev) err(`${g}/${s}가 앞 단계보다 어둡지 않음`);
    prev = l;
  }
}

// 텍스트 스타일: 이름 규칙, 굵기·크기 일치, 그룹 안에서 번호가 커지면 크기는 같거나 작음
const t = spec.typography;
const re = new RegExp(t.name);
const sizes = {};
for (const [name, s] of Object.entries(textStyles)) {
  const m = name.match(re);
  if (!m) { err(`텍스트 스타일 이름 규칙 위반: ${name}`); continue; }
  const [, group, prefix, n, w, size] = m;
  const g = t.groups[group];
  if (t.prefix[group] !== prefix) err(`${name}: ${group}의 머리글자는 ${t.prefix[group]}`);
  if (+n < 1 || +n > g.max) err(`${name}: ${group} 번호는 1~${g.max}`);
  if (!g.weights.includes(w)) err(`${name}: ${group}에 쓸 수 없는 굵기 ${w}`);
  if (t.weight[w] !== s.fontStyle) err(`${name}: 이름은 ${t.weight[w]}인데 실제 ${s.fontStyle}`);
  if (+size !== s.fontSize) err(`${name}: 이름은 ${size}인데 실제 ${s.fontSize}`);
  (sizes[group] ??= []).push([+n, s.fontSize]);
}
for (const g of ['Heading', 'Title', 'Body']) if (!sizes[g]) err(`텍스트 스타일 그룹 없음: ${g}`);
for (const [g, list] of Object.entries(sizes)) {
  const nums = [...new Set(list.map(([n]) => n))].sort((a, b) => a - b);
  if (nums.some((n, i) => n !== i + 1)) err(`${g} 번호가 1부터 이어지지 않음: ${nums.join(',')}`);
  for (const [a, sa] of list) for (const [b, sb] of list) if (a < b && sa < sb) err(`${g} ${b}(${sb}px)가 ${g} ${a}(${sa}px)보다 큼`);
}

// 페이지, 문서, 컴포넌트 (figma-structure 결과가 있을 때)
if (structurePath) {
  const st = JSON.parse(readFileSync(structurePath));
  for (const p of spec.pages) if (!st.pages.includes(p)) err(`페이지 없음: ${p}`);
  for (const [page, rule] of Object.entries(spec.docs)) for (const title of rule.required) if (!(st.docs[page] ?? []).some(d => d.replace(/^Doc · \d+ /, '') === title)) err(`${page} 문서 없음: ${title}`);
  for (const name of spec.docKit) if (!st.components[name]) err(`Doc Kit 컴포넌트 없음: ${name}`);
  for (const [name, props] of Object.entries(spec.components)) {
    const c = st.components[name];
    if (!c) { err(`컴포넌트 없음: ${name}`); continue; }
    for (const [p, v] of Object.entries(props)) {
      if (!(p in c)) err(`${name}에 속성 ${p} 없음`);
      else if (Array.isArray(v) ? v.some(o => !c[p].includes?.(o)) : c[p] !== v) err(`${name}.${p}: ${JSON.stringify(v)}가 필요한데 ${JSON.stringify(c[p])}`);
    }
  }
}

if (errors.length) {
  console.log(`ds-spec 위반 ${errors.length}개:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`ds-spec 통과${structurePath ? ' (토큰 + 구조)' : ' (토큰만. 구조는 figma-structure 결과를 두 번째 인자로)'}`);
