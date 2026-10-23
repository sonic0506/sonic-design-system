// 표와 DataGrid가 같은 형식으로 보여 주도록 함께 써요. 값이 없으면 빈 문자열이에요
type DateInput = string | number | Date | null | undefined;

const numberFormat = new Intl.NumberFormat('ko-KR');
const pad = (n: number) => String(n).padStart(2, '0');
const toDate = (v: DateInput) => {
  if (v == null || v === '') return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

/** 12480 → "12,480" */
export function formatNumber(value: number | null | undefined) {
  return value == null || Number.isNaN(value) ? '' : numberFormat.format(value);
}

/** YYYY-MM-DD (브라우저 현지 시간) */
export function formatDate(value: DateInput) {
  // 날짜만 있는 ISO 문자열은 UTC 자정으로 읽혀 하루 밀릴 수 있어서 그대로 써요
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = toDate(value);
  return d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : '';
}

/** YYYY-MM-DD HH:mm:ss (브라우저 현지 시간) */
export function formatDateTime(value: DateInput) {
  const d = toDate(value);
  return d ? `${formatDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` : '';
}
