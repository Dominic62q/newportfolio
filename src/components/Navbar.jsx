import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <Button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      variant="ghost"
      size="icon-sm"
      className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace('#', ''))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleNav = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActive('')
      return
    }
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border bg-background/90 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => handleNav(e, '#')}
          className="text-sm font-semibold text-foreground tracking-tight hover:text-brand transition-colors"
        >
          Dominic Amuah
        </a>

        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, href }) => {
            const id = href.replace('#', '')
            const isActive = active === id
            return (
              <li key={label}>
                <a
                  href={href}
                  onClick={(e) => handleNav(e, href)}
                  className={`text-sm transition-colors relative ${
                    isActive
                      ? 'text-brand'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-brand rounded-full" />
                  )}
                </a>
              </li>
            )
          })}
          <li>
            <Button asChild variant="outline" size="sm" className="rounded-full border-border bg-transparent px-4 text-foreground hover:border-brand hover:text-brand">
              <a href="/documents/Dominic-Amuah-Resume.pdf" download="Dominic-Amuah-Resume.pdf">
                Resume
              </a>
            </Button>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="flex flex-col gap-1.5 rounded-full p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-b border-border bg-background px-6 pb-5 pt-2">
          <ul className="flex flex-col gap-4">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={(e) => handleNav(e, href)}
                  className="text-sm text-muted-foreground hover:text-brand transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/documents/Dominic-Amuah-Resume.pdf"
                download="Dominic-Amuah-Resume.pdf"
                className="text-sm text-foreground font-medium hover:text-brand transition-colors"
              >
                Resume ↓
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
