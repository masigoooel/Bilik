// Filter warna sebagai data + satu fungsi applyFilter(ctx, preset).
// Semua nilai "px" (blur, chromaShift, pixelate) relatif terhadap gambar dengan sisi terpanjang
// 1080px, lalu diskalakan ke ukuran kanvas, supaya preview kecil dan foto resolusi penuh terlihat sama.

export type FilterGroup = 'dasar' | 'analog' | 'hitam putih' | 'warna' | 'gaya'

export type FilterPreset = {
  id: string
  name: string
  group: FilterGroup
  brightness?: number
  contrast?: number
  saturate?: number
  hueRotate?: number
  sepia?: number
  grayscale?: number
  blur?: number
  tint?: { color: string; opacity: number; blend: GlobalCompositeOperation }
  /** 0–1 */
  grain?: number
  /** 0–1 */
  vignette?: number
  /** angkat warna hitam, 0–1 */
  fade?: number
  /** gradasi oranye di pojok */
  lightLeak?: boolean
  /** garis horizontal ala VHS */
  scanlines?: boolean
  /** geser channel merah/biru dalam px */
  chromaShift?: number
  /** ukuran blok pixel */
  pixelate?: number
  /** suhu warna: + hangat (merah naik, biru turun), − sejuk; −1…1 */
  warmth?: number
  /** warna bayangan & sorotan (mis. teal–oranye); amount 0–1 */
  splitTone?: { shadow: string; highlight: string; amount: number }
  /** peta luminans ke gradasi dua warna (gelap → terang) */
  duotone?: [string, string]
  /** jumlah tingkat warna per channel (efek poster / pop art) */
  posterize?: number
  /** negatif film */
  invert?: boolean
  /** cahaya lembut di area terang (bloom), 0–1 */
  glow?: number
  /** haluskan kulit: blur hanya di area berwarna kulit & tanpa tepi tajam, 0–1 */
  smooth?: number
}

export type FilterId = string

export const FILTER_GROUPS: FilterGroup[] = ['dasar', 'analog', 'hitam putih', 'warna', 'gaya']

