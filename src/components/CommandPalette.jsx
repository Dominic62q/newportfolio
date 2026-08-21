import { useEffect, useMemo, useRef, useState } from 'react'
import { projects } from '../data/projects'
import { useTheme } from '../context/useTheme'
import { useUI } from '../context/useUI'
import { useModalA11y } from '../lib/useModalA11y'

function fuzzyScore(query, text) {
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  if (!q) return 1
  let score = 0
  let ti = 0
  let streak = 0
  for (const ch of q) {
    const idx = t.indexOf(ch, ti)
    if (idx === -1) return 0
    streak = idx === ti ? streak + 1 : 1
    score += 1 + streak * 0.5 + (idx === 0 ? 2 : 0)
    ti = idx + 1
  }
  return score
}

export default function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    setTerminalOpen,
    setSnakeOpen,
    terminalOpen,
    snakeOpen,
  } = useUI()
  const { isDark, toggle } = useTheme()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const dialogRef = useRef(null)

  useModalA11y(paletteOpen, dialogRef, inputRef)

  const commands = useMemo(
    () => [
      ...[
        { label: 'Go to About', hint: 'section', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: 'Go to Projects', hint: 'section', action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: 'Go to Stack', hint: 'section', action: () => document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: 'Go to Experience', hint: 'section', action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: 'Go to Contact', hint: 'section', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: 'Go to Playground', hint: 'section', action: () => document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' }) },
      ],
      ...projects.map((p) => ({
        label: p.title,
        hint: 'project',
        action: () => {
          const url = p.demo || p.github
          if (url) window.open(url, '_blank', 'noopener,noreferrer')
        },
      })),
      { label: 'GitHub', hint: 'link', action: () => window.open('https://github.com/Dominic62q', '_blank', 'noopener,noreferrer') },
      { label: 'LinkedIn', hint: 'link', action: () => window.open('https://www.linkedin.com/in/dominic-amuah', '_blank', 'noopener,noreferrer') },
      { label: 'Email Dominic', hint: 'link', action: () => window.open('mailto:dominicquainoo62@gmail.com') },
      {
        label: isDark ? 'Switch to light mode' : 'Switch to dark mode',
        hint: 'action',
        action: toggle,
      },
      {
        label: 'Open terminal',
        hint: 'action',
        keywords: 'shell bash console',
        action: () => setTerminalOpen(true),
      },
      {
        label: 'Play snake on the contribution graph',
        hint: 'game',
        keywords: 'github contributions game',
        action: () => setSnakeOpen(true),
      },
    ],
    [isDark, toggle, setTerminalOpen, setSnakeOpen],
  )

  const results = useMemo(() => {
    return commands
      .map((command) => ({
        command,
        score: Math.max(
          fuzzyScore(query, command.label),
          command.keywords ? fuzzyScore(query, command.keywords) * 0.9 : 0,
        ),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.command)
  }, [commands, query])

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        if (terminalOpen || snakeOpen) return
        e.preventDefault()
        setPaletteOpen((open) => {
          if (!open) {
            setQuery('')
            setSelected(0)
          }
          return !open
        })
      }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setPaletteOpen, snakeOpen, terminalOpen])

  useEffect(() => {
    if (!paletteOpen) return undefined
    const t = window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => window.clearTimeout(t)
  }, [paletteOpen])

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  if (!paletteOpen) return null

  const activeIndex = Math.min(selected, Math.max(0, results.length - 1))

  const runCommand = (command) => {
    setPaletteOpen(false)
    command.action()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(results.length - 1, s + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(0, s - 1))
    } else if (e.key === 'Enter' && results[activeIndex]) {
      runCommand(results[activeIndex])
    }
  }

  return (
    <div
      className="fixed inset-0 z-[95] flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setPaletteOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelected(0)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a command or search..."
          aria-label="Search commands"
          className="w-full border-b border-border bg-transparent px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
        />
        <ul ref={listRef} className="max-h-72 overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </li>
          )}
          {results.map((command, i) => (
            <li key={command.label}>
              <button
                type="button"
                data-selected={i === activeIndex}
                onMouseEnter={() => setSelected(i)}
                onClick={() => runCommand(command)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  i === activeIndex
                    ? 'bg-brand/10 text-brand'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <span className="truncate">{command.label}</span>
                <span className="ml-3 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                  {command.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 border-t border-border px-4 py-2 font-mono text-[10px] text-muted-foreground/60">
          <span>&uarr;&darr; navigate</span>
          <span>&crarr; select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}
