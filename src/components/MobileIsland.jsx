import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, GitCommit, Music2, X } from 'lucide-react'
import { useUI } from '../context/useUI'
import { describeWeather, formatClock, timeAgo } from '../lib/ambient'
import WeatherGlyph from './WeatherGlyph'

const SPRING = { type: 'spring', stiffness: 380, damping: 34 }
const ROTATE_MS = 5200
// Shown in the Shipping slot when GitHub has no recent push to report.
const SHIPPING_FALLBACK = {
  message: 'Building and shipping on GitHub',
  repo: '@Dominic62q',
  createdAt: null,
  url: 'https://github.com/Dominic62q',
}
const PROGRESS_COLOR = 'color-mix(in oklab, var(--signal) 45%, var(--paper))'

function Bars({ active = true }) {
  return (
    <span className={`flex h-3.5 items-end gap-[2px] ${active ? '' : 'opacity-40'}`} aria-hidden="true">
      {[0.9, 0.6, 1.1, 0.75].map((d, i) => (
        <span
          key={i}
          className="h-full w-[2.5px] origin-bottom rounded-full bg-paper/85"
          style={{ animation: active ? `eq ${d}s ease-in-out ${i * 0.11}s infinite` : 'none', transform: active ? undefined : 'scaleY(0.35)' }}
        />
      ))}
    </span>
  )
}

