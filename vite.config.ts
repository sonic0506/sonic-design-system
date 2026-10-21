/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 라이브러리 JS 빌드. CSS는 scripts/build-css.mjs가 따로 만듦
export default defineConfig({
  plugins: [
    react(),
    // 일러스트는 base64로 넣지 않고 dist/illustrations 파일로 둬요(복사는 package.json build:js).
    // 소스의 @vite-ignore를 빌드 결과에서 지워, 쓰는 쪽 번들러가 new URL을 자산으로 처리하게 해요
    {
      name: 'sonic-illustrations',
      apply: 'build',
      renderChunk: code => code.replaceAll('/* @vite-ignore */', ''),
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: { entry: 'src/index.ts', formats: ['es'] },
    rollupOptions: {
      external: id => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0'),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        // 컴포넌트(.tsx)는 클라이언트 컴포넌트라 붙임 (Next.js App Router용).
        // index와 .ts(buttonVariants, cn 등)에는 붙이지 않아야 서버 컴포넌트에서 함수를 호출할 수 있어요
        banner: chunk => (chunk.facadeModuleId?.endsWith('.tsx') ? '"use client";' : ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
