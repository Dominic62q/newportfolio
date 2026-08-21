import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  ExternalLink,
  GitCommit,
  Music2,
  Sun,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useUI } from '../context/useUI'

const MUSIC_REFRESH_INTERVAL = 5_000
const WEATHER_REFRESH_INTERVAL = 10 * 60_000
const COMMITS_REFRESH_INTERVAL = 5 * 60_000
const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=5.6037&longitude=-0.1870&current=temperature_2m,apparent_temperature,weather_code&timezone=Africa%2FAccra'
const GITHUB_EVENTS_URL =
  'https://api.github.com/users/Dominic62q/events/public?per_page=100'

function timeAgo(dateString) {
  const elapsedMs = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(elapsedMs / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function latestCommitsFromEvents(events) {
  const pushes = events.filter((event) => event.type === 'PushEvent')
  const commits = []
  for (const push of pushes) {
    for (const commit of [...(push.payload?.commits ?? [])].reverse()) {
      commits.push({
        message: commit.message.split('\n')[0],
        repo: push.repo.name.replace(/^Dominic62q\//, ''),
        createdAt: push.created_at,
        url: `https://github.com/${push.repo.name}/commit/${commit.sha}`,
      })
    }
  }
  return commits.slice(0, 5)
}

function Equalizer({ muted = false, boosted = false }) {
  const animationStyle = boosted ? { animationDuration: '0.28s' } : undefined

  return (
    <span className={`flex items-end gap-0.5 ${muted ? 'opacity-40' : ''}`} aria-hidden="true">
      <span className="h-1.5 w-0.5 animate-pulse rounded-full bg-brand" style={animationStyle} />
      <span className="h-3 w-0.5 animate-pulse rounded-full bg-brand [animation-delay:120ms]" style={animationStyle} />
      <span className="h-2 w-0.5 animate-pulse rounded-full bg-brand [animation-delay:240ms]" style={animationStyle} />
      <span className="h-2.5 w-0.5 animate-pulse rounded-full bg-brand [animation-delay:360ms]" style={animationStyle} />
    </span>
  )
}

function PillShell({ children }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[4.5rem] z-40 flex justify-center px-4">
      <div className="pointer-events-auto w-fit max-w-full">
        {children}
      </div>
    </div>
  )
}

function AlbumArt({ imageUrl }) {
  return (
    <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-800 text-brand ring-1 ring-border">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="size-full object-cover" />
      ) : (
        <Music2 className="size-3.5" aria-hidden="true" />
      )}
    </div>
  )
}

function WeatherIcon({ code }) {
  let Icon = Cloud

  if (code === 0) Icon = Sun
  else if ([1, 2].includes(code)) Icon = CloudSun
  else if ([45, 48].includes(code)) Icon = CloudFog
  else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86].includes(code)) Icon = CloudRain
  else if ([95, 96, 99].includes(code)) Icon = CloudLightning

  return <Icon className="size-4 shrink-0 text-brand" aria-hidden="true" />
}

function describeWeather(code) {
  if (code === 0) return 'Clear'
  if ([1, 2].includes(code)) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if ([45, 48].includes(code)) return 'Foggy'
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow'
  if ([95, 96, 99].includes(code)) return 'Thunderstorms'
  return 'Current conditions'
}

