// Mesin Gacha — design-reference/bold-pop/mesin-gacha.html (600x1800, 3 foto)
import { box, dropShadow, insetShadows, linear, rrPath, text, type Ctx, type Radii } from '../paint'
import { BANGERS, MONO, INK, fillEllipseGradient, insetRing, pmStops, rotated, spacedText } from './helpers'
import { pop } from './define'

const BG = '#FFE1EC'
const C = '#E23A3A'
const DOME = { x: 50, y: 120, w: 500, h: 940, r: [250, 250, 40, 40] as Radii }
/** kapsul bulat 250px (overflow hidden, radius 50%) di dalam kubah; foto = isi kapsul, warna tutup per kapsul */
const CAPSULES = [
  { x: 80, y: 240, rot: -14, top: ['rgba(255,90,90,0.8)', 'rgba(226,58,58,0.667)'] },
  { x: 275, y: 520, rot: 10, top: ['rgba(90,168,255,0.8)', 'rgba(58,123,226,0.667)'] },
  { x: 90, y: 800, rot: -6, top: ['rgba(255,210,74,0.8)', 'rgba(226,168,42,0.667)'] },
]
const SLOTS = CAPSULES.map((c) => ({ x: c.x, y: c.y, w: 250, h: 250, radius: 125, rotate: c.rot }))
/** bola hiasan 90px (opacity 0.6) */
const BALLS: [number, number, string][] = [
  [380, 260, '#9EF0D2'],
  [430, 820, '#C9B2FF'],
  [70, 580, '#FF9ACD'],
  [350, 990, '#FFD24A'],
]
const METAL: [number, string][] = [[0, '#f4f6f8'], [0.3, '#b9c0c8'], [0.5, '#6f777f'], [0.7, '#d9dee3'], [1, '#8f969d']]

function domeClip(ctx: Ctx) {
  ctx.beginPath()
  rrPath(ctx, DOME.x, DOME.y, DOME.w, DOME.h, DOME.r)
  ctx.clip()
}

function circle(ctx: Ctx, cx: number, cy: number, r: number) {
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
}

