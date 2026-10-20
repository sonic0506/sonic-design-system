import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AlertDialog, AlertDialogClose, AlertDialogPopup, AlertDialogTitle, AlertDialogTrigger, Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger,
  Popover, PopoverPopup, PopoverTitle, PopoverTrigger, Separator, Tab, Tabs, TabsList, TabsPanel, Tooltip,
  Checkbox, CheckboxGroup, Radio, RadioGroup, Select, Switch, Textarea,
  EmptyState, ErrorState, Field, Skeleton,
  Avatar, Button, Card, CardBody, CardHeader, CardTitle, Dialog, DialogClose, DialogPopup, DialogTitle, DialogTrigger, Input, Text,
} from './index';

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
      </>,
    );
    const ringed = [...container.querySelectorAll('[class*="focus-visible:outline-2"]')];
    expect(ringed.length).toBeGreaterThanOrEqual(9);
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
