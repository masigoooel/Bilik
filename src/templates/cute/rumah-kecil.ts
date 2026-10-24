// Rumah Kecil — design-reference/cute-kawaii/rumah-kecil.html (1080x1350, 1 foto)
import { border, box, ICONS, svg, text } from '../paint'
import { cute } from './define'
import { detailOverlay, photoInset } from './helpers'

const INK = '#3B1F4A'
const SLOT = { x: 220, y: 452, w: 640, h: 600, radius: 18 }

export const rumahKecil = cute({
  id: 'cute-rumah-kecil',
  name: 'rumah kecil',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#CDEFE0' },
  placeholder: '#F3EEF6',
  fonts: ['Caprasimo', 'Nunito:600,800'],
  fields: ['nama'],
  slots: [SLOT],
  draw: {
    under(ctx, { texts }) {
      // atap (svg 900x360 di 90,70): segitiga, cerobong, jendela bulat
      svg(ctx, 'M450 20 L880 330 L20 330 Z', 90, 70, 900, 360, 900, 360, { fill: '#F7766A', stroke: INK, lineWidth: 8, lineJoin: 'round' })
      ctx.beginPath()
      ctx.rect(730, 140, 80, 150)
      ctx.fillStyle = '#E9C9A6'
      ctx.fill()
      ctx.lineWidth = 6
      ctx.strokeStyle = INK
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(540, 280, 48, 0, Math.PI * 2)
      ctx.fillStyle = '#FFE48A'
      ctx.fill()
      ctx.stroke()
      svg(ctx, 'M450 162 V258 M402 210 H498', 90, 70, 900, 360, 900, 360, { stroke: INK, lineWidth: 6 })

      // badan rumah 780x860, border 8px kecuali atas
      box(ctx, 150, 390, 780, 860, '#FFF6EC')
      box(ctx, 150, 390, 8, 860, INK)
      box(ctx, 922, 390, 8, 860, INK)
      box(ctx, 150, 1242, 780, 8, INK)
      // bingkai foto
      box(ctx, 198, 430, 684, 644, '#ffffff', [30, 30, 0, 0])
      border(ctx, 198, 430, 684, 644, 6, INK, [30, 30, 0, 0])
      // ambang jendela
      box(ctx, 174, 1074, 732, 38, '#F7B6C8', 6)
      border(ctx, 174, 1074, 732, 38, 6, INK, 6)

      const nama = texts.nama?.trim()
      text(ctx, nama ? `rumah ${nama}` : 'rumah kita', 198, 1138, { family: 'Caprasimo', size: 48, color: INK, maxWidth: 590 })
      text(ctx, 'no. 17', 882, 1150.5, { family: 'Nunito', size: 22, weight: 800, color: INK, align: 'right' })

      // rumput
      box(ctx, 0, 1250, 1080, 100, '#9EDB8A')
      box(ctx, 0, 1250, 1080, 8, INK)
      svg(ctx, ICONS.heart, 140, 1190, 60, 60, 24, 24, { fill: '#FF8FAB', stroke: INK, lineWidth: 1, lineJoin: 'round', rotate: -10 })
      svg(ctx, ICONS.star, 880, 1196, 54, 54, 24, 24, { fill: '#FFD84D', stroke: INK, lineWidth: 1, lineJoin: 'round', rotate: 8 })
    },
    over(ctx, { W, H }) {
      photoInset(ctx, SLOT)
      detailOverlay(ctx, W, H)
    },
  },
})
