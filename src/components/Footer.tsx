import { profile } from '../data/profile';
import { useLang } from '../i18n';

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="relative border-t border-neutral-200 bg-white px-5 py-16 text-neutral-900 md:px-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm leading-relaxed text-neutral-500">
            {lang === 'en' ? profile.introEn : profile.intro}
          </p>
          <p className="mt-2 text-sm text-neutral-500">{profile.quote}</p>
          <a
            className="mt-4 inline-block text-2xl font-extrabold text-[#000000] transition-opacity hover:opacity-70"
            href={`mailto:${profile.email}`}
          >
            {profile.email}
          </a>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { label: 'GitHub', href: profile.github, external: true },
            { label: 'LinkedIn', href: profile.linkedin, external: true },
            { label: 'Blog', href: profile.blog, external: true },
            { label: 'Email', href: `mailto:${profile.email}`, external: false },
          ].map((link) => (
            <a
              className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-bold text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-[#434343] hover:text-white hover:shadow-lg hover:shadow-[#bdbdbd82]"
              href={link.href}
              key={link.label}
              rel={link.external ? 'noreferrer' : undefined}
              target={link.external ? '_blank' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-10 w-full max-w-5xl text-xs text-neutral-500">
        © {new Date().getFullYear()}. {profile.name} all rights reserved.
      </p>
    </footer>
  );
}
