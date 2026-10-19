import * as React from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { cn } from '../lib/cn';

export interface FieldProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  /** invalid일 때만 보이고, 그때는 description 자리를 대신해요 */
  error?: React.ReactNode;
  /** 안의 Input에 자동으로 전달돼요. Input에는 invalid를 따로 주지 않아요 */
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, description, error, invalid, disabled, className, children },
  ref,
) {
  const showError = invalid && !!error;
  return (
    <BaseField.Root ref={ref} invalid={invalid} disabled={disabled} className={cn('sn:flex sn:flex-col sn:gap-2 sn:font-sans', className)}>
      <BaseField.Label className="sn:text-label sn:text-default">{label}</BaseField.Label>
      {children}
      {/* 에러가 있으면 설명 자리를 대신함 (DESIGN.md §10 Field) */}
      {description && !showError && <BaseField.Description className="sn:m-0 sn:text-caption sn:text-muted">{description}</BaseField.Description>}
      {showError && (
        <BaseField.Error match className="sn:m-0 sn:text-caption sn:text-danger">
          {error}
        </BaseField.Error>
      )}
    </BaseField.Root>
  );
});
