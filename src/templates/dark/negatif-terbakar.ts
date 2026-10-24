// Negatif Terbakar — design-reference/dark-grunge/negatif-terbakar.html (600x1800 strip, 3 foto)
import { box, insetShadows, linear, rrPath, setShadow, svg, type Ctx } from '../paint'
import { dark } from './define'
import { slotInset, txt } from './helpers'

const AMBER = 'rgba(255,170,90,0.75)'
/** bingkai film 448x500 */
const FRAMES = [90, 640, 1190]
const SLOTS = FRAMES.map((y) => ({ x: 76, y, w: 448, h: 500 }))
/** teks pinggir film di atas tiap bingkai (+ bawah): y, kiri, kanan */
const EDGE: [number, string, string][] = [
  [56, 'SAFETY FILM 400', '◂ 13'],
  [608, '▸ 14', '14A ▸'],
  [1158, '▸ 15', 'SAFETY FILM 400'],
]
/** goresan: kiri, atas, tinggi (lebar 1px) */
const SCRATCHES: [number, number, number][] = [
  [388, 1182, 413], [445, 581, 139], [295, 131, 232], [287, 1113, 318], [267, 509, 270], [369, 1082, 400],
  [205, 809, 185], [492, 1480, 291], [471, 1088, 265], [209, 1596, 257], [301, 647, 401], [170, 556, 175],
]
/** debu: kiri, atas, ukuran, alpha rgba(255,240,220,a) */
const DUST: [number, number, number, number][] = [
  [367, 314, 2, 0.4], [237, 237, 3, 0.39], [466, 321, 4, 0.34], [307, 516, 3, 0.61], [446, 713, 2, 0.31], [482, 1104, 4, 0.64],
  [407, 1288, 2, 0.69], [354, 768, 3, 0.5], [139, 1096, 2, 0.43], [241, 1321, 2, 0.56], [476, 242, 2, 0.4], [99, 734, 4, 0.36],
  [178, 142, 2, 0.57], [363, 1247, 2, 0.38], [439, 269, 3, 0.38], [175, 935, 2, 0.65], [452, 127, 2, 0.46], [439, 507, 4, 0.58],
  [122, 1169, 2, 0.48], [475, 831, 3, 0.63], [429, 1116, 2, 0.43], [131, 1202, 3, 0.54], [346, 1545, 3, 0.66], [180, 634, 2, 0.68],
  [215, 499, 4, 0.39], [425, 1683, 2, 0.41], [165, 219, 2, 0.53], [154, 1548, 4, 0.54], [445, 999, 2, 0.6], [310, 727, 4, 0.54],
  [406, 114, 3, 0.65], [109, 1309, 3, 0.45], [188, 729, 3, 0.33], [515, 1294, 2, 0.55], [508, 511, 2, 0.64], [155, 386, 2, 0.65],
  [481, 279, 2, 0.48], [323, 883, 4, 0.33], [472, 617, 2, 0.4], [278, 1185, 2, 0.43], [96, 1039, 4, 0.58], [143, 292, 4, 0.59],
  [342, 1440, 3, 0.66], [118, 1265, 4, 0.33], [391, 1460, 3, 0.44], [363, 1273, 4, 0.4], [298, 1128, 4, 0.43], [238, 1042, 2, 0.33],
  [452, 242, 2, 0.45], [428, 635, 3, 0.38], [338, 459, 2, 0.66], [374, 658, 2, 0.65], [121, 1360, 4, 0.34], [316, 1020, 2, 0.4],
  [426, 435, 2, 0.46], [150, 1414, 2, 0.59], [395, 988, 4, 0.59], [316, 296, 3, 0.51], [415, 1439, 3, 0.31], [357, 297, 4, 0.4],
]
/** lubang bakar: radial-gradient(ellipse rx ry at ...) di bingkai ke-i (yang pertama paling atas) */
const BURN: [number, string][] = [
  [0.42, '#050302'],
  [0.52, 'rgba(90,25,5,0.95)'],
  [0.6, 'rgba(220,110,30,0.55)'],
  [0.66, 'rgba(255,180,80,0.25)'],
  [0.74, 'rgba(255,180,80,0)'],
]
const SPOT: [number, string][] = [
  [0.55, '#050302'],
  [0.7, 'rgba(120,40,10,0.9)'],
  [0.8, 'rgba(230,130,40,0.5)'],
  [0.9, 'rgba(230,130,40,0)'],
]
const BURNS: [cx: number, cy: number, rx: number, ry: number, stops: [number, string][]][][] = [
  [[76 - 0.02 * 448, 90 + 150, 150, 100, BURN]],
  [
    [76 + 1.02 * 448, 640 + 360, 130, 90, BURN],
    [76 + 0.7 * 448, 640 + 90, 46, 46, SPOT],
  ],
  [[76 - 0.02 * 448, 1190 + 390, 150, 100, BURN]],
]
const CORNER: [number, string][] = [
  [0.4, '#000000'],
  [0.52, 'rgba(90,25,5,0.95)'],
  [0.6, 'rgba(230,120,40,0.5)'],
  [0.7, 'rgba(230,120,40,0)'],
]

