import { motion } from 'framer-motion'

/** Fade + rise when scrolled into view (framer handles reduced motion via MotionConfig). */
export default function Reveal({ children, delay = 0, y = 28, className = '', as = 'div', amount = 0.25, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
