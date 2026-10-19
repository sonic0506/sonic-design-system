// Figma MCP use_figma로 실행하는 추출 코드 (fileKey: XifnZsjqJWJqFmAmrM6p3u, 읽기 전용).
// Claude에게: "scripts/figma-export.js를 use_figma로 실행하고 결과를 scripts/figma-tokens.json(또는 비교용 임시 파일)에 저장해 줘"
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byId = Object.fromEntries(vars.map(v => [v.id, v]));
const hex = c => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase() + (c.a !== undefined && c.a < 1 ? Math.round(c.a * 255).toString(16).padStart(2, '0').toUpperCase() : '');
const val = (v, x) => x?.type === 'VARIABLE_ALIAS' ? { alias: byId[x.id].name } : v.resolvedType === 'COLOR' ? hex(x) : x;
const collections = {};
for (const c of cols) {
  collections[c.name] = { modes: c.modes.map(m => m.name), variables: {} };
  for (const id of c.variableIds) { const v = byId[id]; collections[c.name].variables[v.name] = { type: v.resolvedType, values: Object.fromEntries(c.modes.map(m => [m.name, val(v, v.valuesByMode[m.modeId])])) }; }
}
const textStyles = {};
for (const s of await figma.getLocalTextStylesAsync()) textStyles[s.name] = { fontFamily: s.fontName.family, fontStyle: s.fontName.style, fontSize: s.fontSize, lineHeight: s.lineHeight.value, letterSpacingPercent: s.letterSpacing.value };
return { source: 'figma:XifnZsjqJWJqFmAmrM6p3u', collections, textStyles };
