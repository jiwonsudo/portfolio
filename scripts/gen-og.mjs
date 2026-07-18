// 소셜 공유용 OG 이미지(1200×630) 생성 → public/og-image.png
// 문구/색을 바꾸고 `node scripts/gen-og.mjs` 재실행하면 다시 만들어진다.
import sharp from 'sharp';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="flow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff5f6d"/>
      <stop offset="28%" stop-color="#ffa751"/>
      <stop offset="52%" stop-color="#5b8def"/>
      <stop offset="76%" stop-color="#8f5bff"/>
      <stop offset="100%" stop-color="#00c2a8"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#ffffff"/>
  <path d="M -60 470 C 220 470, 300 370, 600 470 C 900 570, 980 380, 1260 470"
        fill="none" stroke="url(#flow)" stroke-width="70" stroke-linecap="round" opacity="0.22"/>
  <text x="90" y="150" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700"
        letter-spacing="6" fill="#8b8f98">FRONTEND-BASED SOFTWARE ENGINEER</text>
  <text x="86" y="285" font-family="'Apple SD Gothic Neo', AppleGothic, Helvetica, sans-serif" font-size="90" font-weight="800"
        fill="#141414">정지원 · Jiwon Jeong</text>
  <text x="90" y="385" font-family="'Apple SD Gothic Neo', AppleGothic, sans-serif" font-size="46" font-weight="700"
        fill="#3f4653">문제에서, 결과까지.</text>
  <text x="90" y="560" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="700"
        fill="#a3a8b2">github.com/jiwonsudo</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile(join(ROOT, 'public', 'og-image.png'));

console.log('✅ public/og-image.png (1200×630) 생성 완료');
