// Kartu Karakter — design-reference/gaming-pixel/kartu-karakter.html (1080x1350, 1 foto)
import { box, text } from '../paint'
import { FONTS, PIXEL, PIXEL_MONO, SILK, crt, pixelFrame, playerName, slotInset } from './helpers'
import { gaming } from './define'

const WHITE = '#ffffff'
const YELLOW = '#FFD23F'
const BAR = '#2e2e48'
/** [KELAS] / [ELEMEN] / [SKILL] tidak punya field: teks tetap yang kalem */
const KELAS = 'petualang'
const ELEMEN = 'cahaya'
const SKILLS: [string, string][] = [
  ['#FF4F6B', 'senyum'],
  ['#3F9BFF', 'pose'],
  ['#3FD97A', 'kompak'],
]
const STATS: [string, number, string][] = [
  ['HP', 676, '#3FD97A'],
  ['MP', 487.3, '#3F9BFF'],
  ['XP', 314.4, YELLOW],
]

export const kartuKarakter = gaming({
  id: 'gaming-kartu-karakter',
  name: 'kartu karakter',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#5B3FD9' },
  placeholder: '#2A2A44',
  fonts: FONTS,
  fields: ['nama'],
  slots: [{ x: 110, y: 170, w: 860, h: 690 }],
  draw: {
    under(ctx, { texts }) {
      pixelFrame(ctx, 70, 70, 940, 1210, 8, WHITE)
      box(ctx, 70, 70, 940, 1210, '#1B1B2F')

      text(ctx, playerName(texts.nama, 1).toUpperCase(), 110, 110, { family: PIXEL, size: 34, color: WHITE, maxWidth: 720 })
      text(ctx, 'LV 17', 970, 116, { family: PIXEL, size: 22, color: YELLOW, align: 'right' })

      text(ctx, `kelas: ${KELAS} · elemen: ${ELEMEN}`, 110, 886, { family: SILK, size: 26, color: WHITE, maxWidth: 860 })
      text(ctx, '★★★★☆ LANGKA', 110, 936, { family: PIXEL_MONO, size: 22, color: YELLOW })

      STATS.forEach(([label, w, color], i) => {
        const y = 990 + i * 48
        text(ctx, label, 110, y + 3, { family: PIXEL, size: 16, color: WHITE })
        pixelFrame(ctx, 184, y, 786, 22, 3, WHITE)
        box(ctx, 184, y, 786, 22, BAR)
        box(ctx, 184, y, w, 22, color)
      })

      SKILLS.forEach(([color, label], i) => {
        const x = 110 + i * 292.65
        pixelFrame(ctx, x, 1134, 274.7, 44, 3, WHITE)
        box(ctx, x, 1134, 274.7, 44, BAR)
        box(ctx, x + 10, 1144, 24, 24, color)
        text(ctx, label, x + 46, 1146, { family: SILK, size: 16, color: WHITE, maxWidth: 218 })
      })
    },
    over(ctx) {
      slotInset(ctx, 110, 170, 860, 690)
    },
    top(ctx, { W, H }) {
      crt(ctx, W, H)
    },
  },
})
