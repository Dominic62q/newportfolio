import { useEffect, useState } from 'react'
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { useUI } from '../context/useUI'
import { EASE_IN_OUT, INTRO_KEY } from '../lib/motion'

const COUNT_SECONDS = 1.5

// Ink curtain with a counter. When it lifts, a cobalt edge trails just behind it
// and the hero choreography starts underneath.
export default function Preloader() {
  const { introDone, setIntroDone } = useUI()
  const [mounted, setMounted] = useState(!introDone)
  const [leaving, setLeaving] = useState(false)
  const count = useMotionValue(0)
  const label = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'))

  useEffect(() => {
    if (!mounted) return undefined

    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const cap = new Promise((resolve) => window.setTimeout(resolve, 3000))
    let cancelled = false

    const controls = animate(count, 100, { duration: COUNT_SECONDS, ease: [0.65, 0, 0.35, 1] })
    controls.then(() =>
      Promise.race([fontsReady, cap]).then(() => {
        if (cancelled) return
        try {
          sessionStorage.setItem(INTRO_KEY, '1')
        } catch {
          /* private mode: the intro simply plays again next visit */
        }
        setLeaving(true)
        setIntroDone(true)
      }),
    )

    return () => {
      cancelled = true
      controls.stop()
      root.style.overflow = previousOverflow
    }
  }, [mounted, count, setIntroDone])

  return (
    <AnimatePresence onExitComplete={() => setMounted(false)}>
      {mounted && !leaving && (
        <>
          <motion.div
            key="edge"
            aria-hidden="true"
            className="fixed inset-0 z-[119] bg-signal"
            initial={{ y: 0 }}
            exit={{ y: '-100%', transition: { duration: 1.05, delay: 0.1, ease: EASE_IN_OUT } }}
          />
          <motion.div
            key="curtain"
            role="status"
            aria-label="Loading portfolio"
            className="fixed inset-0 z-[120] flex flex-col justify-between bg-ink p-6 text-paper md:p-10"
            initial={{ y: 0 }}
            exit={{ y: '-100%', transition: { duration: 1.05, ease: EASE_IN_OUT } }}
          >
            <div className="eyebrow flex items-start justify-between !text-paper/70">
              <span>Portfolio — {new Date().getFullYear()}</span>
              <span>Accra, Ghana</span>
            </div>

            <div className="flex items-end justify-between gap-6">
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(1.6rem,3.2vw,2.75rem)] italic leading-[1.05]"
              >
                Dominic Amuah
                <span className="eyebrow mt-3 block !not-italic !text-paper/70">Software Developer</span>
              </motion.p>

              <motion.span
                className="font-serif text-[clamp(6rem,22vw,20rem)] leading-[0.78] tabular-nums tracking-[-0.04em]"
                aria-hidden="true"
              >
                {label}
              </motion.span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
