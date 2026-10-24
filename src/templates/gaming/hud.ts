// HUD — design-reference/gaming-pixel/hud.html (1200x1800, 4 foto)
import { box, text } from '../paint'
import { FONTS, PIXEL, PIXEL_MONO, crt, pixelFrame, slotInset, spread } from './helpers'
import { gaming } from './define'

const WHITE = '#ffffff'
/** warna aksen desain (prop c, default) */
const C = '#FF4F6B'
const PANELS: { x: number; y: number; hp: number; label: string }[] = [
  { x: 80, y: 159, hp: 0.9, label: 'P1' },
  { x: 620, y: 159, hp: 0.7, label: 'P2' },
  { x: 80, y: 799, hp: 0.55, label: 'P3' },
  { x: 620, y: 799, hp: 1, label: 'P4' },
]

export const hud = gaming({
  id: 'gaming-hud',
  name: 'hud',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#0E0E1A' },
  placeholder: '#22223A',
  fonts: FONTS,
  fields: ['tanggal'],
  slots: PANELS.map(({ x, y }) => ({ x, y, w: 500, h: 600 })),
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'SKOR 001700 · KOIN 17', 80, 80, { family: PIXEL, size: 28, color: WHITE })
      text(ctx, '♥♥♥', 1120, 80, { family: PIXEL_MONO, size: 28, color: C, align: 'right' })
      for (const p of PANELS) pixelFrame(ctx, p.x, p.y, 500, 600, 5, WHITE)
      text(ctx, 'STAGE 4', 80, 1702, { family: PIXEL, size: 18, color: WHITE })
      text(ctx, texts.tanggal?.trim() ?? '', 1120, 1702, { family: PIXEL, size: 18, color: WHITE, align: 'right', maxWidth: 800 })
    },
    over(ctx) {
      // bar darah + label pemain di atas foto
      for (const p of PANELS) {
        slotInset(ctx, p.x, p.y, 500, 600)
        const bx = p.x + 20
        const by = p.y + 20
        pixelFrame(ctx, bx, by, 200, 18, 3, WHITE)
        box(ctx, bx, by, 200, 18, '#2e2e48')
        box(ctx, bx, by, 200 * p.hp, 18, '#3FD97A')
        text(ctx, p.label, p.x + 480, p.y + 568, { family: PIXEL, size: 16, color: WHITE, align: 'right' })
      }
      // peta mini (z-index 5) menimpa foto 2
      const mx = 1000
      const my = 172
      spread(ctx, mx, my, 130, 104, 4, WHITE)
      // latar tembus pandang (foto tetap terlihat) + kisi 20px garis 2px
      box(ctx, mx, my, 130, 104, 'rgba(255,255,255,0.06)')
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      for (let gy = 0; gy < 104; gy += 20) ctx.fillRect(mx, my + gy, 130, 2)
      for (let gx = 0; gx < 130; gx += 20) ctx.fillRect(mx + gx, my, 2, 104)
      box(ctx, mx + 70, my + 56, 14, 14, C)
      box(ctx, mx + 30, my + 24, 10, 10, '#FFD23F')
    },
    top(ctx, { W, H }) {
      crt(ctx, W, H)
    },
  },
})
