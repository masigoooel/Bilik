// Diptych — design-reference/klasik-minimalis/diptych.html (1080x1350, 2 foto)
import { text } from '../paint'
import { FONTS, INK, MONO, SERIF, TEXTURE_09, cornerMarks, engraved, hline, photoInset, photoLift } from './helpers'
import { klasik } from './define'

const COLS = [
  { x: 70, n: '01', time: '16:20' },
  { x: 555, n: '02', time: '16:21' },
]

const SLOTS = COLS.map((c) => ({ x: c.x, y: 238, w: 455, h: 820 }))

export const diptych = klasik({
  id: 'klasik-diptych',
  name: 'diptych',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: '#F3F1EC' },
  placeholder: '#E6E4DF',
  fonts: FONTS,
  fields: ['nama', 'tanggal'],
  texture: TEXTURE_09,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      cornerMarks(ctx, 30, 30, 1016, 1286)
      for (const s of SLOTS) photoLift(ctx, s)
      engraved(ctx, 'Diptych', 70, 78, { family: SERIF, size: 76, color: INK })
      text(ctx, 'dua frame, satu hari', 70, 170, { family: SERIF, size: 26, italic: true, color: '#55524c' })
      text(ctx, '01 — 02', 1010, 184, { family: MONO, size: 16, color: INK, align: 'right' })
      for (const c of COLS) {
        hline(ctx, c.x, 1068, 455, 1, INK)
        const o = { family: SERIF, size: 22, italic: true, color: INK }
        text(ctx, c.n, c.x, 1077, o)
        text(ctx, c.time, c.x + 455, 1077, { ...o, align: 'right' })
      }
      const foot = { family: MONO, size: 16, color: INK }
      const tanggal = texts.tanggal?.trim() ?? ''
      text(ctx, tanggal, 1010, 1260, { ...foot, align: 'right', maxWidth: 420 })
      text(ctx, texts.nama?.trim() ?? '', 70, 1260, { ...foot, maxWidth: tanggal ? 480 : 940 })
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s)
    },
  },
})
