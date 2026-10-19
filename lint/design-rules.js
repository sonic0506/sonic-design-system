// DESIGN.md를 지키게 하는 ESLint 규칙 (flat config 조각). 이 저장소에서는 켜지 않고 제공만 함.
// 쓰는 쪽: import sonicDesign from '@xonic0506/sonic-ui/eslint-design-rules'; export default [..., sonicDesign];
const className = "JSXAttribute[name.name='className']";

export default {
  name: 'sonic-ui/design-rules',
  files: ['**/*.{jsx,tsx}'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: `${className} Literal[value=/(^|\\s)[\\w:-]*-\\[[^\\]]+\\]/], ${className} TemplateElement[value.raw=/(^|\\s)[\\w:-]*-\\[[^\\]]+\\]/]`,
        message: 'DESIGN.md: 임의의 값 클래스(p-[7px] 등) 대신 토큰 클래스를 쓰세요.',
      },
      {
        selector: `${className} Literal[value=/(^|\\s)[\\w:-]*(bg|text|border|outline|ring|fill|stroke)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\\d+/]`,
        message: 'DESIGN.md: Tailwind 기본 팔레트 대신 sn 토큰 색(bg-primary, text-muted …)을 쓰세요.',
      },
      {
        selector: 'Literal[value=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
        message: 'DESIGN.md: hex 색을 직접 쓰지 말고 var(--sn-color-…) 토큰을 쓰세요.',
      },
    ],
  },
};
