import * as React from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { CircleAlert, File as FileIcon, Image as ImageIcon, RefreshCw, Upload, X } from 'lucide-react';
import { cn } from '../lib/cn';
import { Button } from './button';
import { Link } from './link';
import { Progress } from './progress';

// 컴포넌트는 고르기·검사·표시만 해요. 업로드는 API를 아는 프로젝트가 해요 (DESIGN.md §10 FileDropzone / FileList)

/** 바이트를 "2.4 MB"처럼 표시 */
export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${Number(v.toFixed(1))} ${units[i]}`;
}

export interface FileRejection {
  file: File;
  reason: 'type' | 'size' | 'count';
  /** 기본 문구. 바꾸려면 이 값 대신 직접 보여 주세요 */
  message: string;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept.split(',').map(a => a.trim().toLowerCase()).filter(Boolean).some(a =>
    a.startsWith('.') ? name.endsWith(a) : a.endsWith('/*') ? type.startsWith(a.slice(0, -1)) : type === a,
  );
}

function checkFiles(files: File[], { accept, maxSize, maxFiles, multiple }: Pick<FileDropzoneProps, 'accept' | 'maxSize' | 'maxFiles' | 'multiple'>) {
  const limit = multiple ? (maxFiles ?? Infinity) : 1;
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  for (const file of files) {
    if (!matchesAccept(file, accept)) rejected.push({ file, reason: 'type', message: `${file.name}: 올릴 수 없는 형식이에요. ${accept} 파일만 올려 주세요.` });
    else if (maxSize !== undefined && file.size > maxSize) rejected.push({ file, reason: 'size', message: `${file.name}: ${formatBytes(maxSize)}보다 큰 파일은 올릴 수 없어요.` });
    else if (accepted.length >= limit) rejected.push({ file, reason: 'count', message: limit <= 0 ? '더 올릴 수 없어요. 파일을 삭제한 뒤 다시 골라 주세요.' : `${limit}개까지 올릴 수 있어요.` });
    else accepted.push(file);
  }
  return { accepted, rejected };
}

export interface FileDropzoneProps {
  onFilesChange: (accepted: File[], rejected: FileRejection[]) => void;
  /** 예: ".pdf", "image/*", "image/png,image/jpeg" */
  accept?: string;
  multiple?: boolean;
  /** 남은 개수. multiple일 때만 */
  maxFiles?: number;
  /** 파일 하나의 최대 크기(바이트) */
  maxSize?: number;
  variant?: 'file' | 'image';
  /** 영역 안 안내 문구. Field 밖에서 쓰면 버튼 이름이 돼요 */
  title?: React.ReactNode;
  description?: React.ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

/** Input처럼 Field로 감싸면 라벨·설명·에러·invalid·disabled가 연결돼요 */
export function FileDropzone({ onFilesChange, accept, multiple, maxFiles, maxSize, variant = 'file', title, description, invalid, disabled, name, id, className }: FileDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [rejectMessage, setRejectMessage] = React.useState<string>();
  const messageId = React.useId();

  const handle = (files: File[]) => {
    if (!files.length) return;
    const { accepted, rejected } = checkFiles(files, { accept, maxSize, maxFiles, multiple });
    setRejectMessage(rejected.length ? rejected[0].message + (rejected.length > 1 ? ` (외 ${rejected.length - 1}개)` : '') : undefined);
    onFilesChange(accepted, rejected);
  };
  const showInvalid = invalid || !!rejectMessage;
  const Icon = variant === 'image' ? ImageIcon : Upload;

  return (
    <>
      <BaseField.Control
        render={<button type="button" />}
        id={id}
        disabled={disabled}
        aria-describedby={messageId}
        data-dragging={dragging ? '' : undefined}
        aria-invalid={invalid || undefined}
        data-invalid={showInvalid ? '' : undefined}
        onClick={() => inputRef.current?.click()}
        onDragEnter={e => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragOver={e => e.preventDefault()}
        onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false); }}
        onDrop={e => { e.preventDefault(); setDragging(false); if (!disabled) handle([...e.dataTransfer.files]); }}
        className={cn(
          'sn:group sn:box-border sn:flex sn:w-full sn:flex-col sn:items-center sn:gap-2 sn:rounded-lg sn:border sn:border-dashed sn:border-strong sn:bg-surface sn:px-4 sn:py-6 sn:font-sans sn:text-center sn:cursor-pointer sn:transition-colors sn:duration-(--sn-duration-fast) sn:ease-standard sn:hover:not-disabled:bg-subtle sn:data-dragging:border-focus sn:data-dragging:bg-subtle sn:data-invalid:border-danger sn:aria-invalid:border-danger sn:focus-visible:outline-2 sn:focus-visible:outline-offset-2 sn:focus-visible:outline-focus sn:disabled:cursor-not-allowed sn:disabled:opacity-(--sn-opacity-disabled) sn:motion-reduce:transition-none',
          className,
        )}
      >
        <Icon className="sn:size-6 sn:text-muted sn:group-data-invalid:text-danger sn:group-aria-invalid:text-danger" />
        <span className="sn:text-body-strong sn:text-default">{title ?? (variant === 'image' ? '이미지를 끌어다 놓거나 눌러서 고르세요' : '파일을 끌어다 놓거나 눌러서 고르세요')}</span>
        <span id={messageId} aria-live="polite" className={cn('sn:text-caption', rejectMessage ? 'sn:text-danger' : 'sn:text-muted')}>
          {rejectMessage ?? description}
        </span>
      </BaseField.Control>
      <input
        ref={inputRef}
        type="file"
        hidden
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={e => { handle([...(e.target.files ?? [])]); e.target.value = ''; }}
      />
    </>
  );
}

export interface FileItemData {
  id: string;
  name: string;
  /** 바이트 */
  size?: number;
  /** MIME. 이미지 여부 판단 */
  type?: string;
  status: 'uploading' | 'done' | 'error';
  /** 0~100 */
  progress?: number;
  /** 무엇이 실패했고 어떻게 고치는지 */
  error?: string;
  /** 완료된 파일을 열 주소 */
  url?: string;
  /** 썸네일: 서버 주소, data URL, blob URL 모두 가능 */
  previewUrl?: string;
  /** 방금 고른 로컬 파일. previewUrl이 없으면 blob URL을 만들어 미리보기에 써요 */
  file?: File;
}

/** previewUrl이 없고 로컬 이미지 파일이 있으면 blob URL을 만들고, 사라질 때 해제해요 */
function usePreview(item: FileItemData) {
  const [blobUrl, setBlobUrl] = React.useState<string>();
  const isImage = (item.type ?? item.file?.type ?? '').startsWith('image/');
  React.useEffect(() => {
    if (item.previewUrl || !item.file || !isImage) return;
    const url = URL.createObjectURL(item.file);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [item.previewUrl, item.file, isImage]);
  return item.previewUrl ?? blobUrl;
}

export interface FileListProps {
  items: FileItemData[];
  layout?: 'list' | 'grid';
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
}

export function FileList({ items, layout = 'list', onRemove, onRetry, className }: FileListProps) {
  const Item = layout === 'grid' ? GridItem : ListItem;
  return (
    <ul className={cn('sn:m-0 sn:list-none sn:p-0 sn:font-sans', layout === 'grid' ? 'sn:flex sn:flex-wrap sn:gap-3' : 'sn:flex sn:flex-col sn:gap-2', className)}>
      {items.map(item => <Item key={item.id} item={item} onRemove={onRemove} onRetry={onRetry} />)}
    </ul>
  );
}

interface ItemProps {
  item: FileItemData;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
}

function ListItem({ item, onRemove, onRetry }: ItemProps) {
  const error = item.status === 'error';
  return (
    <li className={cn('sn:box-border sn:flex sn:items-center sn:gap-3 sn:rounded-md sn:border sn:bg-surface sn:p-3', error ? 'sn:border-danger' : 'sn:border-default')}>
      <span className="sn:flex sn:size-8 sn:shrink-0 sn:items-center sn:justify-center sn:rounded-md sn:bg-subtle">
        <FileIcon className={cn('sn:size-4', error ? 'sn:text-danger' : 'sn:text-muted')} />
      </span>
      <div className="sn:flex sn:min-w-0 sn:flex-1 sn:flex-col sn:gap-1">
        <div className="sn:flex sn:items-center sn:justify-between sn:gap-2">
          {item.status === 'done' && item.url ? (
            <Link href={item.url} target="_blank" rel="noopener noreferrer" className="sn:min-w-0 sn:truncate sn:text-body">{item.name}</Link>
          ) : (
            <span className="sn:min-w-0 sn:truncate sn:text-body sn:text-default">{item.name}</span>
          )}
          <span className="sn:shrink-0 sn:font-mono sn:text-caption sn:text-muted">
            {item.status === 'uploading' ? `${Math.round(item.progress ?? 0)}%` : item.size !== undefined ? formatBytes(item.size) : null}
          </span>
        </div>
        {item.status === 'uploading' && <Progress value={item.progress ?? 0} aria-label={`${item.name} 올리는 중`} />}
        {error && item.error && <span className="sn:text-caption sn:text-danger">{item.error}</span>}
      </div>
      <Actions item={item} onRemove={onRemove} onRetry={onRetry} variant="ghost" />
    </li>
  );
}

function GridItem({ item, onRemove, onRetry }: ItemProps) {
  const error = item.status === 'error';
  const preview = usePreview(item);
  return (
    <li className="sn:flex sn:w-24 sn:flex-col sn:gap-1">
      <div className={cn('sn:relative sn:box-border sn:flex sn:size-24 sn:flex-col sn:justify-between sn:overflow-hidden sn:rounded-md sn:border sn:bg-subtle sn:p-1', error ? 'sn:border-danger' : 'sn:border-default')}>
        {preview && !error ? (
          <img src={preview} alt={item.name} className="sn:absolute sn:inset-0 sn:size-full sn:object-cover" />
        ) : (
          <span className="sn:absolute sn:inset-0 sn:flex sn:items-center sn:justify-center">
            {error ? <CircleAlert className="sn:size-6 sn:text-danger" /> : <ImageIcon className="sn:size-6 sn:text-muted" />}
          </span>
        )}
        <div className="sn:relative sn:flex sn:justify-end">
          <Actions item={item} onRemove={onRemove} onRetry={onRetry} variant="secondary" />
        </div>
        {item.status === 'uploading' && (
          <div className="sn:relative">
            <Progress value={item.progress ?? 0} aria-label={`${item.name} 올리는 중`} />
          </div>
        )}
      </div>
      <span className={cn('sn:truncate sn:text-caption', error ? 'sn:text-danger' : 'sn:text-muted')} title={item.name}>
        {item.name}
      </span>
      {error && item.error && <span className="sn:sr-only">{item.error}</span>}
    </li>
  );
}

function Actions({ item, onRemove, onRetry, variant }: ItemProps & { variant: 'ghost' | 'secondary' }) {
  return (
    <div className="sn:flex sn:shrink-0">
      {item.status === 'error' && onRetry && (
        <Button size="icon-sm" variant={variant} aria-label={`${item.name} 다시 시도`} onClick={() => onRetry(item.id)}>
          <RefreshCw />
        </Button>
      )}
      {onRemove && (
        <Button size="icon-sm" variant={variant} aria-label={`${item.name} 삭제`} onClick={() => onRemove(item.id)}>
          <X />
        </Button>
      )}
    </div>
  );
}
