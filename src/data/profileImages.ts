/**
 * 프로필 사진 자동 수집 — 프로젝트 이미지와 동일한 대표/설명 규칙.
 *   src/assets/profile/대표/*   → 대표 1장(About 아바타)
 *   src/assets/profile/설명/*   → 나머지(뒤에 겹쳐 보이는 미리보기 + 모달 갤러리)
 * 파일만 넣으면 자동으로 잡힌다(파일명 순 정렬).
 */
const modules = import.meta.glob('../assets/profile/*/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

// macOS 파일명은 NFD로 저장될 수 있어 정규화 후 비교한다.
const REPRESENTATIVE = '대표'.normalize('NFC');

let representative: string | undefined;
const rest: string[] = [];
for (const path of Object.keys(modules).sort()) {
  const match = path.match(/\/profile\/([^/]+)\//);
  if (!match) continue;
  if (match[1].normalize('NFC') === REPRESENTATIVE) {
    representative = modules[path];
  } else {
    rest.push(modules[path]);
  }
}

/** About 아바타에 쓰는 대표 사진 */
export const profilePhoto = representative ?? rest[0];

/** 아바타 뒤에 겹쳐 보일 미리보기(설명 사진들) */
export const profilePreviews = rest;

/** 모달 갤러리용 전체 사진(대표를 맨 앞에) */
export const profilePhotos = [
  ...(representative ? [representative] : []),
  ...rest,
];
