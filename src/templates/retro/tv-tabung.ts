// TV Tabung — design-reference/retro-vintage/tv-tabung.html (1080x1350, 1 foto)
import { box, dropShadow, insetShadows, linear, setShadow, text, type Ctx } from '../paint'
import { retro } from './define'
import {
  blurredEllipse,
  conicStripes,
  ellipseGlow,
  ellipseRRPath,
  insetRing,
  METAL,
  premul,
  repeatingLinear,
  rotated,
  vignette,
} from './helpers'

const BG = '#8C7A5E'
const CREAM = '#e9dcc4'
const MONO = 'IBM Plex Mono'
/** layar: 542x658, border-radius 70px / 52px, overflow hidden */
const SCR = { x: 156, y: 286, w: 542, h: 658 }

/** tombol putar dengan angka 2..13 melingkar (jari-jari angka r), kenop d, poros logam m, jarum n */
function dial(ctx: Ctx, cx: number, cy: number, r: number, d: number, m: number, needle: number, label: string, labelX: number, labelY: number) {
  const angles = [-150, -123, -96, -69, -42, -15, 12, 39, 66, 93, 120, 147]
  angles.forEach((a, i) => {
    const rad = (a * Math.PI) / 180
    text(ctx, String(i + 2), cx + r * Math.sin(rad), cy - 8 - r * Math.cos(rad), { family: MONO, size: 11, color: CREAM, align: 'center' })
  })
  // kenop: repeating-conic-gradient, box-shadow 0 6px 10px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.2)
  const kx = cx - d / 2
  const ky = cy - d / 2
  dropShadow(ctx, kx, ky, d, d, 0, 6, 10, 'rgba(0,0,0,0.5)', d / 2)
  conicStripes(ctx, cx, cy, d / 2, '#2a2420', '#4a403a', 6)
  insetShadows(ctx, kx, ky, d, d, [{ dx: 0, dy: 2, blur: 2, color: 'rgba(255,255,255,0.2)' }], d / 2)
  // poros logam + jarum
  const mx = cx - m / 2
  const my = cy - m / 2
  box(ctx, mx, my, m, m, linear(ctx, mx, my, m, m, 180, METAL), m / 2)
  insetShadows(ctx, mx, my, m, m, [{ dx: 0, dy: -2, blur: 3, color: 'rgba(0,0,0,0.4)' }], m / 2)
  box(ctx, cx - 2, my + 4, 4, needle, '#2a2420', 2)
  text(ctx, label, labelX, labelY, { family: MONO, size: 12, color: CREAM, letterSpacing: 2.4 })
}

/** kaki TV: skewX(±10deg) di titik tengah, radius bawah 6 */
function leg(ctx: Ctx, x: number, skew: number) {
  ctx.save()
  ctx.translate(x + 17, 1093)
  ctx.transform(1, 0, Math.tan((skew * Math.PI) / 180), 1, 0, 0)
  ctx.translate(-(x + 17), -1093)
  box(ctx, x, 1028, 34, 130, linear(ctx, x, 1028, 34, 130, 90, [[0, '#3a2410'], [0.5, '#6a4422'], [1, '#3a2410']]), [0, 0, 6, 6])
  ctx.restore()
}

