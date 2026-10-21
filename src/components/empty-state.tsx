import * as React from 'react';
import { illustrations } from './illustration';
import { StateLayout } from './state-layout';

export interface EmptyStateProps {
  /** 없으면 캐릭터 일러스트(120). 좁은 곳에서는 lucide 아이콘을 넘겨요 (24px로 맞춰져요) */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 다음에 할 행동 하나. 보통 <Button> */
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <StateLayout icon={icon} iconClassName="sn:text-muted" illustration={illustrations.empty} title={title} description={description} className={className}>
      {action}
    </StateLayout>
  );
}
