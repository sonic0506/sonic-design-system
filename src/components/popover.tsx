import * as React from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cn } from '../lib/cn';
import { popupClass } from './popup-styles';
import type { TextProps } from './dialog';

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function Popover({ onOpenChange, ...props }: PopoverProps) {
  return <BasePopover.Root {...props} onOpenChange={onOpenChange && (open => onOpenChange(open))} />;
}

export interface PopoverButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  className?: string;
  render?: React.ReactElement;
}

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverButtonProps>(function PopoverTrigger(props, ref) {
  return <BasePopover.Trigger ref={ref} {...props} />;
});

export const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverButtonProps>(function PopoverClose(props, ref) {
  return <BasePopover.Close ref={ref} {...props} />;
});

export interface PopoverPopupProps {
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
}

// Portal + Positioner + Popup (대상에서 8px)
export const PopoverPopup = React.forwardRef<HTMLDivElement, PopoverPopupProps>(function PopoverPopup({ side = 'bottom', className, children }, ref) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner side={side} sideOffset={8} align="start" className="sn:z-50 sn:outline-none">
        <BasePopover.Popup ref={ref} className={cn(popupClass, 'sn:flex sn:w-80 sn:max-w-[calc(100vw-2*var(--sn-space-4))] sn:min-w-0 sn:flex-col sn:gap-3 sn:p-4', className)}>
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
});

export const PopoverTitle = React.forwardRef<HTMLHeadingElement, TextProps<HTMLHeadingElement>>(function PopoverTitle({ className, ...props }, ref) {
  return <BasePopover.Title ref={ref} className={cn('sn:m-0 sn:text-body-strong sn:text-default', className)} {...props} />;
});

export const PopoverDescription = React.forwardRef<HTMLParagraphElement, TextProps<HTMLParagraphElement>>(function PopoverDescription({ className, ...props }, ref) {
  return <BasePopover.Description ref={ref} className={cn('sn:-mt-2 sn:mb-0 sn:text-caption sn:text-muted', className)} {...props} />;
});
