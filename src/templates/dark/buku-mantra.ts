// Buku Mantra — design-reference/dark-grunge/buku-mantra.html (1080x1350, 1 foto)
import { box, dropShadow, linear, rrPath, setShadow, type Ctx } from '../paint'
import { dark } from './define'
import { CINZEL, FRAKTUR, SPECIAL, ellipseGradient, slotInset, txt } from './helpers'

const BG = '#0B0907'
const MAROON = '#5a1a1a'
const GOLD = '#C9A24A'
const INK = '#2a1a10'
const LINE = 'rgba(42,26,16,0.35)'
const CORMORANT = 'Cormorant Garamond'
const SLOT = { x: 612, y: 389, w: 320, h: 400 }
/** pita pembatas: clip-path polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%) di kotak 710,306 36x140 */
function ribbonPath(ctx: Ctx) {
  ctx.moveTo(710, 306)
  ctx.lineTo(746, 306)
  ctx.lineTo(746, 446)
  ctx.lineTo(728, 306 + 140 * 0.86)
  ctx.lineTo(710, 446)
  ctx.closePath()
}

/** api lilin: border-radius 50% / 60% 60% 40% 40% di kotak 902,60 16x34 */
function flamePath(ctx: Ctx) {
  ctx.beginPath()
  ctx.ellipse(910, 80.4, 8, 20.4, 0, Math.PI, Math.PI * 2)
  ctx.ellipse(910, 80.4, 8, 13.6, 0, 0, Math.PI)
  ctx.closePath()
}

function candle(ctx: Ctx) {
  // box-shadow: 0 0 24px #ff9a3c, 0 0 50px rgba(255,154,60,0.5) (yang pertama paling atas)
  for (const [blur, color] of [
    [50, 'rgba(255,154,60,0.5)'],
    [24, '#ff9a3c'],
  ] as const) {
    ctx.save()
    setShadow(ctx, 0, 0, blur, color)
    flamePath(ctx)
    ctx.fillStyle = '#ffb84a'
    ctx.fill()
    ctx.restore()
  }
  ctx.save()
  flamePath(ctx)
  ctx.clip()
  ellipseGradient(ctx, 902, 60, 16, 34, 0.5, 0.7, [
    [0, '#fff6d0'],
    [0.6, '#ffb84a'],
    [1, '#ff7a2a'],
  ])
  ctx.restore()
  box(ctx, 909, 94, 2, 8, '#222222')
  box(ctx, 888, 102, 44, 150, linear(ctx, 888, 102, 44, 150, 90, [[0, '#d9d2c0'], [0.45, '#f4eedf'], [1, '#c9c0aa']]))
  box(ctx, 892, 102, 10, 46, '#f4eedf', [0, 0, 5, 5])
  box(ctx, 918, 102, 8, 28, '#f4eedf', [0, 0, 4, 4])
  dropShadow(ctx, 860, 252, 100, 18, 0, 6, 8, 'rgba(0,0,0,0.5)', 9)
  box(
    ctx,
    860,
    252,
    100,
    18,
    linear(ctx, 860, 252, 100, 18, 135, [
      [0, '#5a3e14'],
      [0.18, '#c9a24a'],
      [0.28, '#f6e3a4'],
      [0.42, '#a8822e'],
      [0.58, '#e8c878'],
      [0.76, '#7a5820'],
      [1, '#d9b45a'],
    ]),
    9,
  )
}

/** halaman 448x800: radial(ellipse at px py, rgba(120,80,30,0.18) → transparan 50%) di atas linear 90deg */
function page(ctx: Ctx, x: number, px: number, py: number, stops: [number, string][]) {
  box(ctx, x, 320, 448, 800, linear(ctx, x, 320, 448, 800, 90, stops))
  ellipseGradient(ctx, x, 320, 448, 800, px, py, [
    [0, 'rgba(120,80,30,0.18)'],
    [0.5, 'rgba(120,80,30,0)'],
    [1, 'rgba(120,80,30,0)'],
  ])
}

