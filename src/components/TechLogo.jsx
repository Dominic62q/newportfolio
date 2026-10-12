import { motion } from 'framer-motion'
import { resolveTech } from '../lib/tech'

// Brand logos stay quiet (ink) until hovered, then pick up their brand colour,
// pulled toward the ink colour so dark brand colours stay legible in dark mode.
const HOVER_COLOR = 'group-hover/t:text-[color-mix(in_oklab,var(--c)_72%,var(--color-ink))]'

// variant "chip": inline pill used in project detail. variant "row": list row used in the Stack grid.
export function TechLogo({ name, variant = 'chip' }) {
  const tech = resolveTech(name)
  const Icon = tech?.icon

  if (variant === 'row') {
    return (
      <motion.li
        variants={{
          hidden: { opacity: 0, x: -16 },
          show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
        }}
        style={{ '--c': tech?.color }}
        className="group/t flex items-center gap-3.5 border-b border-rule py-3 text-[15px] transition-[padding] duration-300 hover:pl-2"
      >
        {Icon ? (
          <Icon className={`size-[18px] shrink-0 text-mute transition-colors duration-300 ${HOVER_COLOR}`} aria-hidden="true" />
        ) : (
          <span className="grid size-[18px] shrink-0 place-items-center" aria-hidden="true">
            <span className="size-1 rounded-full bg-mute/60" />
          </span>
        )}
        <span>{name}</span>
      </motion.li>
    )
  }

  return (
    <span
      style={{ '--c': tech?.color }}
      className="group/t inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1 text-xs text-mute transition-colors duration-300 hover:border-ink hover:text-ink"
    >
      {Icon && <Icon className={`size-3.5 transition-colors duration-300 ${HOVER_COLOR}`} aria-hidden="true" />}
      {name}
    </span>
  )
}
