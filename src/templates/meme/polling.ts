// Polling — design-reference/meme-lucu/polling.html (1080x1350, 2 foto)
import { box, measure, rrPath, text, type Ctx } from '../paint'
import { ANTON, MONO, TEXTURE, photoInset } from './helpers'
import { meme } from './define'

const INK = '#111111'
const MUTED = '#666666'
const ACCENT = '#18A05A'
const OUTFIT = 'Outfit'

/** dua pilihan (sc-for di desain): kartu foto 455x560 radius 18, bilah persen 52px di bawahnya */
const OPTIONS = [
  { x: 70, label: 'A', pct: '73%', fillW: 332.1, fill: ACCENT, ink: '#ffffff', ring: { w: 4, color: ACCENT } },
  { x: 555, label: 'B', pct: '27%', fillW: 122.8, fill: '#d9d6cf', ink: INK, ring: { w: 1, color: '#d9d6cf' } },
]
const CARD_Y = 211
const CARD_W = 455
const CARD_H = 560

/** box-shadow 0 0 0 Npx: cincin di luar kotak radius r */
function spreadRing(ctx: Ctx, x: number, y: number, w: number, h: number, r: number, s: number, color: string) {
  ctx.beginPath()
  rrPath(ctx, x - s, y - s, w + 2 * s, h + 2 * s, r + s)
  rrPath(ctx, x, y, w, h, r)
  ctx.fillStyle = color
  ctx.fill('evenodd')
}

export const polling = meme({
  id: 'meme-polling',
  name: 'polling',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#E8E6E0',
  // Outfit dimuat 500/700/800: teks 400 di desain tampil memakai face 500
  fonts: ['Anton', 'Space Mono:400,700', 'Outfit:500,700,800'],
  fields: ['nama', 'tanggal'],
  texture: TEXTURE,
  slots: OPTIONS.map((o) => ({ x: o.x, y: CARD_Y, w: CARD_W, h: CARD_H, radius: 18 })),
  draw: {
    under(ctx, { texts }) {
      // [NAMA GENG] → nama
      const geng = texts.nama?.trim()
      text(ctx, geng ? `POLLING GRUP · ${geng}` : 'POLLING GRUP', 70, 80, { family: MONO, size: 14, color: MUTED, maxWidth: 940 })
      text(ctx, 'foto mana yang dipakai?', 70, 90, { family: ANTON, size: 72, color: INK })

      for (const o of OPTIONS) {
        spreadRing(ctx, o.x, CARD_Y, CARD_W, CARD_H, 18, o.ring.w, o.ring.color)
        // bilah persen: overflow hidden radius 14
        ctx.save()
        ctx.beginPath()
        rrPath(ctx, o.x, 783, CARD_W, 52, 14)
        ctx.clip()
        box(ctx, o.x, 783, CARD_W, 52, '#f1efe9')
        box(ctx, o.x, 783, o.fillW, 52, o.fill)
        ctx.restore()
        const t = { family: OUTFIT, size: 20, weight: 800, color: o.ink }
        text(ctx, o.label, o.x + 16, 796.5, t)
        text(ctx, o.pct, o.x + CARD_W - 16, 796.5, { ...t, align: 'right' })
      }

      // pemilih: 5 avatar 40x40 (border 3px putih, radius 17) bertumpuk -10px
      ;['#c96a8a', '#6a8ac9', '#8ac96a', '#c9a86a', '#a86ac9'].forEach((c, i) => {
        const x = 80 + i * 30
        box(ctx, x, 1180, 40, 40, '#ffffff', 17)
        box(ctx, x + 3, 1183, 34, 34, c, 14)
      })
      text(ctx, '+3 lainnya memilih A', 252, 1190, { family: OUTFIT, size: 16, weight: 500, color: MUTED })
      text(ctx, '✓ kamu memilih A', 1000, 1190.5, { family: OUTFIT, size: 16, weight: 700, color: ACCENT, align: 'right' })

      const foot = { family: MONO, size: 14, color: MUTED }
      text(ctx, '11 suara · polling ditutup', 70, 1249, foot)
      text(ctx, texts.tanggal?.trim() ?? '', 1010, 1249, { ...foot, align: 'right', maxWidth: 600 })
    },
    over(ctx) {
      for (const o of OPTIONS) {
        ctx.save()
        ctx.beginPath()
        rrPath(ctx, o.x, CARD_Y, CARD_W, CARD_H, 18)
        ctx.clip()
        photoInset(ctx, o.x, CARD_Y, CARD_W, CARD_H)
        ctx.restore()
      }
      // lencana pemenang di pojok kanan atas kartu A
      const b = { family: OUTFIT, size: 16, weight: 800 }
      const bw = measure(ctx, 'pemenang', b) + 24
      const bx = 70 + CARD_W - 12 - bw
      box(ctx, bx, 223, bw, 28, ACCENT, 14)
      text(ctx, 'pemenang', bx + 12, 227, { ...b, color: '#ffffff' })
    },
  },
})
