// Polaroid Strip — design-reference/retro-vintage/polaroid-strip.html (600x1800, 3 foto)
import { box, contentHeight, dropShadow, insetShadows, linear, text, textMid } from '../paint'
import { BULAN, insetRing, parseTanggal, rotated, stampTanggal } from './helpers'
import { retro } from './define'

const INK = '#22305C'
/** kartu polaroid 460x514 di x=70, diputar di titik tengahnya */
const CARDS = [
  { y: 52, tilt: -2, caption: '01', tape: false },
  { y: 598, tilt: 1.8, caption: '02', tape: true },
  { y: 1144, tilt: -1.4, caption: '03', tape: false },
]
const inCard = (ctx: CanvasRenderingContext2D, c: (typeof CARDS)[number], draw: () => void) =>
  rotated(ctx, 300, c.y + 257, c.tilt, () => {
    ctx.translate(70, c.y)
    draw()
  })

/** Courier New (cap tanggal kamera) tidak ada di HP: pakai Courier Prime dari Google Fonts */
const STAMP = { family: '"Courier Prime", monospace', size: 22, weight: 700, color: '#FF8A1F', align: 'right' as const }

export const polaroidStrip = retro({
  id: 'retro-polaroid-strip',
  name: 'polaroid strip',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#C9D7F5' },
  placeholder: '#E6E9F0',
  fonts: ['Caveat:600,700', 'IBM Plex Mono:400,600', 'Courier Prime:700'],
  fields: ['tanggal'],
  texture: { opacity: 0.14, blend: 'multiply' },
  // pusat foto setelah rotasi kartu (diukur dari desain)
  slots: [
    { x: 87.1, y: 70, w: 424, h: 424, rotate: -2 },
    { x: 88.8, y: 616, w: 424, h: 424, rotate: 1.8 },
    { x: 87.3, y: 1162, w: 424, h: 424, rotate: -1.4 },
  ],
  draw: {
    under(ctx, { texts }) {
      for (const c of CARDS)
        inCard(ctx, c, () => {
          // box-shadow: 0 1px 1px rgba(0,0,0,0.12), 0 8px 18px rgba(34,48,92,0.22), inset 0 0 0 1px rgba(0,0,0,0.04)
          dropShadow(ctx, 0, 0, 460, 514, 0, 8, 18, 'rgba(34,48,92,0.22)')
          dropShadow(ctx, 0, 0, 460, 514, 0, 1, 1, 'rgba(0,0,0,0.12)')
          box(ctx, 0, 0, 460, 514, linear(ctx, 0, 0, 460, 514, 180, [[0, '#fbfaf6'], [1, '#f1eee6']]))
          insetRing(ctx, 0, 0, 460, 514, 1, 'rgba(0,0,0,0.04)')
          // selotip (di bawah foto, foto menimpa 2px bawahnya)
          if (c.tape) rotated(ctx, 230, 1, -3, () => box(ctx, 160, -18, 140, 38, 'rgba(240,232,200,0.8)'))
          textMid(ctx, c.caption, 230, 442, 72, { family: 'Caveat', size: 34, weight: 700, color: '#1F4FC0', align: 'center' })
        })
      // tanggal: tulisan tangan "17 Oktober" (turunan) + teks user apa adanya
      const raw = texts.tanggal?.trim() ?? ''
      const p = parseTanggal(raw)
      const big = p ? `${p.d} ${BULAN[p.m - 1]}` : raw
      text(ctx, big, 300, 1684, { family: 'Caveat', size: 44, weight: 700, color: INK, align: 'center', maxWidth: 520 })
      if (p) text(ctx, raw, 300, 1738, { family: 'IBM Plex Mono', size: 16, color: INK, align: 'center', letterSpacing: 4, maxWidth: 520 })
    },
    over(ctx, { texts }) {
      // box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15), inset 0 4px 10px rgba(0,0,0,0.2) di kotak foto
      for (const c of CARDS)
        inCard(ctx, c, () => {
          insetShadows(ctx, 18, 18, 424, 424, [{ dx: 0, dy: 4, blur: 10, color: 'rgba(0,0,0,0.2)' }])
          insetRing(ctx, 18, 18, 424, 424, 1, 'rgba(0,0,0,0.15)')
        })
      // cap tanggal oranye di pojok kanan bawah foto (hanya kalau tanggal terbaca)
      const p = parseTanggal(texts.tanggal)
      if (!p) return
      const s = stampTanggal(p)
      for (const c of CARDS)
        inCard(ctx, c, () => {
          text(ctx, s, 428, 432 - contentHeight(ctx, STAMP.family, STAMP.size, STAMP.weight), STAMP)
        })
    },
  },
})
