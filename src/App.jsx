import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
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
import './index.css'

function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setPct(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none">
      <div className="h-full bg-brand" style={{ width: `${pct}%`, transition: 'width 0.05s linear' }} />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
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
            <Contact />
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </ThemeProvider>
  )
}

export default App

