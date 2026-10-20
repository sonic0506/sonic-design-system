'use client';
import { Button, useToast } from '@xonic0506/sonic-ui';

export function ToastButton() {
  const toast = useToast();
  return <Button id="b-toast" variant="secondary" onClick={() => toast.add({ title: 'API 키를 만들었어요', description: '키는 지금 한 번만 보여 줘요.', tone: 'success' })}>알림 띄우기</Button>;
}
