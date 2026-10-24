// Pilih Karakter — design-reference/gaming-pixel/pilih-karakter.html (600x1800, 3 foto)
import { box, text } from '../paint'
import { PIXEL, PIXEL_MONO, SILK, SILK_MONO, crt, dashedRect, join, pixelFrame, playerName, slotInset } from './helpers'
import { gaming } from './define'

const WHITE = '#ffffff'
const YELLOW = '#FFD23F'
const STAT_COLORS = ['#FF4F6B', '#3F9BFF', YELLOW]
const STAT_LABELS = ['KEKUATAN', 'KECEPATAN', 'GAYA']
const CARDS: { y: number; h: number; stats: number[] }[] = [
  { y: 150.8, h: 457, stats: [0.9, 0.6, 0.8] },
  { y: 635.8, h: 452, stats: [0.7, 0.85, 0.65] },
  { y: 1115.8, h: 452, stats: [0.6, 0.7, 0.95] },
]

export const pilihKarakter = gaming({
  id: 'gaming-pilih-karakter',
  name: 'pilih karakter',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#12122A' },
  placeholder: '#242440',
  fonts: ['Press Start 2P', 'Silkscreen'],
  fields: ['nama', 'nama2', 'tanggal'],
  slots: CARDS.map(({ y }) => ({ x: 64, y: y + 14, w: 472, h: 300 })),
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'PILIH', 50, 54, { family: PIXEL, size: 28, color: WHITE })
      text(ctx, 'KARAKTER', 50, 90.4, { family: PIXEL, size: 28, color: WHITE })
      text(ctx, 'P1', 550, 98.8, { family: SILK, size: 18, color: YELLOW, align: 'right' })

      // [NAMA 1] = nama, [NAMA 2] = nama2, [NAMA 3] tanpa field: pemain tamu
      const names = [playerName(texts.nama, 1), playerName(texts.nama2, 2), 'PEMAIN 3']
      CARDS.forEach((c, i) => {
        const active = i === 0
        pixelFrame(ctx, 50, c.y, 500, c.h, 5, active ? YELLOW : '#4a4a70')
        box(ctx, 50, c.y, 500, c.h, active ? '#2a2a55' : '#1c1c30')
        // baris nama kartu aktif 21px (glyph ✓ cadangan lebih tinggi): baris berikutnya turun 5px
        const off = active ? 5 : 0
        text(ctx, names[i].toUpperCase(), 64, c.y + 326 + off / 2, { family: PIXEL, size: 16, color: WHITE, maxWidth: active ? 400 : 472 })
        if (active) text(ctx, 'P1 ✓', 536, c.y + 327, { family: PIXEL_MONO, size: 16, color: YELLOW, align: 'right' })
        STAT_LABELS.forEach((label, j) => {
          const ry = c.y + 354 + off + j * 32
          // label lebih lebar dari kolom 70px: ujungnya tertutup bar, sama seperti desain
          text(ctx, label, 64, ry, { family: SILK, size: 16, color: WHITE })
          box(ctx, 144, ry + 4, 392, 12, '#2e2e48')
          box(ctx, 144, ry + 4, 392 * c.stats[j], 12, STAT_COLORS[j])
        })
      })
      // outline: 5px dashed, offset 12px di sekeliling kartu aktif
      dashedRect(ctx, 33, 133.8, 534, 491, 5, '#FF4F6B')
      text(ctx, '▶', 20, 292.8, { family: PIXEL_MONO, size: 26, color: YELLOW })

      text(ctx, '▶ TEKAN A UNTUK KONFIRMASI', 50, 1712, { family: SILK_MONO, size: 16, color: YELLOW })
      text(ctx, join([texts.tanggal, 'RONDE 1']), 50, 1740, { family: SILK, size: 16, color: WHITE, maxWidth: 500 })
    },
    over(ctx) {
      for (const c of CARDS) slotInset(ctx, 64, c.y + 14, 472, 300)
    },
    top(ctx, { W, H }) {
      crt(ctx, W, H)
    },
  },
})
