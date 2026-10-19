import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

const textVariants = cva('sn:m-0 sn:font-sans', {
  variants: {
    variant: {
      display: 'sn:text-display',
      title: 'sn:text-title',
      body: 'sn:text-body',
      'body-strong': 'sn:text-body-strong',
      label: 'sn:text-label',
      caption: 'sn:text-caption',
      mono: 'sn:font-mono sn:text-body sn:tabular-nums',
      'mono-caption': 'sn:font-mono sn:text-caption sn:tabular-nums',
    },
    tone: {
      default: 'sn:text-default',
      muted: 'sn:text-muted',
      danger: 'sn:text-danger',
    },
  },
  defaultVariants: { variant: 'body', tone: 'default' },
});

export type TextVariant = 'display' | 'title' | 'body' | 'body-strong' | 'label' | 'caption' | 'mono' | 'mono-caption';

export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'className'>, Pick<React.LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> {
  variant?: TextVariant;
  tone?: 'default' | 'muted' | 'danger';
  /** 렌더할 태그. 기본값 span */
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'strong' | 'code';
  className?: string;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(function Text({ variant, tone, as = 'span', className, ...props }, ref) {
  return React.createElement(as, { ref, className: cn(textVariants({ variant, tone }), className), ...props });
});
