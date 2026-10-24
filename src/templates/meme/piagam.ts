// Piagam — design-reference/meme-lucu/piagam.html (1080x1350, 1 foto)
import { border, box, dropShadow, radial, text } from '../paint'
import { ANTON, CAVEAT, MONO, RYE, disc, photoInset, spacedText, yearOf } from './helpers'
import { meme } from './define'

const INK = '#2a2118'
const GOLD = '#B8963E'

export const piagam = meme({
  id: 'meme-piagam',
  name: 'piagam',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#2E4A3A' },
  placeholder: '#ECE6D4',
  // Caveat hanya dimuat 700 di <link> desain: teks Caveat 400 tampil memakai face 700
  fonts: ['Anton', 'Space Mono:400,700', 'Caveat:700', 'Rye'],
  fields: ['nama', 'catatan', 'nama2', 'tanggal'],
  slots: [{ x: 280, y: 366, w: 520, h: 520 }],
  draw: {
    under(ctx, { texts }) {
      box(ctx, 60, 60, 960, 1230, '#FBF6E8')
      border(ctx, 60, 60, 960, 1230, 3, GOLD)
      border(ctx, 89, 89, 902, 1172, 1, GOLD)

      // judul dua baris (line-height 72px)
      const title = { family: RYE, size: 72, color: INK, align: 'center' as const }
      text(ctx, 'Piagam', 540, 131, title)
      text(ctx, 'Penghargaan', 540, 203, title)
      spacedText(ctx, 'DIBERIKAN KEPADA', 540, 306, { family: MONO, size: 16, color: INK, letterSpacing: 4, align: 'center' })
      border(ctx, 266, 352, 548, 548, 2, GOLD)

      text(ctx, texts.nama?.trim() ?? '', 540, 914, { family: CAVEAT, size: 64, weight: 700, color: INK, align: 'center', maxWidth: 780 })
      text(ctx, 'atas prestasi luar biasa dalam bidang', 540, 1008, { family: MONO, size: 18, color: INK, align: 'center' })
      // [BIDANG PRESTASI] → catatan
      text(ctx, texts.catatan?.trim() ?? '', 540, 1056, { family: ANTON, size: 44, color: INK, align: 'center', maxWidth: 780 })

      // tanda tangan ([tanda tangan] → nama2) & tanggal: garis tetap ada seperti formulir
      text(ctx, texts.nama2?.trim() ?? '', 260, 1201, { family: CAVEAT, size: 34, weight: 700, color: INK, align: 'center', maxWidth: 300 })
      box(ctx, 150, 1248, 220, 2, INK)
      text(ctx, 'ketua panitia', 260, 1254, { family: MONO, size: 13, color: INK, align: 'center' })
      text(ctx, texts.tanggal?.trim() ?? '', 820, 1218, { family: MONO, size: 18, color: INK, align: 'center', maxWidth: 300 })
      box(ctx, 710, 1248, 220, 2, INK)
      text(ctx, 'tanggal', 820, 1254, { family: MONO, size: 13, color: INK, align: 'center' })

      // segel emas: radial-gradient(circle at 40% 35%, #f0d27a, #B8963E 70%), bayangan 0 4px 8px
      dropShadow(ctx, 475, 1144, 130, 130, 0, 4, 8, 'rgba(0,0,0,0.2)', 65)
      const cx = 475 + 52
      const cy = 1144 + 45.5
      disc(ctx, 475, 1144, 130, radial(ctx, cx, cy, Math.hypot(130 - 52, 130 - 45.5), [[0, '#f0d27a'], [0.7, GOLD], [1, GOLD]]))
      // [TAHUN] = tahun dari tanggal
      text(ctx, yearOf(texts.tanggal) ?? '', 540, 1196.5, { family: RYE, size: 20, color: '#5a4310', align: 'center', maxWidth: 110 })
    },
    over(ctx) {
      photoInset(ctx, 280, 366, 520, 520)
    },
  },
})
