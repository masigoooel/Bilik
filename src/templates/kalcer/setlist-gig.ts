// Setlist Gig — design-reference/kalcer/setlist-gig.html (600x1800, 4 foto)
import { border, box, contentHeight, svg, text, type Ctx } from '../paint'
import { MARKER, MONO, TEXTURE, join, rotated, yearOf } from './helpers'
import { kalcer } from './define'

const INK = '#151515'
const PAPER = '#F7F6F2'
const ACCENT = '#D7261E'
const TAPE = '#A9ABAE'
/** sisi atas tiap baris foto (koordinat kertas sebelum diputar) */
const ROWS = [228, 552, 876, 1200]
/** kertas diputar -0.6° di titik tengahnya (300, 900) */
const PAPER_ROT = -0.6

/** pusat slot sesudah kertas diputar (kotak 416x300 di x=124 koordinat kertas) */
function slotAt(y: number) {
  const a = (PAPER_ROT * Math.PI) / 180
  const dx = 124 + 208 - 300
  const dy = y + 150 - 900
  const cx = 300 + dx * Math.cos(a) - dy * Math.sin(a)
  const cy = 900 + dx * Math.sin(a) + dy * Math.cos(a)
  return { x: cx - 208, y: cy - 150, w: 416, h: 300, rotate: PAPER_ROT }
}

/** teks Permanent Marker dengan line-height 1: kotak konten dipusatkan di baris setinggi size */
function marker(ctx: Ctx, s: string, x: number, lineTop: number, size: number, color: string) {
  text(ctx, s, x, lineTop + (size - contentHeight(ctx, MARKER, size)) / 2, { family: MARKER, size, color, maxWidth: 480 })
}

export const setlistGig = kalcer({
  id: 'kalcer-setlist-gig',
  name: 'setlist gig',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#121212' },
  placeholder: '#E2E0D9',
  fonts: ['Permanent Marker', 'Space Mono:400,700'],
  fields: ['nama', 'tempat', 'tanggal'],
  texture: TEXTURE,
  slots: ROWS.map(slotAt),
  draw: {
    under(ctx, { texts }) {
      const nama = texts.nama?.trim()
      const tempat = texts.tempat?.trim()
      rotated(ctx, 300, 900, PAPER_ROT, () => {
        box(ctx, 30, 30, 540, 1740, PAPER)
        rotated(ctx, 135, 40, -4, () => box(ctx, 60, 16, 150, 48, TAPE))
        rotated(ctx, 465, 40, 5, () => box(ctx, 390, 16, 150, 48, TAPE))

        marker(ctx, 'SETLIST', 60, 100, 76, INK)
        // [NAMA BAND] · live di [VENUE] · tanggal
        const sub = join([nama, tempat && `live di ${tempat}`, texts.tanggal])
        text(ctx, sub, 60, 180, { family: MONO, size: 16, weight: 700, color: INK, maxWidth: 480 })

        ROWS.forEach((y, i) => marker(ctx, `${i + 1}.`, 60, y + 126, 48, ACCENT))

        marker(ctx, 'ENCORE', 60, 1663.8, 44, ACCENT)
        // [NAMA BAND] · tahun (dari tanggal)
        text(ctx, join([nama, yearOf(texts.tanggal)]), 60, 1712, { family: MONO, size: 15, color: INK, maxWidth: 480 })
      })
      // pick gitar: svg 90x100 (viewBox 22x24, meet → skala 90/22, geser 0.91px), rotate 18°
      const k = 90 / 22
      rotated(ctx, 500, 1690, 18, () => {
        ctx.translate(455, 1640 + (100 - 24 * k) / 2)
        ctx.scale(k, k)
        svg(ctx, 'M11 23 C 6 18, 1 10, 2 5 C 3 1, 19 1, 20 5 C 21 10, 16 18, 11 23 Z', 0, 0, 22, 24, 22, 24, { fill: ACCENT, stroke: INK, lineWidth: 1 })
      })
    },
    over(ctx) {
      rotated(ctx, 300, 900, PAPER_ROT, () => {
        for (const y of ROWS) border(ctx, 124, y, 416, 300, 3, INK)
      })
    },
  },
})
