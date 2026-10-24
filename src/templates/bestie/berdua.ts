// Berdua — design-reference/bestie-couple/berdua.html (600x1800, 4 foto)
import { border, box, measure, text } from '../paint'
import { bestie } from './define'
import { FONTS, INK, initial, MONO, SERIF, slotInsets, yearOf } from './helpers'

const ACCENT = '#C0392B'
const FRAMES = [166, 516, 866, 1216]
const SLOTS = FRAMES.map((y) => ({ x: 56, y: y + 12, w: 488, h: 300 }))

export const berdua = bestie({
  id: 'bestie-berdua',
  name: 'berdua',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#F6F1E9' },
  placeholder: '#ECE8E1',
  fonts: FONTS,
  fields: ['nama', 'nama2', 'tanggal'],
  texture: { opacity: 0.09, blend: 'multiply' },
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      // inisial berdua: [A] + [B] (flex center, gap 18px)
      const a = initial(texts.nama)
      const b = initial(texts.nama2)
      const big = { family: SERIF, size: 80, color: INK }
      const plus = { family: SERIF, size: 40, color: ACCENT }
      const parts: { s: string; o: typeof big; y: number }[] = []
      if (a) parts.push({ s: a, o: big, y: 45 })
      if (a && b) parts.push({ s: '+', o: plus, y: 73 })
      if (b) parts.push({ s: b, o: big, y: 45 })
      const widths = parts.map((p) => measure(ctx, p.s, p.o))
      let x = 300 - (widths.reduce((s, w) => s + w, 0) + 18 * (parts.length - 1)) / 2
      parts.forEach((p, i) => {
        text(ctx, p.s, x, p.y, p.o)
        x += widths[i] + 18
      })

      for (const y of FRAMES) border(ctx, 44, y, 512, 324, 2, INK)

      const tahun = yearOf(texts.tanggal)
      if (tahun) text(ctx, `sejak ${tahun}`, 44, 1732, { family: MONO, size: 16, color: INK })
      text(ctx, texts.tanggal?.trim() ?? '', 556, 1732, { family: MONO, size: 16, color: INK, align: 'right', maxWidth: tahun ? 300 : 512 })
    },
    over(ctx) {
      slotInsets(ctx, SLOTS)
    },
    top(ctx) {
      // garis tipis di bawah foto 1–3 (di atas lapisan noise)
      ctx.save()
      ctx.globalAlpha = 0.4
      for (const y of [486, 836, 1186]) box(ctx, 120, y, 360, 1, INK)
      ctx.restore()
    },
  },
})
