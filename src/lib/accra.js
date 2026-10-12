import { useEffect, useState } from 'react'

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Accra',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function snapshot() {
  const parts = timeFormat.formatToParts(new Date())
  const hour = Number(parts.find((p) => p.type === 'hour').value)
  const minute = parts.find((p) => p.type === 'minute').value
  return { label: `${String(hour).padStart(2, '0')}:${minute}`, hour }
}

// Live Accra wall-clock (GMT, no DST). Ticks every 15s; minute precision is enough.
export function useAccraClock() {
  const [now, setNow] = useState(snapshot)

  useEffect(() => {
    const id = window.setInterval(() => setNow(snapshot()), 15_000)
    return () => window.clearInterval(id)
  }, [])

  return now
}
