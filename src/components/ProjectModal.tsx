import { useEffect, useRef, useState } from 'react';
import { categoryMeta, roleLabel } from '../data/projects';
import { useLang } from '../useLang';
import type { Project } from '../types';

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const images =
    project.gallery && project.gallery.length > 0
      ? project.gallery
      : project.image
        ? [project.image]
        : [];

  const { lang, t, team } = useLang();
  const [index, setIndex] = useState(0);
  const accent = categoryMeta[project.categories[0]].color;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = (delta: number) =>
    setIndex((prev) => (prev + delta + images.length) % images.length);

  // ESC 닫기 + 배경 스크롤 잠금 + 포커스 트랩 + 열릴 때/닫힐 때 포커스 관리
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'Tab' && panelRef.current) {
        // 포커스가 모달 밖으로 나가지 않게 가둔다
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  const meta = [
    project.date,
    project.context,
    project.teamSize ? team(project.teamSize) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div
      aria-labelledby="project-modal-title"
      aria-modal
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="modal-pop relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        ref={panelRef}
      >
        <button
          aria-label="닫기"
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/70 text-lg text-white backdrop-blur transition-colors hover:bg-neutral-900 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          onClick={onClose}
          ref={closeRef}
          type="button"
        >
          ✕
        </button>

        <div className="overflow-y-auto">
          {/* 캐러셀 */}
          {images.length > 0 ? (
            <div className="relative flex h-[46vh] items-center justify-center bg-neutral-100">
              <img
                alt={`${project.title} 스크린샷 ${index + 1}`}
                className="max-h-full max-w-full object-contain p-4"
                src={images[index]}
              />

              {images.length > 1 ? (
                <>
                  <button
                    aria-label="이전"
                    className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-bold shadow-md transition-transform hover:scale-110"
                    onClick={() => go(-1)}
                    type="button"
                  >
                    ‹
                  </button>
                  <button
                    aria-label="다음"
                    className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-bold shadow-md transition-transform hover:scale-110"
                    onClick={() => go(1)}
                    type="button"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {images.map((img, i) => (
                      <button
                        aria-label={`${i + 1}번째 사진`}
                        className="h-2 rounded-full transition-all"
                        key={img}
                        onClick={() => setIndex(i)}
                        style={{
                          width: i === index ? 20 : 8,
                          backgroundColor: i === index ? accent : '#d4d4d4',
                        }}
                        type="button"
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {/* 본문 */}
          <div className="flex flex-col gap-4 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              {project.categories.map((cat) => {
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
              <span className="text-[11px] font-bold tracking-wide text-neutral-500">
                {meta}
              </span>
            </div>

            <div>
              <h2
                className="text-2xl leading-tight font-extrabold text-neutral-900"
                id="project-modal-title"
              >
                {lang === 'en' ? project.title : project.titleKo}
              </h2>
              <p className="mt-1 text-sm font-bold text-neutral-500">
                {lang === 'en' ? project.titleKo : project.title} ·{' '}
                {roleLabel(project.role, lang)}
              </p>
            </div>

            {project.contribution ? (
              <div
                className="rounded-xl border-l-4 bg-neutral-50 py-3 pr-4 pl-4"
                style={{ borderColor: accent }}
              >
                <p
                  className="text-[10px] font-extrabold tracking-[0.15em] uppercase"
                  style={{ color: `color-mix(in srgb, ${accent} 48%, black)` }}
                >
                  {t('modal.contribution')}
                </p>
                <p className="mt-1 text-sm leading-relaxed font-semibold text-neutral-800 break-keep">
                  {lang === 'en'
                    ? (project.contributionEn ?? project.contribution)
                    : project.contribution}
                </p>
              </div>
            ) : null}

            <p className="text-sm leading-relaxed text-neutral-600 break-keep">
              {lang === 'en'
                ? (project.detailEn ?? project.descriptionEn)
                : (project.detail ?? project.description)}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <span
                  className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-600"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>

            {project.githubUrl || project.demoUrl ? (
              <div className="flex flex-wrap gap-4 pt-1 text-[11px] font-extrabold uppercase">
                {project.demoUrl ? (
                  <a
                    className="underline underline-offset-4 transition-opacity hover:opacity-60"
                    href={project.demoUrl}
                    rel="noreferrer"
                    style={{
                      color: `color-mix(in srgb, ${accent} 48%, black)`,
                    }}
                    target="_blank"
                  >
                    {project.demoLabel ?? 'Demo'} ↗
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a
                    className="text-neutral-500 underline underline-offset-4 transition-colors hover:text-neutral-900"
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
        </div>
      </div>

      <style>{`
        .modal-pop {
          animation: modal-pop 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes modal-pop {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .modal-pop { animation: none; }
        }
      `}</style>
    </div>
  );
}
