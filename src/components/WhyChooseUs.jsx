import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, ShieldCheck, HeartHandshake, CalendarCheck } from 'lucide-react'
import siteConfig from '../data/siteConfig'
import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import { cx } from '../lib/format'

const ICONS = [Award, ShieldCheck, HeartHandshake, CalendarCheck]
// Staggered vertical offsets + slight rotations so the row never reads as a flat grid.
const OFFSETS = ['lg:mt-0', 'lg:mt-14', 'lg:mt-6', 'lg:mt-20']
const SHAPES = ['rounded-[32px]', 'rounded-[32px] lg:rounded-tl-[72px]', 'rounded-[32px]', 'rounded-[32px] lg:rounded-br-[72px]']

export default function WhyChooseUs() {
  const [active, setActive] = useState(2)

  return (
    <section id="about" aria-labelledby="why-title" className="relative pb-24 pt-20 sm:pt-28 lg:pb-32">
      <div className="container-x">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectionLabel>Advantages</SectionLabel>
            <h2 id="why-title" className="display-xl mt-6">
              Why choose <span className="relative inline-block">us<svg viewBox="0 0 120 20" className="absolute -bottom-2 left-0 w-full" aria-hidden="true"><path d="M3 14c30-10 80-12 114-4" stroke="var(--yellow)" strokeWidth="7" strokeLinecap="round" fill="none" /></svg></span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-pretty text-lg font-medium leading-relaxed text-maroon/85">
              Grooming is more than a haircut. It’s trust, patience and a salon that feels as calm as your living room — just with better shampoo.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-5" onMouseLeave={() => setActive(2)}>
          {siteConfig.advantages.map((item, i) => {
            const Icon = ICONS[i]
            const isActive = active === i
            return (
              <motion.li
                key={item.number}
                className={cx('relative', OFFSETS[i])}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.article
                  tabIndex={0}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  animate={{ y: isActive ? -8 : 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  className={cx(
                    'relative flex h-full min-h-[250px] flex-col border-1.5 border-maroon bg-cream p-6 transition-shadow duration-500 sm:min-h-[290px] lg:p-7',
                    SHAPES[i],
                    isActive ? 'shadow-lift' : 'shadow-none'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="why-highlight"
                      className={cx('absolute inset-0 bg-yellow', SHAPES[i])}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex items-start justify-between">
                    <span className="font-display text-5xl font-bold leading-none text-maroon/20">{item.number}</span>
                    <span
                      className={cx(
                        'grid h-12 w-12 place-items-center rounded-full border-1.5 border-maroon transition-colors duration-300',
                        isActive ? 'bg-maroon text-yellow' : 'bg-transparent'
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <motion.div className="relative mt-auto pt-10" animate={{ x: isActive ? 4 : 0 }} transition={{ duration: 0.4 }}>
                    <h3 className="font-display text-[1.6rem] font-bold uppercase leading-[1.02]">{item.title}</h3>
                    <p className="mt-3 text-[0.95rem] font-medium leading-relaxed text-maroon/80">{item.text}</p>
                  </motion.div>
                </motion.article>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
