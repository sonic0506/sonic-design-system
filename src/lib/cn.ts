import { extendTailwindMerge } from 'tailwind-merge';

// sn 접두사와 DESIGN.md의 글자 크기 이름을 tailwind-merge에 알려 줘야 text-body(크기)와 text-muted(색)를 구분해요
const twMerge = extendTailwindMerge({
  prefix: 'sn',
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'title', 'body', 'body-strong', 'label', 'caption'] }],
    },
  },
});

export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(inputs.filter(Boolean).join(' '));
}
