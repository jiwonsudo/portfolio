import { profile } from '../data/profile';

export default function Footer() {
  return (
    <footer className="relative border-t border-neutral-200 bg-white px-5 py-16 text-neutral-900 md:px-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm leading-relaxed text-neutral-500">
            {profile.intro}
          </p>
          <p className="mt-2 text-sm text-neutral-400">{profile.quote}</p>
          <a
            className="mt-4 inline-block text-2xl font-extrabold text-[#000000] transition-opacity hover:opacity-70"
            href={`mailto:${profile.email}`}
          >
            {profile.email}
          </a>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-bold text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-[#434343] hover:text-white hover:shadow-lg hover:shadow-[#bdbdbd82]"
            href={profile.github}
            rel="noreferrer"
            target="_blank"
          >
            Github
          </a>
          <a
            className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-bold text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-[#434343] hover:text-white hover:shadow-lg hover:shadow-[#bdbdbd82]"
            href={`mailto:${profile.email}`}
          >
            Email
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 w-full max-w-5xl text-xs text-neutral-400">
        © {new Date().getFullYear()}. {profile.name} all rights reserved.
      </p>
    </footer>
  );
}
