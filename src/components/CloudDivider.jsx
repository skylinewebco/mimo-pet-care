import { cx } from '../lib/format'

// Deterministic cloud silhouette: overlapping circles along a baseline.
const PUFFS = [
  [0, 150, 90], [110, 128, 72], [205, 150, 64], [300, 118, 88], [410, 146, 60], [500, 112, 96],
  [620, 142, 70], [720, 120, 84], [830, 150, 62], [925, 108, 92], [1045, 140, 66], [1140, 116, 86],
  [1250, 146, 64], [1345, 122, 84], [1440, 148, 78],
]
const BUBBLES = [
  [170, 40, 13, 0], [260, 70, 7, 1.2], [560, 22, 10, 0.6], [690, 58, 6, 2], [980, 30, 14, 1.6], [1090, 66, 7, 0.3], [1300, 36, 10, 2.4],
]

/**
 * Soap-bubble cloud edge. `flip` renders it upside down for the bottom of a section.
 * `fill` is the colour of the cloud (the section it belongs to).
 */
export default function CloudDivider({ fill = '#FFFFFF', flip = false, bubbles = true, className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={cx('pointer-events-none relative w-full select-none', flip ? '-mt-px' : '-mb-px', className)}
      style={{ height: 'clamp(84px, 11vw, 190px)', transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <svg viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        <g fill={fill}>
          {PUFFS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y + 80} r={r} />
          ))}
          <rect x="-20" y="200" width="1480" height="60" />
        </g>
        {bubbles &&
          BUBBLES.map(([x, y, r, d], i) => (
            <circle
              key={`b${i}`}
              cx={x}
              cy={y + 40}
              r={r}
              fill={fill}
              className="animate-bubble"
              style={{ animationDelay: `${d}s`, transformBox: 'fill-box' }}
            />
          ))}
      </svg>
    </div>
  )
}
