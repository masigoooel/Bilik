// Helper bersama kategori Bestie & Couple
import { border, insetShadows, measure, type Ctx, type Radii, type TextOpts } from '../paint'
import type { Slot } from '../types'

export const INK = '#1f1d1a'
export const SERIF = 'DM Serif Display'
export const MONO = 'Space Mono'
export const HAND = 'Caveat'
/** sama dengan <link> di semua file desain bestie-couple (Caveat hanya 600/700: teks Caveat 400 di desain tampil memakai face 600) */
export const FONTS = ['DM Serif Display', 'Space Mono:400,700', 'Caveat:600,700']

/** huruf pertama (huruf/angka) dari nama, kapital; '' kalau kosong */
export function initial(nama: string | undefined) {
  const m = (nama ?? '').match(/[\p{L}\p{N}]/u)
  return m ? m[0].toLocaleUpperCase('id') : ''
}

/** tahun dari teks tanggal user: 4 digit, atau dd.mm.yy → 20yy; null kalau tidak terbaca */
export function yearOf(tanggal: string | undefined): string | null {
  const s = tanggal?.trim() ?? ''
  const four = s.match(/\b(\d{4})\b/)
  if (four) return four[1]
  const short = s.match(/\b\d{1,2}\s*[./-]\s*\d{1,2}\s*[./-]\s*(\d{2})\b/)
  return short ? `20${short[1]}` : null
}

/** bungkus gambar dengan rotate(deg) di titik (ox, oy) */
export function rotated(ctx: Ctx, ox: number, oy: number, deg: number, draw: () => void) {
  ctx.save()
  ctx.translate(ox, oy)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.translate(-ox, -oy)
  draw()
  ctx.restore()
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
 * Baca teks tanggal bebas dari user ("17.10.2026", "17/10/26", "Sabtu, 17 Oktober 2026", "17 okt").
 * Tanpa tahun: tahun berjalan. null kalau tidak terbaca.
 */
export function parseTanggal(s: string | undefined): DateParts | null {
  const t = (s ?? '').trim().toLowerCase()
  if (!t) return null
  const year = (v: string) => (v.length === 2 ? 2000 + Number(v) : Number(v))
  const ok = (d: number, m: number, y: number): DateParts | null => (d >= 1 && d <= new Date(y, m, 0).getDate() && m >= 1 && m <= 12 ? { d, m, y } : null)
  let r = t.match(/(\d{1,2})\s*[./-]\s*(\d{1,2})\s*[./-]\s*(\d{4}|\d{2})\b/)
  if (r) return ok(Number(r[1]), Number(r[2]), year(r[3]))
  r = t.match(/(\d{1,2})\s+([a-z]+)\.?(?:\s+(\d{4}|\d{2}))?\b/)
  if (r && MONTHS[r[2]]) return ok(Number(r[1]), MONTHS[r[2]], r[3] ? year(r[3]) : new Date().getFullYear())
  return null
}

/**
 * Bungkus teks per kata ke paling banyak maxLines baris selebar maxWidth; font dikecilkan sampai muat
 * (kata tidak pernah dipotong). Hasil: baris + ukuran font.
 */
export function wrapFit(ctx: Ctx, s: string, maxWidth: number, maxLines: number, o: Omit<TextOpts, 'color'>) {
  const words = s.trim().split(/\s+/).filter(Boolean)
  let size = o.size
  let lines: string[] = []
  for (let i = 0; i < 40; i++) {
    const w = (str: string) => measure(ctx, str, { ...o, size })
    lines = []
    let line = ''
    for (const word of words) {
      const next = line ? `${line} ${word}` : word
      if (line && w(next) > maxWidth) {
        lines.push(line)
        line = word
      } else line = next
    }
    if (line) lines.push(line)
    if ((lines.length <= maxLines && lines.every((l) => w(l) <= maxWidth)) || size <= o.size * 0.35) break
    size *= 0.94
  }
  if (lines.length > maxLines) lines = [...lines.slice(0, maxLines - 1), lines.slice(maxLines - 1).join(' ')]
  return { lines, size }
}


/**
 * Satu sisi border dashed seperti Chrome: dash = 3×lebar (lebar < 3) atau 2×lebar, celah ±2×lebar / ±1×lebar
 * disesuaikan supaya garis mulai & berakhir dengan dash. Posisi dash dibulatkan ke piksel.
 */
export function dashedLine(ctx: Ctx, x: number, y: number, len: number, width: number, color: string, vertical = false) {
  const d = width < 3 ? width * 3 : width * 2
  const g = width < 3 ? width * 2 : width
  const n = Math.max(2, Math.floor((len + g) / (d + g)))
  const gap = (len - n * d) / (n - 1)
  ctx.save()
  ctx.fillStyle = color
  for (let i = 0; i < n; i++) {
    const at = Math.round(i * (d + gap))
    if (vertical) ctx.fillRect(x, y + at, width, d)
    else ctx.fillRect(x + at, y, d, width)
  }
  ctx.restore()
}

/** border: Npx dashed di keempat sisi kotak (lihat dashedLine) */
export function dashedBorder(ctx: Ctx, x: number, y: number, w: number, h: number, width: number, color: string) {
  dashedLine(ctx, x, y, w, width, color)
  dashedLine(ctx, x, y + h - width, w, width, color)
  dashedLine(ctx, x, y, h, width, color, true)
  dashedLine(ctx, x + w - width, y, h, width, color, true)
}

/**
 * Bayangan dalam kotak FOTO di semua desain bestie-couple (digambar di draw.over, di atas foto):
 * box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 8px rgba(0,0,0,0.16)
 */
export function photoInset(ctx: Ctx, x: number, y: number, w: number, h: number, r: Radii = 0) {
  insetShadows(ctx, x, y, w, h, [{ dx: 0, dy: 3, blur: 8, color: 'rgba(0,0,0,0.16)' }], r)
  border(ctx, x, y, w, h, 1, 'rgba(0,0,0,0.12)', r)
}

/** photoInset untuk setiap slot (ikut rotate slot di titik tengahnya) */
export function slotInsets(ctx: Ctx, slots: Slot[]) {
  for (const s of slots) {
    if (s.rotate) rotated(ctx, s.x + s.w / 2, s.y + s.h / 2, s.rotate, () => photoInset(ctx, s.x, s.y, s.w, s.h, s.radius ?? 0))
    else photoInset(ctx, s.x, s.y, s.w, s.h, s.radius ?? 0)
  }
}

/**
 * CSS `radial-gradient(ellipse at px% py%, ...)` ukuran default farthest-corner pada kotak x,y,W,H.
 * Elips farthest-corner = elips farthest-side (rx, ry) dikali √2.
 */
export function ellipseFill(ctx: Ctx, W: number, H: number, px: number, py: number, stops: [number, string][], x0 = 0, y0 = 0) {
  const cx = W * px
  const cy = H * py
  const rx = Math.max(cx, W - cx) * Math.SQRT2
  const ry = Math.max(cy, H - cy) * Math.SQRT2
  ctx.save()
  ctx.beginPath()
  ctx.rect(x0, y0, W, H)
  ctx.clip()
  ctx.translate(x0 + cx, y0 + cy)
  ctx.scale(1, ry / rx)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  for (const [o, c] of stops) g.addColorStop(o, c)
  ctx.fillStyle = g
  const k = rx / ry
  ctx.fillRect(-cx - 1, (-cy - 1) * k, W + 2, (H + 2) * k)
  ctx.restore()
}
