import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import siteConfig from '../data/siteConfig'
import CloudDivider from './CloudDivider'
import { Bone, Paw, Sparkle } from './icons'
import useReducedMotion from '../hooks/useReducedMotion'

const { manifesto } = siteConfig

const FLOATERS = [
  { el: 'bubble', cls: 'left-[6%] top-[18%] h-10 w-10', d: 0 },
  { el: 'bubble', cls: 'left-[14%] bottom-[20%] h-5 w-5', d: 1.2 },
  { el: 'bubble', cls: 'right-[9%] top-[12%] h-7 w-7', d: 0.6 },
  { el: 'bubble', cls: 'right-[18%] bottom-[16%] h-12 w-12', d: 1.8 },
  { el: 'paw', cls: 'right-[5%] top-[46%] h-9 w-9 rotate-12 text-peach', d: 0.4 },
  { el: 'bone', cls: 'left-[4%] top-[55%] h-6 w-12 -rotate-12 text-yellow', d: 1 },
  { el: 'sparkle', cls: 'left-[26%] top-[8%] h-5 w-5 text-yellow', d: 0.8 },
  { el: 'sparkle', cls: 'right-[30%] bottom-[8%] h-4 w-4 text-teal', d: 2.1 },
]

function Floater({ el, cls, d, reduced }) {
  const inner =
    el === 'bubble' ? (
      <span className="block h-full w-full rounded-full border-1.5 border-maroon/25 bg-[radial-gradient(circle_at_30%_30%,#fff_0%,#fff_35%,#fbe9df_100%)]" />
    ) : el === 'paw' ? (
      <Paw className="h-full w-full" />
    ) : el === 'bone' ? (
      <Bone className="h-full w-full" />
    ) : (
      <Sparkle className="h-full w-full" />
    )
  return (
    <motion.span
      aria-hidden="true"
      className={`absolute hidden sm:block ${cls}`}
      animate={reduced ? undefined : { y: [0, -14, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: d }}
    >
      {inner}
    </motion.span>
  )
}

export default function CloudBanner() {
  const reduced = useReducedMotion()
  const words1 = manifesto.lines[0].split(' ')
  const words2 = manifesto.lines[1].split(' ')
  const highlight = words2.pop()
  return (
    <section aria-labelledby="manifesto-title" className="relative">
      <CloudDivider fill="#FFFFFF" />
      <div className="relative overflow-hidden bg-white py-16 sm:py-24">
        {FLOATERS.map((f, i) => (
          <Floater key={i} {...f} reduced={reduced} />
        ))}
        <div className="container-x relative text-center">
          <h2 id="manifesto-title" className="display-xl mx-auto max-w-[16ch] text-balance !leading-[0.95] sm:max-w-none">
            <span className="block">
              {words1.map((w, i) => (
                <motion.span
                  key={i}
                  className="mr-[0.22em] inline-block last:mr-0"
                  initial={{ opacity: 0, y: '0.4em' }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <motion.span
              className="mt-2 inline-flex flex-wrap items-center justify-center gap-x-[0.22em]"
              initial={{ opacity: 0, y: '0.4em' }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>{words2.join(' ')}</span>
              <span className="relative inline-flex items-center rounded-full bg-yellow px-[0.28em] pb-[0.02em] pt-[0.08em]">
                {highlight}
                <motion.span
                  className="absolute -right-[0.18em] -top-[0.22em] grid h-[0.62em] w-[0.62em] place-items-center rounded-full bg-maroon text-white"
                  animate={reduced ? undefined : { scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                >
                  <Heart className="h-[55%] w-[55%] fill-current" />
                </motion.span>
              </span>
            </motion.span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-pretty text-lg font-medium leading-relaxed text-maroon/80">{manifesto.sub}</p>

          <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-3 sm:gap-6">
            {manifesto.stats.map((s) => (
              <div key={s.label} className="rounded-[26px] border-1.5 border-maroon bg-peach/40 px-3 py-5 sm:py-6">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-[clamp(1.8rem,5vw,3.25rem)] font-bold leading-none">{s.value}</dd>
                <dd className="mt-2 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-maroon/70 sm:text-xs">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <CloudDivider fill="#FFFFFF" flip bubbles={false} />
    </section>
  )
}
