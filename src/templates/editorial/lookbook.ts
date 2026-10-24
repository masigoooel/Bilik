// Lookbook — design-reference/editorial-majalah/lookbook.html (1200x1800 4R, 4 foto)
import { editorial } from './define'
import { FONTS, fotoInset, INK, join, lineTop, MONO, SERIF, tahun, TEXTURE, txt } from './helpers'

const CELLS = [
  { x: 80, y: 226 },
  { x: 616, y: 226 },
  { x: 80, y: 897 },
  { x: 616, y: 897 },
]
/** [KETERANGAN] tiap look tidak punya field (nama sudah dipakai di kaki halaman): teks tetap yang kalem */
const CAPTIONS = ['kasual', 'rapi', 'santai', 'akhir pekan']

export const lookbook = editorial({
  id: 'editorial-lookbook',
  name: 'lookbook',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#E6E3DC',
  fonts: [...FONTS, 'Tinos:400'],
  // foto: nama · gaya: nama2, tahun musim dari tanggal
  fields: ['nama', 'nama2', 'tanggal'],
  texture: TEXTURE,
  slots: CELLS.map((c) => ({ ...c, w: 504, h: 600 })),
  draw: {
    under(ctx, { texts }) {
      const mono = { family: MONO, size: 18, color: INK }
      txt(ctx, 'Lookbook', 80, lineTop(ctx, SERIF, 120, 0.85, 80), { family: SERIF, size: 120, italic: true, color: INK })
      txt(ctx, 'MUSIM GUGUR', 1120, 136, { ...mono, align: 'right' })
      txt(ctx, tahun(texts.tanggal), 1120, 159, { ...mono, align: 'right' })

      CELLS.forEach((c, i) => txt(ctx, CAPTIONS[i], c.x + 504, c.y + 612, { family: MONO, size: 15, color: INK, align: 'right' }))

      const f = { family: MONO, size: 15, color: INK }
      const kredit = join([texts.nama?.trim() && `foto: ${texts.nama.trim()}`, texts.nama2?.trim() && `gaya: ${texts.nama2.trim()}`])
      txt(ctx, kredit, 80, 1730, { ...f, maxWidth: 900 })
      txt(ctx, 'hal. 32–33', 1120, 1730, { ...f, align: 'right' })
    },
    over(ctx) {
      CELLS.forEach((c) => fotoInset(ctx, c.x, c.y, 504, 600))
      // nomor look menimpa pojok foto. Desain menulis font-family dengan kutip ber-backslash sehingga
      // Chrome menampilkan serif cadangan (Times New Roman, tidak ada di HP): pakai Tinos (metrik sama dengan Times)
      CELLS.forEach((c, i) => txt(ctx, `0${i + 1}`, c.x + 16, c.y + 12, { family: 'Tinos', size: 44, color: INK }))
    },
  },
})
