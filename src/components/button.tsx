import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { LoaderCircle } from 'lucide-react';
import { cn } from '../lib/cn';
import { buttonVariants } from './button-variants';

interface ButtonBaseProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
  /** 다른 요소로 렌더링할 때. 링크는 role="button"이 붙으니 buttonVariants를 쓰세요 */
  render?: React.ReactElement;
  /** 진행 중: 스피너 표시, 클릭 막기, 포커스 유지, aria-busy */
  loading?: boolean;
  /** 비활성이 돼도 포커스를 잃지 않아요. 누른 뒤 비활성이 되는 버튼에 써요 (예: 마지막 페이지) */
  focusableWhenDisabled?: boolean;
}

/** 아이콘만 있는 버튼은 읽을 글자가 없어서 aria-label이 필수예요 */
export type ButtonProps = ButtonBaseProps &
  ({ size?: 'sm' | 'md' | 'lg' } | { size: 'icon-sm' | 'icon-md' | 'icon-lg'; 'aria-label': string });

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, render, loading, disabled, focusableWhenDisabled, children, ...props },
  ref,
) {
  const spinner = <LoaderCircle className="sn:animate-[sn-spin_var(--sn-duration-loop)_linear_infinite] sn:motion-reduce:animate-none" />;
  return (
    <BaseButton
      ref={ref}
      render={render}
      nativeButton={!render || render.type === 'button'}
      disabled={disabled || loading}
      focusableWhenDisabled={loading || focusableWhenDisabled}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading && size?.startsWith('icon-') ? spinner : loading ? <>{spinner}{children}</> : children}
    </BaseButton>
  );
});
