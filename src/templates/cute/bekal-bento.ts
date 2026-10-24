// Bekal Bento — design-reference/cute-kawaii/bekal-bento.html (1200x1800, 4 foto)
import { border, box, svg, text } from '../paint'
import { cute } from './define'
import { detailOverlay, photoInset } from './helpers'

const INK = '#3B1F4A'
/** sekat bento (border 4px, padding 14px), posisi hasil ukur */
const CELLS = [
  { x: 131, y: 281, w: 501.8, h: 640, color: '#FFE48A' },
  { x: 650.8, y: 281, w: 418.2, h: 296, color: '#9EF0D2' },
  { x: 650.8, y: 595, w: 418.2, h: 326, color: '#F7B6C8' },
  { x: 131, y: 939, w: 938, h: 336, color: '#C9B2FF' },
]
const SLOTS = [
  { x: 148.9, y: 299, w: 466, h: 600, radius: 16 },
  { x: 668.9, y: 299, w: 382, h: 260, radius: 16 },
  { x: 668.9, y: 613, w: 382, h: 290, radius: 16 },
  { x: 149, y: 957, w: 902, h: 300, radius: 16 },
]
const RICE = 'M55 6 C 80 6, 104 70, 96 86 C 88 98, 22 98, 14 86 C 6 70, 30 6, 55 6 Z'

export const bekalBento = cute({
  id: 'cute-bekal-bento',
  name: 'bekal bento',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#FBE7A1' },
  placeholder: '#FBF6FF',
  fonts: ['Caprasimo', 'Nunito:600,800'],
  fields: ['nama', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'bekal', 80, 84.8, { family: 'Caprasimo', size: 96, color: INK })
      // onigiri 110x100
      svg(ctx, RICE, 1010, 90, 110, 100, 110, 100, { fill: '#ffffff', stroke: INK, lineWidth: 5 })
      box(ctx, 1040, 150, 50, 34, '#2a3a2a', 6)
      for (const [cx, cy, r, c] of [
        [1054, 138, 4, INK],
        [1076, 138, 4, INK],
        [1046, 146, 5, 'rgba(255,143,171,0.7)'],
        [1084, 146, 5, 'rgba(255,143,171,0.7)'],
      ] as const) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fillStyle = c
        ctx.fill()
      }
      // kotak bekal: bayangan keras 0 14px 0, isi merah, border 5px, alas gelap
      box(ctx, 80, 244, 1040, 1096, INK, 50)
      box(ctx, 80, 230, 1040, 1096, '#E86A5C', 50)
      border(ctx, 80, 230, 1040, 1096, 5, INK, 50)
      box(ctx, 111, 261, 978, 1034, '#2B2B2B', 34)
      for (const c of CELLS) {
        box(ctx, c.x, c.y, c.w, c.h, c.color, 26)
        border(ctx, c.x, c.y, c.w, c.h, 4, INK, 26)
      }
      const o = { family: 'Nunito', size: 22, weight: 800, color: INK }
      const nama = texts.nama?.trim()
      const tanggal = texts.tanggal?.trim()
      if (nama) text(ctx, nama, 80, 1680, { ...o, maxWidth: tanggal ? 600 : 1040 })
      if (tanggal) text(ctx, tanggal, 1120, 1680, { ...o, align: 'right', maxWidth: nama ? 400 : 1040 })
    },
    over(ctx, { W, H }) {
      for (const s of SLOTS) photoInset(ctx, s)
      detailOverlay(ctx, W, H)
    },
  },
})
