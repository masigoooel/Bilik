// Helper Canvas 2D untuk menggambar ulang desain HTML/CSS secara presisi.
// Koordinat & ukuran mengikuti angka CSS di file desain (design-reference/).

export type Ctx = CanvasRenderingContext2D
export type Radii = number | [tl: number, tr: number, br: number, bl: number]

/** font CSS → string canvas */
/** family boleh berupa daftar cadangan CSS apa adanya (mengandung koma/kutip), mis. `'"VT323", monospace'` */
export function font(family: string, size: number, weight: number | string = 400, italic = false) {
  const fam = /[,"']/.test(family) ? family : `"${family}", sans-serif`
  return `${italic ? 'italic ' : ''}${weight} ${size}px ${fam}`
}

/** path kotak dengan radius per sudut (CSS border-radius, dipotong kalau kebesaran seperti CSS) */
/** Chrome membulatkan tepi kotak ke piksel penuh saat menggambar desain; tiru supaya garis tetap tajam */
export function snap(x: number, y: number, w: number, h: number) {
  const sx = Math.round(x)
  const sy = Math.round(y)
  return { x: sx, y: sy, w: Math.round(x + w) - sx, h: Math.round(y + h) - sy }
}

export function rrPath(ctx: Ctx, x0: number, y0: number, w0: number, h0: number, r: Radii = 0) {
  const { x, y, w, h } = snap(x0, y0, w0, h0)
  rrPathRaw(ctx, x, y, w, h, r)
}

/** path kotak bulat tanpa pembulatan piksel */
export function rrPathRaw(ctx: Ctx, x: number, y: number, w: number, h: number, r: Radii = 0) {
  let [tl, tr, br, bl] = typeof r === 'number' ? [r, r, r, r] : r
  const f = Math.min(1, w / Math.max(tl + tr, br + bl, 1e-6), h / Math.max(tl + bl, tr + br, 1e-6))
  tl *= f
  tr *= f
  br *= f
  bl *= f
  ctx.moveTo(x + tl, y)
  ctx.lineTo(x + w - tr, y)
  ctx.arcTo(x + w, y, x + w, y + tr, tr)
  ctx.lineTo(x + w, y + h - br)
  ctx.arcTo(x + w, y + h, x + w - br, y + h, br)
  ctx.lineTo(x + bl, y + h)
  ctx.arcTo(x, y + h, x, y + h - bl, bl)
  ctx.lineTo(x, y + tl)
  ctx.arcTo(x, y, x + tl, y, tl)
  ctx.closePath()
}

export function box(ctx: Ctx, x: number, y: number, w: number, h: number, fill: string | CanvasGradient | CanvasPattern, r: Radii = 0) {
  ctx.beginPath()
  rrPath(ctx, x, y, w, h, r)
  ctx.fillStyle = fill
  ctx.fill()
}

/** CSS border (di dalam kotak, seperti box-sizing border-box) */
export function border(ctx: Ctx, x: number, y: number, w: number, h: number, width: number, color: string, r: Radii = 0, dash?: number[]) {
  const ri: Radii = typeof r === 'number' ? Math.max(0, r - width / 2) : (r.map((v) => Math.max(0, v - width / 2)) as Radii)
  const b = snap(x, y, w, h)
  ctx.save()
  ctx.beginPath()
  rrPathRaw(ctx, b.x + width / 2, b.y + width / 2, b.w - width, b.h - width, ri)
  ctx.lineWidth = width
  ctx.strokeStyle = color
  if (dash) ctx.setLineDash(dash)
  ctx.stroke()
  ctx.restore()
}

type Inset = { dx: number; dy: number; color: string; blur?: number; /** CSS spread (inset 0 0 0 1px = cincin 1px) */ spread?: number }

/**
 * shadowOffset/shadowBlur di canvas tidak ikut transform (skala thumbnail, rotasi).
 * Petakan offset & blur lewat matriks aktif supaya sama seperti CSS box-shadow.
 */
function setShadow(ctx: Ctx, dx: number, dy: number, blur: number, color: string) {
  const m = ctx.getTransform()
  ctx.shadowOffsetX = m.a * dx + m.c * dy
  ctx.shadowOffsetY = m.b * dx + m.d * dy
  ctx.shadowBlur = blur * Math.sqrt(Math.abs(m.a * m.d - m.b * m.c))
  ctx.shadowColor = color
}

/**
 * CSS `box-shadow: inset dx dy blur color, ...`. Bayangan pertama digambar paling atas, sama seperti CSS.
 * Tanpa blur: area kotak dikurangi kotak yang digeser (hasil garis tepi ala Windows 98).
 */
export function insetShadows(ctx: Ctx, x: number, y: number, w: number, h: number, shadows: Inset[], r: Radii = 0) {
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, x, y, w, h, r)
  ctx.clip()
  for (const s of [...shadows].reverse()) {
    // spread: "lubang" bayangan mengecil sebesar spread di tiap sisi (radius ikut berkurang)
    const sp = s.spread ?? 0
    const hr = shrinkRadii(r, sp)
    if (!s.blur) {
      ctx.beginPath()
      rrPath(ctx, x, y, w, h, r)
      rrPath(ctx, x + s.dx + sp, y + s.dy + sp, w - 2 * sp, h - 2 * sp, hr)
      ctx.fillStyle = s.color
      ctx.fill('evenodd')
    } else {
      // bayangan blur ke dalam: "bingkai" besar dengan lubang seukuran kotak, digambar jauh di luar kanvas
      // supaya hanya bayangannya yang jatuh di tempat (bingkainya sendiri tidak bocor di tepi clip yang anti-alias)
      const off = 20000
      ctx.save()
      setShadow(ctx, s.dx + off, s.dy, s.blur, s.color)
      ctx.beginPath()
      ctx.rect(x - off - 200, y - 200, w + 400, h + 400)
      rrPath(ctx, x - off + sp, y + sp, w - 2 * sp, h - 2 * sp, hr)
      ctx.fillStyle = '#000'
      ctx.fill('evenodd')
      ctx.restore()
    }
  }
  ctx.restore()
}

