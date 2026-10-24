// Plang Penunjuk — design-reference/travel/plang-penunjuk.html (600x1800 strip, 3 foto)
import { border, box, dropShadow, insetShadows, linear, radial, svgPath, type Ctx } from '../paint'
import { travel } from './define'
import {
  daftarTempat, disc, dropShadowShape, ellipseRadial, FONTS_NO_HAND, INK, insetSpread, join, MONO, rotated, rotSlot, SERIF, txt,
} from './helpers'

const CREAM = '#F6F1E4'
const SKY = '#BFD9EE'

/** papan: y atas (flex kolom, jarak 44), arah ujung, rotasi, warna gradien, jarak */
const SIGNS = [
  { y: 181, left: true, rot: -4, c1: '#2E5E8C', c2: '#22486c', km: '12 km' },
  { y: 618, left: false, rot: 3, c1: '#3C7A55', c2: '#2c5c40', km: '128 km' },
  { y: 1055, left: true, rot: -2, c1: '#9E3A2E', c2: '#7a2a20', km: '1.017 km' },
]
const SW = 540
const SH = 393
/** isi papan (padding 20 24 20 76 / 20 76 20 24) */
const innerX = (s: (typeof SIGNS)[number]) => (s.left ? 106 : 54)
const center = (s: (typeof SIGNS)[number]) => ({ ox: 300, oy: s.y + SH / 2 })

const SLOTS = SIGNS.map((s) => rotSlot(300, s.y + SH / 2, innerX(s) + 6 + 214, s.y + 26 + 140, 428, 280, s.rot))

function signPoly(ctx: Ctx, s: (typeof SIGNS)[number]) {
  const t = s.y
  const b = s.y + SH
  const m = s.y + SH / 2
  const k = SW * 0.12
  if (s.left) {
    ctx.moveTo(30 + k, t)
    ctx.lineTo(570, t)
    ctx.lineTo(570, b)
    ctx.lineTo(30 + k, b)
    ctx.lineTo(30, m)
  } else {
    ctx.moveTo(30, t)
    ctx.lineTo(570 - k, t)
    ctx.lineTo(570, m)
    ctx.lineTo(570 - k, b)
    ctx.lineTo(30, b)
  }
  ctx.closePath()
}

const bolts = (s: (typeof SIGNS)[number]) => [s.y + 20, s.y + 410].map((y) => ({ x: s.left ? 386 : 314, y }))

function bolt(ctx: Ctx, x: number, y: number) {
  dropShadow(ctx, x, y, 16, 16, 0, 1, 2, 'rgba(0,0,0,0.5)', 8)
  disc(ctx, x, y, 16, radial(ctx, x + 5.6, y + 4.8, Math.hypot(10.4, 11.2), [[0, '#e0e0e0'], [0.7, '#6a6a6a']]))
}

/** repeating-linear-gradient pada kotak (cx, cy) bersudut CSS deg: isi pita [d0, d1) tiap periode */
function stripes(ctx: Ctx, cx: number, cy: number, w: number, h: number, deg: number, period: number, bands: [number, number, string][]) {
  const a = (deg * Math.PI) / 180
  const len = Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a))
  const reach = Math.hypot(w, h)
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(a)
  for (let d = 0; d < len; d += period) {
    for (const [d0, d1, c] of bands) {
      ctx.fillStyle = c
      ctx.fillRect(-reach, len / 2 - d - d1, 2 * reach, d1 - d0)
    }
  }
  ctx.restore()
}

