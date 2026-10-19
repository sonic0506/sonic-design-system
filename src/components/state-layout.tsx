import * as React from 'react';
import { cn } from '../lib/cn';

// EmptyState·ErrorState 공통 배치 (DESIGN.md §10). 공개하지 않음
export interface StateLayoutProps {
  icon?: React.ReactNode;
  iconClassName: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  role?: 'alert';
  children?: React.ReactNode;
}

export function StateLayout({ icon, iconClassName, title, description, className, role, children }: StateLayoutProps) {
  return (
    <div role={role} className={cn('sn:box-border sn:flex sn:flex-col sn:items-center sn:gap-4 sn:px-6 sn:py-12 sn:text-center sn:font-sans', className)}>
      {icon && (
        <span aria-hidden className={cn('sn:inline-flex sn:size-12 sn:items-center sn:justify-center sn:rounded-full sn:bg-subtle sn:[&_svg]:size-6', iconClassName)}>
          {icon}
        </span>
      )}
      <div className="sn:flex sn:flex-col sn:gap-1">
        <p className="sn:m-0 sn:text-body-strong sn:text-default">{title}</p>
        {description && <p className="sn:m-0 sn:text-body sn:text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
