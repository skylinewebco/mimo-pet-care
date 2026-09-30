export const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`

export const cx = (...c) => c.filter(Boolean).join(' ')

export const tileBg = {
  yellow: 'bg-yellow',
  teal: 'bg-teal',
  green: 'bg-green',
  cream: 'bg-cream',
  peach: 'bg-peach',
}

/** Build a srcSet for Unsplash URLs by swapping the width param. */
export function unsplashSrcSet(src, widths = [400, 700, 1000, 1400]) {
  if (!src || !src.includes('images.unsplash.com')) return undefined
  try {
    return widths
      .map((w) => {
        const url = new URL(src)
        const oldW = Number(url.searchParams.get('w')) || w
        const h = url.searchParams.get('h')
        url.searchParams.set('w', String(w))
        if (h) url.searchParams.set('h', String(Math.round((Number(h) / oldW) * w)))
        return `${url.toString()} ${w}w`
      })
      .join(', ')
  } catch {
    return undefined
  }
}
