# sonic-ui 저장소 운영 규칙

이 저장소는 디자인 규칙과 컴포넌트만 담당해요. Claude Code hooks, 쓰는 쪽 ESLint/Prettier 설정, API 계층 규칙은 별도 코딩 하네스 저장소에서 다뤄요. 여기서 만들지 않아요.

@DESIGN.md

## 원본과 흐름

Figma(원본, fileKey `XifnZsjqJWJqFmAmrM6p3u`) → DESIGN.md(규칙) → 코드 → npm(`@xonic0506/sonic-ui`)

## 디자인을 바꿀 때 (순서 지키기)

1. **Figma를 먼저 고쳐요.** Variables, 텍스트 스타일, 컴포넌트.
2. **DESIGN.md를 고쳐요.** 토큰 표, 컴포넌트 스펙(§10), 매핑표(§11).
3. **토큰을 다시 추출해요.** `scripts/figma-export.js`를 Figma MCP `use_figma`로 실행해 `scripts/figma-tokens.json`에 저장하고 `npm run tokens`를 실행해요.
   - `src/styles/tokens.css`, `src/styles/theme.css`는 생성물이라 손으로 고치지 않아요.
   - 바뀐 게 있는지만 볼 때: 추출 결과를 임시 파일에 저장하고 `node scripts/check-figma-sync.mjs <파일>`을 실행해요.
4. **코드와 테스트를 고쳐요.** `npm run typecheck && npm test && npm run build`, 그다음 `npm run playground`에서 light/dark를 Figma와 비교해요.
5. **버전을 올려요.** 1.0 전까지: 깨지는 변경은 minor(`npm version minor`), 나머지는 patch. 배포(`npm publish`)는 사용자 확인 후에만 해요.

## Figma 문서 페이지 규칙

Foundations, Core, Patterns 페이지는 읽는 사람을 위한 문서예요. 제품 규칙이 아니라서 DESIGN.md에는 넣지 않아요.

- **Doc Kit 페이지의 컴포넌트로만 만들어요**: `Doc / Page Header`, `Doc / Section`(Content slot), `Doc / Table Header`, `Doc / Table Row`, `Doc / Token Chip`, `Doc / Swatch`.
- 문서 한 장 = 너비 1240 프레임(이름 `Doc · NN 제목`). Semantic **Dark** 모드를 지정한 canvas 배경 위에 Page Header 1개와 Section 카드(**Light** 모드)를 쌓아요. 새 색이나 문서 전용 토큰은 만들지 않아요.
- 컴포넌트 문서에는 스펙 표와 상태 × 크기 매트릭스를 넣고, Light/Dark를 함께 보여 줘요. 매트릭스에는 원본 컴포넌트의 **인스턴스**만 놓아요.
- 상호작용이 있는 컴포넌트는 "Interaction states" 섹션(Default / Hover / Focus / Disabled)을 둬요. hover는 코드와 같은 토큰을 인스턴스에 오버라이드하고, focus는 `Focus ring` 프레임(padding·선 두께 = `stroke/focus`, 바깥쪽 선, `radius/lg`)으로 감싸요. 코드의 상태 클래스를 바꾸면 이 섹션도 함께 고쳐요.
- 원본 컴포넌트는 Core 페이지 `Source components` 프레임에 둬요. 옮길 때 ID가 바뀌지 않게 해요(DESIGN.md §11 매핑표가 node id를 참조함).
- 인스턴스를 `rescale`하지 않아요. 글자 크기가 바뀌어 텍스트 스타일 연결이 끊겨요.
- 문서를 고친 뒤에는 하드코딩 감사(fill, stroke, padding, gap, radius, opacity, 텍스트 스타일 바인딩)를 실행해서 0건인지 확인해요. 단, `Icon /` 컴포넌트 안 벡터의 선 두께(Lucide 원본 2)는 감사에서 제외해요.
- 아이콘 추가: 공식 `lucide-static` SVG(설치된 `lucide-react`와 같은 버전)를 `createNodeFromSvg`로 가져와 24×24 `Icon / <lucide 이름>` 컴포넌트로 만들고, **벡터를 `Icon`이라는 레이어 하나로 합쳐요(flatten)**. 선 색은 `color/text/default`에 바인딩해요. 모든 아이콘의 레이어 구조가 같아야 버튼 안에서 아이콘을 교체해도 색 지정(on-primary 등)이 유지돼요.
- 스크립트로 instance swap 속성을 지정할 때 기본값과 같은 아이콘을 다시 넣지 않아요. Figma가 안쪽 색 지정을 초기화해요. 바꿀 때만 지정해요. Foundations `Source icons`에 넣고 04 Icon 문서의 Set에도 추가해요.

## Pattern 승격 기준

같은 형태를 **두 번째 프로젝트에서 복사하게 됐을 때만** `src/patterns/`로 올려요. 도메인 타입, API, 비즈니스 규칙을 아는 컴포넌트는 올리지 않아요. 자세한 기준은 `src/patterns/README.md`에 있어요.

## 구현 규칙

- 클래스는 모두 `sn:` 접두사를 붙이고, `cn()`(cva + tailwind-merge)으로 합쳐요.
- 공개 props에 Base UI 타입을 드러내지 않아요. 우리 props로 감싸요.
- 상태 스타일은 Base UI data 속성을 써요(`data-disabled`, `data-open`, `data-starting-style`, `data-ending-style` …).
- 컴포넌트를 구현할 때는 frontend-design을 쓰지 않아요. Figma를 그대로 따라요.
- 하위 컴포넌트는 이름 있는 export만 써요(`CardHeader`). `Card.Header`는 서버 컴포넌트에서 깨져요.

## 검증 도구

- `fixtures/vite-plain`, `fixtures/next-tailwind`: 쓰는 쪽 예제예요. 배포 전에는 `"file:../<npm pack 결과>.tgz"`로, 배포 후에는 npm 버전으로 설치해 확인해요(`.claude/launch.json`에 실행 설정).
- `explorations/`: 1단계 디자인 시안. 참고용이고 패키지에 들어가지 않아요.
