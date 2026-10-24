// Helper bersama kategori Klasik & Minimalis
import { border, box, dropShadow, insetShadows, setShadow, text, type Ctx, type TextOpts } from '../paint'

export const INK = '#161616'
export const GREY = '#6b6760'
export const SERIF = 'Instrument Serif'
export const MONO = 'IBM Plex Mono'
/** sama dengan <link> di semua file desain klasik-minimalis */
export const FONTS = ['Instrument Serif:400,400i', 'IBM Plex Mono:400,600']

/**
 * Siku penanda di empat pojok: div 34x34 + border 2px di dua sisi (kotak 36x36).
 * l/t = left/top siku kiri atas, r/b = left/top siku kanan bawah (angka CSS desain, tidak selalu simetris).
 */
export function cornerMarks(ctx: Ctx, l: number, tp: number, r: number, b: number, color = INK, size = 36, t = 2) {
  // kiri atas
  box(ctx, l, tp, t, size, color)
  box(ctx, l, tp, size, t, color)
  // kanan atas
  box(ctx, r + size - t, tp, t, size, color)
  box(ctx, r, tp, size, t, color)
  // kiri bawah
  box(ctx, l, b, t, size, color)
  box(ctx, l, b + size - t, size, t, color)
  // kanan bawah
  box(ctx, r + size - t, b, t, size, color)
  box(ctx, r, b + size - t, size, t, color)
}

/** garis horizontal (border-top / border-bottom) */
export function hline(ctx: Ctx, x: number, y: number, w: number, t: number, color: string) {
  box(ctx, x, y, w, t, color)
}

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const MONTH_KEYS: [RegExp, number][] = [
  [/\bjan/i, 0],
  [/\bfeb/i, 1],
  [/\bmar/i, 2],
  [/\bapr/i, 3],
  [/\b(mei|may)/i, 4],
  [/\bjun/i, 5],
  [/\bjul/i, 6],
  [/\b(agu|agt|aug)/i, 7],
  [/\bsep/i, 8],
  [/\b(okt|oct)/i, 9],
  [/\bnov/i, 10],
  [/\b(des|dec)/i, 11],
]

/** nama bulan dari teks tanggal user ("17.10.2026", "17/10/26", "19 okt 2026", ...); null kalau tidak terbaca */
export function monthName(tanggal: string | undefined): string | null {
  const s = tanggal?.trim()
  if (!s) return null
  const num = s.match(/\b(\d{1,2})\s*[./\-·]\s*(\d{1,2})\s*[./\-·]\s*(\d{2,4})\b/)
  if (num) {
    const m = Number(num[2])
    if (m >= 1 && m <= 12) return MONTH_NAMES[m - 1]
  }
  for (const [re, i] of MONTH_KEYS) if (re.test(s)) return MONTH_NAMES[i]
  return null
}

/** tahun 4 digit dari teks tanggal user; null kalau tidak ada */
export function yearOf(tanggal: string | undefined): string | null {
  const m = tanggal?.match(/\b(\d{4})\b/)
  return m ? m[1] : null
}

type Rect = { x: number; y: number; w: number; h: number }

/** tekstur desain baru (div data-texture: opacity 0.09, multiply) */
export const TEXTURE_09 = { opacity: 0.09, blend: 'multiply' as const }

/**
 * kotak FOTO desain baru: `box-shadow: inset 0 0 0 1px ring, inset 0 3px 8px blur` (urutan CSS, ring paling atas).
 * Digambar di draw.over karena menimpa isi foto.
 */
export function photoInset(ctx: Ctx, s: Rect, ring = 'rgba(0,0,0,0.10)', blur = 'rgba(0,0,0,0.14)') {
  insetShadows(ctx, s.x, s.y, s.w, s.h, [{ dx: 0, dy: 3, blur: 8, color: blur }])
  border(ctx, s.x, s.y, s.w, s.h, 1, ring)
}

/** `0 1px 0 rgba(255,255,255,0.6)` di bawah kotak FOTO (draw.under) */
export function photoLift(ctx: Ctx, s: Rect, color = 'rgba(255,255,255,0.6)') {
  dropShadow(ctx, s.x, s.y, s.w, s.h, 0, 1, 0, color)
}

/** `text-shadow: 0 1px 0 rgba(255,255,255,0.55), 0 -1px 0 rgba(0,0,0,0.12)` (bayangan pertama paling atas) */
export function engraved(ctx: Ctx, s: string, x: number, y: number, o: TextOpts) {
  if (!s) return 0
  text(ctx, s, x, y - 1, { ...o, color: 'rgba(0,0,0,0.12)' })
  text(ctx, s, x, y + 1, { ...o, color: 'rgba(255,255,255,0.55)' })
  return text(ctx, s, x, y, o)
}

/** path elips yang mengisi kotak x,y,w,h (border-radius: 50%) */
export function ellipsePath(ctx: Ctx, x: number, y: number, w: number, h: number) {
  ctx.beginPath()
  ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
}

/** `box-shadow: inset 0 0 0 <t>px color` pada kotak border-radius 50% (cincin elips setebal t) */
export function ellipseRing(ctx: Ctx, x: number, y: number, w: number, h: number, t: number, color: string) {
  ctx.beginPath()
  ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
  ctx.ellipse(x + w / 2, y + h / 2, w / 2 - t, h / 2 - t, 0, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill('evenodd')
}

/** angka Romawi (2026 → MMXXVI) */
export function roman(n: number) {
  const map: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let s = ''
  for (const [v, r] of map) while (n >= v) { s += r; n -= v }
  return s
}

/**
 * CSS menginterpolasi gradien dengan alpha premultiplied, canvas tidak (putih transparan → hitam transparan jadi abu gelap).
 * Ubah stop rgba jadi banyak stop kecil yang hasilnya sama dengan CSS.
 */
export function premulStops(stops: [number, [number, number, number, number]][], steps = 24): [number, string][] {
  const out: [number, string][] = []
  for (let i = 0; i < stops.length - 1; i++) {
    const [o0, c0] = stops[i]
    const [o1, c1] = stops[i + 1]
    for (let k = 0; k < steps; k++) {
      const t = k / steps
      const a = c0[3] + (c1[3] - c0[3]) * t
      const ch = (j: number) => (a ? Math.round((c0[j] * c0[3] + (c1[j] * c1[3] - c0[j] * c0[3]) * t) / a) : c1[j])
      out.push([o0 + (o1 - o0) * t, `rgba(${ch(0)},${ch(1)},${ch(2)},${a.toFixed(4)})`])
    }
  }
  const [ol, cl] = stops[stops.length - 1]
  out.push([ol, `rgba(${cl[0]},${cl[1]},${cl[2]},${cl[3]})`])
  return out
}

/**
 * `box-shadow: inset dx dy blur color` untuk kotak bulat (radius). Sama dengan insetShadows di paint.ts, tapi bingkai
 * pembawa bayangan diisi warna bayangan itu sendiri (bukan #000), supaya tepi anti-alias clip tidak bocor jadi garis hitam.
 */
export function insetBlurRound(ctx: Ctx, x: number, y: number, w: number, h: number, shadows: { dx: number; dy: number; blur: number; color: string }[], r: number) {
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.clip()
  for (const s of [...shadows].reverse()) {
    ctx.save()
    setShadow(ctx, s.dx, s.dy, s.blur, s.color)
    ctx.beginPath()
    ctx.rect(x - 200, y - 200, w + 400, h + 400)
    ctx.roundRect(x, y, w, h, r)
    ctx.fillStyle = s.color
    ctx.fill('evenodd')
    ctx.restore()
  }
  ctx.restore()
}
