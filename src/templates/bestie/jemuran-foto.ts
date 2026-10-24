// Jemuran Foto — design-reference/bestie-couple/jemuran-foto.html (1200x1800, 4 foto)
import { box, contentHeight, dropShadow, linear, text, type Ctx } from '../paint'
import { bestie } from './define'
import { ellipseFill, HAND, INK, MONO, photoInset, rotated, SERIF, yearOf } from './helpers'

const BG = '#E9E4DA'
/** kartu 492x492 (lebar 460 + padding 16 16 56), rotate di tengah atas; slot = hasil ukur (pusat sudah diputar) */
const CARDS = [
  { x: 90, y: 262, rot: -3, label: 'pagi', slot: { x: 117.8, y: 277.7 } },
  { x: 640, y: 268, rot: 3, label: 'siang', slot: { x: 644.2, y: 283.7 } },
  { x: 110, y: 992, rot: 2, label: 'sore', slot: { x: 118.1, y: 1007.9 } },
  { x: 630, y: 998, rot: -2, label: 'malam', slot: { x: 653.9, y: 1013.9 } },
]
type Card = (typeof CARDS)[number]
const inCard = (ctx: Ctx, c: Card, draw: () => void) => rotated(ctx, c.x + 246, c.y, c.rot, draw)
const ROPES = [230, 960]

function rope(ctx: Ctx, y: number) {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(-10, y)
  ctx.quadraticCurveTo(600, y + 100, 1210, y)
  ctx.lineWidth = 7
  ctx.strokeStyle = '#6a5a46'
  ctx.stroke()
  ctx.setLineDash([5, 6])
  ctx.strokeStyle = '#c9b48e'
  ctx.stroke()
  ctx.restore()
}

/** jepit kayu 24x70 di tengah atas kartu */
function clothespin(ctx: Ctx, c: Card) {
  const x = c.x + 234
  const y = c.y - 34
  dropShadow(ctx, x, y, 24, 70, 0, 3, 4, 'rgba(0,0,0,0.3)', 4)
  box(ctx, x, y, 24, 70, linear(ctx, x, y, 24, 70, 90, [[0, '#b48a58'], [0.5, '#d9b07a'], [1, '#a07a48']]), 4)
  box(ctx, x + 3, y + 30, 18, 6, '#8f969d')
}

export const jemuranFoto = bestie({
  id: 'bestie-jemuran-foto',
  name: 'jemuran foto',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: BG },
  placeholder: '#ECE8E1',
  fonts: ['DM Serif Display', 'Space Mono:400,700', 'Caveat:700'],
  fields: ['nama', 'nama2', 'tanggal'],
  texture: { opacity: 0.09, blend: 'multiply' },
  slots: CARDS.map((c) => ({ x: c.slot.x, y: c.slot.y, w: 460, h: 420, rotate: c.rot })),
  draw: {
    under(ctx, { texts, W, H }) {
      ellipseFill(ctx, W, H, 0.5, 0.3, [[0, '#ffffff'], [0.75, BG], [1, BG]])
      for (const y of ROPES) rope(ctx, y)

      text(ctx, 'dijemur dulu', 80, 56, { family: SERIF, size: 72, color: INK })
      const names = [texts.nama?.trim(), texts.nama2?.trim()].filter(Boolean).join(' dan ')
      const line = [names, yearOf(texts.tanggal)].filter(Boolean).join(' · ')
      text(ctx, line, 80, 142, { family: MONO, size: 15, color: INK, maxWidth: 1040 })

      for (const c of CARDS)
        inCard(ctx, c, () => {
          dropShadow(ctx, c.x, c.y, 492, 492, 0, 12, 20, 'rgba(0,0,0,0.18)')
          box(ctx, c.x, c.y, 492, 492, '#FBFAF6')
        })
    },
    over(ctx, { W, H }) {
      for (const c of CARDS)
        inCard(ctx, c, () => {
          photoInset(ctx, c.x + 16, c.y + 16, 460, 420)
          const o = { family: HAND, size: 32, weight: 700, color: INK }
          text(ctx, c.label, c.x + 18, c.y + 492 - 12 - contentHeight(ctx, HAND, 32, 700), o)
          clothespin(ctx, c)
        })
      // cahaya hangat di kanan atas (menimpa foto)
      ellipseFill(ctx, W, H, 0.8, 0.1, [[0, 'rgba(255,240,200,0.35)'], [0.4, 'rgba(255,240,200,0)'], [1, 'rgba(255,240,200,0)']])
    },
    top(ctx, { W, H }) {
      // data-detail (di atas noise): lapisan CSS terakhir digambar paling bawah
      ellipseFill(ctx, W, H, 0.5, 0.55, [[0, 'rgba(0,0,0,0)'], [0.6, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.14)']])
      ellipseFill(ctx, W, H, 0.25, 0.15, [[0, 'rgba(255,240,210,0.22)'], [0.45, 'rgba(255,240,210,0)'], [1, 'rgba(255,240,210,0)']])
    },
  },
})
