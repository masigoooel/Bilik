import { useCallback, useState } from 'react'
import { photoFromFile } from '../lib/photo'
import { pipelineFor } from '../render/pipeline'
import { templateById } from '../templates'
import { useApp } from './AppState'

/**
 * Fallback tanpa kamera: foto dari galeri (HP) atau file (desktop).
 * Dibaca & di-crop lokal, tidak ada yang diunggah ke server.
 */
export function useUpload() {
  const { templateId, photos, setPhoto, frame } = useApp()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** isi slot mulai dari `start` (atau slot kosong pertama); kembalikan jumlah foto yang terpasang */
  const upload = useCallback(
    async (fileList: FileList | File[] | null, start?: number) => {
      const t = templateById(templateId)
      const files = Array.from(fileList ?? []).filter((f) => f.type.startsWith('image/'))
      if (!t || files.length === 0) {
        if (fileList && Array.from(fileList).length) setError('file itu bukan gambar. pilih jpg, png, atau webp.')
        return 0
      }
      setBusy(true)
      setError(null)
      let placed = 0
      try {
        const targets =
          start !== undefined
            ? Array.from({ length: files.length }, (_, k) => start + k).filter((i) => i < t.photoCount)
            : t.slots.map((_, i) => i).filter((i) => !photos[i])
        for (let k = 0; k < Math.min(files.length, targets.length); k++) {
          const i = targets[k]
          const s = t.slots[i]
          try {
            setPhoto(i, await photoFromFile(files[k], s.w / s.h, pipelineFor(frame, 'upload', false)))
            placed++
          } catch {
            setError('ada gambar yang tidak bisa dibuka. coba pilih gambar lain.')
          }
        }
      } finally {
        setBusy(false)
      }
      return placed
    },
    [templateId, photos, setPhoto, frame],
  )

  return { upload, busy, error }
}

export function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.8" fill="currentColor" />
      <path d="M4 18l5-5 4 4 3-3 4 4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}
