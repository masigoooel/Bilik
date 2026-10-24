// Helper kategori Travel (tambahan untuk ../paint)
import { border, contentHeight, font, insetShadows, rrPathRaw, setShadow, type Ctx, type Radii } from '../paint'
import type { FontSpec } from '../types'

export const INK = '#1E2A3A'
export const SERIF = 'Libre Caslon Text'
export const MONO = 'Space Mono'
/** Space Mono tidak punya glyph panah: Chrome memakai cadangan dari daftar font desain */
export const MONO_STACK = '"Space Mono", "Courier New", monospace'
export const HAND = 'Caveat'
/** sama dengan <link> file desain travel (Caveat hanya 600: teks Caveat selalu tampil tebal 600) */
export const FONTS: FontSpec[] = ['Libre Caslon Text:400,700', 'Space Mono:400,700', 'Caveat:600']
export const FONTS_NO_HAND: FontSpec[] = ['Libre Caslon Text:400,700', 'Space Mono:400,700']
/** data-texture semua file desain travel */
export const TEXTURE = { opacity: 0.1, blend: 'multiply' as const }

export type TOpts = {
  family: string
  size: number
  weight?: number
  italic?: boolean
  color: string
  /** letter-spacing px (lewat ctx.letterSpacing, kerning tetap jalan seperti CSS) */
  ls?: number
  align?: 'left' | 'center' | 'right'
  /** perkecil font sampai muat (kata tidak dipotong) */
  maxWidth?: number
}

function setFont(ctx: Ctx, o: TOpts, size: number) {
  ctx.font = font(o.family, size, o.weight ?? 400, o.italic)
  ctx.letterSpacing = `${((o.ls ?? 0) * size) / o.size}px`
  // canvas 'auto' mematikan ligatur; CSS (text-rendering auto) memakainya
  ctx.textRendering = 'optimizeLegibility'
}

/** lebar teks seperti CSS (letter-spacing dihitung sesudah tiap huruf, termasuk yang terakhir) */
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

