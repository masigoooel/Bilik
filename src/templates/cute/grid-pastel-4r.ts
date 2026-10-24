// Grid Pastel 4R — design-reference/cute-kawaii/grid-pastel-4r.html (1200x1800, 4 foto)
import { border, box, ICONS, svg, text } from '../paint'
import { cute } from './define'
import { dashedBorder, detailOverlay, spacedText } from './helpers'

const INK = '#3B1F4A'
/** kartu 508x578 (padding 16, border 3) di grid 2 kolom, gap 40; pusat + kemiringan */
const CARDS = [
  { cx: 326, cy: 581, tilt: -1.5 },
  { cx: 874, cy: 581, tilt: 1.2 },
  { cx: 326, cy: 1199, tilt: 1 },
  { cx: 874, cy: 1199, tilt: -1.2 },
]

export const gridPastel4r = cute({
  id: 'cute-grid-pastel-4r',
  name: 'grid pastel',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#F9D9E3' },
  placeholder: '#F3EEF6',
  fonts: ['Caprasimo', 'Nunito:600,800'],
  fields: ['tanggal'],
  slots: CARDS.map((c) => ({ x: c.cx - 235, y: c.cy - 270, w: 470, h: 540, radius: 10, rotate: c.tilt })),
  draw: {
    under(ctx, { texts }) {
      svg(ctx, ICONS.star, 1014, 48, 96, 96, 24, 24, { fill: '#FFD84D', stroke: INK, lineWidth: 1, lineJoin: 'round' })
      svg(ctx, ICONS.heart, 70, 1658, 72, 72, 24, 24, { fill: '#FF8FAB', stroke: INK, lineWidth: 1, lineJoin: 'round' })

      text(ctx, 'hari minggu', 72, 99.2, { family: 'Caprasimo', size: 104, color: INK, maxWidth: 1056 })
      const tanggal = texts.tanggal?.trim()
      const sub = ['photobox', tanggal].filter(Boolean).join(' · ').toUpperCase()
      spacedText(ctx, sub, 72, 217, { family: 'Nunito', size: 26, weight: 800, color: INK, letterSpacing: 4.68, maxWidth: 1056 })
      text(ctx, 'no. 01', 1128, 1682, { family: 'Caprasimo', size: 40, color: INK, align: 'right' })

      for (const c of CARDS) {
        ctx.save()
        ctx.translate(c.cx, c.cy)
        ctx.rotate((c.tilt * Math.PI) / 180)
        box(ctx, -254, -289, 508, 578, '#ffffff', 20)
        border(ctx, -254, -289, 508, 578, 3, INK, 20)
        // outline 3px dashed, offset 9px
        dashedBorder(ctx, -266, -301, 532, 602, 3, INK, 32, [6, 3], -0.5)
        ctx.restore()
      }
    },
    over(ctx, { W, H }) {
      detailOverlay(ctx, W, H)
    },
  },
})
