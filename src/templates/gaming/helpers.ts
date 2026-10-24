// Helper khusus kategori Gaming & Pixel
import { border, box, font, insetShadows, linear, rrPath, setShadow, snap, text, type Ctx, type Radii, type TextOpts } from '../paint'

export const PIXEL = 'Press Start 2P'
export const SILK = 'Silkscreen'
/** daftar cadangan seperti CSS desain (glyph simbol ♥ ★ ▶ ✓ jatuh ke font monospace sistem) */
export const PIXEL_MONO = '"Press Start 2P", monospace'
export const SILK_MONO = '"Silkscreen", monospace'
/** sama dengan <link> di file desain gaming-pixel (pilih-karakter tanpa Space Mono) */
export const FONTS = ['Press Start 2P', 'Silkscreen', 'Space Mono:400,700']

/**
 * Bingkai piksel: `box-shadow: 0 -Npx 0 0 c, 0 Npx 0 0 c, -Npx 0 0 0 c, Npx 0 0 0 c`.
 * Empat salinan kotak yang digeser, sudutnya kosong (khas pixel art). Digambar di belakang kotaknya.
 */
export function pixelFrame(ctx: Ctx, x0: number, y0: number, w0: number, h0: number, t: number, color: string) {
  // tepi kotak dibulatkan ke piksel penuh seperti Chrome, supaya garis piksel tetap tajam
  const { x, y, w, h } = snap(x0, y0, w0, h0)
  ctx.fillStyle = color
  ctx.fillRect(x, y - t, w, t)
  ctx.fillRect(x, y + h, w, t)
  ctx.fillRect(x - t, y, t, h)
  ctx.fillRect(x + w, y, t, h)
}

/** `box-shadow: 0 0 0 Npx c` (spread) di belakang kotak x,y,w,h dengan radius r */
export function spread(ctx: Ctx, x: number, y: number, w: number, h: number, n: number, color: string, r = 0) {
  // seperti CSS: bayangan tidak tampak di bawah kotaknya sendiri (penting untuk kotak transparan)
  ctx.beginPath()
  rrPath(ctx, x - n, y - n, w + 2 * n, h + 2 * n, r ? r + n : 0)
  rrPath(ctx, x, y, w, h, r)
  ctx.fillStyle = color
  ctx.fill('evenodd')
}