function Slide({ children, panel, reducedMotion }) {
  const isWeather = panel === 'weather'

  return (
    <motion.div
      key={panel}
      initial={{ opacity: 0, x: reducedMotion ? 0 : isWeather ? 18 : -18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: reducedMotion ? 0 : isWeather ? -18 : 18 }}
      transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function MusicPanel({ track, progressPercent, loading, boosted }) {
  if (loading) {
    return (
      <div className="flex min-h-11 items-center gap-2.5 rounded-full border border-border bg-background/95 px-3 shadow-lg shadow-black/5 backdrop-blur-md">
        <div className="size-7 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="h-2.5 w-32 animate-pulse rounded-full bg-muted" />
        <span className="ml-auto size-1.5 animate-pulse rounded-full bg-muted" />
      </div>
    )
  }

  if (!track) {
    return (
      <div
        className="flex min-h-11 items-center justify-between gap-3 rounded-full border border-border bg-background/95 px-3 shadow-lg shadow-black/5 backdrop-blur-md"
        role="group"
        aria-label="Spotify is offline"
      >
        <span className="flex min-w-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <Equalizer muted boosted={boosted} />
          <span className="truncate">Dominic&apos;s soundtrack</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
          <span className="size-1.5 rounded-full bg-muted-foreground/50" />
          Offline
        </span>
      </div>
    )
  }

  return (
    <motion.a
      href={track.url || 'https://open.spotify.com'}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Currently listening to ${track.name} by ${track.artist} on Spotify`}
      className="group relative flex min-h-11 max-w-[calc(100vw-2rem)] items-center gap-2.5 overflow-hidden rounded-full border border-brand/30 bg-background/95 px-2.5 pr-3.5 shadow-lg shadow-brand/10 backdrop-blur-md transition-colors hover:border-brand/70"
    >
      <AlbumArt imageUrl={track.imageUrl} />
      <span className="hidden items-center sm:inline-flex">
        <Equalizer boosted={boosted} />
      </span>

      <span className="flex min-w-0 max-w-[18rem] items-center gap-1.5 text-left">
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-brand">
          Now playing
        </span>
        <span className="min-w-0 truncate text-xs font-semibold text-foreground">
          {track.name}
        </span>
        <span className="hidden max-w-40 truncate text-xs text-muted-foreground sm:inline">
          · {track.artist}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground transition-colors group-hover:text-foreground">
        <span className="hidden sm:inline">Spotify</span>
        <ExternalLink className="size-3.5 text-brand" aria-hidden="true" />
      </span>

      {track.durationMs ? (
        <span className="absolute inset-x-4 bottom-0 h-0.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <motion.span
            className="block h-full rounded-full bg-brand"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'linear' }}
          />
        </span>
      ) : null}
    </motion.a>
  )
}

function WeatherPanel({ weather }) {
  return (
    <div
      className="flex min-h-11 max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full border border-border bg-background/95 px-3.5 shadow-lg shadow-black/5 backdrop-blur-md"
      role="group"
      aria-label={`Current weather in Accra: ${Math.round(weather.temperature)} degrees Celsius, ${describeWeather(weather.code)}`}
    >
      <WeatherIcon code={weather.code} />
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Accra</span>
      <span className="text-sm font-semibold tabular-nums text-foreground">{Math.round(weather.temperature)}°C</span>
      <span className="hidden text-xs text-muted-foreground sm:inline">{describeWeather(weather.code)}</span>
      <span className="hidden text-xs text-muted-foreground/70 sm:inline">Feels {Math.round(weather.apparentTemperature)}°</span>
    </div>
  )
}

function CommitsPanel({ commit }) {
  const message = commit?.message ?? 'Building and shipping on GitHub'
  const metadata = commit ? timeAgo(commit.createdAt) : '@Dominic62q'
  const url = commit?.url ?? 'https://github.com/Dominic62q'

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        commit
          ? `Latest commit: ${commit.message} in ${commit.repo}, ${metadata}`
          : 'GitHub profile: building and shipping on GitHub'
      }
      className="group flex min-h-11 max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full border border-border bg-background/95 px-3 shadow-lg shadow-black/5 backdrop-blur-md transition-colors hover:border-brand/70"
    >
      <GitCommit className="size-4 shrink-0 text-brand" aria-hidden="true" />
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-brand">
          Shipping
        </span>
        <span className="min-w-0 truncate text-xs font-semibold text-foreground">
          {message}
        </span>
        <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
          · {metadata}
        </span>
      </span>
    </a>
  )
}

export default function AmbientPill() {
  const [track, setTrack] = useState(null)
  const [musicLoading, setMusicLoading] = useState(true)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [weather, setWeather] = useState(null)
  const [commits, setCommits] = useState([])
  const [panel, setPanel] = useState('music')
  const tickRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const { ambientBoosted } = useUI()

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
      const nextTrack = payload.isPlaying ? payload.track : null
      setTrack(nextTrack)
      setElapsedMs(nextTrack?.progressMs ?? 0)
    } catch {
      setTrack(null)
    } finally {
      setMusicLoading(false)
    }
  }, [])

  const loadWeather = useCallback(async () => {
    try {
      const response = await fetch(WEATHER_URL, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })

      if (!response.ok) throw new Error('Weather request failed')

      const payload = await response.json()
      const current = payload.current
      setWeather({
        temperature: current.temperature_2m,
        apparentTemperature: current.apparent_temperature,
        code: current.weather_code,
      })
    } catch {
      setWeather(null)
    }
  }, [])

  const loadCommits = useCallback(async () => {
    try {
      const response = await fetch(GITHUB_EVENTS_URL, {
        headers: { Accept: 'application/vnd.github+json' },
        cache: 'no-store',
      })
      if (!response.ok) throw new Error('GitHub events request failed')
      const events = await response.json()
      setCommits(latestCommitsFromEvents(Array.isArray(events) ? events : []))
    } catch {
      setCommits([])
    }
  }, [])

  useEffect(() => {
    const initialTrackRequest = window.setTimeout(() => {
      void loadTrack()
    }, 0)
    const initialWeatherRequest = window.setTimeout(() => {
      void loadWeather()
    }, 0)
    const initialCommitsRequest = window.setTimeout(() => {
      void loadCommits()
    }, 0)
    const trackInterval = window.setInterval(loadTrack, MUSIC_REFRESH_INTERVAL)
    const weatherInterval = window.setInterval(loadWeather, WEATHER_REFRESH_INTERVAL)
    const commitsInterval = window.setInterval(loadCommits, COMMITS_REFRESH_INTERVAL)

    return () => {
      window.clearTimeout(initialTrackRequest)
      window.clearTimeout(initialWeatherRequest)
      window.clearTimeout(initialCommitsRequest)
      window.clearInterval(trackInterval)
      window.clearInterval(weatherInterval)
      window.clearInterval(commitsInterval)
    }
  }, [loadTrack, loadWeather, loadCommits])

  useEffect(() => {
    window.clearInterval(tickRef.current)
    if (!track?.durationMs) return undefined

    tickRef.current = window.setInterval(() => {
      setElapsedMs((current) => Math.min(track.durationMs, current + 1000))
    }, 1000)

    return () => window.clearInterval(tickRef.current)
  }, [track])

  const latestCommit = commits[0] ?? null
  const rotation = ['music', 'commits']
  if (weather) rotation.push('weather')
  const rotationKey = rotation.join(',')

  useEffect(() => {
    if (rotation.length < 2) return undefined

    const interval = window.setInterval(() => {
      setPanel((current) => {
        const index = rotation.indexOf(current)
        return rotation[(index + 1) % rotation.length]
      })
    }, 8_000)

    return () => window.clearInterval(interval)
  }, [rotationKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const progressPercent = track?.durationMs
    ? Math.min(100, (elapsedMs / track.durationMs) * 100)
    : 0
  const visiblePanel = rotation.includes(panel) ? panel : 'music'

  return (
    <PillShell>
      <AnimatePresence initial={false} mode="wait">
        {visiblePanel === 'weather' && weather ? (
          <Slide key="weather" panel="weather" reducedMotion={reducedMotion}>
            <WeatherPanel weather={weather} />
          </Slide>
        ) : visiblePanel === 'commits' ? (
          <Slide key="commits" panel="commits" reducedMotion={reducedMotion}>
            <CommitsPanel commit={latestCommit} />
          </Slide>
        ) : (
          <Slide key="music" panel="music" reducedMotion={reducedMotion}>
            <MusicPanel
              track={track}
              progressPercent={progressPercent}
              loading={musicLoading}
              boosted={ambientBoosted}
            />
          </Slide>
        )}
      </AnimatePresence>
    </PillShell>
  )
}
