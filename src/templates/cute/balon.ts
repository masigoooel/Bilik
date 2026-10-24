// Balon — design-reference/cute-kawaii/balon.html (600x1800, 3 foto)
import { svg, text, type Ctx } from '../paint'
import { cute } from './define'
import { detailOverlay, photoInset } from './helpers'

const INK = '#3B1F4A'
const BG = '#BFE0F7'
/**
 * grup balon 400x518 (balon 400x440 + simpul + tali), berputar di titik tengah grup.
 * x/y = sudut kiri atas grup sebelum diputar (hasil ukur).
 */
const GROUPS = [
  { x: 80, y: 149, deg: -4, color: '#FF8FAB' },
  { x: 120, y: 667, deg: 3, color: '#7FD3FF' },
  { x: 85, y: 1185, deg: -2, color: '#FFD84D' },
]
/** kotak FOTO 342x382 (radius 0) dipotong elips oleh induknya (overflow hidden, radius 50%) */
const SLOTS = [
  { x: 106.3, y: 178.1 },
  { x: 151, y: 696.1 },
  { x: 112.6, y: 1214 },
].map((p, i) => ({ ...p, w: 342, h: 382, radius: 171, rotate: GROUPS[i].deg }))

function ellipse(ctx: Ctx, cx: number, cy: number, rx: number, ry: number) {
  ctx.moveTo(cx + rx, cy)
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
}

/** koordinat lokal grup (0,0 = kiri atas grup) */
function inGroup(ctx: Ctx, g: (typeof GROUPS)[number], draw: () => void) {
  ctx.save()
  ctx.translate(g.x + 200, g.y + 259)
  ctx.rotate((g.deg * Math.PI) / 180)
  ctx.translate(-200, -259)
  draw()
  ctx.restore()
}

/** balon: elips 400x440 berwarna + border 5px */
function balloon(ctx: Ctx, color: string) {
  ctx.beginPath()
  ellipse(ctx, 200, 220, 200, 220)
  ctx.fillStyle = color
  ctx.fill()
  ctx.beginPath()
  ellipse(ctx, 200, 220, 200, 220)
  ellipse(ctx, 200, 220, 195, 215)
  ctx.fillStyle = INK
  ctx.fill('evenodd')
}

export const balon = cute({
  id: 'cute-balon',
  name: 'balon',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#FBF6FF',
  fonts: ['Caprasimo', 'Nunito:600,800'],
  fields: ['tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'terbang', 300, 60, { family: 'Caprasimo', size: 60, color: INK, align: 'center' })
      for (const g of GROUPS) {
        inGroup(ctx, g, () => {
          balloon(ctx, g.color)
          // simpul: segitiga border-bottom 22px, lebar 32 (margin-top -4)
          ctx.beginPath()
          ctx.moveTo(200, 436)
          ctx.lineTo(216, 458)
          ctx.lineTo(184, 458)
          ctx.closePath()
          ctx.fillStyle = INK
          ctx.fill()
          // tali
          svg(ctx, 'M20 0 C 0 15, 40 30, 20 60', 180, 458, 40, 60, 40, 60, { stroke: INK, lineWidth: 3 })
        })
      }
      const tanggal = texts.tanggal?.trim()
      if (tanggal) text(ctx, tanggal, 300, 1733, { family: 'Nunito', size: 20, weight: 800, color: INK, align: 'center', maxWidth: 520 })
    },
    over(ctx, { W, H }) {
      for (const g of GROUPS) {
        inGroup(ctx, g, () => {
          // bayangan inset kotak foto, terpotong elips
          ctx.save()
          ctx.beginPath()
          ellipse(ctx, 200, 220, 171, 191)
          ctx.clip()
          photoInset(ctx, { x: 29, y: 29, w: 342, h: 382 })
          ctx.restore()
          // sudut slot di luar elips foto: gambar ulang latar + balon
          ctx.save()
          ctx.beginPath()
          ctx.rect(27, 27, 346, 386)
          ellipse(ctx, 200, 220, 171, 191)
          ctx.clip('evenodd')
          ctx.fillStyle = BG
          ctx.fillRect(27, 27, 346, 386)
          balloon(ctx, g.color)
          ctx.restore()
          // kilau 70x34 (left 70, top 60 di dalam border) rotate(-35deg)
          ctx.save()
          ctx.translate(5 + 70 + 35, 5 + 60 + 17)
          ctx.rotate((-35 * Math.PI) / 180)
          ctx.beginPath()
          ctx.ellipse(0, 0, 35, 17, 0, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,0.7)'
          ctx.fill()
          ctx.restore()
        })
      }
      detailOverlay(ctx, W, H)
    },
  },
})
