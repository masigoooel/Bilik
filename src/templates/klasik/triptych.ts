// Triptych — design-reference/klasik-minimalis/triptych.html (1200x1800, 3 foto)
import { text } from '../paint'
import { FONTS, GREY, INK, MONO, SERIF, engraved, photoInset, photoLift } from './helpers'
import { klasik } from './define'

const ROWS = [
  { y: 216, n: 'I' },
  { y: 676, n: 'II' },
  { y: 1136, n: 'III' },
]
const SLOTS = ROWS.map((r) => ({ x: 166, y: r.y, w: 924, h: 420 }))

export const triptych = klasik({
  id: 'klasik-triptych',
  name: 'triptych',
  width: 1200,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#FBFAF7' },
  placeholder: '#E4E2DD',
  fonts: FONTS,
  fields: ['tanggal', 'tempat'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      engraved(ctx, 'triptych', 166, 88, { family: SERIF, size: 76, italic: true, color: INK })
      text(ctx, texts.tanggal?.trim() ?? '', 1090, 156, { family: MONO, size: 16, color: INK, align: 'right', maxWidth: 600 })
      for (const r of ROWS) engraved(ctx, r.n, 140, r.y + 174, { family: SERIF, size: 56, color: INK, align: 'right' })
      for (const s of SLOTS) photoLift(ctx, s)
      const tempat = texts.tempat?.trim()
      text(ctx, tempat ? `tiga frame · ${tempat}` : 'tiga frame', 166, 1701, { family: MONO, size: 15, color: GREY, maxWidth: 924 })
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s)
    },
  },
})
