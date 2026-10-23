# Pagination 작업 계획

목표: 목록을 페이지로 나눠 보여 주는 `Pagination`을 Core에 추가하고, DataGrid에 `pagination` prop으로 연결해요.
Table·카드 목록에서도 단독으로 쓸 수 있어요.

## 0. 결정 사항

### 정한 것 (2026-10-23)

| 결정 | 내용 |
|---|---|
| 구성 | 단독 `Pagination`(Core) + DataGrid `pagination` prop |
| 데이터 | 클라이언트(rows 전체를 DataGrid가 나눔)와 서버(`rowCount`를 넘기면 받은 rows를 그대로 보여 줌) 둘 다 |
| 모양 | `« ‹ 1 … 4 5 6 … 20 › »` 번호 + 이전/다음 + 처음/마지막. 처음/마지막은 `showFirstLast`로 끌 수 있어요(기본 표시, Figma 같은 이름의 boolean 속성) |
| 추가 요소 | 페이지당 행 수 Select. 범위 표시("1–20 / 245")는 넣지 않아요 |

### 기본값으로 정한 것 (바꾸려면 말해 주세요)

| 항목 | 기본값 | 이유 |
|---|---|---|
| 현재 페이지 표시 | `bg/subtle` + `text/default` + `aria-current="page"` | primary는 화면에 하나만(§1 원칙 2). 다른 번호는 `text/muted` |
| 번호 버튼 | 28×28(`space/7`), `radius/md`, 숫자는 `mono` 계열(§1 원칙 3) | 버튼 sm과 같은 높이 |
| 이전·다음·처음·마지막 | ghost `icon-sm`, 첫·마지막 페이지에서는 disabled | 기존 Button 재사용 |
| 번호 개수 | 처음·마지막 + 현재 양옆 1개, 나머지는 `…` (최대 7칸) | 너비가 바뀌지 않게 |
| 페이지당 행 수 | `10 · 20 · 50`, 기본 20. 라벨 "페이지당 행". Select 너비는 글자에 맞춰요(64는 "10"이 잘려서) | |
| 배치 | 왼쪽 행 수 Select, 오른쪽 페이지 이동 (`space/4` 사이) | |
| 좁은 화면(640 미만) | 번호를 숨기고 `4 / 20`(mono-caption)만 보여 줘요 | 버튼 28은 터치 보조 자리 기준(§4) |
| 페이지 번호 | 1부터 시작 (화면 표시와 같음) | TanStack의 0 기반 index는 안에서만 써요 |
| DataGrid 선택 | 전체 선택 체크박스는 **현재 페이지** 행만 골라요 | 보이지 않는 행이 몰래 선택되지 않게 |
| DataGrid 행 이동 | 현재 페이지 안에서만 | |
| DataGrid 가상 스크롤 | 페이지네이션을 켜면 쓰지 않아요 | 한 페이지는 최대 50행 |
| 서버 모드 정렬 | `rowCount`를 넘기면 정렬도 서버가 해요(`manualSorting`). `onSortingChange`로 받아 다시 불러와요 | 한 페이지만 정렬하면 결과가 틀려요 |

## 1. Figma

- [x] Icon 추가: `chevrons-left`, `chevrons-right` (lucide-static 1.59.0, flatten, `color/text/default`). Source icons, 04 Icon 문서
- [x] Core › Source components: `Pagination Item`(`138:5684`, `state=default·current·ellipsis`), `Pagination`(`138:5747`, `viewport=desktop·mobile`, 행 수 Select 포함)
- [x] 새 문서 `Doc · 16 Pagination`: 스펙, Light/Dark, Interaction states(번호 hover `bg/subtle`·focus 링), DataGrid와 함께 쓴 예시
- [x] Doc 15 Data grid에 페이지네이션 예시 한 줄
- [x] 하드코딩 감사 0건

## 2. DESIGN.md

- [x] §7 Core 목록에 Pagination
- [x] §10 Pagination 스펙, DataGrid `pagination` prop(클라이언트·서버, 선택·이동·정렬 규칙)
- [x] §11 매핑, 아이콘 개수 40 → 42

## 3. 코드

```tsx
// 단독
<Pagination page={page} pageCount={20} onPageChange={setPage} pageSize={20} onPageSizeChange={setPageSize} />
<Pagination page={page} pageCount={20} onPageChange={setPage} showFirstLast={false} />   // 처음·마지막 없이

// DataGrid 클라이언트: rows 전체
<DataGrid rows={allKeys} pagination={{ defaultPageSize: 20 }} … />

// DataGrid 서버: 현재 페이지 rows + 전체 개수
<DataGrid rows={pageRows} pagination={{ page, onPageChange: setPage, pageSize, onPageSizeChange: setPageSize, rowCount: total }}
  sorting={sort} onSortingChange={setSort} … />
```

- [x] `src/components/pagination.tsx`: 번호 계산(순수 함수 + 테스트), Button·Select 재사용, `nav aria-label="페이지"`
- [x] `data-grid.tsx`: `rowPaginationFeature` + `createPaginatedRowModel`, 서버 모드는 `manualPagination`·`manualSorting`, 페이지가 바뀌면 행 이동 표시·포커스 정리
- [x] DataGrid `pagination`에도 `showFirstLast`를 그대로 넘겨요
- [x] 테스트: `showFirstLast={false}`면 처음·마지막 버튼 없음, 번호 목록(1~7, 앞뒤 `…`), 첫·마지막 disabled, `aria-current`, 행 수 바꾸면 1페이지로, DataGrid 클라이언트 나눔, 서버 모드는 rows 그대로 + rowCount로 페이지 수, 전체 선택은 현재 페이지만
- [x] playground: DataGrid 1,000행 예시에 페이지네이션 켜기/끄기

## 4. 검증 · 버전

- [x] `npm run typecheck && npm test && npm run build`, playground Light/Dark·키보드·좁은 화면
- [ ] patch(0.5.1)에 DataGrid와 함께 올려요. `npm publish`는 확인 후에

## 진행 중 바뀐 것

- 처음·마지막 버튼은 `showFirstLast`(기본 true)로 끌 수 있어요.
- 마지막 페이지 버튼을 누르면 비활성이 되면서 포커스가 사라지는 문제가 있어, Button에 `focusableWhenDisabled`를 열고 화살표 버튼에 썼어요(`aria-disabled`).
