// Voucher Pulsa — design-reference/y2k-aesthetic/voucher-pulsa.html (1080x1350, 1 foto)
// Dirapikan dari desain: sobekan kanan digeser ke luar konten (desain asli memotong bingkai, nominal, & "kartu perdana"),
// chip pindah ke samping nominal (tidak menimpa bingkai foto), goresan koin di atas lapisan perak, pita hologram
// di bawah tulisan "*888*kode#" (tidak menimpanya).
import { border, box, dropShadow, insetShadows, linear, radial, rrPath, text, type Ctx } from '../paint'
import { y2k } from './define'
import { detailSheen, photoInset, spacedText } from './helpers'

const BG = '#CFE0F5'
const C = '#2F6BFF'
const NAVY = '#1a3a8a'
const CARD = { x: 150, y: 120, w: 780, h: 1110 }
/** sobekan kanan: dari tepi kanan konten (880) + 16px sampai tepi kartu */
const TEAR = 896
/** goresan koin di lapisan perak (531–880 × 932–1002): [left, top, width, rotasi] (tinggi 3px, diputar di tengah) */
const SCRATCHES: [number, number, number, number][] = [
  [600, 950, 38, -8], [640, 962, 52, 6], [712, 946, 34, -14], [748, 972, 46, -6], [806, 954, 40, 10], [668, 982, 30, -12],
]

/** repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 14px) di kotak kartu */
function stripes(ctx: Ctx) {
  const { x, y, w, h } = CARD
  const half = (w + h) * Math.SQRT1_2 / 2
  ctx.save()
  ctx.translate(x + w / 2, y + h / 2)
  ctx.rotate(Math.PI / 4)
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  for (let t = 0; t < 2 * half; t += 14) ctx.fillRect(t - half, -half, 2, 2 * half)
  ctx.restore()
}

