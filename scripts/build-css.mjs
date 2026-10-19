// src/styles/index.css → dist/styles.css (Tailwind 빌드 후 전체를 @layer sonic으로 감쌈)
//                       src/styles/theme.css → dist/tailwind.css (쓰는 쪽 Tailwind용 @theme 매핑)
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

mkdirSync('dist', { recursive: true });
execFileSync('node_modules/.bin/tailwindcss', ['-i', 'src/styles/index.css', '-o', 'dist/styles.raw.css', '--minify'], { stdio: 'inherit' });
let css = readFileSync('dist/styles.raw.css', 'utf8');

// @property는 cascade와 무관한 전역 등록이라 layer 밖(맨 앞)으로 뺌
const props = [];
css = css.replace(/@property\s+[\w-]+\s*\{[^}]*\}/g, m => (props.push(m), ''));

const out = `/*! sonic-ui | 전체가 @layer sonic 안에 있어요. 쓰는 쪽: @layer theme, base, sonic, components, utilities; */\n${props.join('')}@layer sonic{${css}}\n`;
writeFileSync('dist/styles.css', out);
execFileSync('rm', ['dist/styles.raw.css']);
copyFileSync('src/styles/theme.css', 'dist/tailwind.css');

console.log(`dist/styles.css ${(out.length / 1024).toFixed(1)}KB, @property ${props.length}개`);
