// Helper khusus kategori Retro & Vintage
import { contentHeight, font, insetShadows, rrPath, rrPathRaw, setShadow, snap, text, type Ctx, type Radii, type TextOpts } from '../paint'

/**
 * radial-gradient(RXpx RYpx at cx cy, warna, transparent STOP%) — elips, digambar menutupi kotak x,y,w,h.
 * stops: [offset 0..1 terhadap radius elips, warna]
 */
export function ellipseGlow(ctx: Ctx, x: number, y: number, w: number, h: number, cx: number, cy: number, rx: number, ry: number, stops: [number, string][]) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  ctx.translate(cx, cy)
  ctx.scale(1, ry / rx)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  for (const [o, c] of stops) g.addColorStop(o, c)
  ctx.fillStyle = g
  // kotak dalam koordinat yang sudah diskalakan
  ctx.fillRect(x - cx, (y - cy) * (rx / ry), w, h * (rx / ry))
  ctx.restore()
}

/** cincin elips (border: Npx solid; border-radius: 50%) di kotak x,y,w,h */
export function ellipseRing(ctx: Ctx, x: number, y: number, w: number, h: number, width: number, color: string) {
  const cx = x + w / 2
  const cy = y + h / 2
  ctx.beginPath()
  ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2)
  ctx.ellipse(cx, cy, w / 2 - width, h / 2 - width, 0, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill('evenodd')
}

/** bungkus gambar dengan rotate(deg) di titik (ox, oy) — transform CSS dengan transform-origin tertentu */
export function rotated(ctx: Ctx, ox: number, oy: number, deg: number, draw: () => void) {
  ctx.save()
  ctx.translate(ox, oy)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.translate(-ox, -oy)
  draw()
  ctx.restore()
}

/**
 * Teks yang diawali glyph simbol (▸ ▶ ●) dari font cadangan sistem: lebar glyph di canvas bisa beda,
 * jadi glyph dipusatkan di lebar hasil ukur desain (glyphW) lalu sisa teks digambar sesudahnya.
 */
export function glyphText(ctx: Ctx, glyph: string, glyphW: number, rest: string, x: number, y: number, o: TextOpts) {
  text(ctx, glyph, x + glyphW / 2, y, { ...o, align: 'center', letterSpacing: 0 })
  text(ctx, rest, x + glyphW, y, { ...o, align: 'left' })
}

/** sisi atas kotak konten teks di dalam baris dengan line-height angka (lh × size) */
export function lineTop(ctx: Ctx, family: string, size: number, lh: number, boxTop: number, weight: number | string = 400) {
  return boxTop + (size * lh - contentHeight(ctx, family, size, weight)) / 2
}

const MONTHS: Record<string, number> = {
  jan: 1, januari: 1, january: 1,
  feb: 2, februari: 2, february: 2, peb: 2, pebruari: 2,
  mar: 3, maret: 3, march: 3,
  apr: 4, april: 4,
  mei: 5, may: 5,
  jun: 6, juni: 6, june: 6,
  jul: 7, juli: 7, july: 7,
  agu: 8, agt: 8, ags: 8, agus: 8, agustus: 8, aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  okt: 10, oktober: 10, oct: 10, october: 10,
  nov: 11, nopember: 11, november: 11,
  des: 12, desember: 12, dec: 12, december: 12,
}

export const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

export type DateParts = { d: number; m: number; y: number }

/**
 * Baca teks tanggal bebas dari user ("17.10.2026", "17/10/26", "19 okt 2026", "17 Oktober 2026").
 * null kalau tidak bisa dibaca (template lalu menyembunyikan turunan tanggalnya).
 */
export function parseTanggal(s: string | undefined): DateParts | null {
  const t = (s ?? '').trim().toLowerCase()
  if (!t) return null
  const year = (v: string) => (v.length === 2 ? 2000 + Number(v) : Number(v))
  const ok = (d: number, m: number, y: number): DateParts | null => (d >= 1 && d <= 31 && m >= 1 && m <= 12 ? { d, m, y } : null)
  let r = t.match(/(\d{1,2})\s*[./-]\s*(\d{1,2})\s*[./-]\s*(\d{4}|\d{2})\b/)
  if (r) return ok(Number(r[1]), Number(r[2]), year(r[3]))
  r = t.match(/(\d{1,2})\s+([a-z]+)\.?\s+(\d{4}|\d{2})\b/)
  if (r && MONTHS[r[2]]) return ok(Number(r[1]), MONTHS[r[2]], year(r[3]))
  return null
}

