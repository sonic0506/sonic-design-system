import * as React from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

const avatarVariants = cva(
  'sn:box-border sn:inline-flex sn:shrink-0 sn:items-center sn:justify-center sn:overflow-hidden sn:rounded-full sn:bg-subtle sn:align-middle sn:font-sans sn:text-muted sn:select-none',
  {
    variants: {
      size: { sm: 'sn:size-6 sn:text-caption', md: 'sn:size-8 sn:text-label', lg: 'sn:size-10 sn:text-body-strong' },
    },
    defaultVariants: { size: 'md' },
  },
);

export interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  alt?: string;
  /** 이미지가 없거나 불러오지 못했을 때 보여 줄 이니셜 */
  fallback?: React.ReactNode;
  className?: string;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar({ size, src, alt = '', fallback, className }, ref) {
  return (
    <BaseAvatar.Root ref={ref} className={cn(avatarVariants({ size }), className)}>
      {src && <BaseAvatar.Image src={src} alt={alt} className="sn:size-full sn:object-cover" />}
      <BaseAvatar.Fallback>{fallback}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
});
