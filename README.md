# 정지원 · Jiwon Jeong — Portfolio

프론트엔드 개발자 정지원의 개인 포트폴리오. 한/영 이중 언어를 지원하며, 프로젝트·이력·이력서 PDF를 한곳에서 제공합니다.

**https://jiwonsudo.github.io/portfolio/**

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router v7
- Pretendard (자체 호스팅 가변 폰트)

## Structure

```
src/
├─ pages/          HomePage · ProjectsPage · AboutPage · NotFound
├─ components/     ProjectCard/Modal · DeviceFrame · Timeline · Highlights · Nav · Footer 등
├─ data/           콘텐츠 원본 — 여기만 고치면 사이트가 바뀝니다
│  ├─ projects.ts    프로젝트 목록 + 카테고리 메타
│  ├─ profile.ts     소개 · 경력 · 학력 · 수상 · 자격증
│  └─ techMeta.ts    기술 스택 분류 · 색상 · 링크
├─ assets/         프로젝트 이미지 · 프로필 사진 · 폰트
└─ i18n.tsx        한/영 문구
```

콘텐츠는 전부 `src/data/`에 모여 있어, 컴포넌트를 건드리지 않고 데이터만 수정하면 됩니다.

## 프로젝트 추가하기

1. 이미지를 규칙대로 넣습니다 (파일만 두면 glob이 자동으로 인식):

   ```
   src/assets/projects/<slug>/대표/  ← 썸네일 1장
   src/assets/projects/<slug>/설명/  ← 모달 캐러셀용 (여러 장 가능)
   ```

2. [`src/data/projects.ts`](src/data/projects.ts)의 `projectsMeta` 배열 **맨 앞**(최신순)에 메타데이터를 추가합니다. `slug`는 폴더명과 동일하게.

기술 스택 칩의 색상·링크는 [`src/data/techMeta.ts`](src/data/techMeta.ts)에서 관리하며, 등록되지 않은 스택은 회색 칩으로 안전하게 표시됩니다.

## Scripts

```bash
pnpm dev              # 개발 서버
pnpm build            # 타입 체크 + 프로덕션 빌드
pnpm preview          # 빌드 미리보기
pnpm lint             # ESLint
pnpm format           # Prettier
pnpm images:webp      # 이미지 WebP 변환
pnpm compress:images  # 이미지 압축
pnpm resume           # 이력서 PDF 생성 (public/resume.pdf)
pnpm og               # OG 이미지 생성 (public/og-image.png)
```

## 이력서 PDF

[`scripts/resume.html`](scripts/resume.html)이 이력서 원본입니다. 내용을 고친 뒤 아래 명령으로 `public/resume.pdf`를 다시 생성합니다.

```bash
pnpm resume
```

헤드리스 Chrome의 print-to-pdf를 사용하므로 별도 의존성이 필요 없으며, 사이트와 동일한 Pretendard 서체로 A4에 렌더링됩니다. 생성된 PDF는 [`src/data/profile.ts`](src/data/profile.ts)의 `resume` 필드를 통해 Home·About의 이력서 버튼으로 연결됩니다.

## OG 이미지

소셜 공유용 이미지는 [`scripts/gen-og.mjs`](scripts/gen-og.mjs)에서 SVG로 정의합니다. 문구나 색을 바꾼 뒤 `pnpm og`를 실행하면 `public/og-image.png`가 갱신됩니다.

## 배포

`main` 브랜치에 푸시하면 [GitHub Actions](.github/workflows/deploy.yml)가 빌드 후 GitHub Pages에 배포합니다. 저장소 하위 경로로 서비스되므로 [`vite.config.ts`](vite.config.ts)에 `base: '/portfolio/'`가 설정되어 있습니다. `public/` 하위 정적 파일을 참조할 때는 `import.meta.env.BASE_URL`을 사용해야 배포 환경에서 경로가 깨지지 않습니다.
