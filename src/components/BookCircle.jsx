import { motion } from 'framer-motion'
import { Paw } from './icons'
import { handleAnchorClick } from '../lib/scroll'
import { cx } from '../lib/format'

/**
 * The big circular "BOOK NOW" object with a slowly rotating text ring.
 * Renders as an anchor (to #booking) or a button when onClick is given.
 */
export default function BookCircle({
  label = 'BOOK NOW',
  ring = 'BOOK NOW • BOOK NOW • BOOK NOW • ',
  href = '#booking',
  onClick,
  className = '',
  tone = 'maroon',
}) {
  const Tag = onClick ? motion.button : motion.a
  const ringId = `ring-${label.replace(/\W/g, '')}`
  const dark = tone === 'maroon'
  return (
    <Tag
      {...(onClick ? { type: 'button', onClick } : { href, onClick: (e) => handleAnchorClick(e, href) })}
      aria-label={label}
      className={cx(
        'group relative grid aspect-square place-items-center rounded-full font-display font-bold uppercase',
        dark ? 'bg-maroon text-white shadow-[0_10px_0_0_#6E261F]' : 'bg-yellow text-maroon shadow-[0_10px_0_0_#91352B] border-1.5 border-maroon',
        className
      )}
      whileHover={{ scale: 1.05, rotate: [0, -4, 3, -1, 0], transition: { rotate: { duration: 0.6 }, scale: { type: 'spring', stiffness: 300, damping: 15 } } }}
      whileTap={{ scale: 0.96, y: 6 }}
    >
      <svg viewBox="0 0 200 200" className="animate-spin-slow absolute inset-[7%] h-[86%] w-[86%]" aria-hidden="true">
        <defs>
          <path id={ringId} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fontSize="16" fontWeight="700" letterSpacing="6.1" fill={dark ? 'var(--cream)' : 'var(--maroon)'} fontFamily="Fredoka, sans-serif" opacity="0.8">
          <textPath href={`#${ringId}`}>{ring}</textPath>
        </text>
      </svg>
      <span className="relative flex flex-col items-center gap-1 text-[clamp(1rem,1.6vw,1.35rem)] leading-none tracking-wide">
        <Paw className="h-5 w-5 transition-transform duration-500 group-hover:rotate-[20deg]" />
        {label}
      </span>
    </Tag>
  )
}
