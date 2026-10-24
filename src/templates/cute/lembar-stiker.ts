// Lembar Stiker — design-reference/cute-kawaii/lembar-stiker.html (1200x1800, 6 foto)
import { border, box, ICONS, setShadow, svg, text, type Ctx } from '../paint'
import { cute } from './define'
import { dashedBorder, detailOverlay, photoInset } from './helpers'

const INK = '#3B1F4A'
const BG = '#E3D9F7'
/** kartu 502x406 (padding 14, border 4) grid 2 kolom gap 36; radius kartu / radius foto */
const CARDS = [
  { x: 80, y: 202.8, r: 74, pr: 60 },
  { x: 618, y: 202.8, r: 214, pr: 200 },
  { x: 80, y: 644.8, r: 38, pr: 24 },
  { x: 618, y: 644.8, r: 214, pr: 200 },
  { x: 80, y: 1086.8, r: 74, pr: 60 },
  { x: 618, y: 1086.8, r: 38, pr: 24 },
]

const SLOTS = CARDS.map((c) => ({ x: c.x + 18, y: c.y + 18, w: 466, h: 370, radius: c.pr }))

/** radial-gradient(circle, rgba(59,31,74,0.12) 2px, transparent 3px) 0 0 / 28px 28px */
function dots(ctx: Ctx, W: number, H: number) {
  const scale = 4
  const c = document.createElement('canvas')
  c.width = c.height = 28 * scale
  const t = c.getContext('2d')!
  t.scale(scale, scale)
  const g = t.createRadialGradient(14, 14, 0, 14, 14, 3)
  g.addColorStop(0, 'rgba(59,31,74,0.12)')
  g.addColorStop(2 / 3, 'rgba(59,31,74,0.12)')
  g.addColorStop(1, 'rgba(59,31,74,0)')
  t.fillStyle = g
  t.fillRect(0, 0, 28, 28)
  const pat = ctx.createPattern(c, 'repeat')!
  pat.setTransform(new DOMMatrix().scale(1 / scale))
  ctx.fillStyle = pat
  ctx.fillRect(0, 0, W, H)
}

export const lembarStiker = cute({
  id: 'cute-lembar-stiker',
  name: 'lembar stiker',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: BG },
  placeholder: '#F3EEF6',
  fonts: ['Caprasimo', 'Nunito:600,800'],
  fields: ['tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      dots(ctx, W, H)
      text(ctx, 'lembar stiker', 80, 68, { family: 'Caprasimo', size: 92, color: INK })
      text(ctx, '06', 1120, 130.8, { family: 'Nunito', size: 24, weight: 800, color: INK, align: 'right' })
      for (const c of CARDS) {
        box(ctx, c.x, c.y, 502, 406, '#ffffff', c.r)
        border(ctx, c.x, c.y, 502, 406, 4, INK, c.r)
        // outline 3px dashed, offset 10px
        dashedBorder(ctx, c.x - 13, c.y - 13, 528, 432, 3, INK, c.r + 13, [6, 3])
      }
      const tanggal = texts.tanggal?.trim()
      if (tanggal) text(ctx, tanggal, 80, 1690, { family: 'Nunito', size: 22, weight: 800, color: INK, maxWidth: 900 })
    },
    over(ctx, { W, H }) {
      for (const sl of SLOTS) photoInset(ctx, sl)
      svg(ctx, ICONS.star, 560, 560, 80, 80, 24, 24, { fill: '#FFD84D', stroke: INK, lineWidth: 1, lineJoin: 'round', rotate: 10 })
      svg(ctx, ICONS.heart, 560, 1000, 70, 70, 24, 24, { fill: '#FF8FAB', stroke: INK, lineWidth: 1, lineJoin: 'round', rotate: -8 })
      svg(ctx, ICONS.sparkle, 1080, 1420, 70, 70, 24, 24, { fill: '#FFFFFF', stroke: INK, lineWidth: 0.8, lineJoin: 'round' })
      // sudut stiker terkelupas: segitiga putih + drop-shadow (diputar 180°, jadi bayangan jatuh ke kanan bawah)
      ctx.save()
      setShadow(ctx, 4, 4, 4, 'rgba(0,0,0,0.25)')
      ctx.beginPath()
      ctx.moveTo(1040, 1420)
      ctx.lineTo(1110, 1420)
      ctx.lineTo(1040, 1490)
      ctx.closePath()
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.restore()
      detailOverlay(ctx, W, H)
    },
  },
})
