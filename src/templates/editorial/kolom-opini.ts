// Kolom Opini — design-reference/editorial-majalah/kolom-opini.html (1080x1350, 1 foto)
import { box, type Ctx } from '../paint'
import { editorial } from './define'
import { bars, FONTS, fotoInset, INK, lines, MONO, SERIF, spaceBetween, TEXTURE, txt, wrap } from './helpers'

const BAR = '#C9C5BC'
const PCTS = [100, 96, 100, 88, 100, 72, 94, 100, 80]
/** grid 3 kolom (gap 30) di lebar 940 */
const CW = (940 - 60) / 3

/** radial-gradient(rgba(0,0,0,0.18) 1.1px, transparent 1.6px) 0 0 / 5px 5px */
function halftone(ctx: Ctx, x: number, y: number, w: number, h: number) {
  const tile = document.createElement('canvas')
  tile.width = tile.height = 5
  const t = tile.getContext('2d')!
  const r = Math.hypot(2.5, 2.5)
  const g = t.createRadialGradient(2.5, 2.5, 0, 2.5, 2.5, r)
  g.addColorStop(0, 'rgba(0,0,0,0.18)')
  g.addColorStop(1.1 / r, 'rgba(0,0,0,0.18)')
  g.addColorStop(1.6 / r, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  t.fillStyle = g
  t.fillRect(0, 0, 5, 5)
  const p = ctx.createPattern(tile, 'repeat')!
  p.setTransform(new DOMMatrix().translate(x, y))
  ctx.save()
  ctx.globalAlpha = 0.6
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = p
  ctx.fillRect(x, y, w, h)
  ctx.restore()
}

export const kolomOpini = editorial({
  id: 'editorial-kolom-opini',
  name: 'kolom opini',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#F5F2EC' },
  // #DDD9D0 setelah grayscale(1) di desain
  placeholder: '#D9D9D9',
  // kotak FOTO di desain memakai filter: grayscale(1)
  filter: 'mono',
  fonts: FONTS,
  // kutipan = catatan, penulis tamu = nama, tanggal = tanggal
  fields: ['catatan', 'nama', 'tanggal'],
  texture: TEXTURE,
  slots: [{ x: 70, y: 126, w: 380, h: 470 }],
  draw: {
    under(ctx, { texts }) {
      const mono = { family: MONO, color: INK }
      spaceBetween(ctx, ['OPINI', 'ARSIP · HAL. 07'], 70, 940, 70, { ...mono, size: 13, ls: 3.25 })
      box(ctx, 70, 99, 940, 1, INK)

      // kolom kiri: nama + peran di bawah foto
      const nama = texts.nama?.trim()
      if (nama) txt(ctx, nama, 70, 606, { family: SERIF, size: 26, italic: true, color: INK, maxWidth: 380 })
      txt(ctx, 'penulis tamu', 70, nama ? 655 : 606, { ...mono, size: 12 })

      // kolom kanan: kutipan (maks. 4 baris) lalu garis paragraf
      const kutipan = texts.catatan?.trim()
      let y = 126
      if (kutipan) {
        const q = { family: SERIF, size: 70, weight: 800, color: INK }
        const k = wrap(ctx, `"${kutipan}"`, q, 520, 4)
        lines(ctx, k.lines, 490, y, 0.95, { ...q, size: k.size })
        y += k.lines.length * k.size * 0.95 + 22
      }
      bars(ctx, 490, y, 520, PCTS, 6, 9, BAR)

      // tiga kolom teks
      ;[[...PCTS, 100], [...PCTS, 100], PCTS.slice(0, 8)].forEach((p, i) => bars(ctx, 70 + i * (CW + 30), 696, CW, p, 6, 9, BAR))
      box(ctx, 395, 880, 1, 320, '#C9C5BC')
      box(ctx, 720, 880, 1, 320, '#C9C5BC')

      // kaki
      box(ctx, 70, 863, 940, 1, INK)
      txt(ctx, texts.tanggal?.trim() ?? '', 70, 1265, { ...mono, size: 12, maxWidth: 600 })
      txt(ctx, 'bersambung ke hal. 08', 1010, 1265, { ...mono, size: 12, align: 'right' })
    },
    over(ctx) {
      fotoInset(ctx, 70, 126, 380, 470)
      // raster titik di desain (posisinya memang 14px di bawah kotak foto)
      halftone(ctx, 70, 140, 380, 470)
    },
  },
})
