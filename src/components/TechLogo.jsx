import { resolveTech } from '../lib/tech'

// Real brand SVG + brand color on hover; monochrome-by-default fallback for
// skills/concepts that have no logo. Used in the Stack grid (tile) and the
// project-card "Built with" row (chip).
export function TechLogo({ name, variant = 'tile' }) {
  const tech = resolveTech(name)

  if (variant === 'chip') {
    if (!tech) {
      return (
        <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground">
          {name}
        </span>
      )
    }
    const { icon: Icon, color } = tech
    return (
      <span
        title={name}
        className="group/chip relative inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-all duration-300 hover:-translate-y-px hover:border-[var(--c)] hover:text-foreground"
        style={{ '--c': color }}
      >
        <Icon
          className="size-3.5 opacity-80 transition-opacity duration-300 group-hover/chip:opacity-100"
          style={{ color }}
          aria-hidden="true"
        />
        {name}
      </span>
    )
  }

  if (!tech) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-card/60 px-3 py-4 text-center text-[11px] font-medium text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:text-foreground">
        {name}
      </div>
    )
  }

  const { icon: Icon, color } = tech
  return (
    <div
      title={name}
      className="group/tile relative flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--c)]"
      style={{ '--c': color }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover/tile:opacity-60"
        style={{ background: 'var(--c)' }}
      />
      <Icon
        className="relative size-8 opacity-80 transition-all duration-300 group-hover/tile:scale-110 group-hover/tile:opacity-100"
        style={{ color }}
        aria-hidden="true"
      />
      <span className="relative text-[11px] font-medium text-muted-foreground transition-colors duration-300 group-hover/tile:text-foreground">
        {name}
      </span>
    </div>
  )
}
