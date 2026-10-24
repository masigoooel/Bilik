// Helper khusus kategori Meme & Lucu
import { border, font, insetShadows, type Ctx, type Radii } from '../paint'

export const ANTON = 'Anton'
export const MONO = 'Space Mono'
export const RYE = 'Rye'
export const CAVEAT = 'Caveat'
/** data-texture semua file desain meme-lucu: opacity 0.09, multiply */
export const TEXTURE = { opacity: 0.09, blend: 'multiply' as const }

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
export function disc(ctx: Ctx, x: number, y: number, d: number, fill: string | CanvasGradient) {
  ctx.beginPath()
  ctx.arc(x + d / 2, y + d / 2, d / 2, 0, Math.PI * 2)
  ctx.fillStyle = fill
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

/** garis putus-putus horizontal (border-top dashed), pola dash/gap Chrome; jeda diregangkan supaya kedua ujung dash penuh */
export function dashedH(ctx: Ctx, x: number, y: number, w: number, width: number, color: string, dash: [number, number]) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, width)
  ctx.clip()
  ctx.fillStyle = color
  const n = Math.max(1, Math.round((w + dash[1]) / (dash[0] + dash[1])))
  const gap = n > 1 ? (w - n * dash[0]) / (n - 1) : 0
  for (let i = 0; i < n; i++) ctx.fillRect(x + i * (dash[0] + gap), y, dash[0], width)
  ctx.restore()
}

/** gabung bagian teks dengan pemisah, bagian kosong dilewati */
export function join(parts: (string | undefined | null | false)[], sep = ' · ') {
  return parts.map((p) => (p || '').trim()).filter(Boolean).join(sep)
}

/** tahun dari teks tanggal user: 4 digit, atau dd.mm.yy → 20yy; null kalau tidak terbaca */
export function yearOf(tanggal: string | undefined): string | null {
  const s = tanggal?.trim() ?? ''
  const four = s.match(/\b(\d{4})\b/)
  if (four) return four[1]
  const short = s.match(/\b\d{1,2}\s*[./-]\s*\d{1,2}\s*[./-]\s*(\d{2})\b/)
  return short ? `20${short[1]}` : null
}

/**
 * Teks dengan letter-spacing yang tetap memakai kerning font (seperti CSS), lewat `ctx.letterSpacing`.
 * y = sisi atas kotak konten (sama seperti text()). Teks kepanjangan dikecilkan sampai muat maxWidth.
 * Hasil: lebar teks yang digambar.
 */
export function spacedText(ctx: Ctx, s: string, x: number, y: number, o: { family: string; size: number; weight?: number; color: string; letterSpacing: number; maxWidth?: number; align?: 'left' | 'center' | 'right' }) {
  if (!s) return 0
  ctx.save()
  const widthAt = (size: number) => {
    ctx.font = font(o.family, size, o.weight ?? 400)
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
  return w
}

/**
 * box-shadow kotak FOTO di set desain baru: `inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 8px rgba(0,0,0,0.16)`.
 * Tergambar di atas isi kotak, jadi dipanggil di draw.over.
 */
export function photoInset(ctx: Ctx, x: number, y: number, w: number, h: number, r: Radii = 0) {
  insetShadows(ctx, x, y, w, h, [{ dx: 0, dy: 3, blur: 8, color: 'rgba(0,0,0,0.16)' }], r)
  // spread 1px tanpa blur = cincin 1px di sisi dalam (paling atas)
  border(ctx, x, y, w, h, 1, 'rgba(0,0,0,0.12)', r)
}
