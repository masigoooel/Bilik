// Pas Foto Studio — design-reference/klasik-minimalis/pas-foto-studio.html (1200x1800, 4 foto)
import { border, box, radial, text } from '../paint'
import { FONTS, GREY, INK, MONO, SERIF, TEXTURE_09, hline, insetBlurRound, photoInset, premulStops } from './helpers'
import { klasik } from './define'

const CARDS = [
  [120, 251],
  [623, 251],
  [120, 845],
  [623, 845],
]
const SLOTS = CARDS.map(([x, y]) => ({ x: x + 14, y: y + 14, w: 429, h: 520 }))
const MARK = '#999999'
const STAMP = 'rgba(110,60,150,0.7)'
const STAMP_TEXT = 'rgba(110,60,150,0.75)'

export const pasFotoStudio = klasik({
  id: 'klasik-pas-foto-studio',
  name: 'pas foto studio',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#F3F1EC' },
  // latar biru pas foto (linear-gradient #5F8FD0 → #3E6FB5) di desain, nilai tengahnya untuk slot kosong
  placeholder: '#4F7FC3',
  fonts: FONTS,
  fields: ['nama', 'tanggal'],
  texture: TEXTURE_09,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      const nama = texts.nama?.trim() ?? ''
      const tanggal = texts.tanggal?.trim() ?? ''
      text(ctx, 'Studio Foto', 120, 94, { family: SERIF, size: 80, color: INK })
      const r = { family: MONO, size: 15, color: INK, align: 'right' as const }
      text(ctx, 'pas foto · 4 lembar', 1080, 144, r)
      text(ctx, 'ukuran 4×6 cm', 1080, 163, r)
      hline(ctx, 120, 200, 960, 1, INK)

      for (const [x, y] of CARDS) {
        // kartu putih + box-shadow 0 0 0 1px #e2dfd8
        box(ctx, x - 1, y - 1, 459, 550, '#e2dfd8')
        box(ctx, x, y, 457, 548, '#ffffff')
        // tanda potong di empat pojok (10px + border 1px)
        const l = x - 14
        const t = y - 14
        const rr = x + 457 + 14 - 11
        const b = y + 548 + 14 - 11
        box(ctx, l, t, 11, 1, MARK)
        box(ctx, l, t, 1, 11, MARK)
        box(ctx, rr, t, 11, 1, MARK)
        box(ctx, rr + 10, t, 1, 11, MARK)
        box(ctx, l, b + 10, 11, 1, MARK)
        box(ctx, l, b, 1, 11, MARK)
        box(ctx, rr, b + 10, 11, 1, MARK)
        box(ctx, rr + 10, b, 1, 11, MARK)
      }

      const foot = { family: MONO, size: 15, color: GREY }
      text(ctx, nama ? `${nama} · no. 0017` : 'no. 0017', 120, 1691, { ...foot, maxWidth: 640 })
      text(ctx, 'gunting di garis', 1080, 1691, { ...foot, align: 'right' })

      // cap timbul bulat
      ctx.beginPath()
      ctx.arc(195, 1525, 55, 0, Math.PI * 2)
      ctx.fillStyle = radial(ctx, 140 + 44, 1470 + 38.5, Math.hypot(66, 71.5), premulStops([
        [0, [255, 255, 255, 0.9]],
        [0.7, [0, 0, 0, 0.04]],
      ]))
      ctx.fill()
      insetBlurRound(
        ctx,
        140,
        1470,
        110,
        110,
        [
          { dx: 2, dy: 2, blur: 3, color: 'rgba(255,255,255,0.9)' },
          { dx: -2, dy: -2, blur: 3, color: 'rgba(0,0,0,0.12)' },
        ],
        55,
      )
      const emb = { family: SERIF, size: 18, color: 'rgba(0,0,0,0.25)', align: 'center' as const, maxWidth: 100 }
      if (nama) {
        text(ctx, 'studio', 195, 1502.2, emb)
        text(ctx, nama, 195, 1522, emb)
      } else text(ctx, 'studio', 195, 1512.1, emb)

      // stempel ungu miring -6deg
      ctx.save()
      ctx.translate(948, 1518)
      ctx.rotate((-6 * Math.PI) / 180)
      ctx.translate(-948, -1518)
      border(ctx, 820, 1480, 256, 76, 3, STAMP, 6)
      const st = { family: MONO, weight: 600, color: STAMP_TEXT, align: 'center' as const }
      if (tanggal) {
        text(ctx, 'DICETAK', 948, 1498, { ...st, size: 13 })
        text(ctx, tanggal, 948, 1515, { ...st, size: 18, maxWidth: 240 })
      } else text(ctx, 'DICETAK', 948, 1509.5, { ...st, size: 13 })
      ctx.restore()
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s, 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.16)')
    },
  },
})
