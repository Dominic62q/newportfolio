import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAccraClock } from '../lib/accra'
import { useUI } from '../context/useUI'
import { EASE_OUT, hasFinePointer, prefersReducedMotion } from '../lib/motion'
import RollText from './RollText'

const links = [
  { label: 'Selected work', href: '#projects', glyph: '↓', internal: true },
  { label: 'Get in touch', href: '#contact', glyph: '→', internal: true },
  { label: 'Résumé (PDF)', href: '/documents/Dominic-Amuah-Resume.pdf', glyph: '↓', download: true },
  { label: 'GitHub', href: 'https://github.com/Dominic62q', glyph: '↗' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dominic-amuah', glyph: '↗' },
]

const WORDS = [
  { text: 'Dominic', italic: false, start: 0 },
  { text: 'Amuah', italic: true, start: 7 },
]

const letterRise = {
  out: { y: '118%', rotate: 6 },
  in: (i) => ({
    y: 0,
    rotate: 0,
    transition: { duration: 1.25, delay: 0.3 + i * 0.055, ease: EASE_OUT },
  }),
}

function RotatingBadge() {
  return (
    <div className="relative size-28 shrink-0 md:size-36" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full text-ink [animation:badge-spin_28s_linear_infinite]">
        <defs>
          <path id="badge-circle" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
        </defs>
        <text className="fill-current font-mono text-[8.4px] uppercase tracking-[0.2em]">
          <textPath href="#badge-circle">Open to work · Backend · Full-stack · APIs ·</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-12 place-items-center rounded-full bg-signal text-xl text-signal-ink md:size-14">↘</span>
      </span>
    </div>
  )
}

// Letters near the pointer swell, lift and lean; they settle back with a soft ease.
function usePointerWave(sectionRef, lettersRef) {
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return undefined
    const section = sectionRef.current
    if (!section) return undefined

    const RADIUS = 280
    const pointer = { x: -9999, y: -9999, active: false }
    const letters = lettersRef.current
    let frame = 0
    let running = false

    const tick = () => {
      let moving = false
      letters.forEach((el) => {
        if (!el) return
        const box = el.parentElement.getBoundingClientRect()
        const dx = pointer.x - (box.left + box.width / 2)
        const dy = pointer.y - (box.top + box.height / 2)
        const influence = pointer.active ? Math.max(0, 1 - Math.hypot(dx, dy) / RADIUS) : 0
        const eased = influence * influence
        const target = { y: -eased * 38, r: (-dx / RADIUS) * influence * 7, s: 1 + eased * 0.07 }
        const cur = el._wave ?? (el._wave = { y: 0, r: 0, s: 1 })
        cur.y += (target.y - cur.y) * 0.14
        cur.r += (target.r - cur.r) * 0.14
        cur.s += (target.s - cur.s) * 0.14
        if (Math.abs(cur.y - target.y) > 0.05 || Math.abs(cur.r - target.r) > 0.02) moving = true
        el.style.transform = `translate3d(0, ${cur.y.toFixed(2)}px, 0) rotate(${cur.r.toFixed(2)}deg) scale(${cur.s.toFixed(3)})`
      })
      if (moving || pointer.active) frame = requestAnimationFrame(tick)
      else running = false
    }
    const start = () => {
      if (!running) {
        running = true
        frame = requestAnimationFrame(tick)
      }
    }

    const onMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
      start()
    }
    const onLeave = () => {
      pointer.active = false
      start()
    }

    section.addEventListener('pointermove', onMove, { passive: true })
    section.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
    }
  }, [sectionRef, lettersRef])
}

