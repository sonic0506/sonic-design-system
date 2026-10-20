# Sonic Design System — DESIGN.md

Sonic(`sonic-ui`)의 디자인 규칙이에요. Figma에서 디자인할 때, 그리고 코드를 짤 때 모두 이 문서를 따릅니다.

- 원본: Figma [Sonic Design System](https://www.figma.com/design/XifnZsjqJWJqFmAmrM6p3u). 값이 다르면 Figma가 맞아요.
- 방향: **Cobalt Instrument**. 계기판처럼 정밀하고 촘촘한 화면이에요. 차가운 회색을 바탕으로 쓰고, 행동을 유도하는 곳에만 코발트를 써요.

## 1. 원칙

1. **토큰 밖의 값은 없다.** 색, 간격, radius, 글자 크기는 모두 아래 표에서 고릅니다. 임의의 값(`#3355ff`, `13px`, `p-[7px]`)은 쓰지 않아요.
2. **강조는 한 곳에만.** 한 화면에서 `primary` 버튼은 하나만 둬요. 나머지는 `secondary`나 `ghost`를 씁니다.
3. **숫자는 고정폭.** 수치, ID, 키 값은 `mono` 계열 스타일로 써서 자리를 맞춰요.
4. **그림자 대신 선.** 높낮이는 1px 테두리(`color/border/default`)와 배경 단계(canvas → surface → subtle)로 구분해요. Menu, Popover, Select, Toast처럼 떠 있는 요소도 `bg/surface` + 1px 테두리로 구분하고, 그림자 토큰은 없어요.
5. **움직임은 사용자 행동에 대한 응답만.** 열기, 닫기, hover처럼 사용자가 일으킨 변화에만 모션을 넣고, `prefers-reduced-motion`을 지켜요.

## 2. 이름 규칙

Figma Variable 이름이 그대로 CSS 변수가 돼요. `/`는 `-`로 바꾸고 앞에 `--sn-`를 붙입니다.

| Figma Variable | CSS 변수 | 쓰는 쪽 Tailwind 클래스 | 라이브러리 내부 |
|---|---|---|---|
| `color/bg/primary` | `--sn-color-bg-primary` | `bg-primary` | `sn:bg-primary` |
| `color/text/muted` | `--sn-color-text-muted` | `text-muted` | `sn:text-muted` |
| `color/border/default` | `--sn-color-border-default` | `border-default`, `outline-default` | `sn:border-default` |
| `space/4` | `--sn-space-4` | `p-4`, `gap-4` (1단위 = `space/1` = 4px) | `sn:p-4` |
| `radius/md` | `--sn-radius-md` | `rounded-md` | `sn:rounded-md` |
| 텍스트 스타일 `body` | `--sn-text-body` (+ `--line-height`, `--font-weight`, `--letter-spacing`) | `text-body` | `sn:text-body` |
| 텍스트 스타일 `mono` / `mono-caption` | `--sn-font-mono` | `font-mono text-body` / `font-mono text-caption` | 앞에 `sn:` |
| `duration/fast`, `easing/standard` | `--sn-duration-fast`, `--sn-easing-standard` | `duration-(--sn-duration-fast) ease-standard` | 앞에 `sn:` |

- 쓰는 쪽 클래스는 `@xonic0506/sonic-ui/tailwind.css`를 import해야 생겨요(README 참고). Tailwind가 없는 프로젝트는 `var(--sn-…)`를 직접 써요.
- 간격은 `space/*` 표에 있는 단계(0·1·2·3·4·5·6·7·8·10·12·16)만 써요. `p-9`처럼 표에 없는 단계는 쓰지 않아요.
- 컴포넌트 이름은 PascalCase(`Button`), 속성 이름은 React props와 똑같이 씁니다(`variant`, `size`, `disabled`).
- variant 값은 소문자예요(`primary`, `md`).

## 3. 토큰

### 3.1 색 (Semantic, Light / Dark)

화면에서는 Semantic만 써요. Primitives(`gray/*`, `cobalt/*`, `red/*`)는 Semantic이 참조하는 값일 뿐이라 직접 쓰지 않습니다.

| 토큰 | Light | Dark | 쓰는 곳 |
|---|---|---|---|
| `color/bg/canvas` | gray/50 `#F4F6F8` | gray/950 `#0E1216` | 페이지 바탕 |
| `color/bg/surface` | gray/0 `#FFFFFF` | gray/900 `#161B21` | Card, Dialog, Input 바탕 |
| `color/bg/subtle` | gray/100 `#E6EAEE` | gray/800 `#1E252D` | hover 바탕, 진행 막대 트랙, Avatar 바탕 |
| `color/bg/primary` | cobalt/600 `#2340D0` | cobalt/400 `#6E86FF` | primary 버튼, 진행 막대 |
| `color/bg/primary-hover` | cobalt/700 `#1B33AE` | cobalt/300 `#8C9FFF` | primary hover |
| `color/bg/danger` | red/600 `#C8312B` | red/400 `#F06A5F` | 삭제처럼 되돌릴 수 없는 동작 |
| `color/bg/overlay` | gray/scrim `#0E1216` 50% | 같음 | Dialog backdrop |
| `color/text/default` | gray/950 | gray/100 | 본문, 제목 |
| `color/text/muted` | gray/600 `#5B6672` | gray/400 `#8D99A6` | 보조 설명, caption |
| `color/text/on-primary` | gray/0 | gray/950 | primary 바탕 위 글자 |
| `color/text/on-danger` | gray/0 | gray/950 | danger 바탕 위 글자 |
| `color/text/danger` | red/600 | red/400 | 에러 메시지 |
| `color/border/default` | gray/200 `#D5DBE1` | gray/700 `#2A323B` | 기본 테두리, 구분선 |
| `color/border/strong` | gray/400 | gray/600 | hover 테두리 |
| `color/border/focus` | cobalt/600 | cobalt/400 | 포커스 링 |
| `color/border/danger` | red/600 | red/400 | 에러 상태 Input |
| `color/bg/inverse` | gray/950 | gray/100 | Tooltip, neutral Badge(solid) |
| `color/text/inverse` | gray/0 | gray/950 | inverse 바탕 위 글자 |
| `color/bg/success` | green/600 `#16804F` | green/400 `#3DB882` | success Badge(solid) |
| `color/text/on-success` | gray/0 | gray/950 | success 바탕 위 글자 |
| `color/bg/success-subtle` | green/50 `#EAF7F0` | green/950 `#0B2218` | success Badge(subtle) |
| `color/text/success` | green/700 `#0F6640` | green/300 `#6BD1A0` | 성공 문구, 아이콘 |
| `color/border/success` | green/600 | green/400 | 성공 강조 테두리 |
| `color/bg/warning` | amber/400 `#E3A43A` | amber/400 | warning Badge(solid) |
| `color/text/on-warning` | gray/950 | gray/950 | warning 바탕 위 글자 (amber 위 흰 글자는 대비 부족) |
| `color/bg/warning-subtle` | amber/50 `#FCF5E6` | amber/950 `#24190A` | warning Badge(subtle) |
| `color/text/warning` | amber/700 `#85520A` | amber/300 `#EEC46A` | 주의 문구, 아이콘 |
| `color/border/warning` | amber/600 | amber/400 | 주의 강조 테두리 |
| `color/bg/danger-subtle` | red/50 `#FCEDEC` | red/950 `#2B1311` | danger Badge(subtle) |

글자와 바탕 조합은 모두 WCAG 4.5:1 이상이에요. 토큰을 바꾸면 `npm run check:contrast`로 다시 확인해요(배포 전 검사에도 들어 있어요).

### 3.2 간격 (4px 단위)

| 토큰 | 값 | 토큰 | 값 |
|---|---|---|---|
| `space/0` | 0 | `space/6` | 24 |
| `space/1` | 4 | `space/7` | 28 |
| `space/2` | 8 | `space/8` | 32 |
| `space/3` | 12 | `space/10` | 40 |
| `space/4` | 16 | `space/12` | 48 |
| `space/5` | 20 | `space/16` | 64 |

컨트롤 높이와 아바타 크기도 이 표에서 가져와요: sm 28(`space/7`) · md 32(`space/8`) · lg 40(`space/10`).

### 3.3 Radius / Stroke

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `radius/sm` | 2 | 작은 표시(배지, 체크박스) |
| `radius/md` | 4 | Button, Input |
| `radius/lg` | 6 | Card, Dialog |
| `radius/full` | 9999 | Avatar, 진행 막대 |
| `stroke/default` | 1 | 모든 테두리 |
| `stroke/focus` | 2 | 포커스 링 (offset 2px) |

### 3.4 텍스트 스타일 (IBM Plex Sans / IBM Plex Mono)

| 스타일 | 크기/행간 | 굵기 | 자간 | 쓰는 곳 |
|---|---|---|---|---|
| `display` | 32/40 | 600 | −2% | 페이지 제목, 핵심 수치 |
| `title` | 20/28 | 600 | −1% | 섹션, Card, Dialog 제목 |
| `body` | 14/20 | 400 | 0 | 본문 |
| `body-strong` | 14/20 | 500 | 0 | 버튼(md/lg), 강조 본문 |
| `label` | 13/16 | 500 | 0 | 폼 라벨, 버튼(sm) |
| `caption` | 12/16 | 400 | 0 | 보조 설명, 에러 메시지 |
| `mono` | 14/20 | 400 | 0 | 수치, 코드 |
| `mono-caption` | 12/16 | 400 | 0 | 작은 ID, 키 값 |

### 3.5 모션

| 토큰 | 값 |
|---|---|
| `duration/fast` | 120ms (hover, 색 전환) |
| `duration/normal` | 200ms (Dialog 열기/닫기) |
| `easing/standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `duration/loop` | 1000ms (반복 애니메이션: Skeleton 깜빡임, 로딩 스피너 회전) |

반복 애니메이션은 `prefers-reduced-motion`이면 멈춰요.

### 3.6 아이콘 (Lucide)

아이콘은 [Lucide](https://lucide.dev)만 써요. 쓰는 쪽 프로젝트에서 `lucide-react`를 설치해요. Figma에는 Sonic이 쓰는 아이콘만 `Icon / <이름>` 컴포넌트로 있어요(Foundations › 04 Icon).

| 항목 | 규칙 |
|---|---|
| 이름 | Lucide 이름 그대로. Figma `Icon / chevron-down` = 코드 `<ChevronDown />` |
| 크기 | `space/4` 16 (버튼 sm·md·icon-sm·icon-md, 입력란 안, 본문 옆) · `space/5` 20 (버튼 lg·icon-lg) · `space/6` 24 (빈 상태처럼 아이콘이 주인공일 때) |
| 선 두께 | Lucide 기본 2 (24 기준). 크기에 비례해 줄어요. `absoluteStrokeWidth`는 쓰지 않아요. Figma에서는 Scale(K)로 줄여요 |
| 색 | `currentColor`. 주변 글자색 토큰을 따라가요. 아이콘에만 다른 색을 줄 때도 text 토큰만 써요 |
| 접근성 | 글자와 함께 쓰면 장식이라 숨겨요(lucide-react 기본 `aria-hidden`). 아이콘만 있는 버튼은 `aria-label`을 꼭 달아요 |
| 추가 | 새 아이콘이 필요하면 Lucide에서 가져와 Figma `Icon /` 컴포넌트로 추가하고, 이 표 규칙을 따라요. 다른 아이콘 세트는 섞지 않아요 |

Button 안에 넣은 아이콘은 크기가 자동으로 맞춰져요(sm·md 16, lg 20). 아이콘과 글자 사이 간격은 `space/2`예요. 아이콘은 글자 앞(left), 뒤(right), 양쪽(both)에 둘 수 있고, 뒤쪽 아이콘은 펼침(chevron)이나 외부 링크처럼 결과를 알려 줄 때만 써요. 아이콘만 있는 버튼은 `size="icon-*"`를 써요(§10 Button).

```tsx
import { Plus } from 'lucide-react';
<Button><Plus />API 키 만들기</Button>
<Button size="icon-md" variant="ghost" aria-label="더 보기"><Ellipsis /></Button>
```

## 4. Auto layout 규칙 (Figma)

- 자식이 둘 이상인 프레임은 모두 auto layout을 씁니다. 절대 좌표 배치는 쓰지 않아요.
- padding과 gap에는 반드시 `space/*` 변수를 바인딩해요. 숫자를 직접 입력하지 않습니다.
- 크기 규칙: 텍스트는 Hug, 입력란처럼 늘어나야 하는 요소는 Fill, 컨트롤 높이는 Fixed(`space/7`·`8`·`10`).
- 레이어 구조는 코드 DOM 구조와 같게 맞춰요. Card → Header / Body / Footer 순서.
- 0인 padding, gap도 `space/0`에 바인딩해요. 테두리 두께는 `stroke/default`에 바인딩하고 안쪽 정렬(Inside)로 둡니다.
- 화면 프레임은 Light 모드로 그리고, 마지막에 프레임을 복제해 Dark 모드(Semantic 컬렉션 mode 전환)로 한 번 확인해요.

### 간격 기본값

| 위치 | 값 |
|---|---|
| 페이지 콘텐츠 | 최대 너비 960, 가운데 정렬. 좌우 padding `space/4`(960 안쪽), 위아래 padding `space/10` |
| 사이드 내비가 있는 화면 | 헤더와 사이드 내비(너비 240)는 화면 전체를 쓰고, 960 규칙은 본문 영역에만 적용 |
| 섹션 사이 | `space/6` |
| Card 안쪽 padding / Header·Body·Footer 사이 | `space/5` / `space/4` |
| 폼 필드 사이 | `space/4` |
| 라벨 ↔ 입력란 ↔ 도움말·에러 문구 | `space/2` |
| 버튼 묶음 사이 | `space/2` |
| 목록 항목 안 (아바타 ↔ 텍스트) | `space/3` |
| 제목 ↔ 바로 아래 설명 | `space/1` |

- 버튼 묶음은 오른쪽 정렬이고, 보조 버튼이 왼쪽, primary가 맨 오른쪽이에요. Dialog Footer도 같아요.
- 에러 상태: 입력란 테두리를 `color/border/danger`로 바꾸고, 입력란 바로 아래(설명 자리)에 `caption` + `color/text/danger`로 고치는 방법을 씁니다. 설명은 숨겨요. 라벨 색은 바꾸지 않아요. 이 묶음은 **Field 컴포넌트**가 처리해요(§10).
- 문구는 한국어 해요체예요. 취소 버튼은 "취소"로 충분해요. 무엇을 취소하는지는 바로 옆 primary 버튼 문구가 알려 줘요.
- Avatar 이니셜은 이름에서 1~2글자를 써요(한글은 이름 첫 글자, 영문은 이름·성 첫 글자).

## 5. 해야 할 것 / 하지 말아야 할 것

| 해야 할 것 | 하지 말아야 할 것 |
|---|---|
| Semantic 토큰과 텍스트 스타일만 쓰기 | hex 값, Primitives, 임의 px 직접 쓰기 |
| sonic-ui 컴포넌트를 조합하기 | 같은 역할의 버튼, 입력란을 새로 그리기 |
| 버튼 문구는 동작 그대로 쓰기("API 키 만들기", "저장") | "확인", "Submit"처럼 모호한 문구, 문구 끝에 화살표 붙이기 |
| 에러 문구는 무엇이 잘못됐고 어떻게 고치는지 쓰기 | "오류가 발생했습니다"만 쓰기 |
| light/dark 둘 다 확인하기 | 한 모드에서만 보고 끝내기 |
| 포커스 링(`color/border/focus`, 2px, offset 2px) 유지하기 | `outline: none`으로 포커스 표시 지우기 |
| 문장형 대소문자(sentence case) 쓰기 | 라벨을 전부 대문자로 쓰기 |

## 6. 컴포넌트 구조 (Base UI)

sonic-ui는 [Base UI](https://base-ui.com) 위에 만들어요. 겹쳐 뜨는 컴포넌트는 Base UI 구조를 그대로 따릅니다.

| 부분 | 역할 |
|---|---|
| `Trigger` | 여는 버튼 |
| `Backdrop` | 뒤 화면을 덮는 막 (`color/bg/overlay`) |
| `Positioner` | 위치를 잡는 래퍼 (Popover, Menu에서 사용) |
| `Popup` | 실제 내용 상자 (`color/bg/surface`, `radius/lg`) |

Figma에서도 레이어 이름을 이 이름으로 맞춰요. 예: `Dialog / Backdrop`, `Dialog / Popup`.

**상태 variant 이름은 Base UI의 data-\* 속성 이름을 씁니다.**

| Figma variant | 코드 |
|---|---|
| `open=true` | `[data-open]` |
| `checked=true` | `[data-checked]` |
| `disabled=true` | `[data-disabled]` / `disabled` prop |
| `highlighted=true` | `[data-highlighted]` (키보드나 hover로 선택된 항목) |
| `invalid=true` | `[data-invalid]` (Base UI Field) |
| `selected=true` | `[data-selected]` (Select 항목) |
| `checked=indeterminate` | `indeterminate` prop, `[data-indeterminate]` (Checkbox) |

hover, focus는 **컴포넌트 variant로 만들지 않아요.** React prop이 아니라 브라우저가 정하는 상태라서예요.

| 상태 | Figma | 코드 |
|---|---|---|
| hover | Core 문서 "Interaction states" 매트릭스에 인스턴스 오버라이드로 그림 | `:hover` (disabled일 때는 적용 안 함) |
| focus | 같은 매트릭스. 2px `border/focus` 링, 간격 2px. invalid Input은 `border/danger` 링 | `:focus-visible` → `outline 2px`, `outline-offset 2px` (Tab, ToggleGroup 항목만 안쪽 −2px). 포커스 링을 그리는 요소에는 `outline-none`을 같이 쓰지 않아요(Tailwind v4에서 링이 사라져요) |
| press | 그리지 않음 | 구현 안 함 (v0.1) |

상태별 토큰은 §10 컴포넌트 스펙 표가 기준이에요. 화면 디자인에서는 hover, focus를 따로 그리지 않아요. 컴포넌트가 자동으로 처리해요.

## 7. 3계층 판단 기준

| 계층 | 위치 | 기준 | 예 |
|---|---|---|---|
| **Core** | sonic-ui `src/components/` | 더 나눌 수 없고, 도메인을 전혀 모름 | Button, Input, Textarea, Checkbox, RadioGroup, Switch, Select, Text, Card, Avatar, Dialog, AlertDialog, Menu, Popover, Tooltip, Tabs, Separator, Toast, Badge, Progress, Link, Table, ToggleGroup, Accordion, Field, Skeleton, EmptyState, ErrorState |
| **Pattern** | sonic-ui `src/patterns/` | Core 조합이고 도메인을 모르지만, **두 프로젝트 이상에서 같은 형태로 복사됨** | (아직 없음) |
| **Domain** | 각 프로젝트 | 도메인 타입, API, 비즈니스 로직 중 하나라도 앎 | `UserProfileCard`, `ApiKeyList` |

예외: EmptyState와 ErrorState는 Core 조합이라 원래는 Pattern 후보지만, §8 규칙이 모든 데이터 화면에 요구하는 **시스템 컴포넌트**라서 Core에 둬요.

판단 순서:
1. props에 도메인 타입(`User`, `Order`)이 들어가나요? → **Domain**
2. 데이터를 직접 불러오거나 비즈니스 규칙이 있나요? → **Domain**
3. 두 번째 프로젝트에서 같은 형태를 복사하게 됐나요? → **Pattern으로 승격**
4. 아직 한 프로젝트에서만 쓰나요? → 그 프로젝트의 Domain에 둡니다

## 8. 데이터 화면의 4가지 상태

데이터를 보여 주는 화면은 Figma에서 **4가지 상태를 모두 그려야** 개발로 넘어가요. 각 상태는 아래 컴포넌트로 그려요(예: Figma Playground › `Sample / API keys — 4 states`).

| 상태 | 그릴 것 | 컴포넌트 |
|---|---|---|
| 정상 | 실제와 비슷한 양의 데이터 | 화면 구성 그대로 |
| 로딩 | 정상 화면과 **같은 배치**에 자리만 표시 | `Skeleton` (text · rect · circle) |
| 빈 상태 | 무엇이 없는지, 다음에 할 행동 하나 | `EmptyState` |
| 에러 | 무엇이 실패했는지, 다시 시도할 방법 | `ErrorState` |

저장처럼 사용자가 일으킨 동작이 진행 중일 때는 화면 전체가 아니라 그 버튼에 `loading`을 켜요.

## 9. frontend-design 사용 규칙

- **디자인 시스템을 만들 때**(이 저장소): frontend-design으로 방향을 탐색할 수 있어요. 결과물은 `explorations/`에만 두고 라이브러리에 넣지 않습니다.
- **프로젝트에서 쓸 때**: DESIGN.md, sonic-ui 컴포넌트, `sn` 토큰만 씁니다. frontend-design의 새 색, 새 폰트, 임의의 값 제안은 쓰지 않아요. 레이아웃과 문구 판단에만 참고해요.
- **컴포넌트를 구현할 때**: Figma를 그대로 따르고 frontend-design은 쓰지 않습니다.

## 10. 컴포넌트 스펙 (Core)

Figma Core 페이지의 컴포넌트 속성 이름 = React props 이름이에요. 모든 컴포넌트는 `className`을 받고, 넘긴 클래스가 기본 스타일을 덮어써요.

하위 컴포넌트는 `Card.Header`가 아니라 `CardHeader`처럼 **이름 있는 export**로만 제공해요. Next.js 서버 컴포넌트에서는 `"use client"` 모듈의 export에 점(`.`)으로 접근할 수 없기 때문이에요.

### Button

`<Button variant="primary" size="md" disabled>저장</Button>`

| prop | 값 | 기본값 |
|---|---|---|
| `variant` | `primary` · `secondary` · `ghost` · `danger` | `primary` |
| `size` | `sm` · `md` · `lg` · `icon-sm` · `icon-md` · `icon-lg` | `md` |
| `disabled` | boolean | `false` |
| `children` | 버튼 문구. 아이콘은 문구 앞뒤에 lucide 컴포넌트로 넣음 | — |
| `loading` | boolean. 스피너 + 클릭 막기 + `aria-busy` | `false` |
| `aria-label` | icon 크기일 때 **필수** (타입으로 강제) | — |

| | sm | md | lg |
|---|---|---|---|
| 높이 | `space/7` (28) | `space/8` (32) | `space/10` (40) |
| 좌우 padding | `space/2` | `space/3` | `space/4` |
| 글자 | `label` | `body-strong` | `body-strong` |
| 아이콘 | 16 | 16 | 20 |

| | icon-sm | icon-md | icon-lg |
|---|---|---|---|
| 크기 (정사각형) | `space/7` (28) | `space/8` (32) | `space/10` (40) |
| padding | 0 | 0 | 0 |
| 아이콘 | 16 | 16 | 20 |

| variant | 바탕 | 글자 | 테두리 | hover |
|---|---|---|---|---|
| primary | `bg/primary` | `text/on-primary` | 없음 | `bg/primary-hover` |
| secondary | `bg/surface` | `text/default` | `border/default` | `bg/subtle` |
| ghost | 없음 | `text/default` | 없음 | `bg/subtle` |
| danger | `bg/danger` | `text/on-danger` | 없음 | 없음 (v0.1에는 danger hover 토큰이 없음) |

공통: radius `radius/md`, 아이콘과 글자 사이 `space/2`, disabled는 `opacity/disabled`(45%), focus는 2px `border/focus` + offset 2px, 색 전환은 `duration/fast`.

### Input

`<Input placeholder="예: production" invalid disabled />`

| prop | 값 |
|---|---|
| `invalid` | boolean. Base UI Field의 `[data-invalid]`와 같음 |
| `disabled` | boolean |
| 그 외 | 기본 `<input>` 속성 전부 |

높이 `space/8`, 좌우 padding `space/3`, radius `radius/md`, 바탕 `bg/surface`, 테두리 `border/default`(hover `border/strong`, invalid `border/danger`), 입력값 `body` + `text/default`, placeholder `text/muted`, 너비는 부모를 채움.

focus 링은 2px, 간격 2px이고, 색은 기본 `border/focus`, invalid일 때 `border/danger`예요. 에러 상태에서 파란 링이 뜨면 상태 신호가 섞이기 때문이에요.

### Text

`<Text variant="caption" tone="muted" as="p">…</Text>`

| prop | 값 | 기본값 |
|---|---|---|
| `variant` | 텍스트 스타일 8개 (`display` … `mono-caption`) | `body` |
| `tone` | `default` · `muted` · `danger` | `default` |
| `as` | 렌더할 태그 (`p`, `span`, `div`, `h1`~`h6`, `label`, `strong`, `code`) | `span` |

### Card

```tsx
<Card>
  <CardHeader><CardTitle>…</CardTitle><CardDescription>…</CardDescription></CardHeader>
  <CardBody>…</CardBody>
  <CardFooter>…</CardFooter>
</Card>
```

바탕 `bg/surface`, 테두리 `border/default` 1px, radius `radius/lg`, padding `space/5`, 영역 사이 `space/4`. Title은 `title`, Description은 `body` + `text/muted`, Header 안 간격 `space/1`. Footer는 오른쪽 정렬, 버튼 사이 `space/2`.

### Avatar

`<Avatar size="md" src="…" alt="박형규" fallback="HP" />`

| size | 크기 | fallback 글자 |
|---|---|---|
| `sm` | `space/6` (24) | `caption` |
| `md` | `space/8` (32) | `label` |
| `lg` | `space/10` (40) | `body-strong` |

radius `radius/full`, 바탕 `bg/subtle`, fallback 글자 `text/muted`. 이미지를 불러오지 못하면 fallback을 보여 줘요(Base UI Avatar).

### Dialog

```tsx
<Dialog>
  <DialogTrigger render={<Button />}>API 키 만들기</DialogTrigger>
  <DialogPopup>
    <DialogTitle>API 키 만들기</DialogTitle>
    <DialogDescription>키는 만든 직후 한 번만 보여 줘요.</DialogDescription>
    …
    <DialogFooter><DialogClose render={<Button variant="secondary" />}>취소</DialogClose>…</DialogFooter>
  </DialogPopup>
</Dialog>
```

- `DialogPopup`이 Portal과 Backdrop을 함께 그려요. 쓰는 쪽에서 Backdrop을 따로 넣지 않아요.
- Backdrop `bg/overlay`. Popup 너비 440(화면이 좁으면 좌우 `space/4`를 뺀 너비), padding `space/6`, 영역 사이 `space/4`, 바탕 `bg/surface`, 테두리 1px, radius `radius/lg`.
- 열기/닫기: `duration/normal` + `easing/standard`. `[data-starting-style]`과 `[data-ending-style]`에서 opacity 0, scale 0.98. Backdrop은 opacity만 바꿔요.
- `open`, `onOpenChange`로 제어할 수 있어요. Esc와 바깥 클릭으로 닫혀요.

#### 트리거가 밖에 있을 때 (Dialog, AlertDialog 공통)

`DialogTrigger`를 쓸 수 없으면 **제어 모드**로 열어요. Trigger 없이 `open`과 `onOpenChange`만 넘겨요.

```tsx
// 1) 다른 곳의 버튼, Menu 항목에서 열기
const [confirm, setConfirm] = useState(false);
<Menu>
  <MenuTrigger render={<Button size="icon-md" variant="ghost" aria-label="더 보기" />}><Ellipsis /></MenuTrigger>
  <MenuPopup><MenuItem tone="danger" onClick={() => setConfirm(true)}><Trash2 />삭제</MenuItem></MenuPopup>
</Menu>
<AlertDialog open={confirm} onOpenChange={setConfirm}>
  <AlertDialogPopup>…</AlertDialogPopup>
</AlertDialog>

// 2) 코드로 열기 (예: API 에러 뒤). 닫힌 뒤 포커스가 갈 곳을 finalFocus로 정해요
const retryRef = useRef<HTMLButtonElement>(null);
<Dialog open={hasError} onOpenChange={setHasError}>
  <DialogPopup finalFocus={retryRef}>…</DialogPopup>
</Dialog>
```

- 닫히면 포커스는 **열기 전에 포커스가 있던 요소**로 돌아가요(바깥 버튼, Menu 트리거). 사용자 동작 없이 코드로 열었다면 돌아갈 곳이 없으니 `finalFocus`를 꼭 지정해요.
- 열릴 때 포커스는 팝업 안 첫 포커스 요소예요. 다른 곳이 맞으면 `initialFocus`로 정해요(예: AlertDialog에서 위험한 확인 버튼 대신 취소 버튼).
- 확인 동작이 끝나면 `onOpenChange(false)` 대신 상태를 직접 `false`로 바꿔 닫아요.

### Button loading

`<Button loading>저장</Button>`

- 왼쪽에 `loader-circle`이 `duration/loop`로 회전하고, 클릭이 막혀요. 포커스는 유지되고 `aria-busy="true"`, `data-loading`이 붙어요.
- 로딩 중에는 왼쪽 아이콘을 넣지 않아요(스피너가 그 자리를 써요). icon 버튼은 아이콘 자리에 스피너만 보여요.

### Field

```tsx
<Field label="이메일" description="로그인할 때 써요." error="https://로 시작하는 주소를 입력하세요." invalid>
  <Input />
</Field>
```

| prop | 값 |
|---|---|
| `label` | 라벨 문구 (필수) |
| `description` | 설명 문구 (선택) |
| `error` | 에러 문구. `invalid`일 때만 보이고, 그때는 **설명 자리를 대신해요** |
| `invalid`, `disabled` | boolean. 안의 Input에 자동으로 전달돼요 (Base UI Field) |
| `children` | 입력 컨트롤 (지금은 `Input`) |

간격: 라벨 ↔ 입력 ↔ 설명·에러 `space/2`. 라벨 `label` + `text/default`(invalid여도 그대로), 설명 `caption` + `text/muted`, 에러 `caption` + `text/danger`. **Field 안의 Input에는 `invalid`를 따로 주지 않아요.** 입력 컨트롤과 설명 또는 에러는 `aria-describedby`로 연결돼요.

에러는 설명과 함께 보이지 않고 **설명을 대신해요**(Material, Carbon, Spectrum과 같은 방식). 아래 줄이 늘어나지 않아 레이아웃이 밀리지 않고, 화면 낭독기도 에러 하나만 읽어요. 설명에 있던 형식 안내는 에러 문구가 대신 전해야 하니, 에러 문구에는 고치는 방법을 꼭 써요(§5).

### Skeleton

`<Skeleton shape="text" className="w-40" />`

| shape | 기본 크기 | radius |
|---|---|---|
| `text` | 높이 `space/3` (12, body 한 줄 자리), 너비 100% | `radius/sm` |
| `rect` | 높이 `space/16` (64), 너비 100% | `radius/md` |
| `circle` | `space/8` (32) | `radius/full` |

바탕 `bg/subtle`, opacity 1 ↔ 0.5를 `duration/loop`로 반복해요. 크기는 쓰는 곳에서 `className`으로 정하고, 스크린 리더에는 숨겨요(`aria-hidden`). 로딩 영역 전체에는 `aria-busy`를 둬요.

### EmptyState / ErrorState

```tsx
<EmptyState icon={<Inbox />} title="API 키가 없어요" description="키를 만들면 여기에서 사용량을 볼 수 있어요." action={<Button>API 키 만들기</Button>} />
<ErrorState title="API 키를 불러오지 못했어요" description="네트워크 연결을 확인하고 다시 시도해 주세요." onRetry={refetch} />
```

| | EmptyState | ErrorState |
|---|---|---|
| 아이콘 | `icon` prop (24, `text/muted`, `bg/subtle` 원 `space/12`) | 기본 `triangle-alert` (`text/danger`), `icon`으로 바꿀 수 있음 |
| 제목 / 설명 | `body-strong` / `body` + `text/muted`, 가운데 정렬 | 같음 |
| 행동 | `action` (보통 primary Button 하나) | `onRetry`가 있으면 secondary Button + `refresh-cw`, 문구 `retryLabel`(기본 "다시 시도") |
| 간격 | 요소 사이 `space/4`, 위아래 `space/12`, 좌우 `space/6` | 같음 |

에러 문구는 사과하지 않고, 무엇이 실패했고 어떻게 하면 되는지 써요.

### Textarea

`<Textarea rows={3} invalid disabled />` — Input과 같은 테두리·hover·focus·invalid 규칙이에요. 최소 높이 80(약 3줄), padding `space/3`·`space/2`, 세로로만 크기를 바꿀 수 있어요. Field 안에서 라벨·에러와 함께 써요.

### Checkbox / CheckboxGroup

```tsx
<Checkbox checked={on} onCheckedChange={setOn}>알림 받기</Checkbox>
<CheckboxGroup label="알림 채널" value={channels} onValueChange={setChannels}>
  <Checkbox value="email">이메일</Checkbox>
  <Checkbox value="push">푸시</Checkbox>
</CheckboxGroup>
```

- 여러 개를 고를 수 있을 때 써요. 일부만 선택된 상위 항목은 `indeterminate`예요(화면 낭독기에는 "mixed").
- 상자 16(`space/4`), `radius/sm`. 해제: `bg/surface` + `border/strong`, 선택: `bg/primary` + check 12(`text/on-primary`). 라벨 `body`, 상자와 간격 `space/2`.
- 그룹은 `fieldset` + `legend`(`label` 스타일)로 묶고, 항목 사이 `space/2`, legend와 `space/3`이에요.

### RadioGroup

```tsx
<RadioGroup label="결제 주기" value={cycle} onValueChange={setCycle}>
  <Radio value="month">월간 결제</Radio>
  <Radio value="year">연간 결제</Radio>
</RadioGroup>
```

하나만 고를 때 써요. 화살표 키로 이동하면 바로 선택돼요. 원 16(`space/4`), 선택 `bg/primary` + 점 8(`space/2`). 항목이 5개를 넘으면 Select를 써요.

### Switch

`<Switch checked={on} onCheckedChange={setOn}>이메일 알림</Switch>` — 누르는 즉시 적용되는 설정에만 써요. 저장 버튼을 눌러야 반영되는 폼에서는 Checkbox를 써요. 트랙 28×16(`space/7`·`space/4`), 손잡이 12(`space/3`), 해제 `bg/subtle` + `border/strong`, 켜짐 `bg/primary`. 손잡이는 `duration/fast`로 움직여요.

### Select

```tsx
<Select options={plans} value={plan} onValueChange={setPlan} placeholder="요금제 선택" />          // 단일: string | null
<Select multiple options={tags} value={selected} onValueChange={setSelected} placeholder="태그 선택" />  // 다중: string[]
```

| prop | 값 |
|---|---|
| `options` | `{ value, label, disabled? }[]` |
| `multiple` | 다중 선택. 켜면 `value`·`onValueChange`가 배열이에요(타입으로 강제) |
| `placeholder`, `invalid`, `disabled`, `name`, `aria-label` | Field 안에서는 라벨과 invalid가 자동으로 연결돼요 |

| | 단일 | 다중 |
|---|---|---|
| 항목 | 선택 시 오른쪽 `check` | 왼쪽 체크박스 상자 |
| 고른 뒤 | 팝업이 닫혀요 | 열린 채로 여러 개를 골라요 |
| 트리거 | 고른 항목 이름 | 쉼표로 이어 쓰고, 넘치면 말줄임(…) |

- 트리거는 Input과 같은 크기·테두리예요(높이 32). 오른쪽 `chevron-down` 16(`text/muted`), 열리면 180° 돌고 테두리가 `border/focus`가 돼요.
- 팝업은 트리거 아래 4px, 트리거 너비 이상이에요. 떠 있는 요소 공통 스타일: `bg/surface` + 1px `border/default` + `radius/lg`, 안쪽 `space/1`, 그림자 없음.
- 항목은 높이 32, padding `space/2`, 키보드나 마우스로 가리키면(`highlighted`) `bg/subtle`이에요.
- 고를 항목이 5개 이상이거나 화면이 좁을 때 써요. 그보다 적으면 RadioGroup이 한눈에 보여요.

### AlertDialog

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="danger" />}>삭제</AlertDialogTrigger>
  <AlertDialogPopup>
    <AlertDialogTitle>API 키를 삭제할까요?</AlertDialogTitle>
    <AlertDialogDescription>이 키로 보내는 요청이 바로 실패해요. 삭제하면 되돌릴 수 없어요.</AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogClose render={<Button variant="secondary" />}>취소</AlertDialogClose>
      <Button variant="danger" onClick={remove}>삭제</Button>
    </AlertDialogFooter>
  </AlertDialogPopup>
</AlertDialog>
```

되돌릴 수 없는 동작 전에만 써요. Dialog와 같은 모양(Backdrop, Popup 440, padding `space/6`)이고, 바깥을 눌러도 닫히지 않아요(Esc는 닫혀요). 제목은 질문, 설명은 결과, 확인 버튼은 동작 이름 그대로(`danger`)예요.

### Menu

```tsx
<Menu>
  <MenuTrigger render={<Button size="icon-md" variant="ghost" aria-label="더 보기" />}><Ellipsis /></MenuTrigger>
  <MenuPopup>
    <MenuItem onClick={rename}><Pencil />이름 바꾸기</MenuItem>
    <MenuSeparator />
    <MenuItem tone="danger" onClick={confirmDelete}><Trash2 />삭제</MenuItem>
  </MenuPopup>
</Menu>
```

행이나 카드에 딸린 동작을 묶어요. 팝업은 떠 있는 요소 공통 스타일(§10 Select와 같음), 트리거 아래 4px·시작 정렬, 최소 너비 192. 항목 높이 32, 아이콘 16, `highlighted`면 `bg/subtle`. 위험한 동작은 맨 아래 구분선 뒤에 `tone="danger"`(`text/danger`)로 두고, 실행 전에 AlertDialog로 확인해요. 화살표로 이동, Enter로 실행하면 닫혀요.

### Popover

`<Popover><PopoverTrigger render={<Button variant="secondary" />}>공유</PopoverTrigger><PopoverPopup><PopoverTitle>…</PopoverTitle><PopoverDescription>…</PopoverDescription>…</PopoverPopup></Popover>`

대상 가까이에 짧은 내용이나 간단한 입력을 띄울 때 써요. 너비 320, padding `space/4`, 영역 사이 `space/3`, 제목 `body-strong`, 설명 `caption` + `text/muted`, 대상에서 8px. 확인이 필요한 결정은 Dialog, 목록형 동작은 Menu를 써요.

### Tooltip

`<Tooltip content="설정"><Button size="icon-md" variant="ghost" aria-label="설정"><Settings /></Button></Tooltip>`

아이콘만 있는 버튼의 이름을 보여 줘요. `bg/inverse` + `text/inverse`, `caption`, padding `space/2`·`space/1`, `radius/md`, 대상에서 4px. 마우스는 600ms 뒤, 키보드 포커스는 바로 보여요. 중요한 정보나 클릭할 요소는 넣지 않아요(Tooltip이 있어도 `aria-label`은 따로 달아요).

### Tabs

```tsx
<Tabs defaultValue="overview">
  <TabsList><Tab value="overview">개요</Tab><Tab value="usage">사용량</Tab></TabsList>
  <TabsPanel value="overview">…</TabsPanel>
  <TabsPanel value="usage">…</TabsPanel>
</Tabs>
```

같은 대상의 다른 보기를 오갈 때만 써요(페이지 이동 링크에는 쓰지 않아요). 탭 높이 32, padding `space/3`, `body-strong`. 선택 `text/default`, 나머지 `text/muted`(hover 시 `text/default`). 목록 아래 1px `border/default`, 선택 표시 막대 2px `bg/primary`가 `duration/normal`로 움직여요. 목록과 패널 사이 `space/4`예요.

키보드: 기본은 화살표 키로 이동하면 **바로 탭이 바뀌어요**(`activateOnFocus`, 기본 `true`). 탭을 바꿀 때 무거운 내용을 불러온다면 `<TabsList activateOnFocus={false}>`로 화살표는 이동만, Enter·Space로 전환하게 해요. 끝에서 처음으로 돌아가는 `loopFocus`도 기본 `true`예요. 키보드 조작 자체를 끄는 옵션은 없어요. 포커스 링은 탭끼리 겹치지 않도록 탭 **안쪽**(offset −2px)에 그려요. 패널(`TabsPanel`)은 Tab 키로 들어갈 수 있어서(WAI-ARIA Tabs 패턴), 키보드 포커스일 때 패널 **바깥**에 같은 2px 링(offset 2px)을 그려요. 마우스로 누를 때는 보이지 않아요(Figma › 10 Navigation › Tabs › Focus).

### Separator

`<Separator orientation="horizontal" />` — 1px `border/default`. 관련 없는 묶음 사이를 나눌 때만 쓰고, 카드 안 영역이나 목록 행은 간격으로 먼저 구분해요.

### Toast

```tsx
// 앱 최상단에 한 번 (Next.js는 layout.tsx). 알림 상자를 화면 오른쪽 아래에 그려요
<ToastProvider>{children}</ToastProvider>

// 클라이언트 컴포넌트 어디서든
const toast = useToast();
toast.add({ title: 'API 키를 만들었어요', description: '키는 지금 한 번만 보여 줘요.', tone: 'success' });
```

| `add` 옵션 | 값 | 기본값 |
|---|---|---|
| `title` | 결과 한 줄 (필수) | — |
| `description` | 덧붙일 설명 | — |
| `tone` | `neutral` · `success` · `warning` · `danger` | `neutral` |
| `timeout` | 사라지기까지 ms. `0`이면 직접 닫을 때까지 남아요 | 5000 |

- 사용자 동작의 결과를 잠깐 알려 줄 때 써요. 되돌릴 수 없는 동작의 확인은 AlertDialog, 화면을 채우는 실패는 ErrorState를 써요.
- 너비 360(좁은 화면은 좌우 `space/4`를 뺀 너비), 화면 가장자리에서 `space/4`, 알림 사이 `space/2`. 최대 3개까지 보이고 오래된 것부터 가려져요.
- 상자: 떠 있는 요소 공통 스타일(`bg/surface` + 1px `border/default` + `radius/lg`, 그림자 없음), padding·간격 `space/3`.
- 아이콘 16: neutral `info`(`text/muted`) · success `circle-check`(`text/success`) · warning `triangle-alert`(`text/warning`) · danger `circle-alert`(`text/danger`). 제목 `body-strong`, 설명 `caption` + `text/muted`, 오른쪽에 닫기(ghost `icon-sm`, `x`, "알림 닫기").
- 마우스를 올리거나 포커스하면 시간이 멈춰요. 들어오고 나갈 때 opacity와 위치(`space/2`)가 `duration/normal`로 바뀌어요.
- 화면 낭독기: 보통은 차례가 오면 읽고, `danger`는 바로 읽어요. 알림은 F6으로 이동할 수 있어요.
- `useToast`는 클라이언트 컴포넌트에서만 써요(`ToastProvider` 안).

### Badge

`<Badge tone="success" variant="subtle">활성</Badge>`

| prop | 값 | 기본값 |
|---|---|---|
| `tone` | `neutral` · `success` · `warning` · `danger` | `neutral` |
| `variant` | `subtle` · `solid` | `subtle` |

| | subtle | solid |
|---|---|---|
| neutral | `bg/subtle` + `text/default` | `bg/inverse` + `text/inverse` |
| success | `bg/success-subtle` + `text/success` | `bg/success` + `text/on-success` |
| warning | `bg/warning-subtle` + `text/warning` | `bg/warning` + `text/on-warning` |
| danger | `bg/danger-subtle` + `text/danger` | `bg/danger` + `text/on-danger` |

높이 20(`space/5`), 좌우 `space/2`, `label`, `radius/sm`. 상태를 짧은 낱말로 표시해요. 목록과 표에서는 subtle을, 꼭 눈에 띄어야 하는 한 곳에만 solid를 써요. 누를 수 없는 표시라 버튼처럼 쓰지 않아요.

### Progress

`<Progress value={45} label="내보내는 중" />`

| prop | 값 |
|---|---|
| `value` | 현재 값 (필수) |
| `max` | 최댓값 (기본 100) |
| `label` | 라벨 문구. 없으면 `aria-label`이 필수예요 (타입으로 강제) |

라벨 `label` + `text/default`, 오른쪽에 백분율 `mono-caption` + `text/muted`, 막대와 사이 `space/2`. 트랙 높이 4(`space/1`) `bg/subtle` `radius/full`, 채움 `bg/primary`이 `duration/normal`로 늘어나요. 끝이 정해진 작업(업로드, 내보내기)에만 써요. 끝을 알 수 없는 기다림은 Button `loading`이나 Skeleton을 써요.

### Link

```tsx
<Link href="/docs">DESIGN.md 보기</Link>
<Link href="https://base-ui.com" external>Base UI 문서</Link>
<Link render={<NextLink href="/docs" />}>문서</Link>   // Next.js Link와 함께
```

| prop | 값 |
|---|---|
| `href` | 이동할 주소 |
| `external` | 새 탭으로 열고(`rel="noopener noreferrer"`) 오른쪽에 `external-link` 아이콘을 붙여요 |
| `render` | 다른 링크 컴포넌트로 렌더링 (예: Next.js `Link`) |

다른 페이지나 문서로 **이동**할 때 써요. 동작을 실행하면 Button을 써요. 글자 크기는 부모를 따르고, 색은 `text/default` + 밑줄(offset 2px)이에요. 강조는 한 곳에만 쓰는 원칙(§1)에 따라 링크에 코발트를 쓰지 않아요. hover는 `text/muted`, 포커스 링은 공통 규칙(2px, offset 2px)이에요. 외부 링크 아이콘은 16, 글자와 간격 `space/1`이에요.

### Table

```tsx
<Table>
  <TableHeader>
    <TableRow><TableHead>이름</TableHead><TableHead align="end">요청 수</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>production</TableCell><TableCell align="end">12,480</TableCell></TableRow>
  </TableBody>
</Table>
```

| prop | 값 |
|---|---|
| `TableHead`, `TableCell`의 `align` | `start` · `end` (숫자 열은 `end`) |

여러 항목의 같은 속성을 비교할 때 써요. 행 높이 40(`space/10`), 좌우 padding `space/3`, 행 아래 1px `border/default`. 머리글 `label` + `text/muted`, 본문 `body` + `text/default`, `align="end"`인 본문 칸은 숫자라서 `mono`예요. 줄무늬나 hover 바탕은 쓰지 않아요. 표가 부모보다 넓으면 가로로 스크롤해요.

### ToggleGroup

```tsx
<ToggleGroup value={view} onValueChange={setView} aria-label="보기 방식">          // 단일: string
  <ToggleGroupItem value="list">목록</ToggleGroupItem>
  <ToggleGroupItem value="card">카드</ToggleGroupItem>
</ToggleGroup>
<ToggleGroup multiple value={filters} onValueChange={setFilters}>…</ToggleGroup>   // 다중: string[]
<ToggleGroupItem value="dark" iconOnly aria-label="다크 테마"><Moon /></ToggleGroupItem>   // 아이콘만이면 iconOnly + aria-label 필수
```

| prop | 값 |
|---|---|
| `multiple` | 여러 개를 함께 누를 수 있음. 켜면 `value`·`onValueChange`가 배열이에요(타입으로 강제) |
| `value`, `defaultValue`, `onValueChange` | 단일은 `string`, 다중은 `string[]`. 단일은 항상 하나가 눌려 있어요(눌린 항목을 다시 눌러도 꺼지지 않음) |
| `disabled` | 그룹 전체 또는 항목 하나 |
| `ToggleGroupItem`의 `iconOnly` | 아이콘만 있는 24×24 항목. `aria-label`이 필수예요(타입으로 강제) |

같은 대상을 **보는 방식**을 바꿀 때 써요(목록/카드, 라이트/다크). 누르면 바로 적용돼요. 폼에서 값을 고를 때는 RadioGroup이나 Select를 써요. 바탕 `bg/subtle` + 안쪽 `space/1` + `radius/md`(전체 높이 32). 항목 높이 24(`space/6`), 좌우 `space/2`, `label`, `radius/sm`. 눌린 항목 `bg/surface` + 1px `border/default` + `text/default`, 나머지 `text/muted`(hover `text/default`). 아이콘만 있는 항목은 24×24, 아이콘 16이에요. 화살표 키로 항목 사이를 이동해요. 항목끼리 붙어 있어서 포커스 링은 Tab처럼 **안쪽**(offset −2px)에 그려요.

### Accordion

```tsx
<Accordion defaultValue={['limit']}>
  <AccordionItem value="limit">
    <AccordionTrigger>키는 몇 개까지 만들 수 있나요?</AccordionTrigger>
    <AccordionPanel>프로젝트마다 10개까지 만들 수 있어요.</AccordionPanel>
  </AccordionItem>
</Accordion>
```

| prop | 값 |
|---|---|
| `multiple` | 여러 항목을 함께 열 수 있음 (기본 `false`) |
| `value`, `defaultValue`, `onValueChange` | 열린 항목들의 `value` 배열 |
| `AccordionItem`의 `disabled` | 항목 하나를 비활성화 |

긴 내용을 제목만 먼저 보여 주고 필요할 때 펼칠 때 써요(자주 묻는 질문, 문서 사이드바 그룹). 꼭 읽어야 하는 내용은 접어 두지 않아요. 항목 아래 1px `border/default`. 트리거는 위아래 `space/3` + `body-strong`, 오른쪽 `chevron-down` 16(`text/muted`)이 열리면 180° 돌아요. 패널은 `body` + `text/muted`, 아래 `space/4`이고, 높이가 `duration/normal`로 변해요. 닫힌 내용도 브라우저 페이지 찾기로 찾아 열 수 있어요.

## 11. Figma ↔ 코드 매핑 (Code Connect 대체)

Sonic 팀은 Figma Pro 요금제라 Code Connect(Organization 이상)를 쓸 수 없어요. 아래 표로 대신합니다. Figma 컴포넌트를 코드로 옮길 때는 이 표의 컴포넌트를 그대로 써요.

| Figma 컴포넌트 (Core 페이지) | node id | 코드 | 파일 |
|---|---|---|---|
| Button | `5:52` | `<Button variant size disabled>` | `src/components/button.tsx` |
| Button Icon | `23:2294` | `<Button size="icon-*" variant disabled aria-label>` + 아이콘 자식 | `src/components/button.tsx` |
| Input | `5:61` | `<Input invalid disabled placeholder>` | `src/components/input.tsx` |
| Text | `5:110` | `<Text variant tone as>` | `src/components/text.tsx` |
| Avatar | `5:117` | `<Avatar size src alt fallback>` | `src/components/avatar.tsx` |
| Card | `6:2` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, `CardFooter` | `src/components/card.tsx` |
| Dialog | `6:13` | `Dialog`, `DialogTrigger`, `DialogPopup`, `DialogTitle`, `DialogDescription`, `DialogClose`, `DialogFooter` | `src/components/dialog.tsx` |
| Field | `31:1543` | `<Field label description error invalid disabled>` + `<Input />` | `src/components/field.tsx` |
| Skeleton | `31:1547` | `<Skeleton shape>` | `src/components/skeleton.tsx` |
| EmptyState | `31:1548` | `<EmptyState icon title description action>` | `src/components/empty-state.tsx` |
| ErrorState | `31:1561` | `<ErrorState icon title description onRetry retryLabel>` | `src/components/error-state.tsx` |
| Textarea | `44:2239` | `<Textarea invalid disabled placeholder>` | `src/components/textarea.tsx` |
| Checkbox | `44:2266` | `<Checkbox checked indeterminate disabled>` (`checked=indeterminate` → `indeterminate`) | `src/components/checkbox.tsx` |
| Radio | `44:2281` | `<RadioGroup label>` + `<Radio value disabled>` | `src/components/radio-group.tsx` |
| Switch | `44:2298` | `<Switch checked disabled>` | `src/components/switch.tsx` |
| Select Trigger · Item · Popup | `44:2315` · `44:2372` · `44:2373` | `<Select options multiple placeholder invalid disabled>` (Trigger `state=open`은 열린 상태, Item은 `options`에서 자동 생성) | `src/components/select.tsx` |
| AlertDialog | `49:4264` | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogPopup`, `…Title`, `…Description`, `…Close`, `…Footer` | `src/components/alert-dialog.tsx` |
| Menu Item · Menu Popup | `49:3092` · `49:3093` | `<MenuItem tone disabled>` (`showIcon`/`icon` → 자식 아이콘), `MenuPopup`, `MenuSeparator` | `src/components/menu.tsx` |
| Popover | `49:4247` | `Popover`, `PopoverTrigger`, `PopoverPopup`, `PopoverTitle`, `PopoverDescription`, `PopoverClose` | `src/components/popover.tsx` |
| Tooltip | `49:3040` | `<Tooltip content>` | `src/components/tooltip.tsx` |
| Tab · Tabs List | `49:3050` · `49:3051` | `Tabs`, `TabsList`, `<Tab value disabled>`, `TabsPanel` (`selected` → 현재 값) | `src/components/tabs.tsx` |
| Separator | `49:3039` | `<Separator orientation>` | `src/components/separator.tsx` |
| Toast | `57:3549` | `useToast().add({ tone, title, description })` (`showDescription` → `description`을 넘길지), 앱에는 `<ToastProvider>` | `src/components/toast.tsx` |
| Badge | `57:3498` | `<Badge tone variant>` (`children` → 자식 문구) | `src/components/badge.tsx` |
| Progress | `58:5093` | `<Progress value max label>` (`value` variant는 채움 미리보기, `value text`는 코드가 자동 표시) | `src/components/progress.tsx` |
| Link | `65:3733` | `<Link href external>` (`children` → 자식 문구) | `src/components/link.tsx` |
| Table Cell · Table | `65:3742` · `65:3743` | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` (`type=header` → `TableHead`, `align` → 같은 prop) | `src/components/table.tsx` |
| Toggle Item · Toggle Group | `66:3760` · `66:3761` | `<ToggleGroup multiple>` + `<ToggleGroupItem value disabled>` (`pressed` → 현재 값, `content=icon`이면 `aria-label`) | `src/components/toggle-group.tsx` |
| Accordion Item · Accordion | `66:3792` · `66:3793` | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel` (`open` → 현재 값, `title`/`content` → 자식) | `src/components/accordion.tsx` |
| Icon (32개) | Foundations `Source icons` | `lucide-react`의 같은 이름 컴포넌트 (`Icon / chevron-down` → `<ChevronDown />`) | 쓰는 쪽에서 설치 |

Figma 속성 → props 변환 규칙: variant 속성은 같은 이름의 prop으로, 텍스트 속성 `children`은 자식으로, boolean `header`/`footer`는 해당 하위 컴포넌트를 넣을지 말지로 옮겨요. Button의 `iconLeft`/`iconRight`(+ `leftIcon`/`rightIcon` 교체)와 Button Icon의 `icon`은 prop이 아니라 **자식 순서**예요: `<Button><Plus />추가하기<ChevronDown /></Button>`.
