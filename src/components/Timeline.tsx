import type { TimelineEntry } from '../data/profile';
import { useLang } from '../i18n';

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
  const { lang } = useLang();

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <p
          className="text-xs font-extrabold tracking-[0.2em] uppercase"
          style={{ color: accent }}
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
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: `color-mix(in srgb, ${accent} 14%, white)`,
                color: `color-mix(in srgb, ${accent} 75%, black)`,
              }}
            >
              {entry.period}
            </span>
            <p className="mt-1.5 text-sm leading-snug font-extrabold text-neutral-900">
              {lang === 'en' ? entry.titleEn : entry.title}
            </p>
            <p className="text-xs text-neutral-500">
              {lang === 'en' ? entry.title : entry.titleEn}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
