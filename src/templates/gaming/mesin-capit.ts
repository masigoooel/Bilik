// Mesin Capit — design-reference/gaming-pixel/mesin-capit.html (600x1800, 3 foto)
import { border, box, dropShadow, insetShadows, linear, setShadow, svg, text, type Ctx } from '../paint'
import { PIXEL, SILK, circleGradient, ellipseGradient, glare, insetBlur, join, rotated } from './helpers'
import { gaming } from './define'

/** warna latar & mesin desain (prop bg, c, default) */
const BG = '#140F2A'
const C = '#E2368A'
const YELLOW = '#FFD24A'
/** kapsul 200x200 (border-radius 50%, overflow hidden) + warna tutupnya */
const CAPS = [
  { x: 94, y: 704, cap: '#FF5A5A' },
  { x: 314, y: 754, cap: '#5AA8FF' },
  { x: 214, y: 994, cap: '#FFD24A' },
]
/** isi kaca (padding box): x 64..536, y 184..1196 */
const GX = 64
const GY = 184
const GW = 472
const GH = 1012

function bubble(ctx: Ctx, x: number, y: number, color: string) {
  ctx.save()
  ctx.globalAlpha = 0.6
  box(ctx, x, y, 120, 120, circleGradient(ctx, x, y, 120, 120, 0.35, 0.3, [[0, '#ffffff'], [0.5, color], [1, color]]), 60)
  ctx.restore()
}

