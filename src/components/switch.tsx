import * as React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { cn } from '../lib/cn';
import { choiceDisabledClass, choiceFocusClass, choiceLabelClass } from './checkbox';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
  children?: React.ReactNode;
}

/** 누르는 즉시 적용되는 설정에만 써요 */
export const Switch = React.forwardRef<HTMLElement, SwitchProps>(function Switch(
  { checked, defaultChecked, onCheckedChange, disabled, name, className, children },
  ref,
) {
  return (
    <label className={cn(choiceLabelClass, disabled && choiceDisabledClass, className)}>
      <BaseSwitch.Root
        ref={ref}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange && (c => onCheckedChange(c))}
        disabled={disabled}
        name={name}
        className={cn(
          'sn:box-border sn:inline-flex sn:h-4 sn:w-7 sn:shrink-0 sn:items-center sn:rounded-full sn:border sn:border-strong sn:bg-subtle sn:p-px sn:transition-colors sn:duration-(--sn-duration-fast) sn:ease-standard sn:data-checked:border-transparent sn:data-checked:bg-primary sn:motion-reduce:transition-none',
          choiceFocusClass,
        )}
      >
        <BaseSwitch.Thumb className="sn:block sn:size-3 sn:rounded-full sn:bg-surface sn:transition-transform sn:duration-(--sn-duration-fast) sn:ease-standard sn:data-checked:translate-x-3 sn:data-checked:bg-(--sn-color-text-on-primary) sn:motion-reduce:transition-none" />
      </BaseSwitch.Root>
      {children}
    </label>
  );
});
