import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AlertDialog, AlertDialogClose, AlertDialogPopup, AlertDialogTitle, AlertDialogTrigger, Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger,
  Popover, PopoverPopup, PopoverTitle, PopoverTrigger, Separator, Tab, Tabs, TabsList, TabsPanel, Tooltip,
  Checkbox, CheckboxGroup, Radio, RadioGroup, Select, Switch, Textarea,
  EmptyState, ErrorState, ErrorPage, illustrations, Field, Skeleton, Badge, Progress, ToastProvider, useToast,
  Link, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, ToggleGroup, ToggleGroupItem, Accordion, AccordionItem, AccordionTrigger, AccordionPanel,
  FileDropzone, FileList, formatBytes, type FileItemData,
  DataGrid, type DataGridColumn, formatNumber, formatDate, formatDateTime, Pagination,
  Avatar, Button, buttonVariants, Card, CardBody, CardHeader, CardTitle, Dialog, DialogClose, DialogPopup, DialogTitle, DialogTrigger, Input, Text,
} from './index';
import { X } from 'lucide-react';
import { dataGridCellTypes } from './components/data-grid';
import { getPageItems } from './components/pagination';
import figmaTokens from '../scripts/figma-tokens.json';

describe('Button', () => {
  it('variant/size 클래스를 붙이고, 같은 그룹의 className은 덮어씀', () => {
    render(<Button variant="secondary" size="sm" className="sn:bg-danger">저장</Button>);
    const btn = screen.getByRole('button', { name: '저장' });
    expect(btn).toHaveClass('sn:h-7', 'sn:border-default', 'sn:bg-danger');
    expect(btn).not.toHaveClass('sn:bg-surface');
  });

  it('disabled면 클릭이 막히고 data-disabled가 붙음', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>저장</Button>);
    const btn = screen.getByRole('button');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(btn).toHaveAttribute('data-disabled');
  });

  it('buttonVariants: 링크에 버튼 모양만 입히고 role은 link로 남음', () => {
    render(<a href="/" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>홈으로 가기</a>);
    expect(screen.getByRole('link', { name: '홈으로 가기' })).toHaveClass('sn:h-10', 'sn:border-default');
  });
});

describe('Button 아이콘', () => {
  it('lg는 아이콘을 20px(size-5)로 맞추고, className으로 덮어쓸 수 있음', () => {
    render(<><Button size="lg"><svg aria-hidden />내보내기</Button><Button className="sn:[&_svg]:size-6">큰 아이콘</Button></>);
    expect(screen.getByRole('button', { name: '내보내기' })).toHaveClass('sn:[&_svg]:size-5');
    const big = screen.getByRole('button', { name: '큰 아이콘' });
    expect(big).toHaveClass('sn:[&_svg]:size-6');
    expect(big).not.toHaveClass('sn:[&_svg]:size-4');
  });
});

describe('Button icon 크기', () => {
  it('정사각형이고 padding이 없음', () => {
    render(<Button size="icon-md" variant="ghost" aria-label="더 보기"><svg aria-hidden /></Button>);
    const btn = screen.getByRole('button', { name: '더 보기' });
    expect(btn).toHaveClass('sn:size-8', 'sn:p-0', 'sn:[&_svg]:size-4');
    expect(btn).not.toHaveClass('sn:h-8');
  });

  it('aria-label이 없으면 타입 에러', () => {
    // @ts-expect-error icon 크기에는 aria-label이 필수
    const el = <Button size="icon-sm"><svg /></Button>;
    expect(el).toBeTruthy();
  });
});

describe('Input', () => {
  it('invalid면 aria-invalid가 붙고 focus 링이 danger 색', () => {
    render(<Input invalid placeholder="이메일" />);
    const input = screen.getByPlaceholderText('이메일');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    // 에러 상태에서는 focus 링도 danger 색 (DESIGN.md §10 Input)
    expect(input).toHaveClass('sn:aria-invalid:focus-visible:outline-danger');
  });
});

describe('Text', () => {
  it('as로 태그를 바꾸고, mono는 글꼴만 바꿈', () => {
    render(<Text as="p" variant="mono" tone="muted">72,418</Text>);
    const el = screen.getByText('72,418');
    expect(el.tagName).toBe('P');
    expect(el).toHaveClass('sn:font-mono', 'sn:text-body', 'sn:text-muted');
    expect(el).not.toHaveClass('sn:font-sans');
  });
});

describe('Card', () => {
  it('Header/Title/Body를 렌더함', () => {
    render(<Card><CardHeader><CardTitle>이번 달 요청</CardTitle></CardHeader><CardBody>본문</CardBody></Card>);
    expect(screen.getByRole('heading', { name: '이번 달 요청' })).toBeInTheDocument();
    expect(screen.getByText('본문')).toBeInTheDocument();
  });
});

describe('Avatar', () => {
  it('이미지가 없으면 fallback을 보여 줌', () => {
    render(<Avatar size="lg" fallback="HP" />);
    expect(screen.getByText('HP')).toBeInTheDocument();
  });
});

