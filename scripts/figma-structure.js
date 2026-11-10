// Figma MCP use_figma로 실행하는 구조 추출 코드 (읽기 전용). 결과를 임시 파일에 저장하고
// node scripts/check-ds-spec.mjs scripts/figma-tokens.json <결과 파일> 로 ds-spec/required.json과 비교해요.
const pages = figma.root.children;
await Promise.all(pages.map(p => p.loadAsync()));
const docs = {};
for (const p of pages) docs[p.name] = p.children.filter(c => c.name.startsWith('Doc · ')).map(c => c.name);
const props = c => Object.fromEntries(Object.entries(c.componentPropertyDefinitions).map(([k, v]) => [k.split('#')[0], v.type === 'VARIANT' ? v.variantOptions : v.type]));
const components = {};
for (const p of pages) for (const c of p.findAllWithCriteria({ types: ['COMPONENT', 'COMPONENT_SET'] })) if (c.parent.type !== 'COMPONENT_SET') components[c.name] = props(c);
return { pages: pages.map(p => p.name), docs, components };