/** radial-gradient(ellipse rx ry at cx cy, ...) di kotak x,y,w,h (stop sebelum yang pertama = warna pertama) */
function ellipseAt(ctx: Ctx, x: number, y: number, w: number, h: number, cx: number, cy: number, rx: number, ry: number, stops: [number, string][]) {
  const k = ry / rx
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  ctx.translate(cx, cy)
  ctx.scale(1, k)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  for (const [o, c] of stops) g.addColorStop(o, c)
  ctx.fillStyle = g
  ctx.fillRect(x - cx, (y - cy) / k, w, h / k)
  ctx.restore()
}

export const negatifTerbakar = dark({
  id: 'dark-negatif-terbakar',
  name: 'negatif terbakar',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#24160c' },
  placeholder: '#4a2a1a',
  // kotak foto desain: filter sepia(0.85) saturate(1.7) hue-rotate(-22deg) contrast(1.25) brightness(0.9) → preset sepia
  filter: 'sepia',
  fonts: ['Special Elite', 'UnifrakturMaguntia', 'Space Mono:400,700'],
  // nama di pinggir film paling bawah
  fields: ['nama'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 90, [[0, '#24160c'], [0.5, '#3a2414'], [1, '#24160c']]))
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 180, [
        [0, 'rgba(200,110,40,0.12)'],
        [0.3, 'rgba(200,110,40,0)'],
        [0.7, 'rgba(200,110,40,0.1)'],
        [1, 'rgba(200,110,40,0)'],
      ]))

      // lubang perforasi: ring luar 1px + bayangan inset atas
      for (const x of [28, 548])
        for (let y = 70; y < 1750; y += 58) {
          ctx.beginPath()
          rrPath(ctx, x - 1, y - 1, 26, 36, 5)
          rrPath(ctx, x, y, 24, 34, 4)
          ctx.fillStyle = 'rgba(255,160,90,0.15)'
          ctx.fill('evenodd')
          box(ctx, x, y, 24, 34, '#050302', 4)
          insetShadows(ctx, x, y, 24, 34, [{ dx: 0, dy: 2, blur: 3, color: 'rgba(0,0,0,0.9)' }], 4)
        }

      // kode tepi: repeating-linear-gradient periode 20px (0–6, 10–12)
      ctx.fillStyle = AMBER
      for (let p = 0; p < 200; p += 20) {
        ctx.fillRect(64 + p, 30, 6, 18)
        ctx.fillRect(74 + p, 30, 2, 18)
      }

      // glyph ▸ ◂ diambil dari font monospace cadangan seperti desain
      const o = { family: '"Space Mono", monospace', size: 13, weight: 700, color: AMBER }
      for (const [y, l, r] of EDGE) {
        txt(ctx, l, 64, y, o)
        txt(ctx, r, 536, y, { ...o, align: 'right' })
      }
      txt(ctx, '▸ 16', 64, 1706, o)
      txt(ctx, texts.nama?.trim().toUpperCase() ?? '', 536, 1706, { ...o, align: 'right', maxWidth: 380 })

      for (const s of SLOTS) box(ctx, s.x, s.y, s.w, s.h, '#1a120c')
    },
    over(ctx, { W, H }) {
      SLOTS.forEach((s, i) => {
        slotInset(ctx, s)
        // rona panas (mix-blend screen), lubang bakar, vinyet inset 40px
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        box(ctx, s.x, s.y, s.w, s.h, linear(ctx, s.x, s.y, s.w, s.h, 90, [
          [0, 'rgba(255,120,40,0.45)'],
          [0.3, 'rgba(255,200,80,0.15)'],
          [0.55, 'rgba(255,200,80,0)'],
          [1, 'rgba(255,200,80,0)'],
        ]))
        ctx.restore()
        for (const [cx, cy, rx, ry, stops] of [...BURNS[i]].reverse()) ellipseAt(ctx, s.x, s.y, s.w, s.h, cx, cy, rx, ry, stops)
        insetShadows(ctx, s.x, s.y, s.w, s.h, [{ dx: 0, dy: 0, blur: 40, color: 'rgba(0,0,0,0.7)' }])
      })

      ctx.fillStyle = 'rgba(255,230,200,0.28)'
      for (const [x, y, h] of SCRATCHES) ctx.fillRect(x, y, 1, h)
      for (const [x, y, d, a] of DUST) {
        ctx.beginPath()
        ctx.arc(x + d / 2, y + d / 2, d / 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,240,220,${a})`
        ctx.fill()
      }
      svg(ctx, 'M5 120 C 60 40, 120 140, 215 20', 160, 760, 220, 140, 220, 140, { stroke: 'rgba(10,6,4,0.7)', lineWidth: 1.6 })

      // sudut terbakar kanan atas & kiri bawah (ellipse 280x170)
      ellipseAt(ctx, 0, 0, W, H, -0.04 * W, 1.02 * H, 280, 170, CORNER)
      ellipseAt(ctx, 0, 0, W, H, 1.04 * W, -0.02 * H, 280, 170, CORNER)

      // cahaya bocor 120x60: radial(circle at 70% 30%) + filter blur(6px) → bayangan kabur dengan warna cahaya
      ctx.save()
      const off = 20000
      setShadow(ctx, off, 0, 12, 'rgb(255,200,120)')
      const r = Math.hypot(0.7 * 120, 0.7 * 60)
      const g = ctx.createRadialGradient(554 - off, 28, 0, 554 - off, 28, r)
      g.addColorStop(0, 'rgba(0,0,0,0.6)')
      g.addColorStop(0.6, 'rgba(0,0,0,0)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(470 - off, 10, 120, 60)
      ctx.restore()
    },
  },
})
