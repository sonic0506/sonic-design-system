import * as React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { Fieldset } from '@base-ui/react/fieldset';
import { Check, Minus } from 'lucide-react';
import { cn } from '../lib/cn';
import { boxClass } from './popup-styles';

const labelClass = 'sn:inline-flex sn:items-center sn:gap-2 sn:font-sans sn:text-body sn:text-default sn:cursor-pointer';
const disabledClass = 'sn:cursor-not-allowed sn:opacity-(--sn-opacity-disabled)';
const focusClass = 'sn:outline-none sn:focus-visible:outline-2 sn:focus-visible:outline-offset-2 sn:focus-visible:outline-focus';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** 일부만 선택된 상태 (그룹의 상위 항목) */
  indeterminate?: boolean;
  disabled?: boolean;
  /** CheckboxGroup 안에서 쓰는 값 */
  value?: string;
  name?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  { checked, defaultChecked, onCheckedChange, indeterminate, disabled, value, name, className, children },
  ref,
) {
  return (
    <label className={cn(labelClass, disabled && disabledClass, className)}>
      <BaseCheckbox.Root
        ref={ref}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange && (c => onCheckedChange(c))}
        indeterminate={indeterminate}
        disabled={disabled}
        value={value}
        name={name}
        className={cn(boxClass, focusClass, 'sn:data-checked:border-transparent sn:data-checked:bg-primary sn:data-indeterminate:border-transparent sn:data-indeterminate:bg-primary')}
      >
        <BaseCheckbox.Indicator className="sn:flex">{indeterminate ? <Minus /> : <Check />}</BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {children}
    </label>
  );
});

export interface CheckboxGroupProps {
  /** 그룹 이름 (fieldset legend) */
  label: React.ReactNode;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function CheckboxGroup({ label, value, defaultValue, onValueChange, disabled, className, children }: CheckboxGroupProps) {
  return (
    <Fieldset.Root className={cn('sn:m-0 sn:flex sn:min-w-0 sn:flex-col sn:gap-3 sn:border-0 sn:p-0 sn:font-sans', className)}>
      <Fieldset.Legend className="sn:p-0 sn:text-label sn:text-default">{label}</Fieldset.Legend>
      <BaseCheckboxGroup value={value} defaultValue={defaultValue} onValueChange={onValueChange && (v => onValueChange(v))} disabled={disabled} className="sn:flex sn:flex-col sn:gap-2">
        {children}
      </BaseCheckboxGroup>
    </Fieldset.Root>
  );
}

export { labelClass as choiceLabelClass, disabledClass as choiceDisabledClass, focusClass as choiceFocusClass };
