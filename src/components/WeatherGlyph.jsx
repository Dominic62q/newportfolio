import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Sun } from 'lucide-react'

const RAIN = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86]

// WMO weather code -> icon.
export default function WeatherGlyph({ code, className }) {
  if (code === 0) return <Sun className={className} aria-hidden="true" />
  if ([1, 2].includes(code)) return <CloudSun className={className} aria-hidden="true" />
  if ([45, 48].includes(code)) return <CloudFog className={className} aria-hidden="true" />
  if (RAIN.includes(code)) return <CloudRain className={className} aria-hidden="true" />
  if ([95, 96, 99].includes(code)) return <CloudLightning className={className} aria-hidden="true" />
  return <Cloud className={className} aria-hidden="true" />
}
