import * as React from 'react';
import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cn } from '../lib/cn';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/** 관련 없는 묶음 사이를 나눌 때만 써요. 1px border/default */
export function Separator({ orientation = 'horizontal', className }: SeparatorProps) {
  return (
    <BaseSeparator
      orientation={orientation}
      className={cn('sn:shrink-0 sn:border-0 sn:bg-(--sn-color-border-default)', orientation === 'horizontal' ? 'sn:h-px sn:w-full' : 'sn:w-px sn:self-stretch', className)}
    />
  );
}