export const FILTERS: FilterPreset[] = [
  // dasar
  { id: 'normal', name: 'normal', group: 'dasar' },
  { id: 'cerah', name: 'cerah', group: 'dasar', brightness: 1.12, contrast: 1.04, saturate: 1.08 },
  { id: 'kontras', name: 'kontras', group: 'dasar', contrast: 1.32, saturate: 1.1, brightness: 0.98 },
  { id: 'lembut', name: 'lembut', group: 'dasar', contrast: 0.88, brightness: 1.05, saturate: 0.92, fade: 0.14, blur: 0.8 },
  { id: 'hangat', name: 'hangat', group: 'dasar', warmth: 0.7, saturate: 1.05, brightness: 1.03 },
  { id: 'sejuk', name: 'sejuk', group: 'dasar', warmth: -0.7, contrast: 1.03, brightness: 1.02 },
  { id: 'pekat', name: 'pekat', group: 'dasar', saturate: 1.55, contrast: 1.15, brightness: 0.98 },
  { id: 'kulit-halus', name: 'kulit halus', group: 'dasar', smooth: 0.85, brightness: 1.04, saturate: 1.03, warmth: 0.15 },
  // analog
  {
    id: 'film-hangat',
    name: 'film hangat',
    group: 'analog',
    sepia: 0.16,
    saturate: 1.1,
    contrast: 0.95,
    tint: { color: '#FF9A3C', opacity: 0.16, blend: 'soft-light' },
    grain: 0.35,
    vignette: 0.35,
    fade: 0.1,
  },
  {
    id: 'film-dingin',
    name: 'film dingin',
    group: 'analog',
    saturate: 0.9,
    contrast: 1.05,
    hueRotate: -6,
    tint: { color: '#3C7BFF', opacity: 0.16, blend: 'soft-light' },
    grain: 0.3,
    vignette: 0.3,
    fade: 0.12,
  },
  { id: 'pudar', name: 'pudar', group: 'analog', contrast: 0.82, saturate: 0.7, brightness: 1.06, fade: 0.32, grain: 0.15 },
  {
    id: 'hangat-klasik',
    name: 'hangat klasik',
    group: 'analog',
    sepia: 0.35,
    saturate: 1.15,
    contrast: 1.05,
    tint: { color: '#FFB36B', opacity: 0.14, blend: 'overlay' },
    vignette: 0.45,
    grain: 0.2,
  },
  {
    id: 'light-leak',
    name: 'light leak',
    group: 'analog',
    lightLeak: true,
    saturate: 1.08,
    contrast: 0.96,
    fade: 0.08,
    grain: 0.25,
  },
  {
    id: 'polaroid',
    name: 'polaroid',
    group: 'analog',
    contrast: 0.9,
    saturate: 0.85,
    brightness: 1.04,
    fade: 0.18,
    splitTone: { shadow: '#2E7C8C', highlight: '#FFE2A8', amount: 0.35 },
    vignette: 0.25,
    grain: 0.2,
  },
  {
    id: 'film-90an',
    name: 'film 90-an',
    group: 'analog',
    contrast: 1.08,
    saturate: 1.12,
    warmth: 0.25,
    splitTone: { shadow: '#2F5E3C', highlight: '#FFD39A', amount: 0.3 },
    grain: 0.4,
    vignette: 0.3,
    fade: 0.06,
  },
  {
    id: 'cross',
    name: 'cross',
    group: 'analog',
    contrast: 1.25,
    saturate: 1.3,
    splitTone: { shadow: '#1B3FA6', highlight: '#FFF06A', amount: 0.45 },
    vignette: 0.2,
  },
  // hitam putih
  { id: 'mono', name: 'mono', group: 'hitam putih', grayscale: 1, contrast: 1.05 },
  { id: 'mono-kontras', name: 'mono kontras', group: 'hitam putih', grayscale: 1, contrast: 1.45, brightness: 1.02, grain: 0.2 },
  { id: 'noir', name: 'noir', group: 'hitam putih', grayscale: 1, contrast: 1.6, brightness: 0.9, vignette: 0.6, grain: 0.3 },
  { id: 'sepia', name: 'sepia', group: 'hitam putih', sepia: 1, contrast: 1.05, vignette: 0.25, grain: 0.15 },
  { id: 'abu-lembut', name: 'abu lembut', group: 'hitam putih', grayscale: 1, contrast: 0.85, brightness: 1.06, fade: 0.2 },
  { id: 'selenium', name: 'selenium', group: 'hitam putih', grayscale: 1, contrast: 1.2, splitTone: { shadow: '#4A2E5C', highlight: '#F3EADF', amount: 0.4 }, grain: 0.15 },
  { id: 'sianotip', name: 'sianotip', group: 'hitam putih', contrast: 1.1, duotone: ['#0B2A5B', '#E8F1F8'], grain: 0.2, vignette: 0.2 },
  // warna
  { id: 'pink', name: 'pink', group: 'warna', brightness: 1.04, saturate: 1.05, tint: { color: '#FF3E8A', opacity: 0.24, blend: 'soft-light' } },
  { id: 'peach', name: 'peach', group: 'warna', brightness: 1.05, contrast: 0.95, fade: 0.06, tint: { color: '#FFB38A', opacity: 0.3, blend: 'soft-light' } },
  { id: 'mint', name: 'mint', group: 'warna', brightness: 1.04, saturate: 0.95, tint: { color: '#5FE0B4', opacity: 0.24, blend: 'soft-light' } },
  {
    id: 'ungu-senja',
    name: 'ungu senja',
    group: 'warna',
    contrast: 1.05,
    saturate: 1.1,
    hueRotate: -10,
    vignette: 0.3,
    tint: { color: '#7A3CFF', opacity: 0.28, blend: 'soft-light' },
  },
  { id: 'teal-oranye', name: 'teal oranye', group: 'warna', contrast: 1.1, saturate: 1.15, splitTone: { shadow: '#007C80', highlight: '#FF9A4D', amount: 0.45 } },
  { id: 'emas', name: 'emas', group: 'warna', warmth: 0.6, saturate: 1.1, contrast: 1.03, glow: 0.35, tint: { color: '#FFC24D', opacity: 0.18, blend: 'soft-light' }, vignette: 0.2 },
  { id: 'duo-pink', name: 'duo pink', group: 'warna', contrast: 1.15, duotone: ['#2B0A3D', '#FF8DB8'] },
  { id: 'duo-biru', name: 'duo biru', group: 'warna', contrast: 1.15, duotone: ['#10225E', '#FFC9A3'] },
  // gaya
  { id: 'glossy', name: 'glossy', group: 'gaya', saturate: 1.35, contrast: 1.08, brightness: 1.08 },
  { id: 'vhs', name: 'vhs', group: 'gaya', chromaShift: 4, scanlines: true, saturate: 1.2, contrast: 1.1, blur: 0.9, grain: 0.25, fade: 0.05 },
  { id: 'pixel', name: 'pixel', group: 'gaya', pixelate: 12, saturate: 1.2, contrast: 1.1 },
  { id: 'mimpi', name: 'mimpi', group: 'gaya', glow: 0.7, brightness: 1.06, contrast: 0.92, saturate: 1.05, fade: 0.08, tint: { color: '#FFC6E0', opacity: 0.18, blend: 'soft-light' } },
  { id: 'pop-art', name: 'pop art', group: 'gaya', posterize: 4, saturate: 1.6, contrast: 1.2 },
  { id: 'risograf', name: 'risograf', group: 'gaya', duotone: ['#1F3B8C', '#FF6FA8'], posterize: 5, contrast: 1.1, grain: 0.45 },
  { id: 'glitch', name: 'glitch', group: 'gaya', chromaShift: 10, scanlines: true, saturate: 1.3, contrast: 1.15, hueRotate: 12 },
  { id: 'negatif', name: 'negatif', group: 'gaya', invert: true, contrast: 1.05 },
]

