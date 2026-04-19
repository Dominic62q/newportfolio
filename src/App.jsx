import { useEffect, useState } from 'react'
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
      <div className="h-full bg-[#f97316]" style={{ width: `${pct}%`, transition: 'width 0.05s linear' }} />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ScrollProgress />
      <div className="min-h-screen bg-[#f9f9f7] dark:bg-[#0a0a0a] text-[#111] dark:text-[#f0f0ee]">
        <Navbar />
        <main>
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
    </ThemeProvider>
  )
}

export default App

