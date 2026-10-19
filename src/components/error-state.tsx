import * as React from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';
import { Button } from './button';
import { StateLayout } from './state-layout';

export interface ErrorStateProps {
  /** 기본값: triangle-alert */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 있으면 "다시 시도" 버튼을 보여 줘요 */
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({ icon = <TriangleAlert />, title, description, onRetry, retryLabel = '다시 시도', className }: ErrorStateProps) {
  return (
    <StateLayout role="alert" icon={icon} iconClassName="sn:text-danger" title={title} description={description} className={className}>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw />
          {retryLabel}
        </Button>
      )}
    </StateLayout>
  );
}
