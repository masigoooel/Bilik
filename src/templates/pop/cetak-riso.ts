// Cetak Riso — design-reference/bold-pop/cetak-riso.html (1080x1350, 1 foto)
import { contentHeight, measure, text } from '../paint'
import { ARCHIVO, MONO, blendLayer, detailDots, dots, photoInset } from './helpers'
import { pop } from './define'

const PAPER = '#F4F0E6'
const PINK = '#FF48B0'
const BLUE = '#0078BF'
/** kotak FOTO 860x860 di (110,160) digeser translate(-10px,-8px) */
const SLOT = { x: 100, y: 152, w: 860, h: 860 }

export const cetakRiso = pop({
  id: 'pop-cetak-riso',
  name: 'cetak riso',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: PAPER },
  // rata-rata titik pink 55% (multiply) di atas kertas
  placeholder: '#F4D5DB',
  fonts: ['Archivo Black', 'Space Mono:400,700'],
  fields: ['nama', 'tanggal'],
  slots: [SLOT],
  draw: {
    under(ctx, { texts, W, H }) {
      // butir kertas: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1.5px) 0 0 / 4px 4px
      dots(ctx, 0, 0, W, H, 4, [0, 0, 0], 0.06, 1, 1.5)
      const o = { family: MONO, size: 16, weight: 700, color: BLUE }
      text(ctx, 'CETAK RISO · 2 WARNA', 70, 70, o)
      text(ctx, '1/50', 1010, 70, { ...o, align: 'right' })

      // [NAMA]: pink multiply + text-shadow biru 70% (8px 6px), dibaurkan sebagai satu grup
      const nama = texts.nama?.trim() ?? ''
      if (nama) {
        // nama panjang dikecilkan sampai muat kolom kiri; baris (line-height 0.85) tetap rata bawah di y 1162
        const size = Math.min(120, (120 * 660) / Math.max(1, measure(ctx, nama, { family: ARCHIVO, size: 120 })))
        const top = (sz: number) => -(0.85 * sz + contentHeight(ctx, ARCHIVO, sz)) / 2
        const y = 1030 + top(size) - top(120)
        const n = { family: ARCHIVO, size }
        blendLayer(ctx, 'multiply', (l) => {
          text(l, nama, 78, y + 6, { ...n, color: 'rgba(0,120,191,0.7)' })
          text(l, nama, 70, y, { ...n, color: PINK })
        })
      }
      // keterangan kanan bawah (rata kanan & rata bawah): tanpa tanggal, baris pertama turun
      const tanggal = texts.tanggal?.trim() ?? ''
      const m = { family: MONO, size: 16, color: BLUE, align: 'right' as const }
      text(ctx, 'pink fluoro + biru medium', 1010, tanggal ? 1114 : 1138, m)
      if (tanggal) text(ctx, tanggal, 1010, 1138, { ...m, maxWidth: 300 })
    },
    over(ctx) {
      photoInset(ctx, SLOT)
      // lapisan biru (titik 50%, multiply) bergeser translate(10px,8px), menimpa foto
      ctx.save()
      ctx.globalCompositeOperation = 'multiply'
      dots(ctx, 120, 168, 860, 860, 9, [0, 120, 191], 0.5, 2.4, 3, 4, 4)
      ctx.restore()
    },
    top(ctx, { W, H }) {
      detailDots(ctx, W, H)
    },
  },
})
