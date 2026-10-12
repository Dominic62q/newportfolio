import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { UIProvider } from './context/UIContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Stack from './components/Stack'
import Experience from './components/Experience'
import Strengths from './components/Strengths'
import VelocityMarquee from './components/VelocityMarquee'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AmbientPill from './components/AmbientPill'
import Preloader from './components/Preloader'
import './index.css'

// The command palette is hidden until opened, so it ships as its own chunk.
const CommandPalette = lazy(() => import('./components/CommandPalette'))

function ScrollProgress() {
  const barRef = useRef(null)
  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      const total = document.documentElement.scrollHeight - window.innerHeight
      const pct = total > 0 ? window.scrollY / total : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct})`
    }
    // One update per animation frame, written straight to the DOM node, so
    // scrolling never triggers a React re-render.
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px]" aria-hidden="true">
      <div ref={barRef} className="h-full origin-left bg-signal" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}

// Wide screens whose footer fits in the viewport get the "curtain lift" reveal:
// the footer is pinned behind the page and the page reserves its height.
function Page() {
  const footerRef = useRef(null)
  const [revealHeight, setRevealHeight] = useState(0)

  useLayoutEffect(() => {
    const footer = footerRef.current
    if (!footer) return undefined
    const measure = () => {
      const fits = footer.offsetHeight < window.innerHeight * 0.92
      const wide = window.matchMedia('(min-width: 768px)').matches
      setRevealHeight(fits && wide ? footer.offsetHeight : 0)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(footer)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <>
      <div
        className="relative z-10 bg-paper shadow-[0_40px_80px_-40px_rgb(0_0_0/0.4)]"
        style={{ marginBottom: revealHeight }}
      >
        <main id="main-content">
          <Hero />
          <About />
          <Projects />
          <Stack />
          <Experience />
          <Strengths />
          <VelocityMarquee />
          <Contact />
        </main>
      </div>
      <Footer ref={footerRef} reveal={revealHeight > 0} />
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <UIProvider>
        <MotionConfig reducedMotion="user">
          <Preloader />
          <ScrollProgress />
          <a
            href="#main-content"
            className="fixed left-4 top-4 z-[110] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm text-paper transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <Navbar />
          <AmbientPill />
          <Page />
          <Suspense fallback={null}>
            <CommandPalette />
          </Suspense>
        </MotionConfig>
      </UIProvider>
    </ThemeProvider>
  )
}

export default App