function shrinkRadii(r: Radii, by: number): Radii {
  if (!by) return r
  return Array.isArray(r) ? (r.map((v) => Math.max(0, v - by)) as Radii) : Math.max(0, r - by)
}

/** CSS box-shadow luar (blur boleh 0) di bawah kotak */
export { setShadow }

export function dropShadow(ctx: Ctx, x: number, y: number, w: number, h: number, dx: number, dy: number, blur: number, color: string, r: Radii = 0) {
  ctx.save()
  // CSS box-shadow tidak tampak di bawah kotaknya sendiri (penting untuk kotak semi-transparan)
  ctx.beginPath()
  ctx.rect(x - 4000, y - 4000, w + 8000, h + 8000)
  rrPath(ctx, x, y, w, h, r)
  ctx.clip('evenodd')
  if (blur === 0) {
    box(ctx, x + dx, y + dy, w, h, color, r)
  } else {
    // gambar bentuk jauh di luar kanvas, hanya bayangannya yang jatuh di posisi yang benar
    const off = 20000
    setShadow(ctx, dx + off, dy, blur, color)
    box(ctx, x - off, y, w, h, '#000', r)
  }
  ctx.restore()
}

/** Win98: inset 2px 2px 0 terang, inset -2px -2px 0 gelap */
export function bevel(ctx: Ctx, x: number, y: number, w: number, h: number, light: string, dark: string, size = 2) {
  insetShadows(ctx, x, y, w, h, [
    { dx: size, dy: size, color: light },
    { dx: -size, dy: -size, color: dark },
  ])
}

/** gradien linear dengan sudut CSS (0deg = ke atas, 180deg = ke bawah) untuk kotak x,y,w,h */
export function linear(ctx: Ctx, x: number, y: number, w: number, h: number, angle: number, stops: [number, string][]) {
  const a = (angle * Math.PI) / 180
  const half = (Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a))) / 2
  const cx = x + w / 2
  const cy = y + h / 2
  const dx = Math.sin(a) * half
  const dy = -Math.cos(a) * half
  const g = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy)
  for (const [o, c] of stops) g.addColorStop(o, c)
  return g
}

