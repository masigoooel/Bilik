// Kartrid Game — design-reference/gaming-pixel/kartrid-game.html (600x1800, 3 foto)
import { border, box, contentHeight, insetShadows, linear, rrPath, setShadow, text, type Ctx } from '../paint'
import { PIXEL, SILK, circleGradient, ellipseGradient, join, rotated, splitLines } from './helpers'
import { gaming } from './define'

/** warna latar desain (prop bg, default) */
const BG = '#15151c'
const MUTED = '#a9a9b8'
const SOFT = 'rgba(255,255,255,0.85)'
const OUTFIT = '"Outfit", sans-serif'
const MONO = '"Space Mono", monospace'
const X = 65
const CARTS = [
  { top: 126, rot: -3, c1: '#E8553D', c2: '#8a2a1a', genre: 'PETUALANGAN', no: 'No. 017' },
  { top: 654, rot: 2, c1: '#2E7BE2', c2: '#1a3a7a', genre: 'BALAP', no: 'No. 027' },
  { top: 1182, rot: -2, c1: '#2F9E5A', c2: '#1a4a2a', genre: 'TEKA-TEKI', no: 'No. 037' },
]
/** [JUDUL GAME] = catatan (satu judul per baris); kartrid lain memakai judul cadangan */
const TITLE_FALLBACK = ['Hari Libur', 'Jalan Pulang', 'Teka-teki Kita']
/** posisi slot hasil ukur (pusat sebenarnya setelah rotasi) */
const SLOTS = [
  { x: 121.1, y: 225.1 },
  { x: 126, y: 753 },
  { x: 122, y: 1281 },
]

/** badan kartrid: clip-path polygon(0 0, 92% 0, 100% 6%, 100% 100%, 0 100%) + radius 14 0 10 10 */
function bodyPath(ctx: Ctx, x: number, y: number) {
  ctx.beginPath()
  ctx.moveTo(x, y + 14)
  ctx.arcTo(x, y, x + 14, y, 14)
  ctx.lineTo(x + 432.4, y)
  ctx.lineTo(x + 470, y + 30)
  ctx.lineTo(x + 470, y + 490)
  ctx.arcTo(x + 470, y + 500, x + 460, y + 500, 10)
  ctx.lineTo(x + 10, y + 500)
  ctx.arcTo(x, y + 500, x, y + 490, 10)
  ctx.closePath()
}

