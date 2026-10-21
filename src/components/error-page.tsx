import * as React from 'react';
import { cn } from '../lib/cn';
import { illustrations } from './illustration';

export type ErrorPageStatus = 404 | 403 | 500;

// 상태별 기본 문구 (DESIGN.md §10 ErrorPage)
const copy: Record<ErrorPageStatus, [string, string]> = {
  404: ['페이지를 찾을 수 없어요', '주소가 바뀌었거나 삭제된 페이지예요. 주소를 확인해 주세요.'],
  403: ['이 페이지를 볼 권한이 없어요', '관리자에게 권한을 요청해 주세요.'],
  500: ['서버에 문제가 생겼어요', '잠시 뒤 다시 시도해 주세요.'],
};

export interface ErrorPageProps {
  status: ErrorPageStatus;
  /** 기본값: 상태별 문구 */
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** 보통 primary <Button> 하나 (예: 홈으로 가기) */
  action?: React.ReactNode;
  className?: string;
}

/** 화면 전체 에러. 제목이 페이지의 h1이에요 */
export function ErrorPage({ status, title = copy[status][0], description = copy[status][1], action, className }: ErrorPageProps) {
  return (
    <div className={cn('sn:box-border sn:flex sn:w-full sn:flex-col sn:items-center sn:gap-6 sn:px-6 sn:py-16 sn:text-center sn:font-sans', className)}>
      {/* 장식 이미지. 숫자는 그림 안에 있고 내용은 제목이 전해요 */}
      <img src={illustrations[status]} alt="" width={320} height={213} className="sn:block sn:h-auto sn:max-w-full" />
      <div className="sn:flex sn:flex-col sn:items-center sn:gap-2">
        <p className="sn:m-0 sn:font-mono sn:text-caption sn:tabular-nums sn:text-muted">오류 코드 {status}</p>
        <h1 className="sn:m-0 sn:text-title sn:text-default">{title}</h1>
        {description && <p className="sn:m-0 sn:text-body sn:text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
