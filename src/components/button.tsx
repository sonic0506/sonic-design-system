import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { cn } from '../lib/cn';

/** 링크를 버튼 모양으로 그릴 때: <NextLink className={buttonVariants({ variant: 'secondary' })} /> */
export const buttonVariants = cva(
  'sn:box-border sn:inline-flex sn:items-center sn:justify-center sn:gap-2 sn:whitespace-nowrap sn:rounded-md sn:border sn:border-transparent sn:font-sans sn:cursor-pointer sn:select-none sn:transition-colors sn:duration-(--sn-duration-fast) sn:ease-standard sn:focus-visible:outline-2 sn:focus-visible:outline-offset-2 sn:focus-visible:outline-focus sn:data-disabled:not-data-loading:cursor-not-allowed sn:data-disabled:not-data-loading:opacity-(--sn-opacity-disabled) sn:data-loading:cursor-progress sn:[&_svg]:pointer-events-none sn:[&_svg]:shrink-0',
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
        // 아이콘만 있는 정사각형 버튼
        'icon-sm': 'sn:size-7 sn:p-0 sn:[&_svg]:size-4',
        'icon-md': 'sn:size-8 sn:p-0 sn:[&_svg]:size-4',
        'icon-lg': 'sn:size-10 sn:p-0 sn:[&_svg]:size-5',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

interface ButtonBaseProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
  /** 다른 요소로 렌더링할 때. 링크는 role="button"이 붙으니 buttonVariants를 쓰세요 */
  render?: React.ReactElement;
  /** 진행 중: 스피너 표시, 클릭 막기, 포커스 유지, aria-busy */
  loading?: boolean;
}

/** 아이콘만 있는 버튼은 읽을 글자가 없어서 aria-label이 필수예요 */
export type ButtonProps = ButtonBaseProps &
  ({ size?: 'sm' | 'md' | 'lg' } | { size: 'icon-sm' | 'icon-md' | 'icon-lg'; 'aria-label': string });

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, render, loading, disabled, children, ...props },
  ref,
) {
  const spinner = <LoaderCircle className="sn:animate-[sn-spin_var(--sn-duration-loop)_linear_infinite] sn:motion-reduce:animate-none" />;
  return (
    <BaseButton
      ref={ref}
      render={render}
      nativeButton={!render || render.type === 'button'}
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading && size?.startsWith('icon-') ? spinner : loading ? <>{spinner}{children}</> : children}
    </BaseButton>
  );
});
