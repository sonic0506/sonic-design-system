import * as React from 'react';
import { createRoot } from 'react-dom/client';
import '../dist/styles.css';
import { ChevronDown, Copy, Download, Ellipsis, Inbox, LayoutGrid, List, Pencil, Plus, RefreshCw, Search, Settings, Trash2 } from 'lucide-react';
import {
  Avatar, Button, Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle,
  Dialog, DialogClose, DialogDescription, DialogFooter, DialogPopup, DialogTitle, DialogTrigger, EmptyState, ErrorPage, ErrorState, Field, Input, Skeleton, Text, type TextVariant,
  Checkbox, CheckboxGroup, Radio, RadioGroup, Select, Switch, Textarea,
  AlertDialog, AlertDialogClose, AlertDialogDescription, AlertDialogFooter, AlertDialogPopup, AlertDialogTitle, AlertDialogTrigger,
  Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger, Popover, PopoverDescription, PopoverPopup, PopoverTitle, PopoverTrigger,
  Separator, Tab, Tabs, TabsList, TabsPanel, Tooltip,
  Badge, Progress, ToastProvider, useToast, type ToastTone,
  Link, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, ToggleGroup, ToggleGroupItem, Accordion, AccordionItem, AccordionTrigger, AccordionPanel,
  FileDropzone, FileList, type FileItemData,
} from '../src';

const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
const textVariants: TextVariant[] = ['display', 'title', 'body', 'body-strong', 'label', 'caption', 'mono', 'mono-caption'];
const tones = ['default', 'muted', 'danger'] as const;
const panel = 'sn:flex sn:flex-wrap sn:items-center sn:gap-4 sn:p-6 sn:rounded-lg sn:bg-canvas sn:box-border';

const KEYS = [['HP', 'production', 'sk_live_…a91f · 3분 전 사용'], ['CI', 'github-actions', 'sk_live_…07bd · 2시간 전 사용'], ['LC', 'local-dev', 'sk_test_…c3e2 · 사용 기록 없음']];
const KEY_STATUS: Record<string, [string, 'success' | 'warning']> = { production: ['활성', 'success'], 'github-actions': ['활성', 'success'], 'local-dev': ['만료 예정', 'warning'] };
// playground 전용 배치 (라이브러리 CSS에 없는 클래스는 토큰 변수로)
const row = { display: 'flex', alignItems: 'center', gap: 'var(--sn-space-3)', padding: 'var(--sn-space-3) 0' } as const;
const grow = { display: 'flex', flex: 1, flexDirection: 'column', gap: 'var(--sn-space-2)' } as const;

// 행 동작 Menu → 결과는 Toast로 알려요
function KeyMenu({ name }: { name: string }) {
  const toast = useToast();
  return (
    <Menu>
      <MenuTrigger render={<Button size="sm" variant="ghost" />}>관리</MenuTrigger>
      <MenuPopup>
        <MenuItem onClick={() => toast.add({ title: '키를 복사했어요' })}><Copy />키 복사</MenuItem>
        <MenuSeparator />
        <MenuItem tone="danger" onClick={() => toast.add({ title: `${name} 키를 삭제하지 못했어요`, description: '네트워크 연결을 확인하고 다시 시도해 주세요.', tone: 'danger' })}><Trash2 />삭제</MenuItem>
      </MenuPopup>
    </Menu>
  );
}

const TOASTS: [ToastTone, string, string?][] = [
  ['neutral', '링크를 복사했어요'],
  ['success', 'API 키를 만들었어요', '키는 지금 한 번만 보여 줘요.'],
  ['warning', '사용량이 한도의 90%예요', '한도를 넘으면 요청이 거절돼요.'],
  ['danger', 'API 키를 삭제하지 못했어요', '네트워크 연결을 확인하고 다시 시도해 주세요.'],
];

