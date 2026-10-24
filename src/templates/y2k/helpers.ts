// Helper bersama kategori Y2K (lapisan detail & bayangan kotak foto dari set desain baru)
import { border, insetShadows, linear, rrPath, setShadow, type Ctx, type Radii } from '../paint'

/** kotak FOTO: box-shadow inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 8px rgba(0,0,0,0.16) (draw.over) */
export function photoInset(ctx: Ctx, x: number, y: number, w: number, h: number, r: Radii = 0) {
  insetShadows(ctx, x, y, w, h, [{ dx: 0, dy: 3, blur: 8, color: 'rgba(0,0,0,0.16)' }], r)
  border(ctx, x, y, w, h, 1, 'rgba(0,0,0,0.12)', r)
}

let dotTile: HTMLCanvasElement | null = null
/** div data-detail: radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1.5px) 0 0 / 4px 4px, di atas semuanya */
export function detailDots(ctx: Ctx, W: number, H: number) {
  if (!dotTile) {
    dotTile = document.createElement('canvas')
    dotTile.width = dotTile.height = 4
    const t = dotTile.getContext('2d')!
    // ellipse farthest-corner di ubin 4x4 = lingkaran r 2√2, titik henti 1px & 1.5px
    const R = 2 * Math.SQRT2
    const g = t.createRadialGradient(2, 2, 0, 2, 2, R)
    g.addColorStop(0, 'rgba(255,255,255,0.07)')
    g.addColorStop(1 / R, 'rgba(255,255,255,0.07)')
    g.addColorStop(1.5 / R, 'rgba(255,255,255,0)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    t.fillStyle = g
    t.fillRect(0, 0, 4, 4)
  }
  ctx.save()
  ctx.fillStyle = ctx.createPattern(dotTile, 'repeat')!
  ctx.fillRect(0, 0, W, H)
  ctx.restore()
}

/** div data-detail: linear-gradient(125deg, transparent 28%, rgba(255,255,255,0.18) 40%, transparent 52%) */
export function detailSheen(ctx: Ctx, W: number, H: number) {
  ctx.save()
  ctx.fillStyle = linear(ctx, 0, 0, W, H, 125, [
    [0.28, 'rgba(255,255,255,0)'],
    [0.4, 'rgba(255,255,255,0.18)'],
    [0.52, 'rgba(255,255,255,0)'],
  ])
  ctx.fillRect(0, 0, W, H)
  ctx.restore()
}

/**
 * Teks dengan letter-spacing yang tetap ber-kerning (ctx.letterSpacing + satu fillText), y = sisi atas kotak konten.
 * Kepanjangan → dikecilkan sampai muat maxWidth. Mengembalikan lebar akhir (termasuk spasi huruf terakhir, seperti CSS).
 */
export function spacedText(
  ctx: Ctx,
  s: string,
  x: number,
  y: number,
  o: { family: string; size: number; weight?: number; color: string; letterSpacing: number; maxWidth?: number; align?: 'left' | 'center' | 'right' },
) {
  if (!s) return 0
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
  return w
}

/** conic-gradient CSS (from = derajat CSS, 0 = atas, searah jarum jam) di titik cx, cy */
export function conic(ctx: Ctx, from: number, cx: number, cy: number, stops: [number, string][]) {
  const g = ctx.createConicGradient(((from - 90) * Math.PI) / 180, cx, cy)
  for (const [o, c] of stops) g.addColorStop(o, c)
  return g
}

/** box-shadow 0 0 0 <spread> (cincin luar tanpa blur) di sekeliling kotak bulat */
export function spreadRing(ctx: Ctx, x: number, y: number, w: number, h: number, spread: number, color: string, r: number) {
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(x - spread, y - spread, w + 2 * spread, h + 2 * spread, r + spread)
  ctx.roundRect(x, y, w, h, r)
  ctx.fillStyle = color
  ctx.fill('evenodd')
  ctx.restore()
}

/** CSS `opacity` pada satu kelompok elemen: gambar ke kanvas terpisah lalu tempel dengan alpha */
export function group(ctx: Ctx, alpha: number, draw: (c: Ctx) => void) {
  const o = document.createElement('canvas')
  o.width = ctx.canvas.width
  o.height = ctx.canvas.height
  const c = o.getContext('2d')!
  c.setTransform(ctx.getTransform())
  c.imageSmoothingQuality = 'high'
  c.textRendering = 'optimizeLegibility'
  draw(c)
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalAlpha *= alpha
  ctx.drawImage(o, 0, 0)
  ctx.restore()
  o.width = o.height = 0
}

/** box-shadow inset (dengan blur) untuk bentuk bebas: path = fungsi yang menambah subpath bentuk */
export function insetPathShadows(ctx: Ctx, path: (c: Ctx) => void, shadows: { dx: number; dy: number; blur: number; color: string }[]) {
  ctx.save()
  ctx.beginPath()
  path(ctx)
  ctx.clip()
  for (const s of [...shadows].reverse()) {
    ctx.save()
    // bingkai hitam digambar jauh di luar kanvas: hanya bayangannya yang jatuh ke dalam bentuk (tanpa tepi hitam AA)
    const off = 20000
    setShadow(ctx, s.dx + off, s.dy, s.blur, s.color)
    ctx.translate(-off, 0)
    ctx.beginPath()
    ctx.rect(-5000, -5000, 12000, 12000)
    path(ctx)
    ctx.fillStyle = '#000'
    ctx.fill('evenodd')
    ctx.restore()
  }
  ctx.restore()
}

/** box-shadow luar (blur) untuk bentuk bebas, tidak tampak di bawah bentuknya */
export function dropPathShadow(ctx: Ctx, path: (c: Ctx) => void, dx: number, dy: number, blur: number, color: string) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(-5000, -5000, 12000, 12000)
  path(ctx)
  ctx.clip('evenodd')
  const off = 20000
  setShadow(ctx, dx + off, dy, blur, color)
  ctx.translate(-off, 0)
  ctx.beginPath()
  path(ctx)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.restore()
}

