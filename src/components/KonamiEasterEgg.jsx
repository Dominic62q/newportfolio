import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { stackGroups } from '../data/stack'
import { useUI } from '../context/useUI'

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
]

const CONFETTI_COLORS = ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#ec4899']
const STACK_LABELS = stackGroups.flatMap(({ items }) => items).filter(Boolean)

function fireConfetti(labels) {
  const canvas = document.createElement('canvas')
  canvas.style.cssText =
    'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return
  }
  const dpr = window.devicePixelRatio || 1
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  ctx.scale(dpr, dpr)

  const spawnSide = Math.random() < 0.5 ? -1 : 1
  const originX = spawnSide === -1 ? 0 : window.innerWidth
  const particles = Array.from({ length: 140 }, () => {
    const angle = (Math.random() * Math.PI / 3) + (spawnSide === -1 ? 0 : Math.PI / 2)
    const speed = 9 + Math.random() * 9
    return {
      x: originX,
      y: window.innerHeight + 10,
      vx: Math.cos(angle) * speed,
      vy: -Math.abs(Math.sin(angle)) * speed - 6,
      size: 5 + Math.random() * 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      label: Math.random() < 0.28 ? labels[Math.floor(Math.random() * labels.length)] : null,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.3,
    }
  })

  let frames = 0
  function tick() {
    frames += 1
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    let alive = false

    for (const p of particles) {
      p.vy += 0.28
      p.vx *= 0.99
      p.x += p.vx
      p.y += p.vy
      p.rotation += p.spin
      if (p.y < window.innerHeight + 40) alive = true

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = p.color
      if (p.label) {
        ctx.font = '600 11px Inter, sans-serif'
        ctx.fillText(p.label, -p.size, 0)
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      }
      ctx.restore()
    }

    if (alive && frames < 400) {
      requestAnimationFrame(tick)
    } else {
      canvas.remove()
    }
  }
  requestAnimationFrame(tick)
}

export default function KonamiEasterEgg() {
  const { boostAmbient } = useUI()
  const [toastVisible, setToastVisible] = useState(false)
  const [stackPreview, setStackPreview] = useState([])
  const progressRef = useRef([])
  const toastTimerRef = useRef(null)

  const activate = useCallback(() => {
    boostAmbient()
    setStackPreview(STACK_LABELS.slice(0, 4))
    setToastVisible(true)
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToastVisible(false), 4000)
    try {
      fireConfetti(STACK_LABELS)
    } catch {
      // The confirmation toast remains available if canvas effects are unavailable.
    }
  }, [boostAmbient])

  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }

      const key = e.code || (e.key.length === 1 ? `Key${e.key.toUpperCase()}` : e.key)
      const expected = SEQUENCE[progressRef.current.length]
      if (key !== expected) {
        progressRef.current = key === SEQUENCE[0] ? [key] : []
        return
      }

      progressRef.current.push(key)
      if (progressRef.current.length === SEQUENCE.length) {
        progressRef.current = []
        activate()
      }
    }

    const onManualTrigger = () => activate()
    window.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('portfolio:confetti', onManualTrigger)
    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('portfolio:confetti', onManualTrigger)
      window.clearTimeout(toastTimerRef.current)
    }
  }, [activate])

  return (
    <AnimatePresence>
      {toastVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          role="status"
          className="fixed bottom-8 left-1/2 z-[98] -translate-x-1/2 rounded-full border border-brand/40 bg-background/95 px-5 py-2.5 font-mono text-xs font-semibold text-brand shadow-lg backdrop-blur-md"
        >
          <span className="block">CHEAT CODE ACCEPTED &mdash; stack particles unlocked</span>
          <span className="mt-1 block text-[10px] font-normal text-muted-foreground">
            {stackPreview.join(' · ')}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
