// Kartu Tarot — design-reference/dark-grunge/kartu-tarot.html (1080x1350, 1 foto)
import { border, box, ICONS, radial, svg, type Ctx } from '../paint'
import { dark } from './define'
import { CINZEL, FONTS, SPECIAL, TEXTURE, disc, join, parseTanggal, roman, slotInset, txt, vignette } from './helpers'

const GOLD = '#C9A24A'
const BG = '#0F0D1F'
/** ranting hias (svg 220x140) */
const VINE = 'M10 130 C 20 60, 60 40, 110 60 C 150 76, 170 50, 200 20 M60 48 C 50 30, 56 14, 72 10 M110 60 C 112 40, 128 32, 144 40 M160 56 C 150 76, 158 92, 176 94'

/** "17.X.MMXXVI" dari teks tanggal user; tidak terbaca → teks user (kapital) */
function romanDate(tanggal: string | undefined) {
  const t = tanggal?.trim() ?? ''
  const p = parseTanggal(t)
  return p ? `${p.d}.${roman(p.m)}.${roman(p.y)}` : t.toUpperCase()
}

function vine(ctx: Ctx, x: number, mirror: boolean) {
  ctx.save()
  ctx.translate(x + (mirror ? 220 : 0), 134)
  if (mirror) ctx.scale(-1, 1)
  svg(ctx, VINE, 0, 0, 220, 140, 220, 140, { stroke: GOLD, lineWidth: 3, lineCap: 'round' })
  disc(ctx, 195, 15, 10, GOLD)
  disc(ctx, 68, 6, 8, GOLD)
  ctx.restore()
}

const SLOT = { x: 160, y: 217, w: 760, h: 700, radius: [366, 366, 4, 4] as [number, number, number, number] }

export const kartuTarot = dark({
  id: 'dark-kartu-tarot',
  name: 'kartu tarot',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#0B0A10' },
  placeholder: '#1a1826',
  // kotak foto desain: filter grayscale(0.6) → preset hitam putih tanpa kontras tambahan
  filter: 'mono',
  fonts: FONTS,
  // nama di bawah kartu, tanggal romawi, catatan = arti kartu
  fields: ['nama', 'tanggal', 'catatan'],
  texture: TEXTURE,
  slots: [SLOT],
  draw: {
    under(ctx, { texts }) {
      // kartu: radial-gradient(circle at 50% 30%, #1E1A3A, bg 70%) di padding box 952x1222
      const cx = 540
      const cy = 64 + 1222 * 0.3
      const r = Math.hypot(476, 1222 - (cy - 64))
      box(ctx, 60, 60, 960, 1230, radial(ctx, cx, cy, r, [[0, '#1E1A3A'], [0.7, BG], [1, BG]]))
      border(ctx, 60, 60, 960, 1230, 4, GOLD)
      // outline 2px, offset 8px
      border(ctx, 50, 50, 980, 1250, 2, GOLD)

      // siku di keempat sudut + titik
      ctx.fillStyle = GOLD
      for (const [x, y, sx, sy] of [
        [82, 82, 0, 0],
        [924, 82, 1, 0],
        [82, 1194, 0, 1],
        [924, 1194, 1, 1],
      ]) {
        ctx.fillRect(x, sy ? y + 70 : y, 74, 4)
        ctx.fillRect(sx ? x + 70 : x, y, 4, 74)
      }
      for (const [x, y] of [
        [94, 94],
        [972, 94],
        [94, 1242],
        [972, 1242],
      ])
        disc(ctx, x, y, 14, GOLD)

      for (const [x, y, s] of [
        [194, 184, 24],
        [974, 214, 18],
        [214, 1184, 20],
        [964, 1164, 26],
      ])
        svg(ctx, ICONS.star, x, y, s, s, 24, 24, { fill: GOLD })
      vine(ctx, 104, false)
      vine(ctx, 744, true)

      txt(ctx, 'XVII', 540, 124, { family: CINZEL, size: 40, weight: 700, ls: 8, color: GOLD, align: 'center' })
      border(ctx, 143, 200, 794, 734, 3, GOLD, [380, 380, 14, 14])
      box(ctx, 480, 956, 120, 3, GOLD)

      txt(ctx, texts.nama?.trim() ?? '', 540, 972, { family: CINZEL, size: 52, weight: 700, color: GOLD, align: 'center', maxWidth: 800 })
      const sub = join(['THE STAR', romanDate(texts.tanggal)])
      txt(ctx, sub, 540, 1055, { family: SPECIAL, size: 18, ls: 4.5, color: GOLD, align: 'center', maxWidth: 800 })
      const arti = texts.catatan?.trim()
      if (arti) txt(ctx, `arti kartu: ${arti}`, 540, 1095, { family: SPECIAL, size: 15, faux: true, color: '#a88a4a', align: 'center', maxWidth: 780 })
    },
    over(ctx) {
      slotInset(ctx, SLOT)
      // bulan sabit menimpa angka & lengkung bingkai
      disc(ctx, 506, 156, 68, GOLD)
      disc(ctx, 524, 148, 68, BG)
    },
    top(ctx, { W, H }) {
      vignette(ctx, W, H)
    },
  },
})
