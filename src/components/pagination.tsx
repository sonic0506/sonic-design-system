import * as React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../lib/cn';
import { Button } from './button';
import { Select } from './select';

export interface PaginationProps {
  /** 현재 페이지 (1부터) */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** onPageSizeChange를 넘기면 왼쪽에 페이지당 행 수 Select가 생겨요 */
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  /** 처음·마지막 버튼 */
  showFirstLast?: boolean;
  'aria-label'?: string;
  className?: string;
}

/** 처음·마지막 + 현재 양옆 1개, 나머지는 줄임표. 항상 최대 7칸이라 너비가 흔들리지 않아요 */
export function getPageItems(page: number, pageCount: number): Array<number | 'ellipsis'> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, 'ellipsis', pageCount];
  if (page >= pageCount - 3) return [1, 'ellipsis', ...Array.from({ length: 5 }, (_, i) => pageCount - 4 + i)];
  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', pageCount];
}

const itemClass =
  'sn:box-border sn:flex sn:h-7 sn:min-w-7 sn:items-center sn:justify-center sn:rounded-md sn:border-0 sn:px-1 sn:font-mono sn:text-body';

export function Pagination({
  page,
  pageCount,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  showFirstLast = true,
  'aria-label': ariaLabel = '페이지',
  className,
}: PaginationProps) {
  const count = Math.max(1, pageCount);
  const current = Math.min(Math.max(1, page), count);
  const go = (p: number) => p !== current && onPageChange(p);
  const arrow = (label: string, target: number, disabled: boolean, Icon: React.ComponentType) => (
    // 끝 페이지에 닿아 비활성이 돼도 키보드 포커스가 사라지지 않게 해요
    <Button size="icon-sm" variant="ghost" aria-label={label} disabled={disabled} focusableWhenDisabled onClick={() => go(target)}>
      <Icon />
    </Button>
  );
  return (
    <div className={cn('sn:flex sn:items-center sn:justify-between sn:gap-4 sn:font-sans', className)}>
      {onPageSizeChange && (
        <div className="sn:flex sn:items-center sn:gap-2">
          <span aria-hidden className="sn:hidden sn:text-label sn:text-muted sn:sm:inline">페이지당 행</span>
          <Select
            aria-label="페이지당 행"
            className="sn:w-auto"
            options={pageSizeOptions.map(n => ({ value: String(n), label: String(n) }))}
            value={pageSize === undefined ? null : String(pageSize)}
            onValueChange={v => v && onPageSizeChange(Number(v))}
          />
        </div>
      )}
      <nav aria-label={ariaLabel} className="sn:ml-auto sn:flex sn:items-center sn:gap-1">
        {showFirstLast && arrow('처음 페이지', 1, current <= 1, ChevronsLeft)}
        {arrow('이전 페이지', current - 1, current <= 1, ChevronLeft)}
        <ul className="sn:m-0 sn:hidden sn:list-none sn:items-center sn:gap-1 sn:p-0 sn:sm:flex">
          {getPageItems(current, count).map((item, i) =>
            item === 'ellipsis' ? (
              <li key={`e${i}`} aria-hidden className={cn(itemClass, 'sn:text-muted')}>…</li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  aria-label={`${item}페이지`}
                  aria-current={item === current ? 'page' : undefined}
                  onClick={() => go(item)}
                  className={cn(
                    itemClass,
                    'sn:cursor-pointer sn:transition-colors sn:duration-(--sn-duration-fast) sn:ease-standard sn:motion-reduce:transition-none',
                    'sn:focus-visible:outline-2 sn:focus-visible:outline-offset-2 sn:focus-visible:outline-focus',
                    item === current ? 'sn:bg-subtle sn:text-default' : 'sn:bg-transparent sn:text-muted sn:hover:bg-subtle sn:hover:text-default',
                  )}
                >
                  {item}
                </button>
              </li>
            ),
          )}
        </ul>
        <span className="sn:px-1 sn:font-mono sn:text-caption sn:text-muted sn:sm:hidden">{current} / {count}</span>
        {arrow('다음 페이지', current + 1, current >= count, ChevronRight)}
        {showFirstLast && arrow('마지막 페이지', count, current >= count, ChevronsRight)}
      </nav>
    </div>
  );
}
