/* Hand-drawn brand icons & illustrations (original artwork for Mimo). */

export function LogoMark({ className = 'h-8 w-8', title }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title && <title>{title}</title>}
      <path
        d="M14 22c-4 2-6 9-4 16 1 4 5 5 7 2l3-6c2 8 7 14 12 14s10-6 12-14l3 6c2 3 6 2 7-2 2-7 0-14-4-16-4-3-10-2-12 0-2-1-4-2-6-2s-4 1-6 2c-2-2-8-3-12 0z"
        fill="currentColor"
      />
      <circle cx="26" cy="33" r="2.6" fill="var(--peach)" />
      <circle cx="38" cy="33" r="2.6" fill="var(--peach)" />
      <path d="M28.5 40c1-1.4 6-1.4 7 0 .6 1-1.4 2.8-3.5 2.8S27.9 41 28.5 40z" fill="var(--peach)" />
    </svg>
  )
}

export function Paw({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="currentColor">
      <ellipse cx="9" cy="11" rx="3" ry="4" transform="rotate(-18 9 11)" />
      <ellipse cx="15.5" cy="7.5" rx="3" ry="4" />
      <ellipse cx="22.5" cy="9.5" rx="3" ry="4" transform="rotate(16 22.5 9.5)" />
      <ellipse cx="26.5" cy="16.5" rx="2.6" ry="3.4" transform="rotate(35 26.5 16.5)" />
      <path d="M16.5 14.5c-4.5 0-9 6.2-9 10 0 2.8 2.2 4 4.4 4 2 0 3-1 4.6-1s2.6 1 4.6 1c2.2 0 4.4-1.2 4.4-4 0-3.8-4.5-10-9-10z" />
    </svg>
  )
}

export function WhatsAppIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M9.1 7.6c.3-.3.8-.3 1 .1l.9 1.9c.1.3.1.6-.1.8l-.6.7c.6 1.3 1.6 2.3 2.9 2.9l.7-.6c.2-.2.5-.3.8-.1l1.9.9c.4.2.4.7.1 1l-.8.8c-.6.6-1.5.8-2.3.5-2.3-.9-4.1-2.7-5-5-.3-.8-.1-1.7.5-2.3z"
        fill="currentColor"
      />
    </svg>
  )
}

export function TikTokIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M15.6 2.5c.3 2.4 1.9 4.2 4.5 4.4v3.2c-1.6 0-3.1-.5-4.4-1.3v6.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1V13a2.4 2.4 0 1 0 1.5 2.2V2.5z" />
    </svg>
  )
}

export function Bone({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 48 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M9 3a5 5 0 0 1 4.6 6.9h20.8A5 5 0 1 1 39 17a5 5 0 1 1-4.6 3.1H13.6A5 5 0 1 1 9 13a5 5 0 1 1 0-10z" />
    </svg>
  )
}

export function Sparkle({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 0c.8 6.4 4.8 10.6 12 12-7.2 1.4-11.2 5.6-12 12-.8-6.4-4.8-10.6-12-12C7.2 10.6 11.2 6.4 12 0z" />
    </svg>
  )
}

