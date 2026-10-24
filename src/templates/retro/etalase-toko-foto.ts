// Etalase Toko Foto — design-reference/retro-vintage/etalase-toko-foto.html (1200x1800, 6 foto)
import { box, contentHeight, dropShadow, linear, text, type Ctx } from '../paint'
import { retro } from './define'
import { insetRing, photoInset, premul, repeatingLinear, rotated } from './helpers'

const CREAM = '#f1e6cf'
const AWNING = '#7A1E24'
const SERIF = 'Playfair Display'
const MONO = 'IBM Plex Mono'

type Frame = { cx: number; cy: number; p: number; deg: number; price: string; bg: (ctx: Ctx, x: number, y: number, w: number, h: number) => void }

/** kayu: linear-gradient(180deg, #7a4f2a, #5a3518) + serat repeating-linear-gradient(92deg, ...) */
function wood(ctx: Ctx, x: number, y: number, w: number, h: number, r = 0) {
  box(ctx, x, y, w, h, linear(ctx, x, y, w, h, 180, [[0, '#7a4f2a'], [1, '#5a3518']]), r)
  repeatingLinear(ctx, x, y, w, h, 92, 23, [[9, 10, 'rgba(0,0,0,0.10)'], [22, 23, 'rgba(255,230,190,0.07)']], r)
}

const grad = (stops: [number, string][]) => (ctx: Ctx, x: number, y: number, w: number, h: number) => box(ctx, x, y, w, h, linear(ctx, x, y, w, h, 135, stops))

/** bingkai pajangan (pusat = pusat foto), padding p, rotate deg */
const FRAMES: Frame[] = [
  { cx: 268, cy: 698, p: 14, deg: -1.2, price: '25.000', bg: (ctx, x, y, w, h) => repeatingLinear(ctx, x, y, w, h, 45, 8, [[0, 4, '#b8903a'], [4, 8, '#e2c272']]) },
  { cx: 600, cy: 700, p: 16, deg: 1, price: '40.000', bg: (ctx, x, y, w, h) => wood(ctx, x, y, w, h) },
  { cx: 932, cy: 694, p: 10, deg: 0.6, price: '30.000', bg: grad([[0, '#3a3a3a'], [1, '#111111']]) },
  { cx: 268, cy: 1322, p: 12, deg: -0.6, price: '35.000', bg: grad([[0, '#5a3e14'], [0.3, '#f6e3a4'], [0.55, '#a8822e'], [0.8, '#e8c878'], [1, '#e8c878']]) },
  { cx: 600, cy: 1322, p: 12, deg: 1.2, price: '20.000', bg: grad([[0, '#ffffff'], [1, '#d9d4c8']]) },
  { cx: 932, cy: 1328, p: 18, deg: -1, price: '45.000', bg: grad([[0, '#a07a48'], [1, '#6a4a28']]) },
]

