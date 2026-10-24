// Kotak Masuk MMS — design-reference/y2k-aesthetic/kotak-masuk-mms.html (600x1800, 3 foto)
import { border, box, dropShadow, insetShadows, linear, radial, rrPath, svg, text, type Ctx } from '../paint'
import { y2k } from './define'
import { photoInset } from './helpers'

const BG = '#FFD0E8'
const C = '#5F9BFF'
const NAVY = '#222233'
const PLUM = '#2a2440'
const ROWS = [231, 373, 515]
const KEY_FILL = (ctx: Ctx, x: number, y: number, w: number, h: number) => linear(ctx, x, y, w, h, 180, [[0, '#f4f6f8'], [1, '#b9c0c8']])

/** tombol keypad: [x, y, angka, x angka, sub, x sub, y sub] (hasil ukur) */
const KEYS: [number, number, string, number, string, number, number][] = [
  [119, 880, '1', 168.9, '', 0, 0],
  [245, 880, '2', 286.6, 'abc', 299.8, 895],
  [371, 880, '3', 413, 'def', 426.1, 895],
  [119, 930, '4', 161.3, 'ghi', 175.1, 945],
  [245, 930, '5', 288.9, 'jkl', 302, 945],
  [371, 930, '6', 411.2, 'mno', 424.5, 945],
  [119, 980, '7', 159.3, 'pqrs', 171.8, 995],
  [245, 980, '8', 287.4, 'tuv', 300.5, 995],
  [371, 980, '9', 410, 'wxyz', 423.3, 995],
  [119, 1030, '*', 165.8, '+', 177.6, 1045],
  [245, 1030, '0', 291.4, '␣', 306.1, 1044.5],
  [371, 1030, '#', 416.2, '⇧', 430.9, 1044.5],
]
const BEADS = ['#FF5FB7', '#FFE45C', '#5F9BFF', '#18C27A', '#B05FFF', '#FF8A1F']

/** bola mengilap: radial-gradient(circle at 35% 30%, #fff, warna 55%) */
function bead(ctx: Ctx, x: number, y: number, d: number, color: string, shadow: [number, number]) {
  const px = x + d * 0.35
  const py = y + d * 0.3
  dropShadow(ctx, x, y, d, d, 0, shadow[0], shadow[1], 'rgba(0,0,0,0.25)', d / 2)
  box(ctx, x, y, d, d, radial(ctx, px, py, Math.hypot(x + d - px, y + d - py), [[0, '#ffffff'], [0.55, color], [1, color]]), d / 2)
}

