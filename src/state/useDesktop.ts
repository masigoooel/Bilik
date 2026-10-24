import { useEffect, useState } from 'react'

/** desktop (≥1024px) vs HP/tablet; dipakai layar yang tata letaknya berbeda total, supaya hanya satu versi yang dirender */
export function useDesktop() {
  const q = '(min-width: 1024px)'
  const [d, setD] = useState(() => matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const on = () => setD(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return d
}
