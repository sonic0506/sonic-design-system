// 서버 컴포넌트에서 sonic-ui를 그대로 사용
import { Button, Dialog, DialogTrigger, DialogPopup, DialogTitle, DialogDescription, DialogFooter, DialogClose, Field, Input, Skeleton, EmptyState, ErrorState, Badge, Progress, Tabs, TabsList, Tab, TabsPanel } from '@xonic0506/sonic-ui';
import { ToastButton } from './toast-button';

export default function Page() {
  return (
    <>
      <h1 className="text-display m-0">next-tailwind fixture</h1>
      <p className="text-body text-muted m-0" id="consumer-token">쓰는 쪽에서 sn 토큰 클래스 사용 (tailwind.css)</p>
      <div className="flex gap-2">
        <Button id="b-primary">Primary</Button>
        <Button id="b-secondary" variant="secondary">Secondary</Button>
        <Button id="b-override" className="bg-red-500 rounded-none">Override</Button>
        <Button id="b-sn-override" className="sn:bg-danger">sn override</Button>
      </div>
      <div className="inline-flex bg-red-500 text-white px-2" id="consumer-utility">쓰는 쪽 유틸리티</div>
      <div className="w-80"><Field label="이메일" description="로그인할 때 써요." error="형식이 달라요" invalid><Input id="f-input" /></Field></div>
      <div className="w-50"><Skeleton /></div>
      <EmptyState title="API 키가 없어요" action={<Button>API 키 만들기</Button>} />
      {/* 서버 컴포넌트에서는 onRetry(함수)를 넘길 수 없음 */}
      <ErrorState title="불러오지 못했어요" />
      <Button id="b-loading" loading>저장 중</Button>
      <div className="flex gap-2"><Badge id="badge-subtle" tone="success">활성</Badge><Badge id="badge-solid" tone="danger" variant="solid">만료됨</Badge></div>
      <div className="w-60"><Progress value={45} label="내보내는 중" /></div>
      <Tabs defaultValue="overview">
        <TabsList><Tab value="overview">개요</Tab><Tab value="usage">사용량</Tab></TabsList>
        <TabsPanel value="overview">개요 내용</TabsPanel>
        <TabsPanel value="usage">사용량 내용</TabsPanel>
      </Tabs>
      {/* useToast는 클라이언트 컴포넌트에서 */}
      <ToastButton />
      <Dialog>
        <DialogTrigger id="open" render={<Button variant="secondary" />}>Dialog 열기</DialogTrigger>
        <DialogPopup id="popup">
          <DialogTitle>API 키 만들기</DialogTitle>
          <DialogDescription>키는 만든 직후 한 번만 보여 줘요.</DialogDescription>
          <DialogFooter>
            <DialogClose render={<Button variant="secondary" />}>취소</DialogClose>
            <Button>만들기</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </>
  );
}
