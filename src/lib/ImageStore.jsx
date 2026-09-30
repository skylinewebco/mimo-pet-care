import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import siteConfig from '../data/siteConfig'

const STORAGE_KEY = 'mimo:image-overrides:v1'
const ImageStoreContext = createContext(null)

const readStored = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

/**
 * Holds owner image overrides (saved in localStorage) and edit-mode state.
 * Image keys: `hero:<id>` and `service:<id>`.
 */
export function ImageStoreProvider({ children }) {
  const editMode = useMemo(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('edit') === 'true'
  }, [])
  const [overrides, setOverrides] = useState(readStored)
  const [picker, setPicker] = useState(null) // { key, label, library, current }
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    try {
      if (Object.keys(overrides).length) localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
      else localStorage.removeItem(STORAGE_KEY)
      setSaveError('')
    } catch {
      setSaveError('Browser storage is full — try a smaller image or an image URL instead.')
    }
  }, [overrides])

  const getImage = useCallback((key, fallback) => overrides[key] || fallback, [overrides])

  const setImage = useCallback((key, src) => {
    setOverrides((o) => ({ ...o, [key]: src }))
  }, [])

  const resetImages = useCallback(() => setOverrides({}), [])

  const exportConfig = useCallback(() => {
    const config = structuredClone(siteConfig)
    config.heroPets = config.heroPets.map((p) => ({ ...p, image: overrides[`hero:${p.id}`] || p.image }))
    config.services = config.services.map((s) => ({ ...s, image: overrides[`service:${s.id}`] || s.image }))
    config._exportedAt = new Date().toISOString()
    config._changedImages = Object.keys(overrides)
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mimo-site-config-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, [overrides])

  const value = useMemo(
    () => ({
      editMode,
      overrides,
      changedCount: Object.keys(overrides).length,
      getImage,
      setImage,
      resetImages,
      exportConfig,
      picker,
      openPicker: setPicker,
      closePicker: () => setPicker(null),
      saveError,
    }),
    [editMode, overrides, getImage, setImage, resetImages, exportConfig, picker, saveError]
  )

  return <ImageStoreContext.Provider value={value}>{children}</ImageStoreContext.Provider>
}

export const useImageStore = () => useContext(ImageStoreContext)
