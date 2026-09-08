import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../analytics';
import DeviceFrame from '../components/DeviceFrame';
import Footer from '../components/Footer';
import Highlights from '../components/Highlights';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import Reveal from '../components/Reveal';
import { categoryMeta, projectList, roleLabel } from '../data/projects';
import { profile } from '../data/profile';
import { useLang } from '../useLang';
import type { Project } from '../types';

// 굵은 파이프라인 — 정점(좌) → 중앙 교차 → 저점(우)으로 흐르는 S 웨이브.
// 가운데 교차점에서 앞뒤 컨트롤 포인트를 collinear로 맞춰 각 없이 이어진다.
const PIPE_PATH =
  'M -80 250 C 200 250, 300 140, 600 250 C 900 360, 1000 250, 1280 250';

// 모바일용 — 구불거림을 한 번으로 줄인 완만한 곡선
const PIPE_PATH_MOBILE = 'M -80 320 C 380 320, 700 160, 1280 240';

// 모바일용 — 색 변화를 줄여 주황~파랑 정도만
const GRADIENT_STOPS_MOBILE = (
  <>
    <stop offset="0%" stopColor="#ffa751" />
    <stop offset="100%" stopColor="#5b8def" />
  </>
);

const GRADIENT_STOPS = (
  <>
    <stop offset="0%" stopColor="#ff5f6d" />
    <stop offset="28%" stopColor="#ffa751" />
    <stop offset="52%" stopColor="#5b8def" />
    <stop offset="100%" stopColor="#8f5bff" />
  </>
);

