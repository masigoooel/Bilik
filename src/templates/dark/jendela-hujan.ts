// Jendela Hujan — design-reference/dark-grunge/jendela-hujan.html (1080x1350, 2 foto)
import { box, dropShadow, linear, rrPath, setShadow, svg, type Ctx } from '../paint'
import { dark } from './define'
import { SPECIAL, ellipseGradient, join, romanDate, slotInset, txt, vignette } from './helpers'

const BG = '#0E1116'
const SLOTS = [
  { x: 90, y: 160, w: 430, h: 640 },
  { x: 560, y: 160, w: 430, h: 640 },
]
/** tetes air di kaca (sama di kedua kaca): kiri, atas, lebar, tinggi relatif kaca */
const DROPS: [number, number, number, number][] = [
  [173, 16, 14, 20], [191, 547, 7, 10], [347, 321, 8, 11], [294, 413, 9, 13], [209, 199, 12, 17], [361, 122, 13, 18],
  [26, 383, 13, 18], [331, 583, 7, 10], [73, 74, 14, 20], [86, 105, 13, 18], [71, 334, 10, 14], [11, 68, 13, 18],
  [219, 292, 12, 17], [188, 217, 12, 17], [108, 407, 9, 13], [244, 494, 6, 8], [414, 376, 9, 13], [311, 561, 11, 15],
  [242, 325, 9, 13], [258, 81, 13, 18], [14, 502, 12, 17], [204, 398, 5, 7], [398, 380, 14, 20], [66, 259, 11, 15],
  [17, 565, 9, 13], [334, 464, 10, 14], [380, 332, 13, 18], [369, 177, 8, 11], [263, 504, 6, 8], [27, 99, 5, 7],
  [318, 298, 10, 14], [246, 296, 9, 13], [226, 529, 8, 11], [218, 276, 6, 8], [251, 503, 10, 14], [208, 31, 6, 8],
  [398, 416, 10, 14], [172, 342, 8, 11], [95, 118, 13, 18], [104, 337, 9, 13],
]
/** jejak air: kiri, atas, tinggi (lebar 3px) */
const STREAKS: [number, number, number][] = [
  [328, 73, 279], [98, 194, 305], [191, 109, 231], [181, 165, 214], [394, 150, 288], [271, 8, 311], [330, 184, 123], [126, 123, 143],
]
/** hati digambar di embun (svg 170x150, viewBox 24: skala 6.25, digeser 10px ke tengah) */
const HEART = 'M12 21s-7.5-4.6-9.6-9.2C.9 8.5 2.9 4.9 6.5 4.9c2 0 3.6 1.1 4.5 2.6.9-1.5 2.5-2.6 4.5-2.6 3.6 0 5.6 3.6 4.1 6.9C19.5 16.4 12 21 12 21z'
const METAL: [number, string][] = [
  [0, '#5a3e14'],
  [0.18, '#c9a24a'],
  [0.28, '#f6e3a4'],
  [0.42, '#a8822e'],
  [0.58, '#e8c878'],
  [0.76, '#7a5820'],
  [1, '#d9b45a'],
]

function drop(ctx: Ctx, x: number, y: number, w: number, h: number) {
  const el = () => {
    ctx.beginPath()
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
  }
  // box-shadow 1px 2px 2px (tidak tampak di bawah tetes yang tembus pandang)
  ctx.save()
  ctx.beginPath()
  ctx.rect(x - 20, y - 20, w + 40, h + 40)
  ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
  ctx.clip('evenodd')
  const off = 20000
  setShadow(ctx, 1 + off, 2, 2, 'rgba(0,0,0,0.3)')
  ctx.translate(-off, 0)
  el()
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.restore()
  // radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0.1) 60%), farthest-corner
  const cx = x + w * 0.35
  const cy = y + h * 0.3
  const r = Math.hypot(w * 0.65, h * 0.7)
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  g.addColorStop(0, 'rgba(255,255,255,0.7)')
  g.addColorStop(0.6, 'rgba(255,255,255,0.1)')
  g.addColorStop(1, 'rgba(255,255,255,0.1)')
  el()
  ctx.fillStyle = g
  ctx.fill()
}

/** api lilin 12x26: border-radius 50% / 60% 60% 40% 40%, glow 0 0 16px */
function flame(ctx: Ctx, x: number, y: number) {
  ctx.save()
  setShadow(ctx, 0, 0, 16, '#ff9a3c')
  ctx.beginPath()
  ctx.ellipse(x + 6, y + 15.6, 6, 15.6, 0, Math.PI, Math.PI * 2)
  ctx.ellipse(x + 6, y + 15.6, 6, 10.4, 0, 0, Math.PI)
  ctx.fillStyle = '#ffd27a'
  ctx.fill()
  ctx.restore()
}

