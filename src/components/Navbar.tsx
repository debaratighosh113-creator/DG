import { Heart, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const links = [
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#clinical', label: 'Clinical' },
  { href: '#skills', label: 'Skills' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#projects', label: 'Projects' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        {/* Brand */}
        <a
          href="#top"
          className="group flex items-center gap-3"
          aria-label={`${name} - Home`}
        >
          {/* Logo mark */}
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
            aria-hidden="true"
          >
            <Heart
              className="h-5 w-5"
              fill="currentColor"
              strokeWidth={2}
            />
          </span>

          {/* Brand name */}
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight text-ink-900">
              DG
              <span className="text-teal-600">.</span>
            </span>

            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400">
              Nursing Portfolio
            </span>
          </span>
        </a>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-lg p-2 text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile navigation */}
      {open && (
        <div className="border-t border-ink-100 bg-white/95 backdrop-blur-md lg:hidden">
          <div className="flex flex-col px-6 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}