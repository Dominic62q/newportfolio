import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

const PHRASES = ['Backend systems', 'REST APIs', 'Full-stack products', 'Healthcare & operations', 'Django · Node.js · React']
const BASE_SPEED = 3.2 // percent of one copy per second

const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

function Copy() {
  return (
    <span className="flex shrink-0 items-center">
      {PHRASES.map((phrase, i) => (
        <span key={phrase} className="flex items-center">
          <span className={`display whitespace-nowrap text-[clamp(3.5rem,9.5vw,9rem)] ${i % 2 ? 'italic text-signal' : ''}`}>
            {phrase}
          </span>
          <span aria-hidden="true" className="mx-[3vw] font-serif text-[clamp(2rem,5vw,4.5rem)] text-signal">
            ✺
          </span>
        </span>
      ))}
    </span>
  )
}

// A giant serif band that drifts on its own, then surges and skews with your scroll speed.
export default function VelocityMarquee() {
  const reduced = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const boost = useTransform(smooth, [0, 1000], [0, 4], { clamp: false })
  const skew = useTransform(smooth, [-2000, 0, 2000], [7, 0, -7], { clamp: true })
  const direction = useRef(-1)
  const x = useTransform(base, (v) => `${wrap(-25, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduced) return
    const b = boost.get()
    if (b < -0.02) direction.current = 1
    else if (b > 0.02) direction.current = -1
    const step = direction.current * BASE_SPEED * (delta / 1000)
    base.set(base.get() + step + step * Math.abs(b))
  })

  return (
    <div
      className="overflow-hidden border-t border-rule py-8 md:py-12"
      role="group"
      aria-label="Backend systems, REST APIs, full-stack products, healthcare and operations"
    >
      <motion.div style={{ x, skewX: skew }} className="flex w-max will-change-transform" aria-hidden="true">
        <Copy />
        <Copy />
        <Copy />
        <Copy />
      </motion.div>
    </div>
  )
}
