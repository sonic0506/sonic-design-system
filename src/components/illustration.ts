// 캐릭터 일러스트 (DESIGN.md §3.7). 공개하지 않음
// 이미지 파일은 패키지(dist/illustrations)에 함께 들어가고, 쓰는 쪽 번들러(Vite, Next.js)가 new URL을 자산으로 처리해요
export const illustrations = {
  empty: new URL(/* @vite-ignore */ '../illustrations/empty.webp', import.meta.url).href,
  error: new URL(/* @vite-ignore */ '../illustrations/error.webp', import.meta.url).href,
  404: new URL(/* @vite-ignore */ '../illustrations/error-404.webp', import.meta.url).href,
  403: new URL(/* @vite-ignore */ '../illustrations/error-403.webp', import.meta.url).href,
  500: new URL(/* @vite-ignore */ '../illustrations/error-500.webp', import.meta.url).href,
};
