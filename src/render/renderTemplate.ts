import type { Background, Decor, PatternKind, Slot, Template, TemplateText, TextValues } from '../templates/types'
import { seeded } from '../templates/layouts'
import { ensureFonts, fontString } from './fonts'
import { designTexture } from './texture'
import { heartPath, roundRectPath, sparklePath, starPath } from './shapes'
import { rrPathRaw, type Radii } from '../templates/paint'
import { hueRotatePixels } from './filters'

type Ctx = CanvasRenderingContext2D

export type PhotoSource = { source: CanvasImageSource; width: number; height: number }

export type RenderOptions = {
  photos?: (PhotoSource | null | undefined)[]
  texts?: Partial<TextValues>
  /** 1 = ukuran asli template; thumbnail pakai < 1 */
  scale?: number
  canvas?: HTMLCanvasElement
  /** warna aksen: putar hue lapisan desain (bukan foto), derajat; 0 = warna asli */
  hue?: number
}

export async function renderTemplate(t: Template, opts: RenderOptions = {}): Promise<HTMLCanvasElement> {
  const [, tile] = await Promise.all([ensureFonts(t), t.texture ? designTexture() : null])
  const scale = opts.scale ?? 1
  const canvas = opts.canvas ?? document.createElement('canvas')
  canvas.width = Math.round(t.width * scale)
  canvas.height = Math.round(t.height * scale)
  // canvas ber-alpha: Chrome memakai antialiasing teks abu-abu (canvas opaque memakai subpiksel LCD yang berwarna).
  // PNG tetap RGB kecil karena canvasToPng menyalinnya ke canvas opaque saat ekspor.
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  ctx.imageSmoothingQuality = 'high'
  // ligatur & kerning seperti teks di halaman (default canvas mematikan ligatur)
  ctx.textRendering = 'optimizeLegibility'

  const env = { texts: opts.texts ?? {}, W: t.width, H: t.height }
  const hue = ((opts.hue ?? 0) % 360 + 360) % 360
  // lapisan di atas foto: kalau warna aksen dipakai, digambar di kanvas transparan terpisah lalu diputar hue-nya
  const layer = (draw: (c: Ctx) => void) => {
    if (!hue) return draw(ctx)
    const o = document.createElement('canvas')
    o.width = canvas.width
    o.height = canvas.height
    const octx = o.getContext('2d', { willReadFrequently: true })!
    octx.setTransform(scale, 0, 0, scale, 0, 0)
    octx.imageSmoothingQuality = 'high'
    octx.textRendering = 'optimizeLegibility'
    draw(octx)
    hueRotatePixels(octx, hue)
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.drawImage(o, 0, 0)
    ctx.restore()
    o.width = o.height = 0
  }

  drawBackground(ctx, t.width, t.height, t.background)
  const decor = t.decor ?? []
  for (const d of decor) if ((d.layer ?? 'under') === 'under') drawDecor(ctx, d)
  if (t.draw?.under) isolated(ctx, () => t.draw!.under!(ctx, env))
  if (hue) hueRotatePixels(ctx, hue)
  t.slots.forEach((s, i) => drawSlot(ctx, s, opts.photos?.[i] ?? null, t.placeholder ?? '#E2E0DA'))
  layer((c) => {
    for (const d of decor) if (d.layer === 'over') drawDecor(c, d)
    if (t.draw?.over) isolated(c, () => t.draw!.over!(c, env))
    for (const tx of t.texts ?? []) drawTemplateText(c, tx, opts.texts ?? {})
  })
  if (t.texture && tile) {
    ctx.save()
    ctx.globalAlpha = t.texture.opacity
    ctx.globalCompositeOperation = t.texture.blend
    ctx.fillStyle = ctx.createPattern(tile, 'repeat')!
    ctx.fillRect(0, 0, t.width, t.height)
    ctx.restore()
  }
  if (t.draw?.top) layer((c) => isolated(c, () => t.draw!.top!(c, env)))
  return canvas
}

