import { useState } from 'react';
import type { Cert } from '../data/certImages';
import type { TimelineEntry } from '../data/profile';
import { useLang } from '../useLang';
import ImageModal from './ImageModal';

export default function Timeline({
  entries,
  label,
  accent,
}: {
  entries: TimelineEntry[];
  label: string;
  /** 섹션 액센트 컬러 */
  accent: string;
}) {
  const { lang, t } = useLang();
  const [openCert, setOpenCert] = useState<Cert | null>(null);

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <p
          className="text-xs font-extrabold tracking-[0.2em] uppercase"
          style={{ color: `color-mix(in srgb, ${accent} 48%, black)` }}
        >
          {label}
        </p>
      </div>

      <ul className="grid gap-2">
        {entries.map((entry) => (
          <li
            className="group relative rounded-xl py-2 pl-5 transition-colors duration-200 hover:bg-black/[0.03]"
            key={`${entry.period}-${entry.title}`}
          >
            <span
              className="absolute top-2.5 bottom-2.5 left-0 w-1 rounded-full opacity-45 transition-opacity duration-200 group-hover:opacity-100"
              style={{ backgroundColor: accent }}
            />
            <span
              className="inline-block rounded-full mb-2 px-2 py-1 text-[10px] font-bold"
              style={{
                backgroundColor: `color-mix(in srgb, ${accent} 14%, white)`,
                color: `color-mix(in srgb, ${accent} 48%, black)`,
              }}
            >
              {entry.period}
            </span>
            <div className="mx-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-sm leading-snug font-extrabold text-neutral-900">
                {lang === 'en' ? entry.titleEn : entry.title}
              </p>
              {entry.cert ? (
                <button
                  className="shrink-0 rounded-full border border-neutral-300 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenCert(entry.cert!);
                  }}
                  type="button"
                >
                  {t('about.certConfirm')} ↗
                </button>
              ) : null}
            </div>
            <p className="pl-1.5 pt-1.5 text-xs text-neutral-500">
              {lang === 'en' ? entry.title : entry.titleEn}
            </p>
          </li>
        ))}
      </ul>

      {openCert ? (
        <ImageModal
          alt={openCert.name}
          onClose={() => setOpenCert(null)}
          src={openCert.src}
        />
      ) : null}
    </div>
  );
}
