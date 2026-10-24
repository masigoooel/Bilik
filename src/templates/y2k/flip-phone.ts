// Flip Phone — design-reference/y2k-aesthetic/flip-phone.html (1080x1350, 2 foto)
import { border, box, dropShadow, ICON_BBOX, ICONS, insetShadows, linear, metalGradient, radial, svg, text, textMid, type Ctx } from '../paint'
import { y2k } from './define'
import { tiledGradientBox } from './helpers'

const BG = '#BFE3FF'
const INK = '#2a2440'
const SHELL_EDGE = 'rgba(0,0,0,0.25)'
const METAL: [number, string][] = [[0, '#ffffff'], [0.38, '#d7dce3'], [0.5, '#6f7784'], [0.62, '#eef1f5'], [1, '#a3abb6']]

type Phone = { x: number; angle: number; shell: [number, string][]; charm: 'heart' | 'star' }
const PHONES: Phone[] = [
  { x: 80, angle: -4, shell: [[0, '#FFD0E8'], [0.6, '#FF7EC2'], [1, '#E85AA8']], charm: 'heart' },
  { x: 580, angle: 4, shell: [[0, '#F4F6F9'], [0.55, '#BFC6CF'], [1, '#E6E9EE']], charm: 'star' },
]
const TOP = 140
const PHONE_H = 1066

/** transform CSS: rotate(angle) dengan transform-origin 50% 100% */
function inPhone(ctx: Ctx, p: Phone, draw: () => void) {
  ctx.save()
  const px = p.x + 210
  const py = TOP + PHONE_H
  ctx.translate(px, py)
  ctx.rotate((p.angle * Math.PI) / 180)
  ctx.translate(-px, -py)
  ctx.translate(p.x, TOP)
  draw()
  ctx.restore()
}

/** cangkang gel: gradien 160°, bayangan dalam terang di atas & gelap di bawah, tepi gelap transparan */
function shell(ctx: Ctx, p: Phone, x: number, y: number, w: number, h: number, r: [number, number, number, number], glow: [number, number, number, number]) {
  tiledGradientBox(ctx, x, y, w, h, 3, r, (a, b, c, d) => linear(ctx, a, b, c, d, 160, p.shell))
  const ri = r.map((v) => Math.max(0, v - 3)) as [number, number, number, number]
  insetShadows(ctx, x + 3, y + 3, w - 6, h - 6, [
    { dx: 0, dy: glow[0], blur: glow[1], color: 'rgba(255,255,255,' + (glow[0] === 14 ? 0.65 : 0.55) + ')' },
    { dx: 0, dy: -glow[2], blur: glow[3], color: 'rgba(0,0,0,0.15)' },
  ], ri)
  border(ctx, x, y, w, h, 3, SHELL_EDGE, r)
}

function drawPhone(ctx: Ctx, p: Phone) {
  // antena di belakang tutup
  tiledGradientBox(ctx, 340, -60, 40, 76, 3, [17, 17, 6, 6], (a, b, c, d) => linear(ctx, a, b, c, d, 160, p.shell))
  border(ctx, 340, -60, 40, 76, 3, SHELL_EDGE, [17, 17, 6, 6])
  // tutup + speaker + layar
  shell(ctx, p, 0, 0, 420, 620, [60, 60, 26, 26], [14, 22, 10, 18])
  box(ctx, 153, 21, 120, 10, 'rgba(0,0,0,0.35)', 5)
  box(ctx, 37, 53, 346, 536, '#15161a', 22)
  // engsel logam
  tiledGradientBox(ctx, 40, 620, 340, 46, 3, 20, (a, b, c, d) => linear(ctx, a, b, c, d, 180, METAL))
  border(ctx, 40, 620, 340, 46, 3, SHELL_EDGE, 20)
  // badan bawah
  shell(ctx, p, 0, 666, 420, 400, [26, 26, 70, 70], [10, 18, 14, 20])
  tiledGradientBox(ctx, 165, 693, 90, 90, 3, 45, (a, b, c, d) => linear(ctx, a, b, c, d, 180, METAL))
  border(ctx, 165, 693, 90, 90, 3, SHELL_EDGE, 45)
  tiledGradientBox(ctx, 183, 711, 54, 54, 2, 27, (a, b, c, d) => linear(ctx, a, b, c, d, 180, [[0, '#ffffff'], [1, '#cfd5dd']]))
  border(ctx, 183, 711, 54, 54, 2, 'rgba(0,0,0,0.2)', 27)
  // keypad 3 x 4
  const kw = (334 - 20) / 3
  ;['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].forEach((k, i) => {
    const kx = 43 + (i % 3) * (kw + 10)
    const ky = 801 + Math.floor(i / 3) * 54
    tiledGradientBox(ctx, kx, ky, kw, 44, 2, 12, (a, b, c, d) => linear(ctx, a, b, c, d, 180, [[0, '#ffffff'], [1, '#e2e6ec']]))
    insetShadows(ctx, kx + 2, ky + 2, kw - 4, 40, [{ dx: 0, dy: -4, blur: 6, color: 'rgba(0,0,0,0.12)' }], 10)
    border(ctx, kx, ky, kw, 44, 2, SHELL_EDGE, 12)
    textMid(ctx, k, kx + kw / 2, ky + 2, 40, { family: 'Silkscreen', size: 20, color: '#3a3f48', align: 'center' })
  })
  // tali & gantungan logam
  box(ctx, 60, 1060, 4, 60, '#ffffff')
  svg(ctx, ICONS[p.charm], 26, 1120, 70, 70, 24, 24, { fill: metalGradient(ctx, ICON_BBOX[p.charm]), stroke: '#6b717a', lineWidth: 0.5, lineJoin: 'round' })
}