function frame(ctx: Ctx, f: Frame) {
  const w = 274 + 2 * f.p
  const h = 404 + 2 * f.p
  const x = f.cx - w / 2
  const y = f.cy - h / 2
  rotated(ctx, f.cx, f.cy, f.deg, () => {
    dropShadow(ctx, x, y, w, h, 0, 10, 16, 'rgba(0,0,0,0.45)')
    f.bg(ctx, x, y, w, h)
    // inset 0 0 0 2px rgba(255,255,255,0.15) di atas inset 0 0 0 Ppx rgba(0,0,0,0.05)
    insetRing(ctx, x, y, w, h, f.p, 'rgba(0,0,0,0.05)')
    insetRing(ctx, x, y, w, h, 2, 'rgba(255,255,255,0.15)')
    box(ctx, x + f.p, y + f.p, 274, 404, '#f6f1e4')
    insetRing(ctx, x + f.p, y + f.p, 274, 404, 1, 'rgba(0,0,0,0.15)')

    // label harga (svg 90x56 di kanan-bawah: right 6px, bottom -36px)
    const sx = x + w - 96
    const sy = y + h - 20
    ctx.save()
    ctx.translate(sx, sy)
    ctx.beginPath()
    ctx.moveTo(10, 0)
    ctx.bezierCurveTo(20, 20, 40, 22, 50, 22)
    ctx.strokeStyle = '#e9e4d8'
    ctx.lineWidth = 1.5
    ctx.stroke()
    rotated(ctx, 66, 30, -8, () => {
      box(ctx, 44, 16, 44, 28, '#f6f1e4', 3)
      // svg <text y=35> = garis dasar
      ctx.font = `400 9px "${MONO}", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'
      ctx.fillStyle = '#2b2116'
      ctx.fillText(f.price, 66, 35)
    })
    ctx.restore()
  })
}

/** titik zigzag tepi bawah tenda (clip-path polygon desain, dalam %) */
const ZIG = [96.6, 93.3, 90, 86.6, 83.3, 80, 76.6, 73.3, 70, 66.6, 63.3, 60, 56.6, 53.3, 50, 46.6, 43.3, 40, 36.6, 33.3, 30, 26.6, 23.3, 20, 16.6, 13.3, 10, 6.6, 3.3]

function awningPath(ctx: Ctx) {
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(1200, 0)
  ctx.lineTo(1200, 140)
  ZIG.forEach((p, i) => ctx.lineTo((p / 100) * 1200, i % 2 === 0 ? 200 : 140))
  ctx.lineTo(0, 140)
  ctx.closePath()
}

export const etalaseTokoFoto = retro({
  id: 'retro-etalase-toko-foto',
  name: 'etalase toko foto',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#b59a7a' },
  placeholder: '#E4E2DD',
  fonts: ['Playfair Display:700,900,700i', 'IBM Plex Mono:400,600', 'Caveat:700', 'VT323'],
  fields: ['nama'],
  slots: FRAMES.map((f) => ({ x: f.cx - 125, y: f.cy - 190, w: 250, h: 380, rotate: f.deg })),
  draw: {
    under(ctx, { texts, W, H }) {
      // dinding: garis vertikal tiap 120px, garis horizontal tiap 60px (dari bawah)
      repeatingLinear(ctx, 0, 0, W, H, 90, 120, [[0, 2, 'rgba(0,0,0,0.08)']])
      repeatingLinear(ctx, 0, 0, W, H, 0, 60, [[0, 2, 'rgba(0,0,0,0.12)']])

      // tenda bergaris dengan tepi zigzag. filter: drop-shadow di desain ikut terpotong clip-path
      // (CSS: filter lalu clip-path), jadi bayangannya tidak tampak dan tidak digambar
      ctx.save()
      awningPath(ctx)
      ctx.clip()
      repeatingLinear(ctx, 0, 0, 1200, 200, 90, 160, [[0, 80, AWNING], [80, 160, CREAM]])
      box(ctx, 0, 0, 1200, 200, linear(ctx, 0, 0, 1200, 200, 180, premul([[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.18)']])))
      ctx.restore()
      box(ctx, 0, 0, 1200, 30, linear(ctx, 0, 0, 1200, 30, 180, [[0, '#3a2a1a'], [1, '#5a3a22']]))

      // papan nama toko
      dropShadow(ctx, 150, 230, 900, 150, 0, 8, 14, 'rgba(0,0,0,0.35)', 8)
      wood(ctx, 150, 230, 900, 150, 8)
      insetRing(ctx, 150, 230, 900, 150, 6, 'rgba(0,0,0,0.25)', 8)
      const nama = texts.nama?.trim()
      const judul = `Foto ${nama || 'Kenangan'}`
      // tulisan emas: background-clip text, gradien di kotak baris (y 257, tinggi 74) + drop-shadow(0 2px 0 rgba(0,0,0,0.4))
      const gold = linear(ctx, 0, 257, 10, 74, 180, [[0, '#f6e3a4'], [0.5, '#c9a24a'], [0.55, '#8a6420'], [1, '#e2c272']])
      const ty = 257 + (74 - contentHeight(ctx, SERIF, 74, 900)) / 2
      const to = { family: SERIF, size: 74, weight: 900, align: 'center' as const, maxWidth: 860 }
      // background-clip: text hanya mengisi kotak span (y 257–331): bagian glyph di luarnya (ekor kurung) tidak tampak
      for (const [dy, color] of [[2, 'rgba(0,0,0,0.4)'], [0, gold]] as const) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(150, 257 + dy, 900, 74)
        ctx.clip()
        text(ctx, judul, 600, ty + dy, { ...to, color })
        ctx.restore()
      }
      text(ctx, 'CETAK · BINGKAI · PAS FOTO', 600, 335, { family: MONO, size: 14, color: '#e2c272', letterSpacing: 4.9, align: 'center' })

      // lemari etalase
      dropShadow(ctx, 60, 420, 1080, 1260, 0, 14, 24, 'rgba(0,0,0,0.4)')
      box(ctx, 60, 420, 1080, 1260, '#3a2a1a')
      box(ctx, 82, 442, 1036, 1216, linear(ctx, 82, 442, 1036, 1216, 180, [[0, '#3a2a1e'], [1, '#2a1e14']]))
      insetRing(ctx, 82, 442, 1036, 1216, 4, '#5a3e22')
      dropShadow(ctx, 82, 962, 1036, 18, 0, 6, 8, 'rgba(0,0,0,0.4)')
      box(ctx, 82, 962, 1036, 18, linear(ctx, 82, 962, 1036, 18, 180, [[0, '#8a6236'], [1, '#5a3a22']]))
      box(ctx, 82, 1552, 1036, 18, linear(ctx, 82, 1552, 1036, 18, 180, [[0, '#8a6236'], [1, '#5a3a22']]))
      box(ctx, 600, 442, 14, 1216, linear(ctx, 600, 442, 14, 1216, 90, [[0, '#2a1e14'], [0.5, '#4a3422'], [1, '#2a1e14']]))

      for (const f of FRAMES) frame(ctx, f)

      // trotoar
      box(ctx, 0, 1700, 1200, 100, '#8a8078')
      repeatingLinear(ctx, 0, 1700, 1200, 100, 90, 120, [[0, 118, '#9a9088'], [118, 120, '#7a7068']])
    },
    over(ctx) {
      for (const f of FRAMES)
        rotated(ctx, f.cx, f.cy, f.deg, () => photoInset(ctx, f.cx - 125, f.cy - 190, 250, 380))
      // pantulan kaca etalase
      box(ctx, 82, 442, 1036, 1216, linear(ctx, 82, 442, 1036, 1216, 115, premul([
        [0, 'rgba(255,255,255,0)'], [0.22, 'rgba(255,255,255,0)'], [0.3, 'rgba(255,255,255,0.14)'], [0.38, 'rgba(255,255,255,0)'],
        [0.62, 'rgba(255,255,255,0)'], [0.68, 'rgba(255,255,255,0.08)'], [0.72, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)'],
      ])))
      // papan BUKA + tali
      dropShadow(ctx, 983.5, 462, 94.5, 46, 0, 4, 6, 'rgba(0,0,0,0.4)')
      box(ctx, 983.5, 462, 94.5, 46, CREAM)
      text(ctx, 'BUKA', 999.5, 470, { family: SERIF, size: 22, weight: 900, color: AWNING })
      box(ctx, 1028, 424, 2, 40, '#c9a24a')
    },
  },
})
