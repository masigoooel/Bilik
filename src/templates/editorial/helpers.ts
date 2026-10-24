// Helper kategori Editorial & Majalah (tambahan untuk ../paint)
import { border, contentHeight, font, rrPath, setShadow, type Ctx, type Radii } from '../paint'
import type { FontSpec } from '../types'

export const INK = '#141414'
export const SERIF = 'Bodoni Moda'
export const MONO = 'IBM Plex Mono'

/** sama dengan <link> di semua file desain editorial-majalah (Bodoni Moda dengan sumbu opsz) */
export const FONTS: FontSpec[] = [
  { family: 'Bodoni Moda', css: 'Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,800;1,6..96,400', faces: ['400', '800', 'italic 400'] },
  'IBM Plex Mono:400,600',
]
export const TEXTURE = { opacity: 0.09, blend: 'multiply' as const }

/**
 * bayangan inset kotak FOTO di desain (digambar di atas foto, jadi dipanggil di draw.over):
 * `box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 8px rgba(0,0,0,0.16)` di padding box
 */
export function fotoInset(ctx: Ctx, x: number, y: number, w: number, h: number, r: Radii = 0) {
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, x, y, w, h, r)
  ctx.clip()
  // bingkai digambar jauh di luar kanvas, hanya bayangannya yang jatuh ke dalam kotak
  // (pinggir antialias bingkai hitam tidak ikut tergambar di tepi kotak bulat)
  const off = 20000
  setShadow(ctx, off, 3, 8, 'rgba(0,0,0,0.16)')
  ctx.beginPath()
  ctx.rect(x - off - 200, y - 200, w + 400, h + 400)
  rrPath(ctx, x - off, y, w, h, r)
  ctx.fillStyle = '#000'
  ctx.fill('evenodd')
  ctx.restore()
  // inset 0 0 0 1px = cincin 1px di dalam tepi (digambar paling atas)
  border(ctx, x, y, w, h, 1, 'rgba(0,0,0,0.12)', r)
}

export type TOpts = {
  family: string
  size: number
  weight?: number
  italic?: boolean
  color: string
  /** letter-spacing px (dipakai lewat ctx.letterSpacing, kerning font tetap jalan seperti CSS) */
  ls?: number
  align?: 'left' | 'center' | 'right'
  /** perkecil font sampai muat (kata tidak dipotong) */
  maxWidth?: number
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
  ctx.fillStyle = o.color
  // kanvas opaque membuat Chrome memakai antialias LCD (pinggir berwarna); filter identitas memaksa antialias abu-abu seperti desain
  ctx.filter = 'opacity(1)'
  // Chrome menaruh baseline teks di piksel penuh
  ctx.fillText(s, sx, Math.round(y + (ch0 - ch) / 2 + ascent))
  ctx.restore()
  return w
}

/** sisi atas kotak konten teks di baris dengan line-height angka (lh × size) yang mulai di boxTop */
export function lineTop(ctx: Ctx, family: string, size: number, lh: number, boxTop: number, weight = 400) {
  // Blink membulatkan half-leading ke bawah
  return boxTop + Math.floor((size * lh - contentHeight(ctx, family, size, weight)) / 2)
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

/** baris-baris teks dengan line-height angka; boxTop = sisi atas baris pertama */
export function lines(ctx: Ctx, ls: string[], x: number, boxTop: number, lh: number, o: TOpts) {
  const step = o.size * lh
  ls.forEach((s, i) => {
    const top = lineTop(ctx, o.family, o.size, lh, boxTop + i * step, o.weight)
    txt(ctx, s, x, top, { ...o, maxWidth: undefined })
  })
}

// ---------- tanggal ----------

const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
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

/** "OKTOBER 2026" dari teks tanggal user; tidak terbaca → teks user apa adanya (kapital); kosong → '' */
export function bulanTahun(tanggal: string | undefined) {
  const t = tanggal?.trim() ?? ''
  const p = parseTanggal(t)
  if (p) return `${BULAN[p.m - 1]} ${p.y}`.toUpperCase()
  return t.toUpperCase()
}

/** tahun 4 digit dari teks tanggal user ('' kalau tidak ada) */
export function tahun(tanggal: string | undefined) {
  const p = parseTanggal(tanggal)
  if (p) return String(p.y)
  return tanggal?.match(/\b(19|20)\d{2}\b/)?.[0] ?? ''
}

/** gabung bagian yang terisi dengan pemisah (bagian kosong dilewati, tanpa tanda baca menggantung) */
export function join(parts: (string | undefined)[], sep = ' · ') {
  return parts.map((p) => p?.trim()).filter(Boolean).join(sep)
}

/** garis pengganti paragraf: kolom kotak setinggi h, lebar persen dari w, jarak gap */
export function bars(ctx: Ctx, x: number, y: number, w: number, pcts: number[], h: number, gap: number, color: string) {
  pcts.forEach((p, i) => {
    ctx.fillStyle = color
    const x0 = Math.round(x)
    const y0 = Math.round(y + i * (h + gap))
    ctx.fillRect(x0, y0, Math.round(x + (w * p) / 100) - x0, Math.round(y + i * (h + gap) + h) - y0)
  })
}

/** baris flex `justify-content: space-between` (teks satu baris, jarak antar item sama) */
export function spaceBetween(ctx: Ctx, items: string[], x: number, w: number, y: number, o: TOpts) {
  // item kosong tetap ikut (lebar 0) seperti span kosong di flex, supaya item lain tidak bergeser
  const list = items.map((s) => s ?? '')
  if (list.length === 1) return void txt(ctx, list[0], x, y, o)
  // item yang lebih lebar dari o.maxWidth dikecilkan dulu
  const ws = list.map((s) => (s ? width(ctx, s, o, fitSize(ctx, s, o)) : 0))
  const free = Math.max(0, w - ws.reduce((a, b) => a + b, 0)) / (list.length - 1)
  let cx = x
  list.forEach((s, i) => {
    txt(ctx, s, cx, y, o)
    cx += ws[i] + free
  })
}
