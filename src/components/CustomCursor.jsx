import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Paw } from './icons'
import useReducedMotion from '../hooks/useReducedMotion'

const INTERACTIVE = 'a, button, [role="button"], [role="radio"], [role="checkbox"], [role="tab"], label, summary, input[type="range"]'

/** Tiny paw cursor for fine pointers only. Grows over interactive elements. */
export default function CustomCursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(false)
  const [down, setDown] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 900, damping: 50, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 900, damping: 50, mass: 0.35 })

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setEnabled(mq.matches && !reduced)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-paw-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const over = (e) => {
      const el = e.target.closest?.(INTERACTIVE)
      const field = e.target.closest?.('input:not([type="range"]), textarea, select, iframe')
      setHover(Boolean(el) && !field)
      setVisible(!field)
    }
    const leave = () => setVisible(false)
    const md = () => setDown(true)
    const mu = () => setDown(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('mouseleave', leave)
    window.addEventListener('pointerdown', md)
    window.addEventListener('pointerup', mu)
    return () => {
      root.classList.remove('has-paw-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('mouseleave', leave)
      window.removeEventListener('pointerdown', md)
      window.removeEventListener('pointerup', mu)
    }
  }, [enabled]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[400]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-ml-[14px] -mt-[14px] grid h-7 w-7 place-items-center rounded-full border-1.5 border-maroon bg-yellow/90 text-maroon"
        animate={{
          scale: down ? 0.8 : hover ? 1.7 : 1,
          opacity: visible ? 1 : 0,
          backgroundColor: hover ? 'rgba(251,224,122,0.55)' : 'rgba(251,224,122,0.95)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      >
        <Paw className="h-3.5 w-3.5" />
      </motion.div>
    </motion.div>
  )
}
