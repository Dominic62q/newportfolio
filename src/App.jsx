import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Stack from './components/Stack'
import Experience from './components/Experience'
import Strengths from './components/Strengths'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './index.css'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#f9f9f7] dark:bg-[#0f0f0d] text-[#111] dark:text-[#f0f0ee]">
        <Navbar />
        <main>
          <Hero />
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

