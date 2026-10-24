// Foto contoh untuk showcase beranda.
// Daftar file ada di /public/samples/index.json: { "photos": ["1.jpg", ...] } (path relatif ke /samples/).
// Kalau daftar kosong / gagal dimuat, dipakai gradasi warna lembut sebagai pengganti.
import type { PhotoSource } from '../render/renderTemplate'

/** pasangan warna gradasi pengganti: peach, lilac, mint, langit, mentega, mawar */
const SOFT: [string, string][] = [
  ['#F6D5C4', '#E9A99A'],
  ['#DCD3F2', '#B3A6DE'],
  ['#CFEBDD', '#9FD0B8'],
  ['#CFE2F3', '#9CC0E2'],
  ['#F5E8C2', '#E6CC86'],
  ['#F4CFDA', '#E39DB3'],
]

function gradient([a, b]: [string, string], i: number): PhotoSource {
  const c = document.createElement('canvas')
  c.width = 600
  c.height = 750
  const x = c.getContext('2d')!
  const g = x.createLinearGradient(0, 0, 600, 750)
  g.addColorStop(0, a)
  g.addColorStop(1, b)
  x.fillStyle = g
  x.fillRect(0, 0, 600, 750)
  // cahaya lembut supaya tidak datar
  const r = x.createRadialGradient(180 + i * 40, 220, 0, 180 + i * 40, 220, 520)
  r.addColorStop(0, 'rgba(255,255,255,0.45)')
  r.addColorStop(1, 'rgba(255,255,255,0)')
  x.fillStyle = r
  x.fillRect(0, 0, 600, 750)
  return { source: c, width: 600, height: 750 }
}

function loadImage(src: string) {
  return new Promise<PhotoSource>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve({ source: img, width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = src
  })
}

let cached: Promise<PhotoSource[]> | null = null

/** 6 foto contoh (urutan tetap) */
export function samplePhotos(): Promise<PhotoSource[]> {
  cached ??= (async () => {
    try {
      const res = await fetch('/samples/index.json')
      const list = ((await res.json()) as { photos?: string[] }).photos ?? []
      if (list.length) {
        const imgs = await Promise.all(list.slice(0, 6).map((f) => loadImage(`/samples/${f}`)))
        while (imgs.length < 6) imgs.push(imgs[imgs.length % list.length])
        return imgs
      }
    } catch {
      // tanpa daftar / file rusak: pakai gradasi
    }
    return SOFT.map(gradient)
  })()
  return cached
}
