// Jendela Pesawat — design-reference/travel/jendela-pesawat.html (1080x1350 portrait, 2 foto)
import { box, dropShadow, insetShadows, linear, radial, type Ctx } from '../paint'
import { travel } from './define'
import {
  ASAL_DEFAULT, disc, dropShadowShape, FONTS_NO_HAND, insetShadowShape, join, lineTop, MONO, ovalPath, rute, txt,
} from './helpers'

const SERIF_STACK = '"Libre Caslon Text", Georgia, serif'
const GREY = '#7a776f'
/** jendela: x kiri bingkai luar, tinggi tirai */
const WINDOWS = [
  { x: 135, shade: 90 },
  { x: 585, shade: 150 },
]
const SLOTS = WINDOWS.map((w) => ({ x: w.x + 55, y: 390, w: 250, h: 400 }))

const bezel = (ctx: Ctx, x: number) => () => ovalPath(ctx, x, 330, 360, 520, 180, 200)
const well = (ctx: Ctx, x: number) => () => ovalPath(ctx, x + 35, 370, 290, 440, 145, 170)
const glass = (ctx: Ctx, x: number, grow = 0) => () => ovalPath(ctx, x + 55 - grow, 390 - grow, 250 + 2 * grow, 400 + 2 * grow, 125 + grow, 150 + grow)

/** isi sumur jendela (#9a978f + inset 0 8px 16px) */
function drawWell(ctx: Ctx, x: number) {
  ctx.beginPath()
  well(ctx, x)()
  ctx.fillStyle = '#9a978f'
  ctx.fill()
  insetShadowShape(ctx, well(ctx, x), { x: x + 35, y: 370, w: 290, h: 440 }, 0, 8, 16, 'rgba(0,0,0,0.45)')
}

/** bingkai luar: gradien 160deg + inset terang atas / gelap bawah */
function drawBezel(ctx: Ctx, x: number) {
  const b = { x, y: 330, w: 360, h: 520 }
  ctx.beginPath()
  bezel(ctx, x)()
  ctx.fillStyle = linear(ctx, x, 330, 360, 520, 160, [[0, '#f8f7f3'], [1, '#cfccc4']])
  ctx.fill()
  insetShadowShape(ctx, bezel(ctx, x), b, 0, -10, 16, 'rgba(0,0,0,0.18)')
  insetShadowShape(ctx, bezel(ctx, x), b, 0, 6, 10, 'rgba(255,255,255,0.8)')
}

const rivet = (ctx: Ctx, x: number, y: number) =>
  disc(ctx, x, y, 10, radial(ctx, x + 3.5, y + 3, Math.hypot(6.5, 7), [[0, '#ffffff'], [1, '#b9b6ae']]))

