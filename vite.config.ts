import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// BrowserRouter로 깔끔한 URL(/portfolio/about)을 쓰면, GitHub Pages는 그 경로를 몰라
// 새로고침/딥링크 시 404를 낸다. index.html을 404.html로 복사해두면 GitHub Pages가
// 404 대신 SPA를 그대로 띄우고, BrowserRouter가 주소창의 경로를 읽어 라우팅한다.
function spaFallback(): Plugin {
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    closeBundle() {
      const dist = resolve(__dirname, 'dist');
      const index = resolve(dist, 'index.html');
      if (existsSync(index)) copyFileSync(index, resolve(dist, '404.html'));
    },
  };
}

// https://vite.dev/config/
// base: GitHub Pages는 https://jiwonsudo.github.io/portfolio/ 처럼 저장소명 하위 경로로
// 배포되므로 에셋 경로에 '/portfolio/'를 붙여야 404가 안 난다.
export default defineConfig({
  base: '/portfolio/',
  plugins: [react(), tailwindcss(), spaFallback()],
});