/**
 * Kotak bergradien dengan border (transparan): gradien CSS berukuran padding box dan diulang (background-repeat)
 * ke area border, jadi di bawah border bawah tampak warna awal gradien, dst. bw = lebar border.
 */
export function tiledGradientBox(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  bw: number,
  r: Radii,
  grad: (px: number, py: number, pw: number, ph: number) => CanvasGradient,
) {
  const px = x + bw
  const py = y + bw
  const pw = w - 2 * bw
  const ph = h - 2 * bw
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, x, y, w, h, r)
  ctx.clip()
  ctx.fillStyle = grad(px, py, pw, ph)
  // ubin tetangga sedikit dilebarkan (tertutup ubin tengah) supaya sambungan tidak tampak
  for (let i = -1; i <= 1; i++)
    for (let j = -1; j <= 1; j++) {
      if (!i && !j) continue
      ctx.save()
      ctx.translate(i * pw, j * ph)
      ctx.fillRect(px - 1, py - 1, pw + 2, ph + 2)
      ctx.restore()
    }
  ctx.fillRect(px, py, pw, ph)
  ctx.restore()
}

/**
 * border dashed Chrome (lebar < 3px: dash 3×lebar, jeda 2×lebar), jeda diregangkan supaya
 * tiap sisi diakhiri dash penuh. Sisi atas/bawah selebar kotak, kiri/kanan setinggi kotak.
 */
export function dashedRect(ctx: Ctx, x: number, y: number, w: number, h: number, width: number, color: string) {
  const dash = width < 3 ? 3 * width : 2 * width
  const gap0 = width < 3 ? 2 * width : width
  const side = (len: number, put: (o: number) => void) => {
    const n = Math.max(1, Math.round((len + gap0) / (dash + gap0)))
    const gap = n > 1 ? (len - n * dash) / (n - 1) : 0
    for (let i = 0; i < n; i++) put(i * (dash + gap))
  }
  ctx.save()
  ctx.fillStyle = color
  side(w, (o) => {
    ctx.fillRect(x + o, y, dash, width)
    ctx.fillRect(x + o, y + h - width, dash, width)
  })
  side(h, (o) => {
    ctx.fillRect(x, y + o, width, dash)
    ctx.fillRect(x + w - width, y + o, width, dash)
  })
  ctx.restore()
}
