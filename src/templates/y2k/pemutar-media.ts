// Pemutar Media — design-reference/y2k-aesthetic/pemutar-media.html (600x1800, 3 foto)
import { border, box, dropShadow, insetShadows, linear, radial, rrPath, text, type Ctx } from '../paint'
import { y2k } from './define'
import { detailDots, photoInset } from './helpers'

const BG = '#7A6FD7'
const C = '#6FFFB0'
const INK = '#1d2229'
const EDGE = '#5f6670'
const TRACKS = [231, 629, 1027]
const BARS: [number, number][] = [
  [81, 20], [113.3, 34], [145.6, 48], [177.9, 30], [210.2, 52], [242.5, 40], [274.8, 26],
  [307.2, 44], [339.5, 36], [371.8, 22], [404.1, 46], [436.4, 30], [468.7, 18], [501, 38],
]

/** tombol bulat logam: radial-gradient(circle at 35% 30%, #fff, #cfd6df 40%, #8a939e) + border 2px */
function knob(ctx: Ctx, x: number, y: number, d: number) {
  const inner = d - 4
  const px = x + 2 + inner * 0.35
  const py = y + 2 + inner * 0.3
  const r = Math.hypot(Math.max(px - x - 2, x + 2 + inner - px), Math.max(py - y - 2, y + 2 + inner - py))
  box(ctx, x, y, d, d, radial(ctx, px, py, r, [[0, '#ffffff'], [0.4, '#cfd6df'], [1, '#8a939e']]), d / 2)
  border(ctx, x, y, d, d, 2, EDGE, d / 2)
}

export const pemutarMedia = y2k({
  id: 'y2k-pemutar-media',
  name: 'pemutar media',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#1c232c',
  fonts: ['Silkscreen', 'Space Mono:400,700', 'VT323'],
  fields: ['catatan', 'nama'],
  slots: TRACKS.map((y) => ({ x: 73, y: y + 6, w: 454, h: 330, radius: 6 })),
  draw: {
    under(ctx, { texts }) {
      // badan pemutar: logam mengilap
      dropShadow(ctx, 40, 40, 520, 1720, 0, 14, 30, 'rgba(0,0,0,0.25)', 44)
      box(ctx, 40, 40, 520, 1720, linear(ctx, 40, 40, 520, 1720, 180, [[0, '#ffffff'], [0.38, '#d7dce3'], [0.5, '#9aa3ae'], [0.62, '#eef1f5'], [1, '#b9c0c9']]), 44)
      insetShadows(ctx, 43, 43, 514, 1714, [{ dx: 0, dy: 10, blur: 18, color: 'rgba(255,255,255,0.8)' }], 41)
      border(ctx, 40, 40, 520, 1720, 3, EDGE, 44)

      text(ctx, 'pemutar media', 87, 60, { family: 'Silkscreen', size: 16, color: INK })
      knob(ctx, 447, 55, 30)
      knob(ctx, 483, 55, 30)
      text(ctx, '–', 462, 65, { family: 'Silkscreen', size: 8, color: '#2a2f38', align: 'center' })
      text(ctx, '×', 498, 65, { family: 'Silkscreen', size: 8, color: '#2a2f38', align: 'center' })

      // layar LCD: judul lagu (catatan) — nama
      box(ctx, 67, 113, 466, 102, '#B9D9A0', 14)
      insetShadows(ctx, 70, 116, 460, 96, [{ dx: 0, dy: 3, blur: 6, color: 'rgba(0,0,0,0.25)' }], 11)
      border(ctx, 67, 113, 466, 102, 3, EDGE, 14)
      text(ctx, '▶ sedang diputar', 86, 136, { family: 'VT323', size: 30, color: '#1f3a1a' })
      const song = [texts.catatan?.trim(), texts.nama?.trim()].filter(Boolean).join(' — ') || 'lagu kita'
      text(ctx, song, 86, 170, { family: 'VT323', size: 30, color: '#1f3a1a', maxWidth: 428 })

      TRACKS.forEach((y, i) => {
        box(ctx, 67, y, 466, 342, '#0d1014', 10)
        const ry = y + 348
        if (i === 0) {
          ctx.save()
          ctx.beginPath()
          rrPath(ctx, 67, ry, 466, 34, 8)
          ctx.clip()
          box(ctx, 67, ry, 466, 34, 'rgba(255,255,255,0.65)')
          box(ctx, 67, ry, 6, 34, C)
          ctx.restore()
        } else box(ctx, 67, ry, 466, 34, 'rgba(255,255,255,0.3)', 8)
        const n = String(i + 1).padStart(2, '0')
        text(ctx, `${n} foto_${n}.jpg`, i === 0 ? 83 : 77, ry + 6, { family: 'Space Mono', size: 15, weight: 700, color: INK })
        text(ctx, '0:17', 523, ry + 6, { family: 'Space Mono', size: 15, weight: 700, color: INK, align: 'right' })
      })

      // progres + tombol kontrol
      text(ctx, '0:06', 67, 1425, { family: 'Space Mono', size: 13, weight: 700, color: INK })
      box(ctx, 110.8, 1430, 378.3, 10, EDGE, 5)
      box(ctx, 110.8, 1430, 143.8, 10, C, 5)
      text(ctx, '0:17', 533, 1425, { family: 'Space Mono', size: 13, weight: 700, color: INK, align: 'right' })
      knob(ctx, 170, 1471, 68)
      knob(ctx, 256, 1461, 88)
      knob(ctx, 362, 1471, 68)
      text(ctx, '⏮', 204, 1489, { family: 'Space Mono', size: 21, color: '#2a2f38', align: 'center' })
      text(ctx, '▶', 300, 1484.5, { family: 'Space Mono', size: 28, color: '#2a2f38', align: 'center' })
      text(ctx, '⏭', 396, 1489, { family: 'Space Mono', size: 21, color: '#2a2f38', align: 'center' })

      // equalizer
      box(ctx, 67, 1565, 466, 84, '#0d1014', 12)
      for (const [bx, bh] of BARS) box(ctx, bx, 1639 - bh, 18, bh, linear(ctx, bx, 1639 - bh, 18, bh, 180, [[0, C], [1, '#2c7a5a']]))
    },
    over(ctx, { W, H }) {
      for (const y of TRACKS) photoInset(ctx, 73, y + 6, 454, 330, 6)
      text(ctx, '▶ 01', 83, 252, { family: 'VT323', size: 26, color: C })
      text(ctx, '❚❚ 02', 83, 650, { family: 'VT323', size: 26, color: C })
      text(ctx, '❚❚ 03', 83, 1048, { family: 'VT323', size: 26, color: C })
      detailDots(ctx, W, H)
    },
  },
})
