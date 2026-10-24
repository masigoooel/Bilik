// Poster Pameran — design-reference/editorial-majalah/poster-pameran.html (1080x1350, 2 foto)
import { box, dropShadow, linear, radial, type Ctx } from '../paint'
import { editorial } from './define'
import { FONTS, fotoInset, INK, join, lineTop, MONO, SERIF, TEXTURE, txt } from './helpers'

const C = '#141414'
/** grid 3 kolom (gap 20) di lebar 960 */
const CW = (960 - 40) / 3

/**
 * stop gradien lipatan. CSS menginterpolasi warna premultiplied: dari #d9d4c8 ke rgba(0,0,0,0.15)
 * warnanya tetap terang (canvas tanpa premultiply membuat garis gelap), jadi tambahkan stop antara.
 */
const FOLD: [number, string][] = [[0, '#d9d4c8']]
for (let i = 0; i <= 8; i++) {
  const f = i / 8
  const a = 1 - f * 0.85
  const k = (1 - f) / a
  FOLD.push([0.4 + f * 0.01, `rgba(${217 * k},${212 * k},${200 * k},${a})`])
}
FOLD.push([0.6, 'rgba(0,0,0,0)'])

/** paku payung: radial-gradient(circle at 35% 30%, #fff, #c0311f 55%) + box-shadow 2px 3px 3px */
function pin(ctx: Ctx, x: number, y: number) {
  dropShadow(ctx, x, y, 22, 22, 2, 3, 3, 'rgba(0,0,0,0.35)', 11)
  const cx = x + 22 * 0.35
  const cy = y + 22 * 0.3
  box(ctx, x, y, 22, 22, radial(ctx, cx, cy, Math.hypot(22 - (cx - x), 22 - (cy - y)), [[0, '#ffffff'], [0.55, '#c0311f']]), 11)
}

export const posterPameran = editorial({
  id: 'editorial-poster-pameran',
  name: 'poster pameran',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: '#F5F2EC' },
  // #DDD9D0 setelah grayscale(1) di desain
  placeholder: '#D9D9D9',
  // kotak FOTO di desain memakai filter: grayscale(1)
  filter: 'mono',
  fonts: FONTS,
  // fotografer = nama & nama2, tanggal pameran = tanggal (apa adanya), tempat = tempat
  fields: ['nama', 'nama2', 'tanggal', 'tempat'],
  texture: TEXTURE,
  slots: [
    { x: 60, y: 60, w: 480, h: 620 },
    { x: 540, y: 60, w: 480, h: 620 },
  ],
  draw: {
    under(ctx, { texts }) {
      // judul tetap "dua sisi" (2 baris, line-height 0.82)
      const t = { family: SERIF, size: 210, weight: 800, color: C, ls: -8.4 }
      txt(ctx, 'dua', 60, lineTop(ctx, SERIF, 210, 0.82, 704, 800), t)
      txt(ctx, 'sisi', 60, lineTop(ctx, SERIF, 210, 0.82, 704 + 172.2, 800), t)

      // kaki: tiga kolom rata bawah
      box(ctx, 60, 1072.4, 960, 2, INK)
      const reg = { family: MONO, size: 14, color: INK }
      const bold = { ...reg, weight: 600 }
      const cols: [string, string][] = [
        ['pameran foto', join([texts.nama, texts.nama2], ' & ')],
        [texts.tanggal?.trim() ?? '', texts.tempat?.trim() ?? ''],
      ]
      cols.forEach(([a, b], i) => {
        const x = 60 + i * (CW + 20)
        // baris kosong: baris lain turun ke bawah (kolom rata bawah)
        const rows = [a && { s: a, o: reg }, b && { s: b, o: bold }].filter(Boolean) as { s: string; o: typeof reg }[]
        rows.forEach((r, j) => txt(ctx, r.s, x, 1290 - (rows.length - j) * 18, { ...r.o, maxWidth: CW }))
      })
      txt(ctx, 'masuk gratis', 1020, 1254, { ...reg, align: 'right' })
      txt(ctx, 'selasa–minggu', 1020, 1272, { ...bold, align: 'right' })
    },
    over(ctx) {
      fotoInset(ctx, 60, 60, 480, 620)
      fotoInset(ctx, 540, 60, 480, 620)
      // paku di empat sudut (yang kiri atas menimpa pojok foto)
      for (const [x, y] of [[40, 40], [1018, 40], [40, 1288], [1018, 1288]]) pin(ctx, x, y)
      // sudut kertas terlipat (menutupi sebagian paku kanan bawah, sama seperti desain)
      box(ctx, 930, 1230, 150, 120, linear(ctx, 930, 1230, 150, 120, 315, FOLD))
    },
  },
})