/** lingkaran penuh (border-radius 50%) di kotak x,y,d,d */
export function disc(ctx: Ctx, x: number, y: number, d: number, color: string) {
  ctx.beginPath()
  ctx.arc(x + d / 2, y + d / 2, d / 2, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}

/** cincin (border Npx solid; border-radius 50%) di kotak x,y,d,d */
export function ring(ctx: Ctx, x: number, y: number, d: number, width: number, color: string) {
  const c = d / 2
  ctx.beginPath()
  ctx.arc(x + c, y + c, c, 0, Math.PI * 2)
  ctx.arc(x + c, y + c, c - width, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill('evenodd')
}

/** gabung bagian teks dengan pemisah, bagian kosong dilewati */
export function join(parts: (string | undefined | null | false)[], sep = ' · ') {
  return parts.map((p) => (p || '').trim()).filter(Boolean).join(sep)
}

/** nama pemain: teks user, atau cadangan kalem "PEMAIN n" */
export function playerName(s: string | undefined, n: number) {
  return s?.trim() || `PEMAIN ${n}`
}

/**
 * Garis putus-putus satu sisi (border/outline dashed) sepanjang len, tebal t.
 * Pola Chrome: t ≥ 3 → garis 2t, jeda t; t < 3 → garis 3t, jeda 2t; jeda diregangkan supaya kedua ujung berupa garis penuh.
 */
export function dashedLine(ctx: Ctx, x: number, y: number, len: number, t: number, color: string, vertical = false) {
  const dash = t >= 3 ? 2 * t : 3 * t
  const gap0 = t >= 3 ? t : 2 * t
  const n = Math.max(1, Math.round((len + gap0) / (dash + gap0)))
  const gap = n > 1 ? (len - n * dash) / (n - 1) : 0
  ctx.fillStyle = color
  for (let i = 0; i < n; i++) {
    const p = i * (dash + gap)
    if (vertical) ctx.fillRect(x, y + p, t, dash)
    else ctx.fillRect(x + p, y, dash, t)
  }
}

/** kotak putus-putus (outline/border dashed) di dalam kotak x,y,w,h */
export function dashedRect(ctx: Ctx, x0: number, y0: number, w0: number, h0: number, t: number, color: string) {
  const { x, y, w, h } = snap(x0, y0, w0, h0)
  dashedLine(ctx, x, y, w, t, color)
  dashedLine(ctx, x, y + h - t, w, t, color)
  dashedLine(ctx, x, y, h, t, color, true)
  dashedLine(ctx, x + w - t, y, h, t, color, true)
}

/**
 * `box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 8px rgba(0,0,0,0.16)` pada kotak FOTO.
 * Tergambar di atas isi kotak → panggil di draw.over.
 */
export function slotInset(ctx: Ctx, x: number, y: number, w: number, h: number, r: Radii = 0) {
  insetShadows(ctx, x, y, w, h, [{ dx: 0, dy: 3, blur: 8, color: 'rgba(0,0,0,0.16)' }], r)
  border(ctx, x, y, w, h, 1, 'rgba(0,0,0,0.12)', r)
}

/**
 * div data-detail layar CRT (di atas semuanya):
 * repeating-linear-gradient(transparent 0 3px, rgba(0,0,0,0.10) 3px 4px),
 * radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.35) 100%)
 */
export function crt(ctx: Ctx, W: number, H: number) {
  // vinyet: elips farthest-corner = farthest-side × √2 (rasio tetap)
  const rx = (Math.SQRT2 * W) / 2
  const k = H / W
  ctx.save()
  ctx.translate(W / 2, H / 2)
  ctx.scale(1, k)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(0.6, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(0,0,0,0.35)')
  ctx.fillStyle = g
  ctx.fillRect(-W / 2, -H / 2 / k, W, H / k)
  ctx.restore()
  // garis scan: baris ke-4 tiap 4px
  ctx.fillStyle = 'rgba(0,0,0,0.10)'
  for (let y = 3; y < H; y += 4) ctx.fillRect(0, y, W, 1)
}

/** div data-detail kilap: linear-gradient(125deg, transparent 28%, rgba(255,255,255,0.18) 40%, transparent 52%) */
export function glare(ctx: Ctx, W: number, H: number) {
  box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 125, [
    [0, 'rgba(255,255,255,0)'],
    [0.28, 'rgba(255,255,255,0)'],
    [0.4, 'rgba(255,255,255,0.18)'],
    [0.52, 'rgba(255,255,255,0)'],
    [1, 'rgba(255,255,255,0)'],
  ]))
}

/**
 * `radial-gradient(ellipse at px% py%, ...)` ukuran farthest-corner di kotak x,y,w,h.
 * Elips farthest-corner = farthest-side × √2 (rasio tetap). stops offset 0..1.
 */
export function ellipseGradient(ctx: Ctx, x: number, y: number, w: number, h: number, px: number, py: number, stops: [number, string][]) {
  const cx = x + w * px
  const cy = y + h * py
  const rx = Math.SQRT2 * Math.max(cx - x, x + w - cx)
  const ry = Math.SQRT2 * Math.max(cy - y, y + h - cy)
  const k = ry / rx
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  ctx.translate(cx, cy)
  ctx.scale(1, k)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  for (const [o, c] of stops) g.addColorStop(o, c)
  ctx.fillStyle = g
  ctx.fillRect(x - cx, (y - cy) / k, w, h / k)
  ctx.restore()
}

/** `radial-gradient(circle at px% py%, ...)` (farthest-corner) untuk kotak x,y,w,h */
export function circleGradient(ctx: Ctx, x: number, y: number, w: number, h: number, px: number, py: number, stops: [number, string][]) {
  const cx = x + w * px
  const cy = y + h * py
  const r = Math.hypot(Math.max(cx - x, x + w - cx), Math.max(cy - y, y + h - cy))
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  for (const [o, c] of stops) g.addColorStop(o, c)
  return g
}

/** `conic-gradient(from Adeg at px% py%, ...)` untuk kotak x,y,w,h (stop tanpa posisi = rata) */
export function conicGradient(ctx: Ctx, x: number, y: number, w: number, h: number, from: number, px: number, py: number, colors: string[]) {
  // CSS 0deg = ke atas, canvas 0 = ke kanan
  const g = ctx.createConicGradient(((from - 90) * Math.PI) / 180, x + w * px, y + h * py)
  colors.forEach((c, i) => g.addColorStop(i / (colors.length - 1), c))
  return g
}

/** teks font tegak yang dipakai `font-style: italic` (italic sintetis Chrome: skew ~14° di garis dasar) */
export function fauxItalic(ctx: Ctx, s: string, x: number, y: number, o: TextOpts) {
  ctx.save()
  ctx.font = font(o.family, o.size, o.weight)
  const base = y + (ctx.measureText('Hg').fontBoundingBoxAscent ?? o.size * 0.8)
  ctx.translate(0, base)
  ctx.transform(1, 0, -0.25, 1, 0, 0)
  ctx.translate(0, -base)
  text(ctx, s, x, y, { ...o, italic: false })
  ctx.restore()
}

/**
 * Border 4 sisi dengan warna berbeda (mis. `border-color: terang gelap gelap terang`) + radius.
 * Sambungan sudut dipotong diagonal seperti Chrome. light = atas & kiri, dark = kanan & bawah.
 */
export function bevelBorder(ctx: Ctx, x: number, y: number, w: number, h: number, b: number, light: string, dark: string, r: number) {
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, x, y, w, h, r)
  rrPath(ctx, x + b, y + b, w - 2 * b, h - 2 * b, Math.max(0, r - b))
  ctx.clip('evenodd')
  ctx.fillStyle = dark
  ctx.fillRect(x, y, w, h)
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w, y)
  ctx.lineTo(x + w - b, y + b)
  ctx.lineTo(x + b, y + h - b)
  ctx.lineTo(x, y + h)
  ctx.closePath()
  ctx.fillStyle = light
  ctx.fill()
  ctx.restore()
}

