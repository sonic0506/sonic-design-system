import * as React from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '../lib/cn';
import { itemClass, popupClass } from './popup-styles';

export interface MenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function Menu({ onOpenChange, ...props }: MenuProps) {
  return <BaseMenu.Root {...props} onOpenChange={onOpenChange && (open => onOpenChange(open))} />;
}

export interface MenuTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  className?: string;
  /** 보통 sonic-ui Button: render={<Button size="icon-md" variant="ghost" aria-label="더 보기" />} */
  render?: React.ReactElement;
}

export const MenuTrigger = React.forwardRef<HTMLButtonElement, MenuTriggerProps>(function MenuTrigger(props, ref) {
  return <BaseMenu.Trigger ref={ref} {...props} />;
});

export interface MenuPopupProps {
  className?: string;
  children?: React.ReactNode;
}

// Portal + Positioner + Popup (트리거 아래 4px, 시작 정렬)
export const MenuPopup = React.forwardRef<HTMLDivElement, MenuPopupProps>(function MenuPopup({ className, children }, ref) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner sideOffset={4} align="start" className="sn:z-50 sn:outline-none">
        <BaseMenu.Popup ref={ref} className={cn(popupClass, 'sn:min-w-48', className)}>
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
});

export interface MenuItemProps {
  /** danger: 삭제처럼 위험한 동작. 맨 아래, 구분선 뒤에 둬요 */
  tone?: 'default' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  /** 고른 뒤 메뉴를 닫을지 (기본 true) */
  closeOnClick?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem({ tone = 'default', onClick, disabled, closeOnClick, className, children }, ref) {
  return (
    <BaseMenu.Item
      ref={ref}
      onClick={onClick && (() => onClick())}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={cn(itemClass, tone === 'danger' ? 'sn:text-danger' : 'sn:text-default', className)}
    >
      {children}
    </BaseMenu.Item>
  );
});

export function MenuSeparator({ className }: { className?: string }) {
  return <BaseMenu.Separator className={cn('sn:my-1 sn:h-px sn:border-0 sn:bg-(--sn-color-border-default)', className)} />;
}
