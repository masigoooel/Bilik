// Foto Esai — design-reference/editorial-majalah/foto-esai.html (1200x1800 4R, 4 foto)
import { box } from '../paint'
import { editorial } from './define'
import { bars, bulanTahun, FONTS, fotoInset, INK, lineTop, MONO, SERIF, spaceBetween, TEXTURE, txt, width } from './helpers'

const BAR = '#C9C5BC'
/** grid 1.4fr 1fr (gap 24) di lebar 1040 */
const WA = (1016 * 1.4) / 2.4
const WB = 1016 / 2.4
const SLOTS = [
  { x: 80, y: 220, w: WA, h: 620 },
  { x: 80 + WA + 24, y: 220, w: WB, h: 300 },
  { x: 80 + WA + 24, y: 566, w: WB, h: 240 },
  { x: 80 + WB + 24, y: 906, w: WA, h: 380 },
]
/** [KETERANGAN FOTO SINGKAT] foto 2–4 tidak punya field: keterangan tetap yang kalem */
const CAPTIONS = ['pagi yang pelan', 'di sela jalan', 'pulang sore']

export const fotoEsai = editorial({
  id: 'editorial-foto-esai',
  name: 'foto esai',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#DDD9D0',
  fonts: FONTS,
  // judul esai = catatan, penulis = nama, keterangan foto 1 = tempat, bulan & tahun di kaki = tanggal
  fields: ['catatan', 'nama', 'tempat', 'tanggal'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      const mono = { family: MONO, color: INK }
      // kepala
      txt(ctx, 'FOTO ESAI', 80, 80, { ...mono, size: 12, ls: 3.6 })
      // kredit kanan (rata kanan, rata bawah)
      const nama = texts.nama?.trim()
      let kanan = 0
      if (nama) {
        const k = { ...mono, size: 13 }
        txt(ctx, 'teks dan foto', 1120, 139, { ...k, align: 'right' })
        kanan = Math.max(width(ctx, 'teks dan foto', k), txt(ctx, nama, 1120, 156, { ...k, align: 'right', maxWidth: 300 }))
      }
      // judul satu baris, dikecilkan supaya tidak menabrak kredit
      const judul = texts.catatan?.trim() || 'cerita kecil'
      txt(ctx, judul, 80, lineTop(ctx, SERIF, 80, 0.9, 101), { family: SERIF, size: 80, color: INK, maxWidth: 1040 - kanan - 30 })
      box(ctx, 80, 189, 1040, 1, INK)

      // nomor + keterangan di bawah tiap foto
      const caps = [texts.tempat?.trim() ?? '', ...CAPTIONS]
      SLOTS.forEach((s, i) => {
        const top = s.y + s.h + 10
        const num = { family: SERIF, size: 26, weight: 700, color: INK }
        txt(ctx, String(i + 1), s.x, top - 7, num)
        const nw = width(ctx, String(i + 1), num)
        txt(ctx, caps[i], s.x + nw + 10, top, { ...mono, size: 12, maxWidth: s.w - nw - 10 })
      })

      // kolom teks (garis pengganti paragraf)
      bars(ctx, 80, 906, WB, [100, 96, 100, 88, 100, 72, 94, 100, 80], 6, 9, BAR)

      // kaki halaman
      box(ctx, 80, 1750, 1040, 1, INK)
      const kaki = { ...mono, size: 11, maxWidth: 760 }
      const tengah = texts.catatan?.trim() ? `FOTO ESAI · ${texts.catatan.trim().toUpperCase()}` : 'FOTO ESAI'
      spaceBetween(ctx, ['42', tengah, bulanTahun(texts.tanggal)], 80, 1040, 1756, kaki)
    },
    over(ctx) {
      for (const s of SLOTS) fotoInset(ctx, s.x, s.y, s.w, s.h)
    },
  },
})
