// Kaset — design-reference/retro-vintage/kaset.html (1080x1350, 2 foto)
import { border, box, linear, radial, text } from '../paint'
import { insetRing, photoInset } from './helpers'
import { retro } from './define'

const INK = '#1d1b17'
const MONO = 'IBM Plex Mono'
const MARKER = 'Permanent Marker'
/** daftar lagu di label kaset ([LAGU] di desain tidak punya field: copy tetap yang kalem) */
const SONGS = ['1. senyum dulu', '2. gaya bebas', '3. sekali lagi']

/** sekrup: radial-gradient(circle at 35% 35%, #9a9a9a, #3a3a3a 70%) */
function screw(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const px = x + 22 * 0.35
  const r = Math.hypot(22 - 22 * 0.35, 22 - 22 * 0.35)
  box(ctx, x, y, 22, 22, radial(ctx, px, y + 22 * 0.35, r, [[0, '#9a9a9a'], [0.7, '#3a3a3a'], [1, '#3a3a3a']]), 11)
}

/** gulungan pita: border 10px #3a3a3a, isi radial-gradient(circle, ...) di padding box 100x100, inset 2px putih, poros */
function reel(ctx: CanvasRenderingContext2D, x: number) {
  const cx = x + 60
  const cy = 1119
  box(ctx, x, 1059, 120, 120, '#3a3a3a', 60)
  const R = 50 * Math.SQRT2
  const g = radial(ctx, cx, cy, R, [
    [0, '#f1ead8'], [0.22, '#f1ead8'], [0.23, '#3a2416'], [0.6, '#3a2416'],
    [0.61, '#5a3a22'], [0.63, '#5a3a22'], [0.64, '#3a2416'], [1, '#3a2416'],
  ])
  box(ctx, x + 10, 1069, 100, 100, g, 50)
  insetRing(ctx, x + 10, 1069, 100, 100, 2, 'rgba(255,255,255,0.08)', 50)
  box(ctx, x + 42, 1101, 36, 36, '#2b2b2b', 18)
}

export const kaset = retro({
  id: 'retro-kaset',
  name: 'kaset',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: '#E3B04B' },
  placeholder: '#DCD4BF',
  fonts: ['Playfair Display:700,900', 'IBM Plex Mono:400,600', 'Permanent Marker', 'VT323'],
  fields: ['catatan', 'tanggal', 'nama'],
  texture: { opacity: 0.14, blend: 'multiply' },
  slots: [
    { x: 128, y: 247, w: 402, h: 470 },
    { x: 550, y: 247, w: 402, h: 470 },
  ],
  draw: {
    under(ctx, { texts }) {
      // badan kaset + label
      box(ctx, 60, 90, 960, 1154, '#2b2b2b', 36)
      box(ctx, 100, 130, 880, 833, '#F1EAD8', 14)

      // sisi A + judul mixtape
      border(ctx, 128, 163.5, 58, 58, 3, INK, 29)
      text(ctx, 'A', 157, 175.5, { family: MONO, size: 26, weight: 600, color: INK, align: 'center' })
      const judul = texts.catatan?.trim() || 'mixtape kita'
      text(ctx, judul, 200, 158, { family: MARKER, size: 48, color: INK, maxWidth: 640 })
      text(ctx, '60 MENIT', 952, 181, { family: MONO, size: 18, weight: 600, color: INK, align: 'right' })

      // garis warna + daftar lagu
      box(ctx, 128, 737, 824, 14, '#E2683C')
      box(ctx, 128, 759, 824, 14, '#E8B04B')
      SONGS.forEach((s, i) => {
        const y = 793 + i * 54
        box(ctx, 128, y + 32, 824, 2, '#8a7f66')
        text(ctx, s, 134, y, { family: MARKER, size: 20, color: '#6b5f45' })
      })

      for (const [x, y] of [[72, 102], [986, 102], [72, 1006], [986, 1006]]) screw(ctx, x, y)
      text(ctx, 'C-60 · TYPE I', 110, 989, { family: MONO, size: 15, color: '#cfc8b4' })
      text(ctx, 'NORMAL BIAS', 970, 989, { family: MONO, size: 15, color: '#cfc8b4', align: 'right' })

      // jendela pita
      box(ctx, 100, 1034, 880, 170, '#1a1a1a', 80)
      reel(ctx, 156.7)
      box(ctx, 390, 1089, 300, 60, linear(ctx, 390, 1089, 300, 60, 180, [[0, '#4a2e1a'], [1, '#2a1a0e']]), 6)
      box(ctx, 390, 1089, 300, 60, linear(ctx, 390, 1089, 300, 60, 180, [[0, 'rgba(255,255,255,0.18)'], [0.4, 'rgba(255,255,255,0.02)'], [1, 'rgba(255,255,255,0.02)']]), 6)
      insetRing(ctx, 390, 1089, 300, 60, 2, 'rgba(255,255,255,0.12)', 6)
      box(ctx, 400, 1113, 280, 6, linear(ctx, 400, 1113, 280, 6, 90, [[0, '#6a4226'], [0.5, '#8a5a34'], [1, '#6a4226']]))
      reel(ctx, 803.3)

      const footer = [texts.tanggal?.trim(), texts.nama?.trim()].filter(Boolean).join(' · ')
      text(ctx, footer, 540, 1284, { family: MONO, size: 18, color: INK, align: 'center', maxWidth: 940 })
    },
    over(ctx) {
      photoInset(ctx, 128, 247, 402, 470)
      photoInset(ctx, 550, 247, 402, 470)
    },
  },
})
