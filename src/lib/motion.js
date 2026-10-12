// Shared motion constants and capability checks.

export const EASE_OUT = [0.16, 1, 0.3, 1]
export const EASE_SOFT = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT = [0.76, 0, 0.24, 1]

export const INTRO_KEY = 'intro-seen'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function hasFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

// The curtain preloader plays once per browser session, and never for reduced motion.
export function shouldPlayIntro() {
  if (prefersReducedMotion()) return false
  try {
    return sessionStorage.getItem(INTRO_KEY) !== '1'
  } catch {
    return true
  }
}

// "Things I've *built.*" -> [{ text: 'Things', em: false }, ..., { text: 'built.', em: true }]
export function parseEmphasis(source) {
  const words = []
  const pattern = /\*([^*]+)\*|(\S+)/g
  let match
  while ((match = pattern.exec(source))) {
    if (match[1]) {
      match[1].split(/\s+/).forEach((text) => words.push({ text, em: true }))
    } else {
      words.push({ text: match[2], em: false })
    }
  }
  return words
}

export function plainText(source) {
  return source.replace(/\*/g, '')
}
