// Toples Kue — design-reference/cute-kawaii/toples-kue.html (600x1800, 3 foto)
import { border, box, dropShadow, insetShadows, linear, radial, rrPath, text, type Ctx } from '../paint'
import { cute } from './define'
import { detailOverlay, photoInset } from './helpers'

const INK = '#3B1F4A'
const LID = '#FF8FAB'
/** kue 300x300 (border 4, padding 18) di dalam toples, kiri atas sebelum diputar + derajat */
const COOKIES = [
  { x: 155, y: 345, deg: -8 },
  { x: 135, y: 775, deg: 6 },
  { x: 165, y: 1195, deg: -4 },
]
/** foto bulat 256 (anak kue, bergeser 4px karena lebar 100% + border 4px) */
const SLOTS = [
  { x: 181.5, y: 370.4 },
  { x: 160.6, y: 801.4 },
  { x: 191.3, y: 1220.7 },
].map((p, i) => ({ ...p, w: 256, h: 256, radius: 128, rotate: COOKIES[i].deg }))
/** butir coklat (relatif padding box kue) */
const CHIPS = [
  [44, 64],
  [244, 94],
  [64, 234],
  [234, 224],
]
const CRUMBS = [
  [181, 1587], [242, 1582], [426, 1588], [364, 1579], [415, 1562], [191, 1586], [248, 1583],
  [308, 1587], [184, 1563], [435, 1574], [180, 1589], [415, 1563], [279, 1574], [422, 1563],
]

function inCookie(ctx: Ctx, c: (typeof COOKIES)[number], draw: () => void) {
  ctx.save()
  ctx.translate(c.x + 150, c.y + 150)
  ctx.rotate((c.deg * Math.PI) / 180)
  ctx.translate(-150, -150)
  draw()
  ctx.restore()
}

function circle(ctx: Ctx, cx: number, cy: number, r: number) {
  ctx.moveTo(cx + r, cy)
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
}

/** sayap pita 76x46, border-radius 50% 50% 0 50% (sudut elips 38x23), border 3px */
function wing(ctx: Ctx, x: number, y: number, deg: number) {
  const shape = (x0: number, y0: number, w: number, h: number, rx: number, ry: number) => {
    ctx.moveTo(x0 + rx, y0)
    ctx.ellipse(x0 + w - rx, y0 + ry, rx, ry, 0, -Math.PI / 2, 0)
    ctx.lineTo(x0 + w, y0 + h)
    ctx.lineTo(x0 + rx, y0 + h)
    ctx.ellipse(x0 + rx, y0 + h - ry, rx, ry, 0, Math.PI / 2, Math.PI)
    ctx.ellipse(x0 + rx, y0 + ry, rx, ry, 0, Math.PI, Math.PI * 1.5)
    ctx.closePath()
  }
  ctx.save()
  ctx.translate(x + 38, y + 23)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.translate(-38, -23)
  ctx.beginPath()
  shape(0, 0, 76, 46, 38, 23)
  ctx.fillStyle = LID
  ctx.fill()
  ctx.beginPath()
  shape(0, 0, 76, 46, 38, 23)
  shape(3, 3, 70, 40, 35, 20)
  ctx.fillStyle = INK
  ctx.fill('evenodd')
  ctx.restore()
}

