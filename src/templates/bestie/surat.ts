// Surat — design-reference/bestie-couple/surat.html (1200x1800, 4 foto)
import { border, box, dropShadow, radial, svg, text, textMid } from '../paint'
import { bestie } from './define'
import { dashedBorder, FONTS, HAND, INK, initial, MONO, rotated, SERIF, slotInsets, yearOf } from './helpers'

const RED = '#C0392B'
const SLOTS = [
  { x: 150, y: 352 },
  { x: 615, y: 352 },
  { x: 150, y: 882 },
  { x: 615, y: 882 },
]
const WAVES = [10, 26, 42, 58].map((y) => `M0 ${y} Q 23.75 ${y - 10} 47.5 ${y} T 95.0 ${y} T 142.5 ${y} T 190 ${y}`)

export const surat = bestie({
  id: 'bestie-surat',
  name: 'surat',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#C9A27A' },
  placeholder: '#E9E3D6',
  fonts: FONTS,
  fields: ['nama', 'nama2', 'tanggal'],
  texture: { opacity: 0.09, blend: 'multiply' },
  slots: SLOTS.map((s) => ({ ...s, w: 435, h: 500 })),
  draw: {
    under(ctx, { texts }) {
      // kertas surat bergaris
      dropShadow(ctx, 90, 90, 1020, 1630, 0, 10, 30, 'rgba(0,0,0,0.12)')
      box(ctx, 90, 90, 1020, 1630, '#FBF8F1')
      for (let y = 90 + 46; y < 90 + 1630; y += 48) box(ctx, 90, y, 1020, Math.min(2, 1720 - y), '#E2DBCB')

      const untuk = texts.nama?.trim()
      text(ctx, `untuk ${untuk || 'kamu'},`, 150, 150, { family: HAND, size: 76, color: INK, maxWidth: 540 })

      // perangko (rotate 4deg): tepi putus-putus + isi warna + tahun
      rotated(ctx, 985, 240, 4, () => {
        box(ctx, 920, 160, 130, 160, '#ffffff')
        dashedBorder(ctx, 920, 160, 130, 160, 2, INK)
        box(ctx, 930, 170, 110, 140, RED)
        const tahun = yearOf(texts.tanggal)
        if (tahun) text(ctx, tahun, 985, 281, { family: MONO, size: 14, weight: 700, color: '#ffffff', align: 'center' })
      })

      const dari = texts.nama2?.trim()
      if (dari) text(ctx, `dari ${dari}`, 1050, 1604, { family: HAND, size: 52, color: INK, align: 'right', maxWidth: 420 })

      // cap pos (rotate -12deg) + garis gelombang
      rotated(ctx, 964, 264, -12, () => {
        ctx.beginPath()
        ctx.arc(964, 264, 64, 0, Math.PI * 2)
        ctx.arc(964, 264, 60, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(31,29,26,0.6)'
        ctx.fill('evenodd')
        const o = { family: MONO, size: 14, weight: 700, color: 'rgba(31,29,26,0.7)', align: 'center' as const }
        const tanggal = texts.tanggal?.trim()
        if (tanggal) {
          text(ctx, 'POS', 964, 243, o)
          text(ctx, tanggal, 964, 264, { ...o, maxWidth: 104 })
        } else text(ctx, 'POS', 964, 253.5, o)
      })
      svg(ctx, WAVES, 700, 220, 190, 70, 190, 70, { stroke: 'rgba(31,29,26,0.5)', lineWidth: 3 })

      // segel lilin dengan inisial pengirim
      dropShadow(ctx, 540, 1600, 120, 120, 0, 4, 10, 'rgba(0,0,0,0.3)', 60)
      box(ctx, 540, 1600, 120, 120, radial(ctx, 588, 1642, Math.hypot(72, 78), [[0, '#e05a4a'], [0.75, '#8e1f16'], [1, '#8e1f16']]), 60)
      border(ctx, 557, 1617, 86, 86, 3, 'rgba(255,255,255,0.35)', 43)
      textMid(ctx, initial(texts.nama2), 600, 1620, 80, { family: SERIF, size: 34, color: 'rgba(255,255,255,0.75)', align: 'center' })
    },
    over(ctx) {
      slotInsets(ctx, SLOTS.map((s) => ({ ...s, w: 435, h: 500 })))
    },
  },
})
