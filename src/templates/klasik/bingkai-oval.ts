// Bingkai Oval — design-reference/klasik-minimalis/bingkai-oval.html (1080x1350, 1 foto)
import { linear, radial, setShadow, svg, text, type Ctx } from '../paint'
import { FONTS, GREY, INK, MONO, SERIF, TEXTURE_09, ellipsePath, ellipseRing, photoInset, roman, yearOf } from './helpers'
import { klasik } from './define'

const BG = '#E9E5DD'
// bingkai kayu (border-radius 50%), mat putih, lubang foto
const FRAME = { x: 150, y: 90, w: 780, h: 980 }
const MAT = { x: 190, y: 130, w: 700, h: 900 }
const SLOT = { x: 202, y: 142, w: 676, h: 876 }

function frame(ctx: Ctx) {
  const { x, y, w, h } = FRAME
  // 0 24px 40px rgba(0,0,0,0.3): bentuk digeser jauh ke luar kanvas, hanya bayangannya yang jatuh di tempat
  ctx.save()
  const off = 20000
  setShadow(ctx, off, 24, 40, 'rgba(0,0,0,0.3)')
  ellipsePath(ctx, x - off, y, w, h)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.restore()

  ctx.save()
  ellipsePath(ctx, x, y, w, h)
  ctx.clip()
  ctx.fillStyle = linear(ctx, x, y, w, h, 180, [
    [0, '#8a5a32'],
    [1, '#5a3518'],
  ])
  ctx.fillRect(x, y, w, h)
  // repeating-linear-gradient(92deg, ... 9px 10px gelap, 22px 23px terang), periode 23px dari awal garis gradien
  const a = (92 * Math.PI) / 180
  const L = Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a))
  ctx.translate(x + w / 2, y + h / 2)
  ctx.rotate(a - Math.PI / 2)
  for (let u = -L / 2; u < L / 2; u += 23) {
    ctx.fillStyle = 'rgba(0,0,0,0.10)'
    ctx.fillRect(u + 9, -h, 1, 2 * h)
    ctx.fillStyle = 'rgba(255,230,190,0.07)'
    ctx.fillRect(u + 22, -h, 1, 2 * h)
  }
  ctx.restore()
  // inset 0 0 0 6px rgba(0,0,0,0.25) di atas inset 0 0 0 18px rgba(255,220,170,0.12)
  ellipseRing(ctx, x, y, w, h, 18, 'rgba(255,220,170,0.12)')
  ellipseRing(ctx, x, y, w, h, 6, 'rgba(0,0,0,0.25)')

  // mat: linear-gradient(135deg, #fff, #e5e1d8) + inset 2px 2px 0 putih, inset -2px -2px 0 gelap
  const m = MAT
  ctx.save()
  ellipsePath(ctx, m.x, m.y, m.w, m.h)
  ctx.clip()
  ctx.fillStyle = linear(ctx, m.x, m.y, m.w, m.h, 135, [
    [0, '#ffffff'],
    [1, '#e5e1d8'],
  ])
  ctx.fillRect(m.x, m.y, m.w, m.h)
  for (const [d, c] of [
    [-2, 'rgba(0,0,0,0.12)'],
    [2, 'rgba(255,255,255,0.9)'],
  ] as const) {
    ctx.beginPath()
    ctx.ellipse(m.x + m.w / 2, m.y + m.h / 2, m.w / 2, m.h / 2, 0, 0, Math.PI * 2)
    ctx.ellipse(m.x + m.w / 2 + d, m.y + m.h / 2 + d, m.w / 2, m.h / 2, 0, 0, Math.PI * 2)
    ctx.fillStyle = c
    ctx.fill('evenodd')
  }
  ctx.restore()
}

/** paku manik emas di sepanjang bingkai (64 buah), di atas mat */
function beads(ctx: Ctx) {
  for (let i = 0; i < 64; i++) {
    const t = (i * 2 * Math.PI) / 64
    const bx = FRAME.x + Math.round(390 + 352 * Math.cos(t))
    const by = FRAME.y + Math.round(490 + 452 * Math.sin(t))
    // radial-gradient(circle at 35% 30%, #fff4c0, #b8903a 70%), farthest-corner
    ctx.beginPath()
    ctx.arc(bx + 6, by + 6, 6, 0, Math.PI * 2)
    ctx.fillStyle = radial(ctx, bx + 4.2, by + 3.6, Math.hypot(7.8, 8.4), [
      [0, '#fff4c0'],
      [0.7, '#b8903a'],
    ])
    ctx.fill()
  }
}

export const bingkaiOval = klasik({
  id: 'klasik-bingkai-oval',
  name: 'bingkai oval',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  placeholder: '#E4E2DD',
  fonts: FONTS,
  fields: ['nama', 'tanggal'],
  texture: TEXTURE_09,
  // lubang foto oval: slot kotak, sudut di luar oval ditimpa ulang di draw.over
  slots: [SLOT],
  draw: {
    under(ctx, { texts }) {
      frame(ctx)
      text(ctx, texts.nama?.trim() ?? '', 540, 1110, { family: SERIF, size: 48, italic: true, color: INK, align: 'center', maxWidth: 900 })
      // tahun dalam angka Romawi (MMXXVI di desain)
      const year = yearOf(texts.tanggal)
      if (year) text(ctx, roman(Number(year)), 540, 1177, { family: MONO, size: 15, color: GREY, letterSpacing: 4.5, align: 'center' })
      // gantungan: paku bulat + tali
      ctx.beginPath()
      ctx.arc(540, 34, 14, 0, Math.PI * 2)
      ctx.fillStyle = radial(ctx, 526 + 9.8, 20 + 8.4, Math.hypot(18.2, 19.6), [
        [0, '#e9e4d8'],
        [1, '#6a6a6a'],
      ])
      ctx.fill()
      svg(ctx, 'M10 78 L160 4 L310 78', 380, 34, 320, 80, 320, 80, { stroke: '#8a8a8a', lineWidth: 2 })
    },
    over(ctx) {
      // bayangan inset kotak FOTO, terpotong oval (overflow hidden)
      ctx.save()
      ellipsePath(ctx, SLOT.x, SLOT.y, SLOT.w, SLOT.h)
      ctx.clip()
      photoInset(ctx, SLOT, 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.16)')
      ctx.restore()
      // sudut slot di luar oval: gambar ulang latar + bingkai di sana
      ctx.save()
      ctx.beginPath()
      ctx.rect(SLOT.x, SLOT.y, SLOT.w, SLOT.h)
      ctx.ellipse(SLOT.x + SLOT.w / 2, SLOT.y + SLOT.h / 2, SLOT.w / 2, SLOT.h / 2, 0, 0, Math.PI * 2)
      ctx.clip('evenodd')
      ctx.fillStyle = BG
      ctx.fillRect(SLOT.x, SLOT.y, SLOT.w, SLOT.h)
      frame(ctx)
      ctx.restore()
      beads(ctx)
    },
  },
})
