// Level — design-reference/meme-lucu/level.html (600x1800, 3 foto)
import { border, box, ICONS, measure, svg, text } from '../paint'
import { ANTON, MONO, TEXTURE, photoInset, rotated } from './helpers'
import { meme } from './define'

const INK = '#111111'
const ACCENT = '#7A5CFF'
const STAR_FILL = '#FFC83D'

/** tiap level: judul, bintang terisi, isi bilah XP (persen), label XP */
const LEVELS = [
  { title: 'LEVEL 1', stars: 1, pct: 0.24, xp: '120/500 XP' },
  { title: 'LEVEL 2', stars: 2, pct: 0.62, xp: '310/500 XP' },
  { title: 'LEVEL 3', stars: 3, pct: 1, xp: '500/500 XP' },
]
/** sisi atas blok level (judul 42px, jarak 10px, bingkai foto 348px, jarak 10px, bilah 24px; antar-blok 34px) */
const TOP = LEVELS.map((_, i) => 155 + i * 468)

export const level = meme({
  id: 'meme-level',
  name: 'level',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#E2E0DA',
  fonts: ['Anton', 'Space Mono:400,700'],
  fields: ['nama', 'catatan', 'tanggal'],
  texture: TEXTURE,
  slots: TOP.map((y) => ({ x: 48, y: y + 56, w: 504, h: 340 })),
  draw: {
    under(ctx, { texts }) {
      // kepala: PROGRES + [NAMA], garis bawah 3px
      text(ctx, 'PROGRES', 44, 36, { family: ANTON, size: 56, color: INK })
      text(ctx, texts.nama?.trim() ?? '', 556, 85, { family: MONO, size: 14, weight: 700, color: INK, align: 'right', maxWidth: 300 })
      box(ctx, 44, 118, 512, 3, INK)

      LEVELS.forEach((l, i) => {
        const y = TOP[i]
        text(ctx, l.title, 44, y - 11, { family: ANTON, size: 42, color: INK })
        for (let k = 0; k < 3; k++)
          svg(ctx, ICONS.star, 470 + k * 30, y + 8, 26, 26, 24, 24, { fill: k < l.stars ? STAR_FILL : undefined, stroke: INK, lineWidth: 1.6, lineJoin: 'round' })
        border(ctx, 44, y + 52, 512, 348, 4, INK)
        // bilah XP: kotak putih 414.3x24 border 3px, isi = persen lebar konten
        box(ctx, 44, y + 410, 414.3, 24, '#ffffff')
        box(ctx, 47, y + 413, 408.3 * l.pct, 18, ACCENT)
        border(ctx, 44, y + 410, 414.3, 24, 3, INK)
        text(ctx, l.xp, 556, y + 411.5, { family: MONO, size: 14, weight: 700, color: INK, align: 'right' })
      })

      // pencapaian: susunan rata bawah (flex-end), elemen kosong dilewati
      box(ctx, 44, 1559, 512, 3, INK)
      const nama = texts.catatan?.trim() ?? ''
      const tgl = texts.tanggal?.trim() ?? ''
      const small = { family: MONO, size: 14, color: INK }
      let bottom = 1760
      if (tgl) {
        text(ctx, tgl, 44, bottom - 21, { ...small, maxWidth: 512 })
        bottom -= 21 + 6
      }
      if (nama) {
        text(ctx, nama, 44, bottom - 33, { family: MONO, size: 22, weight: 700, color: INK, maxWidth: 512 })
        bottom -= 33 + 6
        text(ctx, 'pencapaian terbuka', 44, bottom - 21, small)
      }
    },
    over(ctx) {
      for (const y of TOP) photoInset(ctx, 48, y + 56, 504, 340)
      // stiker MAX di pojok kanan atas bingkai level 3 (right -10, top -14 dari padding box), rotate 8°
      const o = { family: ANTON, size: 16, color: '#ffffff' }
      const w = measure(ctx, 'MAX', o) + 24 + 6
      const x = 562 - w
      const y = TOP[2] + 56 - 14
      rotated(ctx, x + w / 2, y + 21, 8, () => {
        box(ctx, x, y, w, 42, ACCENT)
        border(ctx, x, y, w, 42, 3, INK)
        text(ctx, 'MAX', x + 15, y + 9, o)
      })
    },
  },
})
