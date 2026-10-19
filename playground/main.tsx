import { createRoot } from 'react-dom/client';
import '../dist/styles.css';
import { ChevronDown, Download, Ellipsis, Plus, Search, Settings, Trash2 } from 'lucide-react';
import {
  Avatar, Button, Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle,
  Dialog, DialogClose, DialogDescription, DialogFooter, DialogPopup, DialogTitle, DialogTrigger, Input, Text, type TextVariant,
} from '../src';

const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
const textVariants: TextVariant[] = ['display', 'title', 'body', 'body-strong', 'label', 'caption', 'mono', 'mono-caption'];
const tones = ['default', 'muted', 'danger'] as const;
const panel = 'sn:flex sn:flex-wrap sn:items-center sn:gap-4 sn:p-6 sn:rounded-lg sn:bg-canvas sn:box-border';

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
createRoot(document.getElementById('root')!).render(<App />);