export const jendelaPesawat = travel({
  id: 'travel-jendela-pesawat',
  name: 'jendela pesawat',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: '#DEDCD5' },
  placeholder: '#cfe2f2',
  fonts: FONTS_NO_HAND,
  fields: ['tempat', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 180, [[0, '#F2F1EC'], [0.6, '#DEDCD5'], [1, '#CFCCC4']]))

      // panel kabin atas + lampu baca
      dropShadow(ctx, 0, 0, W, 230, 0, 6, 12, 'rgba(0,0,0,0.12)')
      box(ctx, 0, 0, W, 230, linear(ctx, 0, 0, W, 230, 180, [[0, '#e9e8e3'], [1, '#d6d3cc']]))
      box(ctx, 130, 70, 820, 100, '#2b2b2b', 18)
      insetShadows(ctx, 130, 70, 820, 100, [{ dx: 0, dy: 3, blur: 6, color: 'rgba(0,0,0,0.6)' }], 18)
      for (const [lx, seat] of [[281.1, '17A'], [691.1, '17B']] as const) {
        dropShadow(ctx, lx, 97, 46, 46, 0, 0, 12, 'rgba(255,240,180,0.6)', 23)
        disc(ctx, lx, 97, 46, radial(ctx, lx + 23, 120, 23 * Math.SQRT2, [[0, '#fffbe6'], [0.6, '#d9d4b8']]))
        txt(ctx, seat, lx + 60, 101, { family: MONO, size: 26, weight: 700, color: '#f2f2f2' })
      }

      for (const { x } of WINDOWS) {
        // bingkai luar: garis terang 2px di bawah
        dropShadowShape(ctx, bezel(ctx, x), { x, y: 330, w: 360, h: 520 }, 0, 2, 0, 'rgba(255,255,255,0.6)')
        drawBezel(ctx, x)
        drawWell(ctx, x)
      }

      box(ctx, 0, 920, W, 14, linear(ctx, 0, 920, W, 14, 180, [[0, 'rgba(0,0,0,0.12)'], [1, 'rgba(0,0,0,0)']]))
      for (const [x, y] of [[60, 300], [1010, 300], [60, 880], [1010, 880]]) rivet(ctx, x, y)

      // info penerbangan (asal → tujuan dari tempat)
      txt(ctx, 'PENERBANGAN PB 017', 90, 990, { family: MONO, size: 16, color: GREY, ls: 3.2 })
      const r = rute(texts.tempat)
      if (r.tujuan) {
        const s = `${r.asal || ASAL_DEFAULT} → ${r.tujuan}`
        txt(ctx, s, 90, lineTop(ctx, 'Libre Caslon Text', 66, 1, 1022, 700), {
          family: SERIF_STACK, size: 66, weight: 700, color: '#2b2b2b', maxWidth: 700,
        })
      }
      txt(ctx, join(['kursi jendela', texts.tanggal, '06:40']), 90, 1096, { family: MONO, size: 18, color: GREY, maxWidth: 700 })

      dropShadow(ctx, 822.7, 1035, 167.3, 87, 0, 4, 10, 'rgba(0,0,0,0.1)', 12)
      box(ctx, 822.7, 1035, 167.3, 87, '#fff', 12)
      txt(ctx, 'ketinggian', 970, 1049, { family: MONO, size: 14, color: '#3a3a3a', align: 'right' })
      txt(ctx, '11.000 m', 970, 1070, { family: MONO, size: 26, weight: 700, color: '#3a3a3a', align: 'right' })
    },
    over(ctx) {
      WINDOWS.forEach(({ x, shade }, i) => {
        const s = SLOTS[i]
        // bentuk kaca = kotak dengan radius elips 125/150: sisa kotak slot di luar kaca digambar ulang (bingkai + sumur)
        ctx.save()
        ctx.beginPath()
        ctx.rect(s.x - 1, s.y - 1, s.w + 2, s.h + 2)
        glass(ctx, x)()
        ctx.clip('evenodd')
        drawBezel(ctx, x)
        drawWell(ctx, x)
        ctx.restore()

        ctx.save()
        ctx.beginPath()
        well(ctx, x)()
        ctx.clip()
        // cincin 3px #7a776f (box-shadow spread) di luar kaca
        ctx.beginPath()
        glass(ctx, x, 3)()
        glass(ctx, x)()
        ctx.fillStyle = GREY
        ctx.fill('evenodd')
        // kilau kaca + titik
        ctx.save()
        ctx.beginPath()
        glass(ctx, x)()
        ctx.clip()
        box(ctx, s.x, s.y, s.w, s.h, linear(ctx, s.x, s.y, s.w, s.h, 160, [
          [0, 'rgba(255,255,255,0.35)'], [0.35, 'rgba(255,255,255,0)'], [0.7, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0.12)'],
        ]))
        box(ctx, x + 177, 408, 6, 6, 'rgba(0,0,0,0.25)', 3)
        ctx.restore()
        // tirai jendela
        dropShadow(ctx, x + 35, 370, 290, shade, 0, 4, 6, 'rgba(0,0,0,0.25)')
        box(ctx, x + 35, 370, 290, shade, linear(ctx, x + 35, 370, 290, shade, 180, [[0, '#e8e6df'], [1, '#d4d1c9']]))
        box(ctx, x + 150, 370 + shade - 18, 60, 10, '#b9b6ae', 5)
        ctx.restore()
      })
    },
  },
})
