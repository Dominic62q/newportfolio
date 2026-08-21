import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/useTheme'
import { useUI } from '../context/useUI'
import { useModalA11y } from '../lib/useModalA11y'

const USERNAME = 'Dominic62q'
const API_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`
const ROWS = 7

const LEVEL_COLORS_LIGHT = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
const LEVEL_COLORS_DARK = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']

function buildGrid(days) {
  const grid = []
  let col = -1
  let prevDow = null
  days.forEach((day) => {
    const dow = new Date(`${day.date}T00:00:00`).getDay()
    if (dow <= prevDow || prevDow === null) col += 1
    if (!grid[col]) grid[col] = []
    grid[col][dow] = Number(day.count)
    prevDow = dow
  })
  return grid
}

function SnakeGame({ isDark }) {
  const [grid, setGrid] = useState(null)
  const [status, setStatus] = useState('loading')
  const [snake, setSnake] = useState(null)
  const [food, setFood] = useState(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const directionRef = useRef({ x: 1, y: 0 })
  const queueRef = useRef([])
  const snakeRef = useRef(null)
  const foodRef = useRef(null)
  const boardRef = useRef(null)

  const initGame = useCallback((builtGrid) => {
    const startY = Math.floor(ROWS / 2)
    const initial = [
      { x: 2, y: startY },
      { x: 1, y: startY },
      { x: 0, y: startY },
    ]
    snakeRef.current = initial
    directionRef.current = { x: 1, y: 0 }
    queueRef.current = []
    setSnake(initial)
    setGameOver(false)
    setStarted(false)
    setScore(0)

    let firstFood = null
    for (let attempts = 0; attempts < 200 && !firstFood; attempts += 1) {
      const x = Math.floor(Math.random() * builtGrid.length)
      const y = Math.floor(Math.random() * ROWS)
      if (!initial.some((s) => s.x === x && s.y === y)) firstFood = { x, y }
    }
    foodRef.current = firstFood
    setFood(firstFood)
  }, [])

  const loadContributions = useCallback(async () => {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to load contributions')
      const payload = await response.json()
      const built = buildGrid(payload.contributions ?? [])
      if (built.length < 5) throw new Error('Contributions too short for a grid')
      setGrid(built)
      setStatus('ready')
      initGame(built)
    } catch {
      setStatus('error')
    }
  }, [initGame])

  useEffect(() => {
    const t = window.setTimeout(() => {
      void loadContributions()
    }, 0)
    return () => window.clearTimeout(t)
  }, [loadContributions])

  const handleKeyDown = (e) => {
    const dirs = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
    }
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
    const dir = dirs[key]
    if (!dir) return

    e.preventDefault()
    if (queueRef.current.length < 3) queueRef.current.push(dir)
    setStarted(true)
  }

  const startGame = () => {
    setStarted(true)
    boardRef.current?.focus()
  }

  useEffect(() => {
    if (!grid || !started || gameOver) return undefined

    const cols = grid.length

    const interval = window.setInterval(() => {
      const nextDir = queueRef.current.shift()
      if (nextDir) {
        const current = directionRef.current
        const isReverse = nextDir.x === -current.x && nextDir.y === -current.y
        if (!isReverse) directionRef.current = nextDir
      }

      const dir = directionRef.current
      const currentSnake = snakeRef.current
      const head = currentSnake[0]
      const nextHead = {
        x: (head.x + dir.x + cols) % cols,
        y: (head.y + dir.y + ROWS) % ROWS,
      }

      if (currentSnake.some((s) => s.x === nextHead.x && s.y === nextHead.y)) {
        setGameOver(true)
        return
      }

      const ateFood =
        foodRef.current &&
        nextHead.x === foodRef.current.x &&
        nextHead.y === foodRef.current.y

      const nextSnake = [nextHead, ...currentSnake]
      if (!ateFood) nextSnake.pop()

      snakeRef.current = nextSnake
      setSnake(nextSnake)

      if (ateFood) {
        setScore((s) => s + 1)
        let nextFood = null
        for (let attempts = 0; attempts < 200 && !nextFood; attempts += 1) {
          const x = Math.floor(Math.random() * cols)
          const y = Math.floor(Math.random() * ROWS)
          if (!nextSnake.some((s) => s.x === x && s.y === y)) nextFood = { x, y }
        }
        foodRef.current = nextFood
        setFood(nextFood)
      }
    }, Math.max(70, 160 - score * 4))

    return () => window.clearInterval(interval)
  }, [grid, started, gameOver, score])

  const levelColors = isDark ? LEVEL_COLORS_DARK : LEVEL_COLORS_LIGHT

  return (
    <>
      {status === 'loading' && (
        <div className="flex h-56 items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-border border-t-brand" />
        </div>
      )}

      {status === 'error' && (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Could not load the contribution graph.
          </p>
          <button
            type="button"
            onClick={() => void loadContributions()}
            className="mt-4 min-h-11 rounded-full bg-brand px-5 text-sm font-medium text-brand-foreground hover:brightness-90"
          >
            Retry
          </button>
        </div>
      )}

      {status === 'ready' && grid && (
        <>
          <div
            ref={boardRef}
            tabIndex={0}
            role="group"
            aria-label="Playable GitHub contribution graph"
            onKeyDown={handleKeyDown}
            className="relative w-full overflow-hidden rounded-lg border border-border bg-muted/30 outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
          >
            <div
              className="relative w-full"
              style={{ aspectRatio: `${grid.length} / ${ROWS}` }}
            >
              {grid.map((week, x) =>
                week.map((count, y) => (
                  <div
                    key={`${x}-${y}`}
                    className="absolute rounded-[2px]"
                    style={{
                      left: `${(x / grid.length) * 100}%`,
                      top: `${(y / ROWS) * 100}%`,
                      width: `${100 / grid.length}%`,
                      height: `${100 / ROWS}%`,
                      backgroundColor:
                        levelColors[Math.min(4, Math.ceil(count / 3))] ??
                        levelColors[0],
                      transform: 'scale(0.82)',
                    }}
                  />
                )),
              )}

              {food && (
                <motion.div
                  key={`${food.x}-${food.y}`}
                  className="absolute z-10 flex items-center justify-center"
                  style={{
                    left: `${(food.x / grid.length) * 100}%`,
                    top: `${(food.y / ROWS) * 100}%`,
                    width: `${100 / grid.length}%`,
                    height: `${100 / ROWS}%`,
                  }}
                  animate={{ scale: [1, 1.35, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  <span className="block size-full rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                </motion.div>
              )}

              {snake?.map((segment, i) => (
                <div
                  key={`${segment.x}-${segment.y}-${i}`}
                  className="absolute z-20"
                  style={{
                    left: `${(segment.x / grid.length) * 100}%`,
                    top: `${(segment.y / ROWS) * 100}%`,
                    width: `${100 / grid.length}%`,
                    height: `${100 / ROWS}%`,
                  }}
                >
                  <span
                    className={`block size-full rounded-[3px] ${
                      i === 0 ? 'bg-brand' : 'bg-brand/60'
                    }`}
                  />
                </div>
              ))}
            </div>

            {gameOver && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-background/85 px-4 text-center backdrop-blur-sm">
                <p className="font-display text-xl font-black text-foreground">
                  Game over — {score} contribution{score === 1 ? '' : 's'} eaten
                </p>
                <p className="text-sm text-muted-foreground">
                  {score >= 20
                    ? 'That is a productive quarter.'
                    : 'The graph grows back. Try again.'}
                </p>
                <button
                  type="button"
                  onClick={() => initGame(grid)}
                  className="min-h-11 rounded-full bg-brand px-6 text-sm font-medium text-brand-foreground hover:brightness-90"
                >
                  Play again
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
            <p className="font-mono text-xs text-muted-foreground">
              {started
                ? 'Arrow keys / WASD to steer · edges wrap around'
                : 'Click the graph, then use arrow keys or WASD'}
            </p>
            {!started && (
              <button
                type="button"
                onClick={startGame}
                className="min-h-11 rounded-full border border-brand/40 px-4 text-xs font-semibold text-brand transition-colors hover:bg-brand/10"
              >
                Start Snake
              </button>
            )}
          </div>
        </>
      )}
    </>
  )
}

export function ContributionSnakeSection() {
  const { isDark } = useTheme()
  const { setTerminalOpen } = useUI()

  return (
    <section id="playground" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-24">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span className="text-brand">Playground</span>
          <span aria-hidden="true">·</span>
          <span>Live GitHub data</span>
        </div>
        <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          @{USERNAME}
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-card/40 p-5 sm:p-8">
        <h2 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Contributions, but playable.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          This graph is fetched live from GitHub. Click the board, start the snake,
          and eat the orange dot without colliding with yourself.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('portfolio:confetti'))}
            className="min-h-11 rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground transition-colors hover:brightness-90"
          >
            Launch confetti
          </button>
          <button
            type="button"
            onClick={() => setTerminalOpen(true)}
            className="min-h-11 rounded-full border border-border px-5 font-mono text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
          >
            Open terminal
          </button>
        </div>
        <div className="mt-8">
          <SnakeGame isDark={isDark} />
        </div>
      </div>
    </section>
  )
}

export default function ContributionSnake() {
  const { snakeOpen, setSnakeOpen } = useUI()
  const { isDark } = useTheme()
  const dialogRef = useRef(null)

  useModalA11y(snakeOpen, dialogRef)

  useEffect(() => {
    if (!snakeOpen) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSnakeOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [snakeOpen, setSnakeOpen])

  if (!snakeOpen) return null

  return (
    <div
      className="fixed inset-0 z-[92] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => setSnakeOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Snake game on GitHub contribution graph"
    >
      <div
        ref={dialogRef}
        className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
          <div>
            <h3 className="font-display text-sm font-bold text-foreground">
              Snake on @{USERNAME}&apos;s contribution graph
            </h3>
            <p className="text-xs text-muted-foreground">
              Eat the green squares. Every real contribution is food.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSnakeOpen(false)}
              aria-label="Close game"
              className="min-h-11 min-w-11 rounded px-2 py-0.5 font-mono text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              esc
            </button>
          </div>
        </div>

        <div className="p-5">
          <SnakeGame isDark={isDark} />
        </div>
      </div>
    </div>
  )
}