/** rumput: svg 40x62, scale di tengah bawah, isi di luar viewport terpotong */
const BLADES: [string, number, number][] = [
  ['M10 60 Q 5 43 -2 26', 2.4, 0], ['M14 60 Q 12 37 8 14', 3, 1], ['M18 60 Q 19 33 20 6', 2.4, 0], ['M22 60 Q 25 36 30 12', 3, 1],
  ['M26 60 Q 32 40 40 20', 2.4, 0], ['M30 60 Q 37 45 48 30', 3, 1], ['M20 60 Q 14 41 4 22', 2.4, 0], ['M24 60 Q 23 34 22 8', 3, 1],
]
const A = ['#86B272', '#7AA868', '#9CC486']
const B = ['#5E8A54', '#4E7A46', '#6E9C5E']
// [left, top, scale, warna terang, warna gelap] (indeks ke A / B)
const GRASS: [number, number, number, number, number][] = [
  [464, 1716, 1.06, 0, 0], [-4, 1646, 1.15, 0, 1], [332, 1701, 1.46, 0, 1], [378, 1603, 1.29, 1, 2], [422, 1600, 0.92, 0, 0],
  [125, 1689, 1.41, 0, 1], [382, 1586, 1.44, 1, 0], [219, 1667, 1.42, 0, 2], [396, 1631, 1.04, 0, 0], [-5, 1665, 0.84, 2, 2],
  [132, 1566, 0.97, 0, 1], [-7, 1591, 1.34, 0, 0], [328, 1562, 1.42, 1, 0], [7, 1688, 0.86, 1, 2], [192, 1667, 0.85, 1, 0],
  [85, 1708, 0.9, 1, 1], [32, 1573, 0.99, 1, 1], [142, 1628, 1.32, 0, 1], [114, 1663, 1.47, 0, 0], [507, 1571, 1.32, 1, 1],
  [568, 1582, 1.41, 1, 0], [364, 1675, 0.95, 1, 0], [8, 1657, 1.36, 0, 2], [433, 1588, 0.95, 2, 2], [322, 1582, 1.02, 0, 2],
  [519, 1574, 0.82, 2, 1], [499, 1648, 1.3, 1, 0], [57, 1668, 1.25, 2, 0], [512, 1655, 1.47, 2, 1], [132, 1730, 1.0, 2, 1],
  [20, 1572, 1.46, 2, 0], [158, 1590, 1.22, 0, 0], [52, 1675, 0.95, 2, 2], [5, 1650, 1.0, 1, 2], [274, 1595, 1.47, 1, 1],
  [293, 1590, 0.85, 0, 2], [565, 1658, 1.21, 1, 0], [270, 1712, 1.42, 2, 2], [91, 1572, 0.99, 0, 0], [76, 1601, 1.35, 0, 0],
  [197, 1605, 1.13, 1, 1], [548, 1659, 0.86, 2, 1], [258, 1697, 0.85, 0, 1], [436, 1699, 1.02, 1, 1], [57, 1724, 1.2, 0, 2],
  [219, 1595, 0.87, 2, 1], [454, 1575, 1.14, 1, 1], [44, 1714, 0.82, 2, 0],
]

function grass(ctx: Ctx, x: number, y: number, s: number, ca: string, cb: string) {
  ctx.save()
  ctx.translate(x + 20, y + 62)
  ctx.scale(s, s)
  ctx.translate(-20, -62)
  ctx.beginPath()
  ctx.rect(0, 0, 40, 62)
  ctx.clip()
  ctx.lineCap = 'round'
  for (const [d, lw, k] of BLADES) {
    ctx.strokeStyle = k ? cb : ca
    ctx.lineWidth = lw
    ctx.stroke(svgPath(d))
  }
  ctx.restore()
}

/** pohon: mahkota 90x110 (radius 50%/50%/46%/46%) + batang 12x40, scale di tengah bawah */
function tree(ctx: Ctx, x: number, y: number, s: number) {
  ctx.save()
  ctx.translate(x + 45, y + 150)
  ctx.scale(s, s)
  ctx.translate(-x - 45, -y - 150)
  const P = Math.PI
  ctx.beginPath()
  ctx.moveTo(x + 45, y)
  ctx.ellipse(x + 45, y + 55, 45, 55, 0, -P / 2, 0)
  ctx.lineTo(x + 90, y + 110 - 50.6)
  ctx.ellipse(x + 45, y + 110 - 50.6, 45, 50.6, 0, 0, P)
  ctx.lineTo(x, y + 55)
  ctx.ellipse(x + 45, y + 55, 45, 55, 0, P, P * 1.5)
  ctx.closePath()
  ctx.fillStyle = radial(ctx, x + 31.5, y + 33, Math.hypot(58.5, 77), [[0, '#8fc07a'], [1, '#4f7f44']])
  ctx.fill()
  box(ctx, x + 39, y + 110, 12, 40, '#6a4a28')
  ctx.restore()
}

/** awan: pil + dua box-shadow (offset, spread negatif) dengan warna sama */
function cloud(ctx: Ctx, x: number, y: number, w: number, h: number, sh: [number, number, number][]) {
  const c = 'rgba(255,255,255,0.85)'
  for (const [dx, dy, sp] of sh) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(-100, -100, 800, 2000)
    ctx.roundRect(x, y, w, h, h / 2)
    ctx.clip('evenodd')
    ctx.beginPath()
    ctx.roundRect(x + dx - sp, y + dy - sp, w + 2 * sp, h + 2 * sp, (h + 2 * sp) / 2)
    ctx.fillStyle = c
    ctx.fill()
    ctx.restore()
  }
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, h / 2)
  ctx.fillStyle = c
  ctx.fill()
}

