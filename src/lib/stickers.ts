// Stiker tempel di atas hasil foto: gambar bilik sendiri (bukan emoji), senada dengan stiker wajah & gaya bilik,
// dengan pinggiran putih ala stiker vinyl yang digunting + bayangan lembut.
// Posisi & ukuran relatif terhadap gambar, jadi sama di layar, PNG, story, dan boomerang.

export type Sticker = {
  id: number
  /** jenis stiker (lihat STICKER_SET) */
  kind: string
  /** pusat, 0–1 relatif lebar/tinggi gambar */
  x: number
  y: number
  /** tinggi stiker relatif lebar gambar */
  size: number
  /** derajat */
  rot: number
  /** dicerminkan kiri-kanan */
  flip?: boolean
}

import { STICKER_FONTS, STICKER_SET, textArt } from './stickerArt'

export { STICKER_PACKS, STICKER_SET, TEXT_STYLES, textKind, type TextStyle } from './stickerArt'

type Ctx = CanvasRenderingContext2D

const artById = (id: string) => textArt(id) ?? STICKER_SET.find((a) => a.id === id) ?? STICKER_SET[0]

/** ukuran awal saat ditempel (tinggi relatif lebar gambar): stiker lebar dibuat lebih pendek supaya lebarnya ±1/3 foto */
export const defaultSize = (kind: string) => Math.min(0.16, 0.34 / artById(kind).w)

/** tunggu font stiker tulisan siap (sekali), supaya gambarnya tidak memakai font cadangan */
let fontsReady: Promise<unknown> | null = null
export function loadStickerFonts() {
  fontsReady ??= document.fonts ? Promise.all(STICKER_FONTS.map((f) => document.fonts.load(f).catch(() => null))) : Promise.resolve()
  return fontsReady
}

// ---------- stiker jadi: pinggiran putih + bayangan, dipotong rapat, disimpan per ukuran ----------

// jarak Euclid kuadrat ke piksel terisi (Felzenszwalb & Huttenlocher): baris lalu kolom, di tempat
function edt1(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0
  v[0] = 0
  z[0] = -Infinity
  z[1] = Infinity
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    while (s <= z[k]) {
      k--
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    }
    k++
    v[k] = q
    z[k] = s
    z[k + 1] = Infinity
  }
  k = 0
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]
  }
}

function edt(g: Float64Array, w: number, h: number) {
  const n = Math.max(w, h)
  const f = new Float64Array(n)
  const d = new Float64Array(n)
  const v = new Int32Array(n)
  const z = new Float64Array(n + 1)
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = g[y * w + x]
    edt1(f, h, d, v, z)
    for (let y = 0; y < h; y++) g[y * w + x] = d[y]
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = g[y * w + x]
    edt1(f, w, d, v, z)
    for (let x = 0; x < w; x++) g[y * w + x] = d[x]
  }
}

type Sprite = { canvas: HTMLCanvasElement; /** tinggi gambar inti (px) */ h: number }
const cache = new Map<string, Sprite>()

/** stiker setinggi `px` sudah dengan pinggiran putih & bayangan; pusat kanvas = pusat stiker */
export function stickerSprite(kind: string, px: number): Sprite {
  const art = artById(kind)
  const h = Math.max(8, Math.round(px))
  const key = `${art.id}@${h}`
  const hit = cache.get(key)
  if (hit) return hit
  if (cache.size > 120) cache.clear()
  const edge = Math.max(2, h * 0.075)
  // ruang gambar longgar (lebar tulisan tergantung font), nanti dipotong ke isi
  const W = Math.ceil(h * (art.w + 0.8) + edge * 2)
  const H = Math.ceil(h * 1.6 + edge * 2)
  // 1) gambar
  const a = document.createElement('canvas')
  a.width = W
  a.height = H
  const ax = a.getContext('2d', { willReadFrequently: true })!
  ax.translate(W / 2, H / 2)
  art.draw(ax, h)
  // 2) pinggiran putih: semua titik yang jaraknya ≤ edge dari gambar (jarak Euclid tepat, jadi ujung lancip tetap mulus)
  const src = ax.getImageData(0, 0, W, H).data
  const INF = 1e20
  const d2 = new Float64Array(W * H)
  for (let i = 0; i < W * H; i++) d2[i] = src[i * 4 + 3] > 24 ? 0 : INF
  edt(d2, W, H)
  const o = document.createElement('canvas')
  o.width = W
  o.height = H
  const ox = o.getContext('2d')!
  const img = ox.createImageData(W, H)
  const rgba = img.data
  // 3) batas isi, supaya stiker berpusat di bentuknya sendiri
  let x0 = W
  let y0 = H
  let x1 = -1
  let y1 = -1
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x
      const v = Math.min(1, Math.max(0, edge + 0.5 - Math.sqrt(d2[i])))
      if (!v) continue
      rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = 255
      rgba[i * 4 + 3] = v * 255
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
  ox.putImageData(img, 0, 0)
  if (x1 < 0) {
    x0 = y0 = 0
    x1 = W - 1
    y1 = H - 1
  }
  // 4) bayangan lembut di bawah pinggiran, lalu gambar di atasnya
  const m = Math.ceil(h * 0.12)
  const out = document.createElement('canvas')
  out.width = x1 - x0 + 1 + m * 2
  out.height = y1 - y0 + 1 + m * 2
  const x = out.getContext('2d')!
  x.translate(m - x0, m - y0)
  x.shadowColor = 'rgba(17,17,17,0.3)'
  x.shadowBlur = h * 0.06
  x.shadowOffsetY = h * 0.025
  x.drawImage(o, 0, 0)
  x.shadowColor = 'transparent'
  x.drawImage(a, 0, 0)
  a.width = a.height = o.width = o.height = 0
  const sp = { canvas: out, h }
  cache.set(key, sp)
  return sp
}

const previews = new Map<string, { url: string; w: number; h: number }>()
/** gambar stiker untuk palet & editor: data URL + ukuran kanvas relatif tinggi gambar intinya */
export function stickerPreview(kind: string, px = 200) {
  const key = `${kind}@${px}`
  let p = previews.get(key)
  if (!p) {
    const sp = stickerSprite(kind, px)
    p = { url: sp.canvas.toDataURL('image/png'), w: sp.canvas.width / sp.h, h: sp.canvas.height / sp.h }
    if (previews.size > 300) previews.clear()
    previews.set(key, p)
  }
  return p
}

export const stickerName = (kind: string) => artById(kind).name

/** gambar stiker ke kanvas berukuran w × h (koordinat piksel kanvas) */
export function drawStickers(ctx: Ctx, list: Sticker[], w: number, h: number) {
  for (const s of list) {
    const { canvas: c } = stickerSprite(s.kind, s.size * w)
    ctx.save()
    ctx.translate(s.x * w, s.y * h)
    ctx.rotate((s.rot * Math.PI) / 180)
    if (s.flip) ctx.scale(-1, 1)
    ctx.drawImage(c, -c.width / 2, -c.height / 2)
    ctx.restore()
  }
}

/** hasil asli + stiker → PNG baru */
export async function bakeStickers(src: Blob, list: Sticker[]): Promise<Blob> {
  await loadStickerFonts()
  const url = URL.createObjectURL(src)
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image()
      i.onload = () => res(i)
      i.onerror = rej
      i.src = url
    })
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    const x = c.getContext('2d', { alpha: false })!
    x.drawImage(img, 0, 0)
    drawStickers(x, list, c.width, c.height)
    return await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('gagal'))), 'image/png'))
  } finally {
    URL.revokeObjectURL(url)
  }
}
