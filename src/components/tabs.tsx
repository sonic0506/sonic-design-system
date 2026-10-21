import * as React from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cn } from '../lib/cn';

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

/** 같은 대상의 다른 보기를 오갈 때 써요. 페이지 이동 링크에는 쓰지 않아요 */
export function Tabs({ value, defaultValue, onValueChange, className, children }: TabsProps) {
  return (
    <BaseTabs.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange && (v => onValueChange(v as string))} className={cn('sn:flex sn:flex-col sn:gap-4 sn:font-sans', className)}>
      {children}
    </BaseTabs.Root>
  );
}

export interface TabsListProps {
  /** 화살표 키로 이동하면 바로 탭을 바꿀지 (기본 true). false면 화살표로 이동하고 Enter·Space로 바꿔요 */
  activateOnFocus?: boolean;
  /** 끝에서 화살표를 누르면 처음으로 돌아갈지 (기본 true) */
  loopFocus?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function TabsList({ activateOnFocus = true, loopFocus = true, className, children }: TabsListProps) {
  return (
    // 탭이 넘치면 가로 스크롤 (막대는 숨김). pb-px는 목록 아래로 1px 내려오는 표시 막대 자리예요
    <div className="sn:-mb-px sn:overflow-x-auto sn:pb-px sn:[scrollbar-width:none]">
      <BaseTabs.List activateOnFocus={activateOnFocus} loopFocus={loopFocus} className={cn('sn:relative sn:flex sn:w-max sn:min-w-full sn:border-b sn:border-default', className)}>
        {children}
        <BaseTabs.Indicator className="sn:absolute sn:bottom-[-1px] sn:left-0 sn:h-0.5 sn:w-(--active-tab-width) sn:translate-x-(--active-tab-left) sn:bg-primary sn:transition-[translate,width] sn:duration-(--sn-duration-normal) sn:ease-standard sn:motion-reduce:transition-none" />
      </BaseTabs.List>
    </div>
  );
}

export interface TabProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(function Tab({ value, disabled, className, children }, ref) {
  return (
    <BaseTabs.Tab
      ref={ref}
      value={value}
      disabled={disabled}
      className={cn(
        'sn:box-border sn:flex sn:h-8 sn:shrink-0 sn:items-center sn:whitespace-nowrap sn:border-0 sn:bg-transparent sn:px-3 sn:font-sans sn:text-body-strong sn:text-muted sn:cursor-pointer sn:focus-visible:outline-2 sn:focus-visible:-outline-offset-2 sn:focus-visible:outline-focus sn:transition-colors sn:duration-(--sn-duration-fast) sn:hover:not-data-disabled:text-default sn:data-active:text-default sn:data-disabled:cursor-not-allowed sn:data-disabled:opacity-(--sn-opacity-disabled)',
        className,
      )}
    >
      {children}
    </BaseTabs.Tab>
  );
});

export function TabsPanel({ value, className, children }: { value: string; className?: string; children?: React.ReactNode }) {
  return (
    <BaseTabs.Panel value={value} className={cn('sn:text-body sn:text-default sn:focus-visible:outline-2 sn:focus-visible:outline-offset-2 sn:focus-visible:outline-focus', className)}>
      {children}
    </BaseTabs.Panel>
  );
}
