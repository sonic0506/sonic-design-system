import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

const textVariants = cva('sn:m-0 sn:font-sans', {
  variants: {
    variant: {
      'heading-1': 'sn:text-heading-1',
      'title-1': 'sn:text-title-1',
      'body-1': 'sn:text-body-1',
      'body-2': 'sn:text-body-2',
      'body-3': 'sn:text-body-3',
      'mono-1': 'sn:font-mono sn:text-body-1 sn:tabular-nums',
      'mono-2': 'sn:font-mono sn:text-body-3 sn:tabular-nums',
    },
    // 없으면 단계의 기본 굵기 (Figma에서 그 단계의 가장 가는 스타일)
    weight: {
      regular: 'sn:font-regular',
      medium: 'sn:font-medium',
      semibold: 'sn:font-semibold',
    },
    tone: {
      default: 'sn:text-default',
      muted: 'sn:text-muted',
      danger: 'sn:text-danger',
    },
  },
  defaultVariants: { variant: 'body-1', tone: 'default' },
});

export type TextVariant = 'heading-1' | 'title-1' | 'body-1' | 'body-2' | 'body-3' | 'mono-1' | 'mono-2';

export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'className'>, Pick<React.LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> {
  variant?: TextVariant;
  /** 굵기. 없으면 단계 기본값 (body-1은 regular, body-2는 medium …) */
  weight?: 'regular' | 'medium' | 'semibold';
  tone?: 'default' | 'muted' | 'danger';
  /** 렌더할 태그. 기본값 span */
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'strong' | 'code';
  className?: string;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(function Text({ variant, weight, tone, as = 'span', className, ...props }, ref) {
  return React.createElement(as, { ref, className: cn(textVariants({ variant, weight, tone }), className), ...props });
});
