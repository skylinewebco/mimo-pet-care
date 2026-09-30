import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { ArrowLeft, ArrowRight, Star, Quote } from 'lucide-react'
import siteConfig from '../data/siteConfig'
import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import useReducedMotion from '../hooks/useReducedMotion'
import { cx } from '../lib/format'

const { testimonials, rating } = siteConfig
const GAP = 20
const CARD_TONES = ['bg-cream', 'bg-white', 'bg-cream', 'bg-yellow', 'bg-cream', 'bg-white']

export default function Testimonials() {
  const reduced = useReducedMotion()
  const viewport = useRef(null)
  const [width, setWidth] = useState(0)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const x = useMotionValue(0)

  const perView = width < 640 ? 1 : width < 1024 ? 2 : 3
  const cardW = width ? (width - GAP * (perView - 1)) / perView : 0
  const maxIndex = Math.max(0, testimonials.length - perView)
  const clamped = Math.min(index, maxIndex)

  useLayoutEffect(() => {
    const el = viewport.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const target = -clamped * (cardW + GAP)
    const ctrl = animate(x, target, reduced ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 32 })
    return () => ctrl.stop()
  }, [clamped, cardW, reduced, x])

  const go = useCallback((dir) => setIndex((i) => {
    const cur = Math.min(i, maxIndex)
    const next = cur + dir
    if (next > maxIndex) return 0
    if (next < 0) return maxIndex
    return next
  }), [maxIndex])

  useEffect(() => {
    if (paused || reduced) return
    const t = setInterval(() => {
      if (!document.hidden) go(1)
    }, 5200)
    return () => clearInterval(t)
  }, [paused, reduced, go])

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative overflow-hidden pb-24 pt-8 sm:pb-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionLabel>Reviews</SectionLabel>
            <h2 id="reviews-title" className="display-xl mt-6">
              They trust us
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex items-center gap-5">
            <div className="grid h-28 w-28 shrink-0 rotate-[-8deg] place-items-center rounded-full border-1.5 border-maroon bg-yellow text-center">
              <span className="leading-none">
                <span className="block font-display text-4xl font-bold">{rating.score}</span>
                <span className="mt-1 flex justify-center gap-0.5" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="h-2.5 w-2.5 fill-maroon text-maroon" />
                  ))}
                </span>
              </span>
            </div>
            <p className="max-w-[12rem] text-sm font-bold leading-snug">
              {rating.count} five-star {rating.source} from Houston pet parents
            </p>
          </Reveal>
        </div>

        <div
          className="mt-12 sm:mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer reviews"
        >
          <div ref={viewport} className="overflow-visible">
            <motion.ul
              className="flex cursor-grab touch-pan-y active:cursor-grabbing"
              style={{ x, gap: GAP }}
              drag={width ? 'x' : false}
              dragElastic={0.18}
              dragMomentum={false}
              dragConstraints={{ left: -maxIndex * (cardW + GAP) - 40, right: 40 }}
              onDragStart={() => setPaused(true)}
              onDragEnd={(_, info) => {
                const threshold = Math.min(90, cardW / 4)
                if (info.offset.x < -threshold || info.velocity.x < -500) setIndex(Math.min(maxIndex, clamped + 1))
                else if (info.offset.x > threshold || info.velocity.x > 500) setIndex(Math.max(0, clamped - 1))
                else animate(x, -clamped * (cardW + GAP), { type: 'spring', stiffness: 260, damping: 30 })
              }}
            >
              {testimonials.map((t, i) => {
                const visible = i >= clamped && i < clamped + perView
                return (
                  <li
                    key={t.id}
                    className="shrink-0"
                    style={{ width: cardW || '100%' }}
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${testimonials.length}`}
                    aria-hidden={!visible}
                  >
                    <article
                      className={cx(
                        'relative flex h-full min-h-[300px] select-none flex-col rounded-[30px] border-1.5 border-maroon p-6 transition-opacity duration-500 sm:p-7',
                        CARD_TONES[i % CARD_TONES.length],
                        visible ? 'opacity-100' : 'opacity-40'
                      )}
                    >
                      <Quote className="absolute right-6 top-6 h-10 w-10 fill-maroon/10 text-maroon/20" aria-hidden="true" />
                      <div className="flex items-center gap-3.5">
                        <img
                          src={t.image}
                          alt=""
                          loading="lazy"
                          draggable="false"
                          className="h-14 w-14 rounded-full border-1.5 border-maroon object-cover"
                        />
                        <div>
                          <h3 className="font-display text-xl font-bold uppercase leading-none">
                            {t.owner} &amp; {t.pet}
                          </h3>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="flex gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>
                              {Array.from({ length: t.rating }).map((_, s) => (
                                <Star key={s} className="h-3.5 w-3.5 fill-maroon text-maroon" aria-hidden="true" />
                              ))}
                            </span>
                            <span className="text-xs font-bold text-maroon/60">{t.neighborhood}</span>
                          </div>
                        </div>
                      </div>
                      <blockquote className="mt-6 flex-1 text-[1.02rem] font-medium leading-relaxed">“{t.text}”</blockquote>
                    </article>
                  </li>
                )
              })}
            </motion.ul>
          </div>

          <div className="mt-10 flex items-center justify-between gap-6">
            <div className="flex gap-2" role="group" aria-label="Choose slide">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={clamped === i}
                  className="grid h-6 place-items-center px-0.5"
                >
                  <span
                    className={cx(
                      'block h-2.5 rounded-full bg-maroon transition-all duration-500',
                      clamped === i ? 'w-9' : 'w-2.5 opacity-30 hover:opacity-60'
                    )}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="grid h-14 w-14 place-items-center rounded-full border-1.5 border-maroon transition-[background-color,color,transform] hover:-translate-x-0.5 hover:bg-maroon hover:text-cream"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next review"
                className="grid h-14 w-14 place-items-center rounded-full border-1.5 border-maroon bg-maroon text-cream transition-transform hover:translate-x-0.5"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
