import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cn } from '../lib/cn';

interface ProgressBaseProps {
  value: number;
  /** 기본 100 */
  max?: number;
  className?: string;
}

/** 라벨이 없으면 읽을 이름이 없어서 aria-label이 필수예요 */
export type ProgressProps = ProgressBaseProps & ({ label: React.ReactNode } | { label?: undefined; 'aria-label': string });

export function Progress({ value, max = 100, className, ...props }: ProgressProps) {
  const label = props.label;
  return (
    <BaseProgress.Root
      value={value}
      max={max}
      aria-label={'aria-label' in props ? props['aria-label'] : undefined}
      className={cn('sn:flex sn:flex-col sn:gap-2 sn:font-sans', className)}
    >
      {label != null && (
        <div className="sn:flex sn:items-center sn:gap-2">
          <BaseProgress.Label className="sn:min-w-0 sn:flex-1 sn:text-label sn:text-default">{label}</BaseProgress.Label>
          <BaseProgress.Value className="sn:font-mono sn:text-caption sn:text-muted" />
        </div>
      )}
      <BaseProgress.Track className="sn:h-1 sn:overflow-hidden sn:rounded-full sn:bg-subtle">
        <BaseProgress.Indicator className="sn:h-full sn:rounded-full sn:bg-primary sn:transition-[width] sn:duration-(--sn-duration-normal) sn:ease-standard sn:motion-reduce:transition-none" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
