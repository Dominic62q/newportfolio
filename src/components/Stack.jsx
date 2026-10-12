import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Section from './Section'
import { TechLogo } from './TechLogo'
import { stackGroups } from '../data/stack'

const listVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }

function ArrowButton({ direction, disabled, onClick }) {
  const Icon = direction === 'prev' ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous categories' : 'Next categories'}
      className="inline-flex size-10 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  )
}

// The stack is one horizontal strip of category panels (native scroll-snap, so
// swipe, trackpad, keyboard and drag all work) instead of a tall grid.
export default function Stack() {
  const scrollerRef = useRef(null)
  const barRef = useRef(null)
  const drag = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [edge, setEdge] = useState({ start: true, end: false })

  const sync = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const progress = max > 0 ? el.scrollLeft / max : 0
    if (barRef.current) {
      const visible = max > 0 ? el.clientWidth / el.scrollWidth : 1
      barRef.current.style.width = `${visible * 100}%`
      barRef.current.style.transform = `translateX(${progress * (1 / visible - 1) * 100}%)`
    }
    setEdge((prev) => {
      const next = { start: el.scrollLeft < 4, end: el.scrollLeft > max - 4 }
      return prev.start === next.start && prev.end === next.end ? prev : next
    })
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return undefined
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => observer.disconnect()
  }, [sync])

  const step = (dir) => {
    const el = scrollerRef.current
    const panel = el?.querySelector('[data-panel]')
    if (!el || !panel) return
    el.scrollBy({ left: dir * (panel.offsetWidth + 32), behavior: 'smooth' })
  }

  // Mouse drag-to-scroll (touch and trackpads already scroll natively).
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = scrollerRef.current
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true
      setDragging(true)
    }
    if (d.moved) scrollerRef.current.scrollLeft = d.left - dx
  }
  const endDrag = () => {
    drag.current = null
    setDragging(false)
  }

  return (
    <Section
      id="stack"
      index="03"
      label="Stack"
      title="Tools of the *trade.*"
      aside={
        <div className="hidden items-center gap-2 sm:flex">
          <ArrowButton direction="prev" disabled={edge.start} onClick={() => step(-1)} />
          <ArrowButton direction="next" disabled={edge.end} onClick={() => step(1)} />
        </div>
      }
    >
      <div className="-mx-6 md:-mx-10">
        <div
          ref={scrollerRef}
          onScroll={sync}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          role="region"
          aria-label="Technology stack by category"
          tabIndex={0}
          className={`flex scroll-px-6 gap-8 overflow-x-auto overscroll-x-contain px-6 pb-2 [scrollbar-width:none] md:scroll-px-10 md:px-10 [&::-webkit-scrollbar]:hidden ${
            dragging ? 'cursor-grabbing select-none' : 'snap-x snap-mandatory md:cursor-grab'
          }`}
        >
          {stackGroups.map(({ category, items }, i) => (
            <div
              key={category}
              data-panel
              className="w-[74vw] max-w-[22rem] shrink-0 snap-start sm:w-[22rem] lg:w-[24rem]"
            >
              <div className="flex items-baseline justify-between border-b border-ink pb-3">
                <h3 className="eyebrow !text-ink">{category}</h3>
                <span className="font-serif text-3xl italic leading-none text-signal">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <motion.ul
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                variants={listVariants}
              >
                {items.map((item) => (
                  <TechLogo key={item} name={item} variant="row" />
                ))}
              </motion.ul>
            </div>
          ))}
          <div aria-hidden="true" className="w-2 shrink-0 md:w-10" />
        </div>
      </div>

      <div className="mt-10 flex items-center gap-6">
        <div className="relative h-px flex-1 bg-rule" aria-hidden="true">
          <div ref={barRef} className="absolute -top-px left-0 h-[3px] bg-ink" style={{ width: '40%' }} />
        </div>
        <span className="eyebrow hidden shrink-0 sm:inline">Drag or scroll →</span>
      </div>
    </Section>
  )
}
