import * as React from 'react';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cn } from '../lib/cn';

interface ToggleGroupBaseProps {
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  children?: React.ReactNode;
}

/** 단일은 항상 하나가 눌려 있어요(다시 눌러도 꺼지지 않음). multiple이면 값이 배열이에요 */
export type ToggleGroupProps = ToggleGroupBaseProps &
  (
    | { multiple?: false; value?: string; defaultValue?: string; onValueChange?: (value: string) => void }
    | { multiple: true; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void }
  );

const groupClass = 'sn:inline-flex sn:items-center sn:rounded-md sn:bg-subtle sn:p-1';

export function ToggleGroup(props: ToggleGroupProps) {
  const { disabled, className, children } = props;
  const [inner, setInner] = React.useState(props.multiple ? undefined : props.defaultValue);
  const common = { disabled, 'aria-label': props['aria-label'], className: cn(groupClass, className) };

  if (props.multiple) {
    return (
      <BaseToggleGroup {...common} multiple value={props.value} defaultValue={props.defaultValue} onValueChange={props.onValueChange && (v => props.onValueChange!(v))}>
        {children}
      </BaseToggleGroup>
    );
  }
  const current = props.value !== undefined ? props.value : inner;
  return (
    <BaseToggleGroup
      {...common}
      value={current === undefined ? [] : [current]}
      onValueChange={v => {
        if (!v.length) return; // 눌린 항목을 다시 눌러도 그대로 둬요
        setInner(v[0]);
        props.onValueChange?.(v[0]);
      }}
    >
      {children}
    </BaseToggleGroup>
  );
}

interface ToggleGroupItemBaseProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/** 아이콘만 있는 항목은 읽을 글자가 없어서 aria-label이 필수예요 */
export type ToggleGroupItemProps = ToggleGroupItemBaseProps & ({ iconOnly?: false; 'aria-label'?: string } | { iconOnly: true; 'aria-label': string });

// 항목끼리 붙어 있어서 포커스 링은 Tab처럼 안쪽(-2px)에 그려요
const itemClass =
  'sn:box-border sn:inline-flex sn:h-6 sn:items-center sn:justify-center sn:gap-1 sn:rounded-sm sn:border sn:border-transparent sn:bg-transparent sn:px-2 sn:font-sans sn:text-label sn:text-muted sn:cursor-pointer sn:select-none sn:transition-colors sn:duration-(--sn-duration-fast) sn:ease-standard sn:hover:not-data-disabled:text-default sn:data-pressed:border-default sn:data-pressed:bg-surface sn:data-pressed:text-default sn:focus-visible:outline-2 sn:focus-visible:-outline-offset-2 sn:focus-visible:outline-focus sn:data-disabled:cursor-not-allowed sn:data-disabled:opacity-(--sn-opacity-disabled) sn:motion-reduce:transition-none sn:[&_svg]:size-4 sn:[&_svg]:shrink-0';

export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(function ToggleGroupItem({ value, disabled, iconOnly, className, children, ...props }, ref) {
  return (
    <BaseToggle ref={ref} value={value} disabled={disabled} aria-label={props['aria-label']} className={cn(itemClass, iconOnly && 'sn:w-6 sn:px-0', className)}>
      {children}
    </BaseToggle>
  );
});
