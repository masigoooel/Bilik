// Piringan Hitam — design-reference/kalcer/piringan-hitam.html (1080x1350, 1 foto)
import { box, dropShadow, radial, text } from '../paint'
import { ANTON, MONO, disc, photoInset, ring, songTitles } from './helpers'
import { kalcer } from './define'

const BG = '#E9DDC4'
const LABEL = '#E8553D'
const INK = '#1c1b19'
const SLEEVE = '#F1E9D2'
const TIMES = ['4:23', '3:29', '4:35', '3:41']

export const piringanHitam = kalcer({
  id: 'kalcer-piringan-hitam',
  name: 'piringan hitam',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  placeholder: '#d8d0b8',
  fonts: ['Anton', 'Space Mono:400,700', 'Permanent Marker'],
  fields: ['nama', 'catatan'],
  slots: [{ x: 104, y: 154, w: 692, h: 600 }],
  draw: {
    under(ctx, { texts }) {
      // piringan: radial-gradient(circle, #2a2a2a 0 22%, #111 23% 100%), farthest-corner = 350·√2
      dropShadow(ctx, 330, 170, 700, 700, 0, 20, 40, 'rgba(0,0,0,0.35)', 350)
      const R = 350 * Math.SQRT2
      box(ctx, 330, 170, 700, 700, radial(ctx, 680, 520, R, [[0, '#2a2a2a'], [0.22, '#2a2a2a'], [0.23, '#111111'], [1, '#111111']]), 350)
      // alur piringan: cincin 1px tiap 26px
      for (let i = 1; i <= 8; i++) ring(ctx, 330 + i * 26, 170 + i * 26, 700 - i * 52, 1, 'rgba(255,255,255,0.08)')
      disc(ctx, 590, 430, 180, LABEL)
      text(ctx, 'SISI A', 680, 503.5, { family: ANTON, size: 22, color: INK, align: 'center' })
      disc(ctx, 670, 510, 20, BG)

      // sampul
      dropShadow(ctx, 70, 120, 760, 800, 0, 20, 40, 'rgba(0,0,0,0.3)')
      box(ctx, 70, 120, 760, 800, SLEEVE)
      const nama = texts.nama?.trim()
      if (nama) text(ctx, nama, 104, 755, { family: ANTON, size: 74, color: INK, maxWidth: 595 })
      // ⅓ di desain jatuh ke font cadangan (lebih sempit): rata kiri di x hasil ukur
      text(ctx, 'LP · 33⅓', 718.7, 820.6, { family: MONO, size: 16, weight: 700, color: INK })

      // daftar lagu sisi A
      const titles = songTitles(texts.catatan, 4)
      TIMES.forEach((t, i) => {
        const y = 980 + i * 49
        text(ctx, `A${i + 1}. ${titles[i]}`, 70, y, { family: MONO, size: 20, color: INK, maxWidth: 860 })
        text(ctx, t, 1010, y, { family: MONO, size: 20, color: INK, align: 'right' })
        box(ctx, 70, y + 37, 940, 2, 'rgba(28,27,25,0.3)')
      })
    },
    over(ctx) {
      photoInset(ctx, 104, 154, 692, 600)
    },
  },
})
