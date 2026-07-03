# Jiwon | 지원 — Portfolio

기획의 의도와 사용자의 감각이 같은 화면 안에서 만나는 경험을 만드는 프론트엔드 개발자 지원의 포트폴리오.

3D 갤러리(React Three Fiber)를 스크롤로 걷는 인터랙티브 포트폴리오입니다.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- three.js / @react-three/fiber / @react-three/drei
- @chenglou/pretext (물고기 형태를 따라 흐르는 About 텍스트 레이아웃)

## Structure

- `src/components/Hero.tsx` — 랜딩 히어로
- `src/components/AboutOverlay.tsx` — 영상 속 물고기 마스크를 피해 흐르는 소개 텍스트
- `src/components/Exhibit.tsx` — 스크롤로 이동하는 3D 갤러리 (WebGL 미지원 시 CSS 폴백)
- `src/components/ExhibitItem.tsx` — 개별 작품 액자
- `src/components/StackContact.tsx` — 스택 & 연락처
- `src/utils/`, `src/hooks/` — 텍스트 흐름 / 크기 측정 로직

## Scripts

```bash
pnpm dev            # 개발 서버
pnpm build          # 타입 체크 + 프로덕션 빌드
pnpm preview        # 빌드 미리보기
pnpm lint           # ESLint
pnpm format         # Prettier
```

## TODO (콘텐츠 채우기)

`src/App.tsx`의 `exhibits`와 `src/components/StackContact.tsx`에 실제 값으로 교체 필요:

- 프로젝트 `demoUrl` / `githubUrl` (현재 예시 링크)
- 이메일 `hello@example.com`
- GitHub / LinkedIn 링크
