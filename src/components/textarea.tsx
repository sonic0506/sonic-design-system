import * as React from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { cn } from '../lib/cn';
import { inputClass } from './input';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  invalid?: boolean;
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ invalid, className, rows = 3, ...props }, ref) {
  return (
    <BaseInput
      render={<textarea ref={ref} rows={rows} />}
      aria-invalid={invalid || undefined}
      className={cn(inputClass, 'sn:min-h-20 sn:resize-y sn:py-2', className)}
      {...(props as React.ComponentProps<typeof BaseInput>)}
    />
  );
});
