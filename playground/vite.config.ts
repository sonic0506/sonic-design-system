import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Figma Core 페이지와 비교하는 확인용 화면. 빌드된 dist/styles.css를 써서 배포물 그대로 확인함 (npm run build 먼저)
export default defineConfig({ root: 'playground', plugins: [react()], server: { port: 5180 } });
