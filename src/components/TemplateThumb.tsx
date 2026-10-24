import { useEffect, useRef, useState } from 'react'
import type { Template, TextValues } from '../templates'
import { renderTemplate } from '../render/renderTemplate'
import { todayLabel } from '../lib/date'

const cache = new Map<string, string>()

export const SAMPLE_TEXTS: TextValues = {
  nama: 'igul',
  nama2: 'jerico',
  tempat: 'jakarta',
  tanggal: todayLabel(),
  catatan: 'hari yang baik',
}

type Props = {
  template: Template
  /** lebar tampil dalam px CSS */
  width: number
  /** teks live (layar isi teks). tanpa ini dipakai contoh teks & hasilnya di-cache */
  texts?: Partial<TextValues>
  className?: string
  alt?: string
  /** render baru saat hampir terlihat (grid panjang) */
  lazy?: boolean
  /** warna aksen (putaran hue lapisan desain) */
  hue?: number
}

export function TemplateThumb({ template, width, texts, className = '', alt = '', lazy = false, hue = 0 }: Props) {
  const key = texts ? null : `${template.id}@${width}~${hue}`
  const [src, setSrc] = useState<string | null>(() => (key ? (cache.get(key) ?? null) : null))
  const box = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(!lazy)

  useEffect(() => {
    if (visible || !box.current || typeof IntersectionObserver === 'undefined') return setVisible(true)
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setVisible(true), { rootMargin: '400px' })
    io.observe(box.current)
    return () => io.disconnect()
  }, [visible])

  useEffect(() => {
    let alive = true
    const hit = key ? cache.get(key) : undefined
    if (hit) {
      setSrc(hit)
      return
    }
    if (!visible) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const timer = setTimeout(
      async () => {
        const canvas = await renderTemplate(template, { scale: (width * dpr) / template.width, texts: texts ?? SAMPLE_TEXTS, hue })
        const url = canvas.toDataURL('image/jpeg', 0.86)
        canvas.width = canvas.height = 0
        if (key) cache.set(key, url)
        if (alive) setSrc(url)
      },
      texts ? 150 : 0,
    )
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [template, width, key, texts, visible, hue])

  return (
    <div
      ref={box}
      className={`relative overflow-hidden bg-line/60 ${className}`}
      style={{ aspectRatio: `${template.width} / ${template.height}` }}
    >
      {src ? (
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      ) : (
        <div className="absolute inset-0 animate-pulse bg-line/70" />
      )}
    </div>
  )
}
