// 캐릭터 일러스트 URL (DESIGN.md §3.7). 키는 Figma `Illustration / <이름>`과 같아요
// 이미지 파일은 패키지(dist/illustrations)에 함께 들어가고, 쓰는 쪽 번들러(Vite, Next.js)가 new URL을 자산으로 처리해요
export const illustrations = {
  empty: new URL(/* @vite-ignore */ '../illustrations/empty.webp', import.meta.url).href,
  error: new URL(/* @vite-ignore */ '../illustrations/error.webp', import.meta.url).href,
  'error-404': new URL(/* @vite-ignore */ '../illustrations/error-404.webp', import.meta.url).href,
  'error-403': new URL(/* @vite-ignore */ '../illustrations/error-403.webp', import.meta.url).href,
  'error-500': new URL(/* @vite-ignore */ '../illustrations/error-500.webp', import.meta.url).href,
};
