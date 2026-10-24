// Helper khusus kategori Bold & Pop
import { contentHeight, insetShadows, measure, rrPath, text, type Ctx, type Radii } from '../paint'

export const INK = '#111111'
export const BANGERS = 'Bangers'
export const MONO = 'Space Mono'
export const ARCHIVO = 'Archivo Black'
/** sama dengan <link> di semua file desain bold-pop */
export const FONTS = ['Bangers', 'Archivo Black', 'Space Mono:400,700']
/** data-texture semua file desain bold-pop: opacity 0.05, multiply */
export const TEXTURE = { opacity: 0.05, blend: 'multiply' as const }

/** bungkus gambar dengan rotate(deg) di titik (ox, oy): transform CSS (default origin = titik tengah elemen) */
export function rotated(ctx: Ctx, ox: number, oy: number, deg: number, draw: () => void) {
  ctx.save()
  ctx.translate(ox, oy)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.translate(-ox, -oy)
  draw()
  ctx.restore()
}

/** elips penuh + border (border-radius: 50%) di kotak x,y,w,h */
export function ellipseBox(ctx: Ctx, x: number, y: number, w: number, h: number, fill: string, bw: number, stroke: string) {
  const cx = x + w / 2
  const cy = y + h / 2
  ctx.beginPath()
  ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2)
  ctx.ellipse(cx, cy, w / 2 - bw, h / 2 - bw, 0, 0, Math.PI * 2)
  ctx.fillStyle = stroke
  ctx.fill('evenodd')
}

/**
 * Pola titik halftone: `radial-gradient(circle, warna r0, transparent r1) ox oy / tile tile`
 * di area x,y,w,h (tile dimulai dari x+ox, y+oy).
 */
export function halftone(ctx: Ctx, x: number, y: number, w: number, h: number, tile: number, color: string, r0: number, r1: number) {
  const m = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/)!
  dots(ctx, x, y, w, h, tile, [+m[1], +m[2], +m[3]], m[4] === undefined ? 1 : +m[4], r0, r1)
}

/** garis putus-putus horizontal (border-top dashed), pola dash/gap hasil ukur screenshot Chrome */
export function dashedH(ctx: Ctx, x: number, y: number, w: number, width: number, color: string, dash: [number, number]) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, width)
  ctx.clip()
  ctx.fillStyle = color
  // Chrome meregangkan jarak supaya kedua ujung garis diakhiri dash penuh
  const n = Math.max(1, Math.round((w + dash[1]) / (dash[0] + dash[1])))
  const gap = n > 1 ? (w - n * dash[0]) / (n - 1) : 0
  for (let i = 0; i < n; i++) ctx.fillRect(x + i * (dash[0] + gap), y, dash[0], width)
  ctx.restore()
}

/** bungkus teks per kata (tidak pernah memotong kata) dengan lebar baris maksimum */
export function wrapWords(ctx: Ctx, s: string, family: string, size: number, maxW: number) {
  const words = s.trim().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (cur && measure(ctx, next, { family, size }) > maxW) {
      lines.push(cur)
      cur = w
    } else cur = next
  }
  if (cur) lines.push(cur)
  return lines
}

export type BubbleBox = { x: number; y: number; w: number; h: number }

/**
 * Balon kata elips (padding padY padX, border bw, border-radius 50%) yang ukurannya mengikuti teks.
 * Teks panjang dibungkus per kata (maks `maxLines` baris), kata yang terlalu lebar membuat font dikecilkan.
 * Satu baris = persis seperti desain; multi-baris: elips diperbesar supaya sudut teks tetap di dalam.
 * anchor: sisi kiri (`left`) atau kanan (`right`) di x, sisi atas di y; minX/maxX = batas panel.
 */
export function speechBubble(
  ctx: Ctx,
  s: string,
  x: number,
  y: number,
  o: { align: 'left' | 'right'; size: number; padX: number; padY: number; bw: number; maxLineW: number; maxLines: number; minX?: number; maxX?: number },
): BubbleBox | null {
  const str = s.trim()
  if (!str) return null
  let size = o.size
  let lines = wrapWords(ctx, str, BANGERS, size, o.maxLineW)
  const widest = () => Math.max(...lines.map((l) => measure(ctx, l, { family: BANGERS, size })))
  while (size > o.size * 0.4 && (lines.length > o.maxLines || widest() > o.maxLineW)) {
    size *= 0.92
    lines = wrapWords(ctx, str, BANGERS, size, o.maxLineW)
  }
  const lh = contentHeight(ctx, BANGERS, size)
  const tw = widest()
  const th = lh * lines.length
  let w = tw + 2 * o.padX + 2 * o.bw
  let h = th + 2 * o.padY + 2 * o.bw
  // sudut kotak teks harus di dalam elips bagian dalam (desain satu baris ≈ 0.67)
  const v = (tw / 2 / (w / 2 - o.bw)) ** 2 + (th / 2 / (h / 2 - o.bw)) ** 2
  if (lines.length > 1 && v > 0.8) {
    const k = Math.sqrt(v / 0.8)
    w = (w - 2 * o.bw) * k + 2 * o.bw
    h = (h - 2 * o.bw) * k + 2 * o.bw
  }
  let bx = o.align === 'left' ? x : x - w
  // balon besar digeser supaya tetap di dalam panel
  if (o.maxX !== undefined) bx = Math.min(bx, o.maxX - w)
  if (o.minX !== undefined) bx = Math.max(bx, o.minX)
  ellipseBox(ctx, bx, y, w, h, '#ffffff', o.bw, INK)
  const top = y + (h - th) / 2
  lines.forEach((l, i) => text(ctx, l, bx + w / 2, top + i * lh, { family: BANGERS, size, color: INK, align: 'center' }))
  return { x: bx, y, w, h }
}

