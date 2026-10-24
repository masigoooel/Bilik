// Kaset Demo — design-reference/kalcer/kaset-demo.html (1080x1350, 2 foto)
import { box, dropShadow, insetShadows, linear, radial, text, type Ctx } from '../paint'
import { ANTON, MARKER, MONO, dashedV, disc, insetRing, photoInset, rotated, songTitles, yearOf } from './helpers'
import { kalcer } from './define'

const BG = '#8A8578'
const C = '#E8553D'
const INK = '#1c1b19'
const CARD = '#F4F2EC'
/** sampul kiri kena filter grayscale(1) contrast(1.05): #F4F2EC → #F8F8F8, #1c1b19 → #161616 (hasil ukur) */
const CARD_GRAY = '#F8F8F8'
const INK_GRAY = '#161616'

/** gulungan pita: radial-gradient(circle, #f4f2ec 0 18%, #3a2c22 19% 70%, #2a1e16 71%) + roda repeating-conic 30° */
function reel(ctx: Ctx, x: number, y: number) {
  const cx = x + 48
  const cy = y + 48
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, 48, 0, Math.PI * 2)
  ctx.clip()
  const R = 48 * Math.SQRT2
  ctx.fillStyle = radial(ctx, cx, cy, R, [[0, '#f4f2ec'], [0.18, '#f4f2ec'], [0.19, '#3a2c22'], [0.7, '#3a2c22'], [0.71, '#2a1e16'], [1, '#2a1e16']])
  ctx.fillRect(x, y, 96, 96)
  ctx.restore()
  // roda: 12 juring bergantian, mulai dari atas searah jarum jam
  disc(ctx, cx - 15, cy - 15, 30, INK)
  ctx.fillStyle = '#f4f2ec'
  for (let i = 0; i < 12; i += 2) {
    const a0 = -Math.PI / 2 + (i * Math.PI) / 6
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, 15, a0, a0 + Math.PI / 6)
    ctx.closePath()
    ctx.fill()
  }
}

export const kasetDemo = kalcer({
  id: 'kalcer-kaset-demo',
  name: 'kaset demo',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: BG },
  placeholder: '#cfcfcf',
  // kotak FOTO di desain: grayscale(1) (+ contrast 1.05 di sampul kiri) → foto hitam putih
  filter: 'mono',
  fonts: ['Anton', 'Space Mono:400,700', 'Permanent Marker'],
  fields: ['nama', 'catatan', 'tanggal'],
  slots: [
    { x: 134, y: 114, w: 492, h: 520 },
    { x: 194, y: 864, w: 240, h: 222 },
  ],
  draw: {
    under(ctx, { texts }) {
      const nama = texts.nama?.trim() ?? ''
      const year = yearOf(texts.tanggal)

      // tempat kaset bening
      dropShadow(ctx, 90, 70, 900, 700, 0, 20, 40, 'rgba(0,0,0,0.3)', 14)
      box(ctx, 90, 70, 900, 700, 'rgba(255,255,255,0.18)', 14)
      insetRing(ctx, 90, 70, 900, 700, 3, 'rgba(255,255,255,0.45)', 14)

      // sampul (j-card): muka (hitam putih), punggung, lipatan daftar lagu
      box(ctx, 112, 92, 536, 656, CARD_GRAY)
      if (nama) text(ctx, nama, 134, 672, { family: MARKER, size: 44, color: INK_GRAY, maxWidth: 370 })
      text(ctx, year ? `DEMO '${year.slice(2)}` : 'DEMO', 626, 684, { family: ANTON, size: 28, color: INK_GRAY, align: 'right' })

      box(ctx, 648, 92, 62, 656, CARD)
      dashedV(ctx, 648, 92, 656, 2, 'rgba(0,0,0,0.3)', [6, 4])
      rotated(ctx, 680, 420, 90, () => {
        text(ctx, [nama, 'demo'].filter(Boolean).join(' · '), 680, 402, { family: MARKER, size: 24, color: INK, align: 'center', maxWidth: 620 })
      })

      box(ctx, 710, 92, 258, 656, CARD)
      dashedV(ctx, 710, 92, 656, 2, 'rgba(0,0,0,0.3)', [6, 4])
      text(ctx, 'SISI A', 730, 114, { family: MONO, size: 12, weight: 700, color: INK })
      songTitles(texts.catatan, 5).forEach((s, i) => {
        text(ctx, `${i + 1}. ${s}`, 730, 135 + i * 33.5, { family: MARKER, size: 22, color: INK, maxWidth: 220 })
      })
      text(ctx, ['direkam di kamar', year].filter(Boolean).join(' · '), 730, 710, { family: MONO, size: 11, color: INK, maxWidth: 220 })

      // kaset
      dropShadow(ctx, 150, 820, 780, 470, 0, 20, 40, 'rgba(0,0,0,0.35)', 22)
      box(ctx, 150, 820, 780, 470, linear(ctx, 150, 820, 780, 470, 160, [[0, '#e9e6dd'], [1, '#c9c5ba']]), 22)
      insetShadows(ctx, 150, 820, 780, 470, [{ dx: 0, dy: 2, color: '#ffffff' }], 22)
      box(ctx, 180, 850, 720, 278, CARD, 10)
      insetRing(ctx, 180, 850, 720, 278, 2, 'rgba(0,0,0,0.12)', 10)
      box(ctx, 450, 864, 436, 4, C)
      if (nama) text(ctx, nama, 450, 925.3, { family: MARKER, size: 34, color: INK, maxWidth: 436 })
      text(ctx, 'A · 30 MENIT', 450, 1032.7, { family: MONO, size: 13, color: INK })
      text(ctx, 'C-60', 886, 1032.7, { family: MONO, size: 13, color: INK, align: 'right' })
      box(ctx, 450, 1110, 436, 4, C)

      box(ctx, 280, 1154, 520, 120, INK, 60)
      reel(ctx, 308, 1166)
      box(ctx, 460, 1194, 160, 40, '#3a2c22', 4)
      reel(ctx, 676, 1166)
    },
    over(ctx) {
      photoInset(ctx, 134, 114, 492, 520)
      photoInset(ctx, 194, 864, 240, 222)
    },
  },
})
