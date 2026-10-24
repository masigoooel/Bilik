// Kartu Lipat — design-reference/bestie-couple/kartu-lipat.html (1080x1350, 2 foto)
import { box, dropShadow, setShadow, text, type Ctx } from '../paint'
import { bestie } from './define'
import { HAND, INK, SERIF, slotInsets } from './helpers'

const BG = '#E8C8C0'
const ACCENT = '#C0392B'
const SLOTS = [
  { x: 110, y: 175, w: 390, h: 760 },
  { x: 580, y: 175, w: 390, h: 760 },
]

/** box-shadow: inset dx dy blur spread color (spread negatif = bayangan menyempit) */
function insetSpread(ctx: Ctx, x: number, y: number, w: number, h: number, dx: number, dy: number, blur: number, spread: number, color: string) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  setShadow(ctx, dx, dy, blur, color)
  ctx.beginPath()
  ctx.rect(x - 300, y - 300, w + 600, h + 600)
  ctx.rect(x + spread, y + spread, w - 2 * spread, h - 2 * spread)
  ctx.fillStyle = '#000'
  ctx.fill('evenodd')
  ctx.restore()
}

export const kartuLipat = bestie({
  id: 'bestie-kartu-lipat',
  name: 'kartu lipat',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: BG },
  placeholder: '#ECE8E1',
  fonts: ['DM Serif Display', 'Space Mono:400,700', 'Caveat:700'],
  fields: ['nama'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      // kartu terbuka 940x1080: dua halaman dengan bayangan lipatan di tengah
      dropShadow(ctx, 70, 135, 940, 1080, 0, 24, 50, 'rgba(0,0,0,0.2)')
      box(ctx, 70, 135, 940, 1080, '#FBF8F1')
      insetSpread(ctx, 70, 135, 470, 1080, -14, 0, 20, -14, 'rgba(0,0,0,0.25)')
      insetSpread(ctx, 540, 135, 470, 1080, 14, 0, 20, -14, 'rgba(0,0,0,0.18)')

      const hand = { family: HAND, size: 40, weight: 700, color: INK }
      text(ctx, 'waktu itu,', 110, 955, hand)
      text(ctx, 'sekarang.', 580, 955, hand)
      const nama = texts.nama?.trim()
      if (nama) text(ctx, nama, 970, 966, { family: SERIF, size: 26, color: ACCENT, align: 'right', maxWidth: 240 })
    },
    over(ctx) {
      slotInsets(ctx, SLOTS)
    },
  },
})
