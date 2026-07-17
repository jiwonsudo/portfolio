import { useMemo, useState } from 'react';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import {
  categoryMeta,
  categoryOrder,
  dateSortKey,
  projectList,
} from '../data/projects';
import { useLang } from '../i18n';
import type { Project, ProjectCategory } from '../types';

type Filter = 'All' | ProjectCategory;
type SortOrder = 'newest' | 'oldest';

export default function ProjectsPage() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<Filter>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selected, setSelected] = useState<Project | null>(null);

  const tabs = useMemo<{ key: Filter; count: number }[]>(
    () => [
      { key: 'All', count: projectList.length },
      ...categoryOrder.map((category) => ({
        key: category,
        count: projectList.filter((p) => p.categories.includes(category))
          .length,
      })),
    ],
    [],
  );

  const tabLabel = (key: Filter) =>
    key === 'All'
      ? t('filter.all')
      : lang === 'en'
        ? categoryMeta[key].label
        : categoryMeta[key].labelKo;

  const filtered =
    filter === 'All'
      ? projectList
      : projectList.filter((project) => project.categories.includes(filter));

  // featured는 항상 맨 위 고정, 그 외엔 선택한 순서(date)대로 정렬
  const sorted = [...filtered].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1;
    }
    const diff = dateSortKey(a.date) - dateSortKey(b.date);
    return sortOrder === 'newest' ? -diff : diff;
  });

  return (
    <main className="min-h-svh bg-white text-neutral-900">
      <section className="mx-auto w-full max-w-6xl px-5 pt-32 pb-20 md:px-10 md:pt-40">
        <p className="text-xs font-extrabold tracking-[0.3em] uppercase text-neutral-500">
          {t('projects.archive')}
        </p>
        <h1 className="mt-4 text-[clamp(2.8rem,9vw,5.5rem)] leading-none font-extrabold text-neutral-900">
          {t('projects.works')}
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-500 md:text-base">
          {t('projects.intro')}
        </p>

        {/* 카테고리 필터 + 정렬 */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
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
                  {tabLabel(tab.key)}
                  <span
                    className={
                      active ? 'ml-1.5 opacity-70' : 'ml-1.5 opacity-50'
                    }
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-1 rounded-full border border-neutral-200 p-1">
            {(['newest', 'oldest'] as const).map((order) => (
              <button
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-200 ${
                  sortOrder === order
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                key={order}
                onClick={() => setSortOrder(order)}
                type="button"
              >
                {order === 'newest' ? t('sort.newest') : t('sort.oldest')}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((project) => (
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
