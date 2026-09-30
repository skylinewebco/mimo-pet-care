import { motion } from 'framer-motion'
import { MapPin, Navigation, Check, ArrowRight } from 'lucide-react'
import siteConfig from '../data/siteConfig'
import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import SmartImage from './SmartImage'
import { GroomingVan } from './icons'
import { prefillBooking } from '../lib/bookingBus'
import useReducedMotion from '../hooks/useReducedMotion'

const { mobile, contact } = siteConfig

export default function MobileGrooming() {
  const reduced = useReducedMotion()
  return (
    <section id="mobile" aria-labelledby="mobile-title" className="relative overflow-hidden pb-24 pt-8 sm:pb-32">
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          {/* Headline + van */}
          <div className="relative lg:col-span-7">
            <Reveal>
              <SectionLabel>Mobile grooming</SectionLabel>
            </Reveal>
            <h2 id="mobile-title" className="mt-6 font-display font-bold uppercase leading-[0.84] text-[clamp(3.6rem,11.5vw,10.5rem)]">
              <Reveal as="span" className="block">We come</Reveal>
              <Reveal as="span" delay={0.08} className="block pl-[0.9em] text-white [-webkit-text-stroke:2px_var(--maroon)] sm:[-webkit-text-stroke:3px_var(--maroon)]">
                to you
              </Reveal>
            </h2>
            <motion.div
              className="relative mt-4 w-[92%] max-w-[540px] sm:mt-6 lg:ml-[20%]"
              initial={{ x: reduced ? 0 : '-60vw', opacity: reduced ? 0 : 1 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: 'spring', stiffness: 60, damping: 16, mass: 1.2 }}
            >
              <GroomingVan className="h-auto w-full" wheelsSpin={!reduced} />
            </motion.div>
          </div>

          {/* Photo + details */}
          <div className="relative lg:col-span-5 lg:pt-16">
            <Reveal className="relative ml-auto w-[78%] max-w-[380px] sm:w-[60%] lg:w-[82%]">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-[5deg] rounded-[32px] border-1.5 border-maroon/25 bg-teal" aria-hidden="true" />
              <div className="relative aspect-[4/5] rotate-[2deg] overflow-hidden rounded-[32px] border-1.5 border-maroon bg-teal">
                <SmartImage src={mobile.image} alt={mobile.alt} sizes="(max-width:1024px) 70vw, 30vw" />
              </div>
              <motion.div
                className="absolute -left-10 bottom-8 grid h-32 w-32 place-items-center rounded-full border-1.5 border-maroon bg-yellow text-center shadow-[0_8px_0_0_#91352B] sm:-left-16 sm:h-36 sm:w-36"
                initial={{ rotate: -30, scale: 0.6, opacity: 0 }}
                whileInView={{ rotate: -12, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.3 }}
              >
                <span className="leading-none">
                  <span className="block font-display text-[2.6rem] font-bold">+${mobile.travelFee}</span>
                  <span className="mt-1 block text-[0.62rem] font-extrabold uppercase tracking-[0.16em]">travel fee</span>
                </span>
              </motion.div>
            </Reveal>
          </div>
        </div>

        {/* Info strip */}
        <div className="mt-12 grid gap-4 lg:mt-6 lg:grid-cols-12">
          <Reveal className="rounded-[32px] border-1.5 border-maroon bg-cream p-7 sm:p-9 lg:col-span-5">
            <p className="text-pretty font-display text-[1.7rem] font-semibold leading-tight">{mobile.text}</p>
            <ul className="mt-6 grid gap-3">
              {mobile.points.map((p) => (
                <li key={p} className="flex items-start gap-3 font-semibold">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-maroon text-cream">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="relative overflow-hidden rounded-[32px] border-1.5 border-maroon bg-maroon p-7 text-cream sm:p-9 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="eyebrow inline-flex items-center gap-2 text-cream/80">
                <Navigation className="h-4 w-4" aria-hidden="true" /> Service areas · Houston
              </p>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-cream/80">
                <MapPin className="h-4 w-4" aria-hidden="true" /> Home base: {contact.neighborhood}
              </p>
            </div>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {mobile.areas.map((a, i) => (
                <motion.li
                  key={a}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 + i * 0.06 }}
                  className="inline-flex items-center gap-2 rounded-full border-1.5 border-cream/60 px-4 py-2.5 font-display text-lg font-semibold uppercase tracking-wide transition-colors hover:bg-cream hover:text-maroon sm:text-xl"
                >
                  <MapPin className="h-4 w-4 text-yellow" aria-hidden="true" />
                  {a}
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-4 border-t border-cream/20 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-sm font-medium text-cream/80">
                Any salon service, at your door. Just add the ${mobile.travelFee} travel fee when you book.
              </p>
              <button
                type="button"
                onClick={() => prefillBooking({ location: 'mobile' })}
                className="btn-pill shrink-0 border-yellow bg-yellow text-maroon hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#6E261F]"
              >
                Book a mobile visit <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <svg viewBox="0 0 200 200" className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 text-cream/[0.07]" aria-hidden="true">
              <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="8" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="8" />
              <circle cx="100" cy="100" r="22" fill="currentColor" />
            </svg>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
