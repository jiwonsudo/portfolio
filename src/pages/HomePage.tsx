import { Link } from 'react-router-dom';
import AboutOverlay from '../components/AboutOverlay';
import Exhibit from '../components/Exhibit';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { featuredProjects, projectList } from '../data/projects';

export default function HomePage() {
  return (
    <main className="bg-[#f4f0e8]">
      <Hero />
      <AboutOverlay />

      <section className="grid place-items-center gap-5 bg-[#f4f0e8] px-5 pt-24 pb-6 text-center md:pt-32">
        <p className="text-xs font-extrabold tracking-wide uppercase text-[#9e7435]">
          Selected Works
        </p>
        <h2 className="max-w-2xl text-[clamp(1.8rem,5vw,3rem)] leading-tight font-extrabold text-[#181512]">
          대표작 {featuredProjects.length}개를 담았습니다.
        </h2>
        <p className="max-w-xl text-sm text-[#6e665a]">
          스크롤하며 갤러리를 둘러보세요. 전체 {projectList.length}개 프로젝트는
          아카이브에 있습니다.
        </p>
      </section>

      <Exhibit exhibits={featuredProjects} />

      <section className="grid place-items-center gap-6 bg-[#f4f0e8] px-5 pt-6 pb-24 text-center md:pb-32">
        <Link
          className="inline-flex items-center gap-2 rounded-full bg-[#181512] px-7 py-3 text-sm font-bold text-[#f4f0e8] transition-transform hover:scale-105"
          to="/projects"
        >
          모든 프로젝트 보기 →
        </Link>
      </section>

      <Footer />
    </main>
  );
}
