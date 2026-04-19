import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Stack', href: '#stack' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#eee] dark:hover:bg-[#222] transition-colors text-[#555] dark:text-[#aaa] hover:text-[#111] dark:hover:text-[#f0f0ee]"
    >
      {isDark ? (
        /* Sun icon */
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        /* Moon icon */
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#f9f9f7]/90 dark:bg-[#0f0f0d]/90 backdrop-blur-sm border-b border-[#e5e5e3] dark:border-[#2a2a2a]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => handleNav(e, '#')}
          className="text-sm font-semibold text-[#111] dark:text-[#f0f0ee] tracking-tight hover:opacity-70 transition-opacity"
        >
          Dominic Amuah
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                onClick={(e) => handleNav(e, href)}
                className="text-sm text-[#555] dark:text-[#aaa] hover:text-[#111] dark:hover:text-[#f0f0ee] transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/documents/Dominic-Amuah-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-1.5 border border-[#111] dark:border-[#f0f0ee] text-[#111] dark:text-[#f0f0ee] rounded-full hover:bg-[#111] dark:hover:bg-[#f0f0ee] hover:text-[#f9f9f7] dark:hover:text-[#111] transition-all"
            >
              Resume
            </a>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>

        {/* Mobile right side: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-[#111] dark:bg-[#f0f0ee] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-[#111] dark:bg-[#f0f0ee] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-[#111] dark:bg-[#f0f0ee] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#f9f9f7] dark:bg-[#0f0f0d] border-b border-[#e5e5e3] dark:border-[#2a2a2a] px-6 pb-5 pt-2">
          <ul className="flex flex-col gap-4">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={(e) => handleNav(e, href)}
                  className="text-sm text-[#555] dark:text-[#aaa] hover:text-[#111] dark:hover:text-[#f0f0ee] transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/documents/Dominic-Amuah-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#111] dark:text-[#f0f0ee] font-medium"
              >
                Resume ↗
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
