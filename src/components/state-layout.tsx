import * as React from 'react';
import { cn } from '../lib/cn';

// EmptyState·ErrorState 공통 배치 (DESIGN.md §10). 공개하지 않음
export interface StateLayoutProps {
  /** 넘기면 아이콘 원(48), 없으면 일러스트(120) */
  icon?: React.ReactNode;
  iconClassName: string;
  /** 일러스트 주소 */
  illustration: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  role?: 'alert';
  children?: React.ReactNode;
}

export function StateLayout({ icon, iconClassName, illustration, title, description, className, role, children }: StateLayoutProps) {
  return (
    <div role={role} className={cn('sn:box-border sn:flex sn:flex-col sn:items-center sn:gap-4 sn:px-6 sn:py-12 sn:text-center sn:font-sans', className)}>
      {icon ? (
        <span aria-hidden className={cn('sn:inline-flex sn:size-12 sn:items-center sn:justify-center sn:rounded-full sn:bg-subtle sn:[&_svg]:size-6', iconClassName)}>
          {icon}
        </span>
      ) : (
        // 장식 이미지. 내용은 제목과 설명이 전해요
        <img src={illustration} alt="" width={120} height={120} className="sn:block" />
      )}
      <div className="sn:flex sn:flex-col sn:gap-1">
        <p className="sn:m-0 sn:text-body-strong sn:text-default">{title}</p>
        {description && <p className="sn:m-0 sn:text-body sn:text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
