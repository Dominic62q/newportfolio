import { createContext, useState } from 'react'
import { shouldPlayIntro } from '../lib/motion'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [paletteOpen, setPaletteOpen] = useState(false)
  // False while the curtain preloader is up; hero choreography waits for it.
  const [introDone, setIntroDone] = useState(() => !shouldPlayIntro())

  return (
    <UIContext.Provider value={{ paletteOpen, setPaletteOpen, introDone, setIntroDone }}>
      {children}
    </UIContext.Provider>
  )
}

export { UIContext }