/** radial-gradient(circle at px py, ...) dengan radius farthest-corner bila r tidak diberi */
export function radial(ctx: Ctx, cx: number, cy: number, r: number, stops: [number, string][]) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  for (const [o, c] of stops) g.addColorStop(o, c)
  return g
}

const pathCache = new Map<string, Path2D>()
export function svgPath(d: string) {
  let p = pathCache.get(d)
  if (!p) {
    p = new Path2D(d)
    pathCache.set(d, p)
  }
  return p
}

type SvgOpts = {
  fill?: string | CanvasGradient
  stroke?: string
  lineWidth?: number
  lineCap?: CanvasLineCap
  lineJoin?: CanvasLineJoin
  dash?: number[]
  rotate?: number
}

/** gambar path SVG (viewBox vbW x vbH) ke kotak x,y,w,h; rotate (derajat) di titik tengah kotak */
export function svg(ctx: Ctx, d: string | string[], x: number, y: number, w: number, h: number, vbW: number, vbH: number, o: SvgOpts) {
  ctx.save()
  ctx.translate(x + w / 2, y + h / 2)
  if (o.rotate) ctx.rotate((o.rotate * Math.PI) / 180)
  ctx.scale(w / vbW, h / vbH)
  ctx.translate(-vbW / 2, -vbH / 2)
  for (const p of [d].flat()) {
    const path = svgPath(p)
    if (o.fill) {
      ctx.fillStyle = o.fill
      ctx.fill(path)
    }
    if (o.stroke) {
      ctx.strokeStyle = o.stroke
      ctx.lineWidth = o.lineWidth ?? 1
      ctx.lineCap = o.lineCap ?? 'butt'
      ctx.lineJoin = o.lineJoin ?? 'miter'
      ctx.setLineDash(o.dash ?? [])
      ctx.stroke(path)
    }
  }
  ctx.restore()
}

/**
 * Gradien logam ala SVG linearGradient x1=0 y1=0 x2=1 y2=1 (gradientUnits objectBoundingBox).
 * Nilai gradien t = ((x-x0)/w + (y-y0)/h) / 2, jadi vektor canvas d = c·(1/w, 1/h), c = 2 / (1/w² + 1/h²).
 * bbox dalam koordinat viewBox ikon.
 */
export function metalGradient(ctx: Ctx, bbox: [x0: number, y0: number, x1: number, y1: number] = [0, 0, 24, 24]) {
  const [x0, y0, x1, y1] = bbox
  const w = x1 - x0
  const h = y1 - y0
  const c = 2 / (1 / (w * w) + 1 / (h * h))
  const g = ctx.createLinearGradient(x0, y0, x0 + c / w, y0 + c / h)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.35, '#bcc2ca')
  g.addColorStop(0.5, '#5f6670')
  g.addColorStop(0.65, '#f4f6f8')
  g.addColorStop(1, '#9aa1aa')
  return g
}

/** kotak pembatas ikon di viewBox 24 (untuk gradien objectBoundingBox) */
export const ICON_BBOX: Record<'heart' | 'star', [number, number, number, number]> = {
  heart: [1.5, 5, 22.5, 21],
  star: [2, 2, 22, 21.2],
}

export type TextOpts = {
  family: string
  size: number
  weight?: number | string
  italic?: boolean
  color: string | CanvasGradient
  align?: CanvasTextAlign
  letterSpacing?: number
  /** perkecil font sampai muat (tidak memotong kata) */
  maxWidth?: number
  stroke?: { color: string; width: number }
}

function ascentOf(ctx: Ctx, size: number) {
  const m = ctx.measureText('Hg')
  return m.fontBoundingBoxAscent ?? size * 0.8
}

export function measure(ctx: Ctx, s: string, o: Pick<TextOpts, 'family' | 'size' | 'weight' | 'italic' | 'letterSpacing'>) {
  ctx.font = font(o.family, o.size, o.weight, o.italic)
  return ctx.measureText(s).width + (o.letterSpacing ?? 0) * Math.max(0, Array.from(s).length)
}

