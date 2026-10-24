// Poster Film — design-reference/editorial-majalah/poster-film.html (600x1800 strip, 3 foto)
import { border, box, font, type Ctx } from '../paint'
import { editorial } from './define'
import { FONTS, fotoInset, join, lines, MONO, SERIF, TEXTURE, txt, wrap } from './helpers'

const BG = '#0E0E0E'
const C = '#EDEAE4'
/** garis pengganti sinopsis: [x, lebar] (90%, 80%, 86%, 60% dari 512, di tengah) */
const BARS: [number, number][] = [[69.6, 460.8], [95.2, 409.6], [79.8, 440.3], [146.4, 307.2]]
/** daun laurel SVG (viewBox 200x110 di 200,1250): cx, cy, rotate */
const LEAVES: [number, number, number][] = [
  [30, 80, -40], [22, 58, -20], [22, 36, 0], [30, 16, 20],
  [170, 80, 40], [178, 58, 20], [178, 36, 0], [170, 16, -20],
]

/** <text text-anchor="middle"> SVG: y = baseline */
function svgText(ctx: Ctx, s: string, cx: number, base: number, maxW: number) {
  if (!s) return
  ctx.save()
  let size = 13
  ctx.font = font(MONO, size)
  const w = ctx.measureText(s).width
  if (w > maxW) {
    size = Math.max(6, (size * maxW) / w)
    ctx.font = font(MONO, size)
  }
  ctx.filter = 'opacity(1)'
  ctx.fillStyle = '#BDB8AE'
  ctx.textAlign = 'center'
  ctx.fillText(s, cx, base)
  ctx.restore()
}

export const posterFilm = editorial({
  id: 'editorial-poster-film',
  name: 'poster film',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#2A2A2A',
  fonts: FONTS,
  // sutradara = nama, judul film = catatan, festival = tempat, tanggal tayang = tanggal; kredit: nama & nama2
  fields: ['nama', 'nama2', 'catatan', 'tempat', 'tanggal'],
  texture: TEXTURE,
  slots: [90, 472, 854].map((y) => ({ x: 44, y, w: 512, h: 360 })),
  draw: {
    under(ctx, { texts }) {
      const nama = texts.nama?.trim().toUpperCase()
      txt(ctx, nama ? `SEBUAH FILM OLEH ${nama}` : 'SEBUAH FILM', 300, 50, { family: MONO, size: 14, color: C, ls: 4.2, align: 'center', maxWidth: 400 })

      // label rating
      border(ctx, 506.8, 40, 49.2, 30, 2, C)
      txt(ctx, '13+', 518.8, 46, { family: MONO, size: 14, color: C })

      // laurel seleksi festival
      ctx.fillStyle = '#8F8A80'
      for (const [cx, cy, r] of LEAVES) {
        ctx.beginPath()
        ctx.ellipse(200 + cx, 1250 + cy, 7, 15, (r * Math.PI) / 180, 0, Math.PI * 2)
        ctx.fill()
      }
      svgText(ctx, 'SELEKSI RESMI', 300, 1295, 124)
      const fest = texts.tempat?.trim().toUpperCase()
      if (fest) svgText(ctx, `FESTIVAL ${fest}`, 300, 1316, 124)

      // judul (kolom rata bawah: judul, garis sinopsis, tanggal)
      const judul = texts.catatan?.trim() || 'hari yang baik'
      const t = { family: SERIF, size: 66, color: C, align: 'center' as const }
      const w = wrap(ctx, judul, t, 512, 2)
      const lh = w.size * 0.95
      lines(ctx, w.lines, 300, 1656 - w.lines.length * lh, 0.95, { ...t, size: w.size })
      BARS.forEach(([x, bw], i) => box(ctx, x, 1674 + i * 11, bw, 5, '#4A4A4A'))
      txt(ctx, texts.tanggal?.trim() ?? '', 300, 1730, { family: MONO, size: 16, color: C, ls: 3.2, align: 'center', maxWidth: 512 })
    },
    over(ctx) {
      for (const y of [90, 472, 854]) fotoInset(ctx, 44, y, 512, 360)
    },
    top(ctx, { texts }) {
      // kredit di atas lapisan noise (di desain sesudah div texture); maks. 2 baris
      const a = texts.nama?.trim().toUpperCase()
      const b = texts.nama2?.trim().toUpperCase()
      const kredit = join([a && `SUTRADARA ${a}`, b && `PRODUSER ${b}`, a && `MUSIK ${a}`, b && `SINEMATOGRAFI ${b}`])
      if (!kredit) return
      const o = { family: MONO, size: 11, color: '#8A8A8A', ls: 0.88, align: 'center' as const }
      const k = wrap(ctx, kredit, o, 512, 2)
      lines(ctx, k.lines, 300, 1752, 14 / 11, { ...o, size: k.size })
    },
  },
})
