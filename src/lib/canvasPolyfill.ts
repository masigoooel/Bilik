// Cadangan `ctx.letterSpacing` untuk browser yang belum mendukungnya (Safari/iOS lama).
// Beberapa template memakai letterSpacing; tanpa cadangan ini tulisannya jadi rapat & posisinya bergeser.
// Hanya aktif kalau properti aslinya tidak ada (atau dipaksa untuk uji).

type Ctx = CanvasRenderingContext2D
type Proto = Ctx & Record<string, unknown>

function parseSpacing(v: string, font: string): number {
  const m = /^\s*(-?[\d.]+)\s*(px|em)?\s*$/.exec(v)
  if (!m) return 0
  const n = parseFloat(m[1])
  if (m[2] === 'em') {
    const size = /(\d+(?:\.\d+)?)px/.exec(font)
    return n * (size ? parseFloat(size[1]) : 10)
  }
  return n
}

export function installLetterSpacingPolyfill(force = false): boolean {
  if (typeof CanvasRenderingContext2D === 'undefined') return false
  const proto = CanvasRenderingContext2D.prototype as Proto
  if (!force && 'letterSpacing' in proto) return false

  const raw = new WeakMap<Ctx, string>()
  const stack = new WeakMap<Ctx, string[]>()
  const px = (c: Ctx) => parseSpacing(raw.get(c) ?? '0px', c.font)

  Object.defineProperty(proto, 'letterSpacing', {
    configurable: true,
    get(this: Ctx) {
      return raw.get(this) ?? '0px'
    },
    set(this: Ctx, v: string) {
      raw.set(this, String(v))
    },
  })

  // letterSpacing termasuk state kanvas: ikut save()/restore()
  const save = proto.save
  const restore = proto.restore
  proto.save = function (this: Ctx) {
    const s = stack.get(this) ?? []
    s.push(raw.get(this) ?? '0px')
    stack.set(this, s)
    save.call(this)
  }
  proto.restore = function (this: Ctx) {
    const v = stack.get(this)?.pop()
    if (v !== undefined) raw.set(this, v)
    restore.call(this)
  }

  const measure = proto.measureText
  const spacedWidth = (c: Ctx, text: string) => measure.call(c, text).width + px(c) * [...text].length

  proto.measureText = function (this: Ctx, text: string) {
    const m = measure.call(this, text)
    const s = px(this)
    if (!s) return m
    // TextMetrics tidak bisa diubah: salin, lebar ditambah jarak huruf (seperti implementasi asli Chrome)
    const out: Record<string, number> = {}
    for (const k of ['actualBoundingBoxAscent', 'actualBoundingBoxDescent', 'actualBoundingBoxLeft', 'actualBoundingBoxRight', 'fontBoundingBoxAscent', 'fontBoundingBoxDescent', 'alphabeticBaseline', 'hangingBaseline', 'ideographicBaseline', 'emHeightAscent', 'emHeightDescent'] as const)
      out[k] = (m as unknown as Record<string, number>)[k]
    out.width = m.width + s * [...text].length
    out.actualBoundingBoxRight = m.actualBoundingBoxRight + s * ([...text].length - 1)
    return out as unknown as TextMetrics
  }

  const wrap = (orig: (this: Ctx, t: string, x: number, y: number, mw?: number) => void) =>
    function (this: Ctx, text: string, x: number, y: number, maxWidth?: number) {
      const s = px(this)
      if (!s || !text) return maxWidth === undefined ? orig.call(this, text, x, y) : orig.call(this, text, x, y, maxWidth)
      const chars = [...text]
      const total = spacedWidth(this, text)
      const align = this.textAlign
      const rtl = this.direction === 'rtl'
      const right = align === 'right' || (align === 'end' && !rtl) || (align === 'start' && rtl)
      const start = align === 'center' ? x - total / 2 : right ? x - total : x
      save.call(this)
      // maxWidth: sama seperti aslinya, tulisan dipadatkan horizontal (bukan dipotong)
      if (maxWidth !== undefined && total > maxWidth && maxWidth > 0) {
        // dipadatkan terhadap titik jangkar x (kiri/tengah/kanan mengikuti textAlign)
        this.translate(x, 0)
        this.scale(maxWidth / total, 1)
        this.translate(-x, 0)
      }
      this.textAlign = 'left'
      let prefix = ''
      for (let i = 0; i < chars.length; i++) {
        // posisi tiap huruf dari lebar awalan (kerning tetap terpakai) + jarak huruf
        const cx = start + measure.call(this, prefix).width + s * i
        orig.call(this, chars[i], cx, y)
        prefix += chars[i]
      }
      restore.call(this)
    }

  proto.fillText = wrap(proto.fillText)
  proto.strokeText = wrap(proto.strokeText)
  return true
}

installLetterSpacingPolyfill()
