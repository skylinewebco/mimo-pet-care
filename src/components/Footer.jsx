import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Instagram, Facebook, Youtube, Check } from 'lucide-react'
import siteConfig from '../data/siteConfig'
import CloudDivider from './CloudDivider'
import { Logo } from './Navbar'
import { TikTokIcon } from './icons'
import { handleAnchorClick } from '../lib/scroll'

const { nav, services, social, footer, contact, business, hours } = siteConfig
const SOCIAL_ICONS = { instagram: Instagram, facebook: Facebook, tiktok: TikTokIcon, youtube: Youtube }

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | error | done

  const submit = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setStatus('error')
    setStatus('done')
    setEmail('')
  }

  return (
    <footer className="relative mt-16" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <CloudDivider fill="#F9DFC8" />
      <div className="bg-cream pb-28 pt-6 sm:pb-10">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Logo />
              <p className="mt-5 max-w-xs text-[0.95rem] font-medium leading-relaxed text-maroon/80">{footer.blurb}</p>
              <p className="mt-5 text-sm font-bold">
                {contact.addressLine1}, {contact.addressLine2}
                <br />
                <a href={contact.phoneHref} className="underline-offset-4 hover:underline">
                  {contact.phoneDisplay}
                </a>{' '}
                ·{' '}
                <a href={`mailto:${contact.email}`} className="underline-offset-4 hover:underline">
                  {contact.email}
                </a>
              </p>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-maroon/60">
                {hours.map((h) => `${h.days} ${h.time}`).join(' · ')}
              </p>
            </div>

            <nav aria-label="Quick links" className="lg:col-span-2">
              <p className="eyebrow text-maroon/60">Quick links</p>
              <ul className="mt-4 grid gap-2.5">
                {nav.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} onClick={(e) => handleAnchorClick(e, n.href)} className="font-semibold underline-offset-4 hover:underline">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Services" className="lg:col-span-2">
              <p className="eyebrow text-maroon/60">Services</p>
              <ul className="mt-4 grid gap-2.5">
                {services.slice(0, 7).map((s) => (
                  <li key={s.id}>
                    <a href="#services" onClick={(e) => handleAnchorClick(e, '#services')} className="font-semibold underline-offset-4 hover:underline">
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-4">
              <div className="rounded-[30px] border-1.5 border-maroon bg-peach p-6 sm:p-7">
                <p className="font-display text-2xl font-bold uppercase leading-none">{footer.newsletterTitle}</p>
                <p className="mt-2 text-sm font-medium text-maroon/80">{footer.newsletterText}</p>
                <form onSubmit={submit} className="mt-5" noValidate>
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <div className="flex gap-2 rounded-full border-1.5 border-maroon bg-white/70 p-1.5 focus-within:bg-white">
                    <input
                      id="newsletter-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (status !== 'idle') setStatus('idle')
                      }}
                      aria-invalid={status === 'error'}
                      aria-describedby="newsletter-status"
                      className="min-w-0 flex-1 bg-transparent px-3 text-[0.95rem] font-semibold placeholder:text-maroon/45 focus:outline-none"
                    />
                    <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-maroon text-cream transition-transform hover:scale-105" aria-label="Subscribe">
                      {status === 'done' ? <Check className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                    </button>
                  </div>
                  <p id="newsletter-status" className="mt-2 min-h-[1.25rem] text-xs font-bold" role="status">
                    <AnimatePresence mode="wait">
                      {status === 'error' && (
                        <motion.span key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          Please enter a valid email.
                        </motion.span>
                      )}
                      {status === 'done' && (
                        <motion.span key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          You’re in! First treat lands next month. 🐾
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </p>
                </form>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Social media">
                {social.map((s) => {
                  const Icon = SOCIAL_ICONS[s.id]
                  return (
                    <li key={s.id}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border-1.5 border-maroon px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors hover:bg-maroon hover:text-cream"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" /> {s.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          <p
            aria-hidden="true"
            className="mt-16 select-none text-center font-display font-bold uppercase leading-[0.78] text-peach [-webkit-text-stroke:1.5px_var(--maroon)] text-[clamp(5rem,27vw,26rem)]"
          >
            Mimo
          </p>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t-1.5 border-maroon/20 pt-6 text-xs font-bold sm:flex-row sm:items-center sm:pr-24">
            <p>
              © {new Date().getFullYear()} {business.name}. Made with treats in Houston, TX.
            </p>
            <ul className="flex gap-5">
              {footer.legal.map((l) => (
                <li key={l}>
                  <a href="#top" onClick={(e) => handleAnchorClick(e, '#top')} className="underline-offset-4 hover:underline">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
