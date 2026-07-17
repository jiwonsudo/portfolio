// 프로젝트 이미지 일괄 압축 스크립트 (멱등 — 이미 처리한 이미지는 재압축하지 않음)
//   - src/assets/<target> 아래의 png/jpg/jpeg/webp를 재귀 탐색
//   - 긴 변이 MAX_DIM 을 넘으면 비율 유지하며 축소
//   - 화질 유지 선에서 재인코딩(mozjpeg / png palette / webp)
//   - 결과가 원본보다 THRESHOLD 이상 작을 때만 교체
//   - ★ 처리한 파일의 콘텐츠 해시를 manifest에 기록 → 다음 실행부터 그 파일은 건너뜀
//     (파일 내용이 바뀌면 해시가 달라져 딱 한 번만 다시 압축된다. 화질 재열화 방지)
//
// 사용:  pnpm compress:images            (기본 max 1600px, 대상 projects)
//        pnpm compress:images 1280       (max 1280px)
//        pnpm compress:images 1600 mockups   (대상 폴더 변경)
//        pnpm compress:images 1600 projects --force   (manifest 무시하고 강제 재압축)

import { readdir, stat, rename, unlink, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const FORCE = process.argv.includes('--force');
// 재압축 없이 현재 파일들을 '처리 완료'로 기록만 (화질 손실 0). 손실 중단용.
const RECORD_ONLY = process.argv.includes('--record-only');
const MAX_DIM = Number(args[0]) || 1600;
const TARGET = args[1] || 'projects';
const QUALITY = 80;
const THRESHOLD = 0.03; // 3% 이상 줄어들 때만 교체

const DIR = join(ROOT, 'src', 'assets', TARGET);
const MANIFEST_PATH = join(ROOT, 'scripts', '.image-manifest.json');
const EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const fmt = (b) =>
  b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)}MB` : `${Math.round(b / 1024)}KB`;

function encode(pipeline, ext) {
  if (ext === '.png')
    return pipeline.png({ compressionLevel: 9, palette: true, quality: QUALITY });
  if (ext === '.webp') return pipeline.webp({ quality: QUALITY });
  return pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
}

async function loadManifest() {
  try {
    const json = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
    return new Set(json.done ?? []);
  } catch {
    return new Set();
  }
}

async function saveManifest(done) {
  const json = { note: '이 파일은 이미 압축된 이미지의 해시 목록입니다. 삭제하지 마세요(재압축→화질 열화 방지). 커밋 권장.', done: [...done].sort() };
  await writeFile(MANIFEST_PATH, JSON.stringify(json, null, 2) + '\n');
}

async function main() {
  const done = FORCE ? new Set() : await loadManifest();

  let totalBefore = 0;
  let totalAfter = 0;
  let changed = 0;
  let skipped = 0;

  console.log(
    `\n📦 이미지 압축 — src/assets/${TARGET} (max ${MAX_DIM}px)${FORCE ? ' [FORCE]' : ''}\n`,
  );

  for await (const file of walk(DIR)) {
    const ext = extname(file).toLowerCase();
    if (!EXTS.has(ext)) continue;

    const rel = file.replace(ROOT + '/', '');
    const before = await readFile(file);
    const beforeHash = sha(before);

    // 이미 처리한(=최종본) 파일이면 건너뛴다 → 재압축으로 인한 화질 열화 방지
    if (done.has(beforeHash)) {
      skipped++;
      continue;
    }

    // 기록 전용 모드: 압축하지 않고 현재 상태를 최종본으로 등록만
    if (RECORD_ONLY) {
      done.add(beforeHash);
      skipped++;
      continue;
    }

    try {
      const meta = await sharp(before).metadata();
      const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
      let pipeline = sharp(before).rotate();
      if (longest > MAX_DIM) {
        pipeline = pipeline.resize({
          width: meta.width >= meta.height ? MAX_DIM : undefined,
          height: meta.height > meta.width ? MAX_DIM : undefined,
          withoutEnlargement: true,
        });
      }

      const tmp = `${file}.tmp`;
      await encode(pipeline, ext).toFile(tmp);
      const after = await readFile(tmp);

      if (after.length < before.length * (1 - THRESHOLD)) {
        await rename(tmp, file);
        changed++;
        totalBefore += before.length;
        totalAfter += after.length;
        const pct = Math.round((1 - after.length / before.length) * 100);
        console.log(`  ✅ ${rel}\n     ${fmt(before.length)} → ${fmt(after.length)} (-${pct}%)`);
        done.add(sha(after)); // 최종본(압축된) 해시 기록
      } else {
        await unlink(tmp);
        done.add(beforeHash); // 이미 충분히 작음 → 원본을 최종본으로 기록
      }
    } catch (err) {
      console.log(`  ⚠️  건너뜀 ${rel} (${err.message})`);
    }
  }

  await saveManifest(done);

  const saved = totalBefore - totalAfter;
  console.log(
    `\n완료: ${changed}개 압축 · ${skipped}개 건너뜀(이미 처리됨) · ${fmt(saved)} 절약\n` +
      `manifest: scripts/.image-manifest.json (${done.size}개 기록)\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