function bird(ctx: Ctx, x: number, y: number, s: number) {
  ctx.save()
  ctx.translate(x + 20, y + 10)
  ctx.scale(s, s)
  ctx.translate(-20, -10)
  ctx.strokeStyle = '#3a4a5a'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.stroke(svgPath('M2 14 Q 10 2 20 12 Q 30 2 38 14'))
  ctx.restore()
}

/** radial-gradient(ellipse RXpx RYpx at cx cy, rgba(0,0,0,a), transparent) */
function blob(ctx: Ctx, cx: number, cy: number, rx: number, ry: number, a: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(1, ry / rx)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  g.addColorStop(0, `rgba(0,0,0,${a})`)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx)
  ctx.restore()
}

export const plangPenunjuk = travel({
  id: 'travel-plang-penunjuk',
  name: 'plang penunjuk',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: SKY },
  placeholder: '#E5E0D4',
  fonts: FONTS_NO_HAND,
  fields: ['tempat', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      // langit + matahari
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 180, [[0, SKY], [0.62, '#FDE7D0'], [0.86, '#DCE8D8']]))
      box(ctx, 0, 0, W, H, radial(ctx, 480, 144, Math.hypot(480, 1656), [
        [0, '#FFF2C2'], [0.08, 'rgba(255,226,150,0.6)'], [0.3, 'rgba(255,226,150,0)'],
      ]))

      // bukit + jalan setapak
      ctx.save()
      ctx.translate(0, 1180)
      ctx.fillStyle = '#A9C3B8'
      ctx.fill(svgPath('M0 220 C 80 120, 160 140, 240 190 C 320 110, 420 90, 600 180 L600 420 L0 420 Z'))
      ctx.fillStyle = '#8DB07E'
      ctx.fill(svgPath('M0 290 C 100 220, 200 250, 300 270 C 400 230, 500 230, 600 270 L600 420 L0 420 Z'))
      ctx.beginPath()
      ctx.rect(0, 0, 600, 420)
      ctx.clip()
      ctx.strokeStyle = '#E9D9B4'
      ctx.lineWidth = 40
      ctx.lineCap = 'round'
      ctx.stroke(svgPath('M210 420 C 250 360, 330 330, 380 290 C 400 275, 420 270, 440 268'))
      ctx.restore()

      tree(ctx, 40, 1300, 1)
      tree(ctx, 500, 1270, 0.8)
      tree(ctx, 120, 1360, 0.7)
      cloud(ctx, 40, 180, 160, 58, [[40, -19, -6], [-35, -10, -13]])
      cloud(ctx, 360, 330, 200, 72, [[50, -24, -8], [-44, -12, -16]])
      cloud(ctx, 120, 620, 140, 50, [[35, -17, -6], [-31, -8, -11]])
      bird(ctx, 420, 150, 1)
      bird(ctx, 470, 190, 0.7)
      bird(ctx, 380, 210, 0.6)
      // (bunga-bunga kecil di desain tertutup tanah di bawahnya: tidak tampak)

      // kupu-kupu
      ctx.save()
      ctx.translate(470, 1460)
      const bf = svgPath('M20 15 C 10 2, 0 6, 4 14 C 8 22, 16 18, 20 15 Z M20 15 C 30 2, 40 6, 36 14 C 32 22, 24 18, 20 15 Z')
      ctx.fillStyle = '#FF8FAB'
      ctx.fill(bf)
      ctx.strokeStyle = '#3a4a5a'
      ctx.lineWidth = 1.2
      ctx.stroke(bf)
      ctx.restore()

      // tanah
      box(ctx, 0, 1570, W, 230, linear(ctx, 0, 1570, W, 230, 180, [[0, '#8DB07E'], [1, '#5E8A54']]))
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 1570, W, 230)
      ctx.clip()
      stripes(ctx, 300, 1685, W, 230, 170, 9, [[0, 3, 'rgba(255,255,255,0.03)']])
      blob(ctx, 420, 1570 + 138, 80, 16, 0.07)
      blob(ctx, 120, 1570 + 69, 60, 14, 0.08)
      ctx.restore()
      for (const [x, y, s, a, b] of GRASS) grass(ctx, x, y, s, A[a], B[b])

      // tiang kayu + tutup
      dropShadow(ctx, 268, 40, 64, 1600, 6, 0, 14, 'rgba(0,0,0,0.2)', [6, 6, 0, 0])
      box(ctx, 268, 40, 64, 1600, linear(ctx, 268, 40, 64, 1600, 90, [[0, '#5e3f22'], [0.45, '#8a6236'], [1, '#6e4a28']]), [6, 6, 0, 0])
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(268, 40, 64, 1600, [6, 6, 0, 0])
      ctx.clip()
      for (let x = 268; x < 332; x += 23) {
        ctx.fillStyle = 'rgba(0,0,0,0.12)'
        ctx.fillRect(x + 9, 40, 1, 1600)
        ctx.fillStyle = 'rgba(255,230,190,0.08)'
        ctx.fillRect(x + 22, 40, 1, 1600)
      }
      ctx.restore()
      insetShadows(ctx, 268, 40, 64, 1600, [{ dx: -8, dy: 0, blur: 10, color: 'rgba(0,0,0,0.3)' }], [6, 6, 0, 0])
      box(ctx, 256, 26, 88, 26, linear(ctx, 256, 26, 88, 26, 180, [[0, '#6a4a28'], [1, '#4a3018']]), 4)

      // judul
      dropShadow(ctx, 178.9, 70, 242.1, 67, 0, 6, 10, 'rgba(0,0,0,0.2)')
      box(ctx, 178.9, 70, 242.1, 67, CREAM)
      border(ctx, 178.9, 70, 242.1, 67, 3, INK)
      txt(ctx, 'arah pulang', 300, 85, { family: SERIF, size: 30, weight: 700, color: INK, align: 'center' })

      // papan penunjuk (kota dari tempat, dipisah koma)
      const kota = daftarTempat(texts.tempat, 3)
      SIGNS.forEach((s, i) => {
        const { ox, oy } = center(s)
        rotated(ctx, ox, oy, s.rot, () => {
          // filter drop-shadow seluruh papan (+ baut): blur = deviasi standar → shadowBlur 2×
          const shape = () => {
            signPoly(ctx, s)
            for (const b of bolts(s)) {
              ctx.moveTo(b.x + 16, b.y + 8)
              ctx.arc(b.x + 8, b.y + 8, 8, 0, Math.PI * 2)
            }
          }
          dropShadowShape(ctx, shape, { x: 30, y: s.y, w: SW, h: SH + 40 }, 0, 10, 20, 'rgba(0,0,0,0.35)')
          ctx.save()
          ctx.beginPath()
          signPoly(ctx, s)
          ctx.clip()
          box(ctx, 30, s.y, SW, SH, linear(ctx, 30, s.y, SW, SH, 180, [[0, s.c1], [1, s.c2]]))
          stripes(ctx, 300, s.y + SH / 2, SW, SH, 2, 20, [[7, 8, 'rgba(0,0,0,0.10)'], [19, 20, 'rgba(255,240,210,0.07)']])
          insetSpread(ctx, 30, s.y, SW, SH, 4, 'rgba(0,0,0,0.2)')
          const fx = innerX(s)
          box(ctx, fx, s.y + 20, 440, 292, CREAM)
          border(ctx, fx, s.y + 20, 440, 292, 1, 'rgba(0,0,0,0.2)')
          // baris kota + jarak (align baseline: Space Mono 20px turun 17px dari Caslon 40px)
          const row = s.y + 324
          const km = { family: MONO, size: 20, weight: 700, color: CREAM }
          const kw = txt(ctx, s.km, fx + 440, row + 17, { ...km, align: 'right' })
          const k = { family: SERIF, size: 40, weight: 700, maxWidth: 440 - kw - 16 }
          txt(ctx, kota[i], fx, row + 2, { ...k, color: 'rgba(0,0,0,0.35)' })
          txt(ctx, kota[i], fx, row, { ...k, color: CREAM })
          ctx.restore()
        })
      })

      txt(ctx, join(['titik nol', texts.tanggal]), 300, 1739, { family: MONO, size: 14, color: CREAM, align: 'center', maxWidth: 520 })
    },
    over(ctx) {
      for (const s of SIGNS) {
        const { ox, oy } = center(s)
        rotated(ctx, ox, oy, s.rot, () => {
          ctx.save()
          ctx.beginPath()
          signPoly(ctx, s)
          ctx.clip()
          ellipseRadial(ctx, 30, s.y, SW, SH, 30 + SW * 0.2, s.y + SH * 0.3, [[0, 'rgba(255,255,255,0.08)'], [0.4, 'rgba(255,255,255,0)']])
          ellipseRadial(ctx, 30, s.y, SW, SH, 30 + SW * 0.8, s.y + SH * 0.8, [[0, 'rgba(0,0,0,0.18)'], [0.5, 'rgba(0,0,0,0)']])
          ctx.restore()
          for (const b of bolts(s)) bolt(ctx, b.x, b.y)
        })
      }
    },
  },
})
