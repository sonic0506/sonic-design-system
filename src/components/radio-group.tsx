import * as React from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { Fieldset } from '@base-ui/react/fieldset';
import { cn } from '../lib/cn';
import { choiceDisabledClass, choiceFocusClass, choiceLabelClass } from './checkbox';

export interface RadioGroupProps {
  /** 그룹 이름 (fieldset legend) */
  label: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
  children: React.ReactNode;
}

export function RadioGroup({ label, value, defaultValue, onValueChange, disabled, name, className, children }: RadioGroupProps) {
  return (
    <Fieldset.Root className={cn('sn:m-0 sn:flex sn:min-w-0 sn:flex-col sn:gap-3 sn:border-0 sn:p-0 sn:font-sans', className)}>
      <Fieldset.Legend className="sn:p-0 sn:text-label sn:text-default">{label}</Fieldset.Legend>
      <BaseRadioGroup value={value} defaultValue={defaultValue} onValueChange={onValueChange && (v => onValueChange(v as string))} disabled={disabled} name={name} className="sn:flex sn:flex-col sn:gap-2">
        {children}
      </BaseRadioGroup>
    </Fieldset.Root>
  );
}

export interface RadioProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLElement, RadioProps>(function Radio({ value, disabled, className, children }, ref) {
  return (
    <label className={cn(choiceLabelClass, disabled && choiceDisabledClass, className)}>
      <BaseRadio.Root
        ref={ref}
        value={value}
        disabled={disabled}
        className={cn(
          'sn:box-border sn:inline-flex sn:size-4 sn:shrink-0 sn:items-center sn:justify-center sn:rounded-full sn:border sn:border-strong sn:bg-surface sn:data-checked:border-transparent sn:data-checked:bg-primary',
          choiceFocusClass,
        )}
      >
        <BaseRadio.Indicator className="sn:size-2 sn:rounded-full sn:bg-(--sn-color-text-on-primary)" />
      </BaseRadio.Root>
      {children}
    </label>
  );
});
