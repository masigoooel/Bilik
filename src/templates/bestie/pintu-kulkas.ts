// Pintu Kulkas — design-reference/bestie-couple/pintu-kulkas.html (600x1800, 4 foto)
import { box, contentHeight, dropShadow, linear, radial, text, textMid, type Ctx } from '../paint'
import { bestie } from './define'
import { HAND, INK, photoInset, rotated, yearOf } from './helpers'

const FREDOKA = 'Fredoka'
const ACCENT = '#E2483C'
/** huruf magnet KITA (inline-block, flex gap 6px), rotate di titik tengah masing-masing */
const LETTERS = [
  { s: 'K', x: 110, w: 38, rot: -8, color: '#E2483C' },
  { s: 'I', x: 154, w: 15, rot: 6, color: '#2F6BFF' },
  { s: 'T', x: 175, w: 41, rot: -4, color: '#18A05A' },
  { s: 'A', x: 222, w: 46, rot: 8, color: '#E8A33C' },
]
/** kartu foto 354x302 (padding 12 12 40), rotate di tengah; slot = hasil ukur */
const CARDS = [
  { x: 90, y: 170, rot: -4, pin: '#E2483C', label: 'waktu itu', slot: { x: 101, y: 182 } },
  { x: 150, y: 540, rot: 3, pin: '#2F6BFF', label: 'lagi', slot: { x: 162.7, y: 552 } },
  { x: 80, y: 920, rot: -2, pin: '#18A05A', label: 'yang ini lucu', slot: { x: 91.5, y: 932 } },
  { x: 160, y: 1290, rot: 4, pin: '#E8A33C', label: 'pas hujan', slot: { x: 173, y: 1302 } },
]
type Card = (typeof CARDS)[number]
const inCard = (ctx: Ctx, c: Card, draw: () => void) => rotated(ctx, c.x + 177, c.y + 151, c.rot, draw)

/** magnet bulat: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8), C 45%) + bayangan */
function magnet(ctx: Ctx, x: number, y: number, d: number, color: string) {
  dropShadow(ctx, x, y, d, d, 0, 4, 6, 'rgba(0,0,0,0.3)', d / 2)
  const cx = x + d * 0.35
  const cy = y + d * 0.3
  box(ctx, x, y, d, d, radial(ctx, cx, cy, Math.hypot(d * 0.65, d * 0.7), [[0, 'rgba(255,255,255,0.8)'], [0.45, color], [1, color]]), d / 2)
}

export const pintuKulkas = bestie({
  id: 'bestie-pintu-kulkas',
  name: 'pintu kulkas',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'linear', angle: 90, stops: [[0, '#e9eef0'], [0.3, '#ffffff'], [0.7, '#f2f5f6'], [1, '#dfe5e8']] },
  placeholder: '#ECE8E1',
  fonts: ['DM Serif Display', 'Space Mono:400,700', 'Caveat:700', 'Fredoka:700'],
  fields: ['nama', 'nama2', 'tanggal'],
  slots: CARDS.map((c) => ({ x: c.slot.x, y: c.slot.y, w: 330, h: 250, rotate: c.rot })),
  draw: {
    under(ctx) {
      // karet pintu kiri + gagang
      box(ctx, 24, 0, 18, 1800, linear(ctx, 24, 0, 18, 1800, 90, [[0, '#cfd6da'], [0.5, '#f4f6f7'], [1, '#b9c2c7']]), [0, 0, 9, 9])
      dropShadow(ctx, 520, 120, 30, 520, 0, 6, 10, 'rgba(0,0,0,0.15)', 15)
      box(ctx, 520, 120, 30, 520, linear(ctx, 520, 120, 30, 520, 90, [[0, '#b9c2c7'], [0.5, '#f4f6f7'], [1, '#b9c2c7']]), 15)

      // huruf magnet (text-shadow 0 4px 0 rgba(0,0,0,0.2)); Fredoka hanya dimuat 700
      for (const l of LETTERS)
        rotated(ctx, l.x + l.w / 2, 88.5, l.rot, () => {
          const o = { family: FREDOKA, size: 64, weight: 700, align: 'center' as const }
          text(ctx, l.s, l.x + l.w / 2, 54, { ...o, color: 'rgba(0,0,0,0.2)' })
          text(ctx, l.s, l.x + l.w / 2, 50, { ...o, color: l.color })
        })

      for (const c of CARDS)
        inCard(ctx, c, () => {
          dropShadow(ctx, c.x, c.y, 354, 302, 0, 6, 12, 'rgba(0,0,0,0.15)')
          box(ctx, c.x, c.y, 354, 302, '#ffffff')
        })
    },
    over(ctx, { texts }) {
      for (const c of CARDS)
        inCard(ctx, c, () => {
          photoInset(ctx, c.x + 12, c.y + 12, 330, 250)
          text(ctx, c.label, c.x + 14, c.y + 302 - 6 - contentHeight(ctx, HAND, 24, 700), { family: HAND, size: 24, weight: 700, color: INK })
          magnet(ctx, c.x + 143, c.y - 18, 44, c.pin)
        })

      // catatan tempel (z-index 2) + magnet ungu
      rotated(ctx, 492, 945, 6, () => {
        dropShadow(ctx, 412, 870, 160, 150, 0, 4, 8, 'rgba(0,0,0,0.15)')
        box(ctx, 412, 870, 160, 150, '#FFE873')
        const lh = 28 * 1.05
        const top = (lh - contentHeight(ctx, HAND, 28, 700)) / 2
        const o = { family: HAND, size: 28, weight: 700, color: INK }
        text(ctx, 'jangan lupa', 428, 886 + top, o)
        text(ctx, 'sabtu ini', 428, 886 + lh + top, o)
      })
      magnet(ctx, 474, 858, 36, '#7A5CFF')

      const names = [texts.nama?.trim(), texts.nama2?.trim()].filter(Boolean).join(' & ')
      const line = [names, yearOf(texts.tanggal)].filter(Boolean).join(' · ')
      text(ctx, line, 70, 1700, { family: HAND, size: 30, weight: 700, color: INK, maxWidth: 470 })

      // pil "♥ rumah"
      dropShadow(ctx, 400, 1600, 150, 70, 0, 4, 8, 'rgba(0,0,0,0.15)', 35)
      box(ctx, 400, 1600, 150, 70, '#ffffff', 35)
      textMid(ctx, '♥ rumah', 475, 1600, 70, { family: FREDOKA, size: 22, weight: 700, color: ACCENT, align: 'center' })
    },
  },
})
