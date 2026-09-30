import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, MessageCircle } from 'lucide-react'
import siteConfig from '../data/siteConfig'
import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import { WhatsAppIcon } from './icons'
import { cx } from '../lib/format'

const { faqs, contact } = siteConfig

export default function FAQ() {
  const [open, setOpen] = useState(0)
  const btnRefs = useRef([])

  const onKeyDown = (e, i) => {
    const last = faqs.length - 1
    let target = null
    if (e.key === 'ArrowDown') target = i === last ? 0 : i + 1
    if (e.key === 'ArrowUp') target = i === 0 ? last : i - 1
    if (e.key === 'Home') target = 0
    if (e.key === 'End') target = last
    if (target !== null) {
      e.preventDefault()
      btnRefs.current[target]?.focus()
    }
  }

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative pb-24 pt-8 sm:pb-32">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionLabel>FAQ</SectionLabel>
              <h2 id="faq-title" className="display-xl mt-6">
                Good
                <br /> questions
              </h2>
              <p className="mt-6 max-w-sm text-lg font-medium leading-relaxed text-maroon/85">
                Everything pet parents usually ask before their first visit. Still curious? We reply fast.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 flex max-w-sm items-center gap-4 rounded-[28px] border-1.5 border-maroon bg-yellow p-5">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-maroon text-cream">
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-xl font-bold uppercase leading-none">Ask us anything</p>
                <a
                  href={`https://wa.me/${contact.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-bold underline-offset-4 hover:underline"
                >
                  <WhatsAppIcon className="h-4 w-4" /> {contact.whatsappDisplay}
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        <ul className="grid content-start gap-3 lg:col-span-7">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal as="li" key={f.q} delay={i * 0.05} amount={0.4}>
                <div className={cx('rounded-[26px] border-1.5 border-maroon transition-colors duration-300', isOpen ? 'bg-yellow' : 'bg-cream')}>
                  <h3>
                    <button
                      ref={(el) => (btnRefs.current[i] = el)}
                      type="button"
                      id={`faq-btn-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      onKeyDown={(e) => onKeyDown(e, i)}
                      className="flex w-full items-center justify-between gap-5 rounded-[26px] px-5 py-5 text-left sm:px-7 sm:py-6"
                    >
                      <span className="font-display text-[1.2rem] font-bold uppercase leading-tight sm:text-[1.45rem]">{f.q}</span>
                      <span
                        className={cx(
                          'grid h-10 w-10 shrink-0 place-items-center rounded-full border-1.5 border-maroon transition-[transform,background-color,color] duration-500',
                          isOpen ? 'rotate-45 bg-maroon text-yellow' : ''
                        )}
                        aria-hidden="true"
                      >
                        <Plus className="h-5 w-5" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl px-5 pb-6 text-[1rem] font-medium leading-relaxed sm:px-7">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
