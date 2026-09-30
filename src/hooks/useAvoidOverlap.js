import { useEffect, useState } from 'react'

/**
 * On small screens, returns true while any of the given elements is on screen,
 * so floating buttons can step aside instead of covering form controls.
 */
export default function useAvoidOverlap(selectors, maxWidth = 767) {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`)
    const visible = new Set()
    let io
    const setup = () => {
      io?.disconnect()
      visible.clear()
      setHidden(false)
      if (!mq.matches) return
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)))
          setHidden(visible.size > 0)
        },
        { rootMargin: '0px 0px -8% 0px' }
      )
      selectors.forEach((s) => document.querySelectorAll(s).forEach((el) => io.observe(el)))
    }
    setup()
    mq.addEventListener('change', setup)
    return () => {
      io?.disconnect()
      mq.removeEventListener('change', setup)
    }
  }, [maxWidth]) // eslint-disable-line react-hooks/exhaustive-deps
  return hidden
}
