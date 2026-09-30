import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Clock, Check, Plus } from 'lucide-react'
import SmartImage from './SmartImage'
import { ChangeImageButton } from './EditMode'
import { cx } from '../lib/format'

export default function ServiceRow({ service, index, image, open, highlighted, onToggle, onHover, onBook }) {
  const num = String(index + 1).padStart(2, '0')
  const panelId = `service-panel-${service.id}`
  const active = open || highlighted

  return (
    <div
      className={cx(
        'relative rounded-[26px] border-1.5 border-maroon transition-colors duration-300 sm:rounded-[30px]',
        active ? 'bg-yellow' : 'bg-cream'
      )}
      onMouseEnter={onHover}
    >
      <h3 className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="grid w-full grid-cols-[2.2rem_1fr_auto] items-center font-body gap-3 rounded-[26px] px-4 py-5 text-left sm:grid-cols-[3.5rem_1fr_auto] sm:px-7 sm:py-6 md:grid-cols-[4rem_minmax(0,1.1fr)_minmax(0,1fr)_10rem_3.25rem] md:gap-6"
        >
          <span className="font-body text-sm font-extrabold tracking-wider text-maroon/60">{num}</span>
          <span className="font-display text-[clamp(1.25rem,2.6vw,2.1rem)] font-bold uppercase leading-[1.02]">
            {service.name}
            <span className="mt-1 block font-body text-sm font-bold normal-case tracking-normal text-maroon/75 md:hidden">
              {service.price}
            </span>
          </span>
          <span className="hidden text-[0.95rem] font-medium leading-snug text-maroon/80 md:block">{service.description}</span>
          <span className="hidden text-right md:block">
            <span className="block font-display text-2xl font-bold leading-none">{service.price}</span>
            <span className="mt-1 block text-[0.7rem] font-bold uppercase tracking-wider text-maroon/60">{service.priceDetail}</span>
          </span>
          <span
            className={cx(
              'grid h-11 w-11 place-items-center justify-self-end rounded-full border-1.5 border-maroon transition-[transform,background-color,color] duration-500 sm:h-12 sm:w-12',
              open ? 'rotate-90 bg-maroon text-yellow' : active ? 'bg-maroon text-yellow' : ''
            )}
            aria-hidden="true"
          >
            <ArrowUpRight className={cx('h-5 w-5 transition-transform duration-500', open ? 'rotate-45' : '')} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-label={`${service.name} details`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 px-4 pb-6 sm:px-7 sm:pb-7 md:grid-cols-[4rem_minmax(0,1.1fr)_minmax(0,1fr)] md:gap-6">
              <div className="hidden md:block" />
              <motion.div
                className="relative aspect-[16/10] overflow-hidden rounded-[22px] border-1.5 border-maroon bg-peach"
                initial={{ scale: 0.96, rotate: -1.5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <SmartImage src={image} alt={service.alt} sizes="(max-width: 768px) 90vw, 40vw" widths={[500, 800, 1100]} />
                <ChangeImageButton
                  imageKey={`service:${service.id}`}
                  label={service.name}
                  library={service.library}
                  current={service.image}
                />
              </motion.div>
              <div className="flex flex-col">
                <p className="text-[1.02rem] font-medium leading-relaxed md:hidden">{service.description}</p>
                <ul className="mt-4 grid gap-2.5 md:mt-0">
                  {service.details.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-[0.95rem] font-semibold">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-maroon text-yellow">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-auto md:pt-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border-1.5 border-maroon/30 px-3.5 py-2 text-sm font-bold">
                    <Clock className="h-4 w-4" aria-hidden="true" /> {service.duration}
                  </span>
                  <span className="rounded-full border-1.5 border-maroon/30 px-3.5 py-2 text-sm font-bold md:hidden">{service.priceDetail}</span>
                  <button type="button" onClick={onBook} className="btn-solid !py-2.5 text-sm">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    {service.bookable === false ? 'Book mobile visit' : 'Add to booking'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
