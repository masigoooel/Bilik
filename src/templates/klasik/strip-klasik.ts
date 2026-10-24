// Strip Klasik — design-reference/klasik-minimalis/strip-klasik.html (600x1800, 4 foto)
import { box, text } from '../paint'
import { FONTS, MONO, SERIF, TEXTURE_09, engraved, hline, photoInset, photoLift } from './helpers'
import { klasik } from './define'

const ACCENT = '#E8553D'
const SUB = '#55524c'

const SLOTS = [40, 405, 770, 1135].map((y) => ({ x: 40, y, w: 520, h: 335 }))

export const stripKlasik = klasik({
  id: 'klasik-strip-klasik',
  name: 'strip klasik',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#ffffff' },
  placeholder: '#e9e7e3',
  fonts: FONTS,
  fields: ['tanggal'],
  texture: TEXTURE_09,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      for (const s of SLOTS) photoLift(ctx, s)
      const tanggal = texts.tanggal?.trim()
      // blok rata bawah (flex-end): tanpa tanggal, garis aksen & judul turun setinggi baris tanggal + gap
      const dy = tanggal ? 0 : 35
      box(ctx, 268, 1561 + dy, 64, 6, ACCENT)
      engraved(ctx, 'momen kita', 300, 1583 + dy, { family: SERIF, size: 64, color: '#1a1a1a', align: 'center' })
      if (tanggal) text(ctx, tanggal, 300, 1665, { family: MONO, size: 20, color: SUB, align: 'center', letterSpacing: 6, maxWidth: 520 })
      hline(ctx, 40, 1718, 520, 1, '#d9d6d0')
      const o = { family: MONO, size: 15, color: SUB }
      text(ctx, 'No. 0017', 40, 1733, o)
      text(ctx, '4 frame', 282, 1733, o)
      text(ctx, '16:20', 560, 1733, { ...o, align: 'right' })
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s)
    },
  },
})
