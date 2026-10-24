// Enam Frame — design-reference/klasik-minimalis/enam-frame.html (1200x1800, 6 foto)
import { text } from '../paint'
import { FONTS, GREY, INK, MONO, SERIF, TEXTURE_09, cornerMarks, engraved, photoInset, photoLift } from './helpers'
import { klasik } from './define'

const COLS = [100, 615]
const ROWS = [148, 578, 1008]

const SLOTS = ROWS.flatMap((y) => COLS.map((x) => ({ x, y, w: 485, h: 400 })))

export const enamFrame = klasik({
  id: 'klasik-enam-frame',
  name: 'enam frame',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#F3F1EC' },
  placeholder: '#DDDBD6',
  fonts: FONTS,
  fields: ['nama', 'tanggal'],
  texture: TEXTURE_09,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      cornerMarks(ctx, 34, 34, 1132, 1732)
      const head = { family: MONO, size: 14, color: INK, letterSpacing: 2.8 }
      text(ctx, 'PHOTOBOX · SET 06', 100, 90, head)
      text(ctx, texts.nama?.trim() ?? '', 1100, 90, { ...head, align: 'right', maxWidth: 680 })
      for (const s of SLOTS) photoLift(ctx, s)
      engraved(ctx, 'enam frame', 100, 1623, { family: SERIF, size: 84, italic: true, color: INK })
      text(ctx, texts.tanggal?.trim() ?? '', 1100, 1676, { family: MONO, size: 16, color: INK, align: 'right', maxWidth: 480 })
      text(ctx, '16:20 — 16:24', 1100, 1700, { family: MONO, size: 16, color: GREY, align: 'right' })
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s)
    },
  },
})
