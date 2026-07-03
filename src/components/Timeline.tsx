import type { TimelineEntry } from '../data/profile';

export default function Timeline({
  entries,
  label,
}: {
  entries: TimelineEntry[];
  label: string;
}) {
  return (
    <div>
      <p className="mb-5 text-xs font-extrabold tracking-wide uppercase text-[#d8a85f]">
        {label}
      </p>
      <ul className="grid gap-5">
        {entries.map((entry) => (
          <li
            className="border-l border-white/15 pl-4"
            key={`${entry.period}-${entry.title}`}
          >
            <p className="text-[11px] font-bold tracking-wide text-[#8f8672]">
              {entry.period}
            </p>
            <p className="mt-1 text-sm font-extrabold text-[#f4f0e8]">
              {entry.title}
            </p>
            <p className="text-xs text-[#a89d8b]">{entry.titleEn}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
