import { Link } from 'react-router-dom';
import { useLang } from '../useLang';

export default function NotFound() {
  const { t } = useLang();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-white px-6 text-center">
      <p className="bg-linear-to-r from-[#ff5f6d] via-[#8f5bff] to-[#00c2a8] bg-clip-text text-[clamp(4rem,18vw,9rem)] leading-none font-extrabold text-transparent">
        404
      </p>
      <p className="mt-4 text-base font-bold text-neutral-600 md:text-lg">
        {t('notfound.msg')}
      </p>
      <Link
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-7 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
        to="/"
      >
        {t('notfound.home')} →
      </Link>
    </main>
  );
}
