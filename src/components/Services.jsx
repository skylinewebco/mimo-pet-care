import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import siteConfig from '../data/siteConfig'
import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import ServiceRow from './ServiceRow'
import { useImageStore } from '../lib/ImageStore'
import { prefillBooking } from '../lib/bookingBus'
import useReducedMotion from '../hooks/useReducedMotion'

const { services } = siteConfig

export default function Services() {
  const { getImage } = useImageStore()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(services[1].id)
  const [hovered, setHovered] = useState(null)
  const listRef = useRef(null)
  const canHover = useRef(typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches)

  // Floating preview follows the cursor (desktop only, no re-renders).
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.6 })
  const y = useSpring(my, { stiffness: 220, damping: 26, mass: 0.6 })

  const onMove = (e) => {
    if (!canHover.current || !listRef.current) return
    const r = listRef.current.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  const preview = canHover.current && hovered && hovered !== open ? services.find((s) => s.id === hovered) : null

  return (
    <section id="services" aria-labelledby="services-title" className="relative pb-24 pt-8 sm:pb-32">
      <div className="container-x">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <SectionLabel>Our services</SectionLabel>
            <h2 id="services-title" className="display-xl mt-6">
              What we offer
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4">
            <p className="text-pretty text-lg font-medium leading-relaxed text-maroon/85 lg:text-right">
              Ten services, one promise: no rushing, no cages, and a pet who comes home proud of their new look.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-12 sm:mt-16" ref={listRef} onMouseMove={onMove} onMouseLeave={() => setHovered(null)}>
          <ul className="grid gap-2.5 sm:gap-3">
            {services.map((s, i) => (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: Math.min(i, 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <ServiceRow
                  service={s}
                  index={i}
                  image={getImage(`service:${s.id}`, s.image)}
                  open={open === s.id}
                  highlighted={hovered === s.id}
                  onHover={() => canHover.current && setHovered(s.id)}
                  onToggle={() => setOpen((cur) => (cur === s.id ? null : s.id))}
                  onBook={() =>
                    s.bookable === false
                      ? prefillBooking({ location: 'mobile' })
                      : prefillBooking({ serviceId: s.id, petType: s.petTypes[0] })
                  }
                />
              </motion.li>
            ))}
          </ul>

          {/* Desktop hover preview */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
            style={{ x, y }}
          >
            <AnimatePresence>
              {preview && (
                <motion.div
                  key={preview.id}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: reduced ? 0 : 5 }}
                  exit={{ opacity: 0, scale: 0.85, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                >
                  <div className="-ml-[140px] -mt-[190px] h-[190px] w-[260px] overflow-hidden rounded-[24px] border-1.5 border-maroon bg-peach shadow-lift">
                    <img
                      src={getImage(`service:${preview.id}`, preview.image)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
