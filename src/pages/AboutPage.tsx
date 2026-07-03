import Footer from '../components/Footer';
import Timeline from '../components/Timeline';
import { projectList } from '../data/projects';
import { awards, educations, experiences, profile } from '../data/profile';

const baseStacks = [
  'React',
  'TypeScript',
  'JavaScript',
  'Swift',
  'Python',
  'Tailwind CSS',
  'R3F',
  'Three.js',
];

export default function AboutPage() {
  const stacks = Array.from(
    new Set([...baseStacks, ...projectList.flatMap((project) => project.stack)]),
  );

  return (
    <main className="min-h-svh bg-[#181512] text-[#f4f0e8]">
      <section className="mx-auto w-full max-w-5xl px-5 pt-32 pb-20 md:px-10 md:pt-40">
        <p className="text-xs font-extrabold tracking-wide uppercase text-[#d8a85f]">
          About
        </p>
        <h1 className="mt-4 text-[clamp(2.6rem,8vw,5rem)] leading-none font-extrabold">
          {profile.name}
          <span className="text-[#8f8672]"> · {profile.nameKo}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#c7bca8] md:text-lg">
          미려한 유저 경험을 디자인하는 프론트엔드 엔지니어가 되기 위해 노력하는
          주니어 개발자입니다. 기획의 의도와 사용자의 감각이 같은 화면 안에서
          만나는 경험을 만듭니다.
        </p>

        <div className="mt-20 grid gap-14 md:grid-cols-2">
          <Timeline entries={experiences} label="Experience" />
          <Timeline entries={educations} label="Education" />
        </div>

        <div className="mt-14">
          <Timeline entries={awards} label="Awards" />
        </div>

        <div className="mt-16">
          <p className="mb-5 text-xs font-extrabold tracking-wide uppercase text-[#d8a85f]">
            Tech & Tools
          </p>
          <div className="flex flex-wrap gap-2">
            {stacks.map((stack) => (
              <span
                className="border border-white/12 bg-white/6 px-3 py-2 text-xs font-bold text-[#e8decb]"
                key={stack}
              >
                {stack}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
