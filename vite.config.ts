/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 라이브러리 JS 빌드. CSS는 scripts/build-css.mjs가 따로 만듦
export default defineConfig({
  plugins: [react()],
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
        // 모든 컴포넌트가 클라이언트 컴포넌트라 파일마다 붙임 (Next.js App Router용)
        banner: '"use client";',
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
