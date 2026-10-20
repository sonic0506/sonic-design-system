import * as React from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { cn } from '../lib/cn';
import { Button } from './button';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger';

const icons: Record<ToastTone, React.ReactNode> = {
  neutral: <Info className="sn:text-muted" />,
  success: <CircleCheck className="sn:text-success" />,
  warning: <TriangleAlert className="sn:text-warning" />,
  danger: <CircleAlert className="sn:text-danger" />,
};

export interface ToastOptions {
  /** 결과 한 줄 */
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: ToastTone;
  /** 사라지기까지 ms. 0이면 직접 닫을 때까지 남아요 (기본 5000) */
  timeout?: number;
}

/** ToastProvider 안의 클라이언트 컴포넌트에서만 써요 */
export function useToast() {
  const { add, close } = BaseToast.useToastManager();
  return React.useMemo(
    () => ({
      /** 알림을 띄우고 id를 돌려줘요 */
      add: ({ tone = 'neutral', ...options }: ToastOptions) =>
        // danger는 화면 낭독기가 바로 읽어요
        add({ ...options, type: tone, priority: tone === 'danger' ? 'high' : 'low' }),
      /** id가 없으면 모두 닫아요 */
      close: (id?: string) => close(id),
    }),
    [add, close],
  );
}

export interface ToastProviderProps {
  /** 기본 사라지는 시간 ms (기본 5000) */
  timeout?: number;
  children?: React.ReactNode;
}

/** 앱 최상단에 한 번 둬요. 알림은 화면 오른쪽 아래에 쌓여요 */
export function ToastProvider({ timeout, children }: ToastProviderProps) {
  return (
    <BaseToast.Provider timeout={timeout}>
      {children}
      <BaseToast.Portal>
        {/* 새 알림이 아래(모서리 쪽)에 오도록 역순으로 쌓아요 */}
        <BaseToast.Viewport aria-label="알림" className="sn:fixed sn:right-4 sn:bottom-4 sn:z-50 sn:flex sn:w-90 sn:max-w-[calc(100vw-2*var(--sn-space-4))] sn:flex-col-reverse sn:gap-2 sn:outline-none">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map(toast => (
    <BaseToast.Root
      key={toast.id}
      toast={toast}
      className="sn:box-border sn:flex sn:items-start sn:gap-3 sn:rounded-lg sn:border sn:border-default sn:bg-surface sn:p-3 sn:font-sans sn:text-default sn:transition-[opacity,translate] sn:duration-(--sn-duration-normal) sn:ease-standard sn:focus-visible:outline-2 sn:focus-visible:outline-offset-2 sn:focus-visible:outline-focus sn:data-starting-style:translate-y-2 sn:data-starting-style:opacity-0 sn:data-ending-style:translate-y-2 sn:data-ending-style:opacity-0 sn:data-limited:hidden sn:motion-reduce:transition-none"
    >
      {/* 아이콘과 제목 줄을 닫기 버튼(28) 가운데에 맞춰요 */}
      <span className="sn:flex sn:h-7 sn:shrink-0 sn:items-center sn:[&_svg]:size-4">{icons[(toast.type as ToastTone) ?? 'neutral']}</span>
      <div className="sn:flex sn:min-w-0 sn:flex-1 sn:flex-col sn:gap-1 sn:pt-1">
        <BaseToast.Title className="sn:m-0 sn:text-body-strong sn:text-default" />
        <BaseToast.Description className={cn('sn:m-0 sn:text-caption sn:text-muted', !toast.description && 'sn:hidden')} />
      </div>
      <BaseToast.Close render={<Button size="icon-sm" variant="ghost" aria-label="알림 닫기" />}>
        <X />
      </BaseToast.Close>
    </BaseToast.Root>
  ));
}
