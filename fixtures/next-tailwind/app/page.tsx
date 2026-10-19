// 서버 컴포넌트에서 sonic-ui를 그대로 사용
import { Button, Dialog, DialogTrigger, DialogPopup, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@xonic0506/sonic-ui';

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