function Feedback() {
  const toast = useToast();
  const [value, setValue] = React.useState(45);
  return (
    <div id="feedback" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sn-space-10)', alignItems: 'flex-start' }}>
      <div className="sn:flex sn:flex-wrap sn:gap-2" style={{ width: 360 }}>
        {TOASTS.map(([tone, title, description]) => (
          <Button key={tone} id={`toast-${tone}`} size="sm" variant="secondary" onClick={() => toast.add({ tone, title, description })}>{tone}</Button>
        ))}
        <Button id="toast-sticky" size="sm" variant="ghost" onClick={() => toast.add({ title: '직접 닫을 때까지 남아요', timeout: 0 })}>timeout 0</Button>
      </div>
      <div id="badges" className="sn:flex sn:flex-col sn:gap-3">
        {(['subtle', 'solid'] as const).map(v => (
          <div key={v} className="sn:flex sn:gap-3">
            {([['neutral', '초안'], ['success', '활성'], ['warning', '만료 예정'], ['danger', '만료됨']] as const).map(([t, w]) => <Badge key={t} tone={t} variant={v}>{w}</Badge>)}
          </div>
        ))}
      </div>
      <div id="progress" className="sn:flex sn:flex-col sn:gap-6" style={{ width: 240 }}>
        <Progress value={value} label="내보내는 중" />
        <Progress value={100} label="완료" />
        <Progress value={10} aria-label="업로드" />
        <Button size="sm" variant="secondary" onClick={() => setValue(v => (v >= 100 ? 0 : v + 15))}>진행</Button>
      </div>
    </div>
  );
}

// 업로드는 프로젝트가 해요: 여기서는 setInterval로 진행률만 흉내 내요
function useFakeUpload(initial: FileItemData[]) {
  const [items, setItems] = React.useState(initial);
  const start = (files: File[]) => {
    const added = files.map(file => ({ id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type, file, status: 'uploading' as const, progress: 0 }));
    setItems(prev => [...prev, ...added]);
    for (const a of added) {
      const t = setInterval(() => setItems(prev => prev.map(i => {
        if (i.id !== a.id || i.status !== 'uploading') return i;
        const progress = (i.progress ?? 0) + 20;
        if (progress < 100) return { ...i, progress };
        clearInterval(t);
        return { ...i, status: 'done', progress: 100, url: '#files' };
      })), 400);
    }
  };
  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const retry = (id: string) => setItems(prev => prev.map(i => (i.id === id ? { ...i, status: 'done', error: undefined, url: '#files' } : i)));
  return { items, start, remove, retry };
}

const SVG_THUMB = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="#6E86FF"/><circle cx="30" cy="30" r="10" fill="#fff"/></svg>');

function FileUploads() {
  const docs = useFakeUpload([
    { id: 'u', name: '계약서_최종.pdf', size: 2_516_582, status: 'uploading', progress: 45 },
    { id: 'd', name: '견적서.pdf', size: 820_000, status: 'done', url: '#files' },
    { id: 'e', name: '사업자등록증.pdf', size: 1_200_000, status: 'error', error: '네트워크가 끊겨 올리지 못했어요. 다시 시도해 주세요.' },
  ]);
  const images = useFakeUpload([
    { id: 'b64', name: 'base64-thumb.svg', type: 'image/svg+xml', status: 'done', previewUrl: SVG_THUMB },
    { id: 'ie', name: 'broken.png', type: 'image/png', status: 'error', error: '5MB보다 큰 이미지는 올릴 수 없어요.' },
  ]);
  return (
    <div id="files" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sn-space-10)', alignItems: 'flex-start' }}>
      <div className="sn:flex sn:flex-col sn:gap-2" style={{ width: 400 }}>
        <Field label="첨부 파일" description="PDF, 10MB 이하, 5개까지">
          <FileDropzone multiple accept=".pdf" maxSize={10_000_000} maxFiles={5} onFilesChange={a => docs.start(a)} />
        </Field>
        <FileList items={docs.items} onRemove={docs.remove} onRetry={docs.retry} />
      </div>
      <div className="sn:flex sn:flex-col sn:gap-2" style={{ width: 400 }}>
        <FileDropzone id="dz-image" variant="image" multiple accept="image/*" maxSize={5_000_000} description="JPG, PNG, 5MB 이하" onFilesChange={a => images.start(a)} />
        <FileList layout="grid" items={images.items} onRemove={images.remove} onRetry={images.retry} />
      </div>
    </div>
  );
}

