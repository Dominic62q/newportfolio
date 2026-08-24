import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects'
import { stackGroups } from '../data/stack'
import { experiences } from '../data/experience'
import { useTheme } from '../context/useTheme'
import { useUI } from '../context/useUI'
import { useModalA11y } from '../lib/useModalA11y'

const BANNER = [
  'Dominic OS v2.0 — type "help" to get started.',
]

const HELP_LINES = [
  'Available commands:',
  '  whoami              who is this guy',
  '  projects            list shipped work',
  '  open <number>       open a project link (e.g. open 4)',
  '  stack               print the tech stack',
  '  experience          print work history',
  '  contact             reach out',
  '  playground          jump to the live contribution game',
  '  theme               toggle dark/light mode',
  '  snake               play snake on my GitHub graph',
  '  sudo hire dominic   you know what this does',
  '  clear               clear the terminal',
  '  exit                close the terminal',
]

export default function Terminal() {
  const {
    terminalOpen,
    setTerminalOpen,
    setSnakeOpen,
    paletteOpen,
    snakeOpen,
  } = useUI()
  const { isDark, toggle } = useTheme()
  const [lines, setLines] = useState(BANNER)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)
  const bodyRef = useRef(null)
  const dialogRef = useRef(null)

  useModalA11y(terminalOpen, dialogRef, inputRef)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && terminalOpen) {
        setTerminalOpen(false)
        return
      }
      if (e.key === '`' && !terminalOpen && !paletteOpen && !snakeOpen) {
        const target = e.target
        if (
          target instanceof HTMLElement &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)
        ) {
          return
        }
        e.preventDefault()
        setTerminalOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [paletteOpen, setTerminalOpen, snakeOpen, terminalOpen])

  useEffect(() => {
    if (terminalOpen) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 30)
      return () => window.clearTimeout(t)
    }
    return undefined
  }, [terminalOpen])

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines])

  if (!terminalOpen) return null

  const print = (...out) => setLines((prev) => [...prev, ...out])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const runCommand = (raw) => {
    const command = raw.trim()
    if (!command) return
    print(`dominic@accra:~$ ${command}`)

    const [name, ...args] = command.split(/\s+/)
    switch (name.toLowerCase()) {
      case 'help':
        print(...HELP_LINES)
        break
      case 'whoami':
        print(
          'Dominic Amuah — Backend Developer / AI-Assisted Full-Stack Developer.',
          'Builds practical web apps with Django, DRF, REST APIs, React and Tailwind.',
          'Based in Accra, Ghana. Ships things.',
        )
        break
      case 'projects':
        print(
          ...projects.map(
            (p) =>
              `  ${p.id}. ${p.title}${p.demo ? ` -> ${p.demo}` : ''}${
                p.github ? ` (code: ${p.github})` : ''
              }`,
          ),
          'Tip: "open <number>" opens it in a new tab.',
        )
        break
      case 'open': {
        const id = Number(args[0])
        const project = projects.find((p) => p.id === id)
        if (!project) {
          print(`open: no project with id "${args[0] ?? ''}". Try "projects".`)
        } else {
          const url = project.demo || project.github
          if (url) {
            print(`Opening ${project.title}...`)
            window.open(url, '_blank', 'noopener,noreferrer')
          } else {
            print(`${project.title} has no public links yet.`)
          }
        }
        break
      }
      case 'stack':
        print(
          ...stackGroups.map((g) => `  ${g.category}: ${g.items.join(', ')}`),
        )
        break
      case 'experience':
        print(
          ...experiences.map(
            (e) => `  ${e.role} @ ${e.company} (${e.period})`,
          ),
        )
        break
      case 'contact':
        print(
          'Email: dominicquainoo62@gmail.com',
          'GitHub: https://github.com/Dominic62q',
          'LinkedIn: https://www.linkedin.com/in/dominic-amuah',
          'Taking you to the contact form...',
        )
        scrollToContact()
        break
      case 'playground':
        print('Taking you to the live contribution game...')
        document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'theme':
        toggle()
        print(`Theme switched to ${isDark ? 'light' : 'dark'} mode.`)
        break
      case 'snake':
        print('Loading snake on the contribution graph...')
        setTerminalOpen(false)
        setSnakeOpen(true)
        break
      case 'sudo':
        if (command.toLowerCase() === 'sudo hire dominic') {
          print(
            '[sudo] password for recruiter: ********',
            'Access granted. Excellent decision.',
            'Routing you to the contact form...',
          )
          scrollToContact()
        } else {
          print('sudo: try "sudo hire dominic"')
        }
        break
      case 'clear':
        setLines([])
        break
      case 'exit':
        setTerminalOpen(false)
        break
      default:
        print(`bash: command not found: ${name}`)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input)
      if (input.trim()) {
        setHistory((prev) => [...prev, input])
      }
      setHistoryIndex(-1)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setInput(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const next = historyIndex + 1
      if (next >= history.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(next)
        setInput(history[next])
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => setTerminalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Interactive terminal"
    >
      <div
        ref={dialogRef}
        className="my-auto w-full max-w-2xl overflow-hidden rounded-xl border border-neutral-700 bg-[#0d1117] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-3">
          <span className="size-3 rounded-full bg-red-500/80" />
          <span className="size-3 rounded-full bg-yellow-500/80" />
          <span className="size-3 rounded-full bg-green-500/80" />
          <span className="ml-3 font-mono text-xs text-neutral-400">
            dominic@accra: ~
          </span>
          <button
            type="button"
            onClick={() => setTerminalOpen(false)}
            aria-label="Close terminal"
            className="ml-auto rounded px-2 py-0.5 font-mono text-xs text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
          >
            esc
          </button>
        </div>

        <div
          ref={bodyRef}
          className="h-[22rem] max-h-[60vh] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed text-neutral-300"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <p key={i} className={line.startsWith('dominic@accra') ? 'text-orange-400' : 'whitespace-pre-wrap'}>
              {line}
            </p>
          ))}
          <div className="mt-1 flex items-center gap-2">
            <span className="shrink-0 text-orange-400">dominic@accra:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent font-mono text-[13px] text-neutral-100 caret-orange-400 outline-none"
              aria-label="Terminal input"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
