import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const BEST_TIME_KEY = 'contact-speedrun-best'

function formatSeconds(ms) {
  return (ms / 1000).toFixed(1)
}

export default function SpeedrunTimer() {
  const [result, setResult] = useState(null)
  const startTimeRef = useRef(null)
  const doneRef = useRef(false)
  const hideTimerRef = useRef(null)

  useEffect(() => {
    const contact = document.getElementById('contact')
    if (!contact) return undefined

    const onFirstScroll = () => {
      if (startTimeRef.current === null) {
        startTimeRef.current = performance.now()
      }
    }
    window.addEventListener('scroll', onFirstScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        if (doneRef.current || startTimeRef.current === null) return
        doneRef.current = true

        const elapsed = performance.now() - startTimeRef.current
        let best = null
        let isRecord = false
        try {
          const stored = window.localStorage.getItem(BEST_TIME_KEY)
          const storedBest = stored === null ? null : Number(stored)
          if (storedBest !== null && Number.isFinite(storedBest)) {
            best = storedBest
            if (elapsed < storedBest) {
              window.localStorage.setItem(BEST_TIME_KEY, String(elapsed))
              isRecord = true
            }
          } else {
            window.localStorage.setItem(BEST_TIME_KEY, String(elapsed))
            best = elapsed
          }
        } catch {
          /* localStorage unavailable */
        }

        setResult({ elapsed, best, isRecord })
        hideTimerRef.current = window.setTimeout(() => setResult(null), 7000)
      },
      { threshold: 0.15 },
    )
    observer.observe(contact)

    return () => {
      window.removeEventListener('scroll', onFirstScroll)
      observer.disconnect()
      window.clearTimeout(hideTimerRef.current)
    }
  }, [])

  useEffect(() => () => window.clearTimeout(hideTimerRef.current), [])

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          role="status"
          className="fixed bottom-8 left-4 right-4 z-[97] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur-md sm:left-auto sm:right-8 sm:max-w-xs"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            Contact speedrun
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            You reached Contact in {formatSeconds(result.elapsed)}s
          </p>
          {result.best !== null && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatSeconds(result.best)}s — fastest on this device
              {result.isRecord ? ' · new record!' : ''}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