export const tvTabung = retro({
  id: 'retro-tv-tabung',
  name: 'tv tabung',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  // #B9C4BC setelah saturate(0.8) contrast(1.05)
  placeholder: '#BEC7BF',
  // kotak FOTO di desain memakai filter: saturate(0.8) contrast(1.05) (layar TV yang agak pudar & dingin)
  filter: 'film-dingin',
  fonts: ['Playfair Display:700,900', 'IBM Plex Mono:400,600', 'VT323'],
  fields: ['nama', 'tanggal', 'tempat'],
  slots: [{ x: SCR.x, y: SCR.y, w: SCR.w, h: SCR.h }],
  draw: {
    under(ctx, { texts, W, H }) {
      // latar: dinding bg 0–78%, lantai #6b5a46; cahaya hangat radial di 30% 20%
      box(ctx, 0, 0.78 * H, W, H - 0.78 * H, '#6b5a46')
      ellipseGlow(ctx, 0, 0, W, H, 324, 270, 756 * Math.SQRT2, 1080 * Math.SQRT2, premul([[0, 'rgba(255,210,150,0.35)'], [0.5, 'rgba(255,210,150,0)'], [1, 'rgba(255,210,150,0)']]))
      // papan lantai
      repeatingLinear(ctx, 0, 1050, W, 300, 90, 120, [[0, 2, 'rgba(0,0,0,0.12)']])

      // antena (svg 420x200 di 340,20; gradien horizontal objectBoundingBox per garis)
      ctx.save()
      ctx.beginPath()
      ctx.rect(340, 20, 420, 200)
      ctx.clip()
      ctx.lineWidth = 7
      ctx.lineCap = 'round'
      for (const [x0, y0, x1, y1] of [[550, 210, 380, 30], [550, 210, 730, 50]]) {
        const g = ctx.createLinearGradient(Math.min(x0, x1), 0, Math.max(x0, x1), 0)
        g.addColorStop(0, '#d9dee3')
        g.addColorStop(0.5, '#6f777f')
        g.addColorStop(1, '#d9dee3')
        ctx.strokeStyle = g
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
      }
      ctx.fillStyle = '#6f777f'
      for (const [cx, cy] of [[380, 30], [730, 50]]) {
        ctx.beginPath()
        ctx.arc(cx, cy, 8, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = '#2a2420'
      ctx.beginPath()
      ctx.ellipse(550, 212, 60, 14, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // kabinet kayu
      dropShadow(ctx, 70, 200, 940, 830, 0, 30, 50, 'rgba(0,0,0,0.45)', 34)
      box(ctx, 70, 200, 940, 830, linear(ctx, 70, 200, 940, 830, 180, [[0, '#7a4f2a'], [0.55, '#5a3518'], [1, '#4a2a12']]), 34)
      repeatingLinear(ctx, 70, 200, 940, 830, 88, 90, [[0, 40, 'rgba(0,0,0,0.05)']], 34)
      repeatingLinear(ctx, 70, 200, 940, 830, 92, 16, [[6, 7, 'rgba(0,0,0,0.08)'], [15, 16, 'rgba(255,220,170,0.06)']], 34)
      insetShadows(ctx, 70, 200, 940, 830, [
        { dx: 0, dy: 3, color: 'rgba(255,220,170,0.25)' },
        { dx: 0, dy: -6, blur: 10, color: 'rgba(0,0,0,0.35)' },
      ], 34)

      // bezel logam + bingkai layar
      dropShadow(ctx, 116, 246, 622, 738, 0, 4, 8, 'rgba(0,0,0,0.4)', 26)
      box(ctx, 116, 246, 622, 738, linear(ctx, 116, 246, 622, 738, 180, METAL), 26)
      box(ctx, 134, 264, 586, 702, '#141210', 20)
      insetRing(ctx, 134, 264, 586, 702, 3, '#2a2622', 20)

      // panel samping: pelat nama
      dropShadow(ctx, 784, 256, 170, 55, 0, 3, 5, 'rgba(0,0,0,0.4)', 6)
      box(ctx, 784, 256, 170, 55, linear(ctx, 784, 256, 170, 55, 180, METAL), 6)
      const nama = texts.nama?.trim() || 'bilik'
      text(ctx, nama, 869, 266, { family: 'Playfair Display', size: 26, weight: 900, italic: true, color: '#2a2420', align: 'center', maxWidth: 150 })

      dial(ctx, 869, 395.5, 56, 78, 48, 17, 'SALURAN', 835.4, 468)
      dial(ctx, 869, 553, 43, 60, 37, 13, 'VOLUME', 840.2, 611)

      // kisi speaker: repeating-linear-gradient(0deg, #2a1e14 0 2px, #4a3a2a 2px 4px) (lapisan bawahnya tertutup penuh)
      repeatingLinear(ctx, 784, 648, 170, 300, 0, 4, [[0, 2, '#2a1e14'], [2, 4, '#4a3a2a']], 14)
      insetShadows(ctx, 784, 648, 170, 300, [{ dx: 0, dy: 4, blur: 10, color: 'rgba(0,0,0,0.6)' }], 14)
      insetRing(ctx, 784, 648, 170, 300, 4, '#3a2a1c', 14)

      // lampu ON
      dropShadow(ctx, 850.8, 971, 12, 12, 0, 0, 8, '#ff5a3c', 6)
      box(ctx, 850.8, 971, 12, 12, '#ff5a3c', 6)
      text(ctx, 'ON', 870.8, 970, { family: MONO, size: 11, color: CREAM, letterSpacing: 1.65 })

      // kaki + bayangan lantai
      leg(ctx, 200, 10)
      leg(ctx, 846, -10)
      blurredEllipse(ctx, 180, 1150, 720, 30, 10, 'rgba(0,0,0,0.35)')

      const tgl = texts.tanggal?.trim()
      text(ctx, tgl ? `siaran malam · ${tgl}` : 'siaran malam', 70, 1240, { family: MONO, size: 16, color: CREAM, maxWidth: 560 })
      text(ctx, texts.tempat?.trim() ?? '', 1010, 1240, { family: MONO, size: 16, color: CREAM, align: 'right', maxWidth: 360 })
    },
    over(ctx) {
      const { x, y, w, h } = SCR
      ctx.save()
      // sudut layar di luar radius elips = bingkai #141210
      ctx.beginPath()
      ctx.rect(x, y, w, h)
      ellipseRRPath(ctx, x, y, w, h, 70, 52)
      ctx.fillStyle = '#141210'
      ctx.fill('evenodd')
      // tutup sambungan anti-alias tepi lengkung
      ctx.beginPath()
      ellipseRRPath(ctx, x, y, w, h, 70, 52)
      ctx.strokeStyle = '#141210'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.beginPath()
      ellipseRRPath(ctx, x, y, w, h, 70, 52)
      ctx.clip()
      // garis scan, vignette, pantulan kaca
      for (let ly = 3; ly < h; ly += 5) {
        ctx.fillStyle = 'rgba(0,0,0,0.14)'
        ctx.fillRect(x, y + ly, w, Math.min(2, h - ly))
      }
      vignette(ctx, x, y, w, h, [[0, 'rgba(0,0,0,0)'], [0.5, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.55)']])
      rotated(ctx, 346, 396, -18, () => {
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(346, 396, 150, 80, 0, 0, Math.PI * 2)
        ctx.clip()
        ellipseGlow(ctx, 196, 316, 300, 160, 346, 396, 150 * Math.SQRT2, 80 * Math.SQRT2, premul([[0, 'rgba(255,255,255,0.28)'], [0.7, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']]))
        ctx.restore()
      })
      // CH 03 dengan text-shadow 0 0 8px rgba(200,255,120,0.7)
      ctx.save()
      setShadow(ctx, 0, 0, 8, 'rgba(200,255,120,0.7)')
      text(ctx, 'CH 03', 670, 306, { family: 'VT323', size: 46, color: '#c8ff7a', align: 'right' })
      ctx.restore()
      ctx.restore()
    },
  },
})