function ContentDisclosure() {
  return (
    <div id="content" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sn-space-10)', alignItems: 'flex-start' }}>
      <div id="links" className="sn:flex sn:flex-col sn:gap-3">
        <Text>규칙은 <Link id="link-default" href="#content">DESIGN.md 보기</Link>에 있어요.</Text>
        <Link id="link-external" href="https://base-ui.com" external>Base UI 문서</Link>
      </div>
      <div id="table" style={{ width: 480 }}>
        <Table>
          <TableHeader><TableRow><TableHead>이름</TableHead><TableHead>상태</TableHead><TableHead align="end">요청 수</TableHead></TableRow></TableHeader>
          <TableBody>
            {[['production', '활성', '12,480'], ['github-actions', '활성', '3,215'], ['local-dev', '만료 예정', '0']].map(([n, st, c]) => (
              <TableRow key={n}><TableCell>{n}</TableCell><TableCell>{st}</TableCell><TableCell align="end">{c}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div id="toggles" className="sn:flex sn:flex-col sn:gap-3">
        <ToggleGroup defaultValue="list" aria-label="보기 방식">
          <ToggleGroupItem value="list">목록</ToggleGroupItem>
          <ToggleGroupItem value="card">카드</ToggleGroupItem>
          <ToggleGroupItem value="table">표</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup defaultValue="list" aria-label="아이콘 보기">
          <ToggleGroupItem value="list" iconOnly aria-label="목록"><List /></ToggleGroupItem>
          <ToggleGroupItem value="grid" iconOnly aria-label="격자"><LayoutGrid /></ToggleGroupItem>
          <ToggleGroupItem value="off" iconOnly aria-label="비활성" disabled><Settings /></ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div id="accordion" style={{ width: 400 }}>
        <Accordion defaultValue={['limit']}>
          <AccordionItem value="limit"><AccordionTrigger>키는 몇 개까지 만들 수 있나요?</AccordionTrigger><AccordionPanel>프로젝트마다 10개까지 만들 수 있어요. 쓰지 않는 키는 삭제해 주세요.</AccordionPanel></AccordionItem>
          <AccordionItem value="restore"><AccordionTrigger>삭제한 키를 되살릴 수 있나요?</AccordionTrigger><AccordionPanel>되살릴 수 없어요. 새 키를 만들어 주세요.</AccordionPanel></AccordionItem>
          <AccordionItem value="share" disabled><AccordionTrigger>키를 다른 사람과 같이 써도 되나요?</AccordionTrigger><AccordionPanel>권장하지 않아요.</AccordionPanel></AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function KeyCard({ state }: { state: 'normal' | 'loading' | 'empty' | 'error' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sn-space-3)' }}>
      <Text variant="caption" tone="muted">{state}</Text>
      <Card id={`state-${state}`} style={{ width: 360 }} aria-busy={state === 'loading' || undefined}>
        <CardHeader style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><CardTitle>API 키</CardTitle><Button size="sm" variant="secondary">새 키</Button></CardHeader>
        <CardBody style={{ gap: 0 }}>
          {state === 'normal' && KEYS.map(([i, n, m]) => (
            <div key={n} style={row}><Avatar fallback={i} /><div style={{ ...grow, gap: 0 }}><div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sn-space-2)' }}><Text>{n}</Text><Badge tone={KEY_STATUS[n][1]}>{KEY_STATUS[n][0]}</Badge></div><Text variant="mono-caption" tone="muted">{m}</Text></div><KeyMenu name={n} /></div>
          ))}
          {state === 'loading' && KEYS.map(([, n]) => (
            <div key={n} style={row}><Skeleton shape="circle" /><div style={grow}><div style={{ width: 120 }}><Skeleton /></div><div style={{ width: 200 }}><Skeleton /></div></div></div>
          ))}
          {state === 'empty' && <EmptyState title="API 키가 없어요" description="키를 만들면 여기에서 사용량을 볼 수 있어요." action={<Button>API 키 만들기</Button>} />}
          {state === 'error' && <ErrorState title="API 키를 불러오지 못했어요" description="네트워크 연결을 확인하고 다시 시도해 주세요." onRetry={() => {}} />}
        </CardBody>
      </Card>
    </div>
  );
}

const PLANS = [{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }, { value: 'team', label: 'Team' }, { value: 'ent', label: 'Enterprise', disabled: true }];
const TAGS = [{ value: 'design', label: 'Design' }, { value: 'frontend', label: 'Frontend' }, { value: 'backend', label: 'Backend' }, { value: 'marketing', label: 'Marketing' }];

function Forms() {
  const col = { display: 'flex', flexDirection: 'column', gap: 'var(--sn-space-4)', width: 240 } as const;
  return (
    <div id="forms" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sn-space-10)', alignItems: 'flex-start' }}>
      <div style={col}>
        <Checkbox>알림 받기</Checkbox>
        <Checkbox defaultChecked>알림 받기</Checkbox>
        <Checkbox indeterminate>알림 받기</Checkbox>
        <Checkbox disabled>알림 받기</Checkbox>
        <CheckboxGroup label="알림 채널" defaultValue={['email', 'push']}><Checkbox value="email">이메일</Checkbox><Checkbox value="sms">문자</Checkbox><Checkbox value="push">푸시</Checkbox></CheckboxGroup>
      </div>
      <div style={col}>
        <RadioGroup label="결제 주기" defaultValue="month"><Radio value="month">월간 결제</Radio><Radio value="year">연간 결제 (2개월 무료)</Radio><Radio value="x" disabled>분기 결제</Radio></RadioGroup>
        <Switch>이메일 알림</Switch>
        <Switch defaultChecked>이메일 알림</Switch>
        <Switch disabled>이메일 알림</Switch>
      </div>
      <div style={col}>
        <Field label="요금제"><Select options={PLANS} defaultValue="pro" placeholder="요금제 선택" /></Field>
        <Field label="태그"><Select multiple options={TAGS} defaultValue={['design', 'frontend']} placeholder="태그 선택" /></Field>
        <Field label="요금제" error="요금제를 고르세요." invalid><Select options={PLANS} placeholder="요금제 선택" /></Field>
        <Field label="메모" description="최대 200자"><Textarea placeholder="내용을 입력하세요" /></Field>
        <Field label="메모" error="200자 이하로 줄여 주세요." invalid><Textarea defaultValue="너무 긴 메모" /></Field>
      </div>
    </div>
  );
}

// 내부 트리거 없이: Menu 항목에서 AlertDialog 열기 (제어 모드)
function ExternalTriggerExample() {
  const [confirm, setConfirm] = React.useState(false);
  return (
    <>
      <Menu>
        <MenuTrigger id="row-menu" render={<Button size="icon-md" variant="ghost" aria-label="행 동작" />}><Ellipsis /></MenuTrigger>
        <MenuPopup>
          <MenuItem><Pencil />이름 바꾸기</MenuItem>
          <MenuSeparator />
          <MenuItem tone="danger" onClick={() => setConfirm(true)}><Trash2 />삭제</MenuItem>
        </MenuPopup>
      </Menu>
      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogPopup>
          <AlertDialogTitle>API 키를 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>이 키로 보내는 요청이 바로 실패해요. 삭제하면 되돌릴 수 없어요.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="secondary" />}>취소</AlertDialogClose>
            <Button variant="danger" onClick={() => setConfirm(false)}>삭제</Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </>
  );
}