export const mesinCapit = gaming({
  id: 'gaming-mesin-capit',
  name: 'mesin capit',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#EEE8F6',
  fonts: ['Press Start 2P', 'Silkscreen', 'Space Mono:400,700', 'Outfit:700,800'],
  fields: ['nama'],
  slots: CAPS.map(({ x, y }) => ({ x, y, w: 200, h: 200, radius: 100 })),
  draw: {
    under(ctx, { texts, W, H }) {
      ellipseGradient(ctx, 0, 0, W, H, 0.5, 0.2, [[0, '#3a2a6a'], [0.7, BG], [1, BG]])

      // papan nama
      box(ctx, 50, 60, 500, 110, linear(ctx, 50, 60, 500, 110, 180, [[0, C], [1, '#a01e6a']]), [20, 20, 0, 0])
      insetShadows(ctx, 50, 60, 500, 110, [{ dx: 0, dy: 3, color: 'rgba(255,255,255,0.3)' }], [20, 20, 0, 0])
      ctx.save()
      setShadow(ctx, 0, 0, 10, 'rgba(255,255,255,0.6)')
      text(ctx, 'CAPIT!', 210, 100, { family: PIXEL, size: 30, color: '#ffffff' })
      ctx.restore()

      // kaca
      box(ctx, 50, 170, 500, 1040, '#2a2a3a')
      // kaca tembus: isi = latar halaman + rgba(120,200,255,0.08) + kilap
      box(ctx, GX, GY, GW, GH, BG)
      ctx.save()
      ctx.beginPath()
      ctx.rect(GX, GY, GW, GH)
      ctx.clip()
      ellipseGradient(ctx, 0, 0, W, H, 0.5, 0.2, [[0, '#3a2a6a'], [0.7, BG], [1, BG]])
      box(ctx, GX, GY, GW, GH, 'rgba(120,200,255,0.08)')
      box(ctx, GX, GY, GW, GH, linear(ctx, GX, GY, GW, GH, 120, [[0, 'rgba(255,255,255,0.18)'], [0.35, 'rgba(255,255,255,0.04)'], [1, 'rgba(255,255,255,0.04)']]))
      box(ctx, GX, GY + 30, GW, 10, linear(ctx, GX, GY + 30, GW, 10, 180, [[0, '#f4f6f8'], [0.3, '#b9c0c8'], [0.5, '#6f777f'], [0.7, '#d9dee3'], [1, '#8f969d']]))
      box(ctx, GX + 230, GY + 40, 6, 260, '#b9c0c8')
      // capit (svg 120x110)
      const cx = GX + 175
      const cy = GY + 290
      box(ctx, cx + 40, cy, 40, 24, '#9aa3ae', 4)
      svg(ctx, 'M44 22 C 20 40, 14 70, 30 100 M76 22 C 100 40, 106 70, 90 100 M60 24 V 90', cx, cy, 120, 110, 120, 110, { stroke: '#b9c0c8', lineWidth: 8, lineCap: 'round' })
      for (const c of CAPS) dropShadow(ctx, c.x, c.y, 200, 200, 0, 6, 10, 'rgba(0,0,0,0.35)', 100)
      ctx.restore()

      // badan bawah
      box(ctx, 50, 1210, 500, 440, linear(ctx, 50, 1210, 500, 440, 180, [[0, C], [1, '#8a1658']]))
      insetShadows(ctx, 50, 1210, 500, 440, [{ dx: 0, dy: 4, color: 'rgba(255,255,255,0.2)' }])
      box(ctx, 100, 1270, 30, 120, '#cfd5dd', 6)
      dropShadow(ctx, 85, 1240, 60, 60, 0, 4, 0, '#8a1a2a', 30)
      box(ctx, 85, 1240, 60, 60, '#FF3B5C', 30)
      dropShadow(ctx, 380, 1270, 110, 110, 0, 8, 0, '#9a7a1a', 55)
      box(ctx, 380, 1270, 110, 110, YELLOW, 55)
      text(ctx, 'AMBIL', 435, 1318, { family: PIXEL, size: 14, color: '#2a2a3a', align: 'center' })
      box(ctx, 200, 1460, 200, 130, '#1a1a2a', 12)
      insetBlur(ctx, 200, 1460, 200, 130, 0, 8, 14, 'rgba(0,0,0,0.7)', 12)
      text(ctx, join(['1 KOIN', '3 KESEMPATAN', texts.nama?.trim()]), 300, 1610, { family: SILK, size: 14, color: '#ffffff', align: 'center', maxWidth: 480 })

      // lampu bohlam
      for (const [y, first] of [[50, 0], [166, 1]]) {
        for (let i = 0; i < 21; i++) {
          ctx.save()
          setShadow(ctx, 0, 0, 8, YELLOW)
          box(ctx, 50 + i * 25, y, 12, 12, (i + first) % 2 ? '#fff6c0' : YELLOW, 6)
          ctx.restore()
        }
      }
    },
    over(ctx, { W, H }) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(GX, GY, GW, GH)
      ctx.clip()
      for (const c of CAPS) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(c.x + 100, c.y + 100, 100, 0, Math.PI * 2)
        ctx.clip()
        // tepi kotak FOTO (inset) lalu tutup kapsul (opacity 0.85, border-bottom 3px putih 0.7)
        insetShadows(ctx, c.x, c.y, 200, 200, [{ dx: 0, dy: 3, blur: 8, color: 'rgba(0,0,0,0.16)' }])
        border(ctx, c.x, c.y, 200, 200, 1, 'rgba(0,0,0,0.12)')
        ctx.globalAlpha = 0.85
        box(ctx, c.x, c.y, 200, 95, c.cap)
        box(ctx, c.x, c.y + 92, 200, 3, 'rgba(255,255,255,0.7)')
        ctx.globalAlpha = 1
        rotated(ctx, c.x + 64, c.y + 37, -25, () => {
          ctx.beginPath()
          ctx.ellipse(c.x + 64, c.y + 37, 30, 15, 0, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,0.6)'
          ctx.fill()
        })
        ctx.restore()
      }
      // gelembung hadiah
      bubble(ctx, GX - 30, GY + 880, '#9EF0D2')
      bubble(ctx, GX + 360, GY + 860, '#C9B2FF')
      bubble(ctx, GX + 250, GY + 520, '#FF9ACD')
      ctx.restore()

      // tumpukan boneka di dasar kaca (lapisan pertama paling atas)
      const piles: [number, number, string][] = [
        [0.85, 0.26, '#FFD24A'],
        [0.6, 0.28, '#9EF0D2'],
        [0.3, 0.3, '#FF9ACD'],
      ]
      for (const [px, stop, color] of piles) {
        ellipseGradient(ctx, 60, 1120, 480, 80, px, 1, [[0, color], [stop, color], [stop + 0.01, `${color}00`], [1, `${color}00`]])
      }
      glare(ctx, W, H)
    },
  },
})
