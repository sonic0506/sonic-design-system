import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

const buttonVariants = cva(
  'sn:box-border sn:inline-flex sn:items-center sn:justify-center sn:gap-2 sn:whitespace-nowrap sn:rounded-md sn:border sn:border-transparent sn:font-sans sn:cursor-pointer sn:select-none sn:transition-colors sn:duration-(--sn-duration-fast) sn:ease-standard sn:focus-visible:outline-2 sn:focus-visible:outline-offset-2 sn:focus-visible:outline-focus sn:data-disabled:cursor-not-allowed sn:data-disabled:opacity-(--sn-opacity-disabled) sn:[&_svg]:pointer-events-none sn:[&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'sn:bg-primary sn:text-on-primary sn:hover:not-data-disabled:bg-primary-hover',
        secondary: 'sn:border-default sn:bg-surface sn:text-default sn:hover:not-data-disabled:bg-subtle',
        ghost: 'sn:bg-transparent sn:text-default sn:hover:not-data-disabled:bg-subtle',
        danger: 'sn:bg-danger sn:text-on-danger',
      },
      size: {
        sm: 'sn:h-7 sn:px-2 sn:text-label sn:[&_svg]:size-4',
        md: 'sn:h-8 sn:px-3 sn:text-body-strong sn:[&_svg]:size-4',
        lg: 'sn:h-10 sn:px-4 sn:text-body-strong sn:[&_svg]:size-5',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** 다른 요소로 렌더링할 때 (예: render={<a href="/" />}) */
  render?: React.ReactElement;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, render, ...props },
  ref,
) {
  return (
    <BaseButton
      ref={ref}
      render={render}
      nativeButton={!render || render.type === 'button'}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
});
