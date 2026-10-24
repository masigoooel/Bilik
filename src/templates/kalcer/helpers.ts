// Helper khusus kategori Kalcer
import { border, font, insetShadows, rrPath, text, type Ctx, type Radii, type TextOpts } from '../paint'

export const ANTON = 'Anton'
export const MONO = 'Space Mono'
export const MARKER = 'Permanent Marker'
/** data-texture semua file desain kalcer: opacity 0.14, multiply */
export const TEXTURE = { opacity: 0.14, blend: 'multiply' as const }

/** bungkus gambar dengan rotate(deg) di titik (ox, oy): transform CSS (default origin = titik tengah elemen) */
export function rotated(ctx: Ctx, ox: number, oy: number, deg: number, draw: () => void) {
  ctx.save()
  ctx.translate(ox, oy)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.translate(-ox, -oy)
  draw()
  ctx.restore()
}

/** lingkaran penuh (border-radius 50%) */
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

/** tahun dari teks tanggal user: 4 digit, atau 2 digit di akhir pola tgl.bln.yy (17.10.26 → 2026); null kalau tidak ada */
export function yearOf(tanggal: string | undefined): string | null {
  const s = tanggal?.trim() ?? ''
  const m = s.match(/\b(\d{4})\b/)
  if (m) return m[1]
  const short = s.match(/\b\d{1,2}\s*[./\-·]\s*\d{1,2}\s*[./\-·]\s*(\d{2})\b/)
  return short ? `20${short[1]}` : null
}

/** gabung bagian teks dengan pemisah, bagian kosong dilewati */
export function join(parts: (string | undefined | null | false)[], sep = ' · ') {
  return parts.map((p) => (p || '').trim()).filter(Boolean).join(sep)
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

/**
 * Italic sintetis seperti Chrome (font tanpa face italic di <link> desain): face tegak dimiringkan
 * skewX 1/4 di garis dasar. Tidak bergantung pada face italic yang mungkin dimuat template lain.
 */
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
 * box-shadow kotak FOTO set desain baru: inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 8px rgba(0,0,0,0.16).
 * x,y,w,h = padding box (di dalam border). Tergambar di atas isi kotak → panggil di draw.over.
 */
export function photoInset(ctx: Ctx, x: number, y: number, w: number, h: number, r: Radii = 0) {
  insetShadows(ctx, x, y, w, h, [{ dx: 0, dy: 3, blur: 8, color: 'rgba(0,0,0,0.16)' }], r)
  border(ctx, x, y, w, h, 1, 'rgba(0,0,0,0.12)', r)
}

const SONG_FALLBACK = ['pulang pagi', 'kamar sempit', 'lampu kota', 'sampai jumpa', 'jalan pelan', 'hujan sore']

/**
 * judul lagu dari `catatan`: dipisah baris baru, " / ", "|" atau koma; sisa baris diisi judul cadangan yang kalem.
 * Selalu mengembalikan `n` judul.
 */
export function songTitles(catatan: string | undefined, n: number): string[] {
  const list = (catatan ?? '').split(/\s*\n\s*|\s+\/\s+|\s*\|\s*|\s*,\s*/).map((s) => s.trim()).filter(Boolean)
  const fb = SONG_FALLBACK.filter((s) => !list.includes(s))
  return Array.from({ length: n }, (_, i) => list[i] ?? fb[i - list.length] ?? SONG_FALLBACK[i % SONG_FALLBACK.length])
}

/** barcode desain: repeating-linear-gradient(90deg, ink 0 3px, transparent 3px 5px, ink 5px 6px, transparent 6px 10px, ink 10px 14px, transparent 14px 16px) */
export function barcode(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  for (let px = 0; px < w; px += 16) {
    for (const [a, b] of [[0, 3], [5, 6], [10, 14]]) {
      const e = Math.min(px + b, w)
      if (e > px + a) ctx.fillRect(x + px + a, y, e - px - a, h)
    }
  }
}

/**
 * radial-gradient(ellipse at X% Y%, rgba(c, a), transparent stop) di kotak bx,by,bw,bh.
 * Ellipse farthest-corner: rasio sumbu = farthest-side, diskalakan √2 supaya melewati sudut terjauh.
 */
export function ellipseGlow(ctx: Ctx, bx: number, by: number, bw: number, bh: number, px: number, py: number, rgb: [number, number, number], a: number, stop = 0.45) {
  const cx = bw * px
  const cy = bh * py
  const rx = Math.max(cx, bw - cx) * Math.SQRT2
  const ry = Math.max(cy, bh - cy) * Math.SQRT2
  const c = rgb.join(',')
  ctx.save()
  ctx.beginPath()
  ctx.rect(bx, by, bw, bh)
  ctx.clip()
  ctx.translate(bx + cx, by + cy)
  ctx.scale(1, ry / rx)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  g.addColorStop(0, `rgba(${c},${a})`)
  g.addColorStop(stop, `rgba(${c},0)`)
  g.addColorStop(1, `rgba(${c},0)`)
  ctx.fillStyle = g
  ctx.fillRect(-rx, -rx, rx * 2, rx * 2)
  ctx.restore()
}

/** garis putus-putus vertikal (border-left dashed), sama dengan dashedH */
export function dashedV(ctx: Ctx, x: number, y: number, h: number, width: number, color: string, dash: [number, number]) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, width, h)
  ctx.clip()
  ctx.fillStyle = color
  const n = Math.max(1, Math.round((h + dash[1]) / (dash[0] + dash[1])))
  const gap = n > 1 ? (h - n * dash[0]) / (n - 1) : 0
  for (let i = 0; i < n; i++) ctx.fillRect(x, y + i * (dash[0] + gap), width, dash[0])
  ctx.restore()
}

/** cincin di dalam kotak bulat: box-shadow inset 0 0 0 Npx warna */
export function insetRing(ctx: Ctx, x: number, y: number, w: number, h: number, spread: number, color: string, r = 0) {
  ctx.beginPath()
  rrPath(ctx, x, y, w, h, r)
  rrPath(ctx, x + spread, y + spread, w - spread * 2, h - spread * 2, Math.max(0, r - spread))
  ctx.fillStyle = color
  ctx.fill('evenodd')
}