export function filterById(id: string | null | undefined): FilterPreset {
  return FILTERS.find((f) => f.id === id) ?? FILTERS[0]
}

/** filter selain normal bisa diatur kekuatannya */
export const filterHasStrength = (p: FilterPreset) => p.id !== 'normal'

// ---------- matriks warna (urutan sama dengan CSS: brightness → contrast → saturate → hue → sepia → grayscale) ----------

/** matriks 3x4 affine: [r g b offset] per baris, offset dalam skala 0–255 */
type M = number[]

const ID: M = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]

function mul(a: M, b: M): M {
  // hasil = a ∘ b (b diterapkan dulu)
  const o: M = new Array(12)
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) o[r * 4 + c] = a[r * 4] * b[c] + a[r * 4 + 1] * b[4 + c] + a[r * 4 + 2] * b[8 + c]
    o[r * 4 + 3] = a[r * 4] * b[3] + a[r * 4 + 1] * b[7] + a[r * 4 + 2] * b[11] + a[r * 4 + 3]
  }
  return o
}

const scale = (s: number): M => [s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0]
const contrastM = (c: number): M => [c, 0, 0, 127.5 * (1 - c), 0, c, 0, 127.5 * (1 - c), 0, 0, c, 127.5 * (1 - c)]

function saturateM(s: number): M {
  return [
    0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s, 0,
    0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s, 0,
    0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s, 0,
  ]
}

function hueM(deg: number): M {
  const a = (deg * Math.PI) / 180
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [
    0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928, 0,
    0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.14, 0.072 - c * 0.072 - s * 0.283, 0,
    0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072, 0,
  ]
}

function sepiaM(t: number): M {
  const k = 1 - t
  return [
    0.393 + 0.607 * k, 0.769 - 0.769 * k, 0.189 - 0.189 * k, 0,
    0.349 - 0.349 * k, 0.686 + 0.314 * k, 0.168 - 0.168 * k, 0,
    0.272 - 0.272 * k, 0.534 - 0.534 * k, 0.131 + 0.869 * k, 0,
  ]
}

function grayM(t: number): M {
  const k = 1 - t
  return [
    0.2126 + 0.7874 * k, 0.7152 - 0.7152 * k, 0.0722 - 0.0722 * k, 0,
    0.2126 - 0.2126 * k, 0.7152 + 0.2848 * k, 0.0722 - 0.0722 * k, 0,
    0.2126 - 0.2126 * k, 0.7152 - 0.7152 * k, 0.0722 + 0.9278 * k, 0,
  ]
}

const lerp = (from: number, to: number, t: number) => from + (to - from) * t

