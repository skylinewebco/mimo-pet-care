import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import siteConfig from '../data/siteConfig'
import PetTile from './PetTile'
import BookCircle from './BookCircle'
import { Sparkle } from './icons'

const { hero, business, heroPets } = siteConfig
const [yellowPet, tealPet, greenPet, creamPet] = heroPets

function GiantLine({ text, ready, lineIndex, className = '' }) {
  return (
    <span className={`block whitespace-nowrap ${className}`} aria-hidden="true">
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          initial={{ y: '0.55em', opacity: 0, rotate: i % 2 ? 7 : -7, scale: 0.9 }}
          animate={ready ? { y: 0, opacity: 1, rotate: 0, scale: 1 } : undefined}
          transition={{ type: 'spring', stiffness: 260, damping: 14, mass: 0.9, delay: 0.1 + lineIndex * 0.18 + i * 0.045 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

const fade = (ready, delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: ready ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero({ ready }) {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative bg-maroon p-2 sm:p-3 lg:p-4">
      <div className="paper-grain relative overflow-hidden rounded-[26px] bg-peach sm:rounded-[34px] lg:rounded-[44px]">
        <div className="hero-inner relative mx-auto max-w-[1680px] px-[var(--gutter)] pb-10 pt-28 sm:pt-32 lg:pb-12 lg:pt-32">
          <h1 id="hero-title" className="sr-only">
            {business.name} — Pet grooming in Houston
          </h1>

          {/* ── Row 1: eyebrow · PET · small tile ───────────────── */}
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-0">
            <motion.p
              {...fade(ready, 0.2)}
              className="eyebrow max-w-[17rem] self-end text-right text-[0.7rem] leading-[1.55] sm:text-[0.78rem] lg:mt-3 lg:w-[24%] lg:max-w-none lg:self-start lg:pr-8 lg:text-left"
            >
              {business.eyebrow}
              <span className="mt-4 hidden items-center gap-2 text-maroon/70 lg:flex">
                <Sparkle className="h-3.5 w-3.5" /> Est. 2016 · Houston
              </span>
            </motion.p>

            <div className="hero-giant font-display font-bold uppercase leading-[0.8] text-white lg:ml-[-0.04em]">
              <GiantLine text={hero.titleLines[0]} ready={ready} lineIndex={0} />
            </div>

            <div className="hidden flex-1 justify-end pt-2 lg:flex">
              <PetTile
                pet={creamPet}
                ready={ready}
                index={3}
                rotate={7}
                className="aspect-square w-[clamp(150px,13vw,230px)]"
                sizes="14vw"
              />
            </div>
          </div>

          {/* ── Row 2: GROOMING (full bleed) ───────────────────── */}
          <div className="hero-giant relative z-[1] -mt-[0.02em] font-display font-bold uppercase leading-[0.8] text-white">
            <GiantLine text={hero.titleLines[1]} ready={ready} lineIndex={1} className="-ml-[0.04em]" />
          </div>

          {/* ── Row 3: tiles · copy · CTA ──────────────────────── */}
          {/* Desktop composition */}
          <div className="relative mt-6 hidden grid-cols-12 items-start gap-6 lg:grid">
            <PetTile
              pet={yellowPet}
              ready={ready}
              index={0}
              rotate={-5}
              eager
              className="col-span-3 -mt-[2.5vw] aspect-square w-full max-w-[300px]"
              sizes="22vw"
            />
            <div className="col-span-4 col-start-4 pt-4 xl:pl-6">
              <motion.p {...fade(ready, 0.45)} className="max-w-[26rem] text-pretty text-[1.2rem] font-semibold leading-[1.45] xl:text-[1.35rem]">
                {business.tagline}
              </motion.p>
              <motion.p {...fade(ready, 0.55)} className="mt-5 inline-flex items-center gap-2 rounded-full border-1.5 border-maroon/30 px-4 py-2 text-sm font-semibold">
                <MapPin className="h-4 w-4" aria-hidden="true" /> {hero.note}
              </motion.p>
            </div>
            <motion.div
              className="col-span-2 col-start-8 -mt-2 flex justify-center"
              initial={{ scale: 0.4, opacity: 0, rotate: -40 }}
              animate={ready ? { scale: 1, opacity: 1, rotate: 0 } : undefined}
              transition={{ type: 'spring', stiffness: 150, damping: 14, delay: 0.75 }}
            >
              <BookCircle label={hero.ctaLabel} ring={hero.ringText} className="w-[clamp(150px,12.5vw,210px)]" />
            </motion.div>
            <div className="relative col-span-3 col-start-10 h-full">
              <PetTile
                pet={tealPet}
                ready={ready}
                index={1}
                rotate={4}
                eager
                className="relative z-[2] ml-auto aspect-square w-[82%] max-w-[260px] -mt-[5vw]"
                sizes="18vw"
              />
              <PetTile
                pet={greenPet}
                ready={ready}
                index={2}
                rotate={-6}
                className="absolute -left-[46%] top-[42%] z-[1] aspect-square w-[64%] max-w-[210px]"
                sizes="14vw"
              />
            </div>
          </div>

          {/* Mobile / tablet composition */}
          <div className="lg:hidden">
            <motion.p {...fade(ready, 0.45)} className="mt-6 max-w-[30rem] text-pretty text-[1.05rem] font-semibold leading-[1.5] sm:text-lg">
              {business.tagline}
            </motion.p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
              <PetTile pet={yellowPet} ready={ready} index={0} rotate={-3} eager className="aspect-square" sizes="(max-width:768px) 45vw, 22vw" showTag={false} />
              <PetTile pet={tealPet} ready={ready} index={1} rotate={3} eager className="aspect-square" sizes="(max-width:768px) 45vw, 22vw" showTag={false} />
              <PetTile pet={greenPet} ready={ready} index={2} rotate={2} className="aspect-square" sizes="(max-width:768px) 45vw, 22vw" showTag={false} />
              <motion.div
                className="grid place-items-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={ready ? { scale: 1, opacity: 1 } : undefined}
                transition={{ type: 'spring', stiffness: 160, damping: 15, delay: 0.9 }}
              >
                <BookCircle label={hero.ctaLabel} ring={hero.ringText} className="w-[88%]" />
              </motion.div>
            </div>
            <p className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4" aria-hidden="true" /> {hero.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
