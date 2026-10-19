# Sonic Design System — DESIGN.md

Sonic(`sonic-ui`)의 디자인 규칙이에요. Figma에서 디자인할 때, 그리고 코드를 짤 때 모두 이 문서를 따릅니다.

- 원본: Figma [Sonic Design System](https://www.figma.com/design/XifnZsjqJWJqFmAmrM6p3u). 값이 다르면 Figma가 맞아요.
- 방향: **Cobalt Instrument**. 계기판처럼 정밀하고 촘촘한 화면이에요. 차가운 회색을 바탕으로 쓰고, 행동을 유도하는 곳에만 코발트를 써요.

## 1. 원칙

1. **토큰 밖의 값은 없다.** 색, 간격, radius, 글자 크기는 모두 아래 표에서 고릅니다. 임의의 값(`#3355ff`, `13px`, `p-[7px]`)은 쓰지 않아요.
2. **강조는 한 곳에만.** 한 화면에서 `primary` 버튼은 하나만 둬요. 나머지는 `secondary`나 `ghost`를 씁니다.
3. **숫자는 고정폭.** 수치, ID, 키 값은 `mono` 계열 스타일로 써서 자리를 맞춰요.
4. **그림자 대신 선.** 높낮이는 1px 테두리(`color/border/default`)와 배경 단계(canvas → surface → subtle)로 구분해요. 그림자 토큰은 없어요.
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
| 섹션 사이 | `space/6` |
| Card 안쪽 padding / Header·Body·Footer 사이 | `space/5` / `space/4` |
| 폼 필드 사이 | `space/4` |
| 라벨 ↔ 입력란 ↔ 도움말·에러 문구 | `space/2` |
| 버튼 묶음 사이 | `space/2` |
| 목록 항목 안 (아바타 ↔ 텍스트) | `space/3` |
| 제목 ↔ 바로 아래 설명 | `space/1` |

- 버튼 묶음은 오른쪽 정렬이고, 보조 버튼이 왼쪽, primary가 맨 오른쪽이에요. Dialog Footer도 같아요.
- 에러 상태: 입력란 테두리를 `color/border/danger`로 바꾸고, 입력란 바로 아래에 `caption` + `color/text/danger`로 고치는 방법을 씁니다. 라벨 색은 바꾸지 않아요.
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

hover, focus는 Figma에서 `state=hover`, `state=focus`로 그리고, 코드에서는 CSS의 `:hover`, `:focus-visible`로 처리해요.

## 7. 3계층 판단 기준

| 계층 | 위치 | 기준 | 예 |
|---|---|---|---|
| **Core** | sonic-ui `src/components/` | 더 나눌 수 없고, 도메인을 전혀 모름 | Button, Input, Text, Card, Avatar, Dialog |
| **Pattern** | sonic-ui `src/patterns/` | Core 조합이고 도메인을 모르지만, **두 프로젝트 이상에서 같은 형태로 복사됨** | (아직 없음) |
| **Domain** | 각 프로젝트 | 도메인 타입, API, 비즈니스 로직 중 하나라도 앎 | `UserProfileCard`, `ApiKeyList` |

판단 순서:
1. props에 도메인 타입(`User`, `Order`)이 들어가나요? → **Domain**
2. 데이터를 직접 불러오거나 비즈니스 규칙이 있나요? → **Domain**
3. 두 번째 프로젝트에서 같은 형태를 복사하게 됐나요? → **Pattern으로 승격**
4. 아직 한 프로젝트에서만 쓰나요? → 그 프로젝트의 Domain에 둡니다

## 8. 데이터 화면의 4가지 상태

데이터를 보여 주는 화면은 Figma에서 **4가지 상태를 모두 그려야** 개발로 넘어가요.

| 상태 | 그릴 것 |
|---|---|
| 정상 | 실제와 비슷한 양의 데이터 |
| 로딩 | 정상 화면과 같은 배치에 자리만 표시(`color/bg/subtle` 블록) |
| 빈 상태 | 무엇이 없는지, 다음에 할 행동 하나(버튼) |
| 에러 | 무엇이 실패했는지, 다시 시도할 방법 |

Skeleton, EmptyState, ErrorState 컴포넌트는 첫 실제 프로젝트에서 필요할 때 Core에 추가해요. 그 전에는 Core 조합으로 그립니다.

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
| `size` | `sm` · `md` · `lg` | `md` |
| `disabled` | boolean | `false` |
| `children` | 버튼 문구 | — |

| | sm | md | lg |
|---|---|---|---|
| 높이 | `space/7` (28) | `space/8` (32) | `space/10` (40) |
| 좌우 padding | `space/2` | `space/3` | `space/4` |
| 글자 | `label` | `body-strong` | `body-strong` |

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

## 11. Figma ↔ 코드 매핑 (Code Connect 대체)

Sonic 팀은 Figma Pro 요금제라 Code Connect(Organization 이상)를 쓸 수 없어요. 아래 표로 대신합니다. Figma 컴포넌트를 코드로 옮길 때는 이 표의 컴포넌트를 그대로 써요.

| Figma 컴포넌트 (Core 페이지) | node id | 코드 | 파일 |
|---|---|---|---|
| Button | `5:52` | `<Button variant size disabled>` | `src/components/button.tsx` |
| Input | `5:61` | `<Input invalid disabled placeholder>` | `src/components/input.tsx` |
| Text | `5:110` | `<Text variant tone as>` | `src/components/text.tsx` |
| Avatar | `5:117` | `<Avatar size src alt fallback>` | `src/components/avatar.tsx` |
| Card | `6:2` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, `CardFooter` | `src/components/card.tsx` |
| Dialog | `6:13` | `Dialog`, `DialogTrigger`, `DialogPopup`, `DialogTitle`, `DialogDescription`, `DialogClose`, `DialogFooter` | `src/components/dialog.tsx` |

Figma 속성 → props 변환 규칙: variant 속성은 같은 이름의 prop으로, 텍스트 속성 `children`은 자식으로, boolean `header`/`footer`는 해당 하위 컴포넌트를 넣을지 말지로 옮겨요.
