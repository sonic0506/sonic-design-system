import * as React from 'react';
import {
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type Column,
  type ColumnDef,
  type RowData,
  type SortFn,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type Announcements, type DragEndEvent, type DragOverEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Ellipsis, GripVertical, LoaderCircle } from 'lucide-react';
import { cn } from '../lib/cn';
import { formatDate, formatDateTime, formatNumber } from '../lib/format';
import { Badge, type BadgeProps } from './badge';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from './menu';
import { Skeleton } from './skeleton';
import { Pagination } from './pagination';
import { Switch } from './switch';
import { TableBody, TableCell, TableHead, TableHeader, TableRow, tableClass } from './table';

type Field<Row> = Extract<keyof Row, string>;
type BadgeTone = NonNullable<BadgeProps['tone']>;

interface ColumnBase {
  header?: string;
  /** px. 고정 열에는 꼭 줘요 (다음 고정 열 위치 계산) */
  width?: number;
  pinned?: 'left' | 'right';
}
interface FieldColumn<Row> extends ColumnBase {
  field: Field<Row>;
  /** 기본은 field */
  id?: string;
  sortable?: boolean;
}

export interface DataGridAction<Row> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** danger는 맨 아래 구분선 뒤에 놓여요. 실행 전에 AlertDialog로 확인해요 */
  tone?: 'default' | 'danger';
  onClick: (row: Row) => void;
}

/** Figma Data Grid Cell의 type과 같은 이름이에요 */
export type DataGridColumn<Row> =
  | (FieldColumn<Row> & { type: 'text' | 'number' | 'date' | 'datetime' })
  | (FieldColumn<Row> & { type: 'badge'; tones: Record<string, BadgeTone>; labels?: Record<string, string> })
  | (FieldColumn<Row> & { type: 'switch'; onChange: (row: Row, checked: boolean) => void })
  | (ColumnBase & { type: 'actions'; id: string; actions: DataGridAction<Row>[] });

export interface DataGridSort {
  id: string;
  desc: boolean;
}

export interface DataGridPagination {
  /** 현재 페이지 (1부터) */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  /** 기본 20 */
  defaultPageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showFirstLast?: boolean;
  /** 서버에서 나눌 때 전체 행 수 */
  rowCount?: number;
}

export interface DataGridProps<Row> {
  /** 원본 값을 넣어요 (숫자는 number, 날짜는 ISO 문자열) */
  rows: Row[];
  getRowId: (row: Row) => string;
  columns: DataGridColumn<Row>[];
  'aria-label': string;
  sorting?: DataGridSort | null;
  defaultSorting?: DataGridSort | null;
  onSortingChange?: (sorting: DataGridSort | null) => void;
  /** 선택된 행 id. onSelectionChange를 넘기면 체크박스 열이 생겨요 */
  selection?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** 열 id 순서. onColumnOrderChange를 넘기면 머리글을 끌어서 옮길 수 있어요 */
  columnOrder?: string[];
  onColumnOrderChange?: (ids: string[]) => void;
  /** 넘기면 핸들 열이 생겨요. 정렬 중에는 핸들을 숨겨요 */
  onRowOrderChange?: (ids: string[]) => void;
  loading?: boolean;
  /** 이미 보이는 행을 다시 불러오는 중. 행은 두고 본문 위에 막과 스피너를 올려요(300ms 넘을 때만). 처음 불러올 때는 loading */
  refreshing?: boolean;
  emptyState?: React.ReactNode;
  errorState?: React.ReactNode;
  /** 넘기면 표 아래에 Pagination이 붙어요. rowCount를 넘기면 서버 모드(받은 rows를 그대로, 정렬도 서버) */
  pagination?: DataGridPagination;
  /** 행이 많으면 보이는 행만 그려요. 이때 높이를 정해 주세요 (예: h-96) */
  className?: string;
}

/** Figma Data Grid Cell의 type 목록 (select·handle은 props로 생기는 열) */
export const dataGridCellTypes = ['text', 'number', 'date', 'datetime', 'badge', 'switch', 'actions', 'select', 'handle'] as const;

