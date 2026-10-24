// Disket — design-reference/y2k-aesthetic/disket.html (600x1800, 3 foto)
import { box, dropShadow, linear, text, type Ctx } from '../paint'
import { y2k } from './define'
import { detailSheen, photoInset } from './helpers'

const BG = '#3A8C8C'
const ACCENT = '#1F3A8A'

/** disket 470x470 (x 65), diputar di titik tengahnya */
const DISKS = [
  { y: 139, angle: -3, color: '#2B2B2B' },
  { y: 649, angle: 2, color: ACCENT },
  { y: 1159, angle: -2, color: '#C0392B' },
]
/** pusat slot sebenarnya (hasil ukur, sudah ikut rotasi) */
const SLOTS = [
  { x: 119.5, y: 320.9 },
  { x: 115.3, y: 831 },
  { x: 118.7, y: 1341 },
]

function inDisk(ctx: Ctx, d: (typeof DISKS)[number], draw: () => void) {
  ctx.save()
  ctx.translate(300, d.y + 235)
  ctx.rotate((d.angle * Math.PI) / 180)
  ctx.translate(-235, -235)
  draw()
  ctx.restore()
}

export const disket = y2k({
  id: 'y2k-disket',
  name: 'disket',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#e3e1dc',
  fonts: ['Silkscreen', 'Space Mono:400,700'],
  fields: ['tanggal'],
  slots: DISKS.map((d, i) => ({ ...SLOTS[i], w: 366, h: 202, rotate: d.angle })),
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'A:\\ KENANGAN', 300, 60, { family: 'Silkscreen', size: 30, color: '#ffffff', align: 'center' })
      DISKS.forEach((d, i) =>
        inDisk(ctx, d, () => {
          dropShadow(ctx, 0, 0, 470, 470, 0, 10, 20, 'rgba(0,0,0,0.3)', 10)
          box(ctx, 0, 0, 470, 470, d.color, 10)
          // penutup logam + lubang
          box(ctx, 110, 0, 250, 130, linear(ctx, 110, 0, 250, 130, 180, [[0, '#e6e9ee'], [1, '#9aa3ae']]), [0, 0, 6, 6])
          box(ctx, 260, 20, 50, 90, '#2a2a2a', 4)
          // label kertas
          box(ctx, 40, 170, 390, 270, '#fbfaf6', 6)
          text(ctx, `foto_0${i + 1} · 1,44 MB`, 52, 392, { family: 'Silkscreen', size: 16, color: '#111111' })
          // pengunci tulis
          box(ctx, 438, 16, 16, 16, '#111111')
        }),
      )
      const tanggal = texts.tanggal?.trim()
      text(ctx, tanggal ? `3 berkas · ${tanggal}` : '3 berkas', 300, 1669, { family: 'Silkscreen', size: 16, color: '#ffffff', align: 'center', maxWidth: 560 })
    },
    over(ctx, { W, H }) {
      for (const d of DISKS) inDisk(ctx, d, () => photoInset(ctx, 52, 182, 366, 202))
      detailSheen(ctx, W, H)
    },
  },
})
