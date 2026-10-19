import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="dark">
      <body className="bg-canvas font-sans text-default" style={{ margin: 0 }}>
        <div className="isolate p-6 flex flex-col gap-4 items-start">{children}</div>
      </body>
    </html>
  );
}
