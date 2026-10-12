import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/useTheme'
import { useUI } from '../context/useUI'
import { useModalA11y } from '../lib/useModalA11y'
import Magnetic from './Magnetic'
import RollText from './RollText'

const navLinks = [
  { label: 'About', href: '#about', n: '01' },
  { label: 'Work', href: '#projects', n: '02' },
  { label: 'Stack', href: '#stack', n: '03' },
  { label: 'Experience', href: '#experience', n: '04' },
  { label: 'Contact', href: '#contact', n: '06' },
]

function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex size-11 items-center justify-center rounded-full text-mute transition-colors hover:text-ink"
    >
      {isDark ? <Sun className="size-[18px]" aria-hidden="true" /> : <Moon className="size-[18px]" aria-hidden="true" />}
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const { setPaletteOpen } = useUI()
  const menuRef = useRef(null)
  const closeRef = useRef(null)

  useModalA11y(menuOpen, menuRef, closeRef)

  useEffect(() => {
    // The bar tucks away while reading down and slides back the moment you scroll up.
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > 360 && y > lastY.current)
        lastY.current = y
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // Wait a tick so the menu's scroll lock is released before scrolling.
    window.setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30)
  }

  return (
    <>
      <header
        onFocusCapture={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-out-expo)] ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled ? 'border-b border-rule bg-paper/80 backdrop-blur-xl' : 'border-b border-transparent'}`}
      >
        <nav aria-label="Primary navigation" className="container-x flex h-16 items-center justify-between">
          <a
            href="#"
            onClick={(e) => go(e, '#')}
            className="group flex items-baseline gap-2.5"
            aria-label="Dominic Amuah, back to top"
          >
            <span className="whitespace-nowrap font-serif text-[1.65rem] italic leading-none tracking-tight">Dominic Amuah</span>
            <span className="eyebrow hidden whitespace-nowrap transition-colors group-hover:text-signal xl:inline">Software Developer</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            <ul className="flex items-center gap-7 pr-4">
              {navLinks.map(({ label, href, n }) => {
                const isActive = active === href.slice(1)
                return (
                  <li key={label}>
                    <a
                      href={href}
                      onClick={(e) => go(e, href)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`group/roll group relative inline-flex min-h-11 items-center gap-1.5 text-[13px] transition-colors ${
                        isActive ? 'text-ink' : 'text-mute hover:text-ink'
                      }`}
                    >
                      <span className={`eyebrow !text-[10px] transition-colors ${isActive ? '!text-signal' : ''}`}>{n}</span>
                      <RollText>{label}</RollText>
                      <span
                        aria-hidden="true"
                        className={`absolute -bottom-px left-0 h-px bg-signal transition-all duration-500 ${isActive ? 'w-full' : 'w-0'}`}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              className="mr-1 inline-flex h-8 items-center gap-1.5 rounded-full border border-rule px-3 font-mono text-[11px] text-mute transition-colors hover:border-ink hover:text-ink"
            >
              <span>Search</span>
              <kbd className="font-mono opacity-70">⌘K</kbd>
            </button>
            <ThemeToggle />
            <Magnetic strength={0.28} className="ml-1">
              <a
                href="/documents/Dominic-Amuah-Resume.pdf"
                download="Dominic-Amuah-Resume.pdf"
                className="group/roll inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-paper transition-colors hover:bg-signal hover:text-signal-ink"
              >
                <RollText>Résumé</RollText>
              </a>
            </Magnetic>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="inline-flex h-11 items-center px-3 font-mono text-[11px] uppercase tracking-[0.12em]"
            >
              Menu
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[70] flex flex-col bg-paper md:hidden"
          >
            <div className="container-x flex h-16 shrink-0 items-center justify-between">
              <span className="eyebrow">Menu</span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-11 items-center px-3 font-mono text-[11px] uppercase tracking-[0.12em]"
              >
                Close ✕
              </button>
            </div>

            <ul className="container-x flex flex-1 flex-col justify-center gap-1">
              {navLinks.map(({ label, href, n }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={href}
                    onClick={(e) => go(e, href)}
                    className="flex items-baseline gap-4 border-b border-rule py-4"
                  >
                    <span className="eyebrow w-6 text-signal">{n}</span>
                    <span className="display text-[clamp(2.5rem,12vw,4rem)]">{label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="container-x flex items-center justify-between pb-8 pt-4">
              <a
                href="/documents/Dominic-Amuah-Resume.pdf"
                download="Dominic-Amuah-Resume.pdf"
                className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper"
              >
                Résumé ↓
              </a>
              <a href="mailto:dominicquainoo62@gmail.com" className="eyebrow link-u">
                Say hello
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
