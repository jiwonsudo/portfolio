// 이미지를 WebP로 변환하는 스크립트 (원본 png/jpg/jpeg는 삭제, .webp만 남김)
//   - src/assets/<target> 아래를 재귀 탐색
//   - 이미 같은 이름의 .webp가 있으면 건너뜀(멱등)
//   - 투명도(alpha)는 그대로 보존
//
// 사용:  pnpm images:webp            (기본 대상 projects + profile, quality 82)
//        pnpm images:webp mockups    (대상 mockups)
//        pnpm images:webp projects 88 (quality 88)

import { readdir, stat, readFile, writeFile, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
// 인자로 대상을 주면 그것만, 없으면 기본 대상들을 모두 처리
const DEFAULT_TARGETS = ['projects', 'profile'];
const TARGETS = process.argv[2] ? [process.argv[2]] : DEFAULT_TARGETS;
const QUALITY = Number(process.argv[3]) || 82;
const SRC_EXTS = new Set(['.png', '.jpg', '.jpeg']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const fmt = (b) =>
  b >= 1024 * 1024
    ? `${(b / 1024 / 1024).toFixed(2)}MB`
    : `${Math.round(b / 1024)}KB`;

const exists = (p) =>
  stat(p).then(
    () => true,
    () => false,
  );

async function convertTarget(target, totals) {
  const dir = join(ROOT, 'src', 'assets', target);
  if (!(await exists(dir))) {
    console.log(`\n🖼  src/assets/${target} — 폴더 없음, 건너뜀`);
    return;
  }
  console.log(`\n🖼  WebP 변환 — src/assets/${target} (quality ${QUALITY})\n`);

  for await (const file of walk(dir)) {
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

    totals.before += buf.length;
    totals.after += webp.length;
    totals.converted++;
    const pct = Math.round((1 - webp.length / buf.length) * 100);
    console.log(
      `  ✅ ${file.replace(ROOT + '/', '')} → .webp  ${fmt(buf.length)} → ${fmt(webp.length)} (-${pct}%)`,
    );
  }
}

async function main() {
  const totals = { converted: 0, before: 0, after: 0 };
  for (const target of TARGETS) {
    await convertTarget(target, totals);
  }
  console.log(
    `\n완료: ${totals.converted}개 변환 · ${fmt(totals.before)} → ${fmt(totals.after)} (${fmt(totals.before - totals.after)} 절약)\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
