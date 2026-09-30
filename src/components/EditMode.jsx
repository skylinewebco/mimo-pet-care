import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, ImagePlus, Link2, RotateCcw, Upload, X, Check, Images, Pencil } from 'lucide-react'
import { useImageStore } from '../lib/ImageStore'
import { getLenis } from '../lib/scroll'
import { cx } from '../lib/format'

/** Owner-only "CHANGE IMAGE" chip. Renders nothing on the public site. */
export function ChangeImageButton({ imageKey, label, library = [], current, className = '' }) {
  const store = useImageStore()
  if (!store?.editMode) return null
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        store.openPicker({ key: imageKey, label, library, current })
      }}
      className={cx(
        'absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border-1.5 border-maroon bg-yellow px-3 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-wider text-maroon shadow-soft transition-transform hover:scale-105',
        className
      )}
    >
      <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
      Change image
    </button>
  )
}

/** Resize an uploaded file in the browser so it fits comfortably in localStorage. */
function fileToDataUrl(file, maxSize = 1400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

const TABS = [
  { id: 'library', label: 'Library', icon: Images },
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'url', label: 'Image URL', icon: Link2 },
]

export function ImagePickerModal() {
  const store = useImageStore()
  const picker = store?.picker
  const [tab, setTab] = useState('library')
  const [url, setUrl] = useState('')
  const [urlState, setUrlState] = useState('idle') // idle | ok | error
  const [upload, setUpload] = useState(null)
  const [busy, setBusy] = useState(false)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!picker) return
    setTab('library')
    setUrl('')
    setUrlState('idle')
    setUpload(null)
    getLenis()?.stop()
    const prev = document.activeElement
    const t = setTimeout(() => dialogRef.current?.querySelector('button')?.focus(), 50)
    const onKey = (e) => {
      if (e.key === 'Escape') store.closePicker()
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll('button, input, [href]')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      getLenis()?.start()
      prev?.focus?.()
    }
  }, [picker]) // eslint-disable-line react-hooks/exhaustive-deps

  const apply = (src) => {
    store.setImage(picker.key, src)
    store.closePicker()
  }

  const currentSrc = picker ? store.getImage(picker.key, picker.current) : ''

  return (
    <AnimatePresence>
      {picker && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-maroon-deep/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && store.closePicker()}
          data-lenis-prevent
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="picker-title"
            className="flex max-h-[88svh] w-full max-w-3xl flex-col overflow-hidden rounded-4xl border-1.5 border-maroon bg-cream shadow-lift"
            initial={{ y: 40, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <div className="flex items-start justify-between gap-4 border-b-1.5 border-maroon/20 p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-1.5 border-maroon bg-peach">
                  {currentSrc && <img src={currentSrc} alt="" className="h-full w-full object-cover" />}
                </div>
                <div>
                  <p className="eyebrow text-maroon/70">Change image</p>
                  <h2 id="picker-title" className="font-display text-2xl font-bold uppercase leading-tight">
                    {picker.label}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={store.closePicker}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-1.5 border-maroon transition-colors hover:bg-maroon hover:text-white"
                aria-label="Close image picker"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-2 px-5 pt-4 sm:px-6" role="tablist" aria-label="Image source">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={cx(
                    'inline-flex items-center gap-2 rounded-full border-1.5 border-maroon px-4 py-2 text-sm font-bold transition-colors',
                    tab === id ? 'bg-maroon text-white' : 'hover:bg-maroon/10'
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6" data-lenis-prevent>
              {tab === 'library' && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {picker.library.map((item) => {
                    const active = item.src === currentSrc
                    return (
                      <button
                        key={item.src}
                        type="button"
                        onClick={() => apply(item.src)}
                        className={cx(
                          'group relative aspect-[4/3] overflow-hidden rounded-2xl border-1.5 transition-transform hover:-translate-y-0.5',
                          active ? 'border-maroon ring-4 ring-yellow' : 'border-maroon/30'
                        )}
                        aria-label={`Use image: ${item.alt}`}
                      >
                        <img src={item.src.replace('w=900', 'w=400')} alt="" loading="lazy" className="h-full w-full object-cover" />
                        {active && (
                          <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-yellow text-maroon">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {tab === 'upload' && (
                <div className="space-y-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-1.5 border-dashed border-maroon/50 bg-white/50 px-6 py-10 text-center transition-colors hover:bg-white">
                    <Upload className="h-8 w-8" aria-hidden="true" />
                    <span className="font-display text-xl font-semibold">Choose a photo from your device</span>
                    <span className="text-sm text-maroon/70">JPG, PNG or WEBP. We resize it automatically.</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setBusy(true)
                        try {
                          setUpload(await fileToDataUrl(file))
                        } finally {
                          setBusy(false)
                        }
                      }}
                    />
                  </label>
                  {busy && <p className="text-sm font-semibold">Preparing image…</p>}
                  {upload && (
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                      <img src={upload} alt="Uploaded preview" className="h-40 w-56 rounded-2xl border-1.5 border-maroon object-cover" />
                      <button type="button" className="btn-solid" onClick={() => apply(upload)}>
                        <Check className="h-4 w-4" /> Use this photo
                      </button>
                    </div>
                  )}
                </div>
              )}

              {tab === 'url' && (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (urlState === 'ok') apply(url.trim())
                  }}
                >
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">Paste an image address</span>
                    <input
                      className="input"
                      type="url"
                      inputMode="url"
                      placeholder="https://…/my-pet.jpg"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value)
                        setUrlState(e.target.value.trim() ? 'loading' : 'idle')
                      }}
                    />
                  </label>
                  {url.trim() && (
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                      <div className="grid h-40 w-56 place-items-center overflow-hidden rounded-2xl border-1.5 border-maroon bg-white/60 text-sm">
                        {urlState === 'error' ? (
                          <span className="px-4 text-center">Couldn’t load that image. Check the link.</span>
                        ) : (
                          <img
                            src={url.trim()}
                            alt="Preview from URL"
                            className="h-full w-full object-cover"
                            onLoad={() => setUrlState('ok')}
                            onError={() => setUrlState('error')}
                          />
                        )}
                      </div>
                      <button type="submit" className="btn-solid disabled:opacity-40" disabled={urlState !== 'ok'}>
                        <Check className="h-4 w-4" /> Use this image
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Floating owner toolbar (only when ?edit=true). */
export function EditToolbar() {
  const store = useImageStore()
  const [toast, setToast] = useState('')
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(t)
  }, [toast])
  if (!store?.editMode) return null

  return (
    <div className="fixed inset-x-3 bottom-3 z-[110] flex justify-center sm:inset-x-auto sm:left-4 sm:bottom-4">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-[28px] border-1.5 border-maroon bg-cream/95 p-2 shadow-lift backdrop-blur">
        <span className="inline-flex items-center gap-2 rounded-full bg-maroon px-3.5 py-2 text-[0.7rem] font-extrabold uppercase tracking-wider text-white">
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit mode
          <span className="rounded-full bg-yellow px-2 py-0.5 text-maroon">{store.changedCount}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            store.exportConfig()
            setToast('Config downloaded')
          }}
          className="inline-flex items-center gap-1.5 rounded-full border-1.5 border-maroon px-3.5 py-2 text-[0.72rem] font-extrabold uppercase tracking-wider transition-colors hover:bg-maroon hover:text-white"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" /> Export config
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Restore every image to the default configuration?')) {
              store.resetImages()
              setToast('Images reset')
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-full border-1.5 border-maroon px-3.5 py-2 text-[0.72rem] font-extrabold uppercase tracking-wider transition-colors hover:bg-maroon hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset images
        </button>
        <a
          href={window.location.pathname}
          className="inline-flex items-center rounded-full px-3 py-2 text-[0.72rem] font-extrabold uppercase tracking-wider underline-offset-4 hover:underline"
        >
          Exit
        </a>
      </div>
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0">
      <AnimatePresence>
        {(toast || store.saveError) && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="whitespace-nowrap rounded-full bg-maroon px-4 py-2 text-xs font-bold text-white"
          >
            {store.saveError || toast}
          </motion.p>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
