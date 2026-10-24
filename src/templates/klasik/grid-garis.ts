// Grid Garis — design-reference/klasik-minimalis/grid-garis.html (1200x1800, 4 foto)
import { border, measure, text } from '../paint'
import { FONTS, GREY, INK, MONO, SERIF, TEXTURE_09, cornerMarks, engraved, hline, monthName, photoInset, photoLift, yearOf } from './helpers'
import { klasik } from './define'

const CELLS = [
  { x: 80, y: 231, time: '16:20' },
  { x: 620, y: 231, time: '16:20' },
  { x: 80, y: 896, time: '16:21' },
  { x: 620, y: 896, time: '16:21' },
]

const SLOTS = CELLS.map((c) => ({ x: c.x, y: c.y, w: 500, h: 600 }))

export const gridGaris = klasik({
  id: 'klasik-grid-garis',
  name: 'grid garis',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#E6E4DF',
  fonts: FONTS,
  fields: ['nama', 'tanggal'],
  texture: TEXTURE_09,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      cornerMarks(ctx, 32, 32, 1134, 1734)
      // judul = nama bulan dari tanggal user ("Oktober" di desain), tahun 4 digit di kanan
      engraved(ctx, monthName(texts.tanggal) ?? 'momen kita', 80, 60, { family: SERIF, size: 100, color: INK, maxWidth: 820 })
      const year = yearOf(texts.tanggal)
      if (year) text(ctx, year, 1120, 126, { family: MONO, size: 16, color: INK, align: 'right' })
      text(ctx, '4 frame', 1120, 150, { family: MONO, size: 16, color: GREY, align: 'right' })
      hline(ctx, 80, 190, 1040, 1, INK)

      for (const s of SLOTS) photoLift(ctx, s)
      CELLS.forEach((c, i) => {
        text(ctx, String(i + 1).padStart(2, '0'), c.x, c.y + 610, { family: MONO, size: 15, color: INK })
        text(ctx, c.time, c.x + 500, c.y + 610, { family: MONO, size: 15, color: GREY, align: 'right' })
      })

      hline(ctx, 80, 1565, 1040, 1, INK)
      const label = { family: MONO, size: 12, color: GREY, letterSpacing: 1.8 }
      const value = { family: MONO, size: 17, color: INK }
      const nama = texts.nama?.trim()
      const tanggal = texts.tanggal?.trim()
      if (nama) {
        text(ctx, 'NAMA', 80, 1681, label)
        text(ctx, nama, 80, 1698, { ...value, maxWidth: 560 })
      }
      if (tanggal) {
        // kolom kanan: rata kiri di dalam blok yang menempel ke kanan (lebar = teks terlebar)
        const vw = Math.min(400, measure(ctx, tanggal, value))
        const x = 1120 - Math.max(measure(ctx, 'TANGGAL', label), vw)
        text(ctx, 'TANGGAL', x, 1681, label)
        text(ctx, tanggal, x, 1698, { ...value, maxWidth: 400 })
      }
    },
    over(ctx) {
      // border 1px kotak foto menimpa tepi foto; bayangan inset di dalam border (padding box)
      for (const s of SLOTS) {
        border(ctx, s.x, s.y, s.w, s.h, 1, INK)
        photoInset(ctx, { x: s.x + 1, y: s.y + 1, w: s.w - 2, h: s.h - 2 })
      }
    },
  },
})