/** pola titik berulang (radial-gradient(circle, warna r0, transparan r1) ukuran tile, dengan offset) */
function dots(ctx: Ctx, W: number, H: number, tile: number, ox: number, oy: number, color: string, r0: number, r1: number) {
  const c = document.createElement('canvas')
  const scale = 4
  c.width = c.height = Math.ceil(tile * scale)
  const t = c.getContext('2d')!
  t.scale(scale, scale)
  const g = t.createRadialGradient(tile / 2, tile / 2, 0, tile / 2, tile / 2, r1)
  g.addColorStop(0, color)
  g.addColorStop(r0 / r1, color)
  g.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'))
  t.fillStyle = g
  t.fillRect(0, 0, tile, tile)
  const pat = ctx.createPattern(c, 'repeat')!
  pat.setTransform(new DOMMatrix().translate(ox, oy).scale(1 / scale))
  ctx.fillStyle = pat
  ctx.fillRect(0, 0, W, H)
}

export const flipPhone = y2k({
  id: 'y2k-flip-phone',
  name: 'flip phone',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'linear', angle: 170, stops: [[0, BG], [1, '#E8D6FF']] },
  placeholder: '#DDE8F5',
  fonts: ['Silkscreen'],
  fields: ['tanggal', 'nama', 'nama2'],
  // pusat slot = titik tengah layar setelah rotasi ±4° (diukur dari desain)
  slots: [
    { x: 81, y: 210.8, w: 314, h: 504, radius: 8, rotate: -4 },
    { x: 685, y: 210.8, w: 314, h: 504, radius: 8, rotate: 4 },
  ],
  draw: {
    under(ctx, { texts, W, H }) {
      dots(ctx, W, H, 37, 13, 3, 'rgba(255,220,240,0.8)', 2, 3)
      dots(ctx, W, H, 17, 7, 11, 'rgba(255,255,255,0.6)', 1, 2)
      dots(ctx, W, H, 23, 0, 0, 'rgba(255,255,255,0.9)', 1.5, 2.5)
      // kilau di kiri atas
      box(ctx, 10, -40, 260, 260, radial(ctx, 140, 90, 130 * Math.SQRT2, [[0, 'rgba(255,255,255,0.95)'], [0.12, 'rgba(255,255,255,0.4)'], [0.6, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']]), 130)
      // notifikasi
      dropShadow(ctx, 340, 30, 406, 66, 0, 6, 14, 'rgba(40,60,120,0.2)', 30)
      box(ctx, 340, 30, 406, 66, linear(ctx, 340, 30, 406, 66, 180, [[0, '#ffffff'], [1, '#dfe8ff']]), 30)
      border(ctx, 340, 30, 406, 66, 3, '#ffffff', 30)
      text(ctx, '2 panggilan masuk', 543, 50, { family: 'Silkscreen', size: 20, color: INK, align: 'center' })

      for (const p of PHONES) inPhone(ctx, p, () => drawPhone(ctx, p))

      const sparkle = (x: number, y: number, s: number) => svg(ctx, ICONS.sparkle, x, y, s, s, 24, 24, { fill: '#ffffff' })
      sparkle(520, 240, 40)
      sparkle(530, 700, 30)
      sparkle(500, 1120, 36)
      sparkle(30, 620, 26)
      sparkle(1030, 900, 28)

      const footer = [texts.tanggal?.trim(), texts.nama?.trim(), texts.nama2?.trim()].filter(Boolean).join(' ★ ')
      text(ctx, footer, 540, 1290, { family: 'Silkscreen', size: 18, color: INK, align: 'center', maxWidth: 1000 })
    },
    over(ctx) {
      // bilah status di atas layar (menimpa foto)
      for (const p of PHONES)
        inPhone(ctx, p, () => {
          box(ctx, 53, 69, 314, 30, 'rgba(255,255,255,0.7)')
          const o = { family: 'Silkscreen', size: 14, color: '#15161a' }
          text(ctx, '▮▮▮▯', 65, 75, o)
          text(ctx, '12:00', 210, 75, { ...o, align: 'center' })
          text(ctx, '▭', 355, 75, { ...o, align: 'right' })
        })
    },
  },
})
