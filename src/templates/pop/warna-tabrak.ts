// Warna Tabrak — design-reference/bold-pop/warna-tabrak.html (600x1800, 4 foto)
import { border, box, text } from '../paint'
import { BANGERS, FONTS, INK, MONO, TEXTURE, detailDots, ellipseBox, photoInset } from './helpers'
import { pop } from './define'

/** blok warna di belakang tiap foto, bergeser 28px ke kiri/kanan dan 28px ke bawah */
const PANELS = [
  { color: '#FF3B30', dx: -28 },
  { color: '#3F7BFF', dx: 28 },
  { color: '#FFD600', dx: -28 },
  { color: '#18C27A', dx: 28 },
].map((p, i) => ({ ...p, y: 164 + i * 354 }))

const SLOTS = PANELS.map((p) => ({ x: 65, y: p.y + 5, w: 470, h: 300 }))

export const warnaTabrak = pop({
  id: 'pop-warna-tabrak',
  name: 'warna tabrak',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#FF8FD1' },
  placeholder: '#F0EEE8',
  fonts: FONTS,
  fields: ['tanggal'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'TABRAK', 300, 58, { family: BANGERS, size: 60, color: INK, align: 'center' })
      for (const p of PANELS) {
        box(ctx, 60 + p.dx, p.y + 28, 480, 310, p.color)
        border(ctx, 60 + p.dx, p.y + 28, 480, 310, 5, INK)
        border(ctx, 60, p.y, 480, 310, 5, INK)
      }
      text(ctx, texts.tanggal?.trim() ?? '', 300, 1724, { family: MONO, size: 18, weight: 700, color: INK, align: 'center', maxWidth: 480 })
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s)
      // bulatan kuning menimpa tepi kiri foto pertama
      ellipseBox(ctx, 14, 300, 68, 68, '#FFD600', 6, INK)
    },
    top(ctx, { W, H }) {
      detailDots(ctx, W, H)
    },
  },
})
