// VHS — design-reference/retro-vintage/vhs.html (1200x1800, 4 foto)
import { border, box, insetShadows, text } from '../paint'
import { glyphText, insetRing, photoInset, rotated } from './helpers'
import { retro } from './define'

const LIGHT = '#f2f2f2'
const VT = 'VT323'
const SERIF = 'Playfair Display'
const FRAMES: [number, number][] = [
  [80, 332],
  [615, 332],
  [80, 982],
  [615, 982],
]

/** goresan tracking di tepi atas/bawah: [left, top, width, rotate] (tinggi 2px, rgba(255,255,255,0.18)) */
const SCRATCHES: [number, number, number, number][] = [[487, 18, 43, 7], [134, 1770, 36, -1], [392, 1785, 45, -4], [474, 1774, 67, -8], [131, 5, 39, -8], [551, 1789, 65, 5], [808, 1795, 79, -4], [748, 3, 51, -2], [528, 1791, 69, 1], [862, 1782, 54, 5], [475, 28, 74, 0], [334, 22, 65, -2], [1174, 8, 24, 7], [990, 2, 46, -4], [41, 1783, 75, -5], [90, 19, 44, 2], [1128, 28, 22, 1], [14, 2, 80, -2], [835, 1789, 29, -7], [695, 10, 77, 4]]

export const vhs = retro({
  id: 'retro-vhs',
  name: 'vhs',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#121212' },
  placeholder: '#2A2A2A',
  fonts: ['Playfair Display:700,900', 'IBM Plex Mono:400,600', 'Permanent Marker', 'VT323'],
  fields: ['tanggal'],
  texture: { opacity: 0.14, blend: 'multiply' },
  slots: FRAMES.map(([x, y]) => ({ x, y, w: 505, h: 620 })),
  draw: {
    under(ctx, { texts }) {
      // italic Playfair tidak dimuat desain: Chrome memiringkan 900 (sintetis), canvas juga
      text(ctx, 'VHS', 80, 54, { family: SERIF, size: 120, weight: 900, italic: true, color: LIGHT })
      text(ctx, 'SP · 120 MENIT', 1120, 148, { family: VT, size: 40, color: LIGHT, align: 'right' })
      box(ctx, 80, 228, 1040, 16, '#E2483C')
      box(ctx, 80, 252, 1040, 16, '#E8B04B')
      box(ctx, 80, 276, 1040, 16, '#3FA7D6')
      text(ctx, 'KASET 07', 80, 1684, { family: VT, size: 36, color: LIGHT })
      text(ctx, texts.tanggal?.trim() ?? '', 1120, 1684, { family: VT, size: 36, color: LIGHT, align: 'right', maxWidth: 700 })
    },
    over(ctx) {
      FRAMES.forEach(([x, y], i) => {
        photoInset(ctx, x, y, 505, 620)
        const o = { family: VT, size: 40, color: '#ffffff' }
        text(ctx, 'REC', x + 22, y + 23, o)
        text(ctx, '●', x + 97, y + 23, { ...o, color: '#ff3b30', align: 'center' })
        glyphText(ctx, '▶', 31, ' PLAY', x + 380, y + 28, { ...o, size: 36 })
        text(ctx, `00:0${i + 1}:17`, x + 483, y + 564, { ...o, align: 'right' })
        text(ctx, `SP · CH 0${i + 1}`, x + 22, y + 574, { ...o, size: 30 })
        // garis scan: repeating-linear-gradient(transparent 0 3px, rgba(0,0,0,0.08) 3px 5px)
        ctx.fillStyle = 'rgba(0,0,0,0.08)'
        for (let ly = 3; ly < 620; ly += 5) ctx.fillRect(x, y + ly, 505, Math.min(2, 620 - ly))
      })
    },
    top(ctx, { W, H }) {
      // label Hi-Fi STEREO bergaris (tanpa latar) di atas garis warna; di DOM sesudah lapisan noise
      border(ctx, 80, 232, 210.4, 49, 3, LIGHT)
      text(ctx, 'Hi-Fi STEREO', 95, 239, { family: SERIF, size: 26, weight: 900, italic: true, color: LIGHT })
      for (const [x, y, w, a] of SCRATCHES) rotated(ctx, x + w / 2, y + 1, a, () => box(ctx, x, y, w, 2, 'rgba(255,255,255,0.18)'))
      // bingkai layar: inset 0 0 0 6px rgba(255,255,255,0.04), inset 0 0 40px rgba(0,0,0,0.6)
      insetShadows(ctx, 0, 0, W, H, [{ dx: 0, dy: 0, blur: 40, color: 'rgba(0,0,0,0.6)' }])
      insetRing(ctx, 0, 0, W, H, 6, 'rgba(255,255,255,0.04)')
      // pita gangguan tracking di foto 1 (mix-blend-mode: screen)
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      for (let x = 80; x < 585; x += 9) {
        ctx.fillStyle = 'rgba(255,255,255,0.35)'
        ctx.fillRect(x, 470, Math.min(3, 585 - x), 22)
        ctx.fillStyle = 'rgba(255,255,255,0.05)'
        ctx.fillRect(x + 3, 470, Math.max(0, Math.min(6, 585 - x - 3)), 22)
      }
      ctx.restore()
    },
  },
})
