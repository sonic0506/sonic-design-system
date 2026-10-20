import * as React from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

export interface AccordionProps {
  /** 여러 항목을 함께 열 수 있음 (기본 false) */
  multiple?: boolean;
  /** 열린 항목들의 value */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  className?: string;
  children?: React.ReactNode;
}

/** 닫힌 내용도 브라우저 페이지 찾기로 찾아 열 수 있어요 (hiddenUntilFound) */
export function Accordion({ onValueChange, className, ...props }: AccordionProps) {
  return (
    <BaseAccordion.Root
      {...props}
      hiddenUntilFound
      onValueChange={onValueChange && (v => onValueChange(v as string[]))}
      className={cn('sn:flex sn:flex-col sn:font-sans', className)}
    />
  );
}

export interface AccordionItemProps {
  value?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return <BaseAccordion.Item {...props} className={cn('sn:border-b sn:border-default sn:data-disabled:opacity-(--sn-opacity-disabled)', className)} />;
}

export interface AccordionTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

export function AccordionTrigger({ className, children }: AccordionTriggerProps) {
  return (
    <BaseAccordion.Header className="sn:m-0">
      <BaseAccordion.Trigger
        className={cn(
          'sn:group sn:flex sn:w-full sn:items-center sn:gap-2 sn:rounded-sm sn:border-0 sn:bg-transparent sn:px-0 sn:py-3 sn:text-left sn:font-sans sn:text-body-strong sn:text-default sn:cursor-pointer sn:focus-visible:outline-2 sn:focus-visible:outline-offset-2 sn:focus-visible:outline-focus sn:data-disabled:cursor-not-allowed',
          className,
        )}
      >
        <span className="sn:min-w-0 sn:flex-1">{children}</span>
        <ChevronDown className="sn:size-4 sn:shrink-0 sn:text-muted sn:transition-transform sn:duration-(--sn-duration-normal) sn:ease-standard sn:group-data-panel-open:rotate-180 sn:motion-reduce:transition-none" />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export interface AccordionPanelProps {
  className?: string;
  children?: React.ReactNode;
}

export function AccordionPanel({ className, children }: AccordionPanelProps) {
  return (
    <BaseAccordion.Panel className="sn:h-(--accordion-panel-height) sn:overflow-hidden sn:transition-[height] sn:duration-(--sn-duration-normal) sn:ease-standard sn:data-starting-style:h-0 sn:data-ending-style:h-0 sn:motion-reduce:transition-none">
      <div className={cn('sn:pb-4 sn:font-sans sn:text-body sn:text-muted', className)}>{children}</div>
    </BaseAccordion.Panel>
  );
}