const SELECT = '__select';
const HANDLE = '__handle';
const VIRTUAL_FROM = 100;

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnOrderingFeature,
  columnSizingFeature,
  columnPinningFeature,
});
type Features = typeof features;

const compare: SortFn<Features, any> = (a, b, id) => {
  const x = a.getValue(id);
  const y = b.getValue(id);
  if (x == null || y == null) return x == null ? (y == null ? 0 : -1) : 1;
  if (typeof x === 'number' && typeof y === 'number') return x - y;
  if (typeof x === 'boolean') return Number(x) - Number(y);
  return String(x).localeCompare(String(y), 'ko', { numeric: true });
};

const colId = <Row,>(c: DataGridColumn<Row>) => ('field' in c ? (c.id ?? c.field) : c.id);

// 컬럼·행 이동 공통: 놓을 위치는 2px border/focus 선
const dropRow = { before: 'sn:shadow-[inset_0_2px_0_var(--sn-color-border-focus)]', after: 'sn:shadow-[inset_0_-2px_0_var(--sn-color-border-focus)]' };
const dropCol = { before: 'sn:shadow-[inset_2px_0_0_var(--sn-color-border-focus)]', after: 'sn:shadow-[inset_-2px_0_0_var(--sn-color-border-focus)]' };
const handleClass =
  'sn:flex sn:size-4 sn:cursor-grab sn:items-center sn:justify-center sn:rounded-md sn:border-0 sn:bg-transparent sn:p-0 sn:text-muted sn:hover:text-default sn:focus-visible:outline-2 sn:focus-visible:outline-offset-2 sn:focus-visible:outline-focus sn:[&_svg]:size-4';

type Drop = { id: string; side: 'before' | 'after' } | null;

function announcements(kind: string, order: () => string[]): Announcements {
  const pos = (id: string | number) => order().indexOf(String(id)) + 1;
  return {
    onDragStart: ({ active }) => `${kind}을 들었어요. 지금 ${pos(active.id)}번째예요.`,
    onDragOver: ({ over }) => (over ? `${pos(over.id)}번째 위치예요.` : '놓을 수 없는 위치예요.'),
    onDragEnd: ({ over }) => (over ? `${pos(over.id)}번째에 놓았어요.` : '옮기지 않았어요.'),
    onDragCancel: () => '옮기기를 취소했어요.',
  };
}
const instructions = { draggable: 'Space로 들고, 화살표로 옮긴 다음 Space로 놓아요. Esc로 취소해요.' };

function useDrop(ids: string[], onMove: (next: string[]) => void) {
  const [drop, setDrop] = React.useState<Drop>(null);
  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || over.id === active.id) return setDrop(null);
    setDrop({ id: String(over.id), side: ids.indexOf(String(over.id)) > ids.indexOf(String(active.id)) ? 'after' : 'before' });
  };
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDrop(null);
    if (!over || over.id === active.id) return;
    onMove(arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))));
  };
  return { drop, onDragOver, onDragEnd, onDragCancel: () => setDrop(null) };
}

function useControlled<T>(value: T | undefined, initial: T, onChange?: (v: T) => void) {
  const [inner, setInner] = React.useState(initial);
  const current = value !== undefined ? value : inner;
  const set = (v: T) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };
  return [current, set] as const;
}

const REFRESH_DELAY_MS = 300;

// 짧은 요청에서 깜빡이지 않게 300ms가 넘을 때만 보이고, 한 번 보이면 최소 300ms는 유지해요
function useDelayedFlag(active: boolean) {
  const [shown, setShown] = React.useState(false);
  const shownAt = React.useRef(0);
  React.useEffect(() => {
    if (active === shown) return;
    const wait = active ? REFRESH_DELAY_MS : Math.max(0, REFRESH_DELAY_MS - (Date.now() - shownAt.current));
    const timer = setTimeout(() => {
      if (active) shownAt.current = Date.now();
      setShown(active);
    }, wait);
    return () => clearTimeout(timer);
  }, [active, shown]);
  return shown;
}

function sizeStyle<R extends RowData>(column: Column<Features, R, unknown>, fixed: boolean): React.CSSProperties {
  const pin = column.getIsPinned();
  const width = fixed || pin ? column.getSize() : undefined;
  return {
    width,
    minWidth: width,
    left: pin === 'start' ? column.getStart('start') : undefined,
    right: pin === 'end' ? column.getAfter('end') : undefined,
  };
}