// Long titles glide past; short ones sit still.
function Ticker({ text }) {
  const wrapRef = useRef(null)
  const textRef = useRef(null)
  const [overflow, setOverflow] = useState(false)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const wrap = wrapRef.current
    const el = textRef.current
    if (!wrap || !el) return undefined
    const measure = () => {
      setWidth(el.offsetWidth)
      setOverflow(el.offsetWidth > wrap.clientWidth + 1)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(wrap)
    observer.observe(el)
    return () => observer.disconnect()
  }, [text])

  return (
    <div
      ref={wrapRef}
      className="overflow-hidden"
      style={overflow ? { maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' } : undefined}
    >
      <div
        className="flex w-max"
        style={overflow ? { animation: `ticker ${Math.max(9, (width + 32) / 26)}s linear infinite` } : undefined}
      >
        <span ref={textRef} className="whitespace-nowrap">{text}</span>
        {overflow && (
          <>
            <span aria-hidden="true" className="w-8 shrink-0" />
            <span aria-hidden="true" className="whitespace-nowrap">{text}</span>
            <span aria-hidden="true" className="w-8 shrink-0" />
          </>
        )}
      </div>
    </div>
  )
}

// A record that spins while music plays. `big` draws the grooves and sheen.
function Vinyl({ track, playing, big, percent }) {
  const art = track?.imageUrl
  return (
    <motion.div layoutId="island-vinyl" transition={SPRING} className={`relative shrink-0 ${big ? 'size-24' : 'size-9'}`}>
      <div className={`absolute inset-0 ${playing ? 'motion-safe:animate-[spin_9s_linear_infinite]' : ''}`}>
        {big ? (
          <div
            className="absolute inset-0 rounded-full ring-1 ring-paper/15"
            style={{
              background:
                'conic-gradient(from 20deg, transparent 0 38%, rgb(255 255 255 / 0.14) 48%, transparent 58% 88%, rgb(255 255 255 / 0.1) 95%, transparent), repeating-radial-gradient(circle at center, #0c0c0c 0 1.5px, #1d1d1d 1.5px 3px)',
            }}
          />
        ) : null}
        <div
          className={`absolute grid place-items-center overflow-hidden rounded-full bg-paper/15 ${
            big ? 'inset-[31%]' : 'inset-[3px] ring-1 ring-paper/20'
          }`}
        >
          {art ? <img src={art} alt="" className="size-full object-cover" /> : <Music2 className="size-3.5 text-paper/80" aria-hidden="true" />}
        </div>
        {big ? <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink ring-1 ring-paper/30" /> : null}
      </div>

      {!big && track?.durationMs ? (
        <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="16.5" fill="none" strokeWidth="1.6" className="stroke-paper/15" />
          <circle
            cx="18"
            cy="18"
            r="16.5"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray={103.7}
            strokeDashoffset={103.7 * (1 - percent / 100)}
            style={{ stroke: PROGRESS_COLOR, transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
      ) : null}
    </motion.div>
  )
}

function IconDisc({ children }) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={SPRING}
      className="grid size-9 shrink-0 place-items-center rounded-full bg-paper/12 text-paper ring-1 ring-paper/15"
    >
      {children}
    </motion.div>
  )
}

// A phone-sized take on the ambient pill: a capsule that stays with you, rotates
// through music, shipping and weather, shrinks to a disc while you scroll, and
// opens into a full player card on tap.
export default function MobileIsland({ track, progressPercent, elapsedMs, loading, weather, commit: latestCommit }) {
  const commit = latestCommit ?? SHIPPING_FALLBACK
  const { introDone } = useUI()
  const [expanded, setExpanded] = useState(false)
  const [peek, setPeek] = useState(false)
  const [typing, setTyping] = useState(false)
  const [tick, setTick] = useState(0)
  const closeRef = useRef(null)

  const panels = []
  if (track) panels.push('music')
  panels.push('commits')
  if (weather) panels.push('weather')
  if (panels.length === 0) panels.push(loading ? 'loading' : 'offline')
  const panel = panels[tick % panels.length]

  useEffect(() => {
    if (expanded || panels.length < 2) return undefined
    const id = window.setInterval(() => setTick((t) => t + 1), ROTATE_MS)
    return () => window.clearInterval(id)
  }, [expanded, panels.length])

  // Shrink to the disc while reading down; return on scroll-up or a pause.
  useEffect(() => {
    let last = window.scrollY
    let timer
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - last
      if (Math.abs(dy) > 8) {
        if (dy > 0 && y > 240) setPeek(true)
        else if (dy < 0) setPeek(false)
        last = y
      }
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setPeek(false), 1300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
    }
  }, [])

  // Step aside while the on-screen keyboard is up.
  useEffect(() => {
    const isField = (t) => t instanceof Element && t.matches('input, textarea, select, [contenteditable="true"]')
    const onIn = (e) => isField(e.target) && setTyping(true)
    const onOut = () => setTyping(false)
    document.addEventListener('focusin', onIn)
    document.addEventListener('focusout', onOut)
    return () => {
      document.removeEventListener('focusin', onIn)
      document.removeEventListener('focusout', onOut)
    }
  }, [])

  useEffect(() => {
    if (!expanded) return undefined
    closeRef.current?.focus()
    const startY = window.scrollY
    const onKey = (e) => e.key === 'Escape' && setExpanded(false)
    const onScroll = () => Math.abs(window.scrollY - startY) > 60 && setExpanded(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [expanded])

  if (!introDone) return null

  const playing = Boolean(track)
  const showPeek = peek && !expanded

  const compact = {
    music: { label: 'Now playing', text: track ? `${track.name} · ${track.artist}` : '' },
    commits: { label: 'Shipping', text: commit.message },
    weather: { label: 'Accra now', text: weather ? `${Math.round(weather.temperature)}°C · ${describeWeather(weather.code)}` : '' },
    loading: { label: 'Tuning in', text: 'Connecting to Accra…' },
    offline: { label: 'Soundtrack', text: 'Nothing playing right now' },
  }[panel]

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <motion.button
            type="button"
            aria-label="Close player"
            tabIndex={-1}
            className="fixed inset-0 z-[39] bg-ink/30 backdrop-blur-[2px] sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(false)}
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex justify-center sm:hidden">
        <motion.div
          initial={{ y: 90, opacity: 0, scale: 0.85 }}
          animate={typing ? { y: 120, opacity: 0, scale: 0.9 } : { y: 0, opacity: 1, scale: 1 }}
          transition={{ ...SPRING, delay: typing ? 0 : 0.15 }}
          style={{ pointerEvents: typing ? 'none' : undefined }}
        >
          <motion.div
            layout
            transition={SPRING}
            style={{ borderRadius: expanded ? 30 : 999 }}
            className={`pointer-events-auto relative overflow-hidden bg-ink text-paper shadow-[0_14px_36px_-10px_rgb(0_0_0/0.5),inset_0_0_0_1px_rgb(255_255_255/0.07)] ${
              expanded ? 'w-[min(92vw,22rem)]' : 'w-fit max-w-[92vw]'
            }`}
          >
            {expanded ? (
              <motion.div
                role="region"
                aria-label="Now playing, shipping and weather"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.35 }}
                className="max-h-[calc(100svh-1.5rem)] overflow-y-auto overscroll-contain p-5"
              >
                <div className="flex items-start gap-4">
                  <Vinyl big track={track} playing={playing} percent={progressPercent} />
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/60">
                      <Bars active={playing} />
                      {playing ? 'Now playing' : 'Not playing'}
                    </p>
                    <p className="line-clamp-2 font-serif text-[1.6rem] italic leading-[1.05]">
                      {track ? track.name : "Dominic's soundtrack"}
                    </p>
                    <p className="mt-1.5 truncate text-[13px] text-paper/65">{track ? track.artist : 'Nothing on right now'}</p>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setExpanded(false)}
                    aria-label="Close player"
                    className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full text-paper/70 hover:text-paper"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>

                {track?.durationMs ? (
                  <div className="mt-5">
                    <div className="h-[3px] overflow-hidden rounded-full bg-paper/15">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${progressPercent}%`, background: PROGRESS_COLOR, transition: 'width 1s linear' }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between font-mono text-[10px] tabular-nums text-paper/55">
                      <span>{formatClock(elapsedMs)}</span>
                      <span>{formatClock(track.durationMs)}</span>
                    </div>
                  </div>
                ) : null}

                {track ? (
                  <a
                    href={track.url || 'https://open.spotify.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-full bg-paper text-[13px] font-medium text-ink"
                  >
                    Open in Spotify
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                ) : null}

                <div className="mt-5 grid gap-2 border-t border-paper/15 pt-4">
                  {commit ? (
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 rounded-2xl bg-paper/8 p-3"
                    >
                      <GitCommit className="mt-0.5 size-4 shrink-0 text-paper/80" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-paper/55">
                          Shipping · {commit.repo}{commit.createdAt ? ` · ${timeAgo(commit.createdAt)}` : ''}
                        </span>
                        <span className="mt-1 line-clamp-2 block text-[13px] leading-snug">{commit.message}</span>
                      </span>
                    </a>
                  ) : null}
                  {weather ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-paper/8 p-3">
                      <WeatherGlyph code={weather.code} className="size-4 shrink-0 text-paper/80" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/55">Accra</span>
                      <span className="ml-auto text-[13px] tabular-nums">
                        {Math.round(weather.temperature)}°C · {describeWeather(weather.code)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ) : (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                aria-expanded="false"
                aria-label={`Open player. ${compact.label}: ${compact.text}`}
                className="flex min-h-11 items-center gap-2.5 p-1.5 text-left"
              >
                {panel === 'music' ? (
                  <Vinyl track={track} playing percent={progressPercent} />
                ) : (
                  <IconDisc>
                    {panel === 'commits' ? (
                      <GitCommit className="size-4" aria-hidden="true" />
                    ) : panel === 'weather' && weather ? (
                      <WeatherGlyph code={weather.code} className="size-4" />
                    ) : (
                      <Music2 className="size-4 opacity-70" aria-hidden="true" />
                    )}
                  </IconDisc>
                )}

                {showPeek ? null : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3 pr-3"
                  >
                    <span className="block w-[8.75rem]">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={panel}
                          className="block"
                          initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
                          transition={{ duration: 0.28 }}
                        >
                          <span className="block font-mono text-[9px] uppercase leading-none tracking-[0.16em] text-paper/55">
                            {compact.label}
                          </span>
                          <span className="mt-1 block text-[12.5px] font-medium leading-tight">
                            <Ticker text={compact.text} />
                          </span>
                        </motion.span>
                      </AnimatePresence>
                    </span>

                    {panels.length > 1 ? (
                      <span className="flex flex-col gap-[3px]" aria-hidden="true">
                        {panels.map((p) => (
                          <span
                            key={p}
                            className={`block w-[3px] rounded-full transition-all duration-300 ${p === panel ? 'h-3 bg-paper' : 'h-[3px] bg-paper/30'}`}
                          />
                        ))}
                      </span>
                    ) : null}
                    {playing && panel === 'music' ? <Bars /> : null}
                  </motion.span>
                )}
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
