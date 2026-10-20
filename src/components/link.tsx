import * as React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '../lib/cn';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  /** 새 탭으로 열고 external-link 아이콘을 붙여요 */
  external?: boolean;
  className?: string;
  /** 다른 링크 컴포넌트로 렌더링 (예: render={<NextLink href="/docs" />}) */
  render?: React.ReactElement<Record<string, unknown>>;
}

// 색은 본문과 같고 밑줄로 구분해요 (DESIGN.md §10 Link, 원칙 2)
const linkClass =
  'sn:rounded-sm sn:text-default sn:underline sn:underline-offset-2 sn:transition-colors sn:duration-(--sn-duration-fast) sn:ease-standard sn:hover:text-muted sn:focus-visible:outline-2 sn:focus-visible:outline-offset-2 sn:focus-visible:outline-focus sn:motion-reduce:transition-none';

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link({ external, className, render, children, ...props }, ref) {
  const content = external ? (
    <>
      {children}
      <ExternalLink className="sn:ml-1 sn:inline-block sn:size-4 sn:align-text-bottom" />
      <span className="sn:sr-only">(새 탭에서 열림)</span>
    </>
  ) : (
    children
  );
  const linkProps = {
    ref,
    className: cn(linkClass, className),
    ...(external && { target: '_blank', rel: 'noopener noreferrer' }),
    ...props,
  };
  return render ? React.cloneElement(render, linkProps, content) : <a {...linkProps}>{content}</a>;
});