export const kotakMasukMms = y2k({
  id: 'y2k-kotak-masuk-mms',
  name: 'kotak masuk mms',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'linear', angle: 160, stops: [[0, BG], [1, '#E3D6FF']] },
  placeholder: '#dfe6ee',
  fonts: ['Silkscreen', 'Space Mono:400,700', 'Outfit:600,800', 'Bagel Fat One'],
  fields: ['nama', 'nama2'],
  slots: ROWS.map((y) => ({ x: 129, y: y + 10, w: 120, h: 120 })),
  draw: {
    under(ctx, { texts, W, H }) {
      const nama = texts.nama?.trim() ?? ''
      const nama2 = texts.nama2?.trim() ?? ''
      ctx.fillStyle = radial(ctx, 180, 360, Math.hypot(420, 1440) * 0.4, [[0, 'rgba(255,255,255,0.6)'], [1, 'rgba(255,255,255,0)']])
      ctx.fillRect(0, 0, W, H)

      // badan ponsel logam
      const R: [number, number, number, number] = [70, 70, 60, 60]
      dropShadow(ctx, 75, 90, 450, 1040, 0, 30, 50, 'rgba(40,20,80,0.35)', R)
      box(ctx, 75, 90, 450, 1040, linear(ctx, 75, 90, 450, 1040, 90, [[0, '#5a5a64'], [0.18, '#a8a8b4'], [0.5, '#6a6a74'], [0.82, '#b4b4c0'], [1, '#5a5a64']]), R)
      insetShadows(ctx, 75, 90, 450, 1040, [{ dx: 0, dy: 3, color: 'rgba(255,255,255,0.45)' }, { dx: 0, dy: -4, color: 'rgba(0,0,0,0.2)' }], R)
      box(ctx, 250, 120, 100, 10, '#222222', 5)
      insetShadows(ctx, 250, 120, 100, 10, [{ dx: 0, dy: 2, blur: 3, color: 'rgba(0,0,0,0.8)' }], 5)

      // layar
      box(ctx, 105, 154, 390, 560, '#111111', 18)
      ctx.save()
      ctx.beginPath()
      rrPath(ctx, 119, 168, 362, 532, 8)
      ctx.clip()
      box(ctx, 119, 168, 362, 532, linear(ctx, 119, 168, 362, 532, 180, [[0, C], [0.3, '#cfe2ff'], [1, '#eef4ff']]))
      box(ctx, 119, 168, 362, 32, 'rgba(0,0,0,0.4)')
      const sb = { family: 'Silkscreen', size: 11, color: '#ffffff' }
      text(ctx, '▂▄▆█', 129, 176.5, sb)
      text(ctx, '16:20', 277.8, 177, sb)
      text(ctx, '▮▮▮▯', 471, 177, { ...sb, align: 'right' })
      box(ctx, 119, 200, 362, 31, '#ffffff')
      box(ctx, 119, 229, 362, 2, '#8a9aaa')
      text(ctx, '✉ MMS Masuk (3)', 129, 207, { family: 'Silkscreen', size: 13, color: NAVY })

      const msgs = [
        { from: nama, time: '12:01', body: 'foto tadi siang' },
        { from: nama2 || nama, time: '12:05', body: 'yg ini lucu wkwk' },
        { from: nama, time: '12:07', body: 'kirim lg dong' },
      ]
      ROWS.forEach((y, i) => {
        box(ctx, 119, y, 362, 142, i === 0 ? '#fff6c8' : '#ffffff')
        box(ctx, 119, y + 140, 362, 2, '#b9c8d8')
        border(ctx, 127, y + 8, 124, 124, 2, '#8a9aaa')
        const m = msgs[i]
        const t = { family: 'Silkscreen', size: 12, color: NAVY }
        const tw = text(ctx, m.time, 473, y + 8, { ...t, align: 'right' })
        text(ctx, m.from || 'teman', 261, y + 8, { ...t, weight: 700, maxWidth: 212 - tw - 10 })
        text(ctx, m.body, 261, y + 27, t)
        if (i === 0) text(ctx, '● baru', 261, y + 46, { family: 'Silkscreen', size: 10, color: '#c0311f' })
      })

      box(ctx, 119, 664, 362, 36, 'rgba(0,0,0,0.4)')
      const nb = { family: 'Silkscreen', size: 12, color: '#ffffff' }
      text(ctx, 'Pilihan', 131, 674.5, nb)
      text(ctx, 'Buka', 280.5, 674.5, nb)
      text(ctx, 'Kembali', 469, 674.5, { ...nb, align: 'right' })
      ctx.restore()

      // tombol navigasi
      for (const sx of [105, 405]) {
        dropShadow(ctx, sx, 775, 90, 34, 0, 3, 0, '#6f777f', 17)
        box(ctx, sx, 775, 90, 34, KEY_FILL(ctx, sx, 775, 90, 34), 17)
      }
      dropShadow(ctx, 248, 740, 104, 104, 0, 4, 0, '#555555', 52)
      box(ctx, 248, 740, 104, 104, radial(ctx, 289.6, 776.4, Math.hypot(62.4, 67.6), [[0, '#ffffff'], [0.6, '#c9ced6'], [1, '#8f969d']]), 52)
      box(ctx, 278, 770, 44, 44, KEY_FILL(ctx, 278, 770, 44, 44), 22)
      border(ctx, 278, 770, 44, 44, 2, '#8f969d', 22)

      // keypad
      const KR: [number, number, number, number] = [10, 10, 16, 16]
      for (const [kx, ky, d, dx, sub, sx, sy] of KEYS) {
        dropShadow(ctx, kx, ky, 110, 40, 0, 3, 0, '#6f777f', KR)
        box(ctx, kx, ky, 110, 40, KEY_FILL(ctx, kx, ky, 110, 40), KR)
        insetShadows(ctx, kx, ky, 110, 40, [{ dx: 0, dy: 1, color: '#ffffff' }], KR)
        text(ctx, d, dx, ky + 10, { family: 'Outfit', size: 16, weight: 800, color: '#2a2a2e' })
        if (sub) text(ctx, sub, sx, sy, { family: 'Outfit', size: 8, weight: 800, color: '#6f777f' })
      }
      box(ctx, 280, 1100, 40, 6, '#222222', 3)
      box(ctx, 455, 1090, 18, 18, '#222222', 9)
      border(ctx, 455, 1090, 18, 18, 4, '#666666', 9)

      // tali + manik-manik
      svg(ctx, 'M10 0 C 40 40, 30 90, 50 150', 380, 1100, 100, 160, 100, 160, { stroke: PLUM, lineWidth: 3 })
      BEADS.forEach((col, i) => bead(ctx, 426, 1250 + i * 30, 26, col, [2, 3]))
      bead(ctx, 404, 1430, 70, '#FF9ACD', [4, 6])
      text(ctx, '♥', 439, 1447.5, { family: 'Bagel Fat One', size: 24, color: '#ffffff', align: 'center' })

      text(ctx, nama ? `3 MMS · ${nama} · 2004` : '3 MMS · 2004', 60, 1640, { family: 'Silkscreen', size: 14, color: PLUM, maxWidth: 480 })
    },
    over(ctx) {
      for (const y of ROWS) photoInset(ctx, 129, y + 10, 120, 120)
      // kilau kaca layar
      box(ctx, 119, 168, 362, 532, linear(ctx, 119, 168, 362, 532, 120, [[0, 'rgba(255,255,255,0.25)'], [0.35, 'rgba(255,255,255,0)']]), 8)
    },
  },
})
