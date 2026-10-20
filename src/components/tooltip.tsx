import * as React from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cn } from '../lib/cn';

export interface TooltipProps {
  /** 보여 줄 짧은 이름. 중요한 정보나 클릭할 요소는 넣지 않아요 */
  content: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  /** 대상 요소 하나 (보통 아이콘 버튼) */
  children: React.ReactElement;
}

/** 마우스는 600ms 뒤, 키보드 포커스는 바로 보여요 */
export function Tooltip({ content, side = 'top', className, children }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={4} className="sn:z-50">
          <BaseTooltip.Popup
            className={cn(
              'sn:origin-(--transform-origin) sn:rounded-md sn:bg-inverse sn:px-2 sn:py-1 sn:font-sans sn:text-caption sn:text-inverse sn:transition-[opacity,scale] sn:duration-(--sn-duration-fast) sn:ease-standard sn:data-starting-style:scale-98 sn:data-starting-style:opacity-0 sn:data-ending-style:scale-98 sn:data-ending-style:opacity-0 sn:motion-reduce:transition-none',
              className,
            )}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
