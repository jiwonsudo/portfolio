import { trackEvent } from '../analytics';
import Footer from '../components/Footer';
import Highlights from '../components/Highlights';
import Timeline from '../components/Timeline';
import { projectList } from '../data/projects';
import {
  awards,
  credentials,
  educations,
  experiences,
  profile,
} from '../data/profile';
import { techCategoryOrder, techMeta } from '../data/techMeta';
import { useLang } from '../useLang';
import ProfileAvatar from '../components/ProfileAvatar';

// Footer·Home과 동일한 순서로 통일
const socials = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'Blog', href: profile.blog },
];

export default function AboutPage() {
  const { lang, t } = useLang();

  // Tech & Tools는 프로젝트에서 실제 쓰인 스택을 자동으로 모은다 (추가 시 자동 반영).
  const stacks = Array.from(
    new Set(projectList.flatMap((project) => project.stack)),
  );

  // 용도(category)별로 묶고, techMeta에 없는 스택은 '기타' 그룹으로 모은다.
  const grouped = techCategoryOrder
    .map((category) => ({
      category: category as string,
      items: stacks.filter((stack) => techMeta[stack]?.category === category),
    }))
    .filter((group) => group.items.length > 0);
  const etc = stacks.filter((stack) => !techMeta[stack]);
  const groups = etc.length
    ? [...grouped, { category: '기타', items: etc }]
    : grouped;

  return (
    <main className="relative min-h-svh overflow-hidden bg-white text-neutral-900">
      {/* 화려한 비비드 mesh 그라데이션 배경 (또렷하게 떠다니는 컬러 블롭) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="blob float-a absolute -top-40 -left-32 h-128 w-lg bg-[radial-gradient(circle,#ff5f6d99,transparent_68%)]" />
        <div className="blob float-b absolute -top-24 right-0 h-136 w-136 bg-[radial-gradient(circle,#5b8def99,transparent_68%)]" />
        <div className="blob float-c absolute top-1/3 -left-24 hidden h-120 w-120 bg-[radial-gradient(circle,#8f5bff8c,transparent_68%)] md:block" />
        <div className="blob float-a absolute right-1/4 bottom-10 h-128 w-lg bg-[radial-gradient(circle,#00c2a88c,transparent_68%)]" />
        <div className="blob float-b absolute -bottom-24 left-1/4 hidden h-120 w-120 bg-[radial-gradient(circle,#ffa75199,transparent_68%)] md:block" />
      </div>

      <section className="relative mx-auto w-full max-w-5xl px-5 pt-32 pb-20 md:px-10 md:pt-40">
        <div className="flex flex-col gap-7 md:flex-row md:items-start md:gap-10">
          <ProfileAvatar alt={lang === 'en' ? profile.name : profile.nameKo} />
          <div className="min-w-0 flex-1">
            <p className="fade-up text-xs font-extrabold tracking-[0.3em] uppercase text-neutral-500">
              {t('about.label')}
            </p>
            <h1 className="fade-up fade-up-1 mt-4 text-[clamp(2.6rem,8vw,5rem)] leading-none font-extrabold">
              <span className="text-neutral-900">
                {lang === 'en' ? profile.name : profile.nameKo}
              </span>
              <span className="text-[#8a8a8a]">
                {' · '}
                {lang === 'en' ? profile.nameKo : profile.name}
              </span>
            </h1>
            <p className="fade-up fade-up-2 mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg break-keep">
              {lang === 'en' ? profile.introEn : profile.intro}
            </p>
          </div>
        </div>

        {/* 연락 / 외부 링크 — 이메일을 대표 CTA로 강조 */}
        <div className="fade-up fade-up-2 mt-7 flex flex-wrap items-center gap-2.5">
          <a
            className="group inline-flex h-10 items-center justify-center gap-2 rounded-md bg-neutral-900 px-5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            href={`mailto:${profile.email}`}
          >
            <span aria-hidden>✉</span>
            {t('contact.email')}
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
          {profile.resume ? (
            <a
              className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900 shadow-sm transition-colors duration-200 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              href={profile.resume}
              onClick={() => trackEvent('resume-click-about', 'Resume · About')}
              rel="noreferrer"
              target="_blank"
            >
              {t('common.resume')} ↗
            </a>
          ) : null}
          {socials.map((s) => (
            <a
              className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900 shadow-sm transition-colors duration-200 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              href={s.href}
              key={s.label}
              rel="noreferrer"
              target={s.href.startsWith('mailto:') ? undefined : '_blank'}
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* 성과 하이라이트 */}
        <Highlights className="mt-12" />

        <div className="fade-up fade-up-3 mt-16 grid gap-5 md:grid-cols-2">
          <div className="panel">
            <Timeline
              accent="#6366f1"
              entries={experiences}
              label={t('section.experience')}
            />
          </div>
          <div className="panel">
            <Timeline
              accent="#0ea5e9"
              entries={educations}
              label={t('section.education')}
            />
          </div>
        </div>

        <div className="panel fade-up fade-up-3 mt-5">
          <Timeline
            accent="#f59e0b"
            entries={awards}
            label={t('section.awards')}
          />
        </div>

        {/* 어학 · 자격증 */}
        {credentials.length > 0 ? (
          <div className="panel fade-up fade-up-3 mt-5">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e11d48]" />
              <p className="text-xs font-extrabold tracking-[0.2em] uppercase text-[#be123c]">
                {t('about.certifications')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {credentials.map((c) => (
                <span
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/70 px-4 py-2.5 backdrop-blur"
                  key={`${c.name}-${c.detail ?? ''}`}
                >
                  <span className="text-[10px] font-bold text-[#be123c]">
                    {lang === 'en' ? c.kindEn : c.kind}
                  </span>
                  <span className="text-sm font-extrabold text-neutral-900">
                    {c.name}
                  </span>
                  {c.detail ? (
                    <span className="text-sm font-bold text-neutral-500">
                      {c.detail}
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="panel fade-up fade-up-3 mt-5">
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" />
            <p className="text-xs font-extrabold tracking-[0.2em] uppercase text-[#7c3aed]">
              {t('about.techTitle')}
            </p>
          </div>
          <p className="mb-6 pl-4.5 text-xs text-neutral-500">
            {t('about.techHint')}
          </p>
          <div className="grid gap-6">
            {groups.map((group) => (
              <div key={group.category}>
                <p className="mb-3 text-[11px] font-bold tracking-wide text-neutral-500">
                  {group.category === '기타' ? t('about.etc') : group.category}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((stack) => {
                    const meta = techMeta[stack];

                    // techMeta에 없는 스택은 회색 비링크 칩으로 안전하게 노출
                    if (!meta) {
                      return (
                        <span
                          className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600"
                          key={stack}
                        >
                          {stack}
                        </span>
                      );
                    }

                    return (
                      <a
                        className="tech-chip rounded-md px-2.5 py-1 text-xs font-medium"
                        href={meta.url}
                        key={stack}
                        rel="noreferrer"
                        style={{ ['--c' as string]: meta.color }}
                        target="_blank"
                      >
                        {stack}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .panel {
          border-radius: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.6);
          /* 모바일은 backdrop-filter가 비싸 불투명 배경으로 대체(아래 md에서 blur 적용) */
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 10px 44px rgba(80, 70, 160, 0.1);
          padding: 1.5rem;
        }
        .blob {
          border-radius: 9999px;
          /* 모바일은 블러를 낮춰 합성 비용을 줄임 */
          filter: blur(34px);
        }
        @media (min-width: 768px) {
          .panel {
            padding: 2rem;
            background: rgba(255, 255, 255, 0.72);
            backdrop-filter: blur(14px);
          }
          .blob { filter: blur(52px); will-change: transform; }
          .float-a { animation: float-a 14s ease-in-out infinite; }
          .float-b { animation: float-b 17s ease-in-out infinite; }
          .float-c { animation: float-c 12s ease-in-out infinite; }
        }
        @keyframes float-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(90px, -70px) scale(1.18); }
        }
        @keyframes float-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-100px, 64px) scale(1.14); }
        }
        @keyframes float-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(70px, 60px) scale(1.2); }
          66% { transform: translate(-56px, 30px) scale(0.94); }
        }
        @media (prefers-reduced-motion: reduce) {
          .float-a, .float-b, .float-c { animation: none; }
        }
        .tech-chip {
          background-color: color-mix(in srgb, var(--c) 14%, white);
          color: color-mix(in srgb, var(--c) 48%, black);
          border: 1px solid color-mix(in srgb, var(--c) 22%, white);
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }
        .tech-chip:hover {
          background-color: color-mix(in srgb, var(--c) 20%, white);
          border-color: color-mix(in srgb, var(--c) 34%, white);
        }
        .fade-up {
          animation: about-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .fade-up-1 { animation-delay: 0.08s; }
        .fade-up-2 { animation-delay: 0.16s; }
        .fade-up-3 { animation-delay: 0.24s; }
        @keyframes about-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fade-up { animation: none; }
        }
      `}</style>
    </main>
  );
}
