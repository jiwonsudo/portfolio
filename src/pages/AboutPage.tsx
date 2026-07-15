import Footer from '../components/Footer';
import Timeline from '../components/Timeline';
import { projectList } from '../data/projects';
import { awards, educations, experiences, profile } from '../data/profile';
import { techCategoryOrder, techMeta } from '../data/techMeta';

const baseStacks = [
  'React',
  'TypeScript',
  'JavaScript',
  'Swift',
  'Python',
  'Tailwind CSS',
  'Express.js',
  'R3F',
  'Three.js',
  'Supabase',
  'Vercel',
  'Cloudflare Tunnel',
];

// Tech & Tools 목록에서 제외할 스택 (프로젝트 데이터엔 남겨 둠)
const excludedStacks = new Set(['Django', 'Spring']);

export default function AboutPage() {
  const stacks = Array.from(
    new Set([
      ...baseStacks,
      ...projectList.flatMap((project) => project.stack),
    ]),
  ).filter((stack) => !excludedStacks.has(stack));

  // 용도(category)별로 묶고, 정의된 순서대로 노출한다.
  const groups = techCategoryOrder
    .map((category) => ({
      category,
      items: stacks.filter((stack) => techMeta[stack]?.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <main className="relative min-h-svh overflow-hidden bg-white text-neutral-900">
      {/* 화려한 비비드 mesh 그라데이션 배경 (또렷하게 떠다니는 컬러 블롭) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="blob float-a absolute -top-40 -left-32 h-128 w-lg bg-[radial-gradient(circle,#ff5f6d99,transparent_68%)]" />
        <div className="blob float-b absolute -top-24 right-0 h-136 w-136 bg-[radial-gradient(circle,#5b8def99,transparent_68%)]" />
        <div className="blob float-c absolute top-1/3 -left-24 h-120 w-120 bg-[radial-gradient(circle,#8f5bff8c,transparent_68%)]" />
        <div className="blob float-a absolute right-1/4 bottom-10 h-128 w-lg bg-[radial-gradient(circle,#00c2a88c,transparent_68%)]" />
        <div className="blob float-b absolute -bottom-24 left-1/4 h-120 w-120 bg-[radial-gradient(circle,#ffa75199,transparent_68%)]" />
      </div>

      <section className="relative mx-auto w-full max-w-5xl px-5 pt-32 pb-20 md:px-10 md:pt-40">
        <p className="fade-up text-xs font-extrabold tracking-[0.3em] uppercase text-neutral-400">
          About
        </p>
        <h1 className="fade-up fade-up-1 mt-4 text-[clamp(2.6rem,8vw,5rem)] leading-none font-extrabold">
          <span className="text-neutral-900">{profile.name}</span>
          <span className="text-neutral-300"> · {profile.nameKo}</span>
        </h1>
        <p className="fade-up fade-up-2 mt-6 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg break-keep">
          미려한 유저 경험을 디자인하는 프론트엔드 엔지니어가 되기 위해 노력하는
          개발자입니다. 기획의 의도와 사용자의 감각이 같은 화면 안에서 만나는
          경험을 만듭니다.
        </p>

        <div className="fade-up fade-up-3 mt-20 grid gap-5 md:grid-cols-2">
          <div className="panel">
            <Timeline
              accent="#6366f1"
              entries={experiences}
              label="Experience"
            />
          </div>
          <div className="panel">
            <Timeline accent="#0ea5e9" entries={educations} label="Education" />
          </div>
        </div>

        <div className="panel fade-up fade-up-3 mt-5">
          <Timeline accent="#f59e0b" entries={awards} label="Awards" />
        </div>

        <div className="panel fade-up fade-up-3 mt-5">
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" />
            <p className="text-xs font-extrabold tracking-[0.2em] uppercase text-[#8b5cf6]">
              Tech &amp; Tools
            </p>
          </div>
          <p className="mb-6 pl-4.5 text-xs text-neutral-500">
            각 태그를 누르면 해당 기술의 공식 사이트로 이동합니다.
          </p>
          <div className="grid gap-6">
            {groups.map((group) => (
              <div key={group.category}>
                <p className="mb-3 text-[11px] font-bold tracking-wide text-neutral-500">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((stack) => {
                    const meta = techMeta[stack]!;

                    return (
                      <a
                        className="tech-chip rounded-full px-4 py-2 text-xs font-bold"
                        href={meta.url}
                        key={stack}
                        rel="noreferrer"
                        style={{
                          ['--c' as string]: meta.color,
                          ['--fg' as string]: meta.dark ? '#181512' : '#ffffff',
                        }}
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
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(14px);
          box-shadow: 0 10px 44px rgba(80, 70, 160, 0.1);
          padding: 1.5rem;
        }
        @media (min-width: 768px) {
          .panel { padding: 2rem; }
        }
        .blob {
          border-radius: 9999px;
          filter: blur(52px);
          will-change: transform;
        }
        .float-a { animation: float-a 14s ease-in-out infinite; }
        .float-b { animation: float-b 17s ease-in-out infinite; }
        .float-c { animation: float-c 12s ease-in-out infinite; }
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
          background-color: var(--c);
          color: var(--fg);
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }
        .tech-chip:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 22px -6px color-mix(in srgb, var(--c) 65%, transparent);
          filter: saturate(1.15);
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
