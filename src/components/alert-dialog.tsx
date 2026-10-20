import * as React from 'react';
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { cn } from '../lib/cn';
import { backdropClass, dialogDescriptionClass, dialogPopupClass, dialogTitleClass, DialogFooter, type DialogButtonProps, type DialogPopupProps, type DialogProps, type TextProps } from './dialog';

/** 되돌릴 수 없는 동작(삭제 등) 확인. Dialog와 같은 모양이고 바깥을 눌러도 닫히지 않아요 */
export function AlertDialog({ onOpenChange, ...props }: DialogProps) {
  return <BaseAlertDialog.Root {...props} onOpenChange={onOpenChange && (open => onOpenChange(open))} />;
}

export const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, DialogButtonProps>(function AlertDialogTrigger(props, ref) {
  return <BaseAlertDialog.Trigger ref={ref} {...props} />;
});

export const AlertDialogClose = React.forwardRef<HTMLButtonElement, DialogButtonProps>(function AlertDialogClose(props, ref) {
  return <BaseAlertDialog.Close ref={ref} {...props} />;
});

export const AlertDialogPopup = React.forwardRef<HTMLDivElement, DialogPopupProps>(function AlertDialogPopup({ className, ...props }, ref) {
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop className={backdropClass} />
      <BaseAlertDialog.Popup ref={ref} className={cn(dialogPopupClass, className)} {...props} />
    </BaseAlertDialog.Portal>
  );
});

export const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, TextProps<HTMLHeadingElement>>(function AlertDialogTitle({ className, ...props }, ref) {
  return <BaseAlertDialog.Title ref={ref} className={cn(dialogTitleClass, className)} {...props} />;
});

export const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, TextProps<HTMLParagraphElement>>(function AlertDialogDescription({ className, ...props }, ref) {
  return <BaseAlertDialog.Description ref={ref} className={cn(dialogDescriptionClass, className)} {...props} />;
});

export const AlertDialogFooter = DialogFooter;
