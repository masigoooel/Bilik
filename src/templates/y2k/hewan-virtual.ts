// Hewan Virtual — design-reference/y2k-aesthetic/hewan-virtual.html (1080x1350, 1 foto)
import { box, dropShadow, ICONS, insetShadows, linear, radial, rrPath, setShadow, svg, text, type Ctx } from '../paint'
import { y2k } from './define'
import { dropPathShadow, group, insetPathShadows, spreadRing } from './helpers'

const BG = '#FFD0E8'
const C = '#C7A6FF'
const C2 = '#FF7EC2'
const INK = '#2a2440'
const PIX = '#2E3A22'
const LCD = { x: 339, y: 379, w: 402, h: 432 }

/** telur 700x900 di (190,175), border-radius 50% 50% 46% 46% / 56% 56% 44% 44% */
function eggPath(c: Ctx) {
  const x = 190
  const y = 175
  c.moveTo(x + 350, y)
  c.ellipse(x + 350, y + 504, 350, 504, 0, -Math.PI / 2, 0)
  c.ellipse(x + 378, y + 504, 322, 396, 0, 0, Math.PI / 2)
  c.lineTo(x + 322, y + 900)
  c.ellipse(x + 322, y + 504, 322, 396, 0, Math.PI / 2, Math.PI)
  c.ellipse(x + 350, y + 504, 350, 504, 0, Math.PI, Math.PI * 1.5)
  c.closePath()
}

/** titik kilau di dalam telur: [x, y, ukuran, alpha] relatif telur */
const GLITTER: [number, number, number, number][] = [
  [623, 841, 2, 0.66], [282, 534, 5, 0.7], [549, 280, 4, 0.94], [451, 646, 2, 0.72], [636, 506, 2, 0.8], [523, 165, 3, 0.82], [528, 333, 5, 0.79], [498, 351, 4, 0.66], [186, 654, 4, 0.67], [637, 292, 2, 0.64],
  [427, 519, 4, 0.83], [181, 317, 5, 0.75], [658, 480, 3, 0.93], [206, 50, 5, 0.77], [603, 134, 2, 0.81], [399, 390, 3, 0.94], [529, 623, 4, 0.53], [217, 178, 2, 0.93], [648, 35, 5, 0.69], [557, 523, 4, 0.53],
  [257, 122, 2, 0.67], [168, 717, 4, 0.78], [641, 345, 5, 0.56], [119, 751, 4, 0.55], [509, 493, 5, 0.83], [90, 664, 2, 0.51], [584, 150, 3, 0.78], [105, 184, 4, 0.78], [291, 689, 2, 0.7], [40, 830, 2, 0.79],
  [213, 471, 3, 0.72], [470, 477, 4, 0.75], [508, 749, 5, 0.76], [318, 392, 3, 0.63], [54, 105, 2, 0.73], [302, 306, 4, 0.62], [504, 461, 3, 0.7], [400, 52, 5, 0.82], [275, 855, 4, 0.77], [264, 568, 4, 0.84],
  [197, 364, 2, 0.67], [73, 777, 2, 0.84], [234, 737, 3, 0.69], [99, 181, 2, 0.83], [136, 429, 4, 0.75], [495, 780, 4, 0.72], [96, 151, 3, 0.53], [552, 51, 5, 0.58], [173, 208, 5, 0.63], [174, 539, 3, 0.76],
  [417, 835, 3, 0.6], [246, 732, 3, 0.75], [148, 449, 2, 0.81], [344, 266, 3, 0.75], [24, 825, 3, 0.86], [415, 212, 2, 0.84], [410, 558, 4, 0.7], [427, 563, 4, 0.75], [159, 753, 4, 0.61], [576, 844, 5, 0.83],
  [298, 702, 5, 0.58], [172, 188, 4, 0.81], [157, 413, 3, 0.53], [32, 60, 5, 0.71], [80, 137, 2, 0.79], [573, 122, 3, 0.8], [629, 52, 5, 0.53], [250, 825, 5, 0.68], [598, 724, 2, 0.92], [320, 114, 5, 0.71],
  [607, 80, 3, 0.58], [468, 142, 2, 0.93], [202, 71, 5, 0.81], [51, 788, 5, 0.88], [455, 686, 5, 0.82], [281, 474, 2, 0.6], [568, 826, 5, 0.79], [304, 626, 5, 0.51], [559, 829, 4, 0.83], [358, 815, 5, 0.73],
  [618, 629, 2, 0.79], [390, 395, 3, 0.81], [251, 801, 4, 0.51], [368, 466, 5, 0.81], [72, 372, 5, 0.56], [30, 364, 3, 0.53], [22, 494, 2, 0.87], [109, 713, 2, 0.77], [299, 255, 2, 0.56], [449, 578, 4, 0.58],
]

