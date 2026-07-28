import { NavLink } from 'react-router-dom';
import type { Lang } from '../i18n';
import { useLang } from '../useLang';

const links = [
  { labelKo: '홈', labelEn: 'Home', to: '/' },
  { labelKo: '프로필', labelEn: 'About', to: '/about' },
  { labelKo: '프로젝트', labelEn: 'Projects', to: '/projects' },
];

export default function Nav() {
  const { lang, setLang } = useLang();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4">
      {/* 글래스모피즘 바 — 반투명 + backdrop blur로 어떤 배경 위에서도 가독성 확보 */}
      <nav
        aria-label="주요 내비게이션"
        className="mx-auto mt-3 flex max-w-6xl items-center justify-between gap-3 rounded-full border border-white/50 bg-white/60 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-md md:px-8"
      >
        <NavLink
          className="shrink-0 rounded-full text-base font-extrabold tracking-tight text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:outline-none md:text-lg"
          to="/"
        >
          Jiwon
        </NavLink>
        <div className="flex items-center gap-3.5 text-[13px] font-bold sm:gap-5 sm:text-sm md:gap-8">
          {links.map((link) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:outline-none ${
                  isActive
                    ? 'text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`
              }
              end={link.to === '/'}
              key={link.to}
              to={link.to}
            >
              {lang === 'en' ? link.labelEn : link.labelKo}
            </NavLink>
          ))}

          {/* 언어 토글 */}
          <div
            aria-label="Language"
            className="flex shrink-0 items-center gap-0.5 rounded-full border border-neutral-300 p-0.5 text-xs"
            role="group"
          >
            {(['ko', 'en'] as Lang[]).map((l) => (
              <button
                aria-pressed={lang === l}
                className={`rounded-full px-2 py-1 font-bold transition-colors focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none sm:px-2.5 ${
                  lang === l
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                key={l}
                onClick={() => setLang(l)}
                type="button"
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
