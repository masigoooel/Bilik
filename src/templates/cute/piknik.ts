// Piknik — design-reference/cute-kawaii/piknik.html (1200x1800, 4 foto)
import { border, box, dropShadow, measure, radial, rrPath, text, type Ctx } from '../paint'
import { cute } from './define'
import { detailOverlay, photoInset } from './helpers'

const INK = '#3B1F4A'
const RED = '#E85555'
/** kartu foto 490x486 (border 4, padding 14 14 44), pusat + kemiringan + label */
const CARDS = [
  { cx: 335, cy: 517, deg: -3, label: 'roti' },
  { cx: 865, cy: 517, deg: 2, label: 'buah' },
  { cx: 335, cy: 1053, deg: 2, label: 'teh' },
  { cx: 865, cy: 1053, deg: -2, label: 'kita' },
]
const SLOTS = [
  { x: 107.2, y: 292 },
  { x: 638.5, y: 292 },
  { x: 108.5, y: 828 },
  { x: 637.5, y: 828 },
].map((p, i) => ({ ...p, w: 454, h: 420, radius: 8, rotate: CARDS[i].deg }))

/** taplak kotak-kotak: dua repeating-linear-gradient rgba(232,85,85,0.45) 40px/80px di atas putih */
function gingham(ctx: Ctx, W: number, H: number) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = 'rgba(232,85,85,0.45)'
  for (let x = 0; x < W; x += 80) ctx.fillRect(x, 0, 40, H)
  // 0deg: dihitung dari bawah (H habis dibagi 40 → garis mulai dari y kelipatan 80)
  for (let y = H - 40; y > -40; y -= 80) ctx.fillRect(0, y, W, 40)
}

/** repeating-linear-gradient(45deg, rgba(0,0,0,0.025) 0 2px, transparent 2px 6px) */
function weave(ctx: Ctx, W: number, H: number) {
  const a = Math.PI / 4
  const L = W * Math.sin(a) + H * Math.cos(a)
  ctx.save()
  ctx.translate(W / 2, H / 2)
  ctx.rotate(-a)
  ctx.fillStyle = 'rgba(0,0,0,0.025)'
  for (let t = 0; t < L; t += 6) ctx.fillRect(-L / 2 + t, -L, 2, 2 * L)
  ctx.restore()
}

/** bola: radial-gradient(circle at 35% 30%, #fff, warna 45%) + border 4px */
function ball(ctx: Ctx, x: number, y: number, d: number, color: string) {
  const p = d - 8
  const cx = x + 4 + p * 0.35
  const cy = y + 4 + p * 0.3
  const r = Math.hypot(x + 4 + p - cx, y + 4 + p - cy)
  box(ctx, x, y, d, d, radial(ctx, cx, cy, r, [
    [0, '#ffffff'],
    [0.45, color],
  ]), d / 2)
  border(ctx, x, y, d, d, 4, INK, d / 2)
}

function cup(ctx: Ctx, x: number, y: number) {
  box(ctx, x, y, 98, 88, '#ffffff', [0, 0, 30, 30])
  border(ctx, x, y, 98, 88, 4, INK, [0, 0, 30, 30])
  ctx.beginPath()
  ctx.ellipse(x + 8 + 37, y + 8 + 8, 37, 8, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#c98a4a'
  ctx.fill()
  // gagang 26x38, border 4px tanpa sisi kiri
  ctx.beginPath()
  rrPath(ctx, x + 88, y + 18, 26, 38, [0, 14, 14, 0])
  rrPath(ctx, x + 88, y + 22, 22, 30, [0, 10, 10, 0])
  ctx.fillStyle = INK
  ctx.fill('evenodd')
}

function basket(ctx: Ctx) {
  // pegangan: border 12px tanpa sisi bawah, radius 100 100 0 0
  ctx.beginPath()
  rrPath(ctx, 900, 1440, 200, 120, [100, 100, 0, 0])
  rrPath(ctx, 912, 1452, 176, 108, [88, 88, 0, 0])
  ctx.fillStyle = '#a07a48'
  ctx.fill('evenodd')
  // badan: repeating-linear-gradient(0deg, #c9a272 0 10px, #a07a48 10px 12px) dari bawah padding box
  const R: [number, number, number, number] = [10, 10, 40, 40]
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, 860, 1510, 288, 138, R)
  ctx.clip()
  ctx.fillStyle = '#c9a272'
  ctx.fillRect(860, 1510, 288, 138)
  ctx.fillStyle = '#a07a48'
  for (let b = 1644 + 12; b > 1510; b -= 12) ctx.fillRect(860, b - 12, 288, 2)
  ctx.restore()
  border(ctx, 860, 1510, 288, 138, 4, INK, R)
  // pinggiran: repeating-linear-gradient(90deg, merah 0 20px, putih 20px 40px)
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, 850, 1500, 308, 38, 6)
  ctx.clip()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(850, 1500, 308, 38)
  ctx.fillStyle = RED
  for (let x = 854 - 40; x < 1158; x += 40) ctx.fillRect(x, 1500, 20, 38)
  ctx.restore()
  border(ctx, 850, 1500, 308, 38, 4, INK, 6)
}

export const piknik = cute({
  id: 'cute-piknik',
  name: 'piknik',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#ffffff' },
  placeholder: '#F3EEF6',
  fonts: ['Caprasimo', 'Nunito:600,800'],
  fields: ['tempat', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      gingham(ctx, W, H)
      // judul pil
      box(ctx, 428.4, 118, 343.2, 124, INK, 40)
      box(ctx, 428.4, 110, 343.2, 124, '#ffffff', 40)
      border(ctx, 428.4, 110, 343.2, 124, 5, INK, 40)
      text(ctx, 'piknik', 600, 131, { family: 'Caprasimo', size: 72, color: INK, align: 'center' })
      // pil tempat · tanggal (lebar mengikuti teks: padding 22px + border 4px)
      const line = [texts.tempat?.trim(), texts.tanggal?.trim()].filter(Boolean).join(' · ')
      if (line) {
        const o = { family: 'Nunito', size: 22, weight: 800, color: INK }
        const tw = Math.min(measure(ctx, line, o), 900)
        const w = tw + 52
        box(ctx, 600 - w / 2, 1336, w, 54, '#ffffff', 20)
        border(ctx, 600 - w / 2, 1336, w, 54, 4, INK, 20)
        text(ctx, line, 600, 1348, { ...o, align: 'center', maxWidth: 900 })
      }
      for (const c of CARDS) {
        ctx.save()
        ctx.translate(c.cx, c.cy)
        ctx.rotate((c.deg * Math.PI) / 180)
        ctx.translate(-245, -243)
        dropShadow(ctx, 0, 0, 490, 486, 0, 8, 14, 'rgba(59,31,74,0.2)', 16)
        box(ctx, 0, 0, 490, 486, '#ffffff', 16)
        border(ctx, 0, 0, 490, 486, 4, INK, 16)
        text(ctx, c.label, 20, 447, { family: 'Caprasimo', size: 24, color: INK })
        ctx.restore()
      }
    },
    over(ctx, { W, H }) {
      for (const s of SLOTS) photoInset(ctx, s)
      basket(ctx)
      cup(ctx, 60, 1540)
      cup(ctx, 180, 1600)
      weave(ctx, W, H)
      detailOverlay(ctx, W, H)
      // bola z-index 3: di atas semua lapisan
      ball(ctx, 8, 560, 78, RED)
      ball(ctx, 1122, 990, 72, '#FFD84D')
      ball(ctx, 8, 1300, 72, '#9EDB8A')
    },
  },
})