/** preset dengan kekuatan t (0–1): semua nilai diinterpolasi dari "tanpa efek" ke nilai preset */
function resolve(p: FilterPreset, t: number) {
  return {
    brightness: lerp(1, p.brightness ?? 1, t),
    contrast: lerp(1, p.contrast ?? 1, t),
    saturate: lerp(1, p.saturate ?? 1, t),
    hueRotate: (p.hueRotate ?? 0) * t,
    sepia: (p.sepia ?? 0) * t,
    grayscale: (p.grayscale ?? 0) * t,
    blur: (p.blur ?? 0) * t,
    tint: p.tint ? { ...p.tint, opacity: p.tint.opacity * t } : null,
    grain: (p.grain ?? 0) * t,
    vignette: (p.vignette ?? 0) * t,
    fade: (p.fade ?? 0) * t,
    lightLeak: p.lightLeak ? t : 0,
    scanlines: p.scanlines ? t : 0,
    chromaShift: (p.chromaShift ?? 0) * t,
    pixelate: p.pixelate ? lerp(1, p.pixelate, t) : 1,
    warmth: (p.warmth ?? 0) * t,
    splitTone: p.splitTone ? { ...p.splitTone, amount: p.splitTone.amount * t } : null,
    duotone: p.duotone ?? null,
    posterize: p.posterize ?? 0,
    invert: p.invert ? t : 0,
    glow: (p.glow ?? 0) * t,
    smooth: (p.smooth ?? 0) * t,
    /** campuran efek berbasis luminans (duotone/posterize) */
    mix: t,
  }
}

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const
}

/**
 * haluskan kulit (di tempat): campur dengan versi buram hanya di piksel berwarna kulit (rentang YCbCr)
 * dan yang bedanya kecil dengan versi buram (bukan tepi: mata, alis, rambut tetap tajam)
 */
function smoothSkin(d: Uint8ClampedArray, blur: Uint8ClampedArray, amount: number) {
  const n = d.length
  for (let i = 0; i < n; i += 4) {
    const r = d[i]
    const g = d[i + 1]
    const b = d[i + 2]
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b
    // bobot kulit lembut di tepi rentang supaya tidak ada batas kasar
    const sk = Math.max(0, Math.min(1, (cb - 72) / 10, (132 - cb) / 10, (cr - 128) / 10, (178 - cr) / 10))
    if (sk <= 0) continue
    const br = blur[i]
    const bg = blur[i + 1]
    const bb = blur[i + 2]
    const diff = (Math.abs(br - r) + Math.abs(bg - g) + Math.abs(bb - b)) / 3
    const w = amount * sk * Math.exp(-(diff * diff) / 600)
    d[i] = r + (br - r) * w
    d[i + 1] = g + (bg - g) * w
    d[i + 2] = b + (bb - b) * w
  }
}

/** split tone, duotone, posterize: satu putaran per piksel sesudah matriks warna */
function toneMap(d: Uint8ClampedArray, f: ReturnType<typeof resolve>) {
  const st = f.splitTone && f.splitTone.amount > 0 ? { s: rgb(f.splitTone.shadow), h: rgb(f.splitTone.highlight), a: f.splitTone.amount } : null
  const duo = f.duotone ? { a: rgb(f.duotone[0]), b: rgb(f.duotone[1]) } : null
  const levels = f.posterize > 1 ? f.posterize - 1 : 0
  const t = f.mix
  const n = d.length
  for (let i = 0; i < n; i += 4) {
    let r = d[i]
    let g = d[i + 1]
    let b = d[i + 2]
    if (duo) {
      const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
      r += t * (duo.a[0] + (duo.b[0] - duo.a[0]) * l - r)
      g += t * (duo.a[1] + (duo.b[1] - duo.a[1]) * l - g)
      b += t * (duo.a[2] + (duo.b[2] - duo.a[2]) * l - b)
    }
    if (st) {
      // bayangan ditarik ke warna shadow, sorotan ke warna highlight (berbobot luminans)
      const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
      const ws = (1 - l) * (1 - l) * st.a * 0.6
      const wh = l * l * st.a * 0.6
      r += ws * (st.s[0] - r) + wh * (st.h[0] - r)
      g += ws * (st.s[1] - g) + wh * (st.h[1] - g)
      b += ws * (st.s[2] - b) + wh * (st.h[2] - b)
    }
    if (levels) {
      r += t * ((Math.round((r / 255) * levels) / levels) * 255 - r)
      g += t * ((Math.round((g / 255) * levels) / levels) * 255 - g)
      b += t * ((Math.round((b / 255) * levels) / levels) * 255 - b)
    }
    d[i] = r
    d[i + 1] = g
    d[i + 2] = b
  }
}

