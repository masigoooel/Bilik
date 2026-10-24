// Diary Hitam — design-reference/dark-grunge/diary-hitam.html (600x1800 strip, 4 foto)
import { border, box } from '../paint'
import { dark } from './define'
import { CAVEAT, FONTS, FRAKTUR, SPECIAL, TEXTURE, disc, rotated, slotInset, txt, vignette, width } from './helpers'

const BG = '#151515'
const INK = '#e8e8e8'
/** sisi atas tiap kartu foto (kotak 492x296, padding 8) + kemiringannya */
const CARDS: [y: number, rot: number][] = [
  [156, -1.5],
  [516, 1.2],
  [876, -1],
  [1236, 1.5],
]

const SLOTS = CARDS.map(([y, rot]) => ({ x: 72, y: y + 8, w: 476, h: 280, rotate: rot }))

export const diaryHitam = dark({
  id: 'dark-diary-hitam',
  name: 'diary hitam',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: BG },
  placeholder: '#3a3a3a',
  // kotak foto desain: filter grayscale(0.7) → preset hitam putih tanpa kontras tambahan
  filter: 'mono',
  fonts: [...FONTS, 'Caveat:700'],
  // keterangan foto: tanggal (+ ", malam"), tempat, catatan; stiker [BAND] = nama
  fields: ['tanggal', 'tempat', 'catatan', 'nama'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      // garis buku tulis: repeating-linear-gradient(transparent 0 38px, rgba(255,255,255,0.08) 38px 40px)
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      for (let y = 38; y < 1800; y += 40) ctx.fillRect(0, y, 600, 2)

      // lubang spiral: 14 lingkaran 20px, justify-content: space-evenly di tinggi 1800
      const gap = (1800 - 14 * 20) / 15
      for (let i = 0; i < 14; i++) {
        const y = Math.round(gap * (i + 1) + 20 * i)
        disc(ctx, 12, y, 20, '#555')
        disc(ctx, 16, y + 4, 12, '#0a0a0a')
      }

      txt(ctx, 'Diary', 64, 65, { family: FRAKTUR, size: 60, color: INK })
      // gembok
      border(ctx, 490, 50, 66, 76, 6, '#777', 10)
      box(ctx, 517, 79, 12, 18, '#777')

      for (const [y, rot] of CARDS) rotated(ctx, 310, y + 148, rot, () => box(ctx, 64, y, 492, 296, '#2a2a2a'))

      // keterangan tulisan tangan di bawah tiap foto
      const tanggal = texts.tanggal?.trim()
      const captions = [
        tanggal ? `${tanggal}, malam` : 'suatu malam',
        texts.tempat?.trim() || 'tempat biasa',
        'nggak dihapus',
        texts.catatan?.trim() || 'akhirnya',
      ]
      const cap = { family: CAVEAT, size: 27, weight: 700, color: 'rgba(232,232,232,0.85)', maxWidth: 492 }
      CARDS.forEach(([y], i) => txt(ctx, captions[i], 64, y + 304, cap))

      txt(ctx, 'jangan dibuka. (kecuali kamu)', 64, 1745, { family: SPECIAL, size: 15, color: INK })

      // "jangan dibaca" dicoret, rotate -6° di titik tengah kotak 146x38
      rotated(ctx, 403, 79, -6, () => {
        const o = { family: CAVEAT, size: 30, weight: 700, color: '#bdbdbd' }
        const w = txt(ctx, 'jangan dibaca', 330, 60, o)
        box(ctx, 330, 78, w, 3, '#bdbdbd')
      })

      // stiker nama band: padding 6px 12px, border 2px, lebar mengikuti teks, rotate 8°
      const band = texts.nama?.trim()
      if (band) {
        const o = { family: FRAKTUR, size: 26, color: '#ffffff', maxWidth: 150 }
        const tw = Math.min(width(ctx, band, o), 150)
        const w = tw + 28
        rotated(ctx, 400 + w / 2, 1711.5, 8, () => {
          box(ctx, 400, 1690, w, 43, '#000')
          border(ctx, 400, 1690, w, 43, 2, '#fff')
          txt(ctx, band, 414, 1698, o)
        })
      }

      // sudut halaman terlipat: linear-gradient(225deg, bg 50%, #3a3a3a 50%) (separuh atas menutup garis & stiker)
      box(ctx, 510, 1710, 90, 90, BG)
      ctx.beginPath()
      ctx.moveTo(510, 1710)
      ctx.lineTo(600, 1800)
      ctx.lineTo(510, 1800)
      ctx.closePath()
      ctx.fillStyle = '#3a3a3a'
      ctx.fill()
    },
    over(ctx) {
      for (const s of SLOTS) slotInset(ctx, s)
      // selotip hitam di tepi atas tiap foto (rotate -4°)
      for (const [y] of CARDS) rotated(ctx, 304, y + 2, -4, () => box(ctx, 244, y - 14, 120, 32, 'rgba(17,17,17,0.9)'))
    },
    top(ctx, { W, H }) {
      vignette(ctx, W, H)
    },
  },
})
