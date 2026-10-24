// Sampul Album — design-reference/dark-grunge/sampul-album.html (1200x1800, 4 foto)
import { border, box, setShadow } from '../paint'
import { dark } from './define'
import { FONTS, FRAKTUR, MONO, SPECIAL, TEXTURE, join, ring, slotInset, tahun, txt, vignette } from './helpers'

const BG = '#0a0a0a'
const INK = '#d9d9d9'
const LINE = '#3a3a3a'
/** label rekaman pengganti [LABEL] */
const LABEL = 'bilik'
/** judul lagu 2–8 pengganti [JUDUL LAGU] (lagu 1 = catatan) */
const TRACKS = ['lampu kamar mati', 'pulang jam tiga', 'hujan di kaca', 'kota yang tidur', 'jangan dibaca', 'senyum di pojok', 'satu frame lagi', 'lagu terakhir']
const DURATIONS = ['3:50', '3:17', '3:11', '4:57', '4:27', '4:25', '5:24', '5:18']
const CELLS: [number, number][] = [
  [80, 203],
  [612, 203],
  [80, 661],
  [612, 661],
]

const SLOTS = CELLS.map(([x, y]) => ({ x: x + 2, y: y + 2, w: 504, h: 430 }))

export const sampulAlbum = dark({
  id: 'dark-sampul-album',
  name: 'sampul album',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: BG },
  placeholder: '#1c1c1c',
  // kotak foto desain: filter grayscale(1) contrast(1.4)
  filter: 'mono-kontras',
  fonts: FONTS,
  // nama band = nama, personel = nama & nama2, lagu 1 = catatan, tahun dari tanggal, studio = tempat
  fields: ['nama', 'nama2', 'catatan', 'tanggal', 'tempat'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      const nama = texts.nama?.trim()
      const nama2 = texts.nama2?.trim()
      const year = tahun(texts.tanggal)

      txt(ctx, nama ?? '', 80, 62, { family: FRAKTUR, size: 110, color: '#C1121F', maxWidth: 880 })
      const t = { family: SPECIAL, size: 18, color: INK, align: 'right' as const }
      txt(ctx, 'album penuh', 1120, year ? 133 : 151, t)
      txt(ctx, year, 1120, 151, t)

      for (const [x, y] of CELLS) border(ctx, x, y, 508, 434, 2, LINE)
      // CD menyembul dari kanan: elemen positioned di atas garis kotak, tapi di bawah kotak foto (filter = stacking context sesudahnya)
      ctx.save()
      setShadow(ctx, -8, 0, 20, 'rgba(0,0,0,0.6)')
      ctx.beginPath()
      ctx.arc(1203, 943, 123, 0, Math.PI * 2)
      const g = ctx.createConicGradient(((30 - 90) * Math.PI) / 180, 1203, 943)
      ;['#e9edf2', '#f6d8e6', '#d8e8f6', '#e6f6d8', '#f2e9d8', '#e9edf2'].forEach((col, i) => g.addColorStop(i / 5, col))
      ctx.fillStyle = g
      ctx.fill()
      ctx.restore()
      ring(ctx, 1080, 820, 246, 3, '#8f959c')
      ctx.beginPath()
      ctx.arc(1206, 946, 38, 0, Math.PI * 2)
      ctx.fillStyle = BG
      ctx.fill()
      ring(ctx, 1168, 908, 76, 3, '#8f959c')

      // daftar lagu
      box(ctx, 80, 1129, 700, 2, LINE)
      const titles = [texts.catatan?.trim() || TRACKS[0], ...TRACKS.slice(1)]
      titles.forEach((s, i) => {
        const y = 1147 + i * 26
        txt(ctx, `0${i + 1}. ${s}`, 80, y, { family: SPECIAL, size: 18, color: INK, maxWidth: 600 })
        txt(ctx, DURATIONS[i], 780, y, { family: SPECIAL, size: 18, color: INK, align: 'right' })
      })
      const c = { family: SPECIAL, size: 14, color: '#9a9a9a', maxWidth: 700 }
      txt(ctx, join([nama && `${nama} — vokal`, nama2 && `${nama2} — gitar`]), 80, 1372, c)
      txt(ctx, join([nama && `${nama} — bas`, nama2 && `${nama2} — drum`]), 80, 1393, c)

      // cap label bulat
      ring(ctx, 1024, 1129, 96, 3, INK)
      txt(ctx, LABEL, 1072, 1163.8, { family: SPECIAL, size: 12, color: INK, align: 'center' })
      txt(ctx, 'REC.', 1072, 1177, { family: SPECIAL, size: 12, color: INK, align: 'center' })

      box(ctx, 960.7, 1242.2, 159.3, 58.4, INK)
      txt(ctx, 'PERHATIAN', 1040.35, 1249.2, { family: MONO, size: 16, weight: 700, color: BG, align: 'center' })
      txt(ctx, 'VOLUME TINGGI', 1040.35, 1268.4, { family: MONO, size: 16, weight: 700, color: BG, align: 'center' })

      // barcode: repeating-linear-gradient(90deg, ...) periode 16px
      ctx.fillStyle = INK
      for (let p = 0; p < 220; p += 16)
        for (const [a, b] of [
          [0, 3],
          [5, 6],
          [10, 14],
        ])
          if (p + a < 220) ctx.fillRect(900 + p + a, 1318, Math.min(b, 220 - p) - a, 60)

      const studio = texts.tempat?.trim()
      const credit = join([join(['℗', year, LABEL], ' '), studio && `direkam di ${studio}`])
      txt(ctx, credit, 1120, 1398, { family: SPECIAL, size: 13, color: INK, align: 'right', maxWidth: 300 })
    },
    over(ctx) {
      for (const s of SLOTS) slotInset(ctx, s)
    },
    top(ctx, { W, H }) {
      vignette(ctx, W, H)
    },
  },
})
