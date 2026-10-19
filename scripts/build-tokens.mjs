// scripts/figma-tokens.json → src/styles/tokens.css (CSS 변수) + src/styles/theme.css (Tailwind @theme 매핑)
// 두 파일 모두 생성물이에요. 손으로 고치지 말고 Figma를 고친 뒤 토큰을 다시 추출하세요.
import { readFileSync, writeFileSync } from 'node:fs';

const src = JSON.parse(readFileSync(new URL('./figma-tokens.json', import.meta.url)));
const { collections: c, textStyles } = src;
const HEADER = '/* 생성물: scripts/build-tokens.mjs. 손으로 수정 금지 (원본: Figma → scripts/figma-tokens.json) */\n';
const cssName = name => `--sn-${name.replace(/\//g, '-')}`;
const prim = c.Primitives.variables;
const resolve = v => (typeof v === 'object' ? prim[v.alias].values.Value : v);
const WEIGHT = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 };
const stack = { sans: 'ui-sans-serif, system-ui, sans-serif', mono: 'ui-monospace, SFMono-Regular, Menlo, monospace' };

const root = [];
const theme = [];
for (const [n, v] of Object.entries(c.Spacing.variables)) root.push([cssName(n), `${v.values.Value}px`]);
theme.push(['--spacing', 'var(--sn-space-1)']);
for (const [n, v] of Object.entries(c.Radius.variables)) {
  root.push([cssName(n), `${v.values.Value}px`]);
  if (n.startsWith('radius/')) theme.push([`--radius-${n.slice(7)}`, `var(${cssName(n)})`]);
}
for (const [n, v] of Object.entries(c.Motion.variables)) root.push([cssName(n), v.type === 'FLOAT' ? `${v.values.Value}ms` : v.values.Value]);
theme.push(['--ease-standard', 'var(--sn-easing-standard)']);
for (const [n, v] of Object.entries(c.Opacity.variables)) root.push([cssName(n), String(v.values.Value / 100)]);

const fam = { sans: textStyles.body.fontFamily, mono: textStyles.mono.fontFamily };
for (const k of ['sans', 'mono']) { root.push([`--sn-font-${k}`, `"${fam[k]}", ${stack[k]}`]); theme.push([`--font-${k}`, `var(--sn-font-${k})`]); }
for (const [n, s] of Object.entries(textStyles)) {
  const base = `--sn-text-${n}`;
  root.push([base, `${s.fontSize}px`], [`${base}--line-height`, `${s.lineHeight}px`], [`${base}--font-weight`, String(WEIGHT[s.fontStyle])], [`${base}--letter-spacing`, `${s.letterSpacingPercent / 100}em`]);
  // mono 계열은 글꼴만 다르고 크기는 body/caption과 같아서 Tailwind 글자 크기 이름으로는 등록하지 않음 (sn:font-mono + sn:text-body)
  if (s.fontFamily === fam.sans) for (const suf of ['', '--line-height', '--font-weight', '--letter-spacing']) theme.push([`--text-${n}${suf}`, `var(${base}${suf})`]);
}

const NS = { bg: '--background-color', text: '--text-color', border: '--border-color' };
const modes = { light: [], dark: [] };
for (const [n, v] of Object.entries(c.Semantic.variables)) {
  modes.light.push([cssName(n), resolve(v.values.Light)]);
  modes.dark.push([cssName(n), resolve(v.values.Dark)]);
  const [, group, ...rest] = n.split('/');
  theme.push([`${NS[group]}-${rest.join('-')}`, `var(${cssName(n)})`]);
  if (group === 'border') theme.push([`--outline-color-${rest.join('-')}`, `var(${cssName(n)})`]);
}

const block = (sel, pairs, extra = '') => `${sel} {\n${extra}${pairs.map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;
writeFileSync(new URL('../src/styles/tokens.css', import.meta.url), HEADER +
  block(':root', root) + '\n' +
  block(':root, [data-theme="light"]', modes.light, '  color-scheme: light;\n') + '\n' +
  block('[data-theme="dark"]', modes.dark, '  color-scheme: dark;\n'));
writeFileSync(new URL('../src/styles/theme.css', import.meta.url), HEADER +
  '/* Tailwind v4 @theme 매핑. sn 토큰을 Tailwind 클래스 이름으로 연결해요 (bg-primary, text-muted, rounded-md, text-body …).\n   inline reference: 클래스가 var(--sn-*)를 직접 참조하고, Tailwind 테마 변수는 따로 출력하지 않음 */\n' +
  block('@theme inline reference', theme));
console.log(`tokens.css: ${root.length + modes.light.length * 2} vars, theme.css: ${theme.length} mappings`);