export const bukuMantra = dark({
  id: 'dark-buku-mantra',
  name: 'buku mantra',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  placeholder: '#cfc4aa',
  // kotak foto desain: filter sepia(0.5) contrast(1.1) → preset sepia
  filter: 'sepia',
  fonts: ['Cinzel Decorative:700', 'Special Elite', 'Cormorant Garamond:500i', 'UnifrakturMaguntia'],
  // nama penjaga halaman + nama di kaki halaman
  fields: ['nama'],
  slots: [SLOT],
  draw: {
    under(ctx, { texts, W, H }) {
      ellipseGradient(ctx, 0, 0, W, H, 0.5, 0.55, [
        [0, '#2a1e14'],
        [0.75, BG],
        [1, BG],
      ])
      ellipseGradient(ctx, 0, 0, W, H, 0.8, 0.12, [
        [0, 'rgba(255,190,110,0.28)'],
        [0.38, 'rgba(255,190,110,0)'],
        [1, 'rgba(255,190,110,0)'],
      ])
      candle(ctx)

      // filter: drop-shadow(0 30px 40px rgba(0,0,0,0.6)) dari siluet seluruh buku (sampul + halaman + pita);
      // blur drop-shadow() = deviasi standar (bukan radius seperti box-shadow) → shadowBlur 80
      ctx.save()
      const off = 20000
      setShadow(ctx, off, 30, 80, 'rgba(0,0,0,0.6)')
      ctx.translate(-off, 0)
      ctx.beginPath()
      rrPath(ctx, 70, 338, 940, 842, 8)
      ctx.rect(84, 320, 912, 800)
      ribbonPath(ctx)
      ctx.fillStyle = '#000'
      ctx.fill()
      ctx.restore()

      box(ctx, 70, 338, 940, 842, linear(ctx, 70, 338, 940, 842, 180, [[0, '#3a1a14'], [1, '#2a100c']]), 8)
      for (let i = 0; i < 5; i++) {
        const x = 84 + i * 2
        const y = 1120 + i * 5
        const w = 912 - i * 4
        box(ctx, x, y + 1, w, 4, 'rgba(0,0,0,0.3)')
        box(ctx, x, y, w, 4, '#d9c9a2')
      }

      // halaman kiri
      page(ctx, 84, 0.2, 0.2, [[0, '#d9c9a2'], [0.85, '#ece0c2'], [1, '#c9b88e']])
      box(ctx, 130, 374, 84, 84, MAROON)
      // inset 0 0 0 4px gold
      ctx.beginPath()
      ctx.rect(130, 374, 84, 84)
      ctx.rect(134, 378, 76, 76)
      ctx.fillStyle = GOLD
      ctx.fill('evenodd')
      txt(ctx, 'M', 138.8, 385, { family: FRAKTUR, size: 60, color: GOLD })
      ;[256, 230.4, 245.8, 179.2].forEach((w, i) => box(ctx, 230, 380 + i * 16, w, 6, LINE))
      txt(ctx, 'Bab XVII', 130, 473, { family: FRAKTUR, size: 48, color: MAROON })
      ;[356, 334.6, 356, 306.2, 356, 249.2, 341.8, 356, 284.8, 356].forEach((w, i) => box(ctx, 130, 538 + i * 22, w, 6, LINE))
      txt(ctx, 'ucapkan tiga kali sebelum tengah malam.', 130, 1037, { family: CORMORANT, size: 24, weight: 500, italic: true, color: INK })

      // punggung buku
      box(ctx, 532, 320, 16, 800, linear(ctx, 532, 320, 16, 800, 90, [[0, '#8a7a5a'], [0.5, '#3a2a1a'], [1, '#8a7a5a']]))

      // halaman kanan
      page(ctx, 548, 0.8, 0.8, [[0, '#c9b88e'], [0.15, '#ece0c2'], [1, '#d9c9a2']])
      // bingkai foto: border 3px double
      ctx.beginPath()
      ctx.rect(597, 374, 350, 430)
      ctx.rect(598, 375, 348, 428)
      ctx.rect(599, 376, 346, 426)
      ctx.rect(600, 377, 344, 424)
      ctx.fillStyle = MAROON
      ctx.fill('evenodd')

      const nama = texts.nama?.trim() ?? ''
      txt(ctx, nama, 772, 824, { family: CINZEL, size: 28, color: MAROON, align: 'center', maxWidth: 356 })
      txt(ctx, 'PENJAGA HALAMAN INI', 772, 881, { family: SPECIAL, size: 12, ls: 2.4, color: INK, align: 'center' })

      txt(ctx, nama ? `kitab malam · ${nama}` : 'kitab malam', 540, 1240, {
        family: CORMORANT,
        size: 26,
        weight: 500,
        italic: true,
        color: '#b9ad94',
        align: 'center',
        maxWidth: 960,
      })
    },
    over(ctx) {
      slotInset(ctx, SLOT)
      // pita pembatas menimpa foto
      ctx.beginPath()
      ribbonPath(ctx)
      ctx.fillStyle = linear(ctx, 710, 306, 36, 140, 90, [[0, MAROON], [1, '#8a2a2a']])
      ctx.fill()
    },
  },
})
