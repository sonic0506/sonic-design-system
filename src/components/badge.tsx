import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'sn:box-border sn:inline-flex sn:h-5 sn:shrink-0 sn:items-center sn:gap-1 sn:whitespace-nowrap sn:rounded-sm sn:px-2 sn:font-sans sn:text-label sn:[&_svg]:size-3 sn:[&_svg]:shrink-0',
  {
    variants: {
      tone: { neutral: '', success: '', warning: '', danger: '' },
      variant: { subtle: '', solid: '' },
    },
    compoundVariants: [
      { tone: 'neutral', variant: 'subtle', className: 'sn:bg-subtle sn:text-default' },
      { tone: 'neutral', variant: 'solid', className: 'sn:bg-inverse sn:text-inverse' },
      { tone: 'success', variant: 'subtle', className: 'sn:bg-success-subtle sn:text-success' },
      { tone: 'success', variant: 'solid', className: 'sn:bg-success sn:text-on-success' },
      { tone: 'warning', variant: 'subtle', className: 'sn:bg-warning-subtle sn:text-warning' },
      { tone: 'warning', variant: 'solid', className: 'sn:bg-warning sn:text-on-warning' },
      { tone: 'danger', variant: 'subtle', className: 'sn:bg-danger-subtle sn:text-danger' },
      { tone: 'danger', variant: 'solid', className: 'sn:bg-danger sn:text-on-danger' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'subtle' },
  },
);

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> {
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  /** 목록·표에서는 subtle, 꼭 눈에 띄어야 하는 한 곳에만 solid */
  variant?: 'subtle' | 'solid';
  className?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ tone, variant, className, ...props }, ref) {
  return <span ref={ref} className={cn(badgeVariants({ tone, variant }), className)} {...props} />;
});
