import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const BOOT_LINES = [
  '> locating designer',
  '> retrieving selected work',
  '> rendering visual language',
  '> calibrating motion engine',
  '> establishing link to Accra',
]
const BOOT_DURATION = 5000
const WELCOME_DURATION = 3000


// Play only on a genuine entry (new tab / link tap), never on refresh or
// reduced-motion. A session flag also prevents replay within the same tab.
function shouldPlay() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false
  try {
    const nav = performance.getEntriesByType('navigation')[0]
    if (nav && nav.type === 'reload') return false
  } catch {
    /* ignore */
  }
  try {
    if (sessionStorage.getItem('intro-played')) return false
  } catch {
    /* ignore */
  }
  return true
}

const BLINK = 'ml-1 inline-block h-3 w-2 translate-y-0.5 bg-brand animate-pulse'

export default function Intro() {
  const [active, setActive] = useState(() => shouldPlay())
  const [line, setLine] = useState(0)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('boot') // 'boot' | 'welcome'
  const [leaving, setLeaving] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    if (!active) return undefined
    try {
      sessionStorage.setItem('intro-played', '1')
    } catch {
      /* ignore */
    }

    const body = document.body
    const main = document.getElementById('main-content')
    const prevOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    main?.setAttribute('inert', '')

    BOOT_LINES.forEach((_, i) =>
      timers.current.push(setTimeout(() => setLine(i + 1), 350 + i * 800)),
    )
    const startedAt = performance.now()
    const prog = setInterval(() => {
      const elapsed = performance.now() - startedAt
      setProgress(Math.min(100, Math.round((elapsed / BOOT_DURATION) * 100)))
    }, 40)

    const toWelcome = setTimeout(() => {
      clearInterval(prog)
      setProgress(100)
      setPhase('welcome')
    }, BOOT_DURATION)
    const toLeave = setTimeout(() => setLeaving(true), BOOT_DURATION + WELCOME_DURATION)


    return () => {
      timers.current.forEach(clearTimeout)
      clearInterval(prog)
      clearTimeout(toWelcome)
      clearTimeout(toLeave)
      body.style.overflow = prevOverflow
      main?.removeAttribute('inert')
    }
  }, [active])

  function finish() {
    document.body.style.overflow = ''
    document.getElementById('main-content')?.removeAttribute('inert')
    setActive(false)
  }

  if (!active) return null

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0d1117] font-mono text-[#c9d1d9]"
      initial={{ y: 0 }}
      animate={leaving ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        if (leaving) finish()
      }}
      role="dialog"
      aria-label="Loading portfolio"
      aria-busy={!leaving}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 3px)' }}
      />

      <button
        type="button"
        onClick={finish}
        className="absolute right-5 top-5 z-10 rounded border border-white/15 px-3 py-1 text-[11px] text-white/50 transition-colors hover:text-white"
      >
        Skip
      </button>

      <div className="relative w-[min(90vw,560px)]">
        {phase === 'boot' && (
          <div className="space-y-1.5 text-[13px] leading-relaxed">
            <p className="mb-3 text-brand">DominicOS v2.0 — initializing</p>
            {BOOT_LINES.slice(0, line).map((l, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
              >
                <span className="text-brand/80">{l}</span>
                {i === line - 1 && <span className={BLINK} />}
              </motion.p>
            ))}
            <div className="mt-4">
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-brand transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-right text-[10px] text-white/40">{progress}%</p>
            </div>
          </div>
        )}

        {phase === 'welcome' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-brand">System ready</p>
            <h1 className="font-display text-3xl font-black text-white sm:text-4xl">
              Welcome to my portfolio
            </h1>
            <p className="mt-3 text-sm text-white/50">
              Dominic Amuah — Backend &amp; full-stack developer
            </p>
            <p className="mt-4 text-[11px] text-white/40">
              Entering workspace<span className={BLINK} />
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