// 파이프라인 배경. preserveAspectRatio로 채움(slice)/전체(meet) 전환.
function Pipe({
  suffix,
  preserveAspectRatio,
  path = PIPE_PATH,
  stops = GRADIENT_STOPS,
  viewBox = '0 0 1200 500',
  strokeWidth = 200,
  className = '',
}: {
  suffix: string;
  preserveAspectRatio: string;
  path?: string;
  stops?: ReactNode;
  viewBox?: string;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {/* 연한 파이프 */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-25"
        preserveAspectRatio={preserveAspectRatio}
        viewBox={viewBox}
      >
        <defs>
          <linearGradient id={`pf-${suffix}`} x1="0" x2="1" y1="0" y2="0">
            {stops}
          </linearGradient>
        </defs>
        <path
          d={path}
          fill="none"
          stroke={`url(#pf-${suffix})`}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* 선명한 버전 — 마스크가 좌→우로 훑으며 선명도를 올린다 */}
      <svg
        aria-hidden
        className="pipe-reveal absolute inset-0 h-full w-full filter-[drop-shadow(0_8px_28px_rgba(143,91,255,0.28))]"
        preserveAspectRatio={preserveAspectRatio}
        viewBox={viewBox}
      >
        <defs>
          <linearGradient id={`pv-${suffix}`} x1="0" x2="1" y1="0" y2="0">
            {stops}
          </linearGradient>
        </defs>
        <path
          d={path}
          fill="none"
          stroke={`url(#pv-${suffix})`}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

// featured만 노출 — data/projects.ts 배열에 적은 순서 그대로,
// 히어로 1개 + 그리드 최대 3개 (featured가 부족해도 다른 프로젝트로 채우지 않음)
const showcased = projectList
  .filter((p) => p.featured)
  .sort((a, b) => projectList.indexOf(a) - projectList.indexOf(b));
const hero = showcased[0];
const rest = showcased.filter((p) => p !== hero).slice(0, 3);

export default function HomePage() {
  const { lang, t, team } = useLang();
  const [selected, setSelected] = useState<Project | null>(null);

  const heroAccent = hero ? categoryMeta[hero.categories[0]].color : '#171717';
  const heroMeta = hero
    ? [hero.date, hero.context, hero.teamSize ? team(hero.teamSize) : null]
        .filter(Boolean)
        .join(' · ')
    : '';

  // 홈 화면에서만 섹션 스크롤 스냅 — 다른 페이지로 이동하면 해제.
  useEffect(() => {
    document.documentElement.classList.add('snap-y', 'snap-mandatory');
    return () => {
      document.documentElement.classList.remove('snap-y', 'snap-mandatory');
    };
  }, []);

  return (
    <main className="bg-white">
      {/* ── 히어로 (파이프라인) ── */}
      <section className="relative flex min-h-svh snap-start flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* 모든 화면에서 동일하게 보이도록 meet(전체 표시)로 통일 →
            화면 크기·비율과 무관하게 구불거림 횟수·색 스펙트럼(빨강~보라)이 항상 같다.
            굵기는 strokeWidth, 위아래 여백은 viewBox 높이로 조절. */}
        {/* 데스크톱: 2번 구불거리는 곡선 + 풀 스펙트럼 */}
        <Pipe
          className="hidden md:block"
          preserveAspectRatio="xMidYMid meet"
          suffix="d"
          viewBox="-90 60 1380 380"
        />
        {/* 모바일: 구불거림 1번 + 주황~파랑만 */}
        <Pipe
          className="md:hidden"
          path={PIPE_PATH_MOBILE}
          preserveAspectRatio="xMidYMid meet"
          stops={GRADIENT_STOPS_MOBILE}
          suffix="m"
          viewBox="-90 60 1380 380"
        />

        <div className="relative z-10 max-w-4xl [text-shadow:0_0_1px_rgba(255,255,255,0.5)]">
          <p className="mb-5 text-xs font-extrabold tracking-[0.3em] uppercase text-neutral-500">
            {t('home.role')}
          </p>
          <h1
            className={
              lang === 'en'
                ? 'text-[clamp(1.75rem,6vw,4.6rem)] leading-tight font-extrabold tracking-tight text-neutral-900 break-keep'
                : 'text-[clamp(2.2rem,7vw,5rem)] leading-tight font-extrabold tracking-tight text-neutral-900 break-keep'
            }
          >
            {t('home.headline1')}
            <br />
            {t('home.headline2')}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg break-keep whitespace-pre-line">
            {t('home.sub')}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-shadow-none">
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-neutral-900 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              to="/projects"
            >
              {t('home.viewProjects')}
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              to="/about"
            >
              {t('home.about')}
            </Link>
          </div>

          {/* 연락 / 외부 링크 — 이메일은 accent 톤의 작은 pill로 구분 */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-shadow-none">
            <a
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-neutral-100 px-4 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              href={`mailto:${profile.email}`}
            >
              {t('contact.email')}
            </a>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-neutral-500">
              {[
                ...(profile.resume
                  ? [
                      {
                        label: t('common.resume'),
                        href: profile.resume,
                        ext: true,
                        event: 'resume-click-home',
                      },
                    ]
                  : []),
                { label: 'GitHub', href: profile.github, ext: true },
                { label: 'LinkedIn', href: profile.linkedin, ext: true },
                { label: 'Blog', href: profile.blog, ext: true },
              ].map((s) => (
                <a
                  className="underline-offset-4 transition-colors hover:text-neutral-900 hover:underline"
                  href={s.href}
                  key={s.label}
                  onClick={
                    s.event
                      ? () => trackEvent(s.event, 'Resume · Home')
                      : undefined
                  }
                  rel={s.ext ? 'noreferrer' : undefined}
                  target={s.ext ? '_blank' : undefined}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 성과 하이라이트 ── */}
      <section className="relative snap-start scroll-mt-24 px-6 pt-16 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-xs font-extrabold tracking-[0.3em] uppercase text-neutral-500">
              {t('home.highlightsOverline')}
            </p>
            <h2 className="mt-3 text-[clamp(1.8rem,5vw,3rem)] leading-tight font-extrabold text-neutral-900">
              {t('home.highlightsTitle')}
            </h2>
          </Reveal>
          <Highlights className="mt-10" cols={2} size="lg" />
        </div>
      </section>

      {/* ── Featured Works ── */}
      {hero ? (
        <section className="relative snap-start scroll-mt-24 px-6 pt-16 pb-24 md:pt-20 md:pb-32">
          <Reveal className="mx-auto max-w-6xl">
            <p className="text-xs font-extrabold tracking-[0.3em] uppercase text-neutral-500">
              {t('home.selectedWork')}
            </p>
            <h2 className="mt-3 text-[clamp(1.8rem,5vw,3rem)] leading-tight font-extrabold text-neutral-900">
              {t('home.featuredTitle')}
            </h2>

            {/* 히어로 — 목업 쇼케이스 */}
            <div className="mt-14 grid items-center gap-10 md:grid-cols-2">
              <button
                className="group mx-auto w-full max-w-65"
                onClick={() => setSelected(hero)}
                type="button"
              >
                <div className="transition-transform duration-500 group-hover:-translate-y-2">
                  <DeviceFrame
                    alt={`${hero.title} 미리보기`}
                    fit="cover"
                    objectPosition="top"
                    src={hero.image}
                    variant={
                      hero.display === 'default' ? 'mobile' : hero.display
                    }
                  />
                </div>
              </button>

              <div className="text-left">
                <div className="flex flex-wrap items-center gap-2">
                  {hero.categories.map((cat) => {
                    const c = categoryMeta[cat].color;
                    return (
                      <span
                        className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                        key={cat}
                        style={{
                          backgroundColor: `color-mix(in srgb, ${c} 16%, white)`,
                          color: `color-mix(in srgb, ${c} 48%, black)`,
                        }}
                      >
                        {lang === 'en'
                          ? categoryMeta[cat].label
                          : categoryMeta[cat].labelKo}
                      </span>
                    );
                  })}
                  {hero.featured ? (
                    <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-[11px] font-medium text-white">
                      <span className="text-[#facc15]">★</span> Featured
                    </span>
                  ) : null}
                  {hero.highlight ? (
                    <span className="chrome-badge rounded-md px-2 py-0.5 text-[11px] font-medium text-neutral-800">
                      {lang === 'en'
                        ? (hero.highlightEn ?? hero.highlight)
                        : hero.highlight}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-4 text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight font-extrabold text-neutral-900">
                  {lang === 'en' ? hero.title : hero.titleKo}
                </h3>
                <p className="mt-1 text-sm font-bold text-neutral-500">
                  {lang === 'en' ? hero.titleKo : hero.title} ·{' '}
                  {roleLabel(hero.role, lang)}
                </p>
                <p className="mt-1 text-[11px] font-bold tracking-wide text-neutral-500">
                  {heroMeta}
                </p>

                <p className="mt-5 max-w-lg text-sm leading-relaxed text-neutral-600 break-keep md:text-base">
                  {lang === 'en' ? hero.descriptionEn : hero.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {hero.stack.slice(0, 7).map((item) => (
                    <span
                      className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-600"
                      key={item}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <button
                  className="mt-7 inline-flex h-10 items-center justify-center gap-2 rounded-md px-6 text-sm font-medium text-white shadow-sm transition-[filter] hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  onClick={() => setSelected(hero)}
                  style={{ backgroundColor: heroAccent }}
                  type="button"
                >
                  {t('common.viewDetail')}
                </button>
              </div>
            </div>

            {/* 나머지 대표작 — 클린 그리드 */}
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((project) => (
                <ProjectCard
                  key={project.slug}
                  onOpen={() => setSelected(project)}
                  project={project}
                />
              ))}
            </div>

            <div className="mt-14 text-center">
              <Link
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                to="/projects"
              >
                {t('home.allProjects')}
              </Link>
            </div>
          </Reveal>
        </section>
      ) : null}

      {/* ── 마무리 outro ── */}
      <section className="relative snap-start scroll-mt-24 px-6 pt-8 pb-24 text-center md:pb-32">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="text-[clamp(1.8rem,5vw,3rem)] leading-tight font-extrabold text-neutral-900">
            {t('contact.footerTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-600 break-keep md:text-lg">
            {t('contact.ready')}
          </p>
          <a
            className="mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-neutral-900 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            href={`mailto:${profile.email}`}
          >
            {t('contact.email')}
          </a>
          <p className="mt-10 text-sm text-neutral-400 break-keep">
            {profile.quote}
          </p>
          <p className="mt-1 text-sm text-neutral-400 break-keep">
            {t('contact.quoteMeaning')} — {t('contact.quoteAuthor')}
          </p>
        </Reveal>
      </section>

      <Footer />

      {selected ? (
        <ProjectModal onClose={() => setSelected(null)} project={selected} />
      ) : null}

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
