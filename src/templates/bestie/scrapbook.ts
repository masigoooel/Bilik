// Scrapbook — design-reference/bestie-couple/scrapbook.html (1200x1800, 6 foto)
import { box, dropShadow, svg, text } from '../paint'
import { bestie } from './define'
import { FONTS, HAND, INK, MONO, photoInset, rotated } from './helpers'

/** kartu foto 500x396 (padding 12 12 44) di grid 2 kolom; rotasi kartu & selotip dari desain */
const CARDS = [
  { x: 80, y: 212, rot: -2, tape: 2, slot: { x: 91.4, y: 224 } },
  { x: 620, y: 212, rot: 1.5, tape: -1, slot: { x: 632.4, y: 224 } },
  { x: 80, y: 652, rot: 1, tape: -1.5, slot: { x: 92.3, y: 664 } },
  { x: 620, y: 652, rot: -1.5, tape: 1, slot: { x: 631.6, y: 664 } },
  { x: 80, y: 1092, rot: -1, tape: 1.5, slot: { x: 91.7, y: 1104 } },
  { x: 620, y: 1092, rot: 2, tape: -2, slot: { x: 632.6, y: 1104 } },
]

const inCard = (ctx: CanvasRenderingContext2D, c: (typeof CARDS)[number], draw: () => void) => rotated(ctx, c.x + 250, c.y + 198, c.rot, draw)

export const scrapbook = bestie({
  id: 'bestie-scrapbook',
  name: 'scrapbook',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#C8A57E' },
  placeholder: '#ECE8E1',
  fonts: FONTS,
  fields: ['nama', 'nama2', 'tanggal'],
  texture: { opacity: 0.09, blend: 'multiply' },
  slots: CARDS.map((c) => ({ x: c.slot.x, y: c.slot.y, w: 476, h: 340, rotate: c.rot })),
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'scrapbook', 80, 54, { family: HAND, size: 110, color: INK })
      const names = [texts.nama?.trim(), texts.nama2?.trim()].filter(Boolean).join(' · ')
      text(ctx, names, 1120, 139, { family: MONO, size: 20, color: INK, align: 'right', maxWidth: 620 })

      for (const c of CARDS)
        inCard(ctx, c, () => {
          dropShadow(ctx, c.x, c.y, 500, 396, 0, 4, 10, 'rgba(0,0,0,0.15)')
          box(ctx, c.x, c.y, 500, 396, '#ffffff')
        })

      text(ctx, texts.tanggal?.trim() ?? '', 80, 1694, { family: MONO, size: 18, color: INK, maxWidth: 1040 })
    },
    over(ctx) {
      CARDS.forEach((c, i) =>
        inCard(ctx, c, () => {
          photoInset(ctx, c.x + 12, c.y + 12, 476, 340)
          // selotip di tepi atas kartu + nomor foto di kiri bawah
          rotated(ctx, c.x + 230, c.y + 2, c.tape, () => box(ctx, c.x + 160, c.y - 16, 140, 36, 'rgba(232,220,170,0.8)'))
          text(ctx, String(i + 1).padStart(2, '0'), c.x + 16, c.y + 355, { family: HAND, size: 28, color: INK })
        }),
      )
      // penjepit kertas, panah coretan, tulisan "favorit"
      svg(ctx, 'M6 40 V10 a4 4 0 0 1 8 0 V45 a7 7 0 0 1 -14 0 V14', 1030, 205, 40, 110, 20, 55, { stroke: '#8a9098', lineWidth: 2.5, lineCap: 'round', rotate: 18 })
      svg(ctx, 'M10 20 C 60 0, 120 30, 120 80 M100 62 L120 84 L138 60', 500, 700, 160, 110, 160, 110, { stroke: INK, lineWidth: 4, lineCap: 'round', lineJoin: 'round' })
      rotated(ctx, 520.5, 677.5, -6, () => text(ctx, 'favorit', 470, 650, { family: HAND, size: 44, color: INK }))
    },
  },
})
