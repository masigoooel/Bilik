// Jendela Gotik — design-reference/dark-grunge/jendela-gotik.html (600x1800 strip, 3 foto)
import { border, box, rrPath, setShadow, type Ctx } from '../paint'
import { dark } from './define'
import { FONTS, FRAKTUR, SPECIAL, TEXTURE, parseTanggal, roman, slotInset, txt, vignette } from './helpers'

const BG = '#15121F'
const GOLD = '#C9A24A'
/** sisi atas tiap jendela (kotak 500x360, border 4px, padding 26px) */
const WINDOWS = [142, 576, 1010]
const WIN_H = 360
const ARCH: [number, number, number, number] = [250, 250, 12, 12]
const GLASS = ['#5a1a2a', '#2a1a4a', '#1a3a2a', '#4a2a10']

/** "ANNO MMXXVI · 17.X" dari teks tanggal user; tidak terbaca → teks user (kapital) */
function anno(tanggal: string | undefined) {
  const t = tanggal?.trim() ?? ''
  const p = parseTanggal(t)
  if (!p) return t.toUpperCase()
  return `ANNO ${roman(p.y)} · ${p.d}.${roman(p.m)}`
}

/** kaca patri: repeating-conic-gradient(at 50% 45%) + kisi hitam 46px, dipotong bentuk lengkung */
function stainedGlass(ctx: Ctx, y0: number) {
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, 50, y0, 500, WIN_H, ARCH)
  ctx.clip()
  // area posisi latar = padding box (54, y0+4, 492x352)
  const g = ctx.createConicGradient(-Math.PI / 2, 300, y0 + 4 + (WIN_H - 8) * 0.45)
  for (let k = 0; k * 22 < 360; k++) {
    const c = GLASS[k % 4]
    g.addColorStop((k * 22) / 360, c)
    g.addColorStop(Math.min(1, ((k + 1) * 22) / 360), c)
  }
  ctx.fillStyle = g
  ctx.fillRect(50, y0, 500, WIN_H)
  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  for (let x = 54; x < 550; x += 46) ctx.fillRect(x, y0, 2, WIN_H)
  for (let y = y0 + 4; y < y0 + WIN_H; y += 46) ctx.fillRect(50, y, 500, 2)
  ctx.restore()
  border(ctx, 50, y0, 500, WIN_H, 4, GOLD, ARCH)
}

/** lilin: api (border-radius 50% / 60% 60% 40% 40%, glow 10px) + badan */
function candle(ctx: Ctx, y: number) {
  ctx.save()
  setShadow(ctx, 0, 0, 10, '#ff9a3c')
  ctx.beginPath()
  ctx.ellipse(300, y + 9.6, 5, 9.6, 0, Math.PI, Math.PI * 2)
  ctx.ellipse(300, y + 9.6, 5, 6.4, 0, 0, Math.PI)
  ctx.fillStyle = '#ffd27a'
  ctx.fill()
  ctx.restore()
  box(ctx, 292, y + 16, 16, 22, '#e8e2cf')
}

const SLOTS = WINDOWS.map((y) => ({ x: 80, y: y + 30, w: 440, h: 300, radius: [236, 236, 4, 4] as [number, number, number, number] }))

export const jendelaGotik = dark({
  id: 'dark-jendela-gotik',
  name: 'jendela gotik',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#1a1826',
  // kotak foto desain: filter grayscale(0.5) → preset hitam putih tanpa kontras tambahan
  filter: 'mono',
  fonts: FONTS,
  fields: ['tanggal'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      // kisi emas tipis: garis 2px tiap 40px (vertikal dari kiri, horizontal dari bawah)
      ctx.fillStyle = 'rgba(201,162,74,0.08)'
      for (let x = 0; x < 600; x += 40) ctx.fillRect(x, 0, 2, 1800)
      for (let y = 1798; y > -2; y -= 40) ctx.fillRect(0, y, 600, 2)

      txt(ctx, 'Kapel', 300, 49, { family: FRAKTUR, size: 68, color: GOLD, align: 'center' })
      for (const y of WINDOWS) stainedGlass(ctx, y)
      for (const y of WINDOWS.slice(0, -1)) candle(ctx, y + 382)
      txt(ctx, anno(texts.tanggal), 300, 1744, { family: SPECIAL, size: 16, ls: 4, color: GOLD, align: 'center', maxWidth: 500 })
    },
    over(ctx) {
      for (const s of SLOTS) slotInset(ctx, s)
      // rangka jendela (opacity 0.6) di atas foto
      ctx.fillStyle = 'rgba(201,162,74,0.6)'
      for (const y of WINDOWS) {
        ctx.fillRect(298, y + 4, 4, WIN_H - 8)
        ctx.fillRect(66, y + 204, 468, 4)
      }
    },
    top(ctx, { W, H }) {
      vignette(ctx, W, H)
    },
  },
})
