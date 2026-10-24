// Koper Stiker — design-reference/travel/koper-stiker.html (1200x1800 4R, 4 foto)
import { border, box, dropShadow, insetShadows, linear, rrPath, rrPathRaw, type Ctx } from '../paint'
import { travel } from './define'
import {
  daftarTempat, dashedV, disc, ellipseRadial, GOLD, insetSpread, join, lineBox, MONO, ring, rotated, rotSlot, SERIF, tahun, txt,
} from './helpers'

const SUIT = '#8C3B2E'
const LEATHER = '#6a4222'
const INK_K = '#2a1e14'
const CREAM = '#F6F1E4'
const PH = '#E5E0D4'
const PLAYFAIR = 'Playfair Display'

/** stiker di grid (lokal, sebelum diputar): x, y, tinggi, rotasi */
const ST = [
  { x: 165, y: 400, h: 400, rot: -5 },
  { x: 635, y: 400, h: 400, rot: 4 },
  { x: 165, y: 860, h: 396, rot: 3 },
  { x: 635, y: 860, h: 396, rot: -4 },
]
const mid = (i: number) => ({ ox: ST[i].x + 200, oy: ST[i].y + ST[i].h / 2 })

// tinggi baris (line-height normal Blink) dihitung dari metrik font: Space Mono 13px = 20, 12px = 17,
// Libre Caslon 38px bold = 47. Stiker 1 (flex kolom di tengah): 20 + 10 + 210 + 10 + 47 + 10 + 17 = 324
const S1_TOP = 400 + (400 - 324) / 2
const ELLIPSE = { x: 230, y: S1_TOP + 30, w: 270, h: 210 }
/** kotak foto stiker 2-4: padding 16, header 17, jarak 10 */
const photoTop = (i: number) => ST[i].y + 16 + 17 + 10

const SLOTS = [
  rotSlot(mid(0).ox, mid(0).oy, 365, ELLIPSE.y + 105, 270, 210, -5),
  ...[1, 2, 3].map((i) => rotSlot(mid(i).ox, mid(i).oy, ST[i].x + 200, photoTop(i) + 120, 368, 240, ST[i].rot)),
]

function inSticker(ctx: Ctx, i: number, draw: () => void) {
  rotated(ctx, mid(i).ox, mid(i).oy, ST[i].rot, draw)
}

function polygon(ctx: Ctx, pts: [number, number][]) {
  ctx.beginPath()
  pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
  ctx.closePath()
}

/** sudut logam koper: segitiga (clip-path) dari kotak 90x90 bersudut bulat 18 */
function corner(ctx: Ctx, x: number, y: number, r: [number, number, number, number], tri: [number, number][], dot: [number, number]) {
  ctx.save()
  polygon(ctx, tri.map(([px, py]) => [x + px * 90, y + py * 90]))
  ctx.clip()
  box(ctx, x, y, 90, 90, linear(ctx, x, y, 90, 90, 135, GOLD), r)
  disc(ctx, dot[0], dot[1], 12, '#5a3e14')
  ctx.restore()
}

function strap(ctx: Ctx, x: number) {
  dropShadow(ctx, x, 230, 70, 1300, 0, 2, 4, 'rgba(0,0,0,0.3)')
  box(ctx, x, 230, 70, 1300, linear(ctx, x, 230, 70, 1300, 180, [[0, '#8a5a32'], [1, LEATHER]]))
  border(ctx, x, 230, 70, 1300, 2, 'rgba(0,0,0,0.2)')
  dashedV(ctx, x + 8, 230, 1300, 2, 'rgba(240,220,180,0.4)', [6, 4])
  dashedV(ctx, x + 60, 230, 1300, 2, 'rgba(240,220,180,0.4)', [6, 4])
  // gesper
  dropShadow(ctx, x + 8, 830, 54, 70, 0, 2, 3, 'rgba(0,0,0,0.4)', 6)
  box(ctx, x + 8, 830, 54, 70, linear(ctx, x + 8, 830, 54, 70, 135, GOLD), 6)
  box(ctx, x + 20, 846, 30, 36, '#5a3e14', 4)
}

