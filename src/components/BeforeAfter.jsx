import { useRef, useState } from 'react'
import { MoveHorizontal } from 'lucide-react'
import SmartImage from './SmartImage'
import { cx } from '../lib/format'

/** Drag (or use arrow keys) to compare before/after. */
export default function BeforeAfter({ item, className = '' }) {
  const [pos, setPos] = useState(50)
  const [focused, setFocused] = useState(false)
  const box = useRef(null)
  const dragging = useRef(false)

  const setFromEvent = (e) => {
    const r = box.current.getBoundingClientRect()
    const p = ((e.clientX - r.left) / r.width) * 100
    setPos(Math.max(2, Math.min(98, p)))
  }

  return (
    <figure className={cx('relative', className)}>
      <div
        ref={box}
        className="relative aspect-[5/4] cursor-ew-resize select-none overflow-hidden rounded-[30px] border-1.5 border-maroon bg-cream [touch-action:pan-y]"
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          setFromEvent(e)
        }}
        onPointerMove={(e) => dragging.current && setFromEvent(e)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <SmartImage src={item.after} alt={item.afterAlt} sizes="(max-width:768px) 92vw, 45vw" widths={[500, 800, 1000]} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <SmartImage src={item.before} alt={item.beforeAlt} sizes="(max-width:768px) 92vw, 45vw" widths={[500, 800, 1000]} className="saturate-[0.85]" />
        </div>

        <span className="pointer-events-none absolute left-4 top-4 rounded-full border-1.5 border-maroon bg-cream px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.16em]">
          Before
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full border-1.5 border-maroon bg-yellow px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.16em]">
          After
        </span>

        <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white" style={{ left: `${pos}%` }}>
          <span
            className={cx(
              'absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-white bg-maroon text-white shadow-lift',
              focused && 'ring-4 ring-yellow'
            )}
          >
            <MoveHorizontal className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={`Before and after comparison for ${item.name}. Slide to reveal`}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        />
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4 px-1">
        <span className="font-display text-2xl font-bold uppercase">{item.name}</span>
        <span className="text-sm font-bold text-maroon/70">{item.breed}</span>
      </figcaption>
    </figure>
  )
}
