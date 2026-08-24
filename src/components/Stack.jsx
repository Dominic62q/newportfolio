import { useRef } from 'react'
import { motion } from 'framer-motion'
import { TechLogo } from './TechLogo'
import { stackGroups } from '../data/stack'

export default function Stack() {
  const gridRef = useRef(null)

  const onMove = (e) => {
    const el = gridRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <section id="stack" className="py-28 border-t border-border">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-brand">03</span>
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground/60">Stack</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-foreground leading-[1.05] tracking-tight">
            Tools I work with.
          </h2>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            Real tools, lit up. Hover a logo for its brand colour — move your cursor to sweep the spotlight.
          </p>
        </motion.div>

        <div ref={gridRef} onPointerMove={onMove} className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-70 mix-blend-overlay motion-reduce:hidden"
            style={{
              background:
                'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(249,115,22,0.22), transparent 65%)',
            }}
          />
          <div className="relative z-0 space-y-8">
            {stackGroups.map(({ category, items }) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4 }}
              >
                <p className="mb-3 text-[10px] font-mono uppercase tracking-widest text-brand/70">{category}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {items.map((item) => (
                    <TechLogo key={item} name={item} variant="tile" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