/** pil/label yang lebarnya mengikuti teks: kembalikan lebar kotak (teks + padding kiri-kanan + border) */
export function hugW(ctx: Ctx, s: string, family: string, size: number, padX: number, bw: number) {
  return measure(ctx, s, { family, size }) + 2 * padX + 2 * bw
}

/** `box-shadow: inset 0 0 0 <spread> color` = cincin di tepi dalam kotak (mengikuti radius) */
export function insetRing(ctx: Ctx, x: number, y: number, w: number, h: number, spread: number, color: string, r: Radii = 0) {
  const ri: Radii = typeof r === 'number' ? Math.max(0, r - spread) : (r.map((v) => Math.max(0, v - spread)) as Radii)
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, x, y, w, h, r)
  rrPath(ctx, x + spread, y + spread, w - 2 * spread, h - 2 * spread, ri)
  ctx.fillStyle = color
  ctx.fill('evenodd')
  ctx.restore()
}

/**
 * Bayangan dalam kotak FOTO di semua desain bold-pop (draw.over):
 * `box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 8px rgba(0,0,0,0.16)`
 */
export function photoInset(ctx: Ctx, s: { x: number; y: number; w: number; h: number; radius?: number; rotate?: number }) {
  const draw = () => {
    insetShadows(ctx, s.x, s.y, s.w, s.h, [{ dx: 0, dy: 3, blur: 8, color: 'rgba(0,0,0,0.16)' }], s.radius ?? 0)
    insetRing(ctx, s.x, s.y, s.w, s.h, 1, 'rgba(0,0,0,0.12)', s.radius ?? 0)
  }
  if (s.rotate) rotated(ctx, s.x + s.w / 2, s.y + s.h / 2, s.rotate, draw)
  else draw()
}

/**
 * Pola titik `radial-gradient(color r0, transparent r1) ox oy / tile tile` dihitung per piksel
 * (warna dievaluasi di pusat piksel seperti Chrome). rgb = [r,g,b], a = alpha warna.
 */
const dotTiles = new Map<string, HTMLCanvasElement>()
export function dots(ctx: Ctx, x: number, y: number, w: number, h: number, tile: number, rgb: [number, number, number], a: number, r0: number, r1: number, ox = 0, oy = 0) {
  const key = [tile, rgb, a, r0, r1].join('|')
  let c = dotTiles.get(key)
  if (!c) {
    c = document.createElement('canvas')
    c.width = c.height = tile
    const t = c.getContext('2d')!
    const img = t.createImageData(tile, tile)
    for (let py = 0; py < tile; py++)
      for (let px = 0; px < tile; px++) {
        const d = Math.hypot(px + 0.5 - tile / 2, py + 0.5 - tile / 2)
        const k = d <= r0 ? 1 : d >= r1 ? 0 : (r1 - d) / (r1 - r0)
        const i = (py * tile + px) * 4
        img.data[i] = rgb[0]
        img.data[i + 1] = rgb[1]
        img.data[i + 2] = rgb[2]
        img.data[i + 3] = Math.round(255 * a * k)
      }
    t.putImageData(img, 0, 0)
    dotTiles.set(key, c)
  }
  const pat = ctx.createPattern(c, 'repeat')!
  pat.setTransform(new DOMMatrix().translate(x + ox, y + oy))
  ctx.save()
  ctx.fillStyle = pat
  ctx.fillRect(x, y, w, h)
  ctx.restore()
}

/** lapisan `data-detail="1"` (di atas tekstur, jadi draw.top): radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1.6px) 0 0 / 6px 6px */
export function detailDots(ctx: Ctx, W: number, H: number) {
  dots(ctx, 0, 0, W, H, 6, [0, 0, 0], 0.05, 1, 1.6)
}

/**
 * Gambar ke lapisan terpisah lalu tempel dengan blend tertentu (elemen dengan mix-blend-mode + isi lebih dari satu
 * bagian, mis. teks + text-shadow, yang di CSS dibaurkan sebagai satu grup).
 */
export function blendLayer(ctx: Ctx, blend: GlobalCompositeOperation, draw: (l: Ctx) => void, alpha = 1) {
  const c = document.createElement('canvas')
  c.width = ctx.canvas.width
  c.height = ctx.canvas.height
  const l = c.getContext('2d')!
  l.setTransform(ctx.getTransform())
  draw(l)
  ctx.save()
  ctx.resetTransform()
  ctx.globalAlpha = alpha
  ctx.globalCompositeOperation = blend
  ctx.drawImage(c, 0, 0)
  ctx.restore()
}

