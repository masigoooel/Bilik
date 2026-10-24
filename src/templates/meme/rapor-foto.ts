// Rapor Foto — design-reference/meme-lucu/rapor-foto.html (1200x1800, 4 foto)
import { border, box, measure, text } from '../paint'
import { ANTON, CAVEAT, MONO, TEXTURE, join, photoInset, spacedText, yearOf } from './helpers'
import { meme } from './define'

const INK = '#111111'
const ACCENT = '#C0392B'
const PAPER = '#FBF8F1'
/** [KELAS] tidak punya field yang cocok: teks tetap pendek */
const KELAS = 'XII'

/** baris mata pelajaran; baris genap (2, 4) berlatar abu tipis + padding 10px */
const ROWS = [
  { subject: 'POSE CANDID', note: 'catatan: sangat baik', grade: 'A', shaded: false },
  { subject: 'SENYUM', note: 'catatan: bagus', grade: 'A-', shaded: true },
  { subject: 'GAYA BEBAS', note: 'catatan: cukup', grade: 'B+', shaded: false },
  { subject: 'KOMPAK', note: 'catatan: luar biasa', grade: 'A+', shaded: true },
]
const ROW_Y = ROWS.map((_, i) => 253 + i * 346)
const SLOTS = ROWS.map((r, i) => ({ x: r.shaded ? 129 : 119, y: ROW_Y[i] + (r.shaded ? 10 : 0), w: 400, h: 300 }))

export const raporFoto = meme({
  id: 'meme-rapor-foto',
  name: 'rapor foto',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#2E6DA4' },
  placeholder: '#E8E6E0',
  // Caveat hanya dimuat 700 di <link> desain: teks Caveat 400 tampil memakai face 700
  fonts: ['Anton', 'Space Mono:400,700', 'Caveat:700'],
  fields: ['nama', 'nama2', 'tanggal'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      box(ctx, 60, 60, 1080, 1680, PAPER)
      border(ctx, 60, 60, 1080, 1680, 3, INK)

      // kepala
      text(ctx, 'RAPOR FOTO', 119, 95, { family: ANTON, size: 70, color: INK })
      const tahun = yearOf(texts.tanggal)
      text(ctx, join(['semester ganjil', tahun && `tahun ajaran ${tahun}`]), 119, 183, { family: MONO, size: 16, color: INK })
      // identitas rata kanan, blok dipusatkan vertikal (baris kosong dilewati)
      const ident = [
        ['nama: ', texts.nama?.trim() ?? ''],
        ['kelas: ', KELAS],
        ['no. absen: ', '17'],
      ].filter(([, v]) => v)
      const top = 160 - (ident.length * 22) / 2
      ident.forEach(([label, value], i) => {
        const y = top + i * 22
        const bold = { family: MONO, size: 15, weight: 700, color: INK, maxWidth: 380 }
        const bw = Math.min(380, measure(ctx, value, bold))
        text(ctx, value, 1081, y, { ...bold, align: 'right' })
        text(ctx, label.trimEnd(), 1081 - bw - measure(ctx, ' ', { family: MONO, size: 15 }), y, { family: MONO, size: 15, color: INK, align: 'right' })
      })
      // border-bottom 4px double: dua garis 1px
      box(ctx, 119, 225, 962, 1, INK)
      box(ctx, 119, 228, 962, 1, INK)

      ROWS.forEach((r, i) => {
        const y = ROW_Y[i]
        if (r.shaded) box(ctx, 119, y, 962, 322, 'rgba(0,0,0,0.045)')
        box(ctx, 119, y + 320, 962, 2, INK)
        const p = r.shaded ? 10 : 0
        const tx = 539 + p
        spacedText(ctx, 'MATA PELAJARAN', tx, y + p, { family: MONO, size: 13, color: INK, letterSpacing: 2.6 })
        text(ctx, r.subject, tx, y + p + 20, { family: ANTON, size: 36, color: INK })
        text(ctx, r.note, tx, y + p + 262, { family: CAVEAT, size: 30, weight: 700, color: ACCENT })
        // kolom nilai 150px + border kiri 2px
        const gx = r.shaded ? 919 : 929
        box(ctx, gx, y + p, 2, 300, INK)
        text(ctx, r.grade, gx + 77, y + p + 74.5, { family: ANTON, size: 86, color: ACCENT, align: 'center' })
        text(ctx, 'NILAI', gx + 77, y + p + 186.5, { family: MONO, size: 12, color: INK, align: 'center' })
      })

      // kaki: rata-rata + tanda tangan wali kelas ([wali kelas] → nama2)
      const small = { family: MONO, size: 14, color: INK }
      text(ctx, 'rata-rata:', 119, 1664, small)
      text(ctx, 'A', 213.3, 1655, { family: MONO, size: 22, weight: 700, color: INK })
      text(ctx, 'keterangan: naik kelas', 119, 1692, small)
      text(ctx, texts.nama2?.trim() ?? '', 961, 1637, { family: CAVEAT, size: 40, weight: 700, color: ACCENT, align: 'center', maxWidth: 280 })
      box(ctx, 841, 1689, 240, 2, INK)
      text(ctx, join(['wali kelas', texts.tanggal]), 961, 1693, { family: MONO, size: 13, color: INK, align: 'center', maxWidth: 280 })
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s.x, s.y, s.w, s.h)
    },
  },
})
