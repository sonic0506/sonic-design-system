# @xonic0506/sonic-ui

Figma를 원본으로 하는 개인 디자인 시스템이에요. React 컴포넌트는 [Base UI](https://base-ui.com) 위에 만들었고, CSS는 Tailwind v4로 미리 빌드해서 배포해요.

- 디자인 규칙: [DESIGN.md](./DESIGN.md)
- AI 작업 규칙: [AI-RULES.md](./AI-RULES.md)
- Figma: [Sonic Design System](https://www.figma.com/design/XifnZsjqJWJqFmAmrM6p3u)

## 설치

```bash
npm i @xonic0506/sonic-ui
```

`react`, `react-dom` 18.2 이상(19 포함)이 필요해요(peerDependencies).

### 글꼴

글꼴은 패키지에 들어 있지 않아요. IBM Plex Sans(400·500·600)와 IBM Plex Mono(400)를 프로젝트에서 불러와요. 없으면 시스템 글꼴로 대체돼요.

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
```

sonic-ui는 글꼴 이름 `"IBM Plex Sans"`, `"IBM Plex Mono"`를 찾아요. 이름을 바꾸는 방식(예: `next/font`의 기본 설정)으로 불러오면 적용되지 않으니, 위 링크나 `@fontsource/ibm-plex-sans`처럼 원래 이름을 유지하는 방식을 써요.

## 설정

### Tailwind v4 프로젝트 (권장)

```css
/* app/globals.css */
@layer theme, base, sonic, components, utilities;
@import "tailwindcss";
@import "@xonic0506/sonic-ui/styles.css";
@import "@xonic0506/sonic-ui/tailwind.css"; /* 선택: bg-primary, text-muted, rounded-md, text-body … 클래스 */
```

**layer 순서가 중요해요.** `sonic`은 Tailwind preflight(`base`)보다 뒤, 쓰는 쪽 `components`/`utilities`보다 앞이에요. 그래서 다음이 보장돼요.

- preflight가 버튼 배경, 글자 크기를 지우지 않아요.
- 쓰는 쪽 `className="bg-red-500"`은 항상 sonic-ui 기본 스타일을 이겨요.

### Tailwind 없는 프로젝트

```ts
import '@xonic0506/sonic-ui/styles.css';
```

sonic-ui CSS는 전부 `@layer sonic` 안에 있어서, layer에 넣지 않은 쓰는 쪽 CSS가 항상 이겨요. 토큰은 `var(--sn-color-bg-primary)`처럼 CSS 변수로 써요.

### 앱 최상위 요소

```tsx
<div style={{ isolation: 'isolate' }}>{/* 앱 */}</div>   // Tailwind: className="isolate"
```

앱 루트에 `isolation: isolate`를 지정해요. 앱의 z-index가 Dialog Portal(`body` 아래)을 넘어서지 않게 해 줘요.

### 테마

`<html data-theme="light">` 또는 `data-theme="dark"`로 바꿔요. 속성이 없으면 light예요. Portal로 `body`에 그려지는 Dialog에도 같은 테마가 적용돼요.

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

컴포넌트별 props는 [DESIGN.md §10](./DESIGN.md#10-컴포넌트-스펙-core)에 있어요. 모든 파일에 `"use client"`가 붙어 있어서 Next.js 서버 컴포넌트에서도 바로 import할 수 있어요. 하위 컴포넌트는 `CardHeader`처럼 이름 있는 export로 써요.

## Claude Code에서 쓰기

프로젝트 CLAUDE.md에 추가해요.

```md
@node_modules/@xonic0506/sonic-ui/DESIGN.md
@node_modules/@xonic0506/sonic-ui/AI-RULES.md
```

## 디자인 lint 규칙 (선택)

임의의 값 클래스, Tailwind 기본 팔레트, hex 색을 막는 ESLint flat config 조각을 제공해요. 켜는 것은 쓰는 쪽 설정에서 해요.

```js
// eslint.config.js
import sonicDesign from '@xonic0506/sonic-ui/eslint-design-rules';
export default [/* … */, sonicDesign];
```

## 지원 브라우저

Tailwind v4 기준과 같아요: Chrome 111+, Edge 111+, Safari 16.4+, Firefox 128+. CSS `@layer`와 `@property`를 쓰기 때문이에요.

## 개발

```bash
npm run build       # 토큰 생성 → JS(Vite) → 타입 → CSS(@layer sonic)
npm test            # Vitest
npm run typecheck
npm run playground  # Figma Core 페이지와 비교하는 화면 (build 먼저)
```

운영 규칙은 [CLAUDE.md](./CLAUDE.md)에 있어요.
