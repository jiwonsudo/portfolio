import type { ExhibitData } from '../types';

type StackContactProps = {
  exhibits: ExhibitData[];
};

const baseStacks = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'R3F',
  'Three.js',
  'UX Prototyping',
  'Performance',
  'Product Thinking',
];

export default function StackContact({ exhibits }: StackContactProps) {
  const stacks = Array.from(
    new Set([...baseStacks, ...exhibits.flatMap((exhibit) => exhibit.stack)]),
  );

  return (
    <section className="min-h-svh bg-[#181512] px-5 py-20 text-[#f4f0e8] md:px-10 md:py-28">
      <div className="mx-auto grid w-full max-w-5xl gap-16">
        <div className="grid gap-5">
          <p className="text-xs font-extrabold uppercase text-[#d8a85f]">
            Tool Room
          </p>
          <h2 className="max-w-3xl text-[clamp(2.6rem,10vw,6.8rem)] leading-none font-extrabold">
            Interfaces that make product intent visible.
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {stacks.map((stack) => (
            <span
              className="border border-white/12 bg-white/6 px-3 py-2 text-xs font-bold text-[#e8decb]"
              key={stack}
            >
              {stack}
            </span>
          ))}
        </div>

        <footer className="grid gap-5 border-t border-white/12 pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm leading-relaxed text-[#c7bca8]">
              기획의 의도와 사용자의 감각이 같은 화면 안에서 만나는 경험을
              만듭니다.
            </p>
            <a
              className="mt-4 inline-block text-2xl font-extrabold text-[#f4f0e8]"
              href="mailto:hello@example.com"
            >
              hello@example.com
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              className="border border-white/16 px-4 py-2 text-sm font-bold text-[#f4f0e8]"
              href="https://github.com"
              rel="noreferrer"
              target="_blank"
            >
              Github
            </a>
            <a
              className="border border-white/16 px-4 py-2 text-sm font-bold text-[#f4f0e8]"
              href="https://linkedin.com"
              rel="noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
