import { scrollToTarget } from './scroll'

const EVENT = 'mimo:prefill-booking'

/** Ask the booking widget to pre-select a service / pet type / location, then scroll to it. */
export function prefillBooking(detail) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail }))
  scrollToTarget('#booking')
}

export function onPrefillBooking(handler) {
  const fn = (e) => handler(e.detail || {})
  window.addEventListener(EVENT, fn)
  return () => window.removeEventListener(EVENT, fn)
}
