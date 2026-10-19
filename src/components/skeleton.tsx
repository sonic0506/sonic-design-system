import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

const skeletonVariants = cva(
  'sn:block sn:shrink-0 sn:bg-subtle sn:animate-[sn-pulse_var(--sn-duration-loop)_ease-in-out_infinite] sn:motion-reduce:animate-none',
  {
    variants: {
      shape: {
        text: 'sn:h-3 sn:w-full sn:rounded-sm',
        rect: 'sn:h-16 sn:w-full sn:rounded-md',
        circle: 'sn:size-8 sn:rounded-full',
      },
    },
    defaultVariants: { shape: 'text' },
  },
);

export interface SkeletonProps {
  shape?: 'text' | 'rect' | 'circle';
  /** 크기는 쓰는 곳에서 정해요 (예: className="w-40") */
  className?: string;
}

/** 로딩 자리 표시. 스크린 리더에는 숨겨요 — 로딩 영역 전체에 aria-busy를 두세요 */
export function Skeleton({ shape, className }: SkeletonProps) {
  return <span aria-hidden className={cn(skeletonVariants({ shape }), className)} />;
}