function RowActions<Row>({ actions, row }: { actions: DataGridAction<Row>[]; row: Row }) {
  if (actions.length === 1) {
    const [a] = actions;
    const Icon = a.icon;
    return Icon ? (
      <Button size="icon-sm" variant="ghost" aria-label={a.label} onClick={() => a.onClick(row)}><Icon /></Button>
    ) : (
      <Button size="sm" variant="ghost" onClick={() => a.onClick(row)}>{a.label}</Button>
    );
  }
  const normal = actions.filter(a => a.tone !== 'danger');
  const danger = actions.filter(a => a.tone === 'danger');
  const item = (a: DataGridAction<Row>) => {
    const Icon = a.icon;
    return <MenuItem key={a.label} tone={a.tone} onClick={() => a.onClick(row)}>{Icon && <Icon />}{a.label}</MenuItem>;
  };
  return (
    <Menu>
      <MenuTrigger render={<Button size="icon-sm" variant="ghost" aria-label="더 보기" />}><Ellipsis /></MenuTrigger>
      <MenuPopup>
        {normal.map(item)}
        {normal.length > 0 && danger.length > 0 && <MenuSeparator />}
        {danger.map(item)}
      </MenuPopup>
    </Menu>
  );
}

function renderValue<Row>(c: DataGridColumn<Row>, row: Row, value: unknown): React.ReactNode {
  switch (c.type) {
    case 'text':
      return value == null ? '' : String(value);
    case 'number':
      return formatNumber(value as number);
    case 'date':
      return formatDate(value as string);
    case 'datetime':
      return formatDateTime(value as string);
    case 'badge': {
      const v = value == null ? '' : String(value);
      return <Badge tone={c.tones[v] ?? 'neutral'}>{c.labels?.[v] ?? v}</Badge>;
    }
    case 'switch':
      return (
        <Switch checked={Boolean(value)} onCheckedChange={on => c.onChange(row, on)}>
          <span className="sn:sr-only">{c.header}</span>
        </Switch>
      );
    case 'actions':
      return <RowActions actions={c.actions} row={row} />;
  }
}

interface SortableHeadProps extends React.ComponentProps<typeof TableHead> {
  id: string;
  label: string;
  drop?: 'before' | 'after';
}

function SortableHead({ id, label, drop, className, ...props }: SortableHeadProps) {
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, isDragging } = useSortable({ id, attributes: { roleDescription: '옮길 수 있는 열' } });
  return (
    <TableHead
      ref={setNodeRef}
      className={cn(className, isDragging && 'sn:bg-subtle', drop && dropCol[drop])}
      handle={
        <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners} aria-label={`${label} 열 옮기기`} className={handleClass}>
          <GripVertical />
        </button>
      }
      {...props}
    />
  );
}

interface GridRowProps extends React.ComponentProps<typeof TableRow> {
  id: string;
  draggable: boolean;
  renderCells: (handle: React.ReactNode) => React.ReactNode;
}

function GridRow({ id, draggable, renderCells, ...props }: GridRowProps) {
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, isDragging } = useSortable({ id, disabled: !draggable, attributes: { roleDescription: '옮길 수 있는 행' } });
  const handle = draggable ? (
    <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners} aria-label="행 옮기기" className={handleClass}>
      <GripVertical />
    </button>
  ) : null;
  return (
    <TableRow ref={setNodeRef} interactive dragging={isDragging} {...props}>
      {renderCells(handle)}
    </TableRow>
  );
}