/** transform: rotate(deg) di titik (cx, cy); fn menggambar dengan koordinat yang belum diputar */
export function rotated(ctx: Ctx, cx: number, cy: number, deg: number, fn: () => void) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.translate(-cx, -cy)
  fn()
  ctx.restore()
}

/** pisah teks user per baris / " / " / "|" (bagian kosong dibuang) */
export function splitLines(s: string | undefined) {
  return (s ?? '').split(/\n|\s\/\s|\|/).map((p) => p.trim()).filter(Boolean)
}

/**
 * `box-shadow: inset dx dy blur color` (satu bayangan blur). Seperti insetShadows di paint.ts, tapi "bingkai" penebar
 * bayangan digambar jauh di luar kanvas (hanya bayangannya yang jatuh ke dalam), jadi tepi clip yang anti-alias
 * tidak menampakkan garis hitam pada bentuk bulat.
 */
export function insetBlur(ctx: Ctx, x: number, y: number, w: number, h: number, dx: number, dy: number, blur: number, color: string, r: Radii = 0) {
  const OFF = 10000
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, x, y, w, h, r)
  ctx.clip()
  setShadow(ctx, dx - OFF, dy, blur, color)
  ctx.beginPath()
  ctx.rect(x - 200 + OFF, y - 200, w + 400, h + 400)
  rrPath(ctx, x + OFF, y, w, h, r)
  ctx.fillStyle = '#000'
  ctx.fill('evenodd')
  ctx.restore()
}
