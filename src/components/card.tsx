import * as React from 'react';
import { cn } from '../lib/cn';

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> & { className?: string };

function slot<E extends HTMLElement>(tag: 'div' | 'h3' | 'p', base: string, name: string) {
  const C = React.forwardRef<E, Omit<React.HTMLAttributes<E>, 'className'> & { className?: string }>(({ className, ...props }, ref) =>
    React.createElement(tag, { ref, className: cn(base, className), ...props }),
  );
  C.displayName = name;
  return C;
}

export type CardProps = DivProps;

export const Card = slot<HTMLDivElement>('div', 'sn:box-border sn:flex sn:flex-col sn:gap-4 sn:rounded-lg sn:border sn:border-default sn:bg-surface sn:p-5 sn:font-sans sn:text-body sn:text-default', 'Card');
export const CardHeader = slot<HTMLDivElement>('div', 'sn:flex sn:flex-col sn:gap-1', 'CardHeader');
export const CardTitle = slot<HTMLHeadingElement>('h3', 'sn:m-0 sn:text-title sn:text-default', 'CardTitle');
export const CardDescription = slot<HTMLParagraphElement>('p', 'sn:m-0 sn:text-body sn:text-muted', 'CardDescription');
export const CardBody = slot<HTMLDivElement>('div', 'sn:flex sn:flex-col sn:gap-2', 'CardBody');
export const CardFooter = slot<HTMLDivElement>('div', 'sn:flex sn:justify-end sn:gap-2', 'CardFooter');
