// Komik 2 Panel — design-reference/bold-pop/komik-2-panel.html (1080x1350, 2 foto)
import { border, box, measure, svg, text, type Ctx } from '../paint'
import { BANGERS, FONTS, INK, TEXTURE, detailDots, photoInset, rotated, speechBubble } from './helpers'
import { pop } from './define'

const PANEL_BG = '#D9EEFF'
/** panel kedua: rotate(-2.5deg) di titik tengahnya */
const TILT = -2.5
const P2 = { x: 60, y: 644, cx: 540, cy: 921 }
const SLOTS = [
  { x: 67, y: 67, w: 946, h: 540 },
  { x: 67, y: 651, w: 946, h: 540, rotate: TILT },
]

/** label kuning kotak narasi di pojok kiri atas panel (padding 10px 18px, border kanan & bawah 5px) */
function caption(ctx: Ctx, s: string, x: number, y: number) {
  const w = measure(ctx, s, { family: BANGERS, size: 34 }) + 41
  box(ctx, x, y, w, 61, '#FFE45C')
  box(ctx, x + w - 5, y, 5, 61, INK)
  box(ctx, x, y + 56, w, 5, INK)
  text(ctx, s, x + 18, y + 10, { family: BANGERS, size: 34, color: INK })
}

export const komik2Panel = pop({
  id: 'pop-komik-2-panel',
  name: 'komik 2 panel',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: '#ffffff' },
  placeholder: PANEL_BG,
  fonts: FONTS,
  fields: ['catatan', 'tanggal'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      border(ctx, 60, 60, 960, 554, 7, INK)
      rotated(ctx, P2.cx, P2.cy, TILT, () => border(ctx, P2.x, P2.y, 960, 554, 7, INK))
      const o = { family: BANGERS, size: 40, color: INK }
      text(ctx, 'BAB 01', 60, 1248, o)
      text(ctx, texts.tanggal?.trim() ?? '', 1020, 1248, { ...o, align: 'right', maxWidth: 600 })
    },
    over(ctx, { texts }) {
      photoInset(ctx, SLOTS[0])
      rotated(ctx, P2.cx, P2.cy, TILT, () => photoInset(ctx, { ...SLOTS[1], rotate: 0 }))
      caption(ctx, 'SEBELUMNYA...', 67, 67)
      rotated(ctx, P2.cx, P2.cy, TILT, () => caption(ctx, 'LALU...', 67, 651))
      // balon kata [TEKS] (padding 18px 28px, border 5px, elips) + ekor segitiga rotate 20deg; teks kosong = tanpa balon
      const b = speechBubble(ctx, texts.catatan ?? '', 690, 700, { align: 'left', size: 40, padX: 28, padY: 18, bw: 5, maxLineW: 250, maxLines: 3, maxX: 1000 })
      if (b) {
        // ekor menempel di tepi bawah elips, posisi relatif sama seperti desain (sedikit kanan dari tengah)
        const rx = b.w / 2
        const ry = b.h / 2
        const k = 10.25 / 77.75
        const tx = b.x + rx + k * rx - 18
        const ty = b.y + ry + ry * Math.sqrt(1 - k * k) - 3.6
        rotated(ctx, tx + 18, ty + 20, 20, () => {
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(tx + 36, ty)
          ctx.lineTo(tx + 18, ty + 40)
          ctx.closePath()
          ctx.fillStyle = INK
          ctx.fill()
        })
      }
    },
    top(ctx, { W, H }) {
      // garis gerak (svg setelah lapisan noise)
      svg(ctx, 'M10 20 L80 30 M6 50 L90 52 M10 80 L80 74', 40, 640, 120, 120, 120, 120, { stroke: INK, lineWidth: 5, lineCap: 'round' })
      detailDots(ctx, W, H)
    },
  },
})
