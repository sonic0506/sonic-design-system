# AI-RULES — sonic-ui를 쓰는 프로젝트의 AI 작업 규칙

이 파일은 sonic-ui를 설치한 프로젝트에서 Claude가 따를 규칙이에요. 프로젝트의 CLAUDE.md에 아래 두 줄을 넣어 불러와요.

```md
@node_modules/@xonic0506/sonic-ui/DESIGN.md
@node_modules/@xonic0506/sonic-ui/AI-RULES.md
```

## 규칙

1. **DESIGN.md가 기준이에요.** 색, 간격, radius, 글자, 모션은 DESIGN.md의 토큰만 써요. 임의의 값(`p-[7px]`, `#3355ff`, `text-[15px]`)과 Tailwind 기본 팔레트(`bg-blue-500`)는 쓰지 않아요.
2. **UI는 sonic-ui 컴포넌트로 조립해요.** DESIGN.md §7 Core 목록(Button, Input, Select, Dialog, Menu, Toast, Badge 등)에 있는 역할은 직접 만들지 않아요. 없는 역할이 필요하면 먼저 사용자에게 알려요(라이브러리에 추가할지 판단이 필요해요).
3. **frontend-design은 디자인 작업에서만 써요.** Figma 화면을 디자인할 때는 먼저 불러 레이아웃·위계·문구 판단에 쓰고, 색·폰트·간격은 토큰에서 골라요. 코딩할 때는 쓰지 않고 Figma를 그대로 따라요. 두 작업은 세션을 나눠요(DESIGN.md §9).
4. **데이터 화면은 4가지 상태를 모두 만들어요.** 정상, 로딩, 빈 상태, 에러. Figma에 4가지가 없으면 디자인부터 요청해요(DESIGN.md §8).
5. **Domain 컴포넌트는 프로젝트에 둬요.** 도메인 타입, API 호출, 비즈니스 규칙을 아는 컴포넌트는 sonic-ui에 넣지 않아요. 같은 형태를 두 번째 프로젝트에서 복사하게 되면 Pattern 승격을 제안해요(DESIGN.md §7).
6. **작업 흐름:** 페이지 요청 → DESIGN.md 기준 Figma 디자인 → Figma 기준 코딩. Figma 컴포넌트는 DESIGN.md §11 매핑표의 코드 컴포넌트로 옮겨요.
7. **덮어쓰기는 className으로만 해요.** 쓰는 쪽 Tailwind 클래스가 sonic-ui 기본 스타일을 이겨요(layer 순서 때문). sonic-ui 내부 클래스(`sn:*`)를 쓰는 쪽 코드에서 쓰지 않아요.
