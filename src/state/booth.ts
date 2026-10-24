// Mode booth (kiosk untuk acara). Setelan disimpan di localStorage supaya tetap ada walau tab kiosk dibuka ulang.
import { useEffect, useRef, useState } from 'react'
import type { TextValues } from '../templates'

export const RESET_CHOICES = [30, 60, 120] as const

export type BoothSettings = {
  on: boolean
  /** tulisan acara yang otomatis terisi tiap sesi (kosong = tidak diisi) */
  texts: Partial<TextValues>
  /** template tetap untuk semua tamu; null = tamu pilih sendiri */
  templateId: string | null
  /** tamu boleh mengubah tulisan (kalau tidak, langkah isi teks dilewati) */
  editText: boolean
  /** detik tanpa interaksi di halaman hasil sebelum kembali ke awal */
  resetSeconds: (typeof RESET_CHOICES)[number]
  /** minta layar penuh saat sesi dimulai */
  fullscreen: boolean
}

const KEY = 'bilik:booth:v1'

export const DEFAULT_BOOTH: BoothSettings = { on: false, texts: {}, templateId: null, editText: true, resetSeconds: 60, fullscreen: true }

export function loadBooth(): BoothSettings {
  try {
    return { ...DEFAULT_BOOTH, ...(JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<BoothSettings>) }
  } catch {
    return DEFAULT_BOOTH
  }
}

export function saveBooth(b: BoothSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(b))
  } catch {
    // storage diblokir: setelan hanya berlaku sampai tab ditutup
  }
}

/**
 * Hitung mundur tanpa interaksi: tiap sentuhan/klik/tombol mengulang dari awal. `onExpire` dipanggil sekali saat habis.
 * Mengembalikan sisa detik (null kalau tidak aktif).
 */
export function useIdleCountdown(seconds: number | null, onExpire: () => void) {
  const [left, setLeft] = useState<number | null>(seconds)
  const cb = useRef(onExpire)
  cb.current = onExpire
  useEffect(() => {
    if (!seconds) return setLeft(null)
    let last = Date.now()
    const poke = () => (last = Date.now())
    const evs = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const
    evs.forEach((e) => window.addEventListener(e, poke, { passive: true }))
    const id = setInterval(() => {
      const l = Math.max(0, Math.ceil(seconds - (Date.now() - last) / 1000))
      setLeft(l)
      if (l === 0) {
        clearInterval(id)
        cb.current()
      }
    }, 500)
    setLeft(seconds)
    return () => {
      clearInterval(id)
      evs.forEach((e) => window.removeEventListener(e, poke))
    }
  }, [seconds])
  return left
}