/** tahun dari teks tanggal: 4 digit apa adanya, akhiran 2 digit (17.10.26) → 2026 */
export function yearOf(tanggal: string) {
  const four = tanggal.match(/\b(\d{4})\b/)
  if (four) return four[1]
  const two = tanggal.match(/[./\-\s](\d{2})\s*$/)
  return two ? `20${two[1]}` : ''
}

export const BULAN = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES']

/** baca tanggal bebas (17.10.26, 17/10/2026, 17 Oktober 2026, 17 OKT 2026); null kalau tidak dikenali */
export function parseTanggal(s: string): { d: number; m: number; y: number } | null {
  const t = s.trim()
  let m = t.match(/^(\d{1,2})\s*[./-]\s*(\d{1,2})\s*[./-]\s*(\d{2}|\d{4})$/)
  if (m) {
    const y = +m[3] < 100 ? 2000 + +m[3] : +m[3]
    if (+m[2] >= 1 && +m[2] <= 12) return { d: +m[1], m: +m[2], y }
  }
  m = t.match(/^(\d{1,2})\s+([A-Za-z]+)\.?\s+(\d{2}|\d{4})$/)
  if (m) {
    const k = m[2].slice(0, 3).toUpperCase().replace('AUG', 'AGU').replace('MAY', 'MEI').replace('OCT', 'OKT').replace('DEC', 'DES')
    const i = BULAN.indexOf(k)
    if (i >= 0) return { d: +m[1], m: i + 1, y: +m[3] < 100 ? 2000 + +m[3] : +m[3] }
  }
  return null
}

/**
 * Titik warna gradien CSS diinterpolasi dalam ruang premultiplied (beda dengan canvas kalau alpha berubah
 * di antara dua warna berbeda). Kembalikan titik tambahan supaya hasil canvas sama. Warna: rgba(r,g,b,a).
 */
export function pmStops(stops: [number, string][], steps = 8): [number, string][] {
  const parse = (c: string) => c.match(/[\d.]+/g)!.map(Number) as [number, number, number, number]
  const out: [number, string][] = []
  for (let i = 0; i < stops.length; i++) {
    const [o0, c0] = stops[i]
    out.push([o0, c0])
    if (i === stops.length - 1) break
    const [o1, c1] = stops[i + 1]
    const a = parse(c0)
    const b = parse(c1)
    for (let k = 1; k < steps; k++) {
      const t = k / steps
      const al = a[3] + (b[3] - a[3]) * t
      const ch = [0, 1, 2].map((j) => (al > 0 ? (a[j] * a[3] + (b[j] * b[3] - a[j] * a[3]) * t) / al : 0))
      out.push([o0 + (o1 - o0) * t, `rgba(${ch.map((v) => Math.round(v)).join(',')},${al.toFixed(4)})`])
    }
  }
  return out
}

/**
 * Teks dengan letter-spacing yang tetap memakai kerning font (seperti CSS), lewat `ctx.letterSpacing`.
 * y = sisi atas kotak konten (sama seperti text()). Teks kepanjangan dikecilkan sampai muat maxWidth.
 */
export function spacedText(ctx: Ctx, s: string, x: number, y: number, o: { family: string; size: number; weight?: number; color: string; letterSpacing: number; maxWidth?: number; align?: 'left' | 'center' | 'right' }) {
  if (!s) return
  ctx.save()
  const fontAt = (size: number) => `${o.weight ?? 400} ${size}px "${o.family}", sans-serif`
  const widthAt = (size: number) => {
    ctx.font = fontAt(size)
    ctx.letterSpacing = `${(o.letterSpacing * size) / o.size}px`
    return ctx.measureText(s).width
  }
  let size = o.size
  const w0 = widthAt(size)
  if (o.maxWidth && w0 > o.maxWidth) size = Math.max(o.size * 0.4, (o.size * o.maxWidth) / w0)
  const w = widthAt(size)
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  const ascent = ctx.measureText('Hg').fontBoundingBoxAscent
  const base = y + ascent + ((o.size - size) / 2) * 1.2
  const sx = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x
  ctx.fillStyle = o.color
  ctx.fillText(s, sx, base)
  ctx.restore()
}

/**
 * isi path aktif (sudah dibuat dengan beginPath/...) dengan radial-gradient elips berpusat cx,cy, jari-jari rx,ry.
 * `ellipse at X% Y%` farthest-corner = elips farthest-side (rx, ry) dikali √2.
 */
export function fillEllipseGradient(ctx: Ctx, path: () => void, cx: number, cy: number, rx: number, ry: number, stops: [number, string][]) {
  ctx.save()
  path()
  ctx.clip()
  ctx.translate(cx, cy)
  ctx.scale(1, ry / rx)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  for (const [o, c] of stops) g.addColorStop(o, c)
  ctx.fillStyle = g
  const R = Math.max(rx, ry) * 4 + 4000
  ctx.fillRect(-R, -R * (rx / ry), 2 * R, 2 * R * (rx / ry))
  ctx.restore()
}
