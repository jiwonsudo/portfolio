import { profile } from '../data/profile';

export default function Footer() {
  return (
    <footer className="border-t border-white/12 bg-[#181512] px-5 py-16 text-[#f4f0e8] md:px-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm leading-relaxed text-[#c7bca8]">
            {profile.intro}
          </p>
          <p className="mt-2 text-sm text-[#8f8672]">{profile.quote}</p>
          <a
            className="mt-4 inline-block text-2xl font-extrabold text-[#f4f0e8]"
            href={`mailto:${profile.email}`}
          >
            {profile.email}
          </a>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            className="border border-white/16 px-4 py-2 text-sm font-bold text-[#f4f0e8] transition-colors hover:bg-white/10"
            href={profile.github}
            rel="noreferrer"
            target="_blank"
          >
            Github
          </a>
          <a
            className="border border-white/16 px-4 py-2 text-sm font-bold text-[#f4f0e8] transition-colors hover:bg-white/10"
            href={`mailto:${profile.email}`}
          >
            Email
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 w-full max-w-5xl text-xs text-[#6e665a]">
        © {new Date().getFullYear()} {profile.name} · {profile.nameKo}
      </p>
    </footer>
  );
}
