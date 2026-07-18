// 이력서 PDF 생성: scripts/resume.html → public/resume.pdf
// 내용을 고치려면 scripts/resume.html 을 수정하고 `node scripts/gen-resume.mjs` 재실행.
// 헤드리스 Chrome의 print-to-pdf를 쓰므로 별도 의존성이 필요 없다.
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const source = join(ROOT, 'scripts', 'resume.html');
const target = join(ROOT, 'public', 'resume.pdf');

// Chrome은 --print-to-pdf 경로에 한글/공백이 섞이면 실패할 수 있어 임시 디렉터리에 뽑고 옮긴다.
const work = mkdtempSync(join(tmpdir(), 'resume-'));
const staged = join(work, 'resume.pdf');

try {
  execFileSync(
    CHROME,
    [
      '--headless',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${staged}`,
      pathToFileURL(source).href,
    ],
    { stdio: 'inherit' },
  );
  copyFileSync(staged, target);
  console.log(`✓ ${target}`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
