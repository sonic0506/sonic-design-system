import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
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
