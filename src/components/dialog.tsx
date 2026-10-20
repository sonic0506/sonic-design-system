import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cn } from '../lib/cn';

// Dialog·AlertDialog 공통 스타일
export const backdropClass =
  'sn:fixed sn:inset-0 sn:z-50 sn:bg-overlay sn:transition-opacity sn:duration-(--sn-duration-normal) sn:ease-standard sn:data-starting-style:opacity-0 sn:data-ending-style:opacity-0 sn:motion-reduce:transition-none';
export const dialogPopupClass =
  'sn:fixed sn:top-1/2 sn:left-1/2 sn:z-50 sn:box-border sn:flex sn:w-110 sn:max-w-[calc(100vw-2*var(--sn-space-4))] sn:-translate-x-1/2 sn:-translate-y-1/2 sn:flex-col sn:gap-4 sn:rounded-lg sn:border sn:border-default sn:bg-surface sn:p-6 sn:font-sans sn:text-body sn:text-default sn:outline-none sn:transition-[opacity,scale] sn:duration-(--sn-duration-normal) sn:ease-standard sn:data-starting-style:scale-98 sn:data-starting-style:opacity-0 sn:data-ending-style:scale-98 sn:data-ending-style:opacity-0 sn:motion-reduce:transition-none';
export const dialogTitleClass = 'sn:m-0 sn:text-title sn:text-default';
export const dialogDescriptionClass = 'sn:-mt-3 sn:mb-0 sn:text-caption sn:text-muted';

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function Dialog({ onOpenChange, ...props }: DialogProps) {
  return <BaseDialog.Root {...props} onOpenChange={onOpenChange && (open => onOpenChange(open))} />;
}

export interface DialogButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  className?: string;
  /** 보통 sonic-ui Button을 넘겨요: render={<Button variant="secondary" />} */
  render?: React.ReactElement;
}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogButtonProps>(function DialogTrigger(props, ref) {
  return <BaseDialog.Trigger ref={ref} {...props} />;
});

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogButtonProps>(function DialogClose(props, ref) {
  return <BaseDialog.Close ref={ref} {...props} />;
});

export interface DialogPopupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
}

// Portal + Backdrop + Popup을 한 번에 그림 (DESIGN.md §10 Dialog)
export const DialogPopup = React.forwardRef<HTMLDivElement, DialogPopupProps>(function DialogPopup({ className, ...props }, ref) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={backdropClass} />
      <BaseDialog.Popup
        ref={ref}
        className={cn(dialogPopupClass, className)}
        {...props}
      />
    </BaseDialog.Portal>
  );
});

export type TextProps<E extends HTMLElement> = Omit<React.HTMLAttributes<E>, 'className'> & { className?: string };

export const DialogTitle = React.forwardRef<HTMLHeadingElement, TextProps<HTMLHeadingElement>>(function DialogTitle({ className, ...props }, ref) {
  return <BaseDialog.Title ref={ref} className={cn(dialogTitleClass, className)} {...props} />;
});

export const DialogDescription = React.forwardRef<HTMLParagraphElement, TextProps<HTMLParagraphElement>>(function DialogDescription({ className, ...props }, ref) {
  return <BaseDialog.Description ref={ref} className={cn(dialogDescriptionClass, className)} {...props} />;
});

export const DialogFooter = React.forwardRef<HTMLDivElement, TextProps<HTMLDivElement>>(function DialogFooter({ className, ...props }, ref) {
  return <div ref={ref} className={cn('sn:mt-2 sn:flex sn:justify-end sn:gap-2', className)} {...props} />;
});