const p2 = (n: number) => String(n).padStart(2, '0')

/** cap tanggal kamera: '26 10 17 */
export function stampTanggal(p: DateParts) {
  return `'${p2(p.y % 100)} ${p2(p.m)} ${p2(p.d)}`
}

/** warna CSS (#rgb, #rrggbb, #rrggbbaa, rgb(), rgba()) → [r, g, b, a] */
export function rgba(c: string): [number, number, number, number] {
  const s = c.trim()
  if (s === 'transparent') return [0, 0, 0, 0]
  if (s.startsWith('#')) {
    let h = s.slice(1)
    if (h.length <= 4) h = [...h].map((ch) => ch + ch).join('')
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16)
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1]
  }
  const p = s.replace(/^rgba?\(|\)$/g, '').split(/[\s,/]+/).filter(Boolean).map(Number)
  return [p[0], p[1], p[2], p[3] ?? 1]
}

/**
 * Stop gradien CSS → stop canvas. CSS menginterpolasi warna secara premultiplied (mis. hitam transparan → putih
 * tidak jadi abu-abu); canvas tidak. Tiap segmen dipecah jadi n sub-stop hasil interpolasi premultiplied.
 */
export function premul(stops: [number, string][], n = 8): [number, string][] {
  const out: [number, string][] = []
  const cs = stops.map(([o, c]) => [o, rgba(c)] as const)
  for (let i = 0; i < cs.length; i++) {
    const [o, c] = cs[i]
    if (i === 0) {
      out.push([o, css(c)])
      continue
    }
    const [o0, c0] = cs[i - 1]
    for (let k = 1; k <= n; k++) {
      const t = k / n
      const a = c0[3] + (c[3] - c0[3]) * t
      const ch = (j: number) => (a > 0 ? (c0[j] * c0[3] + (c[j] * c[3] - c0[j] * c0[3]) * t) / a : c0[3] > 0 ? c0[j] : c[j])
      out.push([o0 + (o - o0) * t, css([ch(0), ch(1), ch(2), a])])
    }
  }
  return out.map(([o, c]) => [Math.min(1, Math.max(0, o)), c])
}