function Overlays() {
  const row = { display: 'flex', flexWrap: 'wrap', gap: 'var(--sn-space-4)', alignItems: 'center' } as const;
  return (
    <div id="overlays" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sn-space-6)', maxWidth: 720 }}>
      <div style={row}>
        <AlertDialog>
          <AlertDialogTrigger id="open-alert" render={<Button variant="danger" />}>키 삭제</AlertDialogTrigger>
          <AlertDialogPopup>
            <AlertDialogTitle>API 키를 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>이 키로 보내는 요청이 바로 실패해요. 삭제하면 되돌릴 수 없어요.</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="secondary" />}>취소</AlertDialogClose>
              <AlertDialogClose render={<Button variant="danger" />}>삭제</AlertDialogClose>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialog>
        <Menu>
          <MenuTrigger id="open-menu" render={<Button size="icon-md" variant="ghost" aria-label="더 보기" />}><Ellipsis /></MenuTrigger>
          <MenuPopup>
            <MenuItem><Pencil />이름 바꾸기</MenuItem>
            <MenuItem><Copy />키 복사</MenuItem>
            <MenuSeparator />
            <MenuItem tone="danger"><Trash2 />삭제</MenuItem>
          </MenuPopup>
        </Menu>
        <ExternalTriggerExample />
        <Popover>
          <PopoverTrigger id="open-popover" render={<Button variant="secondary" />}>공유</PopoverTrigger>
          <PopoverPopup>
            <PopoverTitle>링크 공유</PopoverTitle>
            <PopoverDescription>링크가 있는 사람은 누구나 볼 수 있어요.</PopoverDescription>
            <div style={{ display: 'flex', gap: 'var(--sn-space-2)' }}><Input defaultValue="sonic.app/s/a91f" readOnly /><Button variant="secondary">복사</Button></div>
          </PopoverPopup>
        </Popover>
        <Tooltip content="설정"><Button id="tip-settings" size="icon-md" variant="ghost" aria-label="설정"><Settings /></Button></Tooltip>
        <Tooltip content="다운로드"><Button size="icon-md" variant="ghost" aria-label="다운로드"><Download /></Button></Tooltip>
      </div>
      <Tabs defaultValue="overview">
        <TabsList><Tab value="overview">개요</Tab><Tab value="usage">사용량</Tab><Tab value="settings">설정</Tab><Tab value="billing" disabled>결제</Tab></TabsList>
        <TabsPanel value="overview">개요 내용</TabsPanel>
        <TabsPanel value="usage">사용량 내용</TabsPanel>
        <TabsPanel value="settings">설정 내용</TabsPanel>
      </Tabs>
      <div style={{ ...row, gap: 'var(--sn-space-3)' }}><Text tone="muted">문서</Text><Separator orientation="vertical" /><Text tone="muted">상태</Text><Separator orientation="vertical" /><Text tone="muted">문의</Text></div>
      <Separator />
    </div>
  );
}