/** jalankan fungsi gambar template tanpa membocorkan state canvas */
function isolated(ctx: Ctx, fn: () => void) {
  ctx.save()
  try {
    fn()
  } finally {
    ctx.restore()
  }
}

// ---------- background ----------

function drawBackground(ctx: Ctx, W: number, H: number, bg: Background) {
  if (bg.type === 'solid') {
    ctx.fillStyle = bg.color
  } else if (bg.type === 'linear') {
    // sudut ala CSS: 0deg = ke atas, 90deg = ke kanan
    const a = (bg.angle * Math.PI) / 180
    const half = (Math.abs(W * Math.sin(a)) + Math.abs(H * Math.cos(a))) / 2
    const dx = Math.sin(a) * half
    const dy = -Math.cos(a) * half
    const g = ctx.createLinearGradient(W / 2 - dx, H / 2 - dy, W / 2 + dx, H / 2 + dy)
    for (const [o, c] of bg.stops) g.addColorStop(o, c)
    ctx.fillStyle = g
  } else {
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.hypot(W, H) / 2)
    for (const [o, c] of bg.stops) g.addColorStop(o, c)
    ctx.fillStyle = g
  }
  ctx.fillRect(0, 0, W, H)
}

// ---------- slot foto ----------

const grow = (r: Radii, d: number): Radii => (typeof r === 'number' ? r + d : (r.map((v) => v + d) as Radii))

function slotPath(ctx: Ctx, x: number, y: number, w: number, h: number, r: Radii) {
  ctx.beginPath()
  rrPathRaw(ctx, x, y, w, h, r)
}

function drawSlot(ctx: Ctx, s: Slot, photo: PhotoSource | null, placeholder: string) {
  const r: Radii = s.radius ?? 0
  ctx.save()
  ctx.translate(s.x + s.w / 2, s.y + s.h / 2)
  if (s.rotate) ctx.rotate((s.rotate * Math.PI) / 180)
  const x = -s.w / 2
  const y = -s.h / 2
  const sw = s.stroke?.width ?? 0

  if (s.shadow) {
    ctx.fillStyle = s.shadow.color
    slotPath(ctx, x - sw / 2 + s.shadow.x, y - sw / 2 + s.shadow.y, s.w + sw, s.h + sw, grow(r, sw / 2))
    ctx.fill()
  }

  ctx.save()
  slotPath(ctx, x, y, s.w, s.h, r)
  ctx.clip()
  if (photo) drawCover(ctx, photo, x, y, s.w, s.h)
  else drawPlaceholder(ctx, x, y, s.w, s.h, placeholder)
  ctx.restore()

  // garis tepi digambar di luar foto supaya wajah tidak tertutup
  if (s.stroke && sw > 0) {
    ctx.strokeStyle = s.stroke.color
    ctx.lineWidth = sw
    slotPath(ctx, x - sw / 2, y - sw / 2, s.w + sw, s.h + sw, grow(r, sw / 2))
    ctx.stroke()
  }
  ctx.restore()
}

/** gambar foto memenuhi kotak (object-fit: cover), crop di tengah */
export function drawCover(ctx: Ctx, p: PhotoSource, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / p.width, h / p.height)
  const sw = w / scale
  const sh = h / scale
  ctx.drawImage(p.source, (p.width - sw) / 2, (p.height - sh) / 2, sw, sh, x, y, w, h)
}

function drawPlaceholder(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
  const m = Math.min(w, h)
  const cx = x + w / 2
  const cy = y + h / 2
  ctx.fillStyle = 'rgba(0,0,0,0.09)'
  ctx.beginPath()
  ctx.arc(cx, cy - m * 0.1, m * 0.17, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx, cy + m * 0.42, m * 0.34, m * 0.3, 0, 0, Math.PI * 2)
  ctx.fill()
}

// ---------- teks ----------

function measure(ctx: Ctx, text: string, spacing: number) {
  const n = Array.from(text).length
  return ctx.measureText(text).width + spacing * Math.max(0, n - 1)
}

