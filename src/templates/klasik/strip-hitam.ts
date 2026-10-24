// Strip Hitam — design-reference/klasik-minimalis/strip-hitam.html (600x1800, 3 foto)
import { border, text } from '../paint'
import { FONTS, MONO, SERIF, TEXTURE_09, engraved, hline, monthName, photoInset, photoLift } from './helpers'
import { klasik } from './define'

const LIGHT = '#f2f2f2'
const ROWS = [90, 558, 1026]

const SLOTS = ROWS.map((y) => ({ x: 64, y, w: 496, h: 440 }))

export const stripHitam = klasik({
  id: 'klasik-strip-hitam',
  name: 'strip hitam',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#111111' },
  placeholder: '#2B2B2B',
  fonts: FONTS,
  fields: ['tanggal'],
  texture: TEXTURE_09,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      const head = { family: MONO, size: 14, color: LIGHT, letterSpacing: 2.8 }
      text(ctx, 'STRIP', 64, 44, head)
      text(ctx, '03 FRAME', 560, 44, { ...head, align: 'right' })
      ROWS.forEach((y, i) => {
        const o = { family: MONO, size: 10, color: '#9a9a9a' }
        text(ctx, String(i + 1).padStart(2, '0'), 30, y, o)
        text(ctx, '▸', 30, y + 427, o)
      })
      for (const s of SLOTS) photoLift(ctx, s)
      hline(ctx, 64, 1494, 496, 2, '#C9A24A')
      // judul = nama bulan dari tanggal user ("Oktober" di desain)
      engraved(ctx, monthName(texts.tanggal) ?? 'momen kita', 64, 1670, { family: SERIF, size: 52, color: LIGHT, maxWidth: 496 })
      const foot = { family: MONO, size: 14, color: '#bdbdbd' }
      text(ctx, texts.tanggal?.trim() ?? '', 64, 1738, { ...foot, maxWidth: 360 })
      text(ctx, '16:20 — 16:22', 560, 1738, { ...foot, align: 'right' })
    },
    over(ctx) {
      // border 1px kotak foto menimpa tepi foto; bayangan inset di dalam border (padding box)
      for (const s of SLOTS) {
        border(ctx, s.x, s.y, s.w, s.h, 1, LIGHT)
        photoInset(ctx, { x: s.x + 1, y: s.y + 1, w: s.w - 2, h: s.h - 2 })
      }
    },
  },
})