/** Mobile grooming van — original flat illustration in brand colours. */
export function GroomingVan({ className = '', wheelsSpin = false }) {
  const wheel = (cx) => (
    <g>
      <circle cx={cx} cy="236" r="34" fill="var(--maroon)" />
      <circle cx={cx} cy="236" r="17" fill="var(--cream)" />
      <g className={wheelsSpin ? 'animate-spin-slow' : ''} style={{ transformOrigin: `${cx}px 236px` }}>
        {[0, 120, 240].map((a) => (
          <circle key={a} cx={cx + 9 * Math.cos((a * Math.PI) / 180)} cy={236 + 9 * Math.sin((a * Math.PI) / 180)} r="3.2" fill="var(--maroon)" />
        ))}
      </g>
    </g>
  )
  return (
    <svg viewBox="0 0 560 290" className={className} role="img" aria-label="Illustration of the Mimo mobile grooming van">
      {/* shadow */}
      <ellipse cx="280" cy="272" rx="240" ry="10" fill="var(--maroon)" opacity="0.14" />
      {/* bubbles from roof */}
      <circle cx="150" cy="30" r="12" fill="#fff" stroke="var(--maroon)" strokeWidth="3" />
      <circle cx="120" cy="10" r="7" fill="#fff" stroke="var(--maroon)" strokeWidth="3" />
      <circle cx="182" cy="14" r="6" fill="#fff" stroke="var(--maroon)" strokeWidth="3" />
      {/* body */}
      <path
        d="M40 70c0-17 13-30 30-30h270c12 0 22 6 28 16l52 80 70 16c22 5 38 24 38 47v29c0 11-9 20-20 20H58c-10 0-18-8-18-18z"
        fill="var(--cream)"
        stroke="var(--maroon)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* stripe */}
      <path d="M43 178h460c3 6 5 12 5 19v5H43z" fill="var(--yellow)" />
      <path d="M43 178h460" stroke="var(--maroon)" strokeWidth="4" />
      {/* window */}
      <path d="M352 64h8c6 0 12 3 15 8l40 64h-63z" fill="var(--teal)" stroke="var(--maroon)" strokeWidth="5" strokeLinejoin="round" />
      <path d="M362 78l12 0" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      {/* door line + handle */}
      <path d="M340 60v150" stroke="var(--maroon)" strokeWidth="4" />
      <rect x="352" y="150" width="22" height="7" rx="3.5" fill="var(--maroon)" />
      {/* headlight */}
      <circle cx="525" cy="190" r="8" fill="var(--yellow)" stroke="var(--maroon)" strokeWidth="4" />
      {/* logo on side */}
      <g transform="translate(78 78)">
        <circle cx="42" cy="42" r="42" fill="var(--maroon)" />
        <g transform="translate(14 12) scale(0.9)" style={{ color: 'var(--peach)' }}>
          <path
            d="M14 22c-4 2-6 9-4 16 1 4 5 5 7 2l3-6c2 8 7 14 12 14s10-6 12-14l3 6c2 3 6 2 7-2 2-7 0-14-4-16-4-3-10-2-12 0-2-1-4-2-6-2s-4 1-6 2c-2-2-8-3-12 0z"
            fill="var(--peach)"
          />
          <circle cx="26" cy="33" r="2.6" fill="var(--maroon)" />
          <circle cx="38" cy="33" r="2.6" fill="var(--maroon)" />
        </g>
      </g>
      <text x="182" y="118" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="46" fill="var(--maroon)">
        MIMO
      </text>
      <text x="184" y="146" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="13" letterSpacing="1.6" fill="var(--maroon)">
        MOBILE GROOMING
      </text>
      {wheel(140)}
      {wheel(430)}
    </svg>
  )
}

/** Cartoon dog that peeks over the edge of the booking card. */
export function PeekingDog({ className = '' }) {
  return (
    <svg viewBox="0 0 200 190" className={className} aria-hidden="true">
      {/* back ear */}
      <path d="M58 52c-26 4-40 30-34 62 3 14 18 18 26 6l14-30z" fill="#7A3B1E" />
      {/* head */}
      <path d="M52 70c0-34 26-56 58-56s52 22 52 50c0 10-3 18-8 26l32 10c8 3 12 10 12 18 0 12-10 20-22 20h-62c-34 0-62-26-62-60z" fill="#C57A45" />
      {/* muzzle lighter */}
      <path d="M140 92l40 12c7 2 10 8 10 14 0 10-8 18-18 18h-38c-12 0-20-10-18-22 2-14 12-24 24-22z" fill="#E3A26F" />
      {/* nose */}
      <ellipse cx="186" cy="106" rx="11" ry="9" fill="var(--maroon-deep)" />
      <ellipse cx="183" cy="102" rx="3.5" ry="2.2" fill="#fff" opacity="0.6" />
      {/* eye */}
      <ellipse cx="124" cy="66" rx="8" ry="9.5" fill="#2B1410" />
      <circle cx="126.5" cy="62.5" r="2.8" fill="#fff" />
      {/* brow */}
      <path d="M112 50c6-5 16-6 22-2" stroke="#7A3B1E" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* mouth + tongue */}
      <path d="M150 128c6 6 16 7 24 2" stroke="#7A3B1E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M160 132c0 10 4 16 10 16s8-6 7-15z" fill="#E86F6F" />
      {/* front ear */}
      <path d="M78 36c-18-4-34 10-34 36 0 22 8 44 22 48 10 3 16-6 18-18 3-20 6-44-6-66z" fill="#8E4A26" />
      {/* paws on edge */}
      <path d="M70 168c0-12 10-20 22-20s22 8 22 20v6H70z" fill="#C57A45" />
      <path d="M124 168c0-12 10-20 22-20s22 8 22 20v6h-44z" fill="#C57A45" />
      <path d="M84 162v8M96 162v8M138 162v8M150 162v8" stroke="#7A3B1E" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function DogTail({ className = '' }) {
  return (
    <svg viewBox="0 0 80 120" className={className} aria-hidden="true">
      <path d="M40 118C38 80 28 50 12 22 8 14 16 6 22 12c22 24 34 60 34 106z" fill="#C57A45" />
    </svg>
  )
}
