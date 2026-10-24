// Sampul Buku — design-reference/editorial-majalah/sampul-buku.html (1080x1350, 1 foto)
import { box, dropShadow } from '../paint'
import { editorial } from './define'
import { FONTS, INK, join, lines, MONO, SERIF, tahun, txt, wrap } from './helpers'

const PAPER = '#EDEAE4'
/** buku (punggung 70 + sampul 720) di tengah area 860 */
const BX = 145
const BY = 80
const BH = 1190

export const sampulBuku = editorial({
  id: 'editorial-sampul-buku',
  name: 'sampul buku',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#C9C2B5' },
  // #D8D4CA setelah grayscale(0.4) di desain
  placeholder: '#D6D4CE',
  // kotak FOTO di desain memakai filter: grayscale(0.4) (setengah pudar): preset terdekat
  filter: 'pudar',
  fonts: FONTS,
  // judul buku = catatan, penulis = nama, tahun cetakan dari tanggal
  fields: ['catatan', 'nama', 'tanggal'],
  // desain tanpa lapisan tekstur
  slots: [{ x: 265, y: 376.24, w: 620, h: 640 }],
  draw: {
    under(ctx, { texts }) {
      dropShadow(ctx, BX, BY, 790, BH, 0, 30, 50, 'rgba(0,0,0,0.25)')
      // punggung buku + teks diputar 90deg
      box(ctx, BX, BY, 70, BH, '#1f1f1f')
      const judul = texts.catatan?.trim() || 'tanpa judul'
      const punggung = join([judul, texts.nama])
      ctx.save()
      ctx.translate(BX + 35, BY + BH / 2)
      ctx.rotate(Math.PI / 2)
      // kotak konten 26px Bodoni = 39 tinggi, dipusatkan
      txt(ctx, punggung, 0, -19.5, { family: SERIF, size: 26, color: PAPER, ls: 2.6, align: 'center', maxWidth: 1100 })
      ctx.restore()

      // sampul
      box(ctx, BX + 70, BY, 720, BH, PAPER)
      txt(ctx, 'SEBUAH NOVEL', 575, 140, { family: MONO, size: 14, color: INK, ls: 4.2, align: 'center' })
      // judul maks. 2 baris di blok 188–346 (1 baris: di tengah blok, supaya foto tetap di tempatnya)
      const t = { family: SERIF, size: 86, weight: 800, color: INK, align: 'center' as const }
      const w = wrap(ctx, judul, t, 620, 2)
      const lh = w.size * 0.92
      lines(ctx, w.lines, 575, 188 + (158.24 - w.lines.length * lh) / 2, 0.92, { ...t, size: w.size })

      // penulis + keterangan cetakan (rata bawah)
      const nama = texts.nama?.trim()
      if (nama) txt(ctx, nama, 575, 1143, { family: SERIF, size: 30, italic: true, color: INK, align: 'center', maxWidth: 620 })
      txt(ctx, join(['cetakan pertama', tahun(texts.tanggal)]), 575, 1193, { family: MONO, size: 13, color: INK, align: 'center' })
    },
  },
})
