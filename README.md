<div align="center">

<img src="./docs/assets/sonic-mascot.webp" alt="Sonic 마스코트" width="240" />

# Sonic UI

[![npm version](https://img.shields.io/npm/v/@xonic0506/sonic-ui.svg)](https://www.npmjs.com/package/@xonic0506/sonic-ui) ![React](https://img.shields.io/badge/react-18.2%20%7C%2019-61dafb.svg) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Figma를 원본으로 하는 개인 디자인 시스템이에요.

[Figma](https://www.figma.com/design/XifnZsjqJWJqFmAmrM6p3u) | [디자인 규칙 (DESIGN.md)](./DESIGN.md) | [AI 작업 규칙 (AI-RULES.md)](./AI-RULES.md)

</div>

Sonic UI는 모든 사이드 프로젝트에서 같은 디자인을 쓰기 위해 만들었어요. 디자인 룰을 Figma와 DESIGN.md에 정해 두면, AI가 그 룰로 Figma 디자인을 만들고 이 패키지의 컴포넌트로 코드를 짜요.

```text
Figma (원본) → DESIGN.md (룰) → @xonic0506/sonic-ui (코드) → 실제 프로젝트
```

## 특징

- Figma Variables가 그대로 CSS 변수가 돼요. `color/bg/primary`는 `--sn-color-bg-primary`이고, light/dark 테마를 함께 가져요.
- CSS를 미리 빌드해서 배포해요. 쓰는 쪽 프로젝트는 Tailwind가 있어도 되고 없어도 돼요.
- 모든 클래스에 `sn:` 접두사를 붙이고 `@layer sonic` 안에 넣어서, 쓰는 쪽 스타일과 부딪히지 않아요.
- [Base UI](https://base-ui.com) 위에 만들어서 키보드 조작, 포커스 관리, 화면 낭독기 지원이 기본으로 들어 있어요.
- 모든 파일에 `"use client"`가 붙어 있어서 Next.js 서버 컴포넌트에서도 바로 import할 수 있어요.
- 쓰는 쪽 AI가 읽을 규칙 문서(DESIGN.md, AI-RULES.md)와 디자인 lint 규칙을 함께 배포해요.

## 컴포넌트

| 분류 | 컴포넌트 |
| --- | --- |
| 기본 | Button, Input, Textarea, Text, Card, Avatar, Separator |
| 폼 | Field, Checkbox, CheckboxGroup, RadioGroup, Switch, Select (단일·다중) |
| 오버레이 | Dialog, AlertDialog, Menu, Popover, Tooltip |
| 탐색 | Tabs |
| 피드백·상태 | Toast, Badge, Progress, Skeleton, EmptyState, ErrorState, ErrorPage |

컴포넌트별 props와 스펙은 [DESIGN.md §10](./DESIGN.md#10-컴포넌트-스펙-core)에 있어요.

## 시작하기

### 설치

```bash
npm i @xonic0506/sonic-ui
```

`react`, `react-dom` 18.2 이상(19 포함)이 필요해요.

### 글꼴

IBM Plex Sans(400, 500, 600)와 IBM Plex Mono(400)를 프로젝트에서 불러와요. 없으면 시스템 글꼴로 대체돼요.

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
```

> [!NOTE]
> 글꼴은 패키지에 들어 있지 않아요. sonic-ui는 글꼴 이름 `"IBM Plex Sans"`, `"IBM Plex Mono"`를 찾기 때문에, 이름을 바꾸는 방식(예: `next/font` 기본 설정)으로 불러오면 적용되지 않아요. 위 링크나 `@fontsource/ibm-plex-sans`처럼 원래 이름을 유지하는 방식을 써요.

### CSS 연결

Tailwind v4 프로젝트(권장)에서는 이렇게 연결해요.

```css
/* app/globals.css */
@layer theme, base, sonic, components, utilities;
@import "tailwindcss";
@import "@xonic0506/sonic-ui/styles.css";
@import "@xonic0506/sonic-ui/tailwind.css"; /* 선택: bg-primary, text-muted, rounded-md, text-body 같은 클래스 */
```

> [!IMPORTANT]
> layer 순서를 지켜요. `sonic`이 Tailwind preflight(`base`)보다 뒤에 있어야 버튼 배경과 글자 크기가 지워지지 않고, 쓰는 쪽 `components`/`utilities`보다 앞에 있어야 `className="bg-red-500"` 같은 덮어쓰기가 항상 이겨요.

Tailwind가 없는 프로젝트에서는 CSS 파일 하나만 불러와요. 토큰은 `var(--sn-color-bg-primary)`처럼 CSS 변수로 써요.

```ts
import '@xonic0506/sonic-ui/styles.css';
```

### 앱 루트와 테마

앱 루트에 `isolation: isolate`를 지정해요. 앱의 z-index가 `body` 아래에 그려지는 Dialog, Toast를 가리지 않게 해 줘요.

```tsx
<div style={{ isolation: 'isolate' }}>{/* 앱 */}</div>   // Tailwind: className="isolate"
```

테마는 `<html data-theme="light">` 또는 `data-theme="dark"`로 바꿔요. 속성이 없으면 light이고, `body` 아래에 그려지는 팝업에도 같은 테마가 적용돼요.

## 사용

```tsx
import { Button, Card, CardBody, CardHeader, CardTitle, Dialog, DialogClose, DialogFooter, DialogPopup, DialogTitle, DialogTrigger, Input, Text } from '@xonic0506/sonic-ui';

<Card>
  <CardHeader><CardTitle>API 키</CardTitle></CardHeader>
  <CardBody>
    <Text variant="mono-caption" tone="muted">sk_live_…a91f</Text>
  </CardBody>
</Card>

<Dialog>
  <DialogTrigger render={<Button />}>API 키 만들기</DialogTrigger>
  <DialogPopup>
    <DialogTitle>API 키 만들기</DialogTitle>
    <Input placeholder="예: production" />
    <DialogFooter>
      <DialogClose render={<Button variant="secondary" />}>취소</DialogClose>
      <Button>만들기</Button>
    </DialogFooter>
  </DialogPopup>
</Dialog>
```

하위 컴포넌트는 `Card.Header`가 아니라 `CardHeader`처럼 이름 있는 export로 써요. 서버 컴포넌트에서도 깨지지 않게 하기 위해서예요.

Toast는 앱 최상단(Next.js는 `app/layout.tsx`)을 `<ToastProvider>`로 한 번 감싸고, 클라이언트 컴포넌트에서 띄워요.

```tsx
const toast = useToast();
toast.add({ title: 'API 키를 만들었어요', tone: 'success' });
```

## AI와 함께 쓰기

> [!TIP]
> Claude Code를 쓰는 프로젝트라면 CLAUDE.md에 아래 두 줄을 추가해요. AI가 디자인 규칙을 읽고 sonic-ui 컴포넌트로 화면을 만들어요.
>
> ```md
> @node_modules/@xonic0506/sonic-ui/DESIGN.md
> @node_modules/@xonic0506/sonic-ui/AI-RULES.md
> ```

임의의 값 클래스, Tailwind 기본 팔레트, hex 색을 막는 ESLint flat config도 제공해요. 켜는 것은 쓰는 쪽 설정에서 해요.

```js
// eslint.config.js
import sonicDesign from '@xonic0506/sonic-ui/eslint-design-rules';
export default [/* … */, sonicDesign];
```

## 지원 브라우저

Chrome 111+, Edge 111+, Safari 16.4+, Firefox 128+. CSS `@layer`와 `@property`를 쓰기 때문에 Tailwind v4와 기준이 같아요.

## 개발

```bash
npm run build           # 토큰 생성 → JS(Vite) → 타입 → CSS(@layer sonic)
npm test                # Vitest
npm run typecheck
npm run check:contrast  # 글자와 바탕 대비 4.5:1 검사
npm run playground      # Figma와 비교하는 화면 (build 먼저)
```

```text
.
├── src/components/   # Core 컴포넌트
├── src/patterns/     # Pattern 승격 기준 (두 번째 프로젝트에서 복사하게 될 때)
├── scripts/          # Figma 토큰 추출, CSS 빌드, 대비 검사
├── lint/             # 디자인 lint 규칙
├── playground/       # Figma와 비교하는 화면
├── fixtures/         # 쓰는 쪽 예제 (vite, Next.js)
└── DESIGN.md         # 디자인 규칙 (패키지에 포함)
```

> [!NOTE]
> 디자인을 바꿀 때는 Figma → DESIGN.md → 토큰 추출 → 코드 순서를 지켜요. 자세한 운영 규칙은 [CLAUDE.md](./CLAUDE.md)에 있어요.
