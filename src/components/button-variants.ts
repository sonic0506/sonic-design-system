// 서버 컴포넌트에서도 호출할 수 있게 'use client' 없는 모듈에 둬요
import { cva } from 'class-variance-authority';

/** 링크를 버튼 모양으로 그릴 때: <NextLink className={buttonVariants({ variant: 'secondary' })} /> */
export const buttonVariants = cva(
  'sn:box-border sn:inline-flex sn:items-center sn:justify-center sn:gap-2 sn:whitespace-nowrap sn:rounded-md sn:border sn:border-transparent sn:font-sans sn:cursor-pointer sn:select-none sn:transition-colors sn:duration-(--sn-duration-fast) sn:ease-standard sn:focus-visible:outline-2 sn:focus-visible:outline-offset-2 sn:focus-visible:outline-focus sn:data-disabled:not-data-loading:cursor-not-allowed sn:data-disabled:not-data-loading:opacity-(--sn-opacity-disabled) sn:data-loading:cursor-progress sn:[&_svg]:pointer-events-none sn:[&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'sn:bg-primary sn:text-on-primary sn:hover:not-data-disabled:bg-primary-hover',
        secondary: 'sn:border-default sn:bg-surface sn:text-default sn:hover:not-data-disabled:bg-subtle',
        ghost: 'sn:bg-transparent sn:text-default sn:hover:not-data-disabled:bg-subtle',
        danger: 'sn:bg-danger sn:text-on-danger',
      },
      size: {
        sm: 'sn:h-7 sn:px-2 sn:text-label sn:[&_svg]:size-4',
        md: 'sn:h-8 sn:px-3 sn:text-body-strong sn:[&_svg]:size-4',
        lg: 'sn:h-10 sn:px-4 sn:text-body-strong sn:[&_svg]:size-5',
        // 아이콘만 있는 정사각형 버튼
        'icon-sm': 'sn:size-7 sn:p-0 sn:[&_svg]:size-4',
        'icon-md': 'sn:size-8 sn:p-0 sn:[&_svg]:size-4',
        'icon-lg': 'sn:size-10 sn:p-0 sn:[&_svg]:size-5',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);
