import { highlights } from '../data/profile';
import { useLang } from '../i18n';

/** 핵심 성과 하이라이트 카드 그리드 (About·Home 공용) */
export default function Highlights({ className = '' }: { className?: string }) {
  const { lang } = useLang();

  return (
    <div className={`grid grid-cols-2 gap-3 md:grid-cols-4 ${className}`}>
      {highlights.map((h) => (
        <div
          className="rounded-2xl border border-neutral-200 bg-white/70 p-5 shadow-[0_10px_44px_rgba(80,70,160,0.08)] backdrop-blur"
          key={h.label}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <span aria-hidden className="shrink-0 text-lg">
              {h.icon}
            </span>
            <p className="min-w-0 bg-linear-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-2xl leading-tight font-extrabold wrap-break-word text-transparent md:text-3xl">
              {lang === 'en' ? h.valueEn : h.value}
            </p>
          </div>
          <p className="mt-2 text-sm font-extrabold break-keep wrap-break-word text-neutral-800">
            {lang === 'en' ? h.labelEn : h.label}
          </p>
          <p className="mt-0.5 text-xs break-keep wrap-break-word text-neutral-500">
            {lang === 'en' ? h.subEn : h.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
