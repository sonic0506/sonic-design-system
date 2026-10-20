'use client';
import { useState } from 'react';
import { Field, FileDropzone, FileList, type FileItemData } from '@xonic0506/sonic-ui';

export function Upload() {
  const [items, setItems] = useState<FileItemData[]>([]);
  return (
    <div className="w-100 flex flex-col gap-2">
      <Field label="첨부 파일" description="PDF, 10MB 이하">
        <FileDropzone multiple accept=".pdf" maxSize={10_000_000} onFilesChange={a => setItems(p => [...p, ...a.map(f => ({ id: f.name, name: f.name, size: f.size, status: 'uploading' as const, progress: 30, file: f }))])} />
      </Field>
      <FileList items={items} onRemove={id => setItems(p => p.filter(i => i.id !== id))} />
    </div>
  );
}