export default function Hero() {
  const { label: time, hour } = useAccraClock()
  const { introDone } = useUI()
  const ref = useRef(null)
  const lettersRef = useRef([])
  usePointerWave(ref, lettersRef)

  const { scrollYProgress, scrollY } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const nameOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15])
  // The two name lines drift apart as you leave the hero.
  const lineOneX = useTransform(scrollYProgress, [0, 1], ['0%', '-9%'])
  const lineTwoX = useTransform(scrollYProgress, [0, 1], ['0%', '9%'])
  const badgeRotate = useTransform(scrollY, [0, 1600], [0, 300])

  const awake = hour >= 8 && hour < 23
  const state = introDone ? 'in' : 'out'

  const goTo = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-x-clip pb-20 pt-24">
      <div className="container-x flex flex-1 flex-col">
        {/* meta strip: the rule draws in, then the captions fade up */}
        <div className="relative pb-4">
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-rule"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: introDone ? 1 : 0 }}
            transition={{ duration: 1.4, delay: 0.1, ease: EASE_OUT }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 10 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE_OUT }}
            className="eyebrow flex flex-wrap items-center justify-between gap-x-8 gap-y-2"
          >
            <span className="inline-flex items-center gap-2.5">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-signal" />
              </span>
              Available for backend &amp; full-stack roles
            </span>
            <span>
              Accra, GH — <span className="text-ink">{time}</span> GMT
              <span className="hidden sm:inline"> · {awake ? 'probably awake' : 'probably asleep'}</span>
            </span>
            <span className="hidden lg:inline">Software Developer, Rigelis Inc.</span>
          </motion.div>
        </div>

        {/* the name */}
        <motion.h1
          style={{ y: nameY, opacity: nameOpacity }}
          className="display relative mt-10 flex-1 text-[min(25vw,24svh)] leading-[0.84] md:mt-6 md:text-[clamp(4.25rem,min(16vw,27svh),17rem)]"
        >
          <span className="sr-only">Dominic Amuah</span>
          <span aria-hidden="true" className="block">
            {WORDS.map((word, lineIndex) => (
              <motion.span
                key={word.text}
                style={{ x: lineIndex === 0 ? lineOneX : lineTwoX }}
                className={`block ${lineIndex === 1 ? 'md:pl-[12vw]' : ''}`}
              >
                <span className="-my-[0.07em] block overflow-hidden py-[0.07em]">
                  <span className={`inline-block ${word.italic ? 'italic text-signal' : ''}`}>
                    {[...word.text].map((char, i) => (
                      <motion.span
                        key={i}
                        custom={word.start + i}
                        variants={letterRise}
                        initial="out"
                        animate={state}
                        className="inline-block"
                      >
                        <span
                          ref={(el) => {
                            lettersRef.current[word.start + i] = el
                          }}
                          className="inline-block will-change-transform"
                        >
                          {char}
                        </span>
                      </motion.span>
                    ))}
                  </span>
                </span>
              </motion.span>
            ))}
          </span>

          <motion.span style={{ rotate: badgeRotate }} className="absolute bottom-[4%] right-0 hidden sm:block">
            <motion.span
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: introDone ? 1 : 0, scale: introDone ? 1 : 0.4 }}
              transition={{ duration: 1.1, delay: 1.1, ease: EASE_OUT }}
              className="block"
            >
              <RotatingBadge />
            </motion.span>
          </motion.span>
        </motion.h1>

        {/* statement + links */}
        <div className="mt-10 grid gap-10 border-t border-rule pt-8 lg:mt-14 lg:grid-cols-12 lg:gap-16">
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 28 }}
            transition={{ duration: 1, delay: 0.95, ease: EASE_OUT }}
            className="font-serif text-[clamp(1.6rem,2.5vw,2.5rem)] leading-[1.14] tracking-[-0.01em] lg:col-span-7"
          >
            I build backend-focused products, internal tools, and the healthcare and operations systems teams rely
            on every day, with <span className="italic text-signal">Django</span>,{' '}
            <span className="italic text-signal">Node.js</span> and modern frontend tools.
          </motion.p>

          <motion.ul
            initial="hidden"
            animate={introDone ? 'show' : 'hidden'}
            variants={{ hidden: {}, show: { transition: { delayChildren: 1.1, staggerChildren: 0.07 } } }}
            className="grid border-t border-rule sm:grid-cols-2 sm:gap-x-8 lg:col-span-5"
          >
            {links.map(({ label, href, glyph, internal, download }) => (
              <motion.li
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
                }}
                className="border-b border-rule"
              >
                <a
                  href={href}
                  onClick={internal ? (e) => goTo(e, href) : undefined}
                  download={download ? 'Dominic-Amuah-Resume.pdf' : undefined}
                  target={internal || download || href.startsWith('mailto') ? undefined : '_blank'}
                  rel={internal || download ? undefined : 'noopener noreferrer'}
                  className="group/roll group flex min-h-12 items-center justify-between text-[15px] transition-[padding,color] duration-300 hover:pl-3 hover:text-signal"
                >
                  <RollText>{label}</RollText>
                  <span className="font-mono text-sm text-mute transition-all duration-300 group-hover:translate-x-1 group-hover:text-signal">
                    {glyph}
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