/** bungkus gambar dengan rotate(deg) di titik (ox, oy) */
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
export function ring(ctx: Ctx, x: number, y: number, d: number, w: number, color: string) {
  const c = d / 2
  ctx.beginPath()
  ctx.arc(x + c, y + c, c, 0, Math.PI * 2)
  ctx.arc(x + c, y + c, c - w, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill('evenodd')
}

/** garis putus-putus horizontal (border dashed), jeda diregangkan supaya kedua ujung diakhiri garis penuh (Chrome) */
export function dashedH(ctx: Ctx, x: number, y: number, w: number, lw: number, color: string, dash: [number, number]) {
  ctx.save()
  ctx.fillStyle = color
  const n = Math.max(1, Math.round((w + dash[1]) / (dash[0] + dash[1])))
  const gap = n > 1 ? (w - n * dash[0]) / (n - 1) : 0
  for (let i = 0; i < n; i++) ctx.fillRect(x + i * (dash[0] + gap), y, dash[0], lw)
  ctx.restore()
}

/** garis putus-putus vertikal, sama seperti dashedH */
export function dashedV(ctx: Ctx, x: number, y: number, h: number, lw: number, color: string, dash: [number, number]) {
  ctx.save()
  ctx.fillStyle = color
  const n = Math.max(1, Math.round((h + dash[1]) / (dash[0] + dash[1])))
  const gap = n > 1 ? (h - n * dash[0]) / (n - 1) : 0
  for (let i = 0; i < n; i++) ctx.fillRect(x, y + i * (dash[0] + gap), lw, dash[0])
  ctx.restore()
}

// ---------- teks user ----------

/** gabung bagian yang terisi dengan pemisah (bagian kosong dilewati, tanpa tanda baca menggantung) */
export function join(parts: (string | undefined | null | false)[], sep = ' · ') {
  return parts.map((p) => (p || '').trim()).filter(Boolean).join(sep)
}

/** asal kalau user tidak menulis rute ("jakarta → bali") */
export const ASAL_DEFAULT = 'rumah'

/**
 * "jakarta → bali" / "jakarta - bali" / "jakarta ke bali" → { asal, tujuan };
 * daftar "bali, lombok, flores" → kota pertama → kota terakhir; satu kota: asal kosong
 */
export function rute(tempat: string | undefined): { asal: string; tujuan: string } {
  const t = tempat?.trim() ?? ''
  const m = t.match(/^([^,;·]+?)\s*(?:→|->|—|–|>|\s-\s|-|\ske\s)\s*([^,;·]+)$/i)
  if (m) return { asal: m[1].trim(), tujuan: m[2].trim() }
  const list = t.split(/\s*(?:,|;|·|→|->)\s*/).map((p) => p.trim()).filter(Boolean)
  if (list.length > 1) return { asal: list[0], tujuan: list[list.length - 1] }
  return { asal: '', tujuan: t }
}

/** daftar kota dari teks tempat ("bali, lombok, flores"); satu kota → dipakai untuk semua */
export function daftarTempat(tempat: string | undefined, n: number): string[] {
  const parts = (tempat ?? '')
    .split(/\s*(?:,|;|·|\/|→|->)\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (!parts.length) return Array(n).fill('')
  return Array.from({ length: n }, (_, i) => parts[i % parts.length])
}

/** kode bandara untuk kota yang sering dikunjungi; selain itu 3 huruf pertama (kapital) */
const IATA: Record<string, string> = {
  jakarta: 'CGK', bali: 'DPS', denpasar: 'DPS', yogyakarta: 'YIA', jogja: 'YIA', jogjakarta: 'YIA', yogya: 'YIA',
  surabaya: 'SUB', bandung: 'BDO', medan: 'KNO', makassar: 'UPG', lombok: 'LOP', mataram: 'LOP', 'labuan bajo': 'LBJ',
  semarang: 'SRG', solo: 'SOC', surakarta: 'SOC', malang: 'MLG', padang: 'PDG', palembang: 'PLM', pekanbaru: 'PKU',
  batam: 'BTH', balikpapan: 'BPN', manado: 'MDC', pontianak: 'PNK', banjarmasin: 'BDJ', kupang: 'KOE', ambon: 'AMQ',
  jayapura: 'DJJ', aceh: 'BTJ', 'banda aceh': 'BTJ', belitung: 'TJQ', singapura: 'SIN', singapore: 'SIN',
  'kuala lumpur': 'KUL', bangkok: 'BKK', tokyo: 'HND', seoul: 'ICN', osaka: 'KIX',
}
export function kodeKota(nama: string): string {
  const k = nama.trim().toLowerCase()
  if (!k) return ''
  if (IATA[k]) return IATA[k]
  const letters = k.normalize('NFD').replace(/[^a-z]/g, '').toUpperCase()
  return letters.slice(0, 3)
}

// ---------- tanggal ----------

const BLN = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES']
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

const pad = (n: number) => String(n).padStart(2, '0')

/** "17.10.2026" dari teks tanggal user; tidak terbaca → teks user apa adanya */
export function tglTitik(tanggal: string | undefined) {
  const p = parseTanggal(tanggal)
  return p ? `${pad(p.d)}.${pad(p.m)}.${p.y}` : (tanggal?.trim() ?? '')
}

/** "17 OKT" (cap pos); tidak terbaca → teks user apa adanya (kapital) */
export function tglBulan(tanggal: string | undefined) {
  const p = parseTanggal(tanggal)
  return p ? `${p.d} ${BLN[p.m - 1]}` : (tanggal?.trim().toUpperCase() ?? '')
}

/** "261017" (yymmdd, baris MRZ paspor); tidak terbaca → '' */
export function tglMrz(tanggal: string | undefined) {
  const p = parseTanggal(tanggal)
  return p ? `${pad(p.y % 100)}${pad(p.m)}${pad(p.d)}` : ''
}

/** tahun 4 digit dari teks tanggal user ('' kalau tidak ada) */
export function tahun(tanggal: string | undefined) {
  const p = parseTanggal(tanggal)
  if (p) return String(p.y)
  return tanggal?.match(/\b(19|20)\d{2}\b/)?.[0] ?? ''
}

/** teks tanggal user dengan tahun ditambah n (format user tetap); tanpa tahun → '' */
export function tambahTahun(tanggal: string | undefined, n: number) {
  const t = tanggal?.trim() ?? ''
  if (/\b(19|20)\d{2}\b/.test(t)) return t.replace(/\b((?:19|20)\d{2})\b/, (y) => String(Number(y) + n))
  const m = t.match(/^(.*\d{1,2}\s*[./-]\s*\d{1,2}\s*[./-]\s*)(\d{2})(\D*)$/)
  if (m) return `${m[1]}${pad((Number(m[2]) + n) % 100)}${m[3]}`
  return ''
}

// ---------- kotak foto ----------

/**
 * `box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 8px rgba(0,0,0,0.16)` di kotak FOTO
 * (tergambar di atas isi kotak, jadi dipanggil dari draw.over)
 */
export function photoInset(ctx: Ctx, s: { x: number; y: number; w: number; h: number }, r: Radii = 0) {
  insetShadows(ctx, s.x, s.y, s.w, s.h, [{ dx: 0, dy: 3, blur: 8, color: 'rgba(0,0,0,0.16)' }], r)
  border(ctx, s.x, s.y, s.w, s.h, 1, 'rgba(0,0,0,0.12)', r)
}

/** tinggi baris line-height normal seperti Blink (ascent & descent dibulatkan masing-masing) */
export function lineBox(ctx: Ctx, family: string, size: number, weight = 400, italic = false) {
  ctx.save()
  ctx.font = font(family, size, weight, italic)
  const m = ctx.measureText('Hg')
  ctx.restore()
  return Math.round(m.fontBoundingBoxAscent) + Math.round(m.fontBoundingBoxDescent)
}

/** titik (px, py) diputar deg derajat di sekitar (ox, oy) */
export function rotPt(ox: number, oy: number, px: number, py: number, deg: number) {
  const a = (deg * Math.PI) / 180
  const dx = px - ox
  const dy = py - oy
  return { x: ox + dx * Math.cos(a) - dy * Math.sin(a), y: oy + dx * Math.sin(a) + dy * Math.cos(a) }
}

/** slot w×h berpusat di (cx, cy) pada elemen yang diputar deg di titik (ox, oy) */
export function rotSlot(ox: number, oy: number, cx: number, cy: number, w: number, h: number, deg: number) {
  const c = rotPt(ox, oy, cx, cy, deg)
  return { x: c.x - w / 2, y: c.y - h / 2, w, h, rotate: deg }
}

/**
 * radial-gradient(ellipse at cx cy, ...) dengan ukuran farthest-corner di kotak x,y,w,h
 * (elips farthest-side diperbesar √2, sesuai spesifikasi CSS)
 */
export function ellipseRadial(ctx: Ctx, x: number, y: number, w: number, h: number, cx: number, cy: number, stops: [number, string][], r: Radii = 0) {
  const rx = Math.max(cx - x, x + w - cx) * Math.SQRT2
  const ry = Math.max(cy - y, y + h - cy) * Math.SQRT2
  ctx.save()
  ctx.beginPath()
  rrPathRaw(ctx, x, y, w, h, r)
  ctx.clip()
  ctx.translate(cx, cy)
  ctx.scale(1, ry / rx)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  for (const [o, c] of stops) g.addColorStop(o, c)
  ctx.fillStyle = g
  ctx.fillRect(x - cx - 10, (y - cy - 10) * (rx / ry), w + 20, (h + 20) * (rx / ry))
  ctx.restore()
}

/** box-shadow: inset 0 0 0 Npx warna (spread tanpa blur): cincin di dalam kotak, radius dalam = r - N */
export function insetSpread(ctx: Ctx, x: number, y: number, w: number, h: number, n: number, color: string, r = 0) {
  ctx.beginPath()
  rrPathRaw(ctx, x, y, w, h, r)
  rrPathRaw(ctx, x + n, y + n, w - 2 * n, h - 2 * n, Math.max(0, r - n))
  ctx.fillStyle = color
  ctx.fill('evenodd')
}

/** gradien emas 135deg yang dipakai ornamen logam desain travel */
export const GOLD: [number, string][] = [
  [0, '#5a3e14'], [0.2, '#c9a24a'], [0.3, '#f6e3a4'], [0.46, '#a8822e'], [0.62, '#e8c878'], [0.8, '#7a5820'], [1, '#d9b45a'],
]

/** path kotak dengan border-radius elips "rx / ry" (sama untuk keempat sudut) */
export function ovalPath(ctx: Ctx, x: number, y: number, w: number, h: number, rx: number, ry: number) {
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

type BBox = { x: number; y: number; w: number; h: number }

/** box-shadow inset dx dy blur warna untuk bentuk bebas (path digambar oleh shape(), b = kotak pembatasnya) */
export function insetShadowShape(ctx: Ctx, shape: () => void, b: BBox, dx: number, dy: number, blur: number, color: string) {
  const m = Math.abs(dx) + Math.abs(dy) + blur * 2 + 20
  ctx.save()
  ctx.beginPath()
  shape()
  ctx.clip()
  // bentuk digambar jauh di luar (tepi anti-alias tidak bocor ke dalam), hanya bayangannya yang jatuh di sini
  const off = 4000
  setShadow(ctx, dx + off, dy, blur, color)
  ctx.translate(-off, 0)
  ctx.beginPath()
  ctx.rect(b.x - m, b.y - m, b.w + 2 * m, b.h + 2 * m)
  shape()
  ctx.fillStyle = '#000'
  ctx.fill('evenodd')
  ctx.restore()
}

/** box-shadow luar untuk bentuk bebas; tidak tampak di bawah bentuknya sendiri. Gambar sebelum bentuknya. */
export function dropShadowShape(ctx: Ctx, shape: () => void, b: BBox, dx: number, dy: number, blur: number, color: string) {
  const m = Math.abs(dx) + Math.abs(dy) + blur * 2 + 20
  ctx.save()
  ctx.beginPath()
  ctx.rect(b.x - m, b.y - m, b.w + 2 * m, b.h + 2 * m)
  shape()
  ctx.clip('evenodd')
  const off = 4000
  setShadow(ctx, dx + off, dy, blur, color)
  ctx.translate(-off, 0)
  ctx.beginPath()
  shape()
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.restore()
}