describe('Dialog', () => {
  it('키보드로 열고 Esc로 닫음', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger render={<Button />}>API 키 만들기</DialogTrigger>
        <DialogPopup>
          <DialogTitle>새 API 키</DialogTitle>
          <DialogClose render={<Button variant="secondary" />}>취소</DialogClose>
        </DialogPopup>
      </Dialog>,
    );
    screen.getByRole('button', { name: 'API 키 만들기' }).focus();
    await user.keyboard('{Enter}');
    expect(await screen.findByRole('dialog', { name: '새 API 키' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});

describe('Button loading', () => {
  it('aria-busy가 붙고 클릭은 막히지만 포커스는 유지됨', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>저장</Button>);
    const btn = screen.getByRole('button', { name: '저장' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('data-loading');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    btn.focus();
    expect(btn).toHaveFocus();
  });
});

describe('Field', () => {
  it('invalid면 에러가 설명 자리를 대신하고 Input과 연결됨', () => {
    render(<Field label="이메일" description="로그인할 때 써요." error="형식이 달라요" invalid><Input /></Field>);
    const input = screen.getByRole('textbox', { name: '이메일' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('data-invalid');
    const error = screen.getByText('형식이 달라요');
    expect(input.getAttribute('aria-describedby')).toContain(error.id);
    expect(screen.queryByText('로그인할 때 써요.')).not.toBeInTheDocument();
  });

  it('invalid가 켜졌다 꺼져도 aria-describedby가 보이는 문구만 가리킴', () => {
    const ui = (invalid: boolean) => <Field label="이메일" description="로그인할 때 써요." error="형식이 달라요" invalid={invalid}><Input /></Field>;
    const { rerender } = render(ui(false));
    const input = screen.getByRole('textbox', { name: '이메일' });
    const descId = screen.getByText('로그인할 때 써요.').id;
    rerender(ui(true));
    const errId = screen.getByText('형식이 달라요').id;
    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual([errId]);
    rerender(ui(false));
    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual([screen.getByText('로그인할 때 써요.').id]);
    expect(descId).toBeTruthy();
  });

  it('invalid가 아니면 설명만 보이고 에러는 숨김', () => {
    render(<Field label="이메일" description="로그인할 때 써요." error="형식이 달라요"><Input /></Field>);
    const input = screen.getByRole('textbox', { name: '이메일' });
    const desc = screen.getByText('로그인할 때 써요.');
    expect(input.getAttribute('aria-describedby')).toContain(desc.id);
    expect(screen.queryByText('형식이 달라요')).not.toBeInTheDocument();
  });
});

describe('Skeleton', () => {
  it('스크린 리더에 숨기고 shape 클래스를 붙임', () => {
    const { container } = render(<Skeleton shape="circle" />);
    const el = container.firstElementChild!;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveClass('sn:size-8', 'sn:rounded-full');
  });
});

describe('EmptyState / ErrorState', () => {
  it('EmptyState는 제목과 행동 버튼을 보여 줌', () => {
    render(<EmptyState title="API 키가 없어요" action={<Button>API 키 만들기</Button>} />);
    expect(screen.getByText('API 키가 없어요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'API 키 만들기' })).toBeInTheDocument();
  });

  it('ErrorState는 alert이고 다시 시도를 누르면 onRetry 호출', async () => {
    const onRetry = vi.fn();
    render(<ErrorState title="불러오지 못했어요" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('불러오지 못했어요');
    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('기본은 장식 일러스트, icon을 넘기면 일러스트 대신 아이콘', () => {
    const { container, rerender } = render(<EmptyState title="API 키가 없어요" />);
    const img = container.querySelector('img')!;
    expect(img).toHaveAttribute('alt', '');
    expect(img.getAttribute('src')).toContain('empty.webp');
    rerender(<EmptyState icon={<svg data-testid="icon" />} title="API 키가 없어요" />);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

describe('ErrorPage', () => {
  it('상태별 기본 문구를 h1과 오류 코드로 보여 주고 그림은 숨김', () => {
    const { container } = render(<ErrorPage status={404} action={<Button>홈으로 가기</Button>} />);
    expect(screen.getByRole('heading', { level: 1, name: '페이지를 찾을 수 없어요' })).toBeInTheDocument();
    expect(screen.getByText('오류 코드 404')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '홈으로 가기' })).toBeInTheDocument();
    const img = container.querySelector('img')!;
    expect(img).toHaveAttribute('alt', '');
    expect(img.getAttribute('src')).toContain('error-404.webp');
  });

  it('제목과 설명을 바꿀 수 있음', () => {
    render(<ErrorPage status={500} title="결제 서버에 문제가 생겼어요" description="결제는 진행되지 않았어요." />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('결제 서버에 문제가 생겼어요');
    expect(screen.getByText('결제는 진행되지 않았어요.')).toBeInTheDocument();
  });
});

describe('illustrations', () => {
  it('Figma 이름으로 5개 그림 URL을 공개함', () => {
    expect(Object.keys(illustrations)).toEqual(['empty', 'error', 'error-404', 'error-403', 'error-500']);
    for (const [name, url] of Object.entries(illustrations)) expect(url).toContain(`${name}.webp`);
  });
});

describe('Textarea', () => {
  it('textarea로 렌더하고 Field의 invalid를 받음', () => {
    render(<Field label="메모" error="너무 길어요" invalid><Textarea /></Field>);
    const ta = screen.getByRole('textbox', { name: '메모' });
    expect(ta.tagName).toBe('TEXTAREA');
    expect(ta).toHaveAttribute('aria-invalid', 'true');
    expect(ta).toHaveAttribute('rows', '3');
  });
});

describe('Checkbox / CheckboxGroup', () => {
  it('Space로 토글하고 indeterminate는 mixed로 알림', async () => {
    const onChange = vi.fn();
    render(<><Checkbox onCheckedChange={onChange}>알림 받기</Checkbox><Checkbox indeterminate>전체</Checkbox></>);
    const cb = screen.getByRole('checkbox', { name: '알림 받기' });
    cb.focus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('checkbox', { name: '전체' })).toHaveAttribute('aria-checked', 'mixed');
  });

  it('그룹은 legend로 이름이 붙고 값 배열을 돌려줌', async () => {
    const onChange = vi.fn();
    render(<CheckboxGroup label="알림 채널" defaultValue={['email']} onValueChange={onChange}><Checkbox value="email">이메일</Checkbox><Checkbox value="push">푸시</Checkbox></CheckboxGroup>);
    expect(screen.getByRole('group', { name: '알림 채널' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: '푸시' }));
    expect(onChange).toHaveBeenLastCalledWith(['email', 'push']);
  });
});

describe('RadioGroup', () => {
  it('화살표 키로 다음 항목을 선택함', async () => {
    const onChange = vi.fn();
    render(<RadioGroup label="결제 주기" defaultValue="month" onValueChange={onChange}><Radio value="month">월간</Radio><Radio value="year">연간</Radio></RadioGroup>);
    screen.getByRole('radio', { name: '월간' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('year');
    expect(screen.getByRole('radio', { name: '연간' })).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Switch', () => {
  it('switch 역할이고 Space로 켜짐', async () => {
    const onChange = vi.fn();
    render(<Switch onCheckedChange={onChange}>이메일 알림</Switch>);
    const sw = screen.getByRole('switch', { name: '이메일 알림' });
    sw.focus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('Select', () => {
  const opts = [{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }, { value: 'team', label: 'Team' }];

  it('단일: 고르면 닫히고 라벨을 보여 줌', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Select aria-label="요금제" options={opts} placeholder="요금제 선택" onValueChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: '요금제' });
    expect(trigger).toHaveTextContent('요금제 선택');
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: 'Pro' }));
    expect(onChange).toHaveBeenLastCalledWith('pro');
    await vi.waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(trigger).toHaveTextContent('Pro');
  });

  it('다중: 여러 개를 골라도 열려 있고 값은 배열, 트리거는 쉼표로 표시', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Select multiple aria-label="태그" options={opts} placeholder="태그 선택" onValueChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: '태그' });
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: 'Free' }));
    await user.click(screen.getByRole('option', { name: 'Team' }));
    expect(onChange).toHaveBeenLastCalledWith(['free', 'team']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Free, Team');
  });

  it('Field 안에서 라벨과 invalid가 연결되고, 단일에 배열을 주면 타입 에러', () => {
    render(<Field label="요금제" error="요금제를 고르세요" invalid><Select options={opts} /></Field>);
    const trigger = screen.getByRole('combobox', { name: '요금제' });
    expect(trigger).toHaveAttribute('data-invalid');
    expect(trigger.getAttribute('aria-describedby')).toContain(screen.getByText('요금제를 고르세요').id);
    // @ts-expect-error multiple이 아니면 value는 배열이 될 수 없음
    const el = <Select options={opts} value={['pro']} />;
    expect(el).toBeTruthy();
  });
});

describe('AlertDialog', () => {
  it('Esc로 닫히고 확인 버튼이 동작함', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="danger" />}>삭제</AlertDialogTrigger>
        <AlertDialogPopup>
          <AlertDialogTitle>API 키를 삭제할까요?</AlertDialogTitle>
          <AlertDialogClose render={<Button variant="secondary" />}>취소</AlertDialogClose>
          <Button variant="danger" onClick={onDelete}>삭제 확인</Button>
        </AlertDialogPopup>
      </AlertDialog>,
    );
    await user.click(screen.getByRole('button', { name: '삭제' }));
    expect(await screen.findByRole('alertdialog', { name: 'API 키를 삭제할까요?' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '삭제 확인' }));
    expect(onDelete).toHaveBeenCalledOnce();
    await user.keyboard('{Escape}');
    await vi.waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });
});

describe('Menu', () => {
  it('화살표로 이동하고 Enter로 실행한 뒤 닫힘', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn(), onDelete = vi.fn();
    render(
      <Menu>
        <MenuTrigger render={<Button size="icon-md" variant="ghost" aria-label="더 보기" />}>…</MenuTrigger>
        <MenuPopup>
          <MenuItem onClick={onRename}>이름 바꾸기</MenuItem>
          <MenuSeparator />
          <MenuItem tone="danger" onClick={onDelete}>삭제</MenuItem>
        </MenuPopup>
      </Menu>,
    );
    screen.getByRole('button', { name: '더 보기' }).focus();
    await user.keyboard('{Enter}');
    await screen.findByRole('menu');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onRename).not.toHaveBeenCalled();
    await vi.waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });
});

describe('Popover / Tooltip', () => {
  it('Popover는 눌러서 열리고 제목으로 이름이 붙음', async () => {
    const user = userEvent.setup();
    render(<Popover><PopoverTrigger render={<Button variant="secondary" />}>공유</PopoverTrigger><PopoverPopup><PopoverTitle>링크 공유</PopoverTitle></PopoverPopup></Popover>);
    await user.click(screen.getByRole('button', { name: '공유' }));
    expect(await screen.findByRole('dialog', { name: '링크 공유' })).toBeInTheDocument();
  });

  it('Tooltip은 키보드 포커스로 보임', async () => {
    const user = userEvent.setup();
    render(<Tooltip content="설정"><Button size="icon-md" variant="ghost" aria-label="설정 열기">⚙</Button></Tooltip>);
    await user.tab();
    expect(await screen.findByText('설정')).toBeInTheDocument();
  });
});

describe('Tabs / Separator', () => {
  it('기본값은 화살표만으로 탭이 바뀌고, activateOnFocus=false면 Enter로 바뀜', async () => {
    const user = userEvent.setup();
    const ui = (auto: boolean) => (
      <Tabs defaultValue="overview">
        <TabsList activateOnFocus={auto}><Tab value="overview">개요</Tab><Tab value="usage">사용량</Tab></TabsList>
        <TabsPanel value="overview">개요 내용</TabsPanel>
        <TabsPanel value="usage">사용량 내용</TabsPanel>
      </Tabs>
    );
    const { unmount } = render(ui(true));
    screen.getByRole('tab', { name: '개요' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: '사용량' })).toHaveAttribute('aria-selected', 'true');
    unmount();
    render(ui(false));
    screen.getByRole('tab', { name: '개요' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: '사용량' })).toHaveAttribute('aria-selected', 'false');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('tab', { name: '사용량' })).toHaveAttribute('aria-selected', 'true');
  });

  it('화살표로 탭을 옮기면 패널이 바뀜', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="overview">
        <TabsList><Tab value="overview">개요</Tab><Tab value="usage">사용량</Tab></TabsList>
        <TabsPanel value="overview">개요 내용</TabsPanel>
        <TabsPanel value="usage">사용량 내용</TabsPanel>
      </Tabs>,
    );
    screen.getByRole('tab', { name: '개요' }).focus();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(screen.getByRole('tab', { name: '사용량' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('사용량 내용');
  });

  it('Separator는 separator 역할과 방향을 가짐', () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });
});

describe('포커스 링', () => {
  // Tailwind v4에서 outline-none이 --tw-outline-style을 none으로 만들어 focus-visible 링이 사라지는 문제 재발 방지
  it('포커스 링이 있는 요소에는 outline-none을 같이 쓰지 않음', () => {
    const { container } = render(
      <>
        <Button>버튼</Button><Input /><Textarea /><Checkbox>체크</Checkbox><Switch>스위치</Switch>
        <RadioGroup label="그룹"><Radio value="a">라디오</Radio></RadioGroup>
        <Select aria-label="선택" options={[{ value: 'a', label: 'A' }]} />
        <Tabs defaultValue="a"><TabsList><Tab value="a">탭</Tab></TabsList><TabsPanel value="a">패널</TabsPanel></Tabs>
        <Link href="/">링크</Link>
        <ToggleGroup defaultValue="a"><ToggleGroupItem value="a">A</ToggleGroupItem></ToggleGroup>
        <Accordion><AccordionItem value="a"><AccordionTrigger>제목</AccordionTrigger><AccordionPanel>내용</AccordionPanel></AccordionItem></Accordion>
        <FileDropzone onFilesChange={() => {}} />
      </>,
    );
    const ringed = [...container.querySelectorAll('[class*="focus-visible:outline-2"]')];
    expect(ringed.length).toBeGreaterThanOrEqual(13);
    for (const el of ringed) expect(el.className).not.toMatch(/(^|\s)sn:outline-none(\s|$)/);
  });
});

describe('Dialog / AlertDialog: 내부 트리거 없이 열기', () => {
  it('바깥 버튼으로 연 Dialog는 Esc로 닫히고 포커스가 그 버튼으로 돌아감', async () => {
    const user = userEvent.setup();
    function Page() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>키 만들기</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogPopup><DialogTitle>새 API 키</DialogTitle><DialogClose>닫기</DialogClose></DialogPopup>
          </Dialog>
        </>
      );
    }
    render(<Page />);
    const external = screen.getByRole('button', { name: '키 만들기' });
    await user.click(external);
    expect(await screen.findByRole('dialog', { name: '새 API 키' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(external).toHaveFocus();
  });

  it('Menu 항목에서 연 AlertDialog는 취소하면 포커스가 Menu 트리거로 돌아감', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    function Row() {
      const [confirm, setConfirm] = React.useState(false);
      return (
        <>
          <Menu>
            <MenuTrigger render={<Button size="icon-md" variant="ghost" aria-label="더 보기" />}>…</MenuTrigger>
            <MenuPopup><MenuItem tone="danger" onClick={() => setConfirm(true)}>삭제</MenuItem></MenuPopup>
          </Menu>
          <AlertDialog open={confirm} onOpenChange={setConfirm}>
            <AlertDialogPopup>
              <AlertDialogTitle>API 키를 삭제할까요?</AlertDialogTitle>
              <AlertDialogClose render={<Button variant="secondary" />}>취소</AlertDialogClose>
              <Button variant="danger" onClick={() => { onDelete(); setConfirm(false); }}>삭제 확인</Button>
            </AlertDialogPopup>
          </AlertDialog>
        </>
      );
    }
    render(<Row />);
    const trigger = screen.getByRole('button', { name: '더 보기' });
    await user.click(trigger);
    await user.click(await screen.findByRole('menuitem', { name: '삭제' }));
    expect(await screen.findByRole('alertdialog', { name: 'API 키를 삭제할까요?' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '취소' }));
    await vi.waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onDelete).not.toHaveBeenCalled();
    expect(trigger).toHaveFocus();
  });

  it('코드로 연 Dialog는 닫힌 뒤 finalFocus 요소로 포커스가 감', async () => {
    const user = userEvent.setup();
    function Page() {
      const [open, setOpen] = React.useState(true); // 예: API 에러 뒤 바로 열림
      const retryRef = React.useRef<HTMLButtonElement>(null);
      return (
        <>
          <Button ref={retryRef}>다시 불러오기</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogPopup finalFocus={retryRef}><DialogTitle>불러오지 못했어요</DialogTitle><DialogClose>닫기</DialogClose></DialogPopup>
          </Dialog>
        </>
      );
    }
    render(<Page />);
    expect(await screen.findByRole('dialog', { name: '불러오지 못했어요' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '닫기' }));
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: '다시 불러오기' })).toHaveFocus();
  });
});

