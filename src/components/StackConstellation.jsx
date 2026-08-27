import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getStackLayout } from '../lib/stackGraph'
import { resolveTech } from '../lib/tech'

const LIGHT_RADIUS = 230 // px — flashlight radius around the pointer
const AMBIENT_IDLE_MS = 3000 // auto-torch after this much pointer stillness

// Layout + graph are computed once at module load; rendering is DOM+SVG so the
// real brand icons (react-icons) are reused and every node stays a real button.
export default function StackConstellation({ variant = 'inline', onClose = null }) {
  const isOverlay = variant === 'overlay'
  const boardRef = useRef(null)
  const tilesRef = useRef(new Map()) // key -> element
  const centersRef = useRef(null) // cached tile centres relative to board, rebuilt on resize
  const pointerRef = useRef({ x: 0, y: 0 })
  const ambientRef = useRef(true)
  const idleAtRef = useRef(0)

  const [activeKey, setActiveKey] = useState(null)
  const [pinnedKey, setPinnedKey] = useState(null)

  const { nodes, links, hubKey, positions, neighbours } = useMemo(() => getStackLayout(), [])
  const active = activeKey ?? pinnedKey

  const setActive = useCallback((key) => {
    ambientRef.current = false
    idleAtRef.current = performance.now() + AMBIENT_IDLE_MS
    setActiveKey(key)
  }, [])

  // ---- geometry cache -------------------------------------------------------
  const measureCenters = useCallback(() => {
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const map = new Map()
    tilesRef.current.forEach((el, key) => {
      const r = el.getBoundingClientRect()
      map.set(key, { x: r.left - rect.left + r.width / 2, y: r.top - rect.top + r.height / 2 })
    })
    centersRef.current = map
  }, [])

  useEffect(() => {
    measureCenters()
    const ro = new ResizeObserver(measureCenters)
    if (boardRef.current) ro.observe(boardRef.current)
    return () => ro.disconnect()
  }, [measureCenters])

  // ---- flashlight: one class toggle per tile per animation frame ------------
  useEffect(() => {
    const board = boardRef.current
    if (!board) return undefined
    let raf = 0

    const paintLight = () => {
      raf = 0
      const centers = centersRef.current
      if (!centers) return
      const box = board.getBoundingClientRect()
      let lx
      let ly
      if (ambientRef.current) {
        ambientT += 0.02
        lx = box.width * (0.5 + 0.36 * Math.sin(ambientT * 0.7))
        ly = box.height * (0.5 + 0.3 * Math.cos(ambientT * 0.9))
      } else {
        lx = pointerRef.current.x
        ly = pointerRef.current.y
      }
      tilesRef.current.forEach((el, key) => {
        const center = centers.get(key)
        if (!center) return
        const dx = center.x - lx
        const dy = center.y - ly
        el.classList.toggle('is-lit', dx * dx + dy * dy < LIGHT_RADIUS * LIGHT_RADIUS)
      })
    }
    let ambientT = Math.random() * 100

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paintLight)
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    ambientRef.current = !reduced.matches // auto-torch only when motion is welcome

    const onPointerMove = (e) => {
      if (e.pointerType === 'touch') return // touch uses tap-to-inspect instead
      const rect = board.getBoundingClientRect()
      pointerRef.current.x = e.clientX - rect.left
      pointerRef.current.y = e.clientY - rect.top
      ambientRef.current = false
      idleAtRef.current = performance.now() + AMBIENT_IDLE_MS
      schedule()
    }

    // gentle ticker: restarts the torch after idle, keeps ambient animating
    const ticker = window.setInterval(() => {
      if (reduced.matches) return
      if (!ambientRef.current && performance.now() > idleAtRef.current) ambientRef.current = true
      schedule()
    }, 100)

    board.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.clearInterval(ticker)
      if (raf) cancelAnimationFrame(raf)
      board.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  useEffect(() => {
    measureCenters()
  }, [measureCenters])

  // Escape clears selection; in overlay variant it also closes the map.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (pinnedKey || activeKey) {
        setPinnedKey(null)
        setActiveKey(null)
      } else if (isOverlay && onClose) {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeKey, pinnedKey, isOverlay, onClose])

  const detailsNode = useMemo(() => nodes.find((n) => n.key === active) ?? null, [active, nodes])
  const detailLinks = useMemo(() => {
    if (!active) return []
    return links
      .filter((l) => l.source === active || l.target === active)
      .map((l) => ({ ...l, otherKey: l.source === active ? l.target : l.source }))
      .sort((a, b) => b.count - a.count)
  }, [active, links])

  const registerTile = (key) => (el) => {
    if (el) tilesRef.current.set(key, el)
    else tilesRef.current.delete(key)
  }

  return (
    <div className={isOverlay ? 'relative flex h-full flex-col' : 'relative'}>
      <div
        ref={boardRef}
        className={`stack-board relative w-full overflow-hidden rounded-2xl border border-border bg-[#0b0f17] ${
          isOverlay ? 'min-h-0 flex-1' : ''
        }`}
        style={{ aspectRatio: isOverlay ? undefined : '16 / 10' }}
      >
        {/* faint starfield */}
        <div aria-hidden="true" className="stack-stars absolute inset-0 motion-reduce:hidden" />

        {/* link layer — viewBox stretched so line endpoints match tile %s */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {links.map((link) => {
            const a = positions.get(link.source)
            const b = positions.get(link.target)
            const isActiveEdge = Boolean(active) && (link.source === active || link.target === active)
            const other = isActiveEdge
              ? nodes.find((n) => n.key === (link.source === active ? link.target : link.source))
              : null
            return (
              <line
                key={`${link.source}|${link.target}`}
                x1={a?.x ?? 50}
                y1={a?.y ?? 50}
                x2={b?.x ?? 50}
                y2={b?.y ?? 50}
                stroke={isActiveEdge ? other?.color ?? 'var(--color-brand)' : 'rgba(148,163,184,0.25)'}
                strokeWidth={isActiveEdge ? 2 : 1}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                className="transition-opacity duration-300"
                style={{ opacity: active && !isActiveEdge ? 0.07 : 1 }}
              />
            )
          })}
        </svg>

        {/* soft brand glow under the inspected node */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `radial-gradient(340px circle at ${positions.get(active)?.x ?? 50}% ${
              positions.get(active)?.y ?? 50
            }%, rgba(249,115,22,0.13), transparent 70%)`,
          }}
        />

        {nodes.map((node) => {
          const pos = positions.get(node.key) ?? { x: 50, y: 50 }
          const isHub = node.key === hubKey
          const isActive = node.key === active
          const dimmed = Boolean(active) && !isActive && !(neighbours.get(active) ?? new Set()).has(node.key)
          const Icon = resolveTech(node.key)?.icon
          return (
            <button
              key={node.key}
              ref={registerTile(node.key)}
              type="button"
              title={`${node.label} — see what it ships with`}
              aria-pressed={pinnedKey === node.key}
              onMouseEnter={() => setActive(node.key)}
              onFocus={() => setActive(node.key)}
              onBlur={() => setActiveKey((k) => (k === node.key ? null : k))}
              onMouseLeave={() => setActiveKey((k) => (k === node.key ? null : k))}
              onClick={() => setPinnedKey((p) => (p === node.key ? null : node.key))}
              className={`stack-tile absolute z-10 flex size-14 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-xl border border-border bg-card/90 backdrop-blur-sm transition-all duration-300 md:size-16 ${
                isHub ? 'z-20 !border-brand/60 shadow-lg shadow-brand/10' : ''
              } ${dimmed ? 'opacity-30 saturate-50' : 'opacity-100'}`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                borderColor: isActive ? node.color : undefined,
                transform: `translate(-50%, -50%) scale(${isActive ? 1.15 : 1})`,
              }}
            >
              {Icon && (
                <Icon
                  className="size-6 transition-transform duration-300 group-hover/tile:scale-110 md:size-7"
                  style={{ color: node.color }}
                  aria-hidden="true"
                />
              )}
              <span className="max-w-full truncate px-1 text-[8px] font-medium leading-none text-muted-foreground md:text-[9px]">
                {node.label}
              </span>
            </button>
          )
        })}

        {!active && (
          <p className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-slate-400/80">
            hover or tap a tool to see where it shipped ↗
          </p>
        )}
      </div>

      {/* inspect panel — hover shows transient, click pins it in place */}
      <div
        className={isOverlay ? 'shrink-0 border-t border-border bg-background px-4 py-4' : 'mt-4 min-h-[86px]'}
        aria-live="polite"
      >
        {detailsNode ? (
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <p className="font-display text-lg font-extrabold leading-tight" style={{ color: detailsNode.color }}>
                {detailsNode.label}
              </p>
              <p className="text-xs text-muted-foreground">
                linked to {detailLinks.length} tool{detailLinks.length === 1 ? '' : 's'} across your products
              </p>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
              {detailLinks.map(({ otherKey, count, projects }) => {
                const other = nodes.find((n) => n.key === otherKey)
                return (
                  <span
                    key={otherKey}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px]"
                  >
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ background: other?.color }}
                    />
                    <span className="font-semibold text-foreground">{other?.label}</span>
                    <span className="text-muted-foreground">×{count}</span>
                    <span className="hidden truncate text-muted-foreground/70 lg:inline">· {projects.join(', ')}</span>
                  </span>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground/70">
            Every line is a real co-deployment — two tools that shipped inside the same product. Nothing here is decorative.
          </p>
        )}
      </div>
    </div>
  )
}
