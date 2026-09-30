import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenis } from '../lib/scroll'

/** Boots Lenis smooth scrolling (skipped for reduced-motion users). */
export default function useLenis(disabled) {
  useEffect(() => {
    if (disabled) return
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })
    setLenis(lenis)
    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [disabled])
}