describe('피드백: Toast, Badge, Progress', () => {
  it('useToast().add로 띄운 알림은 제목·설명을 보여 주고 닫기로 사라짐', async () => {
    const user = userEvent.setup();
    function Save() {
      const toast = useToast();
      return <Button onClick={() => toast.add({ title: 'API 키를 만들었어요', description: '키는 지금 한 번만 보여 줘요.', tone: 'success' })}>저장</Button>;
    }
    render(<ToastProvider><Save /></ToastProvider>);
    await user.click(screen.getByRole('button', { name: '저장' }));
    expect(await screen.findByText('API 키를 만들었어요')).toBeInTheDocument();
    expect(screen.getByText('키는 지금 한 번만 보여 줘요.')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '알림' })).toBeInTheDocument();
    await user.click(screen.getByLabelText('알림 닫기'));
    await vi.waitFor(() => expect(screen.queryByText('API 키를 만들었어요')).not.toBeInTheDocument());
  });

  it('Badge는 tone·variant 조합에 맞는 색을 씀', () => {
    render(<><Badge tone="success">활성</Badge><Badge tone="danger" variant="solid">만료됨</Badge></>);
    expect(screen.getByText('활성')).toHaveClass('sn:bg-success-subtle', 'sn:text-success');
    expect(screen.getByText('만료됨')).toHaveClass('sn:bg-danger', 'sn:text-on-danger');
  });

  it('Progress는 progressbar 역할과 값, 라벨 이름을 가짐', () => {
    render(<Progress value={45} label="내보내는 중" />);
    const bar = screen.getByRole('progressbar', { name: '내보내는 중' });
    expect(bar).toHaveAttribute('aria-valuenow', '45');
    expect(screen.getByText('45%')).toBeInTheDocument();
  });
});

