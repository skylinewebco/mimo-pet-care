import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import siteConfig from '../data/siteConfig'
import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import BeforeAfter from './BeforeAfter'
import SmartImage from './SmartImage'
import { cx } from '../lib/format'

const { gallery } = siteConfig
const SPAN = {
  square: 'row-span-2',
  tall: 'row-span-3',
  wide: 'col-span-2 row-span-2',
}

export default function Gallery() {
  const [filter, setFilter] = useState('all')
  const items = gallery.items.filter((g) => filter === 'all' || g.category === filter)

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative pb-24 pt-8 sm:pb-32">
      <div className="container-x">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectionLabel>Our work</SectionLabel>
            <h2 id="gallery-title" className="display-xl mt-6">
              Fresh from
              <br /> the salon
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-pretty text-lg font-medium leading-relaxed text-maroon/85">
              Drag the sliders to see the glow-up. Every pet here left with a clean coat, clipped nails and a very smug expression.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-6 lg:mt-16">
          {gallery.beforeAfter.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.1} className={i === 1 ? 'md:mt-16' : ''}>
              <BeforeAfter item={item} />
            </Reveal>
          ))}
        </div>

        <div className="mt-20 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-display text-3xl font-bold uppercase sm:text-4xl">The Mimo lookbook</h3>
          <div
            role="group"
            aria-label="Filter gallery"
            className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] py-1 sm:mx-0 sm:px-0"
          >
            {gallery.filters.map((f) => {
              const active = filter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={cx(
                    'relative isolate shrink-0 rounded-full border-1.5 border-maroon px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide transition-colors duration-300',
                    active ? 'text-cream' : 'hover:bg-maroon/10'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="gallery-filter"
                      className="absolute inset-0 -z-[1] rounded-full bg-maroon"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        <ul className="mt-8 grid grid-flow-dense auto-rows-[clamp(78px,11vw,150px)] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((g) => (
              <motion.li
                key={g.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                className={cx('group relative overflow-hidden rounded-[26px] border-1.5 border-maroon bg-cream', SPAN[g.shape])}
              >
                <SmartImage
                  src={g.image}
                  alt={g.alt}
                  sizes={g.shape === 'wide' ? '(max-width:768px) 92vw, 50vw' : '(max-width:768px) 46vw, 25vw'}
                  widths={[360, 600, 900]}
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute inset-x-2.5 bottom-2.5 translate-y-[140%] rounded-full bg-cream/95 px-3 py-1.5 text-center text-[0.7rem] font-extrabold uppercase tracking-[0.12em] transition-transform duration-500 group-hover:translate-y-0 group-focus-within:translate-y-0 sm:inset-x-auto sm:left-3 sm:text-left">
                  {g.caption}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  )
}