export const voucherPulsa = y2k({
  id: 'y2k-voucher-pulsa',
  name: 'voucher pulsa',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  placeholder: '#E4E8EE',
  fonts: ['Outfit:600,800', 'Space Mono:400,700', 'Bagel Fat One', 'Silkscreen'],
  fields: ['nama'],
  slots: [{ x: 214, y: 284, w: 652, h: 560, radius: 12 }],
  draw: {
    under(ctx, { texts, W, H }) {
      // radial-gradient(circle at 30% 20%, #fff, bg 70%), farthest-corner
      ctx.fillStyle = radial(ctx, 324, 270, Math.hypot(756, 1080), [[0, '#ffffff'], [0.7, BG], [1, BG]])
      ctx.fillRect(0, 0, W, H)

      const { x, y, w, h } = CARD
      dropShadow(ctx, x, y, w, h, 0, 30, 50, 'rgba(20,40,120,0.35)', 36)
      ctx.save()
      ctx.beginPath()
      rrPath(ctx, x, y, w, h, 36)
      ctx.clip()
      box(ctx, x, y, w, h, linear(ctx, x, y, w, h, 150, [[0, C], [1, NAVY]]))
      insetShadows(ctx, x, y, w, h, [{ dx: 0, dy: 2, color: 'rgba(255,255,255,0.4)' }], 36)
      stripes(ctx)
      box(ctx, x, y, w, h, radial(ctx, x + w * 0.8, y + h * 0.1, Math.hypot(w * 0.8, h * 0.9) * 0.3, [[0, 'rgba(255,255,255,0.35)'], [1, 'rgba(255,255,255,0)']]))

      // nama operator + nominal
      const nama = texts.nama?.trim()
      text(ctx, `${nama || 'kita'}cell`, 200, 166, { family: 'Bagel Fat One', size: 54, color: '#ffffff', maxWidth: 520 })
      box(ctx, 742.5, 183.5, 137.5, 44, '#ffffff', 20)
      text(ctx, 'Rp 10.000', 758.5, 191.5, { family: 'Outfit', size: 22, weight: 800, color: NAVY })

      // bingkai foto
      box(ctx, 200, 270, 680, 588, 'rgba(255,255,255,0.9)', 22)

      // kode gosok
      ctx.save()
      ctx.globalAlpha = 0.9
      text(ctx, 'GOSOK UNTUK KODE ISI ULANG', 200, 900, { family: 'Silkscreen', size: 16, color: '#ffffff' })
      ctx.restore()
      ctx.save()
      ctx.beginPath()
      rrPath(ctx, 200, 932, 680, 70, 12)
      ctx.clip()
      box(ctx, 200, 932, 680, 70, linear(ctx, 200, 932, 680, 70, 90, [[0, '#c9ced6'], [0.3, '#f1f3f6'], [0.55, '#b0b7c0'], [0.8, '#e9ecef'], [1, '#c9ced6']]))
      box(ctx, 200, 932, 330.8, 70, '#ffffff')
      spacedText(ctx, '1710 2026 ', 218, 948, { family: 'Space Mono', size: 26, weight: 700, color: NAVY, letterSpacing: 2.6 })
      ctx.restore()
      ctx.save()
      ctx.globalAlpha = 0.85
      text(ctx, '*888*kode# · berlaku sampai 31.12.2026', 200, 1020, { family: 'Outfit', size: 15, color: '#ffffff' })
      ctx.restore()

      box(ctx, x, 1140, w, 90, 'rgba(0,0,0,0.18)')
      text(ctx, 'SN 0017 2026 1017', 200, 1174.5, { family: 'Space Mono', size: 14, color: '#ffffff' })
      text(ctx, 'kartu perdana', 880, 1174.5, { family: 'Space Mono', size: 14, color: '#ffffff', align: 'right' })
      ctx.restore()
    },
    over(ctx, { W, H }) {
      photoInset(ctx, 214, 284, 652, 560, 12)

      // pita hologram (opacity 0.75, mix-blend screen)
      ctx.save()
      ctx.globalAlpha = 0.75
      ctx.globalCompositeOperation = 'screen'
      box(ctx, 150, 1080, 780, 24, linear(ctx, 150, 1080, 780, 24, 90, [[0, '#ff9acd'], [0.25, '#9ad6ff'], [0.5, '#c8ff9a'], [0.75, '#ffe59a'], [1, '#ff9acd']]))
      ctx.restore()

      // sobekan kanan: garis tipis tiap 11px dari bawah + tepi kiri putus-putus 3px
      ctx.save()
      ctx.beginPath()
      rrPath(ctx, TEAR, 120, 930 - TEAR, 1110, [0, 36, 36, 0])
      ctx.clip()
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      for (let ly = 1230 - 11; ly >= 120; ly -= 11) ctx.fillRect(TEAR, ly, 930 - TEAR, 1)
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      const n = Math.round((1110 + 3) / 9)
      const gap = (1110 - n * 6) / (n - 1)
      for (let i = 0; i < n; i++) ctx.fillRect(TEAR, 120 + i * (6 + gap), 3, 6)
      ctx.restore()

      // goresan koin di lapisan perak (abu tipis, seperti bekas digosok)
      ctx.fillStyle = 'rgba(96,106,120,0.45)'
      for (const [sx, sy, sw, rot] of SCRATCHES) {
        ctx.save()
        ctx.translate(sx + sw / 2, sy + 1.5)
        ctx.rotate((rot * Math.PI) / 180)
        ctx.fillRect(-sw / 2, -1.5, sw, 3)
        ctx.restore()
      }

      // chip emas di samping nominal, sejajar tengah dengan pil "Rp 10.000"
      const cx = 670
      const cy = 182.5
      box(ctx, cx, cy, 60, 46, linear(ctx, cx, cy, 60, 46, 135, [[0, '#5a3e14'], [0.18, '#c9a24a'], [0.28, '#f6e3a4'], [0.42, '#a8822e'], [0.58, '#e8c878'], [0.76, '#7a5820'], [1, '#d9b45a']]), 8)
      border(ctx, cx, cy, 60, 46, 1, 'rgba(0,0,0,0.3)', 8)
      box(ctx, cx + 8, cy + 14, 44, 2, 'rgba(0,0,0,0.35)')
      box(ctx, cx + 8, cy + 30, 44, 2, 'rgba(0,0,0,0.35)')

      detailSheen(ctx, W, H)
    },
  },
})
