let lenisInstance = null

export const setLenis = (l) => {
  lenisInstance = l
}
export const getLenis = () => lenisInstance

/** Smooth-scroll to "#id" (or a number), respecting the fixed navbar. */
export function scrollToTarget(target, { offset = -84, immediate = false } = {}) {
  if (target === '#top' || target === 0) {
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate })
    else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenisInstance) lenisInstance.scrollTo(el, { offset, immediate, duration: 1.2 })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
}

export function handleAnchorClick(e, href, after) {
  if (!href?.startsWith('#')) return
  e.preventDefault()
  after?.()
  scrollToTarget(href)
  history.replaceState(null, '', href === '#top' ? window.location.pathname + window.location.search : href)
}