/** ikon piksel LCD 6x5 (# = piksel nyala), baris atas & bawah */
const ICONS_TOP = ['..##..', '.####.', '######', '######', '.#..#.', '..#...', '.###..', '#####.', '..#...', '..#...', '#....#', '.#..#.', '..##..', '.#..#.', '#....#', '......', '#.#.#.', '######', '######', '......']
const ICONS_BOTTOM = ['..#...', '.###..', '..#...', '..#...', '.###..', '######', '#....#', '#.##.#', '#....#', '######', '.####.', '#....#', '#.#..#', '#....#', '.####.', '..##..', '.####.', '..##..', '..##..', '.####.']
const ICON_X = [368.8, 469.3, 569.8, 670.3]

function pixelIcons(ctx: Ctx, rows: string[], y: number) {
  ctx.fillStyle = PIX
  ICON_X.forEach((ix, i) => {
    for (let r = 0; r < 5; r++) {
      const row = rows[i * 5 + r]
      for (let col = 0; col < 6; col++) if (row[col] === '#') ctx.fillRect(Math.round(ix + col * 7), y + r * 7, 6, 6)
    }
  })
}

/** tombol bulat mengilap 78px */
function button(ctx: Ctx, x: number, y: number) {
  const px = x + 78 * 0.35
  const py = y + 78 * 0.28
  dropShadow(ctx, x, y, 78, 78, 0, 12, 16, 'rgba(0,0,0,0.3)', 39)
  dropShadow(ctx, x, y, 78, 78, 0, 7, 0, '#6a3a54', 39)
  box(ctx, x, y, 78, 78, radial(ctx, px, py, Math.hypot(x + 78 - px, y + 78 - py), [[0, '#ffffff'], [0.35, '#f2d7e6'], [0.75, C2], [1, '#8a4a6a']]), 39)
  insetShadows(ctx, x, y, 78, 78, [{ dx: 0, dy: -4, blur: 6, color: 'rgba(0,0,0,0.15)' }], 39)
}