describe('콘텐츠·펼치기: Link, Table, ToggleGroup, Accordion', () => {
  it('Link: external이면 새 탭으로 열고 화면 낭독기에 알림', () => {
    render(<><Link href="/docs">문서</Link><Link href="https://base-ui.com" external>Base UI</Link></>);
    expect(screen.getByRole('link', { name: '문서' })).not.toHaveAttribute('target');
    const ext = screen.getByRole('link', { name: /Base UI/ });
    expect(ext).toHaveAttribute('target', '_blank');
    expect(ext).toHaveAttribute('rel', 'noopener noreferrer');
    expect(ext).toHaveTextContent('(새 탭에서 열림)');
  });

  it('Link: render로 다른 링크 컴포넌트를 쓸 수 있음', () => {
    render(<Link render={<a data-router="" href="/x" />}>이동</Link>);
    const a = screen.getByRole('link', { name: '이동' });
    expect(a).toHaveAttribute('data-router');
    expect(a).toHaveClass('sn:underline');
  });

  it('Table: 머리글은 columnheader, 숫자 열은 오른쪽 정렬 + mono', () => {
    render(
      <Table>
        <TableHeader><TableRow><TableHead>이름</TableHead><TableHead align="end">요청 수</TableHead></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>production</TableCell><TableCell align="end">12,480</TableCell></TableRow></TableBody>
      </Table>,
    );
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getByRole('cell', { name: '12,480' })).toHaveClass('sn:text-right', 'sn:font-mono');
  });

  it('ToggleGroup 단일: 고르면 string을 넘기고, 눌린 항목을 다시 눌러도 꺼지지 않음', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup defaultValue="list" onValueChange={onValueChange} aria-label="보기 방식">
        <ToggleGroupItem value="list">목록</ToggleGroupItem>
        <ToggleGroupItem value="card">카드</ToggleGroupItem>
      </ToggleGroup>,
    );
    const card = screen.getByRole('button', { name: '카드' });
    await user.click(card);
    expect(onValueChange).toHaveBeenLastCalledWith('card');
    expect(card).toHaveAttribute('aria-pressed', 'true');
    await user.click(card);
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '목록' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('ToggleGroup 다중: 값이 배열, 화살표 키로 이동', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup multiple onValueChange={onValueChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    await user.click(screen.getByRole('button', { name: 'A' }));
    await user.click(screen.getByRole('button', { name: 'B' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b']);
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: 'A' })).toHaveFocus();
  });

  it('Accordion: 트리거를 누르면 펼쳐지고 다시 누르면 접힘', async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem value="limit"><AccordionTrigger>키는 몇 개까지?</AccordionTrigger><AccordionPanel>10개까지예요.</AccordionPanel></AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole('button', { name: '키는 몇 개까지?' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('10개까지예요.')).toBeVisible();
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('파일 업로드: FileDropzone, FileList', () => {
  const pdf = (name = '계약서.pdf', size = 1000) => new File([new Uint8Array(size)], name, { type: 'application/pdf' });

  it('조건에 맞는 파일은 accepted, 크기·형식이 다르면 rejected로 넘기고 고치는 방법을 보여 줌', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onFilesChange = vi.fn();
    const { container } = render(<FileDropzone multiple accept=".pdf" maxSize={2048} description="PDF, 2KB 이하" onFilesChange={onFilesChange} />);
    const input = container.querySelector('input[type=file]') as HTMLInputElement;
    const ok = pdf('a.pdf'), big = pdf('b.pdf', 5000), png = new File(['x'], 'c.png', { type: 'image/png' });
    await user.upload(input, [ok, big, png]);
    const [accepted, rejected] = onFilesChange.mock.calls[0];
    expect(accepted).toEqual([ok]);
    expect(rejected.map((r: { reason: string }) => r.reason)).toEqual(['size', 'type']);
    const zone = screen.getByRole('button', { name: /파일을 끌어다 놓거나/ });
    expect(zone).toHaveAttribute('data-invalid');
    expect(zone).toHaveAccessibleDescription('b.pdf: 2 KB보다 큰 파일은 올릴 수 없어요. (외 1개)');
  });

  it('multiple이 없으면 한 개만, maxFiles를 넘으면 count로 거부', async () => {
    const user = userEvent.setup();
    const single = vi.fn();
    const { unmount } = render(<FileDropzone onFilesChange={single} />);
    fireEvent.drop(screen.getByRole('button', { name: /파일을 끌어다/ }), { dataTransfer: { files: [pdf('a.pdf'), pdf('b.pdf')] } });
    expect(single.mock.calls[0][0]).toHaveLength(1);
    expect(single.mock.calls[0][1][0].reason).toBe('count');
    unmount();
    const many = vi.fn();
    const r = render(<FileDropzone multiple maxFiles={1} onFilesChange={many} />);
    await user.upload(r.container.querySelector('input[type=file]') as HTMLInputElement, [pdf('a.pdf'), pdf('b.pdf')]);
    expect(many.mock.calls[0][1][0].message).toBe('1개까지 올릴 수 있어요.');
  });

  it('Enter로 파일 선택 창을 열고, 끌어다 놓아도 파일을 받음', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const click = vi.spyOn(HTMLInputElement.prototype, 'click');
    render(<FileDropzone onFilesChange={onFilesChange} />);
    const zone = screen.getByRole('button', { name: /파일을 끌어다/ });
    zone.focus();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalled();
    click.mockRestore();
    fireEvent.dragEnter(zone, { dataTransfer: { files: [] } });
    expect(zone).toHaveAttribute('data-dragging');
    const file = pdf();
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(zone).not.toHaveAttribute('data-dragging');
    expect(onFilesChange).toHaveBeenCalledWith([file], []);
  });

  it('FileList: 업로드 중은 Progress, 완료는 Link, 에러는 다시 시도·삭제', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn(), onRemove = vi.fn();
    const items: FileItemData[] = [
      { id: '1', name: 'a.pdf', status: 'uploading', progress: 45 },
      { id: '2', name: 'b.pdf', status: 'done', size: 2_516_582, url: 'https://files.example/b.pdf' },
      { id: '3', name: 'c.pdf', status: 'error', error: '네트워크가 끊겨 올리지 못했어요. 다시 시도해 주세요.' },
    ];
    render(<FileList items={items} onRetry={onRetry} onRemove={onRemove} />);
    expect(screen.getByRole('progressbar', { name: 'a.pdf 올리는 중' })).toHaveAttribute('aria-valuenow', '45');
    expect(screen.getByRole('link', { name: 'b.pdf' })).toHaveAttribute('href', 'https://files.example/b.pdf');
    expect(screen.getByText('2.4 MB')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'c.pdf 다시 시도' }));
    await user.click(screen.getByRole('button', { name: 'a.pdf 삭제' }));
    expect(onRetry).toHaveBeenCalledWith('3');
    expect(onRemove).toHaveBeenCalledWith('1');
  });

  it('grid 미리보기: previewUrl(서버·data URL)은 그대로, 로컬 파일은 blob URL을 만들고 사라지면 해제', () => {
    const create = vi.fn(() => 'blob:local-1');
    const revoke = vi.fn();
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke });
    const local = new File(['x'], 'local.png', { type: 'image/png' });
    const { unmount } = render(
      <FileList layout="grid" items={[
        { id: 's', name: 'server.png', status: 'done', type: 'image/png', previewUrl: 'https://cdn.example/thumb.png' },
        { id: 'b', name: 'base64.png', status: 'done', type: 'image/png', previewUrl: 'data:image/png;base64,iVBORw0KGgo=' },
        { id: 'l', name: 'local.png', status: 'uploading', progress: 10, file: local },
      ]} />,
    );
    expect(screen.getByRole('img', { name: 'server.png' })).toHaveAttribute('src', 'https://cdn.example/thumb.png');
    expect(screen.getByRole('img', { name: 'base64.png' })).toHaveAttribute('src', 'data:image/png;base64,iVBORw0KGgo=');
    expect(screen.getByRole('img', { name: 'local.png' })).toHaveAttribute('src', 'blob:local-1');
    expect(create).toHaveBeenCalledWith(local);
    unmount();
    expect(revoke).toHaveBeenCalledWith('blob:local-1');
  });

  it('Field로 감싸면 라벨이 버튼 이름이 되고, 설명·에러·invalid가 연결됨', () => {
    render(
      <Field label="첨부 파일" error="파일을 1개 이상 올려 주세요." invalid>
        <FileDropzone onFilesChange={() => {}} />
      </Field>,
    );
    const zone = screen.getByRole('button', { name: '첨부 파일' });
    expect(zone).toHaveAttribute('aria-invalid', 'true');
    expect(zone).toHaveAccessibleDescription(/파일을 1개 이상 올려 주세요./);
    expect(zone).toHaveClass('sn:aria-invalid:border-danger');
  });

  it('formatBytes', () => {
    expect([formatBytes(512), formatBytes(2048), formatBytes(2_516_582)]).toEqual(['512 B', '2 KB', '2.4 MB']);
  });
});