function css(c: readonly number[]) {
  return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${+c[3].toFixed(4)})`
}

/** radial-gradient(ellipse at 50% 50%, transparent A%, warna 100%) menutupi kotak (farthest-corner) */
export function vignette(ctx: Ctx, x: number, y: number, w: number, h: number, stops: [number, string][]) {
  ellipseGlow(ctx, x, y, w, h, x + w / 2, y + h / 2, (w / 2) * Math.SQRT2, (h / 2) * Math.SQRT2, premul(stops))
}

/** box-shadow: inset 0 0 0 Npx warna (spread tanpa blur) = garis tepi di dalam kotak (radius = radius padding box) */
export function insetRing(ctx: Ctx, x0: number, y0: number, w0: number, h0: number, n: number, color: string, r: number = 0) {
  const { x, y, w, h } = snap(x0, y0, w0, h0)
  ctx.save()
  ctx.beginPath()
  rrPathRaw(ctx, x, y, w, h, r)
  rrPathRaw(ctx, x + n, y + n, w - 2 * n, h - 2 * n, Math.max(0, r - n))
  ctx.fillStyle = color
  ctx.fill('evenodd')
  ctx.restore()
}

/** inset bayangan standar kotak FOTO set desain ini: inset 0 0 0 1px rgba(0,0,0,a1), inset 0 3px 8px rgba(0,0,0,a2) */
export function photoInset(ctx: Ctx, x: number, y: number, w: number, h: number, a1 = 0.12, a2 = 0.16) {
  insetShadows(ctx, x, y, w, h, [{ dx: 0, dy: 3, blur: 8, color: `rgba(0,0,0,${a2})` }])
  insetRing(ctx, x, y, w, h, 1, `rgba(0,0,0,${a1})`)
}

/**
 * Teks ber-letter-spacing yang memuat glyph simbol (▸ ●) dari font cadangan: glyph diberi lebar tetap hasil ukur
 * desain (glyphW) dan dipusatkan di situ; huruf lain memakai lebar font. align seperti text().
 */
export function spacedGlyphs(ctx: Ctx, s: string, glyphs: string, glyphW: number, x: number, y: number, o: TextOpts) {
  const ls = o.letterSpacing ?? 0
  const chars = Array.from(s)
  ctx.save()
  ctx.font = font(o.family, o.size, o.weight, o.italic)
  const adv = chars.map((c) => (glyphs.includes(c) ? glyphW : ctx.measureText(c).width) + ls)
  ctx.restore()
  const total = adv.reduce((a, b) => a + b, 0)
  let cx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x
  chars.forEach((c, i) => {
    if (glyphs.includes(c)) text(ctx, c, cx + glyphW / 2, y, { ...o, align: 'center', letterSpacing: 0 })
    else text(ctx, c, cx, y, { ...o, align: 'left', letterSpacing: 0 })
    cx += adv[i]
  })
  return total
}

/**
 * repeating-linear-gradient(SUDUTdeg, ...) dengan pita tajam: bands = [awal, akhir, warna] dalam px di dalam satu periode.
 * Fase dimulai dari titik awal garis gradien (seperti CSS). Dipotong ke kotak (radius opsional).
 */
export function repeatingLinear(ctx: Ctx, x: number, y: number, w: number, h: number, angle: number, period: number, bands: [number, number, string][], r: Radii = 0) {
  const a = (angle * Math.PI) / 180
  const L = Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a))
  const big = Math.hypot(w, h)
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, x, y, w, h, r)
  ctx.clip()
  ctx.translate(x + w / 2, y + h / 2)
  ctx.rotate(a - Math.PI / 2)
  for (let t = -L / 2; t < L / 2; t += period)
    for (const [f, to, c] of bands) {
      ctx.fillStyle = c
      ctx.fillRect(t + f, -big, to - f, 2 * big)
    }
  ctx.restore()
}

/** path kotak dengan border-radius elips (mis. 70px / 52px) */
export function ellipseRRPath(ctx: Ctx, x: number, y: number, w: number, h: number, rx: number, ry: number) {
  const P = Math.PI
  ctx.moveTo(x + rx, y)
  ctx.lineTo(x + w - rx, y)
  ctx.ellipse(x + w - rx, y + ry, rx, ry, 0, -P / 2, 0)
  ctx.lineTo(x + w, y + h - ry)
  ctx.ellipse(x + w - rx, y + h - ry, rx, ry, 0, 0, P / 2)
  ctx.lineTo(x + rx, y + h)
  ctx.ellipse(x + rx, y + h - ry, rx, ry, 0, P / 2, P)
  ctx.lineTo(x, y + ry)
  ctx.ellipse(x + rx, y + ry, rx, ry, 0, P, P * 1.5)
  ctx.closePath()
}

/** repeating-conic-gradient(A 0 Ndeg, B Ndeg 2Ndeg) di lingkaran pusat cx,cy jari-jari r */
export function conicStripes(ctx: Ctx, cx: number, cy: number, r: number, a: string, b: string, deg: number) {
  const g = ctx.createConicGradient(-Math.PI / 2, cx, cy)
  const n = 360 / (2 * deg)
  for (let i = 0; i < n; i++) {
    const o = i / n
    g.addColorStop(o, a)
    g.addColorStop(o + 0.5 / n, a)
    g.addColorStop(o + 0.5 / n, b)
    g.addColorStop(Math.min(1, o + 1 / n), b)
  }
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()
}

/** gradien logam set desain ini: linear-gradient(180deg, #f4f6f8 0%, #b9c0c8 30%, #6f777f 50%, #d9dee3 70%, #8f969d 100%) */
export const METAL: [number, string][] = [[0, '#f4f6f8'], [0.3, '#b9c0c8'], [0.5, '#6f777f'], [0.7, '#d9dee3'], [1, '#8f969d']]

/** elemen dengan filter: blur(Npx) (bentuk elips): digambar lewat bayangan supaya jalan juga di Safari (tanpa ctx.filter) */
export function blurredEllipse(ctx: Ctx, x: number, y: number, w: number, h: number, blur: number, color: string) {
  ctx.save()
  const off = 20000
  setShadow(ctx, off, 0, blur * 2, color)
  ctx.beginPath()
  ctx.ellipse(x + w / 2 - off, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.restore()
}

/** gradien logam horizontal set desain ini: linear-gradient(90deg, #8f969d 0%, #e9edf2 30%, #6f777f 55%, #d9dee3 80%, #8f969d 100%) */
export const METAL_H: [number, string][] = [[0, '#8f969d'], [0.3, '#e9edf2'], [0.55, '#6f777f'], [0.8, '#d9dee3'], [1, '#8f969d']]

const dotTiles = new Map<string, HTMLCanvasElement>()
/**
 * background: radial-gradient(circle, warna r0px, transparent r1px) 0 0 / Tpx Tpx — titik berulang mulai dari (ox, oy).
 * Isi path yang sudah dibuat pemanggil (mis. lingkaran) dengan pola titik.
 */
export function dotFill(ctx: Ctx, ox: number, oy: number, tile: number, color: string, r0: number, r1: number) {
  const key = `${tile}|${color}|${r0}|${r1}`
  let c = dotTiles.get(key)
  if (!c) {
    // Chrome menghitung gradien di titik tengah tiap piksel: tile 1x dengan alfa per piksel yang sama
    c = document.createElement('canvas')
    c.width = c.height = tile
    const t = c.getContext('2d')!
    const img = t.createImageData(tile, tile)
    const [r, g, b, a] = rgba(color)
    for (let j = 0; j < tile; j++)
      for (let i = 0; i < tile; i++) {
        const d = Math.hypot(i + 0.5 - tile / 2, j + 0.5 - tile / 2)
        const k = d <= r0 ? 1 : d >= r1 ? 0 : (r1 - d) / (r1 - r0)
        const o = (j * tile + i) * 4
        img.data[o] = r
        img.data[o + 1] = g
        img.data[o + 2] = b
        img.data[o + 3] = Math.round(255 * a * k)
      }
    t.putImageData(img, 0, 0)
    dotTiles.set(key, c)
  }
  const p = ctx.createPattern(c, 'repeat')!
  p.setTransform(new DOMMatrix().translate(ox, oy))
  ctx.fillStyle = p
  ctx.fill()
}

const perfCache = new Map<string, HTMLCanvasElement>()
/**
 * Lembar perangko bergerigi: background radial-gradient(circle at P P, transparent r0, warna r1) -P -P / 2P 2P
 * = kotak berwarna dengan lubang tiap 2P px (pusat di kelipatan 2P dari sudut kotak). Dihitung per titik tengah
 * piksel seperti Chrome, disimpan sebagai kanvas (dipakai ulang, juga untuk bayangan drop-shadow lewat drawImage).
 */
export function perforated(w: number, h: number, step: number, r0: number, r1: number, color: string) {
  const key = `${w}|${h}|${step}|${r0}|${r1}|${color}`
  let c = perfCache.get(key)
  if (c) return c
  c = document.createElement('canvas')
  c.width = Math.ceil(w)
  c.height = Math.ceil(h)
  const t = c.getContext('2d')!
  const img = t.createImageData(c.width, c.height)
  const [r, g, b, a] = rgba(color)
  for (let y = 0; y < c.height; y++)
    for (let x = 0; x < c.width; x++) {
      const px = x + 0.5
      const py = y + 0.5
      const dx = px - Math.round(px / step) * step
      const dy = py - Math.round(py / step) * step
      const d = Math.hypot(dx, dy)
      const k = d <= r0 ? 0 : d >= r1 ? 1 : (d - r0) / (r1 - r0)
      const o = (y * c.width + x) * 4
      img.data[o] = r
      img.data[o + 1] = g
      img.data[o + 2] = b
      img.data[o + 3] = Math.round(255 * a * k)
    }
  t.putImageData(img, 0, 0)
  perfCache.set(key, c)
  return c
}
