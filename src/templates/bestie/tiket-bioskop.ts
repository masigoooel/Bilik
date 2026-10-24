// Tiket Bioskop — design-reference/bestie-couple/tiket-bioskop.html (1080x1350, 2 foto)
import { box, measure, text } from '../paint'
import { bestie } from './define'
import { dashedLine, FONTS, INK, MONO, SERIF, slotInsets } from './helpers'

const BG = '#7A1E24'
/** barcode: repeating-linear-gradient 90deg, pola 16px (gelap 0–3, 5–6, 10–14) */
const BARS: [number, number][] = [[0, 3], [5, 6], [10, 14]]

export const tiketBioskop = bestie({
  id: 'bestie-tiket-bioskop',
  name: 'tiket bioskop',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: BG },
  placeholder: '#E3DCCB',
  fonts: FONTS,
  fields: ['catatan', 'tanggal'],
  texture: { opacity: 0.09, blend: 'multiply' },
  slots: [
    { x: 100, y: 400, w: 428, h: 520 },
    { x: 552, y: 400, w: 428, h: 520 },
  ],
  draw: {
    under(ctx, { texts }) {
      box(ctx, 60, 218, 960, 914, '#F4EFE3', 16)

      text(ctx, 'TIKET BIOSKOP', 100, 254, { family: MONO, size: 16, color: INK, letterSpacing: 4.8 })
      text(ctx, 'Studio 2', 100, 270, { family: SERIF, size: 64, color: INK })
      const film = texts.catatan?.trim()
      if (film) text(ctx, `FILM: ${film}`, 100, 350, { family: MONO, size: 18, color: INK, maxWidth: 760 })
      text(ctx, '19:30 WIB', 980, 325, { family: MONO, size: 18, weight: 700, color: INK, align: 'right' })
      text(ctx, 'PINTU 3 · SU', 980, 355, { family: MONO, size: 14, color: INK, align: 'right' })

      text(ctx, 'KURSI F7', 100, 930, { family: MONO, size: 18, weight: 700, color: INK })
      text(ctx, 'KURSI F8', 552, 930, { family: MONO, size: 18, weight: 700, color: INK })

      // sobekan: border-top 4px dashed
      dashedLine(ctx, 60, 986, 960, 4, INK)

      // baris bawah (flex space-between): tanggal · jumlah orang · barcode + nomor
      const o = { family: MONO, size: 18, color: INK }
      const tanggal = texts.tanggal?.trim() ?? ''
      const wDate = tanggal ? Math.min(300, measure(ctx, tanggal, o)) : 0
      const wOrang = measure(ctx, '2 ORANG', o)
      const items = tanggal ? 3 : 2
      const gap = (880 - wDate - wOrang - 260) / (items - 1)
      if (tanggal) text(ctx, tanggal, 100, 1012, { ...o, maxWidth: 300 })
      text(ctx, '2 ORANG', tanggal ? 100 + wDate + gap : 100, 1012, o)
      for (let x = 0; x < 260; x += 16)
        for (const [a, b] of BARS) if (x + a < 260) box(ctx, 720 + x + a, 1012, Math.min(b, 260 - x) - a, 60, INK)
      text(ctx, 'No. 000217', 980, 1076, { ...o, align: 'right' })
    },
    over(ctx) {
      slotInsets(ctx, [
        { x: 100, y: 400, w: 428, h: 520 },
        { x: 552, y: 400, w: 428, h: 520 },
      ])
    },
    top(ctx) {
      // garis sobek tegak + lubang setengah lingkaran (di atas lapisan noise)
      ctx.save()
      ctx.globalAlpha = 0.6
      dashedLine(ctx, 930, 160, 1030, 4, INK, true)
      ctx.restore()
      for (const y of [124, 1190]) box(ctx, 914, y, 36, 36, BG, 18)
    },
  },
})
