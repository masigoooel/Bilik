// Pop Single — design-reference/bold-pop/pop-single.html (1080x1350, 1 foto)
import { border, box, dropShadow, measure, svg, text, textMid } from '../paint'
import { BANGERS, FONTS, INK, TEXTURE, detailDots, halftone, photoInset, rotated } from './helpers'
import { pop } from './define'

const BG = '#FFD600'
const BURST = '#FF3B30'
const SLOT = { x: 97, y: 157, w: 886, h: 920 }
/** <polygon> ledakan bintang di viewBox 100 */
const BURST_D = 'M50 2 L60 30 L90 14 L72 42 L98 52 L70 62 L84 92 L56 74 L46 98 L40 70 L10 86 L28 60 L2 48 L30 38 L14 10 L42 26 Z'

export const popSingle = pop({
  id: 'pop-single',
  name: 'pop single',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  placeholder: '#E8E6E0',
  fonts: FONTS,
  fields: ['catatan', 'nama', 'tanggal'],
  texture: TEXTURE,
  slots: [SLOT],
  draw: {
    under(ctx, { texts, W, H }) {
      halftone(ctx, 0, 0, W, H, 22, 'rgba(0,0,0,0.18)', 3, 4)
      // repeating-conic-gradient(from 0deg at 50% 45%, 5% hitam 0 4deg, transparan 4deg 12deg)
      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      const cx = W / 2
      const cy = H * 0.45
      for (let i = 0; i < 30; i++) {
        const a0 = ((i * 12 - 90) * Math.PI) / 180
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, 2000, a0, a0 + (4 * Math.PI) / 180)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()

      // bingkai putih tebal + bayangan keras
      dropShadow(ctx, 90, 150, 900, 934, 14, 14, 0, INK)
      box(ctx, 90, 150, 900, 934, '#ffffff')
      border(ctx, 90, 150, 900, 934, 7, INK)

      const o = { family: BANGERS, size: 30, color: INK }
      text(ctx, texts.nama?.trim() ?? '', 90, 1239, { ...o, maxWidth: 440 })
      text(ctx, texts.tanggal?.trim() ?? '', 990, 1239, { ...o, align: 'right', maxWidth: 380 })
    },
    over(ctx, { texts }) {
      photoInset(ctx, SLOT)
      // label kuning [TEKS] (padding 10px 20px, border 5px, rotate -2deg), lebar mengikuti teks
      const label = texts.catatan?.trim() ?? ''
      if (label) {
        const size = Math.min(30, (30 * 560) / Math.max(1, measure(ctx, label, { family: BANGERS, size: 30 })))
        const w = measure(ctx, label, { family: BANGERS, size }) + 50
        rotated(ctx, 80 + w / 2, 1023.5, -2, () => {
          box(ctx, 80, 993, w, 61, '#FFE45C')
          border(ctx, 80, 993, w, 61, 5, INK)
          text(ctx, label, 105, 1008, { family: BANGERS, size: 30, color: INK, maxWidth: 560 })
        })
      }
      // ledakan bintang "No. 01"
      svg(ctx, BURST_D, 760, 60, 260, 260, 100, 100, { fill: BURST, stroke: INK, lineWidth: 2.5, lineJoin: 'round' })
      rotated(ctx, 890, 190, -8, () => textMid(ctx, 'No. 01', 890, 60, 260, { family: BANGERS, size: 54, color: INK, align: 'center' }))
    },
    top(ctx, { W, H }) {
      detailDots(ctx, W, H)
    },
  },
})