/** isi stiker 2-4: header (label kiri, nomor kanan), bingkai 4px foto, nama kota */
function card(ctx: Ctx, i: number, label: string, color: string, kota: string) {
  const s = ST[i]
  const head = { family: MONO, size: 12, color, ls: 2.4 }
  txt(ctx, label, s.x + 16, s.y + 16, head)
  txt(ctx, `No. 0${i + 1}`, s.x + 384, s.y + 16, { ...head, align: 'right' })
  const py = photoTop(i)
  box(ctx, s.x + 12, py - 4, 376, 248, color)
  txt(ctx, kota, s.x + 200, py + 250, {
    family: PLAYFAIR, size: 40, weight: 700, italic: true, color, align: 'center', maxWidth: 368,
  })
}

export const koperStiker = travel({
  id: 'travel-koper-stiker',
  name: 'koper stiker',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#D9CFBE' },
  placeholder: PH,
  fonts: ['Libre Caslon Text:400,700', 'Space Mono:400,700', 'Playfair Display:700i'],
  fields: ['nama', 'tempat', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      ellipseRadial(ctx, 0, 0, W, H, 600, 540, [[0, '#f3ede2'], [0.75, '#D9CFBE']])

      // pegangan: border 30px tanpa sisi bawah, radius 60 60 0 0; inset 0 4px 0 putih di padding box
      ctx.beginPath()
      rrPath(ctx, 470, 120, 260, 120, [60, 60, 0, 0])
      rrPathRaw(ctx, 500, 150, 200, 90, [30, 30, 0, 0])
      ctx.fillStyle = LEATHER
      ctx.fill('evenodd')
      insetShadows(ctx, 500, 150, 200, 90, [{ dx: 0, dy: 4, color: 'rgba(255,255,255,0.15)' }], [30, 30, 0, 0])
      for (const x of [440, 700]) box(ctx, x, 220, 60, 40, linear(ctx, x, 220, 60, 40, 135, GOLD), 6)

      // badan koper
      dropShadow(ctx, 90, 250, 1020, 1300, 0, 30, 50, 'rgba(0,0,0,0.35)', 20)
      box(ctx, 90, 250, 1020, 1300, SUIT, 20)
      ctx.save()
      ctx.beginPath()
      rrPath(ctx, 90, 250, 1020, 1300, 20)
      ctx.clip()
      // repeating-linear-gradient(0deg, 2px gelap / 4px bening) dari bawah
      ctx.fillStyle = 'rgba(0,0,0,0.035)'
      for (let y = 1550; y > 250; y -= 6) ctx.fillRect(90, y - 2, 1020, 2)
      ctx.restore()
      ellipseRadial(ctx, 90, 250, 1020, 1300, 90 + 306, 250 + 195, [[0, 'rgba(255,255,255,0.10)'], [0.45, 'rgba(255,255,255,0)']], 20)
      insetSpread(ctx, 90, 250, 1020, 1300, 10, 'rgba(255,255,255,0.05)', 20)
      insetSpread(ctx, 90, 250, 1020, 1300, 6, 'rgba(0,0,0,0.12)', 20)

      dropShadow(ctx, 90, 320, 1020, 18, 0, 2, 0, 'rgba(255,255,255,0.08)')
      box(ctx, 90, 320, 1020, 18, 'rgba(0,0,0,0.15)')
      strap(ctx, 300)
      strap(ctx, 830)
      corner(ctx, 84, 244, [18, 0, 0, 0], [[0, 0], [1, 0], [0, 1]], [102, 262])
      corner(ctx, 1026, 244, [0, 18, 0, 0], [[0, 0], [1, 0], [1, 1]], [1086, 262])
      corner(ctx, 84, 1466, [0, 0, 0, 18], [[0, 0], [0, 1], [1, 1]], [102, 1526])
      corner(ctx, 1026, 1466, [0, 0, 18, 0], [[1, 0], [1, 1], [0, 1]], [1086, 1526])

      // stiker (kota dari tempat, dipisah koma)
      const kota = daftarTempat(texts.tempat, 4)
      inSticker(ctx, 0, () => {
        dropShadow(ctx, 165, 400, 400, 400, 0, 6, 10, 'rgba(0,0,0,0.3)', 200)
        box(ctx, 165, 400, 400, 400, '#F2E2B8', 200)
        const blue = '#2E5E8C'
        txt(ctx, 'SALAM DARI', 365, S1_TOP, { family: MONO, size: 13, color: blue, ls: 3.9, align: 'center' })
        txt(ctx, kota[0], 365, S1_TOP + 250, { family: SERIF, size: 38, weight: 700, color: blue, align: 'center', maxWidth: 330 })
        txt(ctx, texts.tanggal?.trim() ?? '', 365, S1_TOP + 307, { family: MONO, size: 12, color: blue, align: 'center', maxWidth: 260 })
      })
      inSticker(ctx, 1, () => {
        // filter drop-shadow: blur = deviasi standar (shadowBlur 2×)
        dropShadow(ctx, 635, 400, 400, 400, 0, 6, 16, 'rgba(0,0,0,0.3)')
        box(ctx, 635, 400, 400, 400, CREAM)
        card(ctx, 1, 'HOTEL', '#9E3A2E', kota[1])
      })
      // stiker 3 & 4 ber-clip-path: bayangan drop-shadow ikut terpotong (tidak tampak)
      inSticker(ctx, 2, () => {
        polygon(ctx, [[165, 860], [565, 860], [565, 860 + 396 * 0.78], [365, 1256], [165, 860 + 396 * 0.78]])
        ctx.fillStyle = '#2E5E8C'
        ctx.fill()
        card(ctx, 2, 'PELABUHAN', CREAM, kota[2])
      })
      inSticker(ctx, 3, () => {
        const [x, y, w, h] = [635, 860, 400, 396]
        const a = w * 0.04
        const b = h * 0.04
        polygon(ctx, [[x + a, y], [x + w - a, y], [x + w, y + b], [x + w, y + h - b], [x + w - a, y + h], [x + a, y + h], [x, y + h - b], [x, y + b]])
        ctx.fillStyle = '#3C7A55'
        ctx.fill()
        card(ctx, 3, 'STASIUN', CREAM, kota[3])
      })

      // label bagasi (rotate 8deg di tengah atas)
      rotated(ctx, 935, 1530, 8, () => {
        box(ctx, 930, 1490, 6, 60, LEATHER)
        dropShadow(ctx, 860, 1540, 150, 190, 0, 8, 12, 'rgba(0,0,0,0.3)', 10)
        box(ctx, 860, 1540, 150, 190, CREAM, 10)
        const nama = texts.nama?.trim() ?? ''
        // flex kolom di tengah: lingkaran 22 + 6 + baris 20 (+ 6 + baris 20)
        const lh = lineBox(ctx, MONO, 13)
        const total = 22 + 6 + lh + (nama ? 6 + lh : 0)
        const top = 1540 + (190 - total) / 2
        ring(ctx, 924, top, 22, 3, INK_K)
        const o = { family: MONO, size: 13, color: INK_K, align: 'center' as const, maxWidth: 140 }
        if (nama) txt(ctx, nama, 935, top + 28, { ...o, weight: 700 })
        txt(ctx, 'bagasi 01', 935, top + 28 + (nama ? lh + 6 : 0), o)
      })

      txt(ctx, 'Koper Kita', 90, 1660, { family: SERIF, size: 54, weight: 700, color: INK_K })
      txt(ctx, join(['4 kota', tahun(texts.tanggal)]), 90, 1730, { family: MONO, size: 15, color: '#6a5a48' })
    },
    over(ctx) {
      // jendela foto stiker 1 berbentuk elips (overflow hidden + radius 50%) + cincin 4px
      inSticker(ctx, 0, () => {
        const { x, y, w, h } = ELLIPSE
        const cx = x + w / 2
        const cy = y + h / 2
        ctx.beginPath()
        ctx.rect(x - 1, y - 1, w + 2, h + 2)
        ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2)
        ctx.fillStyle = '#F2E2B8'
        ctx.fill('evenodd')
        ctx.beginPath()
        ctx.ellipse(cx, cy, w / 2 + 4, h / 2 + 4, 0, 0, Math.PI * 2)
        ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2)
        ctx.fillStyle = '#2E5E8C'
        ctx.fill('evenodd')
      })
    },
  },
})
