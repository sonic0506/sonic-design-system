import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';
import { inputClass } from './input';
import { boxClass, itemClass, popupClass } from './popup-styles';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectBaseProps {
  options: SelectOption[];
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

/** multiple이면 값이 배열이에요 */
export type SelectProps = SelectBaseProps &
  (
    | { multiple?: false; value?: string | null; defaultValue?: string | null; onValueChange?: (value: string | null) => void }
    | { multiple: true; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void }
  );

export function Select(props: SelectProps) {
  const { options, placeholder, invalid, disabled, name, id, className, multiple } = props;
  const labelOf = (v: string) => options.find(o => o.value === v)?.label ?? v;
  return (
    <BaseSelect.Root
      items={options}
      multiple={multiple}
      value={props.value}
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange && ((v: unknown) => (props.onValueChange as (v: unknown) => void)(v))}
      disabled={disabled}
      name={name}
    >
      <BaseSelect.Trigger
        id={id}
        aria-label={props['aria-label']}
        aria-invalid={invalid || undefined}
        className={cn(inputClass, 'sn:group sn:flex sn:h-8 sn:items-center sn:gap-2 sn:text-left sn:cursor-default sn:data-popup-open:border-focus', className)}
      >
        <BaseSelect.Value placeholder={placeholder} className="sn:min-w-0 sn:flex-1 sn:truncate sn:data-placeholder:text-muted">
          {multiple ? (v: string[]) => (v.length ? v.map(labelOf).join(', ') : placeholder) : undefined}
        </BaseSelect.Value>
        <BaseSelect.Icon className="sn:flex sn:text-muted sn:transition-transform sn:duration-(--sn-duration-fast) sn:group-data-popup-open:rotate-180 sn:motion-reduce:transition-none sn:[&_svg]:size-4">
          <ChevronDown />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={4} alignItemWithTrigger={false} className="sn:z-50 sn:outline-none">
          <BaseSelect.Popup className={popupClass}>
            <BaseSelect.List>
              {options.map(o => (
                <BaseSelect.Item key={o.value} value={o.value} disabled={o.disabled} className={itemClass}>
                  {multiple && (
                    <span className={cn(boxClass, 'sn:group-data-selected:border-transparent sn:group-data-selected:bg-primary')}>
                      <BaseSelect.ItemIndicator className="sn:flex">
                        <Check />
                      </BaseSelect.ItemIndicator>
                    </span>
                  )}
                  <BaseSelect.ItemText className="sn:min-w-0 sn:flex-1 sn:truncate">{o.label}</BaseSelect.ItemText>
                  {!multiple && (
                    <BaseSelect.ItemIndicator className="sn:flex">
                      <Check />
                    </BaseSelect.ItemIndicator>
                  )}
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
