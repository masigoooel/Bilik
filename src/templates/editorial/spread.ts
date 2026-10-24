// Spread — design-reference/editorial-majalah/spread.html (1080x1350, 2 foto)
import { box } from '../paint'
import { editorial } from './define'
import { FONTS, fotoInset, INK, join, lines, lineTop, MONO, SERIF, TEXTURE, txt, wrap, bulanTahun } from './helpers'

const BG = '#F5F2EC'
const BAR = '#C9C5BC'
const BARS = [460, 441.6, 460, 404.8, 460, 331.2, 460, 441.6]

export const spread = editorial({
  id: 'editorial-spread',
  name: 'spread',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: BG },
  placeholder: '#DDD9D0',
  fonts: FONTS,
  // judul artikel = nama, kutipan = catatan, keterangan foto = tempat, bulan & tahun di kaki = tanggal
  fields: ['nama', 'catatan', 'tempat', 'tanggal'],
  texture: TEXTURE,
  slots: [
    { x: 60, y: 70, w: 460, h: 1100 },
    { x: 560, y: 436.8, w: 460, h: 520 },
  ],
  draw: {
    under(ctx, { texts }) {
      const mono = { family: MONO, size: 14, color: INK }
      // keterangan foto 1
      txt(ctx, join(['01', texts.tempat]), 60, 1184, { ...mono, maxWidth: 460 })

      // kolom kanan
      txt(ctx, 'FITUR · HAL. 24', 560, 70, { ...mono, ls: 2.8 })
      const judul = texts.nama?.trim() || 'cerita hari ini'
      const t = { family: SERIF, size: 72, color: INK }
      const w = wrap(ctx, judul, t, 460, 2)
      // maksimal 2 baris (tinggi blok desain 114 → 250.8) supaya tidak menabrak garis teks
      lines(ctx, w.lines, 560, 114, 0.95, { ...t, size: w.size })
      BARS.forEach((bw, i) => box(ctx, 560, 276.8 + i * 18, bw, 8, BAR))

      // kutipan
      box(ctx, 560, 982.8, 460, 2, INK)
      const kutipan = texts.catatan?.trim()
      if (kutipan) {
        txt(ctx, '“', 560, lineTop(ctx, SERIF, 90, 0.7, 996.8), { family: SERIF, size: 90, color: INK })
        const q = { family: SERIF, size: 30, italic: true, color: INK }
        const k = wrap(ctx, kutipan, q, 413.1, 2)
        lines(ctx, k.lines, 606.9, 996.8, 1.15, { ...q, size: k.size })
      }

      // kaki halaman
      txt(ctx, '24', 60, 1300, mono)
      txt(ctx, join(['ARSIP', bulanTahun(texts.tanggal)]), 540, 1300, { ...mono, align: 'center', maxWidth: 820 })
      txt(ctx, '25', 1020, 1300, { ...mono, align: 'right' })
    },
    over(ctx) {
      fotoInset(ctx, 60, 70, 460, 1100)
      fotoInset(ctx, 560, 436.8, 460, 520)
    },
  },
})
