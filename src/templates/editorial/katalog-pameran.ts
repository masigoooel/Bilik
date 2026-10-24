// Katalog Pameran — design-reference/editorial-majalah/katalog-pameran.html (600x1800 strip, 3 foto)
import { box } from '../paint'
import { editorial } from './define'
import { FONTS, INK, join, lineTop, MONO, SERIF, tahun, txt, width } from './helpers'

const SLOTS = [225, 656, 1087].map((y) => ({ x: 50, y, w: 500, h: 360 }))
const PLAT = ['plat I', 'plat II', 'plat III']
/** [JUDUL KARYA] plat II & III tidak punya field: judul tetap yang kalem */
const KARYA = ['ruang tunggu', 'sore di jendela']

export const katalogPameran = editorial({
  id: 'editorial-katalog-pameran',
  name: 'katalog pameran',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#DDD9D0',
  fonts: FONTS,
  // nama seniman = nama, tempat = tempat, tanggal pameran = tanggal (apa adanya), judul karya plat I = catatan
  fields: ['nama', 'tempat', 'tanggal', 'catatan'],
  // desain tanpa lapisan tekstur
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      const mono = { family: MONO, color: INK }
      txt(ctx, 'KATALOG PAMERAN', 50, 70, { ...mono, size: 13, ls: 3.9 })
      const nama = texts.nama?.trim() || 'pameran'
      txt(ctx, nama, 50, lineTop(ctx, SERIF, 56, 1, 93), { family: SERIF, size: 56, color: INK, maxWidth: 500 })
      txt(ctx, join([texts.tempat, texts.tanggal]), 50, 155, { ...mono, size: 13, maxWidth: 500 })
      box(ctx, 50, 190, 500, 1, INK)

      const th = tahun(texts.tanggal)
      const karya = [texts.catatan?.trim() || 'tanpa judul', ...KARYA]
      SLOTS.forEach((s, i) => {
        // box-shadow kedua di desain (0 0 0 1px #c9c5bb) menimpa bayangan inset: garis 1px di luar kotak
        box(ctx, s.x - 1, s.y - 1, s.w + 2, s.h + 2, '#C9C5BB')
        const y = s.y + s.h + 10
        txt(ctx, PLAT[i], 50, y, { ...mono, size: 13 })
        const pw = width(ctx, PLAT[i], { ...mono, size: 13 })
        txt(ctx, join([karya[i], th], ', '), 550, y, { family: SERIF, size: 18, italic: true, color: INK, align: 'right', maxWidth: 500 - pw - 20 })
      })

      txt(ctx, '3 karya · foto dan cetak', 50, 1735, { ...mono, size: 12 })
    },
  },
})
