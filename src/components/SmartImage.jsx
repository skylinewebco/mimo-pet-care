import { useState } from 'react'
import { cx, unsplashSrcSet } from '../lib/format'

/**
 * Lazy, responsive, CLS-safe image. The parent sets the box size;
 * the image covers it and fades in once decoded.
 */
export default function SmartImage({ src, alt, sizes = '(max-width: 768px) 90vw, 40vw', className = '', eager = false, widths }) {
  const [loadedSrc, setLoadedSrc] = useState(null)
  const loaded = loadedSrc === src
  return (
    <img
      src={src}
      srcSet={unsplashSrcSet(src, widths)}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={eager ? 'high' : undefined}
      onLoad={() => setLoadedSrc(src)}
      onError={() => setLoadedSrc(src)}
      ref={(el) => {
        if (el && !loaded && el.complete && el.naturalWidth > 0) setLoadedSrc(src)
      }}
      className={cx('h-full w-full object-cover transition-opacity duration-700', loaded ? 'opacity-100' : 'opacity-0', className)}
    />
  )
}
