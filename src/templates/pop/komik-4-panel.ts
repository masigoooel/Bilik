// Komik 4 Panel — design-reference/bold-pop/komik-4-panel.html (1200x1800, 4 foto)
import { border, box, measure, text } from '../paint'
import { BANGERS, FONTS, INK, TEXTURE, detailDots, halftone, photoInset, speechBubble } from './helpers'
import { pop } from './define'

const PANEL_BG = '#FFE1EC'
/** panel 517x614 (border 7px) dalam grid 2 kolom, jarak 26px */
const PANELS = [0, 1, 2, 3].map((i) => ({ x: 70 + (i % 2) * 543, y: 216.5 + Math.floor(i / 2) * 640 }))
const SLOTS = PANELS.map((p) => ({ x: p.x + 7, y: p.y + 7, w: 503, h: 600 }))

export const komik4Panel = pop({
  id: 'pop-komik-4-panel',
  name: 'komik 4 panel',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#ffffff' },
  placeholder: PANEL_BG,
  fonts: FONTS,
  fields: ['catatan', 'tanggal'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'EPISODE 04', 70, 55, { family: BANGERS, size: 130, color: INK })
      text(ctx, texts.tanggal?.trim() ?? '', 1130, 155.5, { family: BANGERS, size: 24, color: INK, align: 'right', maxWidth: 480 })
      text(ctx, 'BERSAMBUNG', 70, 1688, { family: BANGERS, size: 40, color: INK })
    },
    over(ctx, { texts }) {
      for (const s of SLOTS) photoInset(ctx, s)
      // bingkai panel di atas foto: slot y .5 px, supaya tepi hitam tetap tajam
      for (const p of PANELS) border(ctx, p.x, p.y, 517, 614, 7, INK)
      // balon kata [TEKS] di kanan atas panel 2 (right/top 30px, padding 18px 26px); teks kosong = tanpa balon
      speechBubble(ctx, texts.catatan ?? '', 1093, 253.5, { align: 'right', size: 40, padX: 26, padY: 18, bw: 5, maxLineW: 300, maxLines: 3, minX: 640 })
      // raster titik di atas foto 3
      halftone(ctx, 77, 863, 503, 600, 18, 'rgba(0,0,0,0.16)', 3, 4)
      // kotak narasi "SUATU HARI..." (padding 10px 18px, border kanan & bawah 5px)
      const w = measure(ctx, 'SUATU HARI...', { family: BANGERS, size: 34 }) + 41
      box(ctx, 77, 223, w, 61, '#FFE45C')
      box(ctx, 77 + w - 5, 223, 5, 61, INK)
      box(ctx, 77, 279, w, 5, INK)
      text(ctx, 'SUATU HARI...', 95, 233, { family: BANGERS, size: 34, color: INK })
    },
    top(ctx, { W, H }) {
      detailDots(ctx, W, H)
    },
  },
})
