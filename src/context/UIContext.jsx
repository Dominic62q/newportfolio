import { createContext, useCallback, useEffect, useRef, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [snakeOpen, setSnakeOpen] = useState(false)
  const [ambientBoosted, setAmbientBoosted] = useState(false)
  const boostTimerRef = useRef(null)

  const boostAmbient = useCallback(() => {
    setAmbientBoosted(true)
    window.clearTimeout(boostTimerRef.current)
    boostTimerRef.current = window.setTimeout(() => {
      setAmbientBoosted(false)
    }, 5_000)
  }, [])

  useEffect(() => () => window.clearTimeout(boostTimerRef.current), [])

  return (
    <UIContext.Provider
      value={{
        terminalOpen,
        setTerminalOpen,
        paletteOpen,
        setPaletteOpen,
        snakeOpen,
        setSnakeOpen,
        ambientBoosted,
        boostAmbient,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export { UIContext }