// kanvas bantu per ukuran: preview & thumbnail bergantian tiap frame, mengubah ukuran satu kanvas bersama itu mahal
const scratches = new Map<string, HTMLCanvasElement>()
function scratchCanvas(w: number, h: number) {
  const key = `${w}x${h}`
  let c = scratches.get(key)
  if (c) {
    scratches.delete(key)
  } else {
    c = document.createElement('canvas')
    c.width = w
    c.height = h
    // simpan paling banyak 12 ukuran terakhir
    if (scratches.size >= 12) {
      const old = scratches.keys().next().value!
      const oc = scratches.get(old)!
      oc.width = oc.height = 0
      scratches.delete(old)
    }
  }
  scratches.set(key, c)
  return c
}

/** geser channel merah ke kiri & biru ke kanan sejauh `shift` px (boleh pecahan, diinterpolasi) */
function chromaShift(d: Uint8ClampedArray, w: number, h: number, shift: number) {
  const s0 = Math.min(w - 2, Math.floor(shift))
  const fr = shift - Math.floor(shift)
  const ifr = 1 - fr
  const rowLen = w * 4
  const row = new Uint8ClampedArray(rowLen)
  // bagian tengah tanpa cek tepi; tepi ditahan di piksel terakhir
  const safeEnd = w - s0 - 1
  for (let y = 0; y < h; y++) {
    const o = y * rowLen
    row.set(d.subarray(o, o + rowLen))
    for (let x = 0; x < safeEnd; x++) d[o + x * 4] = row[(x + s0) * 4] * ifr + row[(x + s0 + 1) * 4] * fr
    for (let x = Math.max(0, safeEnd); x < w; x++) d[o + x * 4] = row[(w - 1) * 4]
    for (let x = s0 + 1; x < w; x++) d[o + x * 4 + 2] = row[(x - s0) * 4 + 2] * ifr + row[(x - s0 - 1) * 4 + 2] * fr
    for (let x = 0; x <= s0 && x < w; x++) d[o + x * 4 + 2] = row[2]
  }
}

/**
 * putar hue seluruh isi kanvas (di tempat), alpha tetap. hitam/putih/abu tidak berubah, hanya warna yang bergeser.
 * dipakai untuk "warna aksen" template (lapisan desain saja, bukan foto)
 */
export function hueRotatePixels(ctx: CanvasRenderingContext2D, deg: number) {
  const { width: w, height: h } = ctx.canvas
  if (!deg || !w || !h) return
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  const [m0, m1, m2, , m4, m5, m6, , m8, m9, m10] = hueM(deg)
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue
    const r = d[i]
    const g = d[i + 1]
    const b = d[i + 2]
    d[i] = m0 * r + m1 * g + m2 * b
    d[i + 1] = m4 * r + m5 * g + m6 * b
    d[i + 2] = m8 * r + m9 * g + m10 * b
  }
  ctx.putImageData(img, 0, 0)
}

/** satu warna [r, g, b] diputar hue-nya, sama persis dengan hueRotatePixels */
export function hueRotateColor([r, g, b]: [number, number, number], deg: number): [number, number, number] {
  if (!deg) return [r, g, b]
  const [m0, m1, m2, , m4, m5, m6, , m8, m9, m10] = hueM(deg)
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  return [c(m0 * r + m1 * g + m2 * b), c(m4 * r + m5 * g + m6 * b), c(m8 * r + m9 * g + m10 * b)]
}

export type ApplyOptions = {
  /** kekuatan 0–1, default 1 */
  strength?: number
  /** seed grain; preview pakai acak per frame */
  seed?: number
}

/**
 * Terapkan satu preset ke seluruh isi kanvas `ctx`, di tempat.
 * Urutan: pixelate → blur → glow → (haluskan kulit, chroma shift, matriks warna, invert, fade, grain, split tone/duotone/posterize)
 * → tint → light leak → vignette → scanlines.
 */
