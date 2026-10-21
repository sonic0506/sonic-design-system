import { createRoot } from 'react-dom/client';
import '@xonic0506/sonic-ui/styles.css';
import './app.css';
import { Button, Dialog, DialogTrigger, DialogPopup, DialogTitle, DialogDescription, DialogFooter, DialogClose, Field, Input, Skeleton, EmptyState, ErrorState, ErrorPage, Select, Menu, MenuTrigger, MenuPopup, MenuItem, Badge, Progress, ToastProvider, useToast, Link, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, ToggleGroup, ToggleGroupItem, Accordion, AccordionItem, AccordionTrigger, AccordionPanel, FileDropzone, FileList } from '@xonic0506/sonic-ui';
import { useState } from 'react';

function Upload() {
  const [items, setItems] = useState([{ id: 's', name: '서버파일.pdf', size: 2516582, status: 'done', url: '#' }]);
  return (
    <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Field label="첨부 파일" description="PDF, 10MB 이하">
        <FileDropzone multiple accept=".pdf" maxSize={10000000} onFilesChange={a => setItems(p => [...p, ...a.map(f => ({ id: f.name, name: f.name, size: f.size, status: 'uploading', progress: 30, file: f }))])} />
      </Field>
      <FileList items={items} onRemove={id => setItems(p => p.filter(i => i.id !== id))} />
    </div>
  );
}

function ToastButton() {
  const toast = useToast();
  return <Button id="b-toast" variant="secondary" onClick={() => toast.add({ title: 'API 키를 만들었어요', description: '키는 지금 한 번만 보여 줘요.', tone: 'success' })}>알림 띄우기</Button>;
}

function App() {
  return (
    <>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button id="b-primary">Primary</Button>
        <Button id="b-secondary" variant="secondary">Secondary</Button>
        <Button id="b-ghost" variant="ghost">Ghost</Button>
        <Button id="b-danger" variant="danger" size="sm">Danger</Button>
        <Button id="b-disabled" disabled>Disabled</Button>
        <Button id="b-override" className="my-btn">Override</Button>
      </div>
      <div className="bg-primary" id="consumer-box">쓰는 쪽 .bg-primary</div>
      <button id="toggle" onClick={() => { const h = document.documentElement; h.dataset.theme = h.dataset.theme === 'dark' ? 'light' : 'dark'; }}>테마 전환</button>
      <div style={{ width: 320 }}><Field label="이메일" description="로그인할 때 써요." error="형식이 달라요" invalid><Input id="f-input" /></Field></div>
      <div style={{ width: 200 }}><Skeleton /></div>
      <EmptyState title="API 키가 없어요" action={<Button>API 키 만들기</Button>} />
      <ErrorState title="불러오지 못했어요" onRetry={() => { document.body.dataset.retried = '1'; }} />
      <ErrorPage status={404} action={<Button>홈으로 가기</Button>} />
      <Button id="b-loading" loading>저장 중</Button>
      <div style={{ width: 240 }}><Select id="f-select" aria-label="요금제" placeholder="요금제 선택" options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]} /></div>
      <Menu>
        <MenuTrigger id="open-menu" render={<Button variant="ghost" />}>관리</MenuTrigger>
        <MenuPopup><MenuItem>이름 바꾸기</MenuItem><MenuItem tone="danger">삭제</MenuItem></MenuPopup>
      </Menu>
      <div style={{ display: 'flex', gap: 8 }}><Badge id="badge-subtle" tone="success">활성</Badge><Badge id="badge-solid" tone="danger" variant="solid">만료됨</Badge></div>
      <div style={{ width: 240 }}><Progress id="progress" value={45} label="내보내는 중" /></div>
      <ToastButton />
      <Link id="link-ext" href="https://base-ui.com" external>Base UI 문서</Link>
      <div style={{ width: 400 }}><Table><TableHeader><TableRow><TableHead>이름</TableHead><TableHead align="end">요청 수</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>production</TableCell><TableCell align="end">12,480</TableCell></TableRow></TableBody></Table></div>
      <ToggleGroup defaultValue="list" aria-label="보기 방식"><ToggleGroupItem value="list">목록</ToggleGroupItem><ToggleGroupItem value="card">카드</ToggleGroupItem></ToggleGroup>
      <div style={{ width: 400 }}><Accordion><AccordionItem value="a"><AccordionTrigger>키는 몇 개까지?</AccordionTrigger><AccordionPanel>10개까지예요.</AccordionPanel></AccordionItem></Accordion></div>
      <Upload />
      <Dialog>
        <DialogTrigger id="open" render={<Button />}>API 키 만들기</DialogTrigger>
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
createRoot(document.getElementById('root')).render(<ToastProvider><App /></ToastProvider>);
