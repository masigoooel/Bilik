// Permen — design-reference/cute-kawaii/permen.html (600x1800, 4 foto)
import { border, box, ICONS, measure, svg, text, type Ctx } from '../paint'
import { cute } from './define'
import { detailOverlay, photoInset } from './helpers'

const INK = '#3B1F4A'
const PINK = '#FF8FAB'
const STRIPE = '#F7B6C8'
const CARDS = [159, 517, 875, 1233]
const SLOTS = CARDS.map((y) => ({ x: 60, y: y + 16, w: 480, h: 300, radius: 12 }))

/** repeating-linear-gradient(45deg, warna 0 40px, putih 40px 80px) */
function stripes(ctx: Ctx, W: number, H: number) {
  const a = Math.PI / 4
  const L = W * Math.sin(a) + H * Math.cos(a)
  ctx.save()
  ctx.translate(W / 2, H / 2)
  ctx.rotate(-a)
  ctx.fillStyle = STRIPE
  for (let t = 0; t < L; t += 80) ctx.fillRect(-L / 2 + t, -L, 40, 2 * L)
  ctx.restore()
}

/** confetti 22x8 radius 4, rotate di titik tengah */
function confetti(ctx: Ctx, x: number, y: number, deg: number, color: string) {
  ctx.save()
  ctx.translate(x + 11, y + 4)
  ctx.rotate((deg * Math.PI) / 180)
  box(ctx, -11, -4, 22, 8, color, 4)
  ctx.restore()
}

/** permen lolipop: tongkat (left 470 + margin 42, top 1600 + margin 60) + lingkaran 98 repeating-conic-gradient(pink 0 20deg, putih 20deg 40deg) */
function lollipop(ctx: Ctx) {
  box(ctx, 512, 1660, 20, 126, '#ffffff')
  border(ctx, 512, 1660, 20, 126, 3, INK)
  const cx = 489
  const cy = 1649
  box(ctx, 440, 1604, 98, 98, INK, 49)
  box(ctx, 440, 1600, 98, 98, '#ffffff', 49)
  ctx.save()
  ctx.fillStyle = PINK
  for (let i = 0; i < 9; i++) {
    const a0 = ((-90 + i * 40) * Math.PI) / 180
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, 49, a0, a0 + (20 * Math.PI) / 180)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
  border(ctx, 440, 1600, 98, 98, 4, INK, 49)
}

export const permen = cute({
  id: 'cute-permen',
  name: 'permen',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#ffffff' },
  placeholder: '#F6F2F8',
  fonts: ['Caprasimo', 'Nunito:600,800'],
  fields: ['tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      stripes(ctx, W, H)
      // judul pil "manis"
      box(ctx, 195.2, 50, 209.7, 83, '#ffffff', 40)
      border(ctx, 195.2, 50, 209.7, 83, 4, INK, 40)
      text(ctx, 'manis', 300, 64, { family: 'Caprasimo', size: 48, color: INK, align: 'center' })
      for (const y of CARDS) {
        box(ctx, 44, y, 512, 332, '#ffffff', 24)
        border(ctx, 44, y, 512, 332, 4, INK, 24)
      }
      // pil tanggal (lebar mengikuti teks: padding 20px + border 3px)
      const tanggal = texts.tanggal?.trim()
      if (tanggal) {
        const o = { family: 'Nunito', size: 20, weight: 800, color: INK }
        const tw = Math.min(measure(ctx, tanggal, o), 380)
        const w = tw + 46
        box(ctx, 300 - w / 2, 1701, w, 49, '#ffffff', 30)
        border(ctx, 300 - w / 2, 1701, w, 49, 3, INK, 30)
        text(ctx, tanggal, 300, 1712, { ...o, align: 'center', maxWidth: 380 })
      }
    },
    over(ctx, { W, H }) {
      for (const sl of SLOTS) photoInset(ctx, sl)
      // elemen absolut: digambar di atas kartu & foto
      confetti(ctx, 20, 140, 30, INK)
      confetti(ctx, 560, 420, -20, '#FFD84D')
      confetti(ctx, 14, 640, 60, '#7FD3FF')
      svg(ctx, ICONS.star, 500, 180, 70, 70, 24, 24, { fill: '#FFD84D', stroke: INK, lineWidth: 1, lineJoin: 'round', rotate: 14 })
      svg(ctx, ICONS.heart, 20, 880, 60, 60, 24, 24, { fill: PINK, stroke: INK, lineWidth: 1, lineJoin: 'round', rotate: -12 })
      svg(ctx, ICONS.star, 510, 1300, 56, 56, 24, 24, { fill: '#FFFFFF', stroke: INK, lineWidth: 1.2, lineJoin: 'round' })
      lollipop(ctx)
      detailOverlay(ctx, W, H)
    },
  },
})