function App() {
  return (
    <div className="sn:flex sn:flex-col sn:gap-6 sn:p-6 sn:font-sans">
      <div className="sn:flex sn:gap-2">
        <Button size="sm" variant="secondary" onClick={() => { const h = document.documentElement; h.dataset.theme = h.dataset.theme === 'dark' ? 'light' : 'dark'; }}>테마 전환</Button>
      </div>
      <div className="sn:flex sn:flex-wrap sn:items-start sn:gap-10">
        <div id="buttons" className={panel} style={{ width: 400 }}>
          {variants.flatMap(v => [false, true].flatMap(d => sizes.map(s => <Button key={v + d + s} variant={v} size={s} disabled={d}>Button</Button>)))}
        </div>
        <div id="inputs" className={panel} style={{ width: 560 }}>
          {[false, true].flatMap(i => [false, true].map(d => <div key={`${i}${d}`} style={{ width: 240 }}><Input invalid={i} disabled={d} placeholder="Placeholder" /></div>))}
        </div>
        <div id="texts" className={panel} style={{ width: 480 }}>
          {textVariants.flatMap(v => tones.map(t => <Text key={v + t} variant={v} tone={t}>{v}</Text>))}
        </div>
        <div id="icons" className={panel} style={{ width: 560 }}>
          <Button size="sm"><Plus />추가하기</Button>
          <Button variant="secondary">정렬<ChevronDown /></Button>
          <Button size="lg"><Download />내보내기<ChevronDown /></Button>
          <Button size="icon-sm" aria-label="추가"><Plus /></Button>
          <Button size="icon-md" variant="secondary" aria-label="설정"><Settings /></Button>
          <Button size="icon-md" variant="ghost" aria-label="더 보기"><Ellipsis /></Button>
          <Button size="icon-lg" variant="danger" aria-label="삭제"><Trash2 /></Button>
          <Text tone="muted"><Search size={16} /> 본문 옆 아이콘</Text>
        </div>
        <div id="avatars" className={panel}>
          {sizes.map(s => <Avatar key={s} size={s} fallback="HP" />)}
        </div>
      </div>
      <FileUploads />
      <ContentDisclosure />
      <Feedback />
      <Overlays />
      <Forms />
      <div id="states" className="sn:flex sn:flex-wrap sn:items-start sn:gap-6">
        {(['normal', 'loading', 'empty', 'error'] as const).map(s => <KeyCard key={s} state={s} />)}
        <div id="empty-icon" style={{ width: 240 }}><EmptyState icon={<Inbox />} title="검색 결과가 없어요" /></div>
      </div>
      <div id="error-pages" className="sn:flex sn:flex-wrap sn:items-start sn:gap-6">
        {([404, 403, 500] as const).map(s => <div key={s} style={{ width: 480 }}><ErrorPage status={s} action={s === 500 ? <Button onClick={() => location.reload()}><RefreshCw />다시 시도</Button> : <Button>홈으로 가기</Button>} /></div>)}
      </div>
      <div id="fields" className="sn:flex sn:flex-wrap sn:items-start sn:gap-10">
        <div style={{ width: 320 }}><Field label="이메일" description="로그인할 때 써요."><Input placeholder="Placeholder" /></Field></div>
        <div style={{ width: 320 }}><Field label="이메일" description="로그인할 때 써요." error="https://로 시작하는 주소를 입력하세요." invalid><Input placeholder="Placeholder" /></Field></div>
        <div style={{ width: 320 }}><Field label="이메일" disabled><Input placeholder="Placeholder" /></Field></div>
        <div className="sn:flex sn:gap-2"><Button loading>저장 중</Button><Button loading variant="secondary" size="lg">저장 중</Button><Button loading size="icon-md" aria-label="저장 중"><Plus /></Button></div>
      </div>
      <div className="sn:flex sn:flex-wrap sn:items-start sn:gap-10">
        <Card id="card" style={{ width: 360 }}>
          <CardHeader><CardTitle>Card title</CardTitle><CardDescription>한 줄 설명</CardDescription></CardHeader>
          <CardBody><Text>콘텐츠 영역. 인스턴스에서 교체해요.</Text></CardBody>
          <CardFooter><Button variant="secondary">취소</Button><Button>저장</Button></CardFooter>
        </Card>
        <Dialog>
          <DialogTrigger id="open" render={<Button />}>API 키 만들기</DialogTrigger>
          <DialogPopup>
            <DialogTitle>API 키 만들기</DialogTitle>
            <DialogDescription>키는 만든 직후 한 번만 보여 줘요.</DialogDescription>
            <div className="sn:flex sn:flex-col sn:gap-2">
              <Text as="label" variant="label" htmlFor="key-name">키 이름</Text>
              <Input id="key-name" placeholder="Placeholder" />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="secondary" />}>취소</DialogClose>
              <Button>만들기</Button>
            </DialogFooter>
          </DialogPopup>
        </Dialog>
      </div>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<ToastProvider><App /></ToastProvider>);
