import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<ProjectsPage />} path="/projects" />
        <Route element={<HomePage />} path="*" />
      </Routes>
    </>
  );
}
