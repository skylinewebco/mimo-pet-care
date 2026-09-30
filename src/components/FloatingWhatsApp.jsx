import { motion } from 'framer-motion'
import siteConfig from '../data/siteConfig'
import { WhatsAppIcon } from './icons'
import useAvoidOverlap from '../hooks/useAvoidOverlap'

const { contact } = siteConfig
const message = encodeURIComponent('Hi Mimo! I have a question about grooming for my pet 🐾')

export default function FloatingWhatsApp() {
  const hide = useAvoidOverlap(['#booking-card', 'footer form', '#faq'])
  return (
    <motion.a
      href={`https://wa.me/${contact.whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Mimo on WhatsApp"
      className="group fixed bottom-4 right-4 z-[80] grid h-14 w-14 place-items-center rounded-full border-1.5 border-maroon bg-green text-white shadow-[0_6px_0_0_#6E261F] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      initial={{ scale: 0, opacity: 0 }}
      animate={hide ? { scale: 0.4, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: hide ? 0 : 0.2 }}
      style={{ pointerEvents: hide ? 'none' : undefined }}
      tabIndex={hide ? -1 : undefined}
      whileHover={{ scale: 1.08, rotate: -6 }}
      whileTap={{ scale: 0.94 }}
    >
      <span className="animate-wa-pulse absolute inset-0 rounded-full bg-green" aria-hidden="true" />
      <WhatsAppIcon className="relative h-7 w-7 sm:h-8 sm:w-8" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border-1.5 border-maroon bg-cream px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-maroon opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
        Chat with us
      </span>
    </motion.a>
  )
}
