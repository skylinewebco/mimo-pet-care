import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

/** True when the visitor asked the OS for reduced motion. */
export default function useReducedMotion() {
  return Boolean(useFramerReducedMotion())
}
