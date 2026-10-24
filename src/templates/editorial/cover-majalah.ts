// Cover Majalah — design-reference/editorial-majalah/cover-majalah.html (1080x1350, 1 foto penuh)
import { box } from '../paint'
import { editorial } from './define'
import { bulanTahun, FONTS, fotoInset, INK, lines, lineTop, MONO, SERIF, TEXTURE, txt, wrap } from './helpers'

const C = '#FFFFFF'
/** lebar batang barcode (gap 2px) */
const BARS = [3, 1, 2, 4, 1, 3, 1, 2, 2, 1, 4, 1, 3, 2, 1, 2, 4, 1]

export const coverMajalah = editorial({
  id: 'editorial-cover-majalah',
  name: 'cover majalah',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#BDB8AE' },
  placeholder: '#BDB8AE',
  fonts: FONTS,
  // judul utama = catatan, subjudul = tempat, nama sampul = nama, bulan & tahun edisi = tanggal
  fields: ['catatan', 'tempat', 'nama', 'tanggal'],
  texture: TEXTURE,
  slots: [{ x: 0, y: 0, w: 1080, h: 1350 }],
  draw: {
    // foto memenuhi sampul: semua tulisan menimpa foto
    over(ctx, { texts }) {
      fotoInset(ctx, 0, 0, 1080, 1350)
      txt(ctx, 'ARSIP', 540, lineTop(ctx, SERIF, 250, 1, 30, 800), { family: SERIF, size: 250, weight: 800, color: C, ls: -7.5, align: 'center' })

      const mono = { family: MONO, color: C }
      txt(ctx, 'VOL. 07', 60, 300, { ...mono, size: 18, ls: 2.7 })
      txt(ctx, bulanTahun(texts.tanggal), 1020, 300, { ...mono, size: 18, ls: 2.7, align: 'right', maxWidth: 700 })

      // nama + "edisi khusus"
      const nama = texts.nama?.trim()
      if (nama) txt(ctx, nama, 60, lineTop(ctx, SERIF, 56, 1, 1060), { family: SERIF, size: 56, italic: true, color: C, maxWidth: 900 })
      txt(ctx, 'edisi khusus', 60, 1122, { ...mono, size: 18 })

      // barcode
      box(ctx, 924, 1190, 96, 66, '#ffffff')
      let bx = 936
      for (const w of BARS) {
        box(ctx, bx, 1200, w, 46, INK)
        bx += w + 2
      }

      // judul utama + subjudul + garis (kolom flex, gap 14px)
      let y = 420
      const judul = texts.catatan?.trim()
      if (judul) {
        const t = { family: SERIF, size: 64, weight: 800, color: C }
        const w = wrap(ctx, judul, t, 520, 3)
        lines(ctx, w.lines, 60, y, 0.95, { ...t, size: w.size })
        y += w.lines.length * w.size * 0.95 + 14
      }
      const sub = texts.tempat?.trim()
      if (sub) {
        txt(ctx, sub, 60, y, { ...mono, size: 20, maxWidth: 520 })
        y += 27 + 14
      }
      box(ctx, 60, y, 80, 3, C)

      txt(ctx, 'Rp 45.000 · No. 07', 640, 1150, { ...mono, size: 16 })
    },
  },
})