/** gambar satu baris teks dengan letter-spacing manual (kompatibel semua browser) */
function drawLine(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  align: 'left' | 'center' | 'right',
  spacing: number,
  fill: string,
  stroke?: { color: string; width: number },
) {
  ctx.textBaseline = 'middle'
  if (stroke) {
    ctx.lineJoin = 'round'
    ctx.miterLimit = 2
    ctx.lineWidth = stroke.width
    ctx.strokeStyle = stroke.color
  }
  ctx.fillStyle = fill
  if (!spacing) {
    ctx.textAlign = align
    if (stroke) ctx.strokeText(text, x, y)
    ctx.fillText(text, x, y)
    return
  }
  const total = measure(ctx, text, spacing)
  let start = align === 'left' ? x : align === 'right' ? x - total : x - total / 2
  ctx.textAlign = 'left'
  const chars = Array.from(text)
  const xs: number[] = []
  for (const ch of chars) {
    xs.push(start)
    start += ctx.measureText(ch).width + spacing
  }
  if (stroke) chars.forEach((ch, i) => ctx.strokeText(ch, xs[i], y))
  chars.forEach((ch, i) => ctx.fillText(ch, xs[i], y))
}

/** bungkus per kata; kata tidak pernah dipotong */
function wrapWords(ctx: Ctx, text: string, maxWidth: number, spacing: number) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (line && measure(ctx, next, spacing) > maxWidth) {
      lines.push(line)
      line = w
    } else line = next
  }
  if (line) lines.push(line)
  return lines
}

export function resolveText(t: TemplateText, values: Partial<TextValues>): string | null {
  const parts = [t.field]
    .flat()
    .map((f) => values[f]?.trim())
    .filter((v): v is string => !!v)
  let s = parts.length ? `${t.prefix ?? ''}${parts.join(t.joiner ?? ' ')}${t.suffix ?? ''}` : (t.fallback ?? null)
  if (!s) return null
  if (t.transform === 'upper') s = s.toLocaleUpperCase('id')
  if (t.transform === 'lower') s = s.toLocaleLowerCase('id')
  return s
}

function drawTemplateText(ctx: Ctx, t: TemplateText, values: Partial<TextValues>) {
  const text = resolveText(t, values)
  if (!text) return
  const maxLines = t.maxLines ?? 1
  const ratio = (t.letterSpacing ?? 0) / t.size
  let size = t.size
  let lines = [text]

  // perkecil font sampai muat; tidak pernah memotong kata
  for (let i = 0; i < 30; i++) {
    ctx.font = fontString(t.font, size, t.weight, t.italic)
    const sp = ratio * size
    if (!t.maxWidth) break
    lines = maxLines > 1 ? wrapWords(ctx, text, t.maxWidth, sp) : [text]
    const fits = lines.length <= maxLines && lines.every((l) => measure(ctx, l, sp) <= t.maxWidth!)
    if (fits || size <= t.size * 0.35) break
    size *= 0.93
  }
  if (lines.length > maxLines) lines = [lines.slice(0, maxLines - 1).join(' '), lines.slice(maxLines - 1).join(' ')].filter(Boolean)

  const sp = ratio * size
  const lh = size * (t.lineHeight ?? 1.15)
  const n = lines.length
  const anchor = t.anchor ?? 'middle'
  const first = anchor === 'top' ? lh / 2 : anchor === 'bottom' ? -lh / 2 - (n - 1) * lh : -((n - 1) * lh) / 2

  ctx.save()
  ctx.translate(t.x, t.y)
  if (t.rotate) ctx.rotate((t.rotate * Math.PI) / 180)
  lines.forEach((l, i) => drawLine(ctx, l, 0, first + i * lh, t.align ?? 'center', sp, t.color, t.stroke))
  ctx.restore()
}

// ---------- dekorasi ----------