export const mesinGacha = pop({
  id: 'pop-mesin-gacha',
  name: 'mesin gacha',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#E8E6E0',
  fonts: ['Bangers', 'Space Mono:400,700'],
  fields: ['nama'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      // latar: radial-gradient(ellipse at 50% 30%, #fff 0, bg 70%), farthest-corner
      fillEllipseGradient(ctx, () => { ctx.beginPath(); ctx.rect(0, 0, W, H) }, 300, 540, 300 * Math.SQRT2, 1260 * Math.SQRT2, [[0, '#ffffff'], [0.7, BG]])

      // tutup atas
      box(ctx, 80, 70, 440, 60, linear(ctx, 80, 70, 440, 60, 180, [[0, '#ff6a6a'], [0.6, C], [1, '#9e1e1e']]), [30, 30, 6, 6])
      insetShadows(ctx, 80, 70, 440, 60, [{ dx: 0, dy: 3, color: 'rgba(255,255,255,0.4)' }], [30, 30, 6, 6])

      // kubah kaca (tanpa warna dasar): bayangan luar, gradien, bayangan dalam
      const { x, y, w, h, r } = DOME
      dropShadow(ctx, x, y, w, h, 0, 20, 30, 'rgba(0,0,0,0.15)', r)
      box(ctx, x, y, w, h, linear(ctx, x, y, w, h, 90, [[0, 'rgba(255,255,255,0.35)'], [0.2, 'rgba(255,255,255,0.08)'], [0.8, 'rgba(255,255,255,0.05)'], [1, 'rgba(255,255,255,0.25)']]), r)
      fillEllipseGradient(ctx, () => { ctx.beginPath(); rrPath(ctx, x, y, w, h, r) }, x + w * 0.3, y + h * 0.18, 350 * Math.SQRT2, h * 0.82 * Math.SQRT2, [[0, 'rgba(255,255,255,0.55)'], [0.3, 'rgba(255,255,255,0)']])
      insetShadows(ctx, x, y, w, h, [{ dx: 0, dy: 0, blur: 40, color: 'rgba(255,255,255,0.4)' }], r)
      insetRing(ctx, x, y, w, h, 6, 'rgba(255,255,255,0.75)', r)

      // bayangan kapsul (0 8px 14px, ikut rotasi kapsul), terpotong kubah
      ctx.save()
      domeClip(ctx)
      for (const c of CAPSULES) rotated(ctx, c.x + 125, c.y + 125, c.rot, () => dropShadow(ctx, c.x, c.y, 250, 250, 0, 8, 14, 'rgba(0,0,0,0.3)', 125))
      ctx.restore()

      // badan mesin
      const bx = 30
      const by = 1060
      dropShadow(ctx, bx, by, 540, 660, 0, 20, 30, 'rgba(0,0,0,0.25)', 30)
      box(ctx, bx, by, 540, 660, linear(ctx, bx, by, 540, 660, 180, [[0, '#ff6a6a'], [0.3, C], [1, '#b02020']]), 30)
      insetShadows(ctx, bx, by, 540, 660, [{ dx: 0, dy: 4, color: 'rgba(255,255,255,0.35)' }, { dx: 0, dy: -10, blur: 20, color: 'rgba(0,0,0,0.3)' }], 30)

      // papan nama KAPSUL FOTO
      box(ctx, 60, 1090, 480, 82, '#ffffff', 12)
      insetRing(ctx, 60, 1090, 480, 82, 4, INK, 12)
      spacedText(ctx, 'KAPSUL FOTO', 173, 1102, { family: BANGERS, size: 54, color: INK, letterSpacing: 2.16 })

      // tuas putar
      dropShadow(ctx, 90, 1210, 200, 200, 0, 8, 12, 'rgba(0,0,0,0.35)', 100)
      box(ctx, 90, 1210, 200, 200, linear(ctx, 90, 1210, 200, 200, 180, METAL), 100)
      insetRing(ctx, 90, 1210, 200, 200, 6, 'rgba(0,0,0,0.15)', 100)
      // repeating-conic-gradient(#d9dee3 0 10deg, #9aa3ae 10deg 20deg)
      ctx.save()
      circle(ctx, 190, 1310, 70)
      ctx.clip()
      ctx.fillStyle = '#9aa3ae'
      ctx.fillRect(120, 1240, 140, 140)
      ctx.fillStyle = '#d9dee3'
      for (let i = 0; i < 18; i++) {
        const a0 = ((i * 20 - 90) * Math.PI) / 180
        ctx.beginPath()
        ctx.moveTo(190, 1310)
        ctx.arc(190, 1310, 120, a0, a0 + Math.PI / 18)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
      insetRing(ctx, 120, 1240, 140, 140, 4, '#6f777f', 70)
      rotated(ctx, 190, 1310, -30, () => box(ctx, 160, 1298, 60, 24, '#2a2a2a', 12))

      // lubang koin + harga
      dropShadow(ctx, 340, 1220, 170, 200, 0, 4, 6, 'rgba(0,0,0,0.3)', 14)
      box(ctx, 340, 1220, 170, 200, linear(ctx, 340, 1220, 170, 200, 180, METAL), 14)
      box(ctx, 418, 1258.5, 14, 80, INK, 4)
      insetRing(ctx, 418, 1258.5, 14, 80, 3, '#555555', 4)
      text(ctx, 'Rp 5.000', 378.8, 1350.5, { family: BANGERS, size: 30, color: INK })

      // pintu keluar kapsul
      box(ctx, 180, 1460, 240, 170, '#2a1010', 20)
      insetShadows(ctx, 180, 1460, 240, 170, [{ dx: 0, dy: 10, blur: 20, color: 'rgba(0,0,0,0.6)' }], 20)
      const flap: Radii = [10, 10, 30, 30]
      box(ctx, 200, 1470, 200, 70, linear(ctx, 200, 1470, 200, 70, 180, [[0, 'rgba(255,255,255,0.4)'], [1, 'rgba(255,255,255,0.1)']]), flap)
      ctx.save()
      ctx.beginPath()
      rrPath(ctx, 200, 1470, 200, 70, flap)
      rrPath(ctx, 203, 1473, 194, 64, [7, 7, 27, 27])
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fill('evenodd')
      ctx.restore()

      const nama = texts.nama?.trim() ?? ''
      text(ctx, nama ? `putar 1x · 3 kapsul · ${nama}` : 'putar 1x · 3 kapsul', 300, 1660, { family: MONO, size: 14, weight: 700, color: '#ffffff', align: 'center', maxWidth: 500 })
    },
    over(ctx) {
      ctx.save()
      domeClip(ctx)
      for (const c of CAPSULES) {
        rotated(ctx, c.x + 125, c.y + 125, c.rot, () => {
          ctx.save()
          circle(ctx, c.x + 125, c.y + 125, 125)
          ctx.clip()
          // tutup kapsul: tinggi 48% + border bawah 4px putih 70% (gradien berulang di bawah border)
          ctx.fillStyle = linear(ctx, c.x, c.y, 250, 120, 180, pmStops([[0, c.top[0]], [1, c.top[1]]]))
          ctx.fillRect(c.x, c.y, 250, 120)
          ctx.fillStyle = c.top[0]
          ctx.fillRect(c.x, c.y + 120, 250, 4)
          ctx.fillStyle = 'rgba(255,255,255,0.7)'
          ctx.fillRect(c.x, c.y + 120, 250, 4)
          ctx.restore()
          // kilap tepi + bayangan dalam
          insetShadows(ctx, c.x, c.y, 250, 250, [{ dx: -12, dy: -16, blur: 24, color: 'rgba(0,0,0,0.25)' }], 125)
          insetRing(ctx, c.x, c.y, 250, 250, 3, 'rgba(255,255,255,0.6)', 125)
          // pantulan elips 80x40 rotate(-25deg)
          rotated(ctx, c.x + 80, c.y + 44, -25, () => {
            ctx.beginPath()
            ctx.ellipse(c.x + 80, c.y + 44, 40, 20, 0, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(255,255,255,0.75)'
            ctx.fill()
          })
        })
      }
      // bola hiasan: radial-gradient(circle at 35% 30%, #fff, warna 50%) farthest-corner
      for (const [bx, by, col] of BALLS) {
        ctx.save()
        ctx.globalAlpha = 0.6
        const g = ctx.createRadialGradient(bx + 31.5, by + 27, 0, bx + 31.5, by + 27, Math.hypot(58.5, 63))
        g.addColorStop(0, '#ffffff')
        g.addColorStop(0.5, col)
        circle(ctx, bx + 45, by + 45, 45)
        ctx.fillStyle = g
        ctx.fill()
        ctx.restore()
      }
      // kilap kaca memanjang (rotate 8deg)
      rotated(ctx, 145, 440, 8, () => box(ctx, 110, 160, 70, 560, linear(ctx, 110, 160, 70, 560, 90, [[0, 'rgba(255,255,255,0.5)'], [1, 'rgba(255,255,255,0)']]), 35))
      ctx.restore()
    },
  },
})
