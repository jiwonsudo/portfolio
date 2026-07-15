import { Link } from 'react-router-dom';

// 굵은 파이프라인 — 정점(좌) → 중앙 교차 → 저점(우)으로 흐르는 S 웨이브.
// 가운데 교차점에서 앞뒤 컨트롤 포인트를 collinear로 맞춰 각 없이 이어진다.
const PIPE_PATH =
  'M -80 250 C 200 250, 300 140, 600 250 C 900 360, 1000 250, 1280 250';

const GRADIENT_STOPS = (
  <>
    <stop offset="0%" stopColor="#ff5f6d" />
    <stop offset="28%" stopColor="#ffa751" />
    <stop offset="52%" stopColor="#5b8def" />
    <stop offset="76%" stopColor="#8f5bff" />
    <stop offset="100%" stopColor="#00c2a8" />
  </>
);

export default function HomePage() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-white px-6 text-center">
      <div className="pointer-events-none absolute inset-0">
        {/* 원래의 연한 그라데이션 파이프 (항상 깔려 있음) */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-25"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1200 500"
        >
          <defs>
            <linearGradient id="pipe-faint" x1="0" x2="1" y1="0" y2="0">
              {GRADIENT_STOPS}
            </linearGradient>
          </defs>
          <path
            d={PIPE_PATH}
            fill="none"
            stroke="url(#pipe-faint)"
            strokeLinecap="round"
            strokeWidth="88"
          />
        </svg>

        {/* 같은 파이프의 선명한 버전 — 마스크가 좌→우로 훑으며 선명도를 올린다 */}
        <svg
          aria-hidden
          className="pipe-reveal absolute inset-0 h-full w-full filter-[drop-shadow(0_8px_28px_rgba(143,91,255,0.28))]"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1200 500"
        >
          <defs>
            <linearGradient id="pipe-vivid" x1="0" x2="1" y1="0" y2="0">
              {GRADIENT_STOPS}
            </linearGradient>
          </defs>
          <path
            d={PIPE_PATH}
            fill="none"
            stroke="url(#pipe-vivid)"
            strokeLinecap="round"
            strokeWidth="88"
          />
        </svg>
      </div>

      {/* 설명 — 파이프 위 가독성은 글자 흰색 글로우(text-shadow)로 확보 */}
      <div className="relative z-10 max-w-3xl [text-shadow:0_0_1px_rgba(255,255,255,0.5)]">
        <p className="mb-5 text-xs font-extrabold tracking-[0.3em] uppercase text-neutral-500">
          Frontend-based Software Engineer
        </p>
        <h1 className="text-[clamp(2.6rem,7vw,5rem)] leading-tight font-extrabold tracking-tight text-neutral-900">
          화면에서 시작해
          <br />
          유저에게로.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg break-keep">
          화면과 서버를 하나의 흐름으로 잇습니다.
          <br />
          사용자가 자연스럽게 몰입할 수 있는 경험을 설계하고 구현합니다.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4 text-shadow-none">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-7 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
            to="/projects"
          >
            프로젝트 보기 →
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-7 py-3 text-sm font-bold text-neutral-700 transition-colors hover:border-neutral-400"
            to="/about"
          >
            소개
          </Link>
        </div>
      </div>

      <style>{`
        .pipe-reveal {
          -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 33%, transparent 46%, transparent 100%);
          mask-image: linear-gradient(90deg, #000 0%, #000 33%, transparent 46%, transparent 100%);
          -webkit-mask-size: 300% 100%;
          mask-size: 300% 100%;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: 100% 0;
          mask-position: 100% 0;
          animation: pipe-reveal 2.6s cubic-bezier(0.33, 0, 0.12, 1) forwards;
        }
        @keyframes pipe-reveal {
          to {
            -webkit-mask-position: 0% 0;
            mask-position: 0% 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pipe-reveal {
            animation: none;
            -webkit-mask-position: 0% 0;
            mask-position: 0% 0;
          }
        }
      `}</style>
    </main>
  );
}
