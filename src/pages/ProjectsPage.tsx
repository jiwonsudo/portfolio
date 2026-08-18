import { useEffect, useMemo, useRef, useState } from 'react';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import Reveal from '../components/Reveal';
import {
  categoryMeta,
  categoryOrder,
  dateSortKey,
  projectList,
} from '../data/projects';
import { useLang } from '../useLang';
import type { Project, ProjectCategory } from '../types';

type Filter = 'All' | ProjectCategory;
type SortOrder = 'newest' | 'oldest';

const BATCH = 6; // 한 번에 노출/추가할 카드 수

export default function ProjectsPage() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<Filter>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selected, setSelected] = useState<Project | null>(null);
  const [visible, setVisible] = useState(BATCH);
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  // featured는 항상 맨 위 고정(그 안에서는 data/projects.ts 배열 순서 그대로),
  // 그 외엔 선택한 순서(date)대로 정렬
  const sorted = [...filtered].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1;
    }
    if (a.featured && b.featured) {
      return projectList.indexOf(a) - projectList.indexOf(b);
    }
    const diff = dateSortKey(a.date) - dateSortKey(b.date);
    return sortOrder === 'newest' ? -diff : diff;
  });

  // 필터/정렬이 바뀌면 렌더 중에 처음 배치로 리셋 (effect 없이)
  const viewKey = `${filter}|${sortOrder}`;
  const [prevKey, setPrevKey] = useState(viewKey);
  if (viewKey !== prevKey) {
    setPrevKey(viewKey);
    setVisible(BATCH);
  }

  // 무한 스크롤 — 데이터가 번들에 있어 즉시 붙일 수 있으므로, 화면 도달 한참 전
  // (약 1.2화면 위)에서 다음 배치를 미리 로드해 스크롤 중 끊김이 없게 한다.
  const hasMore = visible < sorted.length;
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible((v) => Math.min(v + BATCH, sorted.length));
        }
      },
      { rootMargin: '1200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, sorted.length]);

  const shown = sorted.slice(0, visible);

  return (
    <main className="min-h-svh bg-white text-neutral-900">
      <section className="mx-auto w-full max-w-6xl px-5 pt-32 pb-20 md:px-10 md:pt-40">
        <Reveal>
          <p className="text-xs font-extrabold tracking-[0.3em] uppercase text-neutral-500">
            {t('projects.archive')}
          </p>
          <h1 className="mt-4 text-[clamp(2.8rem,9vw,5.5rem)] leading-none font-extrabold text-neutral-900">
            {t('projects.works')}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-500 md:text-base">
            {t('projects.intro')}
          </p>
        </Reveal>

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

        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium text-neutral-600">
          <span aria-hidden>👆</span>
          {t('projects.hint')}
        </p>

        <h2 className="sr-only">
          {lang === 'en' ? 'Project list' : '프로젝트 목록'}
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((project, i) => (
            <Reveal
              className="h-full"
              delay={(i % 3) * 80}
              key={`${viewKey}-${project.slug}`}
            >
              <ProjectCard
                onOpen={() => setSelected(project)}
                project={project}
              />
            </Reveal>
          ))}
        </div>

        {/* 무한 스크롤 트리거 */}
        {hasMore ? <div aria-hidden className="h-1" ref={sentinelRef} /> : null}
      </section>

      <Footer />

      {selected ? (
        <ProjectModal onClose={() => setSelected(null)} project={selected} />
      ) : null}
    </main>
  );
}
