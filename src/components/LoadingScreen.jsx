import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Paw } from './icons'

/**
 * Lightweight loader: stays only until fonts are ready (hard cap 1.2s),
 * then lifts away. Never adds artificial delay beyond a tiny minimum
 * that prevents a flash.
 */
export default function LoadingScreen({ onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let finished = false
    const start = performance.now()
    const finish = () => {
      if (finished) return
      finished = true
      const wait = Math.max(0, 350 - (performance.now() - start))
      setTimeout(() => setVisible(false), wait)
    }
    const cap = setTimeout(finish, 1200)
    ;(document.fonts?.ready || Promise.resolve()).then(finish)
    return () => clearTimeout(cap)
  }, [])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[300] grid place-items-center bg-maroon"
          initial={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0% round 0px 0px 48px 48px)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading Mimo Pet Care"
        >
          <div className="flex items-end gap-3 text-cream">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="block"
                style={{ rotate: i % 2 ? 18 : -12 }}
                animate={{ y: [0, -18, 0], opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.14, ease: 'easeInOut' }}
              >
                <Paw className="h-8 w-8" />
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
