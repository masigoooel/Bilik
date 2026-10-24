// Awan — design-reference/cute-kawaii/awan.html (600x1800, 3 foto)
import { border, box, text, type Ctx } from '../paint'
import { cute } from './define'
import { detailOverlay, photoInset } from './helpers'

const INK = '#3B1F4A'
const CARDS = [180, 720, 1260]
const SLOTS = CARDS.map((y) => ({ x: 66, y: y + 16, w: 468, h: 400, radius: 28 }))

/** awan putih di antara kartu (lima kotak bulat, posisi hasil ukur) */
function cloud(ctx: Ctx, y: number) {
  const parts: [number, number, number, number, number][] = [
    [183, 0, 90, 60, 30],
    [243, -20, 70, 70, 35],
    [261, -16, 64, 64, 32],
    [303, 6, 100, 54, 27],
    [385, -4, 50, 50, 25],
  ]
  for (const [x, dy, w, h, r] of parts) box(ctx, x, y + dy, w, h, '#ffffff', r)
}

export const awan = cute({
  id: 'cute-awan',
  name: 'awan',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#BFE0F7' },
  placeholder: '#F6F2F8',
  fonts: ['Caprasimo', 'Nunito:600,800'],
  fields: ['tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'cerah', 300, 60, { family: 'Caprasimo', size: 54, color: INK, align: 'center' })
      const o = { family: 'Nunito', size: 18, weight: 800, color: INK }
      text(ctx, 'pagi', 50, 132, o)
      text(ctx, 'siang', 277.4, 132, o)
      text(ctx, 'sore', 513.4, 132, o)
      for (const y of CARDS) {
        box(ctx, 50, y, 500, 432, '#ffffff', 40)
        border(ctx, 50, y, 500, 432, 4, INK, 40)
      }
      cloud(ctx, 636)
      cloud(ctx, 1176)
      const tanggal = texts.tanggal?.trim()
      if (tanggal) text(ctx, tanggal, 300, 1729, { family: 'Nunito', size: 20, weight: 800, color: INK, align: 'center', maxWidth: 500 })
      // matahari (posisi absolut: di atas teks), cahaya = box-shadow spread 14px
      box(ctx, 456, 10, 126, 126, 'rgba(255,216,77,0.35)', 63)
      box(ctx, 470, 24, 98, 98, '#FFD84D', 49)
      border(ctx, 470, 24, 98, 98, 4, INK, 49)
    },
    over(ctx, { W, H }) {
      for (const s of SLOTS) photoInset(ctx, s)
      detailOverlay(ctx, W, H)
    },
  },
})
