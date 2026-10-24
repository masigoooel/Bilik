// Garis Waktu — design-reference/klasik-minimalis/garis-waktu.html (600x1800, 3 foto)
import { box, text } from '../paint'
import { FONTS, GREY, INK, MONO, SERIF, TEXTURE_09, photoInset } from './helpers'
import { klasik } from './define'

const BG = '#FBFAF7'
const ROWS = [
  { y: 189, time: '16:20', label: 'datang' },
  { y: 649, time: '18:05', label: 'tengah' },
  { y: 1109, time: '21:40', label: 'pulang' },
]
const SLOTS = ROWS.map((r) => ({ x: 138, y: r.y, w: 418, h: 420 }))

export const garisWaktu = klasik({
  id: 'klasik-garis-waktu',
  name: 'garis waktu',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#E4E2DD',
  fonts: FONTS,
  fields: ['tanggal', 'tempat'],
  texture: TEXTURE_09,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'sehari', 120, 61, { family: SERIF, size: 58, color: INK })
      const info = [texts.tanggal?.trim(), texts.tempat?.trim()].filter(Boolean).join(' · ')
      text(ctx, info, 120, 132, { family: MONO, size: 13, color: GREY, maxWidth: 436 })
      for (const r of ROWS) {
        text(ctx, r.time, 100, r.y - 2, { family: SERIF, size: 34, color: INK, align: 'right' })
        text(ctx, r.label, 100, r.y + 44, { family: MONO, size: 11, color: GREY, align: 'right' })
        // garis waktu 2px + titik (lingkaran 14px, box-shadow 0 0 0 2px)
        box(ctx, 118, r.y, 2, 420, INK)
        ctx.beginPath()
        ctx.arc(119, r.y + 17, 9, 0, Math.PI * 2)
        ctx.fillStyle = INK
        ctx.fill()
        ctx.beginPath()
        ctx.arc(119, r.y + 17, 7, 0, Math.PI * 2)
        ctx.fillStyle = BG
        ctx.fill()
      }
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s, 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.16)')
    },
  },
})
