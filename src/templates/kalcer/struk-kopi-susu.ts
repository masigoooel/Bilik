// Struk Kopi Susu — design-reference/kalcer/struk-kopi-susu.html (600x1800, 3 foto)
import { box, text, type Ctx } from '../paint'
import { MONO, TEXTURE, dashedH, ring } from './helpers'
import { kalcer } from './define'

const BG = '#B8916A'
const PAPER = '#FBFAF6'
const INK = '#2b2a27'
const VT = 'VT323'
const ROWS = [
  { y: 202, item: 'FRAME 01', time: '16:20' },
  { y: 621, item: 'FRAME 02', time: '16:20' },
  { y: 1040, item: 'FRAME 03', time: '16:21' },
]

/**
 * Tepi sobekan struk: dua linear-gradient 135°/225° (atas) atau 45°/-45° (bawah), tile 14px,
 * "transparent 7px" → takik segitiga di tiap tile (lebar 7√2·2-14 di tepi, dalam 7√2-7).
 */
function zigzag(ctx: Ctx, x: number, y: number, w: number, top: boolean) {
  const d = 7 * Math.SQRT2
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, 14)
  ctx.clip()
  ctx.fillStyle = PAPER
  ctx.fillRect(x, y, w, 14)
  ctx.fillStyle = BG
  ctx.beginPath()
  for (let tx = x; tx < x + w; tx += 14) {
    const edge = top ? y : y + 14
    const apex = top ? y + d - 7 : y + 14 - (d - 7)
    ctx.moveTo(tx + 14 - d, edge)
    ctx.lineTo(tx + d, edge)
    ctx.lineTo(tx + 7, apex)
    ctx.closePath()
  }
  ctx.fill()
  ctx.restore()
}

export const strukKopiSusu = kalcer({
  id: 'kalcer-struk-kopi-susu',
  name: 'struk kopi susu',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  // #E7E3D8 sesudah grayscale(1) = #dedede (hasil ukur)
  placeholder: '#dedede',
  // kotak FOTO di desain memakai filter: grayscale(1) → foto hitam putih
  filter: 'mono',
  fonts: ['VT323', 'Space Mono:400,700'],
  fields: ['tempat', 'tanggal'],
  texture: TEXTURE,
  slots: ROWS.map((r) => ({ x: 56, y: r.y, w: 488, h: 370 })),
  draw: {
    under(ctx, { texts }) {
      zigzag(ctx, 30, 30, 540, true)
      box(ctx, 30, 44, 540, 1712, PAPER)
      zigzag(ctx, 30, 1756, 540, false)

      text(ctx, 'KEDAI KOPI SUSU', 300, 70, { family: VT, size: 52, color: INK, align: 'center' })
      const small = { family: MONO, size: 14, color: INK, align: 'center' as const, maxWidth: 488 }
      // alamat = tempat ("Jl." ditambahkan kalau user belum menulisnya)
      const tempat = texts.tempat?.trim()
      const alamat = tempat ? (/^(jl\b|jalan\b)/i.test(tempat) ? tempat : `Jl. ${tempat}`) : ''
      text(ctx, [alamat, '08.00–22.00'].filter(Boolean).join(' · '), 300, 124, small)
      text(ctx, [texts.tanggal?.trim(), '16:20', 'kasir 01'].filter(Boolean).join(' · '), 300, 147, small)
      dashedH(ctx, 56, 184, 488, 2, INK, [6, 4])

      const row = { family: MONO, size: 17, weight: 700, color: INK }
      for (const r of ROWS) {
        text(ctx, r.item, 56, r.y + 378, row)
        text(ctx, r.time, 544, r.y + 378, { ...row, align: 'right' })
      }
      dashedH(ctx, 56, 1459, 488, 2, INK, [6, 4])
      text(ctx, 'TOTAL', 56, 1477, { family: VT, size: 40, color: INK })
      text(ctx, '3 FOTO', 544, 1477, { family: VT, size: 40, color: INK, align: 'right' })
      text(ctx, 'BAYAR', 56, 1533, { family: MONO, size: 15, color: INK })
      text(ctx, 'TUNAI', 544, 1533, { family: MONO, size: 15, color: INK, align: 'right' })

      text(ctx, 'TERIMA KASIH', 300, 1636, { family: MONO, size: 15, weight: 700, color: INK, align: 'center' })
      // barcode: repeating-linear-gradient 90deg, periode 16px (gelap 0–3, 5–6, 10–14)
      ctx.fillStyle = INK
      for (let bx = 150; bx < 450; bx += 16) {
        ctx.fillRect(bx, 1664, 3, 46)
        ctx.fillRect(bx + 5, 1664, 1, 46)
        ctx.fillRect(bx + 10, 1664, Math.min(4, 450 - bx - 10), 46)
      }
      text(ctx, 'No. 0017 · simpan struk ini', 300, 1716, { family: MONO, size: 13, color: INK, align: 'center' })

      // bekas gelas kopi
      ring(ctx, 60, 1560, 170, 12, 'rgba(120,80,40,0.16)')
    },
  },
})
