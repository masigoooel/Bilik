// Indeks — design-reference/editorial-majalah/indeks.html (600x1800 strip, 4 foto)
import { border, box } from '../paint'
import type { TextField } from '../types'
import { editorial } from './define'
import { bulanTahun, FONTS, fotoInset, INK, join, lineTop, MONO, SERIF, TEXTURE, txt } from './helpers'

const ROW0 = 161.6
const STEP = 333
/** keterangan tiap foto (field kosong: keterangan disembunyikan) */
const CAPTIONS: TextField[] = ['nama', 'nama2', 'tempat', 'catatan']

export const indeks = editorial({
  id: 'editorial-indeks',
  name: 'indeks',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#F5F2EC' },
  placeholder: '#E3DED3',
  fonts: FONTS,
  fields: ['nama', 'nama2', 'tempat', 'catatan', 'tanggal'],
  texture: TEXTURE,
  slots: [0, 1, 2, 3].map((i) => ({ x: 120, y: ROW0 + i * STEP, w: 440, h: 280 })),
  draw: {
    under(ctx, { texts }) {
      const mono = { family: MONO, color: INK }
      txt(ctx, 'NO. 07', 560, 20, { ...mono, size: 13, align: 'right' })
      // kepala: judul + nomor halaman + garis bawah 2px
      txt(ctx, 'Indeks', 40, lineTop(ctx, SERIF, 64, 0.9, 60), { family: SERIF, size: 64, color: INK })
      txt(ctx, 'HAL. 01–04', 560, 99.6, { ...mono, size: 14, align: 'right' })
      box(ctx, 40, 131.6, 520, 2, INK)

      for (let i = 0; i < 4; i++) {
        const top = ROW0 + i * STEP
        txt(ctx, `0${i + 1}`, 40, lineTop(ctx, SERIF, 44, 0.9, top), { family: SERIF, size: 44, color: INK })
        txt(ctx, texts[CAPTIONS[i]]?.trim() ?? '', 120, top + 288, { ...mono, size: 13, maxWidth: 440 })
      }

      txt(ctx, join(['ARSIP', 'VOL. 07', bulanTahun(texts.tanggal)]), 40, 1738, { ...mono, size: 14, maxWidth: 520 })
    },
    over(ctx) {
      // border 1px kotak foto (di desain tergambar di atas isi kotak)
      for (let i = 0; i < 4; i++) {
        border(ctx, 120, ROW0 + i * STEP, 440, 280, 1, '#BDB8AE')
        // bayangan inset di padding box (di dalam border 1px)
        fotoInset(ctx, 121, ROW0 + i * STEP + 1, 438, 278)
      }
    },
  },
})
