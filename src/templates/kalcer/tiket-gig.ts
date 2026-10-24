// Tiket Gig — design-reference/kalcer/tiket-gig.html (1080x1350, 1 foto)
import { border, box, text } from '../paint'
import { ANTON, MONO, TEXTURE, dashedH, disc, ring, rotated } from './helpers'
import { kalcer } from './define'

const INK = '#1c1b19'
const PAPER = '#F1E9D2'
const ACCENT = '#C8F03C'
const RED = '#C0311F'
const BARS = [3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 2, 1, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 1, 4, 2, 1, 3, 2, 1, 1, 4, 1, 2, 3, 1, 2, 1, 4, 1, 3]

export const tiketGig = kalcer({
  id: 'kalcer-tiket-gig',
  name: 'tiket gig',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: INK },
  placeholder: '#d8d0b8',
  fonts: ['Anton', 'Space Mono:400,700'],
  fields: ['tempat', 'tanggal'],
  texture: TEXTURE,
  slots: [{ x: 100, y: 238.8, w: 880, h: 640 }],
  draw: {
    under(ctx, { texts }) {
      box(ctx, 60, 60, 960, 1230, PAPER, 18)
      text(ctx, 'ADMIT ONE', 100, 104, { family: MONO, size: 18, weight: 700, color: INK, letterSpacing: 5.4 })
      text(ctx, 'LIVE SESSION', 100, 106, { family: ANTON, size: 92, color: INK })
      // stiker "SOLD OUT" miring 4°: kotak 120x46, pusat (919.95, 193.85)
      rotated(ctx, 919.95, 193.85, 4, () => {
        box(ctx, 859.95, 170.85, 120, 46, ACCENT)
        text(ctx, 'SOLD OUT', 875.95, 180.85, { family: MONO, size: 18, weight: 700, color: INK })
      })

      // info: venue · tanggal · pintu buka (kolom kosong disembunyikan)
      box(ctx, 100, 900.8, 880, 3, INK)
      const label = { family: MONO, size: 14, color: INK }
      const value = { family: MONO, size: 22, weight: 700, color: INK, maxWidth: 280 }
      // kolom yang terisi mengisi grid 3 kolom dari kiri (x 100 / 400 / 700)
      const cols: [string, string | undefined][] = [
        ['VENUE', texts.tempat?.trim()],
        ['TANGGAL', texts.tanggal?.trim()],
        ['PINTU BUKA', '20:00 WIB'],
      ]
      cols
        .filter(([, v]) => v)
        .forEach(([k, v], i) => {
          text(ctx, k, 100 + i * 300, 919.8, label)
          text(ctx, v!, 100 + i * 300, 944.8, value)
        })

      // sobekan: garis putus-putus + lubang setengah lingkaran
      dashedH(ctx, 60, 1008, 960, 4, INK, [8, 4])
      disc(ctx, 34, 978, 52, INK)
      disc(ctx, 994, 978, 52, INK)

      // barcode
      let bx = 100
      BARS.forEach((w, i) => {
        box(ctx, bx, 1090.9, w * 3, 110, INK)
        bx += w * 3 + (i % 3 === 0 ? 4 : 1) + 4
      })
      text(ctx, 'NO. SERI', 980, 1089.4, { family: MONO, size: 16, color: INK, align: 'right' })
      text(ctx, '#0017', 980, 1105.4, { family: ANTON, size: 56, color: INK, align: 'right' })
      text(ctx, 'standing area', 980, 1181.4, { family: MONO, size: 14, color: INK, align: 'right' })
      disc(ctx, 520, 1190, 36, INK)
    },
    over(ctx, { texts }) {
      border(ctx, 100, 238.8, 880, 640, 4, INK)
      // stempel "MASUK" + tanggal, miring -14°, opacity 0.85
      const tanggal = texts.tanggal?.trim()
      ctx.save()
      ctx.globalAlpha = 0.85
      rotated(ctx, 670, 1110, -14, () => {
        ring(ctx, 600, 1040, 140, 5, RED)
        // isi flex kolom di tengah: baris 28px (Anton) + 14px (Space Mono), line-height 1
        const top = tanggal ? 1089 : 1096
        text(ctx, 'MASUK', 670, top - 7, { family: ANTON, size: 28, color: RED, align: 'center' })
        if (tanggal) text(ctx, tanggal, 670, 1113.5, { family: MONO, size: 14, weight: 700, color: RED, align: 'center', maxWidth: 120 })
      })
      ctx.restore()
    },
  },
})
