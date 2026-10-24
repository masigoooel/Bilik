// Arcade — design-reference/gaming-pixel/arcade.html (600x1800, 4 foto)
import { box, text } from '../paint'
import { FONTS, PIXEL, crt, disc, pixelFrame, slotInset, spread } from './helpers'
import { gaming } from './define'

const BG = '#1A1030'
const PANEL = '#2a1e44'
/** warna aksen desain (prop c, default) */
const C = '#3FF2FF'
const YELLOW = '#FFD23F'
const ROWS = [138, 490, 842, 1194]

export const arcade = gaming({
  id: 'gaming-arcade',
  name: 'arcade',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: BG },
  placeholder: '#2A1E44',
  fonts: FONTS,
  fields: [],
  slots: ROWS.map((y) => ({ x: 50, y: y + 26, w: 500, h: 290 })),
  draw: {
    under(ctx) {
      text(ctx, 'HI 017000', 190, 20, { family: PIXEL, size: 12, color: YELLOW })
      text(ctx, 'ARCADE', 210, 66, { family: PIXEL, size: 30, color: '#ffffff' })
      ROWS.forEach((y, i) => {
        text(ctx, `${i + 1}UP`, 50, y, { family: PIXEL, size: 16, color: C })
        pixelFrame(ctx, 50, y + 26, 500, 290, 5, C)
      })

      // joystick
      spread(ctx, 80, 1610, 90, 30, 3, C, 15)
      box(ctx, 80, 1610, 90, 30, PANEL, 15)
      box(ctx, 116, 1560, 18, 60, '#cfd5dd')
      disc(ctx, 90, 1510, 70, '#FF3B5C')
      // tombol
      disc(ctx, 400, 1556, 70, '#1a8a9a')
      disc(ctx, 400, 1550, 70, C)
      disc(ctx, 480, 1531, 70, '#9a7a1a')
      disc(ctx, 480, 1525, 70, YELLOW)
      // lubang koin
      spread(ctx, 262, 1560, 56, 86, 3, C)
      box(ctx, 262, 1560, 56, 86, PANEL)
      spread(ctx, 286, 1578, 8, 34, 2, '#555555')
      box(ctx, 286, 1578, 8, 34, '#000000')
      text(ctx, 'KOIN', 274, 1620, { family: PIXEL, size: 8, color: C })

      text(ctx, 'TEKAN START', 201, 1708, { family: PIXEL, size: 18, color: YELLOW })
      text(ctx, 'KREDIT 04', 246, 1738, { family: PIXEL, size: 12, color: '#ffffff' })
    },
    over(ctx) {
      for (const y of ROWS) slotInset(ctx, 50, y + 26, 500, 290)
    },
    top(ctx, { W, H }) {
      crt(ctx, W, H)
    },
  },
})
