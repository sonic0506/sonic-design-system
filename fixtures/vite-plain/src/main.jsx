import { createRoot } from 'react-dom/client';
import '@xonic0506/sonic-ui/styles.css';
import './app.css';
import { Button, Dialog, DialogTrigger, DialogPopup, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@xonic0506/sonic-ui';

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
createRoot(document.getElementById('root')).render(<App />);
