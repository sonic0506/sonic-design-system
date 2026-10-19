import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
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