export const kartridGame = gaming({
  id: 'gaming-kartrid-game',
  name: 'kartrid game',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#D8D6CF',
  fonts: ['Press Start 2P', 'Silkscreen', 'Outfit:700,800', 'Space Mono:400,700'],
  fields: ['nama', 'catatan'],
  slots: CARTS.map((c, i) => ({ ...SLOTS[i], w: 352, h: 190, rotate: c.rot })),
  draw: {
    under(ctx, { texts, W, H }) {
      ellipseGradient(ctx, 0, 0, W, H, 0.5, 0.2, [[0, '#2e2e3c'], [0.7, BG], [1, BG]])
      // repeating-linear-gradient(0deg, putih 0.02 0 2px, transparan 2px 6px): dihitung dari bawah
      ctx.fillStyle = 'rgba(255,255,255,0.02)'
      for (let y = H - 2; y > -2; y -= 6) ctx.fillRect(0, y, W, 2)

      const nama = texts.nama?.trim()
      text(ctx, 'KOLEKSI', 223, 50, { family: PIXEL, size: 22, color: '#ffffff' })
      text(ctx, join([nama && `rak ${nama}`, '3 kartrid']), 300, 78, { family: MONO, size: 13, color: MUTED, align: 'center', maxWidth: 500 })
      text(ctx, 'tiup dulu sebelum dimasukkan', 300, 1710, { family: MONO, size: 13, color: MUTED, align: 'center' })

      const titles = splitLines(texts.catatan)
      CARTS.forEach((c, i) => {
        const T = c.top
        rotated(ctx, X + 235, T + 250, c.rot, () => {
          // badan + drop-shadow(0 16px 18px) seluruh kartrid
          ctx.save()
          setShadow(ctx, 0, 16, 18, 'rgba(0,0,0,0.45)')
          bodyPath(ctx, X, T)
          ctx.fillStyle = linear(ctx, X, T, 470, 500, 180, [[0, '#9a9aa4'], [1, '#6a6a74']])
          ctx.fill()
          ctx.restore()
          ctx.save()
          bodyPath(ctx, X, T)
          ctx.clip()
          box(ctx, X, T, 470, 500, circleGradient(ctx, X, T, 470, 500, 0.25, 0.1, [[0, 'rgba(255,255,255,0.28)'], [0.4, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']]))
          border(ctx, X, T, 470, 500, 2, 'rgba(0,0,0,0.2)', [14, 0, 10, 10])
          ctx.restore()

          // rusuk atas: clip-path polygon(0 0, 92% 0, 96% 100%, 0 100%), radius kiri atas 14
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(X, T)
          ctx.lineTo(X + 432.4, T)
          ctx.lineTo(X + 451.2, T + 30)
          ctx.lineTo(X, T + 30)
          ctx.closePath()
          ctx.clip()
          ctx.beginPath()
          rrPath(ctx, X, T, 470, 30, [14, 0, 0, 0])
          ctx.clip()
          ctx.fillStyle = 'rgba(0,0,0,0.18)'
          for (let x = 0; x < 470; x += 18) ctx.fillRect(X + x, T, 8, 30)
          ctx.restore()

          // ceruk label
          box(ctx, X + 38, T + 58, 394, 340, 'rgba(0,0,0,0.22)', 6)
          insetShadows(ctx, X + 38, T + 58, 394, 340, [{ dx: 0, dy: 3, blur: 5, color: 'rgba(0,0,0,0.4)' }], 6)

          // label (overflow hidden)
          const lx = X + 44
          const ly = T + 62
          ctx.save()
          ctx.beginPath()
          rrPath(ctx, lx, ly, 382, 330, 4)
          ctx.clip()
          box(ctx, lx, ly, 382, 330, linear(ctx, lx, ly, 382, 330, 160, [[0, c.c1], [1, c.c2]]))
          const L = lx + 12
          const R = lx + 370
          ctx.font = `8px "Press Start 2P"`
          const tw = ctx.measureText(c.genre).width
          box(ctx, L, ly + 12, tw + 12, 14, 'rgba(0,0,0,0.5)')
          text(ctx, c.genre, L + 6, ly + 15, { family: PIXEL, size: 8, color: '#ffffff' })
          text(ctx, '1 PEMAIN', R, ly + 12.5, { family: SILK, size: 10, color: SOFT, align: 'right' })
          border(ctx, L, ly + 34, 358, 196, 3, '#ffffff')

          const title = titles[i] ?? TITLE_FALLBACK[i]
          const o = { family: OUTFIT, size: 34, weight: 800, letterSpacing: -0.68, maxWidth: 352 }
          const ty = ly + 238 + (32.3 - contentHeight(ctx, OUTFIT, 34, 800)) / 2
          text(ctx, title, L + 3, ty + 3, { ...o, color: 'rgba(0,0,0,0.45)' })
          text(ctx, title, L, ty, { ...o, color: '#ffffff' })
          text(ctx, join([nama, '2026']), L, ly + 278.3, { family: MONO, size: 10, color: SOFT, maxWidth: 260 })
          text(ctx, c.no, R, ly + 278.3, { family: MONO, size: 10, color: SOFT, align: 'right' })
          ctx.restore()

          // alur pegangan + segitiga
          for (let k = 0; k < 5; k++) {
            const gy = T + 420 + k * 12
            box(ctx, X + 50, gy, 370, 6, linear(ctx, X + 50, gy, 370, 6, 180, [[0, 'rgba(255,255,255,0.25)'], [1, 'rgba(0,0,0,0.25)']]), 3)
          }
          ctx.beginPath()
          ctx.moveTo(X + 221, T + 410)
          ctx.lineTo(X + 249, T + 410)
          ctx.lineTo(X + 235, T + 426)
          ctx.closePath()
          ctx.fillStyle = 'rgba(0,0,0,0.25)'
          ctx.fill()
        })
      })
    },
    over(ctx) {
      // kilap di atas foto: linear-gradient(120deg, transparan 40%, putih 0.35 50%, transparan 60%)
      CARTS.forEach((c) => {
        rotated(ctx, X + 235, c.top + 250, c.rot, () => {
          const sx = X + 59
          const sy = c.top + 99
          box(ctx, sx, sy, 352, 190, linear(ctx, sx, sy, 352, 190, 120, [
            [0, 'rgba(255,255,255,0)'], [0.4, 'rgba(255,255,255,0)'], [0.5, 'rgba(255,255,255,0.35)'], [0.6, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)'],
          ]))
        })
      })
    },
  },
})
