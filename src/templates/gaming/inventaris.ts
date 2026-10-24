// Inventaris — design-reference/gaming-pixel/inventaris.html (1200x1800, 6 foto)
import { box, text, type Ctx } from '../paint'
import { FONTS, PIXEL, SILK, SILK_MONO, crt, disc, pixelFrame, ring, slotInset, spread } from './helpers'
import { gaming } from './define'

const WHITE = '#ffffff'
const EDGE = '#8FA0C0'
const YELLOW = '#FFD23F'
/** [ITEM] tidak punya field: nama barang tetap sesuai ikon di tiap kartu */
const CARDS: { x: number; y: number; color: string; item: string }[] = [
  { x: 80, y: 178, color: EDGE, item: 'RAMUAN' },
  { x: 620, y: 178, color: '#3FD97A', item: 'PEDANG' },
  { x: 80, y: 631, color: '#3F9BFF', item: 'KUNCI' },
  { x: 620, y: 631, color: '#B05FFF', item: 'PERISAI' },
  { x: 80, y: 1084, color: YELLOW, item: 'BOM' },
  { x: 620, y: 1084, color: EDGE, item: 'PERMATA' },
]

/** ikon barang piksel (z-index 5, menimpa pojok foto) */
const ICONS: ((ctx: Ctx) => void)[] = [
  // ramuan
  (ctx) => {
    box(ctx, 121, 210, 14, 10, '#8fd1ff')
    box(ctx, 117, 220, 22, 18, '#ff5aa0', [0, 0, 6, 6])
  },
  // pedang: 6x26, rotate(40deg) di titik tengahnya
  (ctx) => {
    ctx.save()
    ctx.translate(668, 223)
    ctx.rotate((40 * Math.PI) / 180)
    ctx.fillStyle = '#cfd6df'
    ctx.fillRect(-3, -13, 6, 26)
    ctx.restore()
  },
  // kunci
  (ctx) => {
    ring(ctx, 117, 664, 22, 4, YELLOW)
    box(ctx, 126, 684, 4, 14, YELLOW)
  },
  // perisai
  (ctx) => box(ctx, 656, 664, 24, 28, '#3f9bff', [0, 0, 12, 12]),
  // bom
  (ctx) => {
    disc(ctx, 115, 1120, 26, '#777777')
    disc(ctx, 117, 1122, 22, '#333333')
  },
  // permata: dua segitiga border
  (ctx) => {
    ctx.beginPath()
    ctx.moveTo(656, 1134)
    ctx.lineTo(680, 1134)
    ctx.lineTo(668, 1118)
    ctx.closePath()
    ctx.fillStyle = '#3fd97a'
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(656, 1134)
    ctx.lineTo(680, 1134)
    ctx.lineTo(668, 1146)
    ctx.closePath()
    ctx.fillStyle = '#2aa860'
    ctx.fill()
  },
]
const ICON_POS: [number, number][] = [
  [106, 204],
  [646, 204],
  [106, 658],
  [646, 658],
  [106, 1112],
  [646, 1112],
]

export const inventaris = gaming({
  id: 'gaming-inventaris',
  name: 'inventaris',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#151A26' },
  placeholder: '#3A4258',
  fonts: FONTS,
  fields: ['tanggal'],
  slots: CARDS.map(({ x, y }) => ({ x: x + 16, y: y + 16, w: 468, h: 340 })),
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'INVENTARIS', 80, 80, { family: PIXEL, size: 54, color: WHITE })
      text(ctx, '6/6 SLOT · ◆ 1.700 EMAS', 1120, 99, { family: SILK_MONO, size: 26, color: WHITE, align: 'right' })
      for (const c of CARDS) {
        pixelFrame(ctx, c.x, c.y, 500, 413, 5, c.color)
        box(ctx, c.x, c.y, 500, 413, '#2B3245')
        text(ctx, 'x1', c.x + 484, c.y + 368, { family: SILK, size: 22, color: WHITE, align: 'right' })
        text(ctx, c.item, c.x + 16, c.y + 368, { family: SILK, size: 22, color: WHITE, maxWidth: 400 })
      }
      text(ctx, texts.tanggal?.trim() ?? '', 80, 1689, { family: SILK, size: 24, color: WHITE, maxWidth: 1040 })
    },
    over(ctx) {
      for (const c of CARDS) slotInset(ctx, c.x + 16, c.y + 16, 468, 340)
      ICON_POS.forEach(([x, y], i) => {
        spread(ctx, x, y, 44, 44, 3, EDGE)
        box(ctx, x, y, 44, 44, '#1a1f2e')
        ICONS[i](ctx)
      })
    },
    top(ctx, { W, H }) {
      crt(ctx, W, H)
    },
  },
})

