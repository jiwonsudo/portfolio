import { useMemo, useState } from 'react';
import DeviceFrame from '../components/DeviceFrame';
import Footer from '../components/Footer';
import ProjectModal from '../components/ProjectModal';
import { categoryMeta, categoryOrder, projectList } from '../data/projects';
import type { Project, ProjectCategory } from '../types';

type Filter = 'All' | ProjectCategory;

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const accent = categoryMeta[project.category].color;
  const meta = [
    project.date,
    project.context,
    project.teamSize ? `${project.teamSize}인 팀` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <button
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
      onClick={onOpen}
      type="button"
    >
      {/* 기기 프레임 썸네일 */}
      <div className="relative aspect-4/3 overflow-hidden bg-linear-to-b from-neutral-50 to-neutral-100">
        {project.display === 'mobile' ? (
          <div className="absolute top-8 left-1/2 w-[86%] -translate-x-1/2 transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.02]">
            <DeviceFrame
              alt={`${project.title} 미리보기`}
              objectPosition="top"
              src={project.image}
              variant="mobile"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-5 transition-transform duration-500 group-hover:scale-[1.03]">
            <DeviceFrame
              alt={`${project.title} 미리보기`}
              className="w-[90%]"
              objectPosition="top"
              src={project.image}
              variant="desktop"
            />
          </div>
        )}

        {/* 하단 페이드 — 모바일 컷오프 부드럽게 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-neutral-100 to-transparent" />

        <span
          className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-extrabold"
          style={{
            backgroundColor: `color-mix(in srgb, ${accent} 16%, white)`,
            color: `color-mix(in srgb, ${accent} 78%, black)`,
          }}
        >
          {categoryMeta[project.category].label}
        </span>
        {project.featured ? (
          <span className="absolute top-3 right-3 rounded-full bg-neutral-900/85 px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur">
            ★ Featured
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div>
          <h3 className="text-lg leading-tight font-extrabold text-neutral-900">
            {project.titleKo}
          </h3>
          <p className="mt-0.5 text-sm font-bold text-neutral-400">
            {project.title} · {project.role}
          </p>
        </div>
        <p className="text-[11px] font-bold tracking-wide text-neutral-400">
          {meta}
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-neutral-600">
          {project.description}
        </p>
        <span
          className="mt-auto pt-2 text-[11px] font-extrabold uppercase"
          style={{ color: accent }}
        >
          자세히 보기 →
        </span>
      </div>
    </button>
  );
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>('All');
  const [selected, setSelected] = useState<Project | null>(null);

  const tabs = useMemo<{ key: Filter; label: string; count: number }[]>(
    () => [
      { key: 'All', label: 'All', count: projectList.length },
      ...categoryOrder.map((category) => ({
        key: category,
        label: categoryMeta[category].label,
        count: projectList.filter((p) => p.category === category).length,
      })),
    ],
    [],
  );

  const filtered =
    filter === 'All'
      ? projectList
      : projectList.filter((project) => project.category === filter);

  return (
    <main className="min-h-svh bg-white text-neutral-900">
      <section className="mx-auto w-full max-w-6xl px-5 pt-32 pb-20 md:px-10 md:pt-40">
        <p className="text-xs font-extrabold tracking-[0.3em] uppercase text-neutral-400">
          Archive
        </p>
        <h1 className="mt-4 text-[clamp(2.8rem,9vw,5.5rem)] leading-none font-extrabold text-neutral-900">
          Works
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-500 md:text-base">
          간단한 아이디어를 확장하고, 여러 개발 도구로 구현하여 효과적으로
          실력을 기르려 노력합니다.
        </p>

        {/* 카테고리 필터 */}
        <div className="mt-12 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = filter === tab.key;
            const accent =
              tab.key === 'All' ? '#171717' : categoryMeta[tab.key].color;

            return (
              <button
                className="rounded-full border px-4 py-2 text-xs font-bold transition-colors duration-200"
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={
                  active
                    ? {
                        backgroundColor: accent,
                        borderColor: accent,
                        color: '#fff',
                      }
                    : { borderColor: '#e5e5e5', color: '#525252' }
                }
                type="button"
              >
                {tab.label}
                <span
                  className={active ? 'ml-1.5 opacity-70' : 'ml-1.5 opacity-50'}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.slug}
              onOpen={() => setSelected(project)}
              project={project}
            />
          ))}
        </div>
      </section>

      <Footer />

      {selected ? (
        <ProjectModal onClose={() => setSelected(null)} project={selected} />
      ) : null}
    </main>
  );
}
