import { lazy, Suspense, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, X } from 'lucide-react'
import { TechLogo } from './TechLogo'
import { stackGroups } from '../data/stack'
import { useModalA11y } from '../lib/useModalA11y'

// The graph ships as its own chunk; mobile only pays for it after tapping
// "Explore my stack map".
const StackConstellation = lazy(() => import('./StackConstellation'))

function ConstellationSkeleton() {
  return (
    <div
      className="w-full animate-pulse rounded-2xl border border-border bg-muted/30"
      style={{ aspectRatio: '16 / 10' }}
    />
  )
}

export default function Stack() {
  const [mapOpen, setMapOpen] = useState(false)
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)
  useModalA11y(mapOpen, dialogRef, closeBtnRef)

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
            Hover a logo for its brand colour, move your cursor to sweep the light across the dark.
          </p>
        </motion.div>

        {/* Desktop: live tool constellation built from real project co-deployments */}
        <div className="hidden md:block">
          <Suspense fallback={<ConstellationSkeleton />}>
            <StackConstellation />
          </Suspense>
        </div>

        {/* Mobile: compact chip grid + fullscreen map on demand */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {stackGroups.map(({ category, items }) => (
              <div key={category}>
                <p className="mb-3 text-[10px] font-mono uppercase tracking-widest text-brand/70">{category}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {items.map((item) => (
                    <TechLogo key={item} name={item} variant="tile" />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-5 py-3.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/15"
          >
            <Compass className="size-4" aria-hidden="true" />
            Explore my stack map
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground/60">
            See how every tool connects through real shipped projects.
          </p>
        </div>
      </div>

      {/* Fullscreen stack map overlay */}
      {mapOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Interactive stack map"
          className="fixed inset-0 z-[150] flex flex-col bg-background"
        >
          <div className="flex shrink-0 items-center justify-between px-4 py-3">
            <div>
              <p className="font-display text-base font-extrabold leading-tight">My stack, connected</p>
              <p className="text-[11px] text-muted-foreground">Tap any tool to trace where it shipped.</p>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setMapOpen(false)}
              aria-label="Close stack map"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 px-3 pb-3">
            <Suspense fallback={<div className="h-full w-full animate-pulse rounded-2xl bg-muted/30" />}>
              <StackConstellation variant="overlay" onClose={() => setMapOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}
    </section>
  )
}
