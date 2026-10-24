// Kunci Hotel — design-reference/travel/kunci-hotel.html (1080x1350 portrait, 1 foto)
import { box, dropShadow, linear, rrPathRaw, type Ctx } from '../paint'
import { travel } from './define'
import { disc, dropShadowShape, ellipseRadial, join, lineTop, MONO, SERIF, txt } from './helpers'

const TAG = '#6E1A22'
const GOLD_TXT = '#f0d890'
const DARK = '#2a1a10'
const GOLD_K: [number, string][] = [
  [0, '#5a3e14'], [0.18, '#c9a24a'], [0.28, '#f6e3a4'], [0.42, '#a8822e'], [0.58, '#e8c878'], [0.76, '#7a5820'], [1, '#d9b45a'],
]
const CORMORANT = 'Cormorant Garamond'

/** radial-gradient(ellipse RXpx RYpx at cx cy, warna, transparent) */
function ellipseBlob(ctx: Ctx, cx: number, cy: number, rx: number, ry: number, rgb: string, a: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(1, ry / rx)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  g.addColorStop(0, `rgba(${rgb},${a})`)
  g.addColorStop(1, `rgba(${rgb},0)`)
  ctx.fillStyle = g
  ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx)
  ctx.restore()
}

/** border 2px dashed di kotak bulat (radius atas besar): pola diregangkan supaya pas satu putaran */
function dashedRound(ctx: Ctx, x: number, y: number, w: number, h: number, r: [number, number, number, number], lw: number, color: string, dash: [number, number]) {
  const i = lw / 2
  const rr = r.map((v) => Math.max(0, v - i)) as [number, number, number, number]
  const [tl, tr, br, bl] = rr
  const W = w - lw
  const H = h - lw
  const per = (W - tl - tr) + (H - tr - br) + (W - br - bl) + (H - bl - tl) + (Math.PI / 2) * (tl + tr + br + bl)
  const period = dash[0] + dash[1]
  const n = Math.round(per / period)
  const k = per / (n * period)
  ctx.save()
  ctx.beginPath()
  rrPathRaw(ctx, x + i, y + i, W, H, rr)
  ctx.setLineDash([dash[0] * k, dash[1] * k])
  ctx.lineDashOffset = -dash[1] * k * 0.5
  ctx.lineWidth = lw
  ctx.strokeStyle = color
  ctx.stroke()
  ctx.restore()
}

export const kunciHotel = travel({
  id: 'travel-kunci-hotel',
  name: 'kunci hotel',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#ece8e1' },
  placeholder: '#E5E0D4',
  fonts: ['Libre Caslon Text:400,700', 'Space Mono:400,700', 'Cormorant Garamond:500i'],
  fields: ['nama', 'tanggal', 'tempat'],
  slots: [{ x: 295, y: 512, w: 490, h: 440 }],
  draw: {
    under(ctx, { texts, W, H }) {
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 160, [[0, '#f3f0ea'], [1, '#e6e1d8']]))
      ellipseBlob(ctx, W * 0.74, H * 0.78, 420, 30, '150,140,130', 0.16)
      ellipseBlob(ctx, W * 0.22, H * 0.24, 340, 36, '160,150,140', 0.18)
      ellipseRadial(ctx, 0, 0, W, H, W * 0.5, H * 0.45, [[0.55, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.12)']])

      // cincin gantungan: border 14px empat warna (sambungan di diagonal), drop-shadow 0 4px 4px (blur filter = deviasi standar → shadowBlur 2×)
      const ring = () => {
        ctx.arc(540, 220, 60, 0, Math.PI * 2)
        ctx.arc(540, 220, 46, 0, Math.PI * 2, true)
      }
      dropShadowShape(ctx, ring, { x: 480, y: 160, w: 120, h: 120 }, 0, 4, 8, 'rgba(0,0,0,0.25)')
      const q = Math.PI / 4
      ;(['#f0d890', '#8a6420', '#6a4a18', '#e2c272'] as const).forEach((c, k) => {
        const a0 = -3 * q + k * 2 * q
        ctx.beginPath()
        ctx.arc(540, 220, 60, a0, a0 + 2 * q)
        ctx.arc(540, 220, 46, a0 + 2 * q, a0, true)
        ctx.closePath()
        ctx.fillStyle = c
        ctx.fill()
      })

      // gantungan kunci
      const R: [number, number, number, number] = [350, 350, 36, 36]
      dropShadow(ctx, 190, 260, 700, 940, 0, 18, 36, 'rgba(0,0,0,0.3)', R)
      box(ctx, 190, 260, 700, 940, TAG, R)
      ctx.save()
      ctx.beginPath()
      rrPathRaw(ctx, 190, 260, 700, 940, R)
      ctx.clip()
      ellipseRadial(ctx, 190, 260, 700, 940, 190 + 210, 260 + 169.2, [[0, 'rgba(255,255,255,0.10)'], [0.4, 'rgba(255,255,255,0)']])
      ctx.restore()
      ctx.beginPath()
      rrPathRaw(ctx, 190, 260, 700, 940, R)
      rrPathRaw(ctx, 193, 263, 694, 934, [347, 347, 33, 33])
      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.fill('evenodd')
      dashedRound(ctx, 208, 278, 664, 904, [332, 332, 22, 22], 2, 'rgba(240,216,144,0.65)', [6, 4])

      // lubang logam
      disc(ctx, 505, 300, 70, linear(ctx, 505, 300, 70, 70, 135, GOLD_K))
      disc(ctx, 525, 320, 30, DARK)

      const nama = texts.nama?.trim().toUpperCase()
      txt(ctx, nama ? `HOTEL ${nama}` : 'HOTEL', 540, 410, {
        family: SERIF, size: 30, weight: 700, color: GOLD_TXT, ls: 8.4, align: 'center', maxWidth: 540,
      })
      ctx.save()
      ctx.globalAlpha = 0.7
      box(ctx, 510, 471, 60, 2, GOLD_TXT)
      ctx.restore()

      box(ctx, 280, 497, 520, 470, linear(ctx, 280, 497, 520, 470, 135, GOLD_K))
      box(ctx, 290, 507, 500, 450, DARK)

      txt(ctx, '217', 540, lineTop(ctx, SERIF, 110, 0.9, 991, 700), { family: SERIF, size: 110, weight: 700, color: GOLD_TXT, align: 'center' })
      txt(ctx, 'mohon kembalikan ke resepsionis', 540, 1114, {
        family: CORMORANT, size: 24, weight: 500, italic: true, color: '#e9d9a8', align: 'center',
      })

      const tgl = texts.tanggal?.trim()
      txt(ctx, join([tgl ? `check-in ${tgl}` : '', texts.tempat]), 540, 1250, {
        family: MONO, size: 15, color: '#6a5a48', align: 'center', maxWidth: 900,
      })
    },
  },
})
