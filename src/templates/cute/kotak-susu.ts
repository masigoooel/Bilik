// Kotak Susu — design-reference/cute-kawaii/kotak-susu.html (1080x1350, 1 foto)
import { border, box, ICONS, linear, radial, rrPath, svg, text, type Ctx } from '../paint'
import { cute } from './define'
import { detailOverlay, photoInset } from './helpers'

const INK = '#3B1F4A'
const BG = '#F9D9E3'
const LABEL = '#FF8FAB'
const SLOT = { x: 322, y: 428, w: 446, h: 480, radius: 16 }
const SKEW = Math.tan((-12 * Math.PI) / 180)
// geometri karton (dirapikan dari desain: atap depan + panel atap samping + sisi samping menyambung jadi satu bentuk 3D)
const FX0 = 260
const FX1 = 830
const TOP = 246
const BOTTOM = 1196
const DEPTH = 95 // lebar sisi samping
const RISE = DEPTH * -SKEW // sisi samping naik ±20px ke belakang
const APEX = { x: 545, y: 92 } // puncak atap depan (tertutup tutup)

/** sisi samping karton: skewY(-12deg) dengan titik asal (ox, oy) */
function skewed(ctx: Ctx, ox: number, oy: number, draw: () => void) {
  ctx.save()
  ctx.translate(ox, oy)
  ctx.transform(1, SKEW, 0, 1, 0, 0)
  draw()
  ctx.restore()
}

/** sedotan 28x246 (border 3px, radius 11), garis pink/putih 18px dari bawah, rotate(14deg) */
function straw(ctx: Ctx) {
  ctx.save()
  ctx.translate(470 + 14, 10 + 123)
  ctx.rotate((14 * Math.PI) / 180)
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, -14, -123, 28, 246, 11)
  ctx.clip()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(-14, -123, 28, 246)
  ctx.fillStyle = LABEL
  // kotak gradien = padding box (y -120..120); 0deg = dari bawah ke atas
  for (let b = 120 + 36; b > -123; b -= 36) ctx.fillRect(-14, b - 18, 28, 18)
  ctx.restore()
  border(ctx, -14, -123, 28, 246, 3, INK, 11)
  ctx.restore()
}

