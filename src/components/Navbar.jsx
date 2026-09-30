import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Phone } from 'lucide-react'
import siteConfig from '../data/siteConfig'
import { LogoMark, Paw } from './icons'
import { getLenis, handleAnchorClick } from '../lib/scroll'
import { cx } from '../lib/format'

const { business, nav, contact, social } = siteConfig

export function Logo({ light = false, onClick }) {
  return (
    <a
      href="#top"
      onClick={(e) => handleAnchorClick(e, '#top', onClick)}
      className={cx('group flex items-center gap-2.5', light ? 'text-cream' : 'text-maroon')}
      aria-label={`${business.name} — back to top`}
    >
      <LogoMark className="h-9 w-9 transition-transform duration-500 group-hover:-rotate-12" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.45rem] font-bold tracking-wide">{business.shortName}</span>
        <span className="mt-0.5 text-[0.55rem] font-extrabold tracking-[0.2em] opacity-80">{business.logoSubline}</span>
      </span>
    </a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    if (open) {
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const close = () => setOpen(false)

  return (
    <>
      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[200] rounded-full bg-maroon px-5 py-3 font-bold text-white">
        Skip to content
      </a>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[90] px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6">
        <nav
          aria-label="Main"
          className={cx(
            'pointer-events-auto mx-auto flex max-w-[1440px] items-center justify-between rounded-full border-1.5 py-2.5 pl-4 pr-2.5 transition-[background-color,border-color,box-shadow,padding] duration-500 sm:pl-6 lg:py-3 lg:pl-8 lg:pr-3',
            scrolled && !open
              ? 'border-maroon/15 bg-peach/75 shadow-soft backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          )}
        >
          <div className={cx('transition-opacity duration-300', open && 'pointer-events-none opacity-0')}>
            <Logo />
          </div>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="group relative rounded-full px-4 py-2 text-[0.95rem] font-semibold transition-colors hover:bg-maroon/[0.07]"
                >
                  {item.label}
                  <span className="absolute inset-x-4 bottom-1 h-[2px] origin-left scale-x-0 rounded-full bg-maroon transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#booking"
              onClick={(e) => handleAnchorClick(e, '#booking')}
              className="btn-solid hidden !px-6 !py-3 text-sm sm:inline-flex"
            >
              Book now
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={cx(
                'relative z-[95] grid h-12 w-12 place-items-center rounded-full transition-[transform,background-color,color] duration-300 active:scale-95 lg:hidden',
                open ? 'bg-cream text-maroon' : 'bg-maroon text-cream'
              )}
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={cx(
                    'absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current transition-transform duration-300',
                    open && 'translate-y-[6px] rotate-45'
                  )}
                />
                <span
                  className={cx(
                    'absolute left-0 top-[6px] h-[2px] w-3.5 rounded-full bg-current transition-opacity duration-200',
                    open && 'opacity-0'
                  )}
                />
                <span
                  className={cx(
                    'absolute left-0 top-[12px] h-[2px] w-5 rounded-full bg-current transition-transform duration-300',
                    open && '-translate-y-[6px] -rotate-45'
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[85] flex flex-col overflow-y-auto bg-maroon text-cream lg:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 44px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 44px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 44px)' }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <div className="flex h-[88px] items-center px-7 pt-3">
              <Logo light onClick={close} />
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-1 px-7 py-6">
              {[...nav, { label: 'Book now', href: '#booking' }].map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.a
                    href={item.href}
                    onClick={(e) => handleAnchorClick(e, item.href, close)}
                    className="group flex items-baseline gap-4 py-1 font-display text-[clamp(2.6rem,12vw,4.5rem)] font-bold uppercase leading-[1.02]"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%', transition: { duration: 0.25 } }}
                    transition={{ delay: 0.18 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="text-sm font-body font-bold tracking-widest text-cream/50">0{i + 1}</span>
                    <span className={cx('transition-colors group-hover:text-yellow', item.href === '#booking' && 'text-yellow')}>
                      {item.label}
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="grid gap-4 border-t border-cream/20 px-7 py-7 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <a href={contact.phoneHref} className="inline-flex items-center gap-2 font-bold">
                <Phone className="h-4 w-4" /> {contact.phoneDisplay}
              </a>
              <p className="text-cream/75">
                {contact.addressLine1}, {contact.addressLine2}
              </p>
              <div className="flex flex-wrap gap-2">
                {social.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-cream/40 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider"
                  >
                    {s.label} <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </motion.div>
            <Paw className="pointer-events-none absolute -right-10 bottom-24 h-56 w-56 rotate-12 text-cream/[0.06]" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
