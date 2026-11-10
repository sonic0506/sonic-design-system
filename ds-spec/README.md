# ds-spec

Sonic 규격으로 만드는 디자인 시스템 Figma 파일의 **공통 규칙**이에요. Sonic 자신도, 앞으로 생성기로 만드는 다른 브랜드의 초안도 이 규칙을 지켜요. 값(색, 글꼴, 크기)은 브랜드마다 다르고, 구조는 같아요.

| 파일 | 내용 |
|---|---|
| `required.json` | 기계가 검사하는 필수 목록: 페이지, Doc Kit, Foundations 문서, 변수 컬렉션·모드·필수 토큰, 팔레트 그룹·단계, 텍스트 스타일 이름 규칙, Core 컴포넌트와 속성 |
| `../DESIGN.md` §3.1 · §3.4 | 팔레트(Primary · Secondary · Gray scale · System)와 타이포(Heading · Title · Body · Mono) 규칙 |
| `../CLAUDE.md` "Figma 문서 페이지 규칙" | Doc Kit으로 문서를 만드는 방법, 하드코딩 감사 |

## 검사

```bash
npm run check:spec                                   # 토큰만 (scripts/figma-tokens.json)
node scripts/check-ds-spec.mjs <tokens.json> <structure.json>   # 토큰 + 페이지·문서·컴포넌트
```

- `tokens.json`: `scripts/figma-export.js`를 `use_figma`로 실행한 결과
- `structure.json`: `scripts/figma-structure.js`를 `use_figma`로 실행한 결과
- 배포 전 검사(`prepublishOnly`)에 토큰 검사가 들어 있어요.

## 무엇이 필수이고 무엇이 브랜드 몫인가

| 필수 (구조) | 브랜드마다 (값) |
|---|---|
| 페이지 6개, Doc Kit 6개, Foundations 문서 4개(Illustration은 선택) | 문서 안 설명 문구 |
| Semantic 31개와 Light/Dark 모드, Spacing·Radius·Motion·Opacity 토큰 이름 | 각 토큰이 가리키는 값 |
| 팔레트 그룹 primary · gray · danger · success · warning · info (secondary는 선택), 모두 11단계 | 색 값, 기본 단계(★) |
| 텍스트 스타일 이름 규칙, Heading · Title · Body 그룹 | 단계 수(그룹 최대치 안), 글꼴, 크기 |
| Core 컴포넌트 41개와 속성·variant 값 (코드 props와 같아서) | 컴포넌트 모양은 변수를 따라 자동으로 바뀜 |

컴포넌트를 추가하거나 속성을 바꾸면 `required.json`도 함께 고쳐요(DESIGN.md §11 매핑표와 같은 시점).
