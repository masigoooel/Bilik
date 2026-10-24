// Gelembung — design-reference/cute-kawaii/gelembung.html (1080x1350, 2 foto)
import { border, box, ICONS, svg, text, type Ctx } from '../paint'
import { cute } from './define'
import { detailOverlay, photoInset } from './helpers'

const INK = '#3B1F4A'
/** gelembung 520x520 (border-box, border 4px, padding 18px), foto bulat 476 di dalamnya */
const BUBBLES = [
  { x: 50, y: 190 },
  { x: 510, y: 720 },
]
const SLOTS = BUBBLES.map((b) => ({ x: b.x + 22, y: b.y + 22, w: 476, h: 476, radius: 238 }))

/** kilau elips 120x60 (left 110, top 90 di dalam border), rotate(-35deg), putih 75% */
function shine(ctx: Ctx, bx: number, by: number) {
  ctx.save()
  ctx.translate(bx + 4 + 110 + 60, by + 4 + 90 + 30)
  ctx.rotate((-35 * Math.PI) / 180)
  ctx.beginPath()
  ctx.ellipse(0, 0, 60, 30, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fill()
  ctx.restore()
}

function smallBubble(ctx: Ctx, x: number, y: number, d: number) {
  box(ctx, x, y, d, d, 'rgba(255,255,255,0.5)', d / 2)
  border(ctx, x, y, d, d, 4, INK, d / 2)
}

export const gelembung = cute({
  id: 'cute-gelembung',
  name: 'gelembung',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: '#CDEFE0' },
  placeholder: '#F1F6F3',
  fonts: ['Caprasimo', 'Nunito:600,800'],
  fields: ['tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'berdua', 80, 70, { family: 'Caprasimo', size: 64, color: INK })
      for (const b of BUBBLES) {
        box(ctx, b.x, b.y, 520, 520, '#ffffff', 260)
        border(ctx, b.x, b.y, 520, 520, 4, INK, 260)
      }
      smallBubble(ctx, 760, 330, 68)
      smallBubble(ctx, 140, 1170, 58)
      smallBubble(ctx, 960, 600, 48)
      svg(ctx, ICONS.heart, 820, 180, 110, 110, 24, 24, { fill: '#FF8FAB', stroke: INK, lineWidth: 0.8, lineJoin: 'round', rotate: 12 })
      svg(ctx, ICONS.heart, 120, 960, 70, 70, 24, 24, { fill: '#FFFFFF', stroke: INK, lineWidth: 1, lineJoin: 'round', rotate: -14 })
      svg(ctx, ICONS.star, 900, 1250, 80, 80, 24, 24, { fill: '#FFD84D', stroke: INK, lineWidth: 1, lineJoin: 'round' })
      const tanggal = texts.tanggal?.trim()
      if (tanggal) text(ctx, tanggal, 80, 1260, { family: 'Nunito', size: 22, weight: 800, color: INK, maxWidth: 780 })
    },
    over(ctx, { W, H }) {
      for (const [i, b] of BUBBLES.entries()) {
        photoInset(ctx, SLOTS[i])
        shine(ctx, b.x, b.y)
      }
      detailOverlay(ctx, W, H)
    },
  },
})
