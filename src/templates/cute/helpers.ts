// Helper kategori cute (tambahan untuk ../paint)
import { rrPath, setShadow, snap, type Ctx, type Radii } from '../paint'

/**
 * CSS `border: Npx dashed` pada kotak bulat, meniru pola Chrome:
 * pola garis berjalan terus dari awal sisi atas (setelah sudut kiri atas) searah jarum jam,
 * tapi tiap sudut memakan pola sedikit lebih panjang dari busurnya (`cornerTrim` negatif, px; dikalibrasi
 * per desain dari screenshot: r≈46 → -1, r≈30 → -0.5).
 */
export function dashedBorder(ctx: Ctx, x0: number, y0: number, w0: number, h0: number, width: number, color: string, radius: number, dash: [number, number], cornerTrim = -1) {
  const b = snap(x0, y0, w0, h0)
  const x = b.x + width / 2
  const y = b.y + width / 2
  const w = b.w - width
  const h = b.h - width
  const r = Math.min(Math.max(0, radius - width / 2), w / 2, h / 2)
  const period = dash[0] + dash[1]
  const arc = (Math.PI * r) / 2
  const k = arc > 0 ? Math.max(0.1, (arc - cornerTrim) / arc) : 1
  ctx.save()
  ctx.lineWidth = width
  ctx.strokeStyle = color
  ctx.lineCap = 'butt'
  let d = 0
  const line = (ax: number, ay: number, bx: number, by: number) => {
    const len = Math.hypot(bx - ax, by - ay)
    if (len <= 0) return
    ctx.setLineDash(dash)
    ctx.lineDashOffset = d % period
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(bx, by)
    ctx.stroke()
    d += len
  }
  const corner = (cx: number, cy: number, a0: number) => {
    if (r <= 0) return
    ctx.setLineDash([dash[0] * k, dash[1] * k])
    ctx.lineDashOffset = (d % period) * k
    ctx.beginPath()
    ctx.arc(cx, cy, r, a0, a0 + Math.PI / 2)
    ctx.stroke()
    d += arc * k
  }
  line(x + r, y, x + w - r, y)
  corner(x + w - r, y + r, -Math.PI / 2)
  line(x + w, y + r, x + w, y + h - r)
  corner(x + w - r, y + h - r, 0)
  line(x + w - r, y + h, x + r, y + h)
  corner(x + r, y + h - r, Math.PI / 2)
  line(x, y + h - r, x, y + r)
  corner(x + r, y + r, Math.PI)
  ctx.restore()
}

/**
 * Teks dengan letter-spacing yang tetap memakai kerning font (seperti CSS), lewat `ctx.letterSpacing`.
 * `text()` di paint.ts menggambar per huruf sehingga kerning hilang dan teks sedikit melebar.
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
 * CSS `radial-gradient(ellipse at px% py%, ...)` ukuran default farthest-corner pada kotak W x H.
 * Elips farthest-corner = elips farthest-side (rx, ry) dikali √2.
 */
function ellipseFill(ctx: Ctx, W: number, H: number, px: number, py: number, stops: [number, string][]) {
  const cx = W * px
  const cy = H * py
  const rx = Math.max(cx, W - cx) * Math.SQRT2
  const ry = Math.max(cy, H - cy) * Math.SQRT2
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, W, H)
  ctx.clip()
  ctx.translate(cx, cy)
  ctx.scale(1, ry / rx)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  for (const [o, c] of stops) g.addColorStop(o, c)
  ctx.fillStyle = g
  const k = rx / ry
  ctx.fillRect(-cx - 1, (-cy - 1) * k, W + 2, (H + 2) * k)
  ctx.restore()
}

/**
 * div `data-detail` (lapisan paling atas, juga menimpa foto):
 * radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.18), transparent 50%),
 * radial-gradient(ellipse at 50% 50%, transparent 65%, rgba(0,0,0,0.08) 100%)
 * Panggil paling akhir di draw.over.
 */
export function detailOverlay(ctx: Ctx, W: number, H: number) {
  // lapisan CSS terakhir digambar paling bawah
  ellipseFill(ctx, W, H, 0.5, 0.5, [
    [0, 'rgba(0,0,0,0)'],
    [0.65, 'rgba(0,0,0,0)'],
    [1, 'rgba(0,0,0,0.08)'],
  ])
  ellipseFill(ctx, W, H, 0.3, 0.2, [
    [0, 'rgba(255,255,255,0.18)'],
    [0.5, 'rgba(255,255,255,0)'],
    [1, 'rgba(255,255,255,0)'],
  ])
}

/** kotak FOTO: box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 8px rgba(0,0,0,0.16) (draw.over); `rotate` di titik tengah seperti slot */
export function photoInset(ctx: Ctx, s: { x: number; y: number; w: number; h: number; radius?: Radii; rotate?: number }, ring = 'rgba(0,0,0,0.12)', shade = 'rgba(0,0,0,0.16)') {
  ctx.save()
  let { x, y } = s
  if (s.rotate) {
    ctx.translate(s.x + s.w / 2, s.y + s.h / 2)
    ctx.rotate((s.rotate * Math.PI) / 180)
    x = -s.w / 2
    y = -s.h / 2
  }
  insetBlur(ctx, x, y, s.w, s.h, 0, 3, 8, shade, s.radius ?? 0)
  // spread 1px: kotak dikurangi kotak yang menyusut 1px (radius - 1), seperti Chrome
  const r = s.radius ?? 0
  const rIn = (Array.isArray(r) ? r : [r, r, r, r]).map((v) => Math.max(0, v - 1)) as [number, number, number, number]
  ctx.beginPath()
  rrPath(ctx, x, y, s.w, s.h, r)
  rrPath(ctx, x + 1, y + 1, s.w - 2, s.h - 2, rIn)
  ctx.fillStyle = ring
  ctx.fill('evenodd')
  ctx.restore()
}

/**
 * box-shadow inset dengan blur. Seperti insetShadows() di paint.ts, tapi bingkai penghasil bayangan digambar
 * jauh di luar kanvas (hanya bayangannya yang jatuh ke kotak), supaya tepi anti-alias bingkai hitam
 * tidak ikut tampak sebagai garis gelap 1px di tepi lengkung kotak.
 */
export function insetBlur(ctx: Ctx, x: number, y: number, w: number, h: number, dx: number, dy: number, blur: number, color: string, r: Radii = 0) {
  const off = 20000
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, x, y, w, h, r)
  ctx.clip()
  setShadow(ctx, dx + off, dy, blur, color)
  ctx.beginPath()
  ctx.rect(x - off - 200, y - 200, w + 400, h + 400)
  rrPath(ctx, x - off, y, w, h, r)
  ctx.fillStyle = '#000'
  ctx.fill('evenodd')
  ctx.restore()
}