function withRotation(ctx: Ctx, cx: number, cy: number, deg: number | undefined, fn: () => void) {
  if (!deg) return fn()
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.translate(-cx, -cy)
  fn()
  ctx.restore()
}

function paint(ctx: Ctx, fill?: string, stroke?: string, lineWidth = 1, dash?: number[]) {
  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = lineWidth
    ctx.setLineDash(dash ?? [])
    ctx.stroke()
    ctx.setLineDash([])
  }
}

function drawDecor(ctx: Ctx, d: Decor) {
  ctx.save()
  ctx.globalAlpha = d.opacity ?? 1
  switch (d.type) {
    case 'rect':
      withRotation(ctx, d.x + d.w / 2, d.y + d.h / 2, d.rotate, () => {
        roundRectPath(ctx, d.x, d.y, d.w, d.h, d.radius)
        paint(ctx, d.fill, d.stroke, d.lineWidth, d.dash)
      })
      break
    case 'circle':
      withRotation(ctx, d.cx, d.cy, d.rotate, () => {
        ctx.beginPath()
        ctx.arc(d.cx, d.cy, d.r, 0, Math.PI * 2)
        paint(ctx, d.fill, d.stroke, d.lineWidth, d.dash)
      })
      break
    case 'sparkle':
      withRotation(ctx, d.cx, d.cy, d.rotate, () => {
        sparklePath(ctx, d.cx, d.cy, d.r)
        paint(ctx, d.fill)
      })
      break
    case 'star':
      withRotation(ctx, d.cx, d.cy, d.rotate, () => {
        starPath(ctx, d.cx, d.cy, d.r, d.points, d.inner)
        paint(ctx, d.fill)
      })
      break
    case 'heart':
      withRotation(ctx, d.cx, d.cy, d.rotate, () => {
        heartPath(ctx, d.cx, d.cy, d.size)
        paint(ctx, d.fill)
      })
      break
    case 'line':
      ctx.beginPath()
      ctx.moveTo(d.x1, d.y1)
      ctx.lineTo(d.x2, d.y2)
      ctx.lineCap = 'round'
      paint(ctx, undefined, d.stroke, d.lineWidth, d.dash)
      break
    case 'text':
      ctx.translate(d.x, d.y)
      if (d.rotate) ctx.rotate((d.rotate * Math.PI) / 180)
      ctx.font = fontString(d.font, d.size, d.weight, d.italic)
      drawLine(ctx, d.text, 0, 0, d.align ?? 'center', d.letterSpacing ?? 0, d.color, d.stroke)
      break
    case 'pattern':
      ctx.beginPath()
      ctx.rect(d.x, d.y, d.w, d.h)
      ctx.clip()
      drawPattern(ctx, d.kind, d.x, d.y, d.w, d.h, d.color, d.color2, d.size, d.gap, d.seed)
      break
    case 'sunburst': {
      ctx.fillStyle = d.color
      const step = (Math.PI * 2) / d.rays
      for (let i = 0; i < d.rays; i += 2) {
        ctx.beginPath()
        ctx.moveTo(d.cx, d.cy)
        ctx.arc(d.cx, d.cy, d.r, i * step, (i + 1) * step)
        ctx.closePath()
        ctx.fill()
      }
      break
    }
    case 'barcode': {
      const rand = seeded(`bar${d.seed}`)
      const unit = d.w / 90
      ctx.fillStyle = d.color
      let x = d.x
      while (x < d.x + d.w - unit) {
        const bw = unit * (1 + Math.floor(rand() * 3))
        if (x + bw > d.x + d.w) break
        ctx.fillRect(x, d.y, bw, d.h)
        x += bw + unit * (1 + Math.floor(rand() * 2))
      }
      break
    }
    case 'brackets': {
      const { x, y, w, h, len } = d
      ctx.strokeStyle = d.color
      ctx.lineWidth = d.lineWidth
      ctx.lineCap = 'square'
      ctx.beginPath()
      ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y)
      ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len)
      ctx.moveTo(x + w, y + h - len); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - len, y + h)
      ctx.moveTo(x + len, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - len)
      ctx.stroke()
      break
    }
  }
  ctx.restore()
}

