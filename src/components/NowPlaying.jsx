import { useCallback, useEffect, useState } from 'react'
import { ExternalLink, Headphones, Music2 } from 'lucide-react'
import { motion } from 'framer-motion'

const REFRESH_INTERVAL = 5_000

function Equalizer({ muted = false }) {
  return (
    <span className={`flex items-end gap-0.5 ${muted ? 'opacity-40' : ''}`} aria-hidden="true">
      <span className="h-2 w-0.5 rounded-full bg-brand" />
      <span className="h-4 w-0.5 animate-pulse rounded-full bg-brand [animation-delay:120ms]" />
      <span className="h-2.5 w-0.5 animate-pulse rounded-full bg-brand [animation-delay:240ms]" />
      <span className="h-3.5 w-0.5 animate-pulse rounded-full bg-brand [animation-delay:360ms]" />
    </span>
  )
}

function PanelShell({ children, className = '' }) {
  return (
    <div className={`w-full max-w-md lg:-translate-y-10 lg:justify-self-end ${className}`}>
      {children}
    </div>
  )
}

export default function NowPlaying() {
  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadTrack = useCallback(async () => {
    try {
      const response = await fetch('/api/spotify-now-playing', {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })

      if (response.status === 204 || response.status === 404) {
        setTrack(null)
        return
      }

      if (!response.ok) throw new Error('Spotify request failed')

      const payload = await response.json()
      setTrack(payload.isPlaying ? payload.track : null)
    } catch {
      setTrack(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTrack()
    const interval = window.setInterval(loadTrack, REFRESH_INTERVAL)
    return () => window.clearInterval(interval)
  }, [loadTrack])

  if (loading) {
    return (
      <PanelShell>
        <div className="rounded-3xl border border-border bg-card/70 p-3.5 shadow-[0_20px_70px_-35px_hsl(var(--brand)/0.45)] md:rounded-[2rem] md:p-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-brand md:text-[10px] md:tracking-[0.2em]">
              <Equalizer muted />
              Dominic&apos;s soundtrack
            </span>
            <span className="size-2 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mt-4 flex items-center gap-3 md:mt-6 md:gap-4">
            <div className="size-14 shrink-0 animate-pulse rounded-xl bg-muted md:size-24 md:rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
              <div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </PanelShell>
    )
  }

  if (!track) {
    return (
      <PanelShell>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-3.5 shadow-[0_20px_70px_-35px_hsl(var(--brand)/0.45)] md:rounded-[2rem] md:p-5">
          <div className="pointer-events-none absolute -right-10 -top-12 size-36 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-brand md:text-[10px] md:tracking-[0.2em]">
              <Equalizer muted />
              Dominic&apos;s soundtrack
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground md:text-[10px] md:tracking-[0.16em]">
              <span className="size-1.5 rounded-full bg-muted-foreground/50" />
              Offline
            </span>
          </div>

          <div className="relative mt-4 flex items-center gap-3 md:mt-7 md:gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-brand/40 bg-brand/[0.06] text-brand md:size-24 md:rounded-2xl">
              <Headphones className="size-6 md:size-9" strokeWidth={1.4} aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-base font-bold tracking-tight text-foreground md:text-xl">Nothing playing</p>
              <p className="mt-1 max-w-[13rem] text-xs leading-relaxed text-muted-foreground md:text-sm">
                Check back when Dominic starts a new track.
              </p>
            </div>
          </div>

          <div className="relative mt-4 flex items-center gap-2 border-t border-border pt-3 text-[10px] text-muted-foreground md:mt-6 md:pt-4 md:text-xs">
            <Music2 className="size-3 text-brand md:size-3.5" aria-hidden="true" />
            Live from Spotify
          </div>
        </div>
      </PanelShell>
    )
  }

  return (
    <PanelShell>
      <motion.a
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        href={track.url || 'https://open.spotify.com'}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Currently listening to ${track.name} by ${track.artist} on Spotify`}
        className="group relative block overflow-hidden rounded-3xl border border-brand/30 bg-card p-3.5 shadow-[0_20px_70px_-35px_hsl(var(--brand)/0.65)] transition-colors hover:border-brand/70 md:rounded-[2rem] md:p-5"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-brand/10 blur-3xl transition-colors group-hover:bg-brand/20" />
        <div className="relative flex items-center justify-between">
          <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-brand md:text-[10px] md:tracking-[0.2em]">
            <Equalizer />
            Dominic&apos;s soundtrack
          </span>
          <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-brand/80 md:text-[10px] md:tracking-[0.16em]">
            <span className="size-1.5 animate-pulse rounded-full bg-brand" />
            Live
          </span>
        </div>

        <div className="relative mt-4 flex items-center gap-3 md:mt-7 md:gap-4">
          {track.imageUrl ? (
            <img
              src={track.imageUrl}
              alt=""
              className="size-14 shrink-0 rounded-xl object-cover shadow-lg shadow-black/10 md:size-24 md:rounded-2xl"
            />
          ) : (
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-brand md:size-24 md:rounded-2xl">
              <Music2 className="size-6 md:size-9" aria-hidden="true" />
            </span>
          )}
          <span className="min-w-0 text-left">
            <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground md:text-[10px] md:tracking-[0.16em]">Currently listening to</span>
            <span className="mt-1.5 block truncate font-display text-base font-bold tracking-tight text-foreground md:mt-2 md:text-xl">{track.name}</span>
            <span className="mt-0.5 block truncate text-xs text-muted-foreground md:mt-1 md:text-sm">{track.artist}</span>
          </span>
        </div>

        <span className="relative mt-4 flex items-center justify-between border-t border-border pt-3 text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-foreground md:mt-6 md:pt-4 md:text-xs">
          <span className="md:hidden">Open in Spotify</span>
          <span className="hidden md:inline">Open this track on Spotify</span>
          <ExternalLink className="size-3 text-brand md:size-3.5" aria-hidden="true" />
        </span>
      </motion.a>
    </PanelShell>
  )
}
