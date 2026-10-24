// Empat Warna — design-reference/bold-pop/empat-warna.html (1200x1800, 4 foto)
import { border, box, text } from '../paint'
import { BANGERS, INK, MONO, detailDots, photoInset, yearOf } from './helpers'
import { pop } from './define'

/** bingkai warna (border 6px, padding 20px) grid 2 kolom tanpa jarak; lapisan warna 35% multiply di atas foto */
const FRAMES = [
  { color: '#FF8FD1', tint: 'rgba(255,0,120,0.35)' },
  { color: '#FFD600', tint: 'rgba(255,200,0,0.35)' },
  { color: '#3FB8FF', tint: 'rgba(0,140,255,0.35)' },
  { color: '#7CE05A', tint: 'rgba(60,200,40,0.35)' },
].map((f, i) => ({ ...f, x: 80 + (i % 2) * 520, y: 80 + Math.floor(i / 2) * 652 }))
const SLOTS = FRAMES.map((f) => ({ x: f.x + 26, y: f.y + 26, w: 468, h: 600 }))

export const empatWarna = pop({
  id: 'pop-empat-warna',
  name: 'empat warna',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#E8E6E0',
  fonts: ['Bangers', 'Space Mono:400,700'],
  fields: ['nama', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      for (const f of FRAMES) {
        box(ctx, f.x, f.y, 520, 652, f.color)
        border(ctx, f.x, f.y, 520, 652, 6, INK)
      }
      const nama = texts.nama?.trim() ?? ''
      // "[NAMA] x4": tanpa nama cukup "x4"
      text(ctx, nama ? `${nama} x4` : 'x4', 80, 1614.5, { family: BANGERS, size: 110, color: INK, maxWidth: 780 })
      const year = yearOf(texts.tanggal?.trim() ?? '')
      text(ctx, year ? `cetak saring · ${year}` : 'cetak saring', 1120, 1694, { family: MONO, size: 18, weight: 700, color: INK, align: 'right' })
    },
    over(ctx) {
      SLOTS.forEach((s, i) => {
        photoInset(ctx, s)
        ctx.save()
        ctx.globalCompositeOperation = 'multiply'
        box(ctx, s.x, s.y, s.w, s.h, FRAMES[i].tint)
        ctx.restore()
      })
    },
    top(ctx, { W, H }) {
      detailDots(ctx, W, H)
    },
  },
})
