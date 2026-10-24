// Strip Garis Emas — design-reference/klasik-minimalis/strip-garis-emas.html (600x1800, 4 foto)
import { border, box, linear, text, type Ctx } from '../paint'
import { MONO, SERIF, FONTS, engraved, photoInset, photoLift, roman, yearOf } from './helpers'
import { klasik } from './define'

const ROWS = [74, 432, 790, 1148]
const SLOTS = ROWS.map((y) => ({ x: 54, y: y + 8, w: 492, h: 320 }))
const GOLD = '#c9a24a'

/** garis emas 2px: linear-gradient(90deg, #8a6420, #f6e3a4 30%, #c9a24a 55%, #f0d890 75%, #8a6420) */
function goldLine(ctx: Ctx, y: number) {
  box(ctx, 46, y, 508, 2, linear(ctx, 46, y, 508, 2, 90, [
    [0, '#8a6420'],
    [0.3, '#f6e3a4'],
    [0.55, '#c9a24a'],
    [0.75, '#f0d890'],
    [1, '#8a6420'],
  ]))
}

export const stripGarisEmas = klasik({
  id: 'klasik-strip-garis-emas',
  name: 'strip garis emas',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#F6F1E6' },
  placeholder: '#E7E2D6',
  fonts: FONTS,
  fields: ['nama', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      goldLine(ctx, 50)
      goldLine(ctx, 1748)
      for (const y of ROWS) {
        // inset 0 0 0 1.5px #c9a24a di atas inset 0 0 0 3px rgba(255,240,190,0.5)
        border(ctx, 46, y, 508, 336, 3, 'rgba(255,240,190,0.5)')
        border(ctx, 46, y, 508, 336, 1.5, GOLD)
      }
      for (const s of SLOTS) photoLift(ctx, s)
      // blok bawah rata bawah: tanpa tahun, nama turun setinggi baris tahun + gap
      const year = yearOf(texts.tanggal)
      engraved(ctx, texts.nama?.trim() ?? '', 300, year ? 1631 : 1656, { family: SERIF, size: 54, color: '#3a3226', align: 'center', maxWidth: 508 })
      if (year) text(ctx, roman(Number(year)), 300, 1709, { family: MONO, size: 13, color: '#B8963E', letterSpacing: 3.9, align: 'center' })
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s)
    },
  },
})
