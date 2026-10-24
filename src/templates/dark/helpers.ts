// Helper kategori Dark & Grunge (tambahan untuk ../paint)
import { border, contentHeight, font, insetShadows, type Ctx, type Radii } from '../paint'

/** cadangan monospace seperti desain (glyph ℗ dll. diambil dari font monospace sistem) */
export const SPECIAL = '"Special Elite", monospace'
export const FRAKTUR = 'UnifrakturMaguntia'
/** <link> desain hanya memuat Cinzel Decorative 700 & Caveat 700: Chrome memakai face itu juga untuk weight 400 */
export const CINZEL = 'Cinzel Decorative'
export const CAVEAT = 'Caveat'
export const MONO = 'Space Mono'
/** sama dengan <link> file desain dark-grunge (Caveat hanya di diary-hitam & papan-bukti) */
export const FONTS = ['UnifrakturMaguntia', 'Cinzel Decorative:700', 'Special Elite', 'Space Mono:400,700']
/** data-texture semua file desain dark-grunge: opacity 0.1, screen */
export const TEXTURE = { opacity: 0.1, blend: 'screen' as const }

/** bungkus gambar dengan rotate(deg) di titik (ox, oy): transform CSS (default origin = titik tengah elemen) */
export function rotated(ctx: Ctx, ox: number, oy: number, deg: number, draw: () => void) {
  ctx.save()
  ctx.translate(ox, oy)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.translate(-ox, -oy)
  draw()
  ctx.restore()
}

