import { cx } from '../lib/format'

export default function SectionLabel({ children, className = '', tone = 'maroon' }) {
  return (
    <span
      className={cx(
        'eyebrow inline-flex items-center gap-2.5 rounded-full border-1.5 px-4 py-2',
        tone === 'light' ? 'border-cream text-cream' : 'border-maroon text-maroon',
        className
      )}
    >
      <span className={cx('h-2 w-2 rounded-full', tone === 'light' ? 'bg-cream' : 'bg-maroon')} aria-hidden="true" />
      {children}
    </span>
  )
}
