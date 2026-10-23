import * as React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '../lib/cn';

type Props<E extends HTMLElement> = Omit<React.HTMLAttributes<E>, 'className'> & { className?: string };
type Pinned = 'left' | 'right';
type CellProps = Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'className' | 'align'> & {
  /** 숫자 열은 end */
  align?: 'start' | 'end';
  /** 가로 스크롤 중에도 붙어 있어요. 여러 열을 고정하면 style.left·right로 위치를 넘겨요 */
  pinned?: Pinned;
  className?: string;
};
type HeadProps = Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'className' | 'align'> & {
  align?: 'start' | 'end';
  pinned?: Pinned;
  /** 정렬 표시. onSort를 넘기면 머리글이 버튼이 돼요 */
  sort?: 'asc' | 'desc' | 'none';
  onSort?: () => void;
  /** 컬럼 이동 손잡이. hover·포커스 때만 보이고, 정렬 반대쪽 끝에 놓여요 */
  handle?: React.ReactNode;
  className?: string;
};
type RowProps = Props<HTMLTableRowElement> & {
  /** 선택된 행 (bg/selected) */
  selected?: boolean;
  /** hover 바탕을 보여 줘요 (DataGrid처럼 행을 고르거나 옮길 때) */
  interactive?: boolean;
  /** 옮기는 중인 행 */
  dragging?: boolean;
};

export const tableClass = 'sn:w-full sn:border-separate sn:border-spacing-0 sn:font-sans sn:text-body sn:text-default';

/** 넓으면 가로로 스크롤해요 */
export const Table = React.forwardRef<HTMLTableElement, Props<HTMLTableElement>>(function Table({ className, ...props }, ref) {
  return (
    <div className="sn:w-full sn:overflow-x-auto">
      <table ref={ref} className={cn(tableClass, className)} {...props} />
    </div>
  );
});

export const TableHeader = React.forwardRef<HTMLTableSectionElement, Props<HTMLTableSectionElement>>(function TableHeader(props, ref) {
  return <thead ref={ref} {...props} />;
});

export const TableBody = React.forwardRef<HTMLTableSectionElement, Props<HTMLTableSectionElement>>(function TableBody(props, ref) {
  return <tbody ref={ref} {...props} />;
});

// 행 바탕은 tr에 칠해요. 고정 칸은 불투명해야 해서 group으로 같은 색을 받아요
export const TableRow = React.forwardRef<HTMLTableRowElement, RowProps>(function TableRow({ selected, interactive, dragging, className, ...props }, ref) {
  return (
    <tr
      ref={ref}
      data-selected={selected ? '' : undefined}
      data-interactive={interactive ? '' : undefined}
      data-dragging={dragging ? '' : undefined}
      className={cn(
        'sn:group/row sn:data-interactive:hover:bg-subtle sn:data-selected:bg-selected',
        'sn:data-dragging:bg-surface sn:data-dragging:outline sn:data-dragging:outline-1 sn:data-dragging:-outline-offset-1 sn:data-dragging:outline-default',
        className,
      )}
      {...props}
    />
  );
});

// 행 높이 40에 아래 선 1px까지 포함 (Figma Table Cell과 같음)
const cellClass = 'sn:box-border sn:h-10 sn:border-b sn:border-default sn:px-3 sn:py-0 sn:align-middle';
const pinnedClass = {
  left: 'sn:sticky sn:left-0 sn:z-10 sn:border-r sn:border-r-default sn:bg-surface',
  right: 'sn:sticky sn:right-0 sn:z-10 sn:border-l sn:border-l-default sn:bg-surface',
};
const pinnedRowClass = 'sn:group-data-interactive/row:group-hover/row:bg-subtle sn:group-data-selected/row:bg-selected';

export const TableHead = React.forwardRef<HTMLTableCellElement, HeadProps>(function TableHead(
  { align = 'start', sort, onSort, handle, pinned, className, children, ...props },
  ref,
) {
  const sorted = sort === 'asc' || sort === 'desc';
  const Arrow = sort === 'asc' ? ArrowUp : ArrowDown;
  const content = sorted ? <>{children}<Arrow className="sn:size-4 sn:shrink-0" aria-hidden /></> : children;
  const inner = cn('sn:flex sn:h-10 sn:w-full sn:items-center sn:gap-1 sn:px-3', align === 'end' && 'sn:justify-end');
  return (
    <th
      ref={ref}
      scope="col"
      aria-sort={sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : sort === 'none' ? 'none' : undefined}
      className={cn(
        cellClass,
        Boolean(handle) && 'sn:group/head sn:relative',
        'sn:text-label',
        sorted ? 'sn:text-default' : 'sn:text-muted',
        align === 'end' ? 'sn:text-right' : 'sn:text-left',
        pinned && pinnedClass[pinned],
        (onSort || sorted) && 'sn:px-0',
        className,
      )}
      {...props}
    >
      {onSort ? (
        // 칸끼리 붙어 있어서 포커스 링은 안쪽(offset −2px)에 그려요
        <button
          type="button"
          onClick={onSort}
          className={cn(
            inner,
            'sn:cursor-pointer sn:border-0 sn:bg-transparent sn:[font:inherit] sn:text-inherit sn:hover:text-default',
            'sn:focus-visible:outline-2 sn:focus-visible:-outline-offset-2 sn:focus-visible:outline-focus',
          )}
        >
          {content}
        </button>
      ) : sorted ? (
        <span className={inner}>{content}</span>
      ) : (
        children
      )}
      {handle ? (
        <span
          className={cn(
            'sn:absolute sn:inset-y-0 sn:flex sn:items-center sn:opacity-0 sn:group-hover/head:opacity-100 sn:focus-within:opacity-100',
            align === 'end' ? 'sn:left-1' : 'sn:right-1',
          )}
        >
          {handle}
        </span>
      ) : null}
    </th>
  );
});

export const TableCell = React.forwardRef<HTMLTableCellElement, CellProps>(function TableCell({ align = 'start', pinned, className, ...props }, ref) {
  return (
    <td
      ref={ref}
      className={cn(cellClass, align === 'end' ? 'sn:text-right sn:font-mono' : 'sn:text-left', pinned && [pinnedClass[pinned], pinnedRowClass].join(' '), className)}
      {...props}
    />
  );
});
