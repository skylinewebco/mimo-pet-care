import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ArrowRight, Crown } from 'lucide-react'
import siteConfig from '../data/siteConfig'
import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import { prefillBooking } from '../lib/bookingBus'
import { cx } from '../lib/format'

const { packages, petTypes } = siteConfig

const STYLES = {
  basic: { card: 'bg-cream text-maroon', check: 'bg-maroon text-cream', btn: 'btn-ghost', rotate: -1.5 },
  'full-spa': { card: 'bg-yellow text-maroon lg:-mt-6 lg:mb-6', check: 'bg-maroon text-yellow', btn: 'btn-solid', rotate: 0 },
  'premium-royal': { card: 'bg-maroon text-cream', check: 'bg-cream text-maroon', btn: 'btn-pill border-cream bg-cream text-maroon hover:bg-yellow hover:border-yellow', rotate: 1.5 },
}

export default function Pricing() {
  const [pet, setPet] = useState('dog')
  const list = packages[pet]

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative px-2 pb-20 sm:px-3 lg:px-4">
      <div className="relative overflow-hidden rounded-[32px] border-1.5 border-maroon/15 bg-cream/60 py-16 sm:rounded-[44px] sm:py-24">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <Reveal>
              <SectionLabel>Packages</SectionLabel>
              <h2 id="pricing-title" className="display-xl mt-6">
                Pick your
                <br />
                pamper plan
              </h2>
            </Reveal>

            <Reveal delay={0.1} className="w-full lg:w-auto">
              <div
                role="radiogroup"
                aria-label="Choose pet type"
                className="relative grid w-full grid-cols-3 rounded-full border-1.5 border-maroon bg-peach p-1.5 lg:w-[480px]"
              >
                {petTypes.map((p) => {
                  const active = pet === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPet(p.id)}
                      onKeyDown={(e) => {
                        const idx = petTypes.findIndex((x) => x.id === pet)
                        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                          e.preventDefault()
                          const next = petTypes[(idx + (e.key === 'ArrowRight' ? 1 : petTypes.length - 1)) % petTypes.length]
                          setPet(next.id)
                          e.currentTarget.parentElement.querySelectorAll('button')[petTypes.indexOf(next)].focus()
                        }
                      }}
                      tabIndex={active ? 0 : -1}
                      className={cx(
                        'relative z-[1] rounded-full px-2 py-3 font-display text-sm font-bold uppercase tracking-wide transition-colors duration-300 sm:text-base',
                        active ? 'text-cream' : 'text-maroon hover:text-maroon-soft'
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="pet-toggle"
                          className="absolute inset-0 -z-[1] rounded-full bg-maroon"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      {p.label}
                    </button>
                  )
                })}
              </div>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-20 lg:gap-6">
            {list.map((pkg, i) => {
              const st = STYLES[pkg.id]
              return (
                <motion.article
                  key={pkg.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8, rotate: 0 }}
                  style={{ rotate: st.rotate }}
                  className={cx('relative flex flex-col rounded-[32px] border-1.5 border-maroon p-7 transition-shadow duration-500 hover:shadow-lift sm:p-8', st.card)}
                >
                  {pkg.popular && (
                    <span className="absolute -top-4 left-7 inline-flex items-center gap-1.5 rounded-full border-1.5 border-maroon bg-maroon px-4 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-yellow">
                      <Crown className="h-3.5 w-3.5" aria-hidden="true" /> Most popular
                    </span>
                  )}
                  <h3 className="font-display text-[clamp(2rem,3.4vw,2.9rem)] font-bold uppercase leading-[0.95]">{pkg.name}</h3>
                  <p className="mt-2 text-sm font-semibold opacity-80">{pkg.blurb}</p>

                  <div className="mt-8 flex items-end gap-2 border-b-1.5 pb-7" style={{ borderColor: 'color-mix(in srgb, currentColor 22%, transparent)' }}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={`${pet}-${pkg.price}`}
                        className="font-display text-[4.25rem] font-bold leading-[0.8]"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                      >
                        ${pkg.price}
                      </motion.span>
                    </AnimatePresence>
                    <span className="pb-1 text-sm font-bold opacity-70">{pkg.unit}</span>
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.ul
                      key={pet}
                      className="mt-7 grid gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                    >
                      {pkg.includes.map((inc) => (
                        <li key={inc} className="flex items-start gap-3 text-[0.97rem] font-semibold">
                          <span className={cx('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full', st.check)}>
                            <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                          </span>
                          {inc}
                        </li>
                      ))}
                    </motion.ul>
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={() => prefillBooking({ petType: pet, packageId: pkg.id })}
                    className={cx(st.btn, 'mt-auto w-full justify-between !pt-3.5 !pb-3.5')}
                    style={{ marginTop: 36 }}
                  >
                    Book {pkg.name}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </motion.article>
              )
            })}
          </div>
          <p className="mt-10 text-center text-sm font-semibold text-maroon/70">
            Prices shown for Houston salon visits. Large breeds & heavy matting may vary · First visit 25% off.
          </p>
        </div>
      </div>
    </section>
  )
}
