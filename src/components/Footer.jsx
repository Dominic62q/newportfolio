import { motion, useScroll, useTransform } from 'framer-motion'
import { useAccraClock } from '../lib/accra'
import { useUI } from '../context/useUI'
import RollText from './RollText'

const elsewhere = [
  ['GitHub', 'https://github.com/Dominic62q'],
  ['LinkedIn', 'https://www.linkedin.com/in/dominic-amuah'],
  ['Email', 'mailto:dominicquainoo62@gmail.com'],
]

// On wide screens `reveal` pins the footer behind the page so it is uncovered as
// the content scrolls away, like a curtain lifting.
export default function Footer({ ref, reveal = false }) {
  const { label: time, hour } = useAccraClock()
  const { setPaletteOpen } = useUI()

  const { scrollYProgress } = useScroll()
  const wordY = useTransform(scrollYProgress, [0.86, 1], ['28%', '0%'])
  const wordOpacity = useTransform(scrollYProgress, [0.86, 1], [0.35, 1])

  return (
    <footer
      ref={ref}
      className={`overflow-hidden border-t border-rule bg-paper-deep ${reveal ? 'fixed inset-x-0 bottom-0 z-0' : 'relative'}`}
    >
      <div className="container-x pb-24 pt-14 sm:pb-6 md:pt-20">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="eyebrow mb-3">Local time</p>
            <p className="text-[15px]">
              It's <span className="font-mono">{time}</span> in Accra.
              <br />
              <span className="text-mute">{hour >= 8 && hour < 23 ? "I'm probably awake." : "I'm probably asleep."}</span>
            </p>
          </div>

          <div>
            <p className="eyebrow mb-3">Elsewhere</p>
            <ul className="space-y-1 text-[15px]">
              {elsewhere.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="group/roll inline-flex min-h-9 items-center hover:text-signal"
                  >
                    <RollText>{label} ↗</RollText>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:text-right">
            <p className="eyebrow mb-3">Navigate</p>
            <div className="flex flex-col gap-1 text-[15px] sm:items-end">
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className="group/roll inline-flex min-h-9 items-center hover:text-signal"
              >
                <RollText>Command palette</RollText>
                <kbd className="ml-2 font-mono text-xs text-mute">⌘K</kbd>
              </button>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group/roll inline-flex min-h-9 items-center hover:text-signal"
              >
                <RollText>Back to top ↑</RollText>
              </button>
            </div>
          </div>
        </div>

        <motion.p
          aria-hidden="true"
          style={{ y: wordY, opacity: wordOpacity }}
          className="display mt-14 select-none whitespace-nowrap text-center text-[min(15.5vw,14.25rem)] leading-[0.8] text-ink/[0.96]"
        >
          Dominic <em>Amuah</em>
        </motion.p>

        <div className="eyebrow mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-5">
          <span>&copy; {new Date().getFullYear()} Dominic Amuah</span>
          <span>Designed &amp; built in Accra</span>
        </div>
      </div>
    </footer>
  )
}