export const kotakSusu = cute({
  id: 'cute-kotak-susu',
  name: 'kotak susu',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  placeholder: '#F3EEF6',
  fonts: ['Caprasimo', 'Nunito:600,800'],
  fields: ['nama', 'tanggal'],
  slots: [SLOT],
  draw: {
    under(ctx, { texts, W, H }) {
      // radial-gradient(circle at 50% 35%, #fff, bg 75%), farthest-corner
      const cx = W * 0.5
      const cy = H * 0.35
      ctx.fillStyle = radial(ctx, cx, cy, Math.hypot(cx, H - cy), [
        [0, '#ffffff'],
        [0.75, BG],
      ])
      ctx.fillRect(0, 0, W, H)

      // bayangan lantai: seluruh karton (depan + samping), digeser 18,22
      ctx.save()
      ctx.fillStyle = 'rgba(59,31,74,0.12)'
      ctx.beginPath()
      ctx.moveTo(FX0 + 18 + 8, TOP + 22)
      ctx.lineTo(FX1 + DEPTH + 18, TOP - RISE + 22)
      ctx.lineTo(FX1 + DEPTH + 18, BOTTOM - RISE + 22)
      ctx.lineTo(FX1 + 18, BOTTOM + 22)
      ctx.lineTo(FX0 + 18 + 8, BOTTOM + 22)
      ctx.quadraticCurveTo(FX0 + 18, BOTTOM + 22, FX0 + 18, BOTTOM + 22 - 8)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      const outline = (pts: [number, number][], fill: string | CanvasGradient) => {
        ctx.beginPath()
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
        ctx.closePath()
        ctx.fillStyle = fill
        ctx.fill()
        ctx.lineWidth = 5
        ctx.lineJoin = 'round'
        ctx.strokeStyle = INK
        ctx.stroke()
      }
      // panel atap samping: dari bubungan ke tepi atas sisi samping
      outline(
        [
          [APEX.x, APEX.y],
          [APEX.x + DEPTH, APEX.y - RISE],
          [FX1 + DEPTH - 2.5, TOP - RISE],
          [FX1, TOP],
        ],
        linear(ctx, APEX.x, APEX.y - RISE, FX1 + DEPTH - APEX.x, TOP - APEX.y + RISE, 160, [
          [0, '#eef2f5'],
          [1, '#d6dde2'],
        ]),
      )
      // atap depan: segitiga gradien
      outline(
        [
          [FX0 + 2.5, TOP],
          [APEX.x, APEX.y],
          [FX1, TOP],
        ],
        linear(ctx, FX0, APEX.y, FX1 - FX0, TOP - APEX.y, 90, [
          [0, '#e9eef2'],
          [0.5, '#ffffff'],
          [1, '#dfe6ea'],
        ]),
      )

      // tutup 148x54, border 4px tanpa sisi bawah (duduk di bubungan); sisi sirip memanjang ke belakang sepanjang bubungan
      ctx.beginPath()
      ctx.moveTo(612, 42)
      ctx.lineTo(612 + DEPTH, 42 - RISE)
      ctx.lineTo(612 + DEPTH, APEX.y + 2 - RISE)
      ctx.lineTo(612, APEX.y + 2)
      ctx.closePath()
      ctx.fillStyle = '#dfe5ea'
      ctx.fill()
      ctx.lineWidth = 4
      ctx.lineJoin = 'round'
      ctx.strokeStyle = INK
      ctx.stroke()
      box(ctx, 470, 40, 148, 54, '#f1f4f6', [6, 6, 0, 0])
      ctx.beginPath()
      rrPath(ctx, 470, 40, 148, 54, [6, 6, 0, 0])
      rrPath(ctx, 474, 44, 140, 50, [2, 2, 0, 0])
      ctx.fillStyle = INK
      ctx.fill('evenodd')
      box(ctx, 470, 90, 148, 5, INK)

      // badan karton 570x950, border 5px
      box(ctx, FX0, TOP, FX1 - FX0, BOTTOM - TOP, '#ffffff', 8)
      border(ctx, FX0, TOP, FX1 - FX0, BOTTOM - TOP, 5, INK, 8)
      // label atas
      box(ctx, 265, 251, 560, 120, LABEL)
      box(ctx, 265, 371, 560, 5, INK)
      text(ctx, 'susu', 545, 274, { family: 'Caprasimo', size: 64, color: '#ffffff', align: 'center' })
      // bingkai foto
      box(ctx, 305, 411, 480, 514, '#ffffff', 26)
      border(ctx, 305, 411, 480, 514, 5, INK, 26)

      const nama = texts.nama?.trim()
      if (nama) text(ctx, nama, 545, 961, { family: 'Caprasimo', size: 44, color: INK, align: 'center', maxWidth: 480 })
      // tanpa nama: keterangan naik ke tengah ruang di bawah bingkai foto (tidak menyisakan celah kosong)
      text(ctx, 'rasa stroberi · 250 ml', 545, nama ? 1019 : 978, { family: 'Nunito', size: 18, weight: 800, color: INK, align: 'center' })
      const small = { family: 'Nunito', size: 14, weight: 800, color: INK }
      text(ctx, 'kocok dulu', 305, 1142, small)
      const tanggal = texts.tanggal?.trim()
      if (tanggal) text(ctx, `baik sebelum ${tanggal}`, 785, 1142, { ...small, align: 'right', maxWidth: 380 })

      svg(ctx, ICONS.heart, 958, 420, 70, 70, 24, 24, { fill: '#FF8FAB', stroke: INK, lineWidth: 1, lineJoin: 'round', rotate: 12 })
      svg(ctx, ICONS.star, 160, 520, 60, 60, 24, 24, { fill: '#FFD84D', stroke: INK, lineWidth: 1, lineJoin: 'round', rotate: -10 })

      // sisi samping: skewY(-12deg) mulai dari garis kanan badan, border kanan/atas/bawah 5px
      skewed(ctx, FX1 - 2.5, TOP, () => {
        const w = DEPTH + 2.5
        const h = BOTTOM - TOP
        box(ctx, 0, 0, w, h, '#f1f4f6', [0, 8, 8, 0])
        ctx.save()
        ctx.beginPath()
        rrPath(ctx, 0, 0, w, h, [0, 8, 8, 0])
        ctx.clip()
        ctx.fillStyle = linear(ctx, 0, 0, w, h, 90, [
          [0, 'rgba(0,0,0,0.12)'],
          [1, 'rgba(0,0,0,0.04)'],
        ])
        ctx.fillRect(0, 0, w, h)
        ctx.restore()
        ctx.beginPath()
        rrPath(ctx, 0, 0, w, h, [0, 8, 8, 0])
        rrPath(ctx, 0, 5, w - 5, h - 10, [0, 3, 3, 0])
        ctx.fillStyle = INK
        ctx.fill('evenodd')
      })
      // garis sambungan depan-samping
      box(ctx, FX1 - 5, TOP, 5, BOTTOM - TOP - 8, INK)

      // totol sapi
      ctx.save()
      ctx.globalAlpha = 0.85
      ctx.fillStyle = INK
      for (const [x, y, w, h] of [
        [300, 1010, 60, 40],
        [740, 1060, 40, 30],
        [320, 1110, 30, 22],
      ]) {
        ctx.beginPath()
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
      straw(ctx)
    },
    over(ctx, { W, H }) {
      photoInset(ctx, SLOT)
      detailOverlay(ctx, W, H)
    },
  },
})
