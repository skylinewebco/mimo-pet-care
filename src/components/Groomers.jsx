import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import siteConfig from '../data/siteConfig'
import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import SmartImage from './SmartImage'
import { cx, tileBg } from '../lib/format'

const ROTATE = [-2, 1.5, -1, 2]
const OFFSET = ['', 'lg:mt-16', 'lg:mt-4', 'lg:mt-20']

function GroomerCard({ person, index }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <motion.li
      className={cx('relative w-[78%] max-w-[320px] shrink-0 snap-center sm:w-auto sm:max-w-none', OFFSET[index])}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.article
        className="group relative h-full rounded-[32px] border-1.5 border-maroon bg-cream p-3 transition-shadow duration-500 hover:shadow-lift"
        style={{ rotate: ROTATE[index] }}
        whileHover={{ rotate: 0, y: -6 }}
        transition={{ type: 'spring', stiffness: 240, damping: 20 }}
      >
        <div className={cx('relative aspect-[4/5] overflow-hidden rounded-[24px]', tileBg[person.tile])}>
          <SmartImage src={person.image} alt={person.alt} sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 22vw" widths={[400, 600, 800]} />
          {/* Fun fact reveal */}
          <div
            className={cx(
              'absolute inset-x-2.5 bottom-2.5 rounded-[20px] border-1.5 border-maroon bg-yellow p-4 transition-[transform,opacity] duration-500 ease-out',
              flipped
                ? 'translate-y-0 opacity-100'
                : 'translate-y-[115%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100'
            )}
          >
            <p className="eyebrow inline-flex items-center gap-1.5 text-[0.62rem]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Fun fact
            </p>
            <p className="mt-1.5 text-sm font-semibold leading-snug">{person.funFact}</p>
          </div>
        </div>
        <div className="px-3 pb-3 pt-5">
          <p className="eyebrow text-[0.64rem] text-maroon/70">{person.role}</p>
          <h3 className="mt-1.5 font-display text-[1.75rem] font-bold uppercase leading-none">{person.name}</h3>
          <p className="mt-3 text-[0.93rem] font-medium leading-relaxed text-maroon/80">{person.bio}</p>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            aria-pressed={flipped}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border-1.5 border-maroon px-3.5 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-wider transition-colors hover:bg-maroon hover:text-cream"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {flipped ? 'Hide fun fact' : 'Fun fact'}
          </button>
        </div>
      </motion.article>
    </motion.li>
  )
}

export default function Groomers() {
  return (
    <section id="team" aria-labelledby="team-title" className="relative pb-24 pt-8 sm:pb-32">
      <div className="container-x">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectionLabel>The team</SectionLabel>
            <h2 id="team-title" className="display-xl mt-6">
              Meet our
              <br /> groomers
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-pretty text-lg font-medium leading-relaxed text-maroon/85">
              Certified, Fear Free trained and slightly obsessed with your pet. Hover or tap a card for the good gossip.
            </p>
          </Reveal>
        </div>
        <ul className="no-scrollbar -mx-[var(--gutter)] mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] py-4 sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:py-0 lg:mt-16 lg:grid-cols-4 lg:gap-5">
          {siteConfig.team.map((p, i) => (
            <GroomerCard key={p.id} person={p} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
