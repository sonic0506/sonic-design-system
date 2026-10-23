// 서버 컴포넌트에서 sonic-ui를 그대로 사용
import { Button, Dialog, DialogTrigger, DialogPopup, DialogTitle, DialogDescription, DialogFooter, DialogClose, Field, Input, Skeleton, EmptyState, ErrorState, Badge, Progress, Tabs, TabsList, Tab, TabsPanel, Link, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, ToggleGroup, ToggleGroupItem, Accordion, AccordionItem, AccordionTrigger, AccordionPanel, FileList, formatNumber } from '@xonic0506/sonic-ui';
import { Upload } from './upload';
import { ToastButton } from './toast-button';
import { Grid } from './grid';

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
      <Link id="link-ext" href="https://base-ui.com" external>Base UI 문서</Link>
      <div className="w-100"><Table><TableHeader><TableRow><TableHead>이름</TableHead><TableHead align="end">요청 수</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>production</TableCell><TableCell align="end">12,480</TableCell></TableRow></TableBody></Table></div>
      <ToggleGroup defaultValue="list" aria-label="보기 방식"><ToggleGroupItem value="list">목록</ToggleGroupItem><ToggleGroupItem value="card">카드</ToggleGroupItem></ToggleGroup>
      <div className="w-100"><Accordion><AccordionItem value="a"><AccordionTrigger>키는 몇 개까지?</AccordionTrigger><AccordionPanel>10개까지예요.</AccordionPanel></AccordionItem></Accordion></div>
      {/* 서버에서 받은 파일 목록은 서버 컴포넌트에서 바로 그릴 수 있음 */}
      <div className="w-100"><FileList items={[{ id: 's', name: '서버파일.pdf', size: 2516582, status: 'done', url: '#' }]} /></div>
      {/* 형식 함수는 서버 컴포넌트에서도 호출할 수 있음 */}
      <p id="format-number">{formatNumber(12480)}</p>
      {/* DataGrid·Pagination은 클라이언트 컴포넌트에서 */}
      <Grid />
      {/* 파일 고르기(onFilesChange)는 클라이언트 컴포넌트에서 */}
      <Upload />
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
