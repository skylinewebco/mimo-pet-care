import { motion } from 'framer-motion'
import siteConfig from '../data/siteConfig'
import SmartImage from './SmartImage'
import { ChangeImageButton } from './EditMode'
import { useImageStore } from '../lib/ImageStore'
import useReducedMotion from '../hooks/useReducedMotion'
import { cx, tileBg } from '../lib/format'

/**
 * Rounded colour tile holding a pet photo. A second, offset "shadow tile"
 * in the same colour sits behind it for a layered, printed-sticker feel.
 */
export default function PetTile({
  pet,
  ready = true,
  index = 0,
  rotate = 0,
  className = '',
  sizes = '(max-width: 1024px) 45vw, 20vw',
  eager = false,
  showTag = true,
  float = true,
}) {
  const reduced = useReducedMotion()
  const { getImage } = useImageStore()
  const src = getImage(`hero:${pet.id}`, pet.image)

  return (
    <motion.div
      className={cx('relative', className)}
      initial={{ opacity: 0, y: 60, scale: 0.85, rotate: rotate * 2 }}
      animate={ready ? { opacity: 1, y: 0, scale: 1, rotate } : undefined}
      transition={{ type: 'spring', stiffness: 170, damping: 17, delay: 0.55 + index * 0.12 }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={float && !reduced && ready ? { y: [0, -10, 0] } : undefined}
        transition={{ duration: 5 + index * 0.7, repeat: Infinity, ease: 'easeInOut', delay: 1.6 + index * 0.4 }}
      >
        <div
          aria-hidden="true"
          className={cx('absolute inset-0 translate-x-2.5 translate-y-2.5 rotate-[4deg] rounded-[28px] border-1.5 border-maroon/25 sm:rounded-[32px]', tileBg[pet.tile])}
        />
        <figure className={cx('group relative h-full w-full overflow-hidden rounded-[28px] border-1.5 border-maroon sm:rounded-[32px]', tileBg[pet.tile])}>
          <SmartImage
            src={src}
            alt={pet.alt}
            sizes={sizes}
            eager={eager}
            widths={[320, 480, 700]}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          {showTag && (
            <figcaption className="absolute bottom-3 left-3 rounded-full border-1.5 border-maroon bg-cream/95 px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-maroon">
              {pet.name} · {pet.breed}
            </figcaption>
          )}
          <ChangeImageButton
            imageKey={`hero:${pet.id}`}
            label={`Hero tile — ${pet.name}`}
            library={siteConfig.heroLibrary}
            current={pet.image}
          />
        </figure>
      </motion.div>
    </motion.div>
  )
}