/** gantungan kunci logam (svg 140x190 di 470,10), gradien horizontal per bentuk */
function keychain(ctx: Ctx) {
  const ch = (x0: number, x1: number) => linear(ctx, x0, 0, x1 - x0, 1, 90, [[0, '#e9edf2'], [0.5, '#8f969d'], [1, '#e9edf2']])
  ctx.save()
  ctx.translate(470, 10)
  ctx.beginPath()
  ctx.arc(70, 40, 32, 0, Math.PI * 2)
  ctx.lineWidth = 9
  ctx.strokeStyle = ch(38, 102)
  ctx.stroke()
  ctx.lineWidth = 5
  ctx.strokeStyle = ch(61, 79)
  for (const cy of [86, 108, 130, 152]) {
    ctx.beginPath()
    ctx.ellipse(70, cy, 9, 13, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()
}

export const hewanVirtual = y2k({
  id: 'y2k-hewan-virtual',
  name: 'hewan virtual',
  width: 1080,
  height: 1350,
  photoCount: 1,
  // desain: filter grayscale(0.6) sepia(0.4) hue-rotate(40deg) contrast(1.1) di kotak FOTO (layar LCD hijau)
  filter: 'mint',
  background: { type: 'solid', color: BG },
  placeholder: '#B9C8A2',
  fonts: ['Silkscreen', 'Space Mono:400,700'],
  fields: ['nama'],
  slots: [{ x: 355, y: 447, w: 370, h: 284 }],
  draw: {
    under(ctx, { texts, W, H }) {
      // radial-gradient(circle at 50% 40%, #fff, bg 70%), farthest-corner
      ctx.fillStyle = radial(ctx, 540, 540, Math.hypot(540, 810), [[0, '#ffffff'], [0.7, BG], [1, BG]])
      ctx.fillRect(0, 0, W, H)
      keychain(ctx)

      // telur (opacity 0.96 untuk seluruh isinya)
      group(ctx, 0.96, (c) => {
        dropPathShadow(c, eggPath, 0, 34, 50, 'rgba(60,30,90,0.32)')
        c.save()
        c.beginPath()
        eggPath(c)
        c.clip()
        c.fillStyle = C
        c.fillRect(190, 175, 700, 900)
        c.fillStyle = radial(c, 680, 940, Math.hypot(490, 765) * 0.4, [[0, 'rgba(0,0,0,0.12)'], [1, 'rgba(0,0,0,0)']])
        c.fillRect(190, 175, 700, 900)
        c.fillStyle = radial(c, 400, 373, Math.hypot(490, 702) * 0.3, [[0, 'rgba(255,255,255,0.85)'], [1, 'rgba(255,255,255,0)']])
        c.fillRect(190, 175, 700, 900)
        insetPathShadows(c, eggPath, [
          { dx: -24, dy: -34, blur: 50, color: 'rgba(60,20,80,0.25)' },
          { dx: 18, dy: 14, blur: 30, color: 'rgba(255,255,255,0.45)' },
        ])
        for (const [gx, gy, s, a] of GLITTER) {
          c.beginPath()
          c.arc(190 + gx + s / 2, 175 + gy + s / 2, s / 2, 0, Math.PI * 2)
          c.fillStyle = `rgba(255,255,255,${a})`
          c.fill()
        }
        const star = (x: number, y: number, s: number, rot: number) =>
          svg(c, ICONS.star, x, y, s, s, 24, 24, { fill: C2, stroke: INK, lineWidth: 1.2, lineJoin: 'round', rotate: rot })
        star(280, 425, 46, -12)
        star(750, 415, 40, 14)
        star(270, 795, 34, 8)
        star(770, 815, 38, -10)
        box(c, 520, 201, 40, 24, 'rgba(255,255,255,0.5)', 12)

        // bingkai layar
        dropShadow(c, 305, 345, 470, 500, 0, 2, 0, 'rgba(255,255,255,0.8)', 70)
        box(c, 305, 345, 470, 500, linear(c, 305, 345, 470, 500, 160, [[0, '#fbf7ff'], [1, '#e6dcf2']]), 70)
        insetShadows(c, 305, 345, 470, 500, [{ dx: 0, dy: 6, blur: 12, color: 'rgba(0,0,0,0.18)' }], 70)
        box(c, 329, 369, 422, 452, '#6a6480', 26)
        insetShadows(c, 329, 369, 422, 452, [{ dx: 0, dy: 4, blur: 8, color: 'rgba(0,0,0,0.5)' }], 26)
        box(c, LCD.x, LCD.y, LCD.w, LCD.h, '#B9C8A2', 18)
        c.save()
        c.beginPath()
        rrPath(c, LCD.x, LCD.y, LCD.w, LCD.h, 18)
        c.clip()
        spreadRing(c, 365, 387, 49, 52, 2, PIX, 0)
        pixelIcons(c, ICONS_TOP, 401)
        pixelIcons(c, ICONS_BOTTOM, 765)
        c.restore()

        // tombol A B C
        button(c, 375, 885)
        button(c, 501, 865)
        button(c, 627, 885)
        text(c, 'A', 407.3, 971, { family: 'Silkscreen', size: 18, color: INK })
        text(c, 'B', 533.3, 951, { family: 'Silkscreen', size: 18, color: INK })
        text(c, 'C', 659.3, 971, { family: 'Silkscreen', size: 18, color: INK })
        for (let i = 0; i < 5; i++) box(c, 510 + i * 13, 315, 8, 8, 'rgba(42,36,64,0.35)', 4)
        c.restore()
      })

      // bayangan lantai: elips blur(12px)
      ctx.save()
      const off = 20000
      setShadow(ctx, off, 0, 24, 'rgba(60,30,90,0.18)')
      ctx.beginPath()
      ctx.ellipse(540 - off, 1100, 200, 20, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#000'
      ctx.fill()
      ctx.restore()

      text(ctx, texts.nama?.trim() ?? '', 540, 1160, { family: 'Silkscreen', size: 44, color: INK, align: 'center', maxWidth: 1000 })
      text(ctx, 'umur 17 hari · kenyang · lagi senang', 540, 1224, { family: 'Space Mono', size: 16, color: INK, align: 'center' })
    },
    over(ctx) {
      // garis piksel LCD + pantulan kaca (di atas foto), ikut opacity telur
      ctx.save()
      ctx.globalAlpha = 0.96
      ctx.beginPath()
      rrPath(ctx, LCD.x, LCD.y, LCD.w, LCD.h, 18)
      ctx.clip()
      ctx.fillStyle = 'rgba(0,0,0,0.06)'
      for (let y = LCD.y + 2; y < LCD.y + LCD.h; y += 3) ctx.fillRect(LCD.x, y, LCD.w, 1)
      for (let x = LCD.x; x < LCD.x + LCD.w; x += 3) ctx.fillRect(x, LCD.y, 1, LCD.h)
      ctx.translate(429, 419)
      ctx.rotate((-20 * Math.PI) / 180)
      ctx.beginPath()
      ctx.ellipse(0, 0, 130, 100, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      ctx.fill()
      ctx.restore()
    },
  },
})
