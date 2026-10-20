import './globals.css';
import { ToastProvider } from '@xonic0506/sonic-ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="dark">
      <body className="bg-canvas font-sans text-default" style={{ margin: 0 }}>
        <ToastProvider><div className="isolate p-6 flex flex-col gap-4 items-start">{children}</div></ToastProvider>
      </body>
    </html>
  );
}