describe('DataGrid', () => {
  type Key = { id: string; name: string; requests: number; status: string; createdAt: string; enabled: boolean };
  const keys: Key[] = [
    { id: 'a', name: 'production', requests: 12480, status: 'active', createdAt: '2026-10-21', enabled: true },
    { id: 'b', name: 'staging', requests: 3201, status: 'paused', createdAt: '2026-10-18', enabled: false },
    { id: 'c', name: 'legacy', requests: 0, status: 'unknown', createdAt: '2026-09-12', enabled: false },
  ];
  const columns = (extra: Partial<Record<'onToggle' | 'onDelete', (row: Key) => void>> = {}): DataGridColumn<Key>[] => [
    { field: 'name', header: '이름', type: 'text', pinned: 'left', width: 160, sortable: true },
    { field: 'requests', header: '요청 수', type: 'number', sortable: true },
    { field: 'status', header: '상태', type: 'badge', tones: { active: 'success', paused: 'warning' }, labels: { active: '활성', paused: '일시 정지' } },
    { field: 'createdAt', header: '만든 날', type: 'date' },
    { field: 'enabled', header: '사용', type: 'switch', onChange: (row, on) => extra.onToggle?.({ ...row, enabled: on }) },
    { id: 'actions', type: 'actions', pinned: 'right', actions: [{ label: '삭제', icon: X, tone: 'danger', onClick: row => extra.onDelete?.(row) }] },
  ];
  const names = () => screen.getAllByRole('row').slice(1).map(r => r.querySelectorAll('td')[0]?.textContent);

  it('서버에서 그린 HTML을 hydration해도 속성이 어긋나지 않음 (dnd-kit id)', async () => {
    const { renderToString } = await import('react-dom/server');
    const { hydrateRoot } = await import('react-dom/client');
    const grid = <DataGrid aria-label="API 키" rows={keys} getRowId={r => r.id} columns={columns()} onRowOrderChange={() => {}} onColumnOrderChange={() => {}} />;
    const container = document.createElement('div');
    container.innerHTML = renderToString(grid);
    document.body.appendChild(container);
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await React.act(async () => { hydrateRoot(container, grid); });
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
    container.remove();
  });

  it('형식 함수: 천 단위 쉼표, YYYY-MM-DD, YYYY-MM-DD HH:mm:ss', () => {
    expect(formatNumber(12480)).toBe('12,480');
    expect(formatNumber(null)).toBe('');
    expect(formatDate('2026-10-23')).toBe('2026-10-23');
    expect(formatDateTime(new Date(2026, 9, 23, 4, 5, 9))).toBe('2026-10-23 04:05:09');
    expect(formatDate('잘못된 값')).toBe('');
  });

  it('Figma Data Grid Cell의 type 목록과 같음', () => {
    expect([...dataGridCellTypes].sort()).toEqual([...figmaTokens.components['Data Grid Cell'].type].sort());
  });

  it('셀 타입: 숫자는 오른쪽 mono, 날짜는 mono, badge는 tone 매핑(없으면 neutral), switch는 바로 적용', async () => {
    const onToggle = vi.fn();
    render(<DataGrid aria-label="API 키" rows={keys} getRowId={r => r.id} columns={columns({ onToggle })} />);
    expect(screen.getByRole('cell', { name: '12,480' })).toHaveClass('sn:text-right', 'sn:font-mono');
    expect(screen.getByRole('cell', { name: '2026-10-21' })).toHaveClass('sn:font-mono');
    expect(screen.getByText('활성')).toHaveClass('sn:text-success');
    expect(screen.getByText('unknown')).toHaveClass('sn:text-default');
    await userEvent.click(screen.getAllByRole('switch', { name: '사용' })[1]);
    expect(onToggle).toHaveBeenCalledWith(expect.objectContaining({ id: 'b', enabled: true }));
  });

  it('actions: 1개면 aria-label 버튼, 2개 이상이면 더 보기 Menu (danger는 구분선 뒤)', async () => {
    const onDelete = vi.fn();
    const { rerender } = render(<DataGrid aria-label="API 키" rows={keys.slice(0, 1)} getRowId={r => r.id} columns={columns({ onDelete })} />);
    await userEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(onDelete).toHaveBeenCalledWith(keys[0]);
    const two: DataGridColumn<Key>[] = [
      { field: 'name', header: '이름', type: 'text' },
      { id: 'actions', type: 'actions', actions: [{ label: '삭제', tone: 'danger', onClick: onDelete }, { label: '이름 바꾸기', onClick: () => {} }] },
    ];
    rerender(<DataGrid aria-label="API 키" rows={keys.slice(0, 1)} getRowId={r => r.id} columns={two} />);
    await userEvent.click(screen.getByRole('button', { name: '더 보기' }));
    const items = await screen.findAllByRole('menuitem');
    expect(items.map(i => i.textContent)).toEqual(['이름 바꾸기', '삭제']);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('정렬: 머리글을 누르면 오름차순 → 내림차순 → 해제, aria-sort가 바뀜', async () => {
    const onSortingChange = vi.fn();
    render(<DataGrid aria-label="API 키" rows={keys} getRowId={r => r.id} columns={columns()} onSortingChange={onSortingChange} />);
    const head = screen.getByRole('columnheader', { name: '요청 수' });
    const btn = screen.getByRole('button', { name: '요청 수' });
    expect(head).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(btn);
    expect(head).toHaveAttribute('aria-sort', 'ascending');
    expect(names()).toEqual(['legacy', 'staging', 'production']);
    await userEvent.click(btn);
    expect(names()).toEqual(['production', 'staging', 'legacy']);
    await userEvent.click(btn);
    expect(head).toHaveAttribute('aria-sort', 'none');
    expect(onSortingChange.mock.calls.map(c => c[0])).toEqual([{ id: 'requests', desc: false }, { id: 'requests', desc: true }, null]);
  });

  it('선택: 행 체크박스, 머리글은 일부 선택이면 indeterminate, 전체 선택', async () => {
    const onSelectionChange = vi.fn();
    render(<DataGrid aria-label="API 키" rows={keys} getRowId={r => r.id} columns={columns()} onSelectionChange={onSelectionChange} />);
    await userEvent.click(screen.getAllByRole('checkbox', { name: '행 선택' })[1]);
    expect(onSelectionChange).toHaveBeenLastCalledWith(['b']);
    expect(screen.getAllByRole('row')[2]).toHaveAttribute('data-selected');
    const all = screen.getByRole('checkbox', { name: '모든 행 선택' });
    expect(all).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(all);
    expect(onSelectionChange).toHaveBeenLastCalledWith(['a', 'b', 'c']);
  });

  it('고정 열: 왼쪽·오른쪽 고정 칸이 sticky + 경계선', () => {
    render(<DataGrid aria-label="API 키" rows={keys} getRowId={r => r.id} columns={columns()} />);
    expect(screen.getByRole('cell', { name: 'production' })).toHaveClass('sn:sticky', 'sn:border-r');
    expect(screen.getAllByRole('button', { name: '삭제' })[0].closest('td')).toHaveClass('sn:sticky', 'sn:border-l');
  });

  it('행 이동: 핸들이 생기고, 정렬 중에는 숨김', () => {
    const { rerender } = render(<DataGrid aria-label="API 키" rows={keys} getRowId={r => r.id} columns={columns()} onRowOrderChange={() => {}} />);
    expect(screen.getAllByRole('button', { name: '행 옮기기' })).toHaveLength(3);
    rerender(<DataGrid aria-label="API 키" rows={keys} getRowId={r => r.id} columns={columns()} onRowOrderChange={() => {}} sorting={{ id: 'name', desc: false }} />);
    expect(screen.queryByRole('button', { name: '행 옮기기' })).not.toBeInTheDocument();
  });

  it('행 이동: 키보드로 Space → ↓ → Space 하면 새 순서를 넘김', async () => {
    // jsdom은 크기를 계산하지 않아서 행마다 40px 높이를 흉내 내요
    const rect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const tr = this.closest('tr');
      const i = tr?.parentElement ? [...tr.parentElement.children].indexOf(tr) : 0;
      return { x: 0, y: i * 40, top: i * 40, left: 0, bottom: i * 40 + 40, right: 600, width: 600, height: 40, toJSON: () => ({}) } as DOMRect;
    });
    const onRowOrderChange = vi.fn();
    render(<DataGrid aria-label="API 키" rows={keys} getRowId={r => r.id} columns={columns()} onRowOrderChange={onRowOrderChange} />);
    const handle = screen.getAllByRole('button', { name: '행 옮기기' })[0];
    handle.focus();
    const user = userEvent.setup();
    await user.keyboard(' ');
    await user.keyboard('{ArrowDown}');
    await user.keyboard(' ');
    expect(onRowOrderChange).toHaveBeenCalledWith(['b', 'a', 'c']);
    rect.mockRestore();
  });

  it('4가지 상태: loading이면 aria-busy, 행이 없으면 emptyState, 실패면 errorState', () => {
    const { rerender } = render(<DataGrid aria-label="API 키" rows={[]} getRowId={(r: Key) => r.id} columns={columns()} loading />);
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    rerender(<DataGrid aria-label="API 키" rows={[]} getRowId={(r: Key) => r.id} columns={columns()} emptyState={<EmptyState title="API 키가 없어요" />} />);
    expect(screen.getByText('API 키가 없어요')).toBeInTheDocument();
    rerender(<DataGrid aria-label="API 키" rows={keys} getRowId={r => r.id} columns={columns()} errorState={<ErrorState title="불러오지 못했어요" />} />);
    expect(screen.getByText('불러오지 못했어요')).toBeInTheDocument();
    expect(screen.queryByText('production')).not.toBeInTheDocument();
  });

  it('Table 상태 props: onSort면 머리글 버튼 + aria-sort, selected 행은 data-selected', () => {
    render(
      <Table>
        <TableHeader><TableRow><TableHead sort="desc" onSort={() => {}}>이름</TableHead></TableRow></TableHeader>
        <TableBody><TableRow selected><TableCell pinned="left">production</TableCell></TableRow></TableBody>
      </Table>,
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
    expect(screen.getByRole('button', { name: '이름' })).toHaveClass('sn:focus-visible:-outline-offset-2');
    expect(screen.getAllByRole('row')[1]).toHaveAttribute('data-selected');
  });

  it('화면 낭독기 안내는 table 밖(body)에 그려서 DOM 구조를 지킴', () => {
    const { container } = render(<DataGrid aria-label="API 키" rows={keys} getRowId={r => r.id} columns={columns()} onRowOrderChange={() => {}} />);
    expect(container.querySelector('table > div')).toBeNull();
    expect(document.body.querySelector(':scope > [id^="DndDescribedBy"]')).not.toBeNull();
  });

  it('포커스 링이 있는 요소에는 outline-none을 같이 쓰지 않음', () => {
    const { container } = render(
      <DataGrid aria-label="API 키" rows={keys} getRowId={r => r.id} columns={columns()} onSelectionChange={() => {}} onRowOrderChange={() => {}} onColumnOrderChange={() => {}} />,
    );
    const ringed = [...container.querySelectorAll('[class*="focus-visible:outline-2"]')];
    expect(ringed.length).toBeGreaterThan(10);
    for (const el of ringed) expect(el.className).not.toMatch(/(^|\s)sn:outline-none(\s|$)/);
  });
});

describe('Pagination', () => {
  it('번호: 7칸을 넘으면 처음·마지막과 현재 양옆만, 나머지는 줄임표', () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageItems(2, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20]);
    expect(getPageItems(10, 20)).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20]);
    expect(getPageItems(19, 20)).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20]);
  });

  it('현재 페이지에 aria-current, 첫 페이지에서는 처음·이전 비활성, 번호를 누르면 onPageChange', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={20} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: '1페이지' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: '처음 페이지' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: '이전 페이지' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(screen.getByRole('button', { name: '20페이지' }));
    expect(onPageChange).toHaveBeenLastCalledWith(20);
    await userEvent.click(screen.getByRole('button', { name: '다음 페이지' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
  });

  it('마지막 페이지로 가서 버튼이 비활성이 돼도 포커스가 남음', async () => {
    function Controlled() {
      const [page, setPage] = React.useState(1);
      return <Pagination page={page} pageCount={5} onPageChange={setPage} />;
    }
    render(<Controlled />);
    const last = screen.getByRole('button', { name: '마지막 페이지' });
    await userEvent.click(last);
    expect(last).toHaveAttribute('aria-disabled', 'true');
    expect(last).toHaveFocus();
    expect(screen.getByRole('button', { name: '5페이지' })).toHaveAttribute('aria-current', 'page');
  });

  it('showFirstLast={false}면 처음·마지막 버튼이 없음, onPageSizeChange가 없으면 Select도 없음', () => {
    render(<Pagination page={3} pageCount={5} onPageChange={() => {}} showFirstLast={false} />);
    expect(screen.queryByRole('button', { name: '처음 페이지' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '마지막 페이지' })).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: '페이지' })).toBeInTheDocument();
  });

  it('DataGrid 클라이언트: rows를 나누고, 행 수를 바꾸면 1페이지로', async () => {
    type R = { id: string; n: number };
    const rows: R[] = Array.from({ length: 45 }, (_, i) => ({ id: `r${i + 1}`, n: i + 1 }));
    render(<DataGrid aria-label="숫자" rows={rows} getRowId={r => r.id} columns={[{ field: 'n', header: 'n', type: 'number' }]} pagination={{ defaultPageSize: 10 }} />);
    expect(screen.getAllByRole('row')).toHaveLength(11);
    expect(screen.getByRole('button', { name: '5페이지' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '5페이지' }));
    expect(screen.getAllByRole('row').slice(1).map(r => r.textContent)).toEqual(['41', '42', '43', '44', '45']);
    await userEvent.click(screen.getByRole('combobox', { name: '페이지당 행' }));
    await userEvent.click(await screen.findByRole('option', { name: '20' }));
    expect(screen.getByRole('button', { name: '1페이지' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getAllByRole('row')).toHaveLength(21);
  });

  it('DataGrid 서버: rows를 그대로 보여 주고 rowCount로 페이지 수, 정렬은 서버에 맡김', async () => {
    type R = { id: string; n: number };
    const pageRows: R[] = [{ id: 'b', n: 2 }, { id: 'a', n: 1 }];
    const onSortingChange = vi.fn();
    const onPageChange = vi.fn();
    render(
      <DataGrid aria-label="숫자" rows={pageRows} getRowId={r => r.id} columns={[{ field: 'n', header: 'n', type: 'number', sortable: true }]}
        onSortingChange={onSortingChange} pagination={{ page: 1, onPageChange, pageSize: 2, rowCount: 9 }} />,
    );
    expect(screen.getByRole('button', { name: '5페이지' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'n' }));
    expect(onSortingChange).toHaveBeenCalledWith({ id: 'n', desc: false });
    expect(screen.getAllByRole('row').slice(1).map(r => r.textContent)).toEqual(['2', '1']);
    await userEvent.click(screen.getByRole('button', { name: '2페이지' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('DataGrid 전체 선택은 현재 페이지 행만, 다른 페이지 선택은 남김', async () => {
    type R = { id: string; n: number };
    const rows: R[] = Array.from({ length: 4 }, (_, i) => ({ id: `r${i + 1}`, n: i + 1 }));
    const onSelectionChange = vi.fn();
    render(
      <DataGrid aria-label="숫자" rows={rows} getRowId={r => r.id} columns={[{ field: 'n', header: 'n', type: 'number' }]}
        selection={['r4']} onSelectionChange={onSelectionChange} pagination={{ defaultPageSize: 2 }} />,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: '모든 행 선택' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(['r4', 'r1', 'r2']);
  });
});
