import { lazy, Suspense, useEffect, useRef } from 'react'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { UIProvider } from './context/UIContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Projects from './components/Projects'
import Stack from './components/Stack'
import Experience from './components/Experience'
import Strengths from './components/Strengths'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AmbientPill from './components/AmbientPill'
import Intro from './components/Intro'
import './index.css'

// Interactive extras that are usually hidden (returned null until opened).
// They are code-split so their JS is not part of the initial page load.
const Terminal = lazy(() => import('./components/Terminal'))
const CommandPalette = lazy(() => import('./components/CommandPalette'))
const KonamiEasterEgg = lazy(() => import('./components/KonamiEasterEgg'))
const SpeedrunTimer = lazy(() => import('./components/SpeedrunTimer'))
const ContributionSnakeSection = lazy(() =>
  import('./components/ContributionSnake').then((m) => ({ default: m.ContributionSnakeSection })),
)
const ContributionSnake = lazy(() =>
  import('./components/ContributionSnake').then((m) => ({ default: m.default })),
)

function ScrollProgress() {
  const barRef = useRef(null)
  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      const total = document.documentElement.scrollHeight - window.innerHeight
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0
      if (barRef.current) barRef.current.style.width = `${pct}%`
    }
    // Throttle to one update per animation frame and write the style straight
    // to the DOM node, so scrolling never triggers a React re-render.
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
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none">
      <div ref={barRef} className="h-full w-0 bg-brand" />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <UIProvider>
        <MotionConfig reducedMotion="user">
          <ScrollProgress />
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <AmbientPill />
            <main id="main-content">
              <Hero />
              <Marquee />
              <About />
              <Projects />
              <Stack />
              <Experience />
              <Strengths />
              <Suspense fallback={null}>
                <ContributionSnakeSection />
              </Suspense>
              <Contact />
            </main>
            <Footer />
          </div>
          {/* Overlay widgets are lazy-loaded chunks; Suspense renders nothing
              until they are actually opened, so there is no visual impact. */}
          <Suspense fallback={null}>
            <Terminal />
            <CommandPalette />
            <ContributionSnake />
            <KonamiEasterEgg />
            <SpeedrunTimer />
          </Suspense>
          <Intro />
        </MotionConfig>
      </UIProvider>
    </ThemeProvider>
  )
}

export default App
