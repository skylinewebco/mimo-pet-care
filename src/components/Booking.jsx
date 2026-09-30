import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Home,
  Truck,
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import siteConfig from '../data/siteConfig'
import SmartImage from './SmartImage'
import { PeekingDog, Paw, WhatsAppIcon } from './icons'
import { useImageStore } from '../lib/ImageStore'
import { onPrefillBooking } from '../lib/bookingBus'
import { scrollToTarget } from '../lib/scroll'
import useReducedMotion from '../hooks/useReducedMotion'
import { cx, money, tileBg } from '../lib/format'

const { services, packages, petTypes, contact, business, bookingHours, mobile } = siteConfig
const STEPS = ['Pet', 'Services', 'Location', 'Date & time', 'Your details']
const DISCOUNT = business.firstVisitDiscount

/* ── helpers ─────────────────────────────────────────── */
const pad = (n) => String(n).padStart(2, '0')
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fromKey = (k) => {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const fmtTime = (h) => `${h % 12 === 0 ? 12 : h % 12}:00 ${h < 12 ? 'AM' : 'PM'}`
const fmtDate = (k, opts = { weekday: 'short', month: 'short', day: 'numeric' }) =>
  fromKey(k).toLocaleDateString('en-US', opts)
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)

function buildDays(count = 14) {
  const out = []
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (now.getHours() >= (bookingHours[now.getDay()]?.close ?? 19) - 2) start.setDate(start.getDate() + 1)
  for (let i = 0; i < count; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    out.push(toKey(d))
  }
  return out
}

function slotsFor(dayKey) {
  const d = fromKey(dayKey)
  const hrs = bookingHours[d.getDay()]
  if (!hrs) return []
  const now = new Date()
  const isToday = toKey(now) === dayKey
  const out = []
  for (let h = hrs.open; h < hrs.close - 1; h++) {
    const past = isToday && h <= now.getHours() + 1
    const booked = hash(`${dayKey}-${h}`) % 4 === 0
    out.push({ h, label: fmtTime(h), available: !past && !booked })
  }
  return out
}

const EMPTY_OWNER = { name: '', phone: '', email: '', petName: '', breed: '', notes: '' }

/* ── small UI atoms ──────────────────────────────────── */
function StepHeading({ n, title, sub, headingRef }) {
  return (
    <div className="mb-7">
      <p className="eyebrow text-maroon/60">
        Step {n} of {STEPS.length}
      </p>
      <h3 ref={headingRef} tabIndex={-1} className="mt-2 font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-bold uppercase leading-none focus:outline-none">
        {title}
      </h3>
      {sub && <p className="mt-2 text-[0.95rem] font-medium text-maroon/75">{sub}</p>}
    </div>
  )
}

function CheckBadge({ on }) {
  return (
    <span
      className={cx(
        'grid h-7 w-7 place-items-center rounded-full border-1.5 border-maroon transition-colors duration-300',
        on ? 'bg-maroon text-yellow' : 'bg-cream/90 text-transparent'
      )}
      aria-hidden="true"
    >
      <Check className="h-4 w-4" strokeWidth={3} />
    </span>
  )
}

function Field({ label, id, error, children, className = '', optional }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-bold">
        {label}
        {optional && <span className="text-xs font-semibold text-maroon/50">optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-bold text-maroon-soft" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/* ── confetti ─────────────────────────────────────────── */
function PawConfetti() {
  const reduced = useReducedMotion()
  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => {
        const angle = (i / 26) * Math.PI * 2 + (i % 3) * 0.2
        const dist = 120 + (i % 5) * 38
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist * 0.75 - 40,
          r: (i % 2 ? 1 : -1) * (40 + i * 7),
          s: 0.6 + (i % 4) * 0.18,
          c: ['text-maroon', 'text-yellow', 'text-teal', 'text-green', 'text-peach'][i % 5],
          paw: i % 3 !== 0,
        }
      }),
    []
  )
  if (reduced) return null
  return (
    <div className="pointer-events-none absolute left-1/2 top-16 z-10 h-0 w-0" aria-hidden="true">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className={cx('absolute -ml-3 -mt-3 block', p.c)}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 90], opacity: [1, 1, 0], scale: p.s, rotate: p.r }}
          transition={{ duration: 1.6, ease: [0.2, 0.8, 0.3, 1], delay: 0.15 + (i % 6) * 0.03 }}
        >
          {p.paw ? <Paw className="h-6 w-6" /> : <span className="block h-3 w-3 rounded-full bg-current" />}
        </motion.span>
      ))}
    </div>
  )
}

