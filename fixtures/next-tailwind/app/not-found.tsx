// 서버 컴포넌트에서 ErrorPage 사용 (없는 주소로 들어오면 보여요)
import { buttonVariants, ErrorPage } from '@xonic0506/sonic-ui';

export default function NotFound() {
  return <ErrorPage status={404} action={<a href="/" className={buttonVariants()}>홈으로 가기</a>} />;
}
