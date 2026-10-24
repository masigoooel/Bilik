// Pop Grid — design-reference/bold-pop/pop-grid.html (1200x1800, 6 foto)
import { border, box, dropShadow, text, textMid } from '../paint'
import { ARCHIVO, BANGERS, FONTS, INK, MONO, TEXTURE, detailDots, ellipseBox, halftone, photoInset } from './helpers'
import { pop } from './define'

/** bingkai warna (padding 16px, border 6px, bayangan 6px 6px 0) dalam grid 2 kolom */
const FRAMES = ['#FF3B30', '#FFD600', '#3F7BFF', '#18C27A', '#FF8FD1', '#FF8A1F'].map((color, i) => ({
  color,
  x: 80 + (i % 2) * 540,
  y: 207.5 + Math.floor(i / 2) * 434,
}))

const SLOTS = FRAMES.map((f) => ({ x: f.x + 22, y: f.y + 22, w: 456, h: 350 }))

export const popGrid = pop({
  id: 'pop-grid',
  name: 'pop grid',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#F4F2EC',
  fonts: FONTS,
  fields: ['tanggal'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      halftone(ctx, 0, 0, W, H, 22, 'rgba(0,0,0,0.18)', 3, 4)
      text(ctx, 'ENAM', 80, 58, { family: BANGERS, size: 110, color: INK })
      text(ctx, texts.tanggal?.trim() ?? '', 1120, 130.5, { family: MONO, size: 22, weight: 700, color: INK, align: 'right', maxWidth: 640 })
      for (const f of FRAMES) {
        dropShadow(ctx, f.x, f.y, 500, 394, 6, 6, 0, INK)
        box(ctx, f.x, f.y, 500, 394, f.color)
        border(ctx, f.x, f.y, 500, 394, 6, INK)
      }
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s)
      // bulatan nomor (58px + border 5px) menimpa sudut kiri atas foto
      FRAMES.forEach((f, i) => {
        const x = f.x - 16
        const y = f.y - 15.5
        ellipseBox(ctx, x, y, 68, 68, '#ffffff', 5, INK)
        textMid(ctx, String(i + 1), x + 34, y + 5, 58, { family: ARCHIVO, size: 26, color: INK, align: 'center' })
      })
    },
    top(ctx, { W, H }) {
      detailDots(ctx, W, H)
    },
  },
})