/* ── main component ───────────────────────────────────── */
export default function Booking() {
  const { getImage } = useImageStore()
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [petType, setPetType] = useState(null)
  const [packageId, setPackageId] = useState(null)
  const [selected, setSelected] = useState([])
  const [location, setLocation] = useState('salon')
  const [address, setAddress] = useState('')
  const [day, setDay] = useState(null)
  const [time, setTime] = useState(null)
  const [owner, setOwner] = useState(EMPTY_OWNER)
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const headingRef = useRef(null)
  const cardRef = useRef(null)
  const firstRender = useRef(true)

  const days = useMemo(() => buildDays(14), [])
  const slots = useMemo(() => (day ? slotsFor(day) : []), [day])

  const available = useMemo(
    () => services.filter((s) => s.bookable !== false && (!petType || s.petTypes.includes(petType))),
    [petType]
  )
  const pkgList = petType ? packages[petType] : []
  const pkg = pkgList.find((p) => p.id === packageId) || null
  const chosen = services.filter((s) => selected.includes(s.id))

  const groomingTotal = (pkg?.price || 0) + chosen.reduce((a, s) => a + s.basePrice, 0)
  const travel = location === 'mobile' ? mobile.travelFee : 0
  const discount = Math.round(groomingTotal * DISCOUNT * 100) / 100
  const total = groomingTotal + travel - discount
  const itemCount = chosen.length + (pkg ? 1 : 0)

  // Prefill from other sections (service rows, pricing cards, mobile section)
  useEffect(
    () =>
      onPrefillBooking(({ serviceId, petType: pt, packageId: pk, location: loc }) => {
        if (done) resetAll()
        if (loc) setLocation(loc)
        if (pt) {
          setPetType(pt)
          if (pt !== petType) {
            setSelected(serviceId ? [serviceId] : [])
            setPackageId(pk || null)
          } else {
            if (serviceId) setSelected((cur) => (cur.includes(serviceId) ? cur : [...cur, serviceId]))
            if (pk) setPackageId(pk)
          }
          setDir(1)
          setStep(1)
        } else if (loc && petType) {
          setDir(1)
          setStep(2)
        }
      }),
    [petType, done] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // Move focus to the new step heading + keep the card in view.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const t = setTimeout(() => {
      headingRef.current?.focus({ preventScroll: true })
      const top = cardRef.current?.getBoundingClientRect().top ?? 0
      if (top < 0) scrollToTarget(cardRef.current, { offset: -96 })
    }, 80)
    return () => clearTimeout(t)
  }, [step, done])

  const validate = (s = step) => {
    const e = {}
    if (s === 0 && !petType) e.pet = 'Choose who’s coming in.'
    if (s === 1 && itemCount === 0) e.services = 'Pick a package or at least one service.'
    if (s === 2 && location === 'mobile' && address.trim().length < 6) e.address = 'Add the address where we should park.'
    if (s === 3) {
      if (!day) e.day = 'Pick a day.'
      else if (!time) e.time = 'Pick a time slot.'
    }
    if (s === 4) {
      if (owner.name.trim().length < 2) e.name = 'Please add your name.'
      if (owner.phone.replace(/\D/g, '').length < 10) e.phone = 'Add a phone number we can text.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner.email.trim())) e.email = 'That email doesn’t look right.'
      if (owner.petName.trim().length < 1) e.petName = 'What’s your pet’s name?'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate()) return
    setDir(1)
    if (step === STEPS.length - 1) setDone(true)
    else setStep((s) => s + 1)
  }
  const back = () => {
    setErrors({})
    setDir(-1)
    setStep((s) => Math.max(0, s - 1))
  }
  const goTo = (i) => {
    if (i >= step) return
    setErrors({})
    setDir(-1)
    setStep(i)
  }

  function resetAll() {
    setStep(0)
    setPetType(null)
    setPackageId(null)
    setSelected([])
    setLocation('salon')
    setAddress('')
    setDay(null)
    setTime(null)
    setOwner(EMPTY_OWNER)
    setErrors({})
    setDone(false)
  }

  const choosePet = (id) => {
    if (id !== petType) {
      setSelected((cur) => cur.filter((sid) => services.find((s) => s.id === sid)?.petTypes.includes(id)))
      setPackageId(null)
    }
    setPetType(id)
    setErrors({})
  }
  const toggleService = (id) => {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
    setErrors({})
  }

  const petLabel = petTypes.find((p) => p.id === petType)?.single

  const whatsappMessage = useMemo(() => {
    const lines = [
      `Hi Mimo! I'd like to book a grooming appointment 🐾`,
      ``,
      `Pet: ${owner.petName || '—'} (${petLabel || '—'}${owner.breed ? ` · ${owner.breed}` : ''})`,
      pkg ? `Package: ${pkg.name} (${money(pkg.price)})` : null,
      chosen.length ? `Services: ${chosen.map((s) => `${s.name} (${money(s.basePrice)})`).join(', ')}` : null,
      `Location: ${location === 'mobile' ? `Mobile grooming — ${address}` : `Salon visit — ${contact.addressLine1}`}`,
      day && time != null ? `Date: ${fmtDate(day, { weekday: 'long', month: 'long', day: 'numeric' })} at ${fmtTime(time)}` : null,
      `Estimated total: ${money(total)} (incl. ${Math.round(DISCOUNT * 100)}% first-visit discount${travel ? `, ${money(travel)} travel fee` : ''})`,
      ``,
      `Name: ${owner.name}`,
      `Phone: ${owner.phone}`,
      `Email: ${owner.email}`,
      owner.notes ? `Notes: ${owner.notes}` : null,
    ].filter((l) => l !== null)
    return lines.join('\n')
  }, [owner, petLabel, pkg, chosen, location, address, day, time, total, travel])

  const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  const slide = {
    initial: (d) => ({ opacity: 0, x: reduced ? 0 : d * 48 }),
    animate: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: reduced ? 0 : d * -48 }),
  }

  /* ── step bodies ───────────────────────────────────── */
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <StepHeading n={1} title="Who’s getting pampered?" sub="Choose your pet type to see the right services." headingRef={headingRef} />
            <div role="radiogroup" aria-label="Pet type" className="grid grid-cols-3 gap-3 sm:gap-4">
              {petTypes.map((p) => {
                const on = petType === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => choosePet(p.id)}
                    className={cx(
                      'group relative overflow-hidden rounded-[24px] border-1.5 border-maroon text-left transition-[transform,box-shadow] duration-300 hover:-translate-y-1 sm:rounded-[28px]',
                      on ? 'shadow-[0_8px_0_0_#91352B]' : 'hover:shadow-soft'
                    )}
                  >
                    <div className={cx('relative aspect-square', tileBg[p.tile])}>
                      <SmartImage src={p.image} alt={p.alt} sizes="(max-width:640px) 30vw, 18vw" widths={[300, 500]} className="transition-transform duration-700 group-hover:scale-105" />
                      <span className="absolute right-2.5 top-2.5">
                        <CheckBadge on={on} />
                      </span>
                    </div>
                    <span className={cx('block px-3 py-3 font-display text-[0.92rem] font-bold uppercase leading-tight transition-colors sm:px-4 sm:text-xl', on ? 'bg-yellow' : 'bg-cream')}>
                      {p.single}
                    </span>
                  </button>
                )
              })}
            </div>
            {errors.pet && <p className="mt-4 text-sm font-bold text-maroon-soft" role="alert">{errors.pet}</p>}
          </>
        )

      case 1:
        return (
          <>
            <StepHeading n={2} title="Choose services" sub="Pick a package, add extras, or build your own. Mix and match freely." headingRef={headingRef} />
            <p className="eyebrow mb-3 text-maroon/60">Packages · pick one (optional)</p>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {pkgList.map((p) => {
                const on = packageId === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setPackageId(on ? null : p.id)
                      setErrors({})
                    }}
                    className={cx(
                      'relative flex items-center justify-between gap-3 rounded-[22px] border-1.5 border-maroon px-4 py-3.5 text-left transition-colors duration-300',
                      on ? 'bg-yellow' : 'bg-cream hover:bg-white'
                    )}
                  >
                    <span>
                      <span className="block font-display text-lg font-bold uppercase leading-none">{p.name}</span>
                      <span className="mt-1 block text-xs font-bold text-maroon/65">{p.includes.length} treats included</span>
                    </span>
                    <span className="flex items-center gap-2.5">
                      <span className="font-display text-xl font-bold">{money(p.price)}</span>
                      <CheckBadge on={on} />
                    </span>
                  </button>
                )
              })}
            </div>

            <p className="eyebrow mb-3 mt-8 text-maroon/60">Services · select any</p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {available.map((s) => {
                const on = selected.includes(s.id)
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggleService(s.id)}
                    className={cx(
                      'group relative flex flex-col overflow-hidden rounded-[22px] border-1.5 border-maroon text-left transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5',
                      on ? 'bg-yellow shadow-[0_6px_0_0_#91352B]' : 'bg-cream'
                    )}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden border-b-1.5 border-maroon bg-peach">
                      <SmartImage
                        src={getImage(`service:${s.id}`, s.image)}
                        alt={s.alt}
                        sizes="(max-width:768px) 45vw, 20vw"
                        widths={[300, 500]}
                        className="transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute right-2 top-2">
                        <CheckBadge on={on} />
                      </span>
                    </div>
                    <span className="flex flex-1 flex-col justify-between gap-1 px-3.5 py-3">
                      <span className="font-display text-[1.02rem] font-bold uppercase leading-tight">{s.name}</span>
                      <span className="text-sm font-extrabold">
                        {s.price}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
            {errors.services && <p className="mt-4 text-sm font-bold text-maroon-soft" role="alert">{errors.services}</p>}
          </>
        )

      case 2:
        return (
          <>
            <StepHeading n={3} title="Salon or sofa?" sub="Visit our Montrose studio, or let the Mimo van come to you." headingRef={headingRef} />
            <div role="radiogroup" aria-label="Appointment location" className="grid gap-3 sm:grid-cols-2">
              {[
                { id: 'salon', icon: Home, title: 'Salon visit', text: `${contact.addressLine1}, ${contact.neighborhood}`, tag: 'No extra fee' },
                { id: 'mobile', icon: Truck, title: 'Mobile grooming', text: 'We park at your door, anywhere in our service area.', tag: `+${money(mobile.travelFee)} travel` },
              ].map((o) => {
                const on = location === o.id
                const Icon = o.icon
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => {
                      setLocation(o.id)
                      setErrors({})
                    }}
                    className={cx(
                      'relative flex flex-col items-start gap-5 rounded-[26px] border-1.5 border-maroon p-6 text-left transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5',
                      on ? 'bg-yellow shadow-[0_8px_0_0_#91352B]' : 'bg-cream'
                    )}
                  >
                    <span className="flex w-full items-center justify-between">
                      <span className={cx('grid h-14 w-14 place-items-center rounded-full border-1.5 border-maroon', on ? 'bg-maroon text-yellow' : '')}>
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <CheckBadge on={on} />
                    </span>
                    <span>
                      <span className="block font-display text-2xl font-bold uppercase leading-none">{o.title}</span>
                      <span className="mt-2 block text-sm font-medium text-maroon/80">{o.text}</span>
                    </span>
                    <span className="rounded-full border-1.5 border-maroon/40 px-3 py-1 text-xs font-extrabold uppercase tracking-wider">{o.tag}</span>
                  </button>
                )
              })}
            </div>
            <AnimatePresence initial={false}>
              {location === 'mobile' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-6">
                    <Field label="Where should we park?" id="bk-address" error={errors.address}>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-maroon/60" aria-hidden="true" />
                        <input
                          id="bk-address"
                          className="input !pl-12"
                          placeholder="Street address, Houston TX"
                          autoComplete="street-address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          aria-invalid={!!errors.address}
                          aria-describedby={errors.address ? 'bk-address-error' : undefined}
                        />
                      </div>
                    </Field>
                    <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-bold text-maroon/70">
                      We cover:
                      {mobile.areas.map((a) => (
                        <span key={a} className="rounded-full bg-cream px-2.5 py-1">{a}</span>
                      ))}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )

      case 3:
        return (
          <>
            <StepHeading n={4} title="Pick a date & time" sub="Live availability for the next two weeks." headingRef={headingRef} />
            <div className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2" role="radiogroup" aria-label="Day" data-lenis-prevent-touch>
              {days.map((k) => {
                const d = fromKey(k)
                const on = day === k
                const closed = !bookingHours[d.getDay()]
                return (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    disabled={closed}
                    aria-label={fmtDate(k, { weekday: 'long', month: 'long', day: 'numeric' })}
                    onClick={() => {
                      setDay(k)
                      setTime(null)
                      setErrors({})
                    }}
                    className={cx(
                      'flex w-[4.6rem] shrink-0 flex-col items-center rounded-[22px] border-1.5 border-maroon py-3.5 transition-colors duration-300 disabled:opacity-30',
                      on ? 'bg-maroon text-cream' : 'bg-cream hover:bg-white'
                    )}
                  >
                    <span className="text-[0.66rem] font-extrabold uppercase tracking-widest opacity-75">
                      {d.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="mt-1 font-display text-3xl font-bold leading-none">{d.getDate()}</span>
                    <span className="mt-1 text-[0.66rem] font-extrabold uppercase tracking-widest opacity-75">
                      {d.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </button>
                )
              })}
            </div>
            {errors.day && <p className="mt-3 text-sm font-bold text-maroon-soft" role="alert">{errors.day}</p>}

            <div className="mt-6">
              {day ? (
                <>
                  <p className="eyebrow mb-3 flex items-center gap-2 text-maroon/60">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {fmtDate(day, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <div role="radiogroup" aria-label="Time" className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
                    {slots.map((s) => {
                      const on = time === s.h
                      return (
                        <button
                          key={s.h}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          disabled={!s.available}
                          onClick={() => {
                            setTime(s.h)
                            setErrors({})
                          }}
                          className={cx(
                            'relative rounded-full border-1.5 py-3 text-sm font-extrabold transition-[background-color,color,transform] duration-200',
                            !s.available
                              ? 'cursor-not-allowed border-maroon/20 text-maroon/35 line-through'
                              : on
                                ? 'border-maroon bg-yellow shadow-[0_4px_0_0_#91352B]'
                                : 'border-maroon bg-cream hover:-translate-y-0.5 hover:bg-white'
                          )}
                        >
                          {s.label}
                          {!s.available && <span className="sr-only"> (booked)</span>}
                        </button>
                      )
                    })}
                  </div>
                  {errors.time && <p className="mt-3 text-sm font-bold text-maroon-soft" role="alert">{errors.time}</p>}
                </>
              ) : (
                <div className="flex items-center gap-3 rounded-[22px] border-1.5 border-dashed border-maroon/40 px-5 py-6 text-sm font-bold text-maroon/70">
                  <CalendarDays className="h-5 w-5" aria-hidden="true" /> Choose a day to see open slots.
                </div>
              )}
            </div>
          </>
        )

      case 4:
        return (
          <>
            <StepHeading n={5} title="Almost there!" sub="We’ll text a confirmation within the hour." headingRef={headingRef} />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { k: 'name', label: 'Your name', type: 'text', ac: 'name', ph: 'Jordan Rivera' },
                { k: 'phone', label: 'Phone', type: 'tel', ac: 'tel', ph: '(713) 555-0100' },
                { k: 'email', label: 'Email', type: 'email', ac: 'email', ph: 'you@email.com' },
                { k: 'petName', label: 'Pet name', type: 'text', ac: 'off', ph: 'Biscuit' },
                { k: 'breed', label: 'Breed', type: 'text', ac: 'off', ph: 'Maltipoo', optional: true },
              ].map((f) => (
                <Field key={f.k} label={f.label} id={`bk-${f.k}`} error={errors[f.k]} optional={f.optional}>
                  <input
                    id={`bk-${f.k}`}
                    type={f.type}
                    className="input"
                    autoComplete={f.ac}
                    placeholder={f.ph}
                    value={owner[f.k]}
                    onChange={(e) => setOwner((o) => ({ ...o, [f.k]: e.target.value }))}
                    aria-invalid={!!errors[f.k]}
                    aria-describedby={errors[f.k] ? `bk-${f.k}-error` : undefined}
                  />
                </Field>
              ))}
              <Field label="Notes" id="bk-notes" optional className="sm:col-span-2">
                <textarea
                  id="bk-notes"
                  rows={3}
                  className="input resize-none"
                  placeholder="Allergies, anxiety, favourite treats, style references…"
                  value={owner.notes}
                  onChange={(e) => setOwner((o) => ({ ...o, notes: e.target.value }))}
                />
              </Field>
            </div>
          </>
        )
      default:
        return null
    }
  }

  const summaryRows = (
    <ul className="grid gap-2.5 text-sm">
      {pkg && (
        <li className="flex justify-between gap-3 font-semibold">
          <span>{pkg.name} package</span>
          <span>{money(pkg.price)}</span>
        </li>
      )}
      {chosen.map((s) => (
        <li key={s.id} className="flex justify-between gap-3 font-semibold">
          <span>{s.name}</span>
          <span>{money(s.basePrice)}</span>
        </li>
      ))}
      {travel > 0 && (
        <li className="flex justify-between gap-3 font-semibold">
          <span>Mobile travel fee</span>
          <span>{money(travel)}</span>
        </li>
      )}
      {groomingTotal > 0 && (
        <li className="flex justify-between gap-3 font-bold text-green">
          <span className="text-maroon">First visit −{Math.round(DISCOUNT * 100)}%</span>
          <span className="text-maroon">−{money(discount)}</span>
        </li>
      )}
    </ul>
  )

  return (
    <section id="booking" aria-labelledby="booking-title" className="relative overflow-hidden pb-24 pt-12 sm:pb-32 sm:pt-20">
      <div className="container-x">
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.h2
            id="booking-title"
            className="font-display text-[clamp(2.5rem,6.4vw,6rem)] font-bold uppercase leading-[0.9] text-balance"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Ready to book
            <br /> an appointment?
          </motion.h2>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-yellow px-5 py-2.5 font-display text-lg font-semibold uppercase tracking-wide">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Get 25% off your first visit
          </p>
        </div>

        <div className="relative mx-auto mt-24 max-w-6xl sm:mt-28">
          {/* Peeking dog + wagging tail (decorative) */}
          <motion.div
            className="pointer-events-none absolute -top-[86px] right-6 z-20 w-32 sm:-top-[118px] sm:right-16 sm:w-44"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.3 }}
          >
            <motion.div
              animate={reduced ? undefined : { rotate: [0, -4, 0, 3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '50% 90%' }}
            >
              <PeekingDog className="h-auto w-full" />
            </motion.div>
          </motion.div>

          <div
            ref={cardRef}
            id="booking-card"
            className="relative z-10 rounded-[30px] border-1.5 border-maroon bg-peach shadow-lift sm:rounded-[40px]"
          >
            <div className="rounded-[30px] bg-cream/70 sm:rounded-[40px]">
              {!done ? (
                <div className="grid lg:grid-cols-[1fr_340px]">
                  <div className="min-w-0 p-5 sm:p-8 lg:p-10">
                    {/* progress */}
                    <nav aria-label="Booking progress" className="mb-9">
                      <ol className="flex items-center gap-1.5 sm:gap-2">
                        {STEPS.map((label, i) => {
                          const state = i < step ? 'done' : i === step ? 'current' : 'todo'
                          return (
                            <li key={label} className="flex flex-1 items-center gap-1.5 sm:gap-2">
                              <button
                                type="button"
                                onClick={() => goTo(i)}
                                disabled={i >= step}
                                aria-current={state === 'current' ? 'step' : undefined}
                                aria-label={`Step ${i + 1}: ${label}${state === 'done' ? ' (completed)' : ''}`}
                                className={cx(
                                  'grid h-9 w-9 shrink-0 place-items-center rounded-full border-1.5 border-maroon text-sm font-extrabold transition-colors duration-300 sm:h-10 sm:w-10',
                                  state === 'done' && 'bg-maroon text-yellow hover:bg-maroon-soft',
                                  state === 'current' && 'bg-yellow',
                                  state === 'todo' && 'bg-transparent text-maroon/50'
                                )}
                              >
                                {state === 'done' ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                              </button>
                              <span className="hidden text-xs font-extrabold uppercase tracking-wider xl:inline">{label}</span>
                              {i < STEPS.length - 1 && (
                                <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-maroon/15" aria-hidden="true">
                                  <motion.span
                                    className="absolute inset-y-0 left-0 rounded-full bg-maroon"
                                    initial={false}
                                    animate={{ width: i < step ? '100%' : '0%' }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                  />
                                </span>
                              )}
                            </li>
                          )
                        })}
                      </ol>
                    </nav>

                    <div className="relative min-h-[380px]">
                      <AnimatePresence mode="wait" custom={dir} initial={false}>
                        <motion.div
                          key={step}
                          custom={dir}
                          variants={slide}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {renderStep()}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* nav buttons + compact summary on mobile */}
                    <div className="mt-8 border-t-1.5 border-maroon/15 pt-6">
                      <div className="mb-5 flex items-center justify-between lg:hidden">
                        <span className="text-sm font-bold text-maroon/70">
                          {itemCount} item{itemCount === 1 ? '' : 's'}
                          {travel ? ' + travel' : ''}
                        </span>
                        <span className="font-display text-2xl font-bold">
                          {money(total)}
                          {groomingTotal > 0 && (
                            <span className="ml-2 align-middle text-xs font-extrabold uppercase text-maroon/60">after 25% off</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={back}
                          className={cx('btn-ghost !px-5', step === 0 && 'invisible')}
                          aria-hidden={step === 0}
                          tabIndex={step === 0 ? -1 : 0}
                        >
                          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                        </button>
                        <button type="button" onClick={next} className="btn-solid !px-7">
                          {step === STEPS.length - 1 ? 'Confirm booking' : 'Continue'}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* desktop summary */}
                  <aside className="hidden flex-col rounded-r-[40px] border-l-1.5 border-maroon/15 bg-white/45 p-8 lg:flex" aria-label="Booking summary">
                    <p className="eyebrow text-maroon/60">Your booking</p>
                    <div className="mt-5 space-y-4 text-sm font-semibold">
                      <p className="flex items-center gap-2.5">
                        <Paw className="h-4 w-4" /> {petLabel || <span className="text-maroon/45">No pet chosen yet</span>}
                        {owner.petName && <span className="text-maroon/60">· {owner.petName}</span>}
                      </p>
                      <p className="flex items-center gap-2.5">
                        {location === 'mobile' ? <Truck className="h-4 w-4" /> : <Home className="h-4 w-4" />}
                        {location === 'mobile' ? `Mobile · ${address || 'address tbc'}` : 'Salon · Montrose'}
                      </p>
                      <p className="flex items-center gap-2.5">
                        <CalendarDays className="h-4 w-4" />
                        {day ? `${fmtDate(day)}${time != null ? ` · ${fmtTime(time)}` : ''}` : <span className="text-maroon/45">Date tbc</span>}
                      </p>
                    </div>
                    <div className="my-6 border-t-1.5 border-dashed border-maroon/25" />
                    {itemCount ? summaryRows : <p className="text-sm font-semibold text-maroon/45">Services you pick will appear here.</p>}
                    <div className="mt-auto pt-8">
                      <div className="flex items-end justify-between border-t-1.5 border-maroon pt-5">
                        <span className="text-sm font-extrabold uppercase tracking-wider">Est. total</span>
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={total}
                            className="font-display text-4xl font-bold leading-none"
                            initial={{ y: 14, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -14, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            {money(total)}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-maroon/60">Pay after the groom. Final price may vary by size & coat.</p>
                    </div>
                  </aside>
                </div>
              ) : (
                /* ── confirmation ── */
                <div className="relative overflow-hidden px-5 py-12 text-center sm:px-10 sm:py-16">
                  <PawConfetti />
                  <motion.div
                    className="relative z-[11] mx-auto grid h-24 w-24 place-items-center rounded-full bg-maroon text-yellow"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 13 }}
                  >
                    <motion.svg viewBox="0 0 24 24" className="h-11 w-11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.5 }} />
                    </motion.svg>
                  </motion.div>
                  <h3 ref={headingRef} tabIndex={-1} className="mt-7 font-display text-[clamp(2rem,5vw,3.4rem)] font-bold uppercase leading-none focus:outline-none">
                    Pawsome, {owner.name.split(' ')[0]}!
                  </h3>
                  <p className="mx-auto mt-3 max-w-md font-medium text-maroon/80">
                    Your request is ready. Send it to us on WhatsApp and we’ll confirm {owner.petName}’s appointment within the hour.
                  </p>

                  <div className="mx-auto mt-9 max-w-xl rounded-[28px] border-1.5 border-maroon bg-white/70 p-6 text-left sm:p-7">
                    <div className="grid gap-3 border-b-1.5 border-dashed border-maroon/25 pb-5 text-sm font-semibold sm:grid-cols-2">
                      <p className="flex items-center gap-2.5">
                        <Paw className="h-4 w-4 shrink-0" /> {owner.petName} · {petLabel}
                        {owner.breed ? ` · ${owner.breed}` : ''}
                      </p>
                      <p className="flex items-center gap-2.5">
                        <CalendarDays className="h-4 w-4 shrink-0" /> {day && fmtDate(day)} · {time != null && fmtTime(time)}
                      </p>
                      <p className="flex items-center gap-2.5 sm:col-span-2">
                        {location === 'mobile' ? <Truck className="h-4 w-4 shrink-0" /> : <Home className="h-4 w-4 shrink-0" />}
                        {location === 'mobile' ? `Mobile grooming · ${address}` : `Salon visit · ${contact.addressLine1}, ${contact.neighborhood}`}
                      </p>
                    </div>
                    <div className="pt-5">{summaryRows}</div>
                    <div className="mt-5 flex items-end justify-between border-t-1.5 border-maroon pt-4">
                      <span className="text-sm font-extrabold uppercase tracking-wider">Estimated total</span>
                      <span className="font-display text-4xl font-bold leading-none">{money(total)}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-solid !pl-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-green text-white"><WhatsAppIcon className="h-[18px] w-[18px]" /></span> Book on WhatsApp
                    </a>
                    <a href={contact.phoneHref} className="btn-ghost">
                      <Phone className="h-4 w-4" aria-hidden="true" /> Call us · {contact.phoneDisplay}
                    </a>
                  </div>
                  <button type="button" onClick={resetAll} className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold underline-offset-4 hover:underline">
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Start a new booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
