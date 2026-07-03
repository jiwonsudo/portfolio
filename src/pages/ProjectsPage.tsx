import Footer from '../components/Footer';
import { categoryLabels, projectsByCategory } from '../data/projects';
import type { Project } from '../types';

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_10px_40px_rgba(70,58,42,0.08)] transition-shadow hover:shadow-[0_20px_60px_rgba(70,58,42,0.16)]">
      <div className="relative aspect-square overflow-hidden bg-[#efe9dd]">
        {project.image ? (
          <img
            alt={`${project.title} 미리보기`}
            className="absolute inset-0 h-full w-full object-contain p-5 drop-shadow-md transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            src={project.image}
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-[11px] font-extrabold tracking-wide uppercase text-[#9e7435]">
          {project.number} · {categoryLabels[project.category]} · {project.period}
        </p>
        <div>
          <h3 className="text-xl leading-tight font-extrabold text-[#181512]">
            {project.title}
          </h3>
          <p className="mt-0.5 text-sm font-bold text-[#9c9284]">
            {project.titleKo} · {project.role}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-[#6e665a]">
          {project.description}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <span
              className="rounded-full border border-black/10 bg-[#f7f3ec] px-2.5 py-1 text-[10px] font-bold text-[#756b5e]"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
        {project.githubUrl || project.demoUrl ? (
          <div className="mt-auto flex flex-wrap gap-4 pt-3 text-[11px] font-extrabold uppercase">
            {project.demoUrl ? (
              <a
                className="text-[#9e7435] underline underline-offset-4"
                href={project.demoUrl}
                rel="noreferrer"
                target="_blank"
              >
                Demo ↗
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                className="text-[#756b5e] underline underline-offset-4 transition-colors hover:text-[#181512]"
                href={project.githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                Code ↗
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <main className="min-h-svh bg-[#f4f0e8]">
      <section className="mx-auto w-full max-w-6xl px-5 pt-32 pb-20 md:px-10 md:pt-40">
        <p className="text-xs font-extrabold tracking-wide uppercase text-[#9e7435]">
          Archive
        </p>
        <h1 className="mt-4 text-[clamp(2.8rem,9vw,5.5rem)] leading-none font-extrabold text-[#181512]">
          Works
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#6e665a] md:text-base">
          간단한 아이디어를 확장하고, 여러 개발 도구로 구현하여 효과적으로
          실력을 기르려 노력합니다.
        </p>

        <div className="mt-16 grid gap-20">
          {projectsByCategory.map((group) => (
            <div key={group.category}>
              <div className="mb-8 flex items-baseline gap-3 border-b border-black/10 pb-4">
                <h2 className="text-2xl font-extrabold text-[#181512]">
                  {group.label}
                </h2>
                <span className="text-sm font-bold text-[#9c9284]">
                  {group.items.length}
                </span>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
