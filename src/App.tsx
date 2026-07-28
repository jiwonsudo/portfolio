import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { trackPageview } from './analytics';
import Nav from './components/Nav';
import { useLang } from './useLang';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import ProjectsPage from './pages/ProjectsPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/** SPA는 최초 로드 때만 집계되므로, 라우트가 바뀔 때마다 페이지뷰를 보낸다. */
function TrackPageviews() {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageview(pathname);
  }, [pathname]);

  return null;
}

export default function App() {
  const { t } = useLang();

  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-full focus:bg-neutral-900 focus:px-5 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        href="#content"
      >
        {t('common.skip')}
      </a>
      <ScrollToTop />
      <TrackPageviews />
      <Nav />
      <div id="content" tabIndex={-1}>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<AboutPage />} path="/about" />
          <Route element={<ProjectsPage />} path="/projects" />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </div>
    </>
  );
}