const grainCache = new Map<string, HTMLCanvasElement>()

function grainTile(color: string, seed: number) {
  const key = `${color}${seed}`
  let tile = grainCache.get(key)
  if (tile) return tile
  tile = document.createElement('canvas')
  tile.width = tile.height = 160
  const tctx = tile.getContext('2d')!
  const img = tctx.createImageData(160, 160)
  const rand = seeded(`grain${seed}`)
  const [r, g, b] = hexToRgb(color)
  for (let i = 0; i < img.data.length; i += 4) {
    img.data[i] = r
    img.data[i + 1] = g
    img.data[i + 2] = b
    img.data[i + 3] = rand() < 0.5 ? Math.floor(rand() * 255) : 0
  }
  tctx.putImageData(img, 0, 0)
  grainCache.set(key, tile)
  return tile
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? [...h].map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function drawPattern(
  ctx: Ctx,
  kind: PatternKind,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  color2: string | undefined,
  size: number,
  gap = size * 3,
  seed = 1,
) {
  ctx.fillStyle = color
  switch (kind) {
    case 'dots':
      for (let row = 0, yy = y + gap / 2; yy < y + h + gap; yy += gap, row++)
        for (let xx = x + (row % 2 ? gap / 2 : 0); xx < x + w + gap; xx += gap) {
          ctx.beginPath()
          ctx.arc(xx, yy, size, 0, Math.PI * 2)
          ctx.fill()
        }
      break
    case 'halftone':
      for (let yy = y; yy < y + h + gap; yy += gap)
        for (let xx = x; xx < x + w + gap; xx += gap) {
          const t = 1 - ((xx - x) / w + (yy - y) / h) / 2
          const r = size * (0.15 + 0.85 * t)
          ctx.beginPath()
          ctx.arc(xx, yy, r, 0, Math.PI * 2)
          ctx.fill()
        }
      break
    case 'grid':
      ctx.strokeStyle = color
      ctx.lineWidth = Math.max(1, size * 0.04)
      ctx.beginPath()
      for (let xx = x; xx <= x + w; xx += size) {
        ctx.moveTo(xx, y)
        ctx.lineTo(xx, y + h)
      }
      for (let yy = y; yy <= y + h; yy += size) {
        ctx.moveTo(x, yy)
        ctx.lineTo(x + w, yy)
      }
      ctx.stroke()
      break
    case 'stripes':
      for (let yy = y; yy < y + h; yy += size + gap) ctx.fillRect(x, yy, w, size)
      break
    case 'checker':
      if (color2) {
        ctx.fillStyle = color2
        ctx.fillRect(x, y, w, h)
        ctx.fillStyle = color
      }
      for (let r = 0, yy = y; yy < y + h; yy += size, r++)
        for (let c = 0, xx = x; xx < x + w; xx += size, c++) if ((r + c) % 2 === 0) ctx.fillRect(xx, yy, size, size)
      break
    case 'scanlines':
      for (let yy = y; yy < y + h; yy += size) ctx.fillRect(x, yy, w, Math.max(1, size * 0.4))
      break
    case 'grain': {
      const pat = ctx.createPattern(grainTile(color, seed), 'repeat')
      if (pat) {
        ctx.fillStyle = pat
        ctx.fillRect(x, y, w, h)
      }
      break
    }
    case 'airmail': {
      // garis miring merah-putih-biru-putih ala amplop pos udara
      const colors = [color, '#FFFFFF', color2 ?? color, '#FFFFFF']
      ctx.translate(x + w / 2, y + h / 2)
      ctx.rotate(Math.PI / 4)
      const d = Math.hypot(w, h)
      for (let i = 0, xx = -d / 2; xx < d / 2; xx += size, i++) {
        ctx.fillStyle = colors[i % 4]
        ctx.fillRect(xx, -d / 2, size + 0.5, d)
      }
      break
    }
  }
}
