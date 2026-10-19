import * as React from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { cn } from '../lib/cn';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
  /** 에러 상태. aria-invalid로 전달돼요 */
  invalid?: boolean;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ invalid, className, ...props }, ref) {
  return (
    <BaseInput
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'sn:box-border sn:m-0 sn:h-8 sn:w-full sn:min-w-0 sn:rounded-md sn:border sn:border-default sn:bg-surface sn:px-3 sn:font-sans sn:text-body sn:text-default sn:placeholder:text-muted sn:transition-colors sn:duration-(--sn-duration-fast) sn:ease-standard sn:hover:not-data-disabled:border-strong sn:focus-visible:outline-2 sn:focus-visible:outline-offset-2 sn:focus-visible:outline-focus sn:aria-invalid:border-danger sn:hover:aria-invalid:border-danger sn:data-invalid:border-danger sn:data-disabled:cursor-not-allowed sn:data-disabled:opacity-(--sn-opacity-disabled)',
        className,
      )}
      {...props}
    />
  );
});
