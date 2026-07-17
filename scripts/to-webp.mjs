// 이미지를 WebP로 변환하는 스크립트 (원본 png/jpg/jpeg는 삭제, .webp만 남김)
//   - src/assets/<target> 아래를 재귀 탐색
//   - 이미 같은 이름의 .webp가 있으면 건너뜀(멱등)
//   - 투명도(alpha)는 그대로 보존
//
// 사용:  pnpm images:webp            (대상 projects, quality 82)
//        pnpm images:webp mockups    (대상 mockups)
//        pnpm images:webp projects 88 (quality 88)

import { readdir, stat, readFile, writeFile, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const TARGET = process.argv[2] || 'projects';
const QUALITY = Number(process.argv[3]) || 82;
const DIR = join(ROOT, 'src', 'assets', TARGET);
const SRC_EXTS = new Set(['.png', '.jpg', '.jpeg']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const fmt = (b) =>
  b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)}MB` : `${Math.round(b / 1024)}KB`;

const exists = (p) =>
  stat(p).then(
    () => true,
    () => false,
  );

async function main() {
  let converted = 0;
  let before = 0;
  let after = 0;
  console.log(`\n🖼  WebP 변환 — src/assets/${TARGET} (quality ${QUALITY})\n`);

  for await (const file of walk(DIR)) {
    const ext = extname(file).toLowerCase();
    if (!SRC_EXTS.has(ext)) continue;

    const out = file.slice(0, -ext.length) + '.webp';
    if (await exists(out)) {
      console.log(`  · 이미 webp 존재, 건너뜀: ${out.replace(ROOT + '/', '')}`);
      continue;
    }

    const buf = await readFile(file);
    const webp = await sharp(buf).webp({ quality: QUALITY }).toBuffer();
    await writeFile(out, webp);
    await unlink(file); // 원본 삭제 (glob이 webp만 잡도록)

    before += buf.length;
    after += webp.length;
    converted++;
    const pct = Math.round((1 - webp.length / buf.length) * 100);
    console.log(
      `  ✅ ${file.replace(ROOT + '/', '')} → .webp  ${fmt(buf.length)} → ${fmt(webp.length)} (-${pct}%)`,
    );
  }

  console.log(
    `\n완료: ${converted}개 변환 · ${fmt(before)} → ${fmt(after)} (${fmt(before - after)} 절약)\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
