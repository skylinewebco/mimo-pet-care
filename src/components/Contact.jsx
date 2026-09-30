import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, ArrowUpRight, Clock, ParkingCircle } from 'lucide-react'
import siteConfig from '../data/siteConfig'
import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import { WhatsAppIcon, Paw } from './icons'

const { contact, hours, bookingHours } = siteConfig

function useOpenNow() {
  return useMemo(() => {
    // Evaluate in Houston time so the badge is right for every visitor.
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }))
    const h = bookingHours[now.getDay()]
    const hour = now.getHours() + now.getMinutes() / 60
    return h ? hour >= h.open && hour < h.close : false
  }, [])
}

export default function Contact() {
  const openNow = useOpenNow()
  const channels = [
    { icon: Phone, label: 'Call', value: contact.phoneDisplay, href: contact.phoneHref, tone: 'bg-yellow' },
    { icon: WhatsAppIcon, label: 'WhatsApp', value: contact.whatsappDisplay, href: `https://wa.me/${contact.whatsappNumber}`, tone: 'bg-green text-white', external: true },
    { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}`, tone: 'bg-teal text-white' },
  ]

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative pb-10 pt-8">
      <div className="container-x">
        <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:gap-5">
          {/* Big maroon card */}
          <Reveal className="relative overflow-hidden rounded-[34px] bg-maroon p-7 text-cream sm:p-10 lg:col-span-5 lg:row-span-2">
            <SectionLabel tone="light">Contact</SectionLabel>
            <h2 id="contact-title" className="mt-6 font-display text-[clamp(3.2rem,8vw,6.5rem)] font-bold uppercase leading-[0.84]">
              Come
              <br /> say hi
            </h2>
            <address className="mt-8 not-italic">
              <p className="flex items-start gap-3 text-lg font-semibold">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-yellow" aria-hidden="true" />
                <span>
                  {contact.addressLine1}
                  <br />
                  {contact.addressLine2}
                  <span className="mt-1 block text-sm font-bold uppercase tracking-widest text-cream/60">{contact.neighborhood}</span>
                </span>
              </p>
              <p className="mt-4 flex items-start gap-3 text-sm font-medium text-cream/75">
                <ParkingCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {contact.parking}
              </p>
            </address>
            <a
              href={contact.mapLink}
              target="_blank"
              rel="noreferrer"
              className="btn-pill mt-8 border-cream bg-cream text-maroon hover:border-yellow hover:bg-yellow"
            >
              Get directions <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>

            {/* Hours ticket */}
            <div className="relative mt-10 rounded-[24px] bg-cream p-6 text-maroon">
              <span className="absolute -left-3 top-[52px] h-6 w-6 rounded-full bg-maroon" aria-hidden="true" />
              <span className="absolute -right-3 top-[52px] h-6 w-6 rounded-full bg-maroon" aria-hidden="true" />
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" aria-hidden="true" /> Opening hours
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full border-1.5 border-maroon px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-wider">
                  <span className={`h-2 w-2 rounded-full ${openNow ? 'bg-green' : 'bg-maroon/40'}`} aria-hidden="true" />
                  {openNow ? 'Open now' : 'Closed now'}
                </span>
              </div>
              <div className="my-5 border-t-1.5 border-dashed border-maroon/30" />
              <dl className="grid gap-3">
                {hours.map((h) => (
                  <div key={h.days} className="flex items-baseline justify-between gap-4">
                    <dt className="font-display text-xl font-bold uppercase">{h.days}</dt>
                    <dd className="text-sm font-bold">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <Paw className="pointer-events-none absolute -right-8 -top-6 h-40 w-40 rotate-[20deg] text-cream/[0.06]" />
          </Reveal>

          {/* Map */}
          <Reveal delay={0.1} className="relative min-h-[320px] overflow-hidden rounded-[34px] border-1.5 border-maroon bg-cream lg:col-span-7">
            <iframe
              title={`Map showing ${siteConfig.business.name} at ${contact.addressLine1}`}
              src={contact.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:saturate(0.75)_sepia(0.12)]"
            />
            <motion.div
              className="pointer-events-none absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border-1.5 border-maroon bg-yellow px-4 py-2 font-display text-sm font-bold uppercase shadow-soft"
              initial={{ y: -10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Paw className="h-4 w-4" /> Mimo HQ · Montrose
            </motion.div>
          </Reveal>

          {/* Channels */}
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
            {channels.map((c, i) => {
              const Icon = c.icon
              return (
                <Reveal key={c.label} delay={0.12 + i * 0.06}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="group flex h-full flex-col justify-between gap-6 rounded-[30px] border-1.5 border-maroon bg-cream p-6 transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lift"
                  >
                    <span className="flex items-center justify-between">
                      <span className={`grid h-12 w-12 place-items-center rounded-full border-1.5 border-maroon ${c.tone}`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="eyebrow block text-maroon/60">{c.label}</span>
                      <span className="mt-1.5 block break-words font-display text-[1.2rem] font-bold leading-tight">
                        {c.value.includes('@') ? (
                          <>
                            {c.value.split('@')[0]}
                            <wbr />@{c.value.split('@')[1]}
                          </>
                        ) : (
                          c.value
                        )}
                      </span>
                    </span>
                  </a>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
