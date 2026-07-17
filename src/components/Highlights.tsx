import { highlights } from '../data/profile';
import { useLang } from '../i18n';
import Reveal from './Reveal';

/** 핵심 성과 하이라이트 카드 그리드 (About·Home 공용) */
export default function Highlights({
  className = '',
  cols = 4,
  size = 'md',
}: {
  className?: string;
  /** 데스크톱 열 수 (2 → 2x2, 4 → 한 줄) */
  cols?: 2 | 4;
  size?: 'md' | 'lg';
}) {
  const { lang } = useLang();
  const lg = size === 'lg';
  const grid = cols === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4';

  return (
    <div className={`grid ${grid} gap-3 md:gap-4 ${className}`}>
      {highlights.map((h, i) => (
        <Reveal
          className={`rounded-2xl border border-neutral-200 bg-white/70 shadow-[0_10px_44px_rgba(80,70,160,0.1)] backdrop-blur ${lg ? 'p-6 md:p-7' : 'p-5'}`}
          delay={i * 90}
          key={h.label}
        >
          <div className="flex items-center gap-2">
            <span aria-hidden className={lg ? 'text-2xl' : 'text-lg'}>
              {h.icon}
            </span>
            <p
              className={`min-w-0 bg-linear-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text font-extrabold wrap-break-word text-transparent ${lg ? 'text-3xl leading-none md:text-4xl' : 'text-2xl leading-tight md:text-3xl'}`}
            >
              {lang === 'en' ? h.valueEn : h.value}
            </p>
          </div>
          <p
            className={`mt-2 font-extrabold break-keep wrap-break-word text-neutral-900 ${lg ? 'text-base md:text-lg' : 'text-sm'}`}
          >
            {lang === 'en' ? h.labelEn : h.label}
          </p>
          <p
            className={`mt-0.5 break-keep wrap-break-word text-neutral-600 ${lg ? 'text-sm' : 'text-xs'}`}
          >
            {lang === 'en' ? h.subEn : h.sub}
          </p>
        </Reveal>
      ))}
    </div>
  );
}
