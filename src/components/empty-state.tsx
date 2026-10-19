import * as React from 'react';
import { StateLayout } from './state-layout';

export interface EmptyStateProps {
  /** lucide 아이콘 (24px로 맞춰져요) */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 다음에 할 행동 하나. 보통 <Button> */
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <StateLayout icon={icon} iconClassName="sn:text-muted" title={title} description={description} className={className}>
      {action}
    </StateLayout>
  );
}
