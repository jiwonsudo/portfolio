import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-10 md:py-6">
        <NavLink
          className="text-lg font-extrabold tracking-tight text-white"
          to="/"
        >
          Jiwon
        </NavLink>
        <div className="flex items-center gap-5 text-sm font-bold md:gap-8">
          {links.map((link) => (
            <NavLink
              className={({ isActive }) =>
                `text-white transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                }`
              }
              end={link.to === '/'}
              key={link.to}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
