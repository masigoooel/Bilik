// VS — design-reference/gaming-pixel/vs.html (1080x1350, 2 foto)
import { box, linear, text } from '../paint'
import { FONTS, PIXEL, crt, join, pixelFrame, playerName, slotInset, spread } from './helpers'
import { gaming } from './define'

const WHITE = '#ffffff'
const YELLOW = '#FFD23F'
const RED = '#D93F3F'
const BLUE = '#3F6BD9'

export const vs = gaming({
  id: 'gaming-vs',
  name: 'vs',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: RED },
  placeholder: '#F2E3E3',
  fonts: FONTS,
  fields: ['nama', 'nama2', 'tanggal'],
  slots: [
    { x: 60, y: 140, w: 440, h: 900 },
    { x: 580, y: 140, w: 440, h: 900 },
  ],
  draw: {
    under(ctx, { texts, W, H }) {
      // linear-gradient(105deg, merah 0 50%, biru 50% 100%)
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 105, [[0, RED], [0.5, RED], [0.5, BLUE], [1, BLUE]]))

      text(ctx, 'P1', 60, 60, { family: PIXEL, size: 36, color: WHITE })
      text(ctx, 'P2', 1020, 60, { family: PIXEL, size: 36, color: WHITE, align: 'right' })
      pixelFrame(ctx, 60, 140, 440, 900, 6, WHITE)
      pixelFrame(ctx, 580, 140, 440, 900, 6, WHITE)

      const o = { family: PIXEL, size: 22, color: WHITE, maxWidth: 440 }
      text(ctx, playerName(texts.nama, 1).toUpperCase(), 60, 1120, o)
      text(ctx, playerName(texts.nama2, 2).toUpperCase(), 1020, 1120, { ...o, align: 'right' })
      text(ctx, join(['RONDE 1', texts.tanggal]), 540, 1220, { family: PIXEL, size: 18, color: WHITE, align: 'center', maxWidth: 960 })

      // bar darah penuh + timer
      for (const x of [150, 600]) {
        spread(ctx, x, 66, 330, 26, 4, WHITE)
        box(ctx, x, 66, 330, 26, YELLOW)
      }
      spread(ctx, 500, 16, 80, 66, 4, WHITE)
      box(ctx, 500, 16, 80, 66, '#111111')
      text(ctx, '99', 512, 35, { family: PIXEL, size: 28, color: WHITE })
      text(ctx, 'RONDE 1', 540, 92, { family: PIXEL, size: 11, color: WHITE, align: 'center' })
    },
    over(ctx) {
      slotInset(ctx, 60, 140, 440, 900)
      slotInset(ctx, 580, 140, 440, 900)
      // kotak VS di tengah, menimpa kedua foto
      pixelFrame(ctx, 440, 520, 200, 200, 8, YELLOW)
      box(ctx, 440, 520, 200, 200, '#111111')
      text(ctx, 'VS', 476, 588, { family: PIXEL, size: 64, color: YELLOW })
    },
    top(ctx, { W, H }) {
      crt(ctx, W, H)
    },
  },
})