/** lingkaran penuh (border-radius 50%) di kotak x,y,d,d */
export function disc(ctx: Ctx, x: number, y: number, d: number, color: string | CanvasGradient) {
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

export type TOpts = {
  family: string
  size: number
  weight?: number
  italic?: boolean
  color: string
  /** letter-spacing px (lewat ctx.letterSpacing, kerning font tetap jalan seperti CSS) */
  ls?: number
  align?: 'left' | 'center' | 'right'
  /** perkecil font sampai muat (kata tidak dipotong) */
  maxWidth?: number
  /** italic sintetis Chrome (face italic tidak dimuat desain): skewX 1/4 di garis dasar */
  faux?: boolean
}

function setFont(ctx: Ctx, o: TOpts, size: number) {
  ctx.font = font(o.family, size, o.weight ?? 400, o.italic)
  ctx.letterSpacing = `${((o.ls ?? 0) * size) / o.size}px`
}

/** lebar teks seperti CSS (letter-spacing ikut dihitung sesudah tiap huruf, termasuk yang terakhir) */
export function width(ctx: Ctx, s: string, o: TOpts, size = o.size) {
  ctx.save()
  setFont(ctx, o, size)
  const w = ctx.measureText(s).width
  ctx.restore()
  return w
}

/** ukuran font setelah dikecilkan supaya muat maxWidth */
export function fitSize(ctx: Ctx, s: string, o: TOpts) {
  if (!o.maxWidth) return o.size
  const w = width(ctx, s, o)
  return w > o.maxWidth ? Math.max(o.size * 0.4, (o.size * o.maxWidth) / w) : o.size
}

/**
 * Teks satu baris. y = sisi atas kotak konten (line-height normal) pada ukuran asli;
 * kalau dikecilkan, baris tetap dipusatkan di kotak yang sama. Mengembalikan lebar akhir.
 */
export function txt(ctx: Ctx, s: string, x: number, y: number, o: TOpts) {
  if (!s) return 0
  const size = fitSize(ctx, s, o)
  ctx.save()
  const ch0 = contentHeight(ctx, o.family, o.size, o.weight)
  const ch = contentHeight(ctx, o.family, size, o.weight)
  setFont(ctx, o, size)
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  const w = ctx.measureText(s).width
  const ascent = ctx.measureText('Hg').fontBoundingBoxAscent
  const sx = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x
  // Chrome menaruh baseline teks di piksel penuh
  const base = Math.round(y + (ch0 - ch) / 2 + ascent)
  if (o.faux) {
    ctx.translate(0, base)
    ctx.transform(1, 0, -0.25, 1, 0, 0)
    ctx.translate(0, -base)
  }
  ctx.fillStyle = o.color
  ctx.fillText(s, sx, base)
  ctx.restore()
  return w
}

/** sisi atas kotak konten teks di baris dengan line-height angka (lh × size) yang mulai di boxTop */
export function lineTop(ctx: Ctx, family: string, size: number, lh: number, boxTop: number, weight = 400) {
  return boxTop + (size * lh - contentHeight(ctx, family, size, weight)) / 2
}

/**
 * Bungkus teks per kata ke maksimal maxLines baris selebar maxW; kalau tidak muat, font dikecilkan
 * (kata tidak pernah dipotong). Mengembalikan baris-baris + ukuran font akhir.
 */
export function wrap(ctx: Ctx, s: string, o: TOpts, maxW: number, maxLines: number) {
  const words = s.trim().split(/\s+/).filter(Boolean)
  let size = o.size
  for (let i = 0; i < 40; i++) {
    const lines: string[] = []
    let cur = ''
    let ok = true
    for (const wd of words) {
      const next = cur ? `${cur} ${wd}` : wd
      if (!cur || width(ctx, next, o, size) <= maxW) cur = next
      else {
        lines.push(cur)
        cur = wd
      }
      if (width(ctx, cur, o, size) > maxW) ok = false
    }
    if (cur) lines.push(cur)
    if (ok && lines.length <= maxLines) return { lines, size }
    if (size <= o.size * 0.4) return { lines, size }
    size = Math.max(o.size * 0.4, size * 0.94)
  }
  return { lines: [words.join(' ')], size }
}

// ---------- tanggal ----------

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

/** baca teks tanggal bebas ("17.10.2026", "17/10/26", "17 Oktober 2026"); null kalau tidak terbaca */
export function parseTanggal(s: string | undefined): { d: number; m: number; y: number } | null {
  const t = (s ?? '').trim().toLowerCase()
  if (!t) return null
  const year = (v: string) => (v.length === 2 ? 2000 + Number(v) : Number(v))
  const ok = (d: number, m: number, y: number) => (d >= 1 && d <= 31 && m >= 1 && m <= 12 ? { d, m, y } : null)
  let r = t.match(/(\d{1,2})\s*[./-]\s*(\d{1,2})\s*[./-]\s*(\d{4}|\d{2})\b/)
  if (r) return ok(Number(r[1]), Number(r[2]), year(r[3]))
  r = t.match(/(\d{1,2})\s+([a-z]+)\.?\s+(\d{4}|\d{2})\b/)
  if (r && MONTHS[r[2]]) return ok(Number(r[1]), MONTHS[r[2]], year(r[3]))
  return null
}

/** tahun 4 digit dari teks tanggal user ('' kalau tidak ada) */
export function tahun(tanggal: string | undefined) {
  const p = parseTanggal(tanggal)
  if (p) return String(p.y)
  return tanggal?.match(/\b(19|20)\d{2}\b/)?.[0] ?? ''
}

/** angka romawi (1..3999) */
export function roman(n: number) {
  const table: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let out = ''
  for (const [v, s] of table)
    while (n >= v) {
      out += s
      n -= v
    }
  return out
}

/** gabung bagian yang terisi dengan pemisah (bagian kosong dilewati, tanpa tanda baca menggantung) */
export function join(parts: (string | undefined | null | false)[], sep = ' · ') {
  return parts.map((p) => (p || '').trim()).filter(Boolean).join(sep)
}

// ---------- lapisan bersama desain dark-grunge ----------

type SlotBox = { x: number; y: number; w: number; h: number; rotate?: number; radius?: Radii }

/**
 * box-shadow kotak FOTO desain: inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 8px rgba(0,0,0,0.16).
 * Tergambar di atas isi kotak → panggil di draw.over.
 */
export function slotInset(ctx: Ctx, s: SlotBox) {
  const draw = () => {
    insetShadows(ctx, s.x, s.y, s.w, s.h, [{ dx: 0, dy: 3, blur: 8, color: 'rgba(0,0,0,0.16)' }], s.radius ?? 0)
    border(ctx, s.x, s.y, s.w, s.h, 1, 'rgba(0,0,0,0.12)', s.radius ?? 0)
  }
  if (s.rotate) rotated(ctx, s.x + s.w / 2, s.y + s.h / 2, s.rotate, draw)
  else draw()
}

/**
 * radial-gradient(ellipse at px% py%, ...) ukuran farthest-corner di kotak x,y,w,h.
 * Elips farthest-side diperbesar √2 supaya melewati sudut terjauh (rasio sumbu tetap).
 */
export function ellipseGradient(ctx: Ctx, x: number, y: number, w: number, h: number, px: number, py: number, stops: [number, string][]) {
  const cx = x + w * px
  const cy = y + h * py
  const rx = Math.SQRT2 * Math.max(w * px, w * (1 - px))
  const ry = Math.SQRT2 * Math.max(h * py, h * (1 - py))
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

/**
 * div data-detail desain: radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.35) 100%)
 * di atas seluruh kanvas. Muncul sesudah div texture → draw.top.
 */
export function vignette(ctx: Ctx, W: number, H: number) {
  ellipseGradient(ctx, 0, 0, W, H, 0.5, 0.45, [
    [0, 'rgba(0,0,0,0)'],
    [0.55, 'rgba(0,0,0,0)'],
    [1, 'rgba(0,0,0,0.35)'],
  ])
}

/** "17.X.MMXXVI" dari teks tanggal user; tidak terbaca → teks user (kapital) */
export function romanDate(tanggal: string | undefined) {
  const t = tanggal?.trim() ?? ''
  const p = parseTanggal(t)
  return p ? `${p.d}.${roman(p.m)}.${roman(p.y)}` : t.toUpperCase()
}
