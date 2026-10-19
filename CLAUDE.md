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
