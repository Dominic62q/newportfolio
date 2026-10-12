import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { ThemeContext } from './theme-context'
import { prefersReducedMotion } from '../lib/motion'

// Light ("paper") is the default; a saved choice wins.
function readStoredTheme() {
  try {
    return localStorage.getItem('theme') === 'dark'
  } catch {
    return false
  }
}

// Where the circular reveal starts: the pointer, or the centre of the focused control.
function originFrom(event) {
  const target = event?.currentTarget
  if (event && (event.clientX || event.clientY)) return { x: event.clientX, y: event.clientY }
  if (target?.getBoundingClientRect) {
    const rect = target.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(readStoredTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    } catch {
      /* storage unavailable: theme still applies for this visit */
    }
  }, [isDark])

  // Swaps theme with a circle that grows from the toggle (View Transitions API),
  // falling back to an instant swap where unsupported or for reduced motion.
  const toggle = (event) => {
    const next = !isDark
    const apply = () => {
      document.documentElement.classList.toggle('dark', next)
      flushSync(() => setIsDark(next))
    }

    if (!document.startViewTransition || prefersReducedMotion()) {
      apply()
      return
    }

    const { x, y } = originFrom(event)
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const transition = document.startViewTransition(apply)
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 900, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {})
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