/**
 * Teks dengan `y` = sisi atas kotak konten CSS (line-height normal), jadi angka hasil ukur
 * desain bisa dipakai langsung. `x` mengikuti `align`.
 */
export function text(ctx: Ctx, s: string, x: number, y: number, o: TextOpts) {
  if (!s) return 0
  let size = o.size
  if (o.maxWidth) {
    const w = measure(ctx, s, { ...o, size })
    if (w > o.maxWidth) size = Math.max(o.size * 0.4, (size * o.maxWidth) / w)
  }
  ctx.save()
  ctx.font = font(o.family, size, o.weight, o.italic)
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  const ls = o.letterSpacing ?? 0
  const total = ctx.measureText(s).width + ls * Array.from(s).length
  const startX = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x
  // geser baseline supaya kotak konten tetap di y saat font dikecilkan
  const base = y + ascentOf(ctx, size) + (o.size !== size ? ((o.size - size) / 2) * 1.2 : 0)
  if (ls) {
    let cx = startX
    for (const ch of Array.from(s)) {
      if (o.stroke) {
        ctx.lineJoin = 'round'
        ctx.lineWidth = o.stroke.width
        ctx.strokeStyle = o.stroke.color
        ctx.strokeText(ch, cx, base)
      }
      ctx.fillStyle = o.color
      ctx.fillText(ch, cx, base)
      cx += ctx.measureText(ch).width + ls
    }
  } else {
    if (o.stroke) {
      ctx.lineJoin = 'round'
      ctx.lineWidth = o.stroke.width
      ctx.strokeStyle = o.stroke.color
      ctx.strokeText(s, startX, base)
    }
    ctx.fillStyle = o.color
    ctx.fillText(s, startX, base)
  }
  ctx.restore()
  return total
}

/** tinggi kotak konten CSS untuk line-height normal */
export function contentHeight(ctx: Ctx, family: string, size: number, weight: number | string = 400) {
  ctx.font = font(family, size, weight)
  const m = ctx.measureText('Hg')
  return (m.fontBoundingBoxAscent ?? size * 0.8) + (m.fontBoundingBoxDescent ?? size * 0.2)
}

/** teks dipusatkan vertikal di dalam kotak tinggi h (flex align-items: center) */
export function textMid(ctx: Ctx, s: string, x: number, boxY: number, boxH: number, o: TextOpts) {
  const ch = contentHeight(ctx, o.family, o.size, o.weight)
  return text(ctx, s, x, boxY + (boxH - ch) / 2, o)
}

/** tekstur noise ala feTurbulence (dipakai beberapa desain dengan opacity kecil, mix-blend multiply) */
let noiseTile: HTMLCanvasElement | null = null
export function noise(ctx: Ctx, w: number, h: number, opacity: number, blend: GlobalCompositeOperation = 'multiply') {
  if (!noiseTile) {
    noiseTile = document.createElement('canvas')
    noiseTile.width = noiseTile.height = 300
    const t = noiseTile.getContext('2d')!
    const img = t.createImageData(300, 300)
    let s = 1234567
    for (let i = 0; i < img.data.length; i += 4) {
      s = (s * 1103515245 + 12345) & 0x7fffffff
      const v = 70 + ((s >> 8) % 140)
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
    t.putImageData(img, 0, 0)
  }
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.globalCompositeOperation = blend
  const p = ctx.createPattern(noiseTile, 'repeat')!
  ctx.fillStyle = p
  ctx.fillRect(0, 0, w, h)
  ctx.restore()
}

export const ICONS = {
  /** viewBox 24 */
  heart: 'M12 21s-7.5-4.6-9.5-9.2C1.2 8.5 3.3 5 6.8 5c2.1 0 3.5 1.2 5.2 3 1.7-1.8 3.1-3 5.2-3 3.5 0 5.6 3.5 4.3 6.8C19.5 16.4 12 21 12 21z',
  star: 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z',
  sparkle: 'M12 1C13 8 16 11 23 12C16 13 13 16 12 23C11 16 8 13 1 12C8 11 11 8 12 1Z',
  /** viewBox 22x30 */
  cursor: 'M2 2 L2 24 L8 18 L12 28 L16 26 L12 16 L20 16 Z',
}
