// Warna latar & aksen sebuah template, untuk lingkaran pilihan "warna template".
// Diambil dari render kecil template (tanpa area foto), lalu diputar hue-nya dengan rumus yang sama seperti renderer.
import type { Template } from '../templates'
import { renderTemplate } from '../render/renderTemplate'
import { hueRotateColor } from '../render/filters'
import { SAMPLE_TEXTS } from '../components/TemplateThumb'

export type RGB = [number, number, number]
export type Palette = { bg: RGB; accent: RGB }

const cache = new Map<string, Promise<Palette>>()

const dist = (a: RGB, b: RGB) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
const chroma = ([r, g, b]: RGB) => (Math.max(r, g, b) - Math.min(r, g, b)) / 255

async function measure(t: Template): Promise<Palette> {
  const H = 120
  const s = H / t.height
  const canvas = await renderTemplate(t, { scale: s, texts: SAMPLE_TEXTS })
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  const { width: w, height: h } = canvas
  const d = ctx.getImageData(0, 0, w, h).data
  canvas.width = canvas.height = 0
  // area foto (placeholder abu) tidak dihitung
  const inSlot = (x: number, y: number) => t.slots.some((sl) => x >= sl.x * s && x < (sl.x + sl.w) * s && y >= sl.y * s && y < (sl.y + sl.h) * s)
  const buckets = new Map<number, { n: number; r: number; g: number; b: number }>()
  let total = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (inSlot(x + 0.5, y + 0.5)) continue
      const i = (y * w + x) * 4
      if (d[i + 3] < 200) continue
      const key = ((d[i] >> 4) << 8) | ((d[i + 1] >> 4) << 4) | (d[i + 2] >> 4)
      const k = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 }
      k.n++
      k.r += d[i]
      k.g += d[i + 1]
      k.b += d[i + 2]
      buckets.set(key, k)
      total++
    }
  }
  const list = [...buckets.values()].map((k) => ({ n: k.n, c: [k.r / k.n, k.g / k.n, k.b / k.n] as RGB })).sort((a, b) => b.n - a.n)
  if (!list.length) return { bg: [255, 255, 255], accent: [17, 17, 17] }
  // latar: dari data template (warna solid / titik pertama gradasi); kalau tak terbaca, warna terbanyak di render
  const bg = parseColor(t.background) ?? list[0].c
  // aksen: warna paling "berwarna" yang cukup sering muncul & beda dari latar; kalau template hitam-putih, warna kedua terbanyak
  const others = list.filter((k) => k.n >= total * 0.004 && dist(k.c, bg) > 60)
  const colorful = others.filter((k) => chroma(k.c) >= 0.2).sort((a, b) => chroma(b.c) * Math.sqrt(b.n) - chroma(a.c) * Math.sqrt(a.n))
  const accent = colorful[0]?.c ?? others[0]?.c ?? bg
  return { bg: bg.map(Math.round) as RGB, accent: accent.map(Math.round) as RGB }
}

function parseColor(b: Template['background']): RGB | null {
  const str = b.type === 'solid' ? b.color : b.stops[0]?.[1]
  if (!str) return null
  const c = document.createElement('canvas').getContext('2d')!
  c.fillStyle = '#000'
  c.fillStyle = str
  const m = String(c.fillStyle).match(/^#([0-9a-f]{6})$/i)
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) as RGB
  const r = String(c.fillStyle).match(/rgba?\(([^)]+)\)/)
  return r ? (r[1].split(',').slice(0, 3).map((v) => Math.round(+v)) as RGB) : null
}

export function templatePalette(t: Template) {
  let p = cache.get(t.id)
  if (!p) {
    p = measure(t)
    cache.set(t.id, p)
  }
  return p
}

export const rotate = (p: Palette, hue: number): Palette => ({ bg: hueRotateColor(p.bg, hue), accent: hueRotateColor(p.accent, hue) })
export const css = ([r, g, b]: RGB) => `rgb(${r} ${g} ${b})`

/** nama warna (bahasa sehari-hari) dari aksen */
export function colorName([r, g, b]: RGB) {
  const max = Math.max(r, g, b) / 255
  const min = Math.min(r, g, b) / 255
  const l = (max + min) / 2
  const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1))
  if (l < 0.14) return 'hitam'
  if (l > 0.93) return 'putih'
  if (s < 0.15) return 'abu'
  let hh = 0
  const R = r / 255
  const G = g / 255
  const B = b / 255
  if (max === R) hh = ((G - B) / (max - min)) % 6
  else if (max === G) hh = (B - R) / (max - min) + 2
  else hh = (R - G) / (max - min) + 4
  const deg = (hh * 60 + 360) % 360
  if (deg < 14) return 'merah'
  if (deg < 40) return 'oranye'
  if (deg < 66) return 'kuning'
  if (deg < 160) return 'hijau'
  if (deg < 196) return 'toska'
  if (deg < 250) return 'biru'
  if (deg < 290) return 'ungu'
  if (deg < 338) return 'pink'
  return 'merah'
}
