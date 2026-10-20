import * as React from 'react';
import { cn } from '../lib/cn';

type Props<E extends HTMLElement> = Omit<React.HTMLAttributes<E>, 'className'> & { className?: string };
type CellProps = Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'className' | 'align'> & {
  /** 숫자 열은 end */
  align?: 'start' | 'end';
  className?: string;
};

/** 넓으면 가로로 스크롤해요 */
export const Table = React.forwardRef<HTMLTableElement, Props<HTMLTableElement>>(function Table({ className, ...props }, ref) {
  return (
    <div className="sn:w-full sn:overflow-x-auto">
      <table ref={ref} className={cn('sn:w-full sn:border-separate sn:border-spacing-0 sn:font-sans sn:text-body sn:text-default', className)} {...props} />
    </div>
  );
});

export const TableHeader = React.forwardRef<HTMLTableSectionElement, Props<HTMLTableSectionElement>>(function TableHeader(props, ref) {
  return <thead ref={ref} {...props} />;
});

export const TableBody = React.forwardRef<HTMLTableSectionElement, Props<HTMLTableSectionElement>>(function TableBody(props, ref) {
  return <tbody ref={ref} {...props} />;
});

export const TableRow = React.forwardRef<HTMLTableRowElement, Props<HTMLTableRowElement>>(function TableRow({ className, ...props }, ref) {
  return <tr ref={ref} className={className} {...props} />;
});

// 행 높이 40에 아래 선 1px까지 포함 (Figma Table Cell과 같음)
const cellClass = 'sn:box-border sn:h-10 sn:border-b sn:border-default sn:px-3 sn:py-0 sn:align-middle';

export const TableHead = React.forwardRef<HTMLTableCellElement, CellProps>(function TableHead({ align = 'start', className, ...props }, ref) {
  return <th ref={ref} scope="col" className={cn(cellClass, 'sn:text-label sn:text-muted', align === 'end' ? 'sn:text-right' : 'sn:text-left', className)} {...props} />;
});

export const TableCell = React.forwardRef<HTMLTableCellElement, CellProps>(function TableCell({ align = 'start', className, ...props }, ref) {
  return <td ref={ref} className={cn(cellClass, align === 'end' ? 'sn:text-right sn:font-mono' : 'sn:text-left', className)} {...props} />;
});
