// Telinga Kelinci — design-reference/cute-kawaii/telinga-kelinci.html (1080x1350, 1 foto)
import { border, box, ICONS, svg, text, type Ctx } from '../paint'
import { cute } from './define'
import { dashedBorder, detailOverlay, photoInset } from './helpers'

const INK = '#3B1F4A'
const PINK = '#FF8FAB'
const SLOT = { x: 132, y: 272, w: 816, h: 860, radius: 48 }
const BOW = 'M70 40 L10 8 L10 72 Z M70 40 L130 8 L130 72 Z'

/** telinga: kotak 158x308 (border 4px) berputar di titik tengahnya, isi pink di tengah */
function ear(ctx: Ctx, x: number, angle: number) {
  ctx.save()
  ctx.translate(x + 79, 194)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.translate(-79, -154)
  box(ctx, 0, 0, 158, 308, '#ffffff', 75)
  border(ctx, 0, 0, 158, 308, 4, INK, 75)
  box(ctx, 44, 49, 70, 210, '#F7B6C8', 35)
  ctx.restore()
}

export const telingaKelinci = cute({
  id: 'cute-telinga-kelinci',
  name: 'telinga kelinci',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#FBE7A1' },
  placeholder: '#F6F2F8',
  fonts: ['Caprasimo', 'Nunito:600,800'],
  fields: ['tanggal'],
  slots: [SLOT],
  draw: {
    under(ctx, { texts }) {
      ear(ctx, 300, -12)
      ear(ctx, 630, 12)
      // pita
      ctx.save()
      ctx.translate(470, 200)
      svg(ctx, BOW, 0, 0, 140, 80, 140, 80, { fill: PINK, stroke: INK, lineWidth: 4, lineJoin: 'round' })
      ctx.beginPath()
      ctx.arc(70, 40, 14, 0, Math.PI * 2)
      ctx.fillStyle = PINK
      ctx.fill()
      ctx.lineWidth = 4
      ctx.strokeStyle = INK
      ctx.stroke()
      ctx.restore()
      // kartu putih
      box(ctx, 110, 250, 860, 904, '#ffffff', 60)
      border(ctx, 110, 250, 860, 904, 4, INK, 60)

      text(ctx, 'No. 01', 110, 1216, { family: 'Caprasimo', size: 56, color: INK })
      const tanggal = texts.tanggal?.trim()
      if (tanggal) text(ctx, tanggal, 970, 1250, { family: 'Nunito', size: 22, weight: 800, color: INK, align: 'right', maxWidth: 560 })

      svg(ctx, ICONS.star, 880, 170, 90, 90, 24, 24, { fill: '#FFFFFF', stroke: INK, lineWidth: 1, lineJoin: 'round', rotate: 12 })
      svg(ctx, ICONS.heart, 110, 180, 70, 70, 24, 24, { fill: PINK, stroke: INK, lineWidth: 1, lineJoin: 'round', rotate: -10 })
    },
    over(ctx, { W, H }) {
      photoInset(ctx, SLOT)
      // pipi merona (menimpa foto)
      ctx.save()
      ctx.globalAlpha = 0.7
      ctx.fillStyle = PINK
      for (const x of [150, 866]) {
        ctx.beginPath()
        ctx.ellipse(x + 32, 1102, 32, 22, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
      detailOverlay(ctx, W, H)
      // garis jahitan putus-putus (z-index 2: di atas foto dan lapisan detail)
      dashedBorder(ctx, 126, 266, 828, 872, 3, INK, 48, [6, 3])
    },
  },
})