export const jendelaHujan = dark({
  id: 'dark-jendela-hujan',
  name: 'jendela hujan',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: BG },
  placeholder: '#2a2e36',
  // kotak foto desain: filter blur(1px) brightness(0.8) saturate(0.7) → preset pudar (blur tidak ditiru)
  filter: 'pudar',
  fonts: ['Cinzel Decorative:700', 'Special Elite', 'Cormorant Garamond:500i', 'UnifrakturMaguntia'],
  // keterangan: nama · tanggal romawi
  fields: ['nama', 'tanggal'],
  texture: { opacity: 0.15, blend: 'screen' },
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      // kusen jendela 940x860
      dropShadow(ctx, 70, 130, 940, 860, 0, 30, 50, 'rgba(0,0,0,0.6)')
      box(ctx, 70, 130, 940, 860, linear(ctx, 70, 130, 940, 860, 180, [[0, '#2a2420'], [1, '#1a1612']]))
      ctx.beginPath()
      ctx.rect(70, 130, 940, 860)
      ctx.rect(76, 136, 928, 848)
      ctx.fillStyle = '#3a322a'
      ctx.fill('evenodd')
      for (const s of SLOTS) box(ctx, s.x, s.y, s.w, s.h, '#111111')

      // ambang jendela + lilin
      dropShadow(ctx, 70, 960, 940, 40, 0, 10, 14, 'rgba(0,0,0,0.5)')
      box(ctx, 70, 960, 940, 40, linear(ctx, 70, 960, 940, 40, 180, [[0, '#4a3e32'], [1, '#2a221a']]))
      flame(ctx, 140, 934)
      box(ctx, 162, 920, 30, 40, '#e8e2cf')

      txt(ctx, 'hujan belum reda', 540, 1090, { family: 'Cormorant Garamond', size: 54, weight: 500, italic: true, color: '#cfd6e0', align: 'center' })
      const sub = join([texts.nama?.trim(), romanDate(texts.tanggal)])
      txt(ctx, sub, 540, 1165, { family: SPECIAL, size: 15, ls: 4.5, color: '#8a909a', align: 'center', maxWidth: 900 })
    },
    over(ctx) {
      for (const s of SLOTS) {
        slotInset(ctx, s)
        // kaca (overflow hidden): rona biru, tetes air, jejak air
        ctx.save()
        ctx.beginPath()
        ctx.rect(s.x, s.y, s.w, s.h)
        ctx.clip()
        box(ctx, s.x, s.y, s.w, s.h, linear(ctx, s.x, s.y, s.w, s.h, 180, [[0, 'rgba(40,60,90,0.35)'], [1, 'rgba(10,15,25,0.5)']]))
        for (const [x, y, w, h] of DROPS) drop(ctx, s.x + x, s.y + y, w, h)
        for (const [x, y, h] of STREAKS) {
          ctx.beginPath()
          rrPath(ctx, s.x + x, s.y + y, 3, h, 2)
          ctx.fillStyle = linear(ctx, s.x + x, s.y + y, 3, h, 180, [[0, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0.35)']])
          ctx.fill()
        }
        ctx.restore()
      }

      // embun di kaca kiri (bergeser 10px ke kanan seperti desain)
      ellipseGradient(ctx, 100, 160, 430, 640, 0.5, 0.4, [
        [0, 'rgba(220,230,240,0.28)'],
        [0.6, 'rgba(220,230,240,0.12)'],
        [0.8, 'rgba(220,230,240,0)'],
        [1, 'rgba(220,230,240,0)'],
      ])
      svg(ctx, HEART, 240, 330, 150, 150, 24, 24, { stroke: 'rgba(255,255,255,0.45)', lineWidth: 1.2, lineCap: 'round' })

      // grendel
      dropShadow(ctx, 520, 520, 40, 70, 0, 3, 4, 'rgba(0,0,0,0.5)', 6)
      box(ctx, 520, 520, 40, 70, linear(ctx, 520, 520, 40, 70, 135, METAL), 6)

      // gorden: garis 18px bergantian, sudut kiri bawah bulat
      dropShadow(ctx, 1012, 60, 68, 1000, -8, 0, 20, 'rgba(0,0,0,0.5)', [0, 0, 0, 40])
      ctx.save()
      ctx.beginPath()
      rrPath(ctx, 1012, 60, 68, 1000, [0, 0, 0, 40])
      ctx.clip()
      for (let x = 0; x < 68; x += 36) {
        ctx.fillStyle = '#4a2a2a'
        ctx.fillRect(1012 + x, 60, 18, 1000)
        ctx.fillStyle = '#3a1e1e'
        ctx.fillRect(1012 + x + 18, 60, 18, 1000)
      }
      ctx.restore()
    },
    top(ctx, { W, H }) {
      vignette(ctx, W, H)
    },
  },
})
