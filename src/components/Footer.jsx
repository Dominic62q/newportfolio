import { useEffect, useState } from 'react'
import { useUI } from '../context/useUI'

function getAccraTime() {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Accra',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())
}

function getAccraHour() {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Accra',
      hour: 'numeric',
      hour12: false,
    }).format(new Date()),
  )
}

export default function Footer() {
  const { setTerminalOpen } = useUI()
  const [time, setTime] = useState(getAccraTime)
  const [hour, setHour] = useState(getAccraHour)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(getAccraTime())
      setHour(getAccraHour())
    }, 30_000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <footer className="border-t border-border py-12 bg-background">
      <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <p className="text-sm text-muted-foreground/50">
            &copy; {new Date().getFullYear()} Dominic Amuah
          </p>
          <p className="font-mono text-xs text-muted-foreground/50">
            It&apos;s {time} in Accra —{' '}
            {hour >= 8 && hour < 23 ? "I'm probably awake." : "I'm probably asleep."}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 sm:items-end">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTerminalOpen(true)}
              aria-label="Open interactive terminal"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-background px-3 font-mono text-xs text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <span className="text-brand">dominic@accra:~$</span>
              <span className="animate-pulse">▊</span>
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex min-h-11 items-center gap-2 px-2 text-xs text-muted-foreground/50 hover:text-brand transition-colors group"
            >
              Back to top
              <span className="inline-flex w-5 h-5 border border-border rounded-full items-center justify-center group-hover:border-brand transition-colors">
                ↑
              </span>
            </button>
          </div>
          <p className="text-center font-mono text-[10px] text-muted-foreground/40 sm:text-right">
            press ` or Ctrl+K for more
          </p>
        </div>
      </div>
    </footer>
  )
}
