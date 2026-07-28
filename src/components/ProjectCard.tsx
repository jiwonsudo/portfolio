import { categoryMeta, roleLabel } from '../data/projects';
import { useLang } from '../useLang';
import type { Project } from '../types';
import DeviceFrame from './DeviceFrame';

export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const { lang, t, team } = useLang();
  const accent = categoryMeta[project.categories[0]].color;
  const titleMain = lang === 'en' ? project.title : project.titleKo;
  const titleSub = lang === 'en' ? project.titleKo : project.title;
  const meta = [
    project.date,
    project.context,
    project.teamSize ? team(project.teamSize) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <button
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
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
        ) : project.display === 'desktop' ? (
          <div className="absolute inset-0 flex items-center justify-center p-5 transition-transform duration-500 group-hover:scale-[1.03]">
            <DeviceFrame
              alt={`${project.title} 미리보기`}
              className="w-[90%]"
              objectPosition="top"
              src={project.image}
              variant="desktop"
            />
          </div>
        ) : (
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
            <DeviceFrame
              alt={`${project.title} 미리보기`}
              objectPosition="top"
              src={project.image}
              variant="default"
            />
          </div>
        )}

        {/* 하단 페이드 — 모바일 컷오프 부드럽게 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-neutral-100 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {project.categories.map((cat) => {
            const c = categoryMeta[cat].color;
            return (
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-extrabold"
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
        </div>
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          {project.featured ? (
            <span className="rounded-full bg-neutral-900/85 px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur">
              <span className="text-[#facc15]">★</span> Featured
            </span>
          ) : null}
          {project.highlight ? (
            <span className="chrome-badge rounded-full px-2.5 py-1 text-[10px] font-extrabold text-neutral-800">
              {lang === 'en'
                ? (project.highlightEn ?? project.highlight)
                : project.highlight}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div>
          <h3 className="text-lg leading-tight font-extrabold text-neutral-900">
            {titleMain}
          </h3>
          <p className="mt-0.5 text-sm font-bold text-neutral-500">
            {titleSub} · {roleLabel(project.role, lang)}
          </p>
        </div>
        <p className="text-[11px] font-bold tracking-wide text-neutral-500">
          {meta}
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-neutral-600">
          {lang === 'en' ? project.descriptionEn : project.description}
        </p>
        <span
          className="mt-auto pt-2 text-[11px] font-extrabold uppercase"
          style={{ color: `color-mix(in srgb, ${accent} 48%, black)` }}
        >
          {t('common.viewDetail')}
        </span>
      </div>
    </button>
  );
}