export const toplesKue = cute({
  id: 'cute-toples-kue',
  name: 'toples kue',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#FBE7A1' },
  placeholder: '#FBF3E6',
  fonts: ['Caprasimo', 'Nunito:600,800'],
  fields: ['nama', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'toples', 300, 60, { family: 'Caprasimo', size: 66, color: INK, align: 'center' })
      // tutup 370x90, border 5px, inset 0 6px 0 putih 40%
      box(ctx, 120, 180, 370, 90, LID, 14)
      insetShadows(ctx, 125, 185, 360, 80, [{ dx: 0, dy: 6, color: 'rgba(255,255,255,0.4)' }], 9)
      border(ctx, 120, 180, 370, 90, 5, INK, 14)

      // toples kaca 470x1370
      const R: [number, number, number, number] = [40, 40, 70, 70]
      box(ctx, 70, 250, 470, 1370, linear(ctx, 75, 255, 460, 1360, 90, [
        [0, 'rgba(255,255,255,0.65)'],
        [0.25, 'rgba(255,255,255,0.3)'],
        [0.75, 'rgba(255,255,255,0.2)'],
        [1, 'rgba(255,255,255,0.5)'],
      ]), R)
      ctx.beginPath()
      rrPath(ctx, 75, 255, 460, 1360, [35, 35, 65, 65])
      rrPath(ctx, 85, 265, 440, 1340, [25, 25, 55, 55])
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fill('evenodd')
      border(ctx, 70, 250, 470, 1370, 5, INK, R)

      // kue
      for (const c of COOKIES) {
        inCookie(ctx, c, () => {
          dropShadow(ctx, 0, 0, 300, 300, 0, 6, 10, 'rgba(59,31,74,0.25)', 150)
          box(ctx, 0, 0, 300, 300, radial(ctx, 4 + 292 * 0.35, 4 + 292 * 0.3, Math.hypot(292 * 0.65, 292 * 0.7), [
            [0, '#f3d39a'],
            [0.75, '#c98a4a'],
          ]), 150)
          border(ctx, 0, 0, 300, 300, 4, INK, 150)
          ctx.beginPath()
          circle(ctx, 154, 154, 132)
          circle(ctx, 154, 154, 128)
          ctx.fillStyle = INK
          ctx.fill('evenodd')
        })
      }
      // kilau kaca
      box(ctx, 105, 315, 40, 1200, 'rgba(255,255,255,0.55)', 20)
      // label "kue [NAMA]" 268x55, rotate(-3deg)
      ctx.save()
      ctx.translate(319, 1542.5)
      ctx.rotate((-3 * Math.PI) / 180)
      ctx.translate(-134, -27.5)
      box(ctx, 0, 0, 268, 55, '#ffffff', 10)
      border(ctx, 0, 0, 268, 55, 4, INK, 10)
      const nama = texts.nama?.trim()
      text(ctx, nama ? `kue ${nama}` : 'kue kita', 134, 14, { family: 'Nunito', size: 20, weight: 800, color: INK, align: 'center', maxWidth: 240 })
      ctx.restore()

      const tanggal = texts.tanggal?.trim()
      if (tanggal) text(ctx, tanggal, 300, 1690, { family: 'Nunito', size: 20, weight: 800, color: INK, align: 'center', maxWidth: 520 })

      // kain tutup 388x48 kotak-kotak, rotate(-2deg)
      ctx.save()
      ctx.translate(304, 194)
      ctx.rotate((-2 * Math.PI) / 180)
      ctx.translate(-194, -24)
      const CR: [number, number, number, number] = [20, 20, 4, 4]
      ctx.save()
      ctx.beginPath()
      rrPath(ctx, 0, 0, 388, 48, CR)
      ctx.clip()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 388, 48)
      ctx.fillStyle = 'rgba(232,85,85,0.55)'
      for (let x = 4 - 28; x < 388; x += 28) ctx.fillRect(x, 0, 14, 48)
      for (let b = 44 + 28; b > 0; b -= 28) ctx.fillRect(0, b - 14, 388, 14)
      ctx.restore()
      border(ctx, 0, 0, 388, 48, 4, INK, CR)
      ctx.restore()

      // pita
      box(ctx, 250, 240, 106, 36, LID, 15)
      border(ctx, 250, 240, 106, 36, 3, INK, 15)
      wing(ctx, 190, 250, -30)
      wing(ctx, 340, 250, 120)
      // jahitan putus-putus
      ctx.fillStyle = 'rgba(59,31,74,0.45)'
      for (let x = 90; x < 510; x += 10) ctx.fillRect(x, 262, 6, 10)
      // remah kue
      ctx.save()
      ctx.globalAlpha = 0.8
      for (const [x, y] of CRUMBS) box(ctx, x, y, 6, 6, '#c9a272', 2)
      ctx.restore()
    },
    over(ctx, { W, H }) {
      for (const [i, c] of COOKIES.entries()) {
        // bayangan inset kotak foto 256 (radius 0), terpotong lingkaran induk
        const s = SLOTS[i]
        ctx.save()
        ctx.beginPath()
        circle(ctx, s.x + 128, s.y + 128, 128)
        ctx.clip()
        photoInset(ctx, { ...s, radius: 0 })
        ctx.restore()
        inCookie(ctx, c, () => {
          for (const [x, y] of CHIPS) box(ctx, x, y, 14, 10, '#5a3a22', 5)
        })
      }
      detailOverlay(ctx, W, H)
    },
  },
})