export function DataGrid<Row extends RowData>({
  rows,
  getRowId,
  columns,
  'aria-label': ariaLabel,
  sorting,
  defaultSorting = null,
  onSortingChange,
  selection,
  onSelectionChange,
  columnOrder,
  onColumnOrderChange,
  onRowOrderChange,
  loading,
  refreshing,
  emptyState,
  errorState,
  pagination,
  className,
}: DataGridProps<Row>) {
  // loading(Skeleton)과 에러가 먼저예요
  const isRefreshShown = useDelayedFlag(!!refreshing && !loading && !errorState);
  const selectable = selection !== undefined || onSelectionChange !== undefined;
  const reorderRows = onRowOrderChange !== undefined;
  const reorderColumns = onColumnOrderChange !== undefined;

  const [sort, setSort] = useControlled(sorting, defaultSorting, onSortingChange);
  const [selected, setSelected] = useControlled(selection, [] as string[], onSelectionChange);
  const [order, setOrder] = useControlled(columnOrder, columns.map(colId), onColumnOrderChange);
  const [pageState, setPage] = useControlled(pagination?.page, pagination?.defaultPage ?? 1, pagination?.onPageChange);
  const [pageSize, setPageSize] = useControlled(pagination?.pageSize, pagination?.defaultPageSize ?? 20, pagination?.onPageSizeChange);
  const server = pagination?.rowCount !== undefined;
  const pageCount = pagination ? Math.max(1, Math.ceil((server ? pagination.rowCount! : rows.length) / pageSize)) : 1;
  const page = Math.min(pageState, pageCount);

  // dnd-kit은 id가 없으면 전역 카운터로 aria-describedby를 만들어 SSR과 브라우저 값이 달라져요. id는 안내 요소 id로 그대로 쓰여요
  const dndId = React.useId();
  const byId = React.useMemo(() => new Map(columns.map(c => [colId(c), c])), [columns]);
  const defs = React.useMemo(() => {
    const list: ColumnDef<Features, Row, unknown>[] = [];
    if (selectable) list.push({ id: SELECT, size: 40, enableSorting: false });
    if (reorderRows) list.push({ id: HANDLE, size: 40, enableSorting: false });
    for (const c of columns) {
      const size = c.width ?? (c.type === 'actions' ? 56 : undefined);
      list.push(
        'field' in c
          ? { id: colId(c), accessorFn: (r: Row) => r[c.field], enableSorting: Boolean(c.sortable), sortFn: compare, ...(size && { size }) }
          : { id: c.id, enableSorting: false, ...(size && { size }) },
      );
    }
    return list;
  }, [columns, selectable, reorderRows]);

  const pinning = React.useMemo(
    () => ({
      start: [...(selectable ? [SELECT] : []), ...(reorderRows ? [HANDLE] : []), ...columns.filter(c => c.pinned === 'left').map(colId)],
      end: columns.filter(c => c.pinned === 'right').map(colId),
    }),
    [columns, selectable, reorderRows],
  );

  const table = useTable({
    features,
    columns: defs,
    data: rows,
    getRowId: (r: Row) => getRowId(r),
    state: {
      sorting: sort ? [sort] : [],
      columnOrder: order,
      columnPinning: pinning,
      pagination: { pageIndex: page - 1, pageSize: pagination ? pageSize : rows.length },
    },
    // 페이지네이션이 없거나 서버가 나눈 rows면 그대로 보여 줘요. 서버 모드는 정렬도 서버가 해요
    manualPagination: !pagination || server,
    manualSorting: server,
  });

  const headers = [...table.getStartFlatHeaders(), ...table.getCenterFlatHeaders(), ...table.getEndFlatHeaders()];
  const model = table.getRowModel().rows;
  const rowIds = rows.map(getRowId);
  const pageIds = model.map(r => r.id);
  const centerIds = table.getCenterFlatHeaders().map(h => h.column.id);
  const canDragRows = reorderRows && !sort;

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const virtual = !pagination && model.length > VIRTUAL_FROM;
  const virtualizer = useVirtualizer({ count: virtual ? model.length : 0, getScrollElement: () => scrollRef.current, estimateSize: () => 40, overscan: 8 });
  const items = virtual ? virtualizer.getVirtualItems() : null;
  const visible = items ? items.map(v => model[v.index]) : model;
  const padTop = items?.[0]?.start ?? 0;
  const padBottom = items ? virtualizer.getTotalSize() - (items.at(-1)?.end ?? 0) : 0;

  // 안내 문구 div가 table 안에 그려지지 않게 body로 보내요 (dnd-kit은 마운트 뒤에만 그려서 서버 렌더링에는 영향 없음)
  const a11yContainer = typeof document === 'undefined' ? undefined : document.body;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const rowDrop = useDrop(rowIds, ids => onRowOrderChange?.(ids));
  const colDrop = useDrop(centerIds, ids => setOrder([...order.filter(id => !ids.includes(id)), ...ids]));

  const toggleSort = (id: string) => {
    setSort(sort?.id !== id ? { id, desc: false } : sort.desc ? null : { id, desc: true });
    if (pagination && page !== 1) setPage(1);
  };
  // 전체 선택은 보이는 페이지의 행만. 다른 페이지에서 고른 행은 남겨요
  const allSelected = pageIds.length > 0 && pageIds.every(id => selected.includes(id));
  const someSelected = !allSelected && pageIds.some(id => selected.includes(id));
  const toggleAll = (on: boolean) => setSelected([...selected.filter(id => !pageIds.includes(id)), ...(on ? pageIds : [])]);

  const headCell = (header: (typeof headers)[number]) => {
    const { column } = header;
    const id = column.id;
    const pin = column.getIsPinned();
    const pinned = pin === 'start' ? 'left' : pin === 'end' ? 'right' : undefined;
    const base = {
      pinned,
      style: sizeStyle(column, id === SELECT || id === HANDLE || byId.get(id)?.width !== undefined),
      className: cn('sn:sticky sn:top-0 sn:z-20 sn:bg-surface', pinned && 'sn:z-30'),
    } as const;
    if (id === SELECT)
      return (
        <TableHead key={id} {...base}>
          <Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={toggleAll}>
            <span className="sn:sr-only">모든 행 선택</span>
          </Checkbox>
        </TableHead>
      );
    if (id === HANDLE) return <TableHead key={id} {...base}><span className="sn:sr-only">순서</span></TableHead>;
    const c = byId.get(id)!;
    const label = c.header ?? '';
    const sortProps =
      'sortable' in c && c.sortable ? ({ sort: sort?.id === id ? (sort.desc ? 'desc' : 'asc') : 'none', onSort: () => toggleSort(id) } as const) : {};
    const content = c.type === 'actions' && !c.header ? <span className="sn:sr-only">동작</span> : label;
    const align = c.type === 'number' || c.type === 'actions' ? 'end' : 'start';
    if (reorderColumns && !pinned)
      return (
        <SortableHead key={id} id={id} label={label || '동작'} align={align} drop={colDrop.drop?.id === id ? colDrop.drop.side : undefined} {...base} {...sortProps}>
          {content}
        </SortableHead>
      );
    return <TableHead key={id} align={align} {...base} {...sortProps}>{content}</TableHead>;
  };

  const stateRow = (content: React.ReactNode) => (
    <TableRow>
      <TableCell colSpan={headers.length} className="sn:h-auto sn:p-0">{content}</TableCell>
    </TableRow>
  );

  let body: React.ReactNode;
  if (errorState) body = stateRow(errorState);
  else if (loading)
    body = Array.from({ length: 5 }, (_, i) => (
      <TableRow key={i}>
        {headers.map(h => (
          <TableCell key={h.id}>{h.column.id === SELECT || h.column.id === HANDLE ? null : <Skeleton shape="text" className="sn:w-2/3" />}</TableCell>
        ))}
      </TableRow>
    ));
  else if (model.length === 0) body = emptyState ? stateRow(emptyState) : null;
  else
    body = (
      <>
        {padTop > 0 && <tr aria-hidden style={{ height: padTop }} />}
        {visible.map(row => {
          const isSelected = selected.includes(row.id);
          const drop = rowDrop.drop?.id === row.id ? dropRow[rowDrop.drop.side] : undefined;
          const cells = [...row.getStartVisibleCells(), ...row.getCenterVisibleCells(), ...row.getEndVisibleCells()];
          return (
            <GridRow
              key={row.id}
              id={row.id}
              draggable={canDragRows}
              selected={isSelected}
              aria-selected={selectable ? isSelected : undefined}
              aria-rowindex={virtual ? row.index + 2 : undefined}
              renderCells={handle =>
                cells.map(cell => {
                  const { column } = cell;
                  const id = column.id;
                  const pin = column.getIsPinned();
                  const pinned = pin === 'start' ? 'left' : pin === 'end' ? 'right' : undefined;
                  const c = byId.get(id);
                  let content: React.ReactNode;
                  if (id === SELECT)
                    content = (
                      <Checkbox checked={isSelected} onCheckedChange={on => setSelected(on ? [...selected, row.id] : selected.filter(s => s !== row.id))}>
                        <span className="sn:sr-only">행 선택</span>
                      </Checkbox>
                    );
                  else if (id === HANDLE) content = handle;
                  else content = renderValue(c!, row.original, cell.getValue());
                  return (
                    <TableCell
                      key={cell.id}
                      pinned={pinned}
                      style={sizeStyle(column, id === SELECT || id === HANDLE || c?.width !== undefined)}
                      align={c?.type === 'number' ? 'end' : 'start'}
                      className={cn((c?.type === 'date' || c?.type === 'datetime') && 'sn:font-mono', c?.type === 'actions' && 'sn:text-right', drop)}
                    >
                      {content}
                    </TableCell>
                  );
                })
              }
            />
          );
        })}
        {padBottom > 0 && <tr aria-hidden style={{ height: padBottom }} />}
      </>
    );

  return (
    <div className={cn('sn:flex sn:w-full sn:flex-col sn:gap-4', className)}>
      {/* relative: 칸 안 sr-only(absolute)가 스크롤 영역에 갇히게 해요. 없으면 밖으로 빠져 페이지가 넓어져요 */}
      <div ref={scrollRef} className="sn:relative sn:min-h-0 sn:w-full sn:flex-1 sn:overflow-auto">
        <table aria-label={ariaLabel} aria-busy={loading || refreshing || undefined} aria-rowcount={virtual ? model.length + 1 : undefined} className={cn(tableClass, 'sn:bg-surface')}>
          <DndContext
            id={`DndDescribedBy-${dndId}-columns`}
            sensors={sensors}
            collisionDetection={closestCenter}
            accessibility={{ container: a11yContainer, announcements: announcements('열', () => centerIds), screenReaderInstructions: instructions }}
            onDragOver={colDrop.onDragOver}
            onDragEnd={colDrop.onDragEnd}
            onDragCancel={colDrop.onDragCancel}
          >
            <TableHeader>
              <SortableContext items={reorderColumns ? centerIds : []} strategy={horizontalListSortingStrategy}>
                <TableRow>{headers.map(headCell)}</TableRow>
              </SortableContext>
            </TableHeader>
          </DndContext>
          <DndContext
            id={`DndDescribedBy-${dndId}-rows`}
            sensors={sensors}
            collisionDetection={closestCenter}
            accessibility={{ container: a11yContainer, announcements: announcements('행', () => pageIds), screenReaderInstructions: instructions }}
            onDragOver={rowDrop.onDragOver}
            onDragEnd={rowDrop.onDragEnd}
            onDragCancel={rowDrop.onDragCancel}
          >
            <SortableContext items={canDragRows ? pageIds : []} strategy={verticalListSortingStrategy}>
              {/* relative: 다시 불러오는 중 막이 본문 행만 덮어요(머리글은 그대로 보여요) */}
              <TableBody className={isRefreshShown ? 'sn:relative' : undefined}>
                {body}
                {isRefreshShown && (
                  <tr aria-hidden>
                    <td colSpan={headers.length} className="sn:absolute sn:inset-0 sn:flex sn:items-center sn:justify-center sn:bg-scrim-subtle sn:p-0 sn:text-muted">
                      <LoaderCircle className="sn:size-6 sn:animate-[sn-spin_var(--sn-duration-loop)_linear_infinite] sn:motion-reduce:animate-none" />
                    </td>
                  </tr>
                )}
              </TableBody>
            </SortableContext>
          </DndContext>
        </table>
        <span role="status" className="sn:sr-only">
          {isRefreshShown ? '불러오는 중이에요' : ''}
        </span>
      </div>
      {pagination && !errorState && (loading || model.length > 0) && (
        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={size => {
            setPageSize(size);
            if (page !== 1) setPage(1);
          }}
          pageSizeOptions={pagination.pageSizeOptions}
          showFirstLast={pagination.showFirstLast}
        />
      )}
    </div>
  );
}