export function applyFilter(ctx: CanvasRenderingContext2D, preset: FilterPreset, opts: ApplyOptions = {}) {
  const t = Math.max(0, Math.min(1, opts.strength ?? 1))
  if (preset.id === 'normal' || t === 0) return
  const { width: w, height: h } = ctx.canvas
  const k = Math.max(w, h) / 1080
  const f = resolve(preset, t)
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'

  // 1. pixelate: perkecil lalu perbesar tanpa smoothing
  const block = f.pixelate * k
  if (block > 1.5) {
    const sw = Math.max(1, Math.round(w / block))
    const sh = Math.max(1, Math.round(h / block))
    const s = scratchCanvas(sw, sh)
    const sctx = s.getContext('2d')!
    sctx.imageSmoothingEnabled = true
    sctx.clearRect(0, 0, sw, sh)
    sctx.drawImage(ctx.canvas, 0, 0, sw, sh)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(s, 0, 0, sw, sh, 0, 0, w, h)
    ctx.imageSmoothingEnabled = true
  }

  // 2. blur: perkecil lalu perbesar dengan smoothing. sama di semua browser (Safari tidak punya ctx.filter)
  // dan jauh lebih cepat dari ctx.filter di kanvas yang dibaca CPU
  const blurPx = f.blur * k
  if (blurPx > 0.3) {
    const d = 1 + blurPx * 0.9
    const sw = Math.max(1, Math.round(w / d))
    const sh = Math.max(1, Math.round(h / d))
    const s = scratchCanvas(sw, sh)
    const sctx = s.getContext('2d')!
    sctx.imageSmoothingEnabled = true
    sctx.imageSmoothingQuality = 'medium'
    sctx.drawImage(ctx.canvas, 0, 0, sw, sh)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'medium'
    ctx.drawImage(s, 0, 0, sw, sh, 0, 0, w, h)
  }

  // 2b. glow: salinan buram dicampur screen, area terang jadi berpendar
  if (f.glow > 0) {
    const sw = Math.max(1, Math.round(w / 10))
    const sh = Math.max(1, Math.round(h / 10))
    const s = scratchCanvas(sw, sh)
    const sctx = s.getContext('2d')!
    sctx.imageSmoothingEnabled = true
    sctx.imageSmoothingQuality = 'medium'
    sctx.drawImage(ctx.canvas, 0, 0, sw, sh)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'medium'
    ctx.globalCompositeOperation = 'screen'
    ctx.globalAlpha = 0.55 * f.glow
    ctx.drawImage(s, 0, 0, sw, sh, 0, 0, w, h)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }

  // 3. operasi per piksel
  let m = ID
  if (f.warmth) m = mul([1 + 0.1 * f.warmth, 0, 0, 0, 0, 1 + 0.015 * f.warmth, 0, 0, 0, 0, 1 - 0.12 * f.warmth, 0], m)
  if (f.brightness !== 1) m = mul(scale(f.brightness), m)
  if (f.contrast !== 1) m = mul(contrastM(f.contrast), m)
  if (f.saturate !== 1) m = mul(saturateM(f.saturate), m)
  if (f.hueRotate) m = mul(hueM(f.hueRotate), m)
  if (f.sepia) m = mul(sepiaM(f.sepia), m)
  if (f.grayscale) m = mul(grayM(f.grayscale), m)
  if (f.invert) {
    const k2 = 1 - 2 * f.invert
    m = mul([k2, 0, 0, 255 * f.invert, 0, k2, 0, 255 * f.invert, 0, 0, k2, 255 * f.invert], m)
  }
  if (f.fade) {
    const lift = f.fade * 90
    m = mul([1 - lift / 255, 0, 0, lift, 0, 1 - lift / 255, 0, lift, 0, 0, 1 - lift / 255, lift], m)
  }
  const shift = f.chromaShift * k
  const grainAmp = f.grain * 60
  const tone = (f.splitTone !== null && f.splitTone.amount > 0) || f.duotone !== null || f.posterize > 1
  // versi buram untuk haluskan kulit (perkecil-perbesar, sama di semua browser)
  let blurred: Uint8ClampedArray | null = null
  if (f.smooth > 0) {
    const dd = 1 + 7 * k
    const sw = Math.max(1, Math.round(w / dd))
    const sh = Math.max(1, Math.round(h / dd))
    const small = scratchCanvas(sw, sh)
    const sctx = small.getContext('2d')!
    sctx.imageSmoothingEnabled = true
    sctx.imageSmoothingQuality = 'high'
    sctx.drawImage(ctx.canvas, 0, 0, sw, sh)
    const big = scratchCanvas(w, h)
    const bctx = big.getContext('2d', { willReadFrequently: true })!
    bctx.imageSmoothingEnabled = true
    bctx.imageSmoothingQuality = 'high'
    bctx.drawImage(small, 0, 0, sw, sh, 0, 0, w, h)
    blurred = bctx.getImageData(0, 0, w, h).data
  }
  const needPixels = m !== ID || shift >= 0.05 || grainAmp > 0 || tone || !!blurred
  if (needPixels) {
    const img = ctx.getImageData(0, 0, w, h)
    const d = img.data
    if (blurred) smoothSkin(d, blurred, f.smooth)
    if (shift >= 0.05) chromaShift(d, w, h, shift)
    const [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11] = m
    const n = d.length
    if (grainAmp > 0) {
      let seed = (opts.seed ?? Math.random() * 4294967296) | 1
      const amp = grainAmp / 4294967296
      const half = grainAmp / 2
      for (let i = 0; i < n; i += 4) {
        const r = d[i]
        const g = d[i + 1]
        const b = d[i + 2]
        seed ^= seed << 13
        seed ^= seed >>> 17
        seed ^= seed << 5
        const g0 = (seed >>> 0) * amp - half
        d[i] = m0 * r + m1 * g + m2 * b + m3 + g0
        d[i + 1] = m4 * r + m5 * g + m6 * b + m7 + g0
        d[i + 2] = m8 * r + m9 * g + m10 * b + m11 + g0
      }
    } else if (m !== ID) {
      for (let i = 0; i < n; i += 4) {
        const r = d[i]
        const g = d[i + 1]
        const b = d[i + 2]
        d[i] = m0 * r + m1 * g + m2 * b + m3
        d[i + 1] = m4 * r + m5 * g + m6 * b + m7
        d[i + 2] = m8 * r + m9 * g + m10 * b + m11
      }
    }
    if (tone) toneMap(d, f)
    ctx.putImageData(img, 0, 0)
  }

  // 4. tint
  if (f.tint && f.tint.opacity > 0) {
    ctx.globalCompositeOperation = f.tint.blend
    ctx.globalAlpha = f.tint.opacity
    ctx.fillStyle = f.tint.color
    ctx.fillRect(0, 0, w, h)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }

  // 5. light leak: cahaya oranye dari pojok kiri atas & kanan bawah
  if (f.lightLeak > 0) {
    ctx.globalCompositeOperation = 'screen'
    const r = Math.hypot(w, h)
    const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.6)
    g1.addColorStop(0, `rgba(255,110,30,${0.75 * f.lightLeak})`)
    g1.addColorStop(0.45, `rgba(255,150,60,${0.28 * f.lightLeak})`)
    g1.addColorStop(1, 'rgba(255,150,60,0)')
    ctx.fillStyle = g1
    ctx.fillRect(0, 0, w, h)
    const g2 = ctx.createRadialGradient(w, h, 0, w, h, r * 0.45)
    g2.addColorStop(0, `rgba(255,190,90,${0.45 * f.lightLeak})`)
    g2.addColorStop(1, 'rgba(255,190,90,0)')
    ctx.fillStyle = g2
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'
  }

  // 6. vignette
  if (f.vignette > 0) {
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.hypot(w, h) / 2)
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(1, `rgba(0,0,0,${0.85 * f.vignette})`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  }

  // 7. scanlines
  if (f.scanlines > 0) {
    const gap = Math.max(2, h / 270)
    ctx.fillStyle = `rgba(0,0,0,${0.22 * f.scanlines})`
    for (let y = 0; y < h; y += gap) ctx.fillRect(0, y, w, Math.max(1, gap * 0.45))
  }
  ctx.restore()
}
