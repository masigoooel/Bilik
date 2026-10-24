// Photo Sticker — design-reference/y2k-aesthetic/photo-sticker.html (600x1800, 4 foto)
import { border, box, dropShadow, ICONS, measure, svg, text, type Ctx } from '../paint'
import { y2k } from './define'
import { detailSheen, photoInset } from './helpers'

const BG = '#FFE1F0'
const PLUM = '#3b2350'

type Card = {
  y: number
  frame: string
  ink: string
  doodle: string
  icon: { d: string; x: number; y: number }
  /** teks stiker; 'tanggal' = diisi tanggal user */
  caption: string | 'tanggal'
}

const CARDS: Card[] = [
  { y: 222, frame: '#FF9ED2', ink: '#FF2E8A', doodle: 'M30 60 C 50 20, 90 20, 80 60 C 70 90, 40 80, 60 50', icon: { d: ICONS.star, x: 466, y: 438 }, caption: '01 ♡' },
  { y: 582, frame: '#9EF0D2', ink: '#12A87A', doodle: 'M40 250 C 80 220, 120 280, 160 240 S 240 260, 260 230', icon: { d: ICONS.heart, x: 86, y: 628 }, caption: 'hari ini' },
  { y: 942, frame: '#C9B2FF', ink: '#7A4DFF', doodle: 'M30 40 L60 70', icon: { d: ICONS.sparkle, x: 96, y: 1148 }, caption: 'tanggal' },
  {
    y: 1302,
    frame: '#FFE48A',
    ink: '#FF8A1F',
    doodle: 'M40 230 C 40 200, 80 200, 80 230 C 80 200, 120 200, 120 230 C 120 260, 80 280, 80 290 C 80 280, 40 260, 40 230 Z',
    icon: { d: ICONS.star, x: 446, y: 1498 },
    caption: 'kita',
  },
]

/** stiker tanggal cukup hari.bulan (desain: 17.10); format lain ditulis apa adanya */
const shortDate = (t: string) => t.match(/^(\d{1,2}[./-]\d{1,2})[./-]\d{2,4}$/)?.[1] ?? t

/** label pil putih bergaris (padding 8px 16px, border 3px) */
function pill(ctx: Ctx, label: string, x: number, align: 'left' | 'right') {
  const w = measure(ctx, label, { family: 'Silkscreen', size: 16 }) + 38
  const px = align === 'left' ? x : x - w
  box(ctx, px, 1718, w, 42, '#ffffff', 20)
  border(ctx, px, 1718, w, 42, 3, PLUM, 20)
  text(ctx, label, px + 19, 1729, { family: 'Silkscreen', size: 16, color: PLUM })
}

export const photoSticker = y2k({
  id: 'y2k-photo-sticker',
  name: 'photo sticker',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#ffffff' },
  placeholder: '#FBF6FF',
  fonts: ['Unbounded:800', 'Caveat:700', 'Silkscreen'],
  fields: ['tanggal'],
  slots: CARDS.map((c) => ({ x: 66, y: c.y + 16, w: 468, h: 300, radius: 12 })),
  draw: {
    under(ctx, { W, H }) {
      // papan catur 30px (repeating-conic-gradient 60px)
      ctx.fillStyle = BG
      for (let y = 0; y < H; y += 30) for (let x = 0; x < W; x += 30) if (((x + y) / 30) % 2 === 1) ctx.fillRect(x, y, 30, 30)
      // lubang tepi kiri-kanan ala lembar stiker (26 titik, space-evenly)
      const gap = (H - 26 * 24) / 27
      ctx.save()
      ctx.globalAlpha = 0.85
      for (let i = 0; i < 26; i++) {
        const cy = gap * (i + 1) + 24 * i + 12
        for (const cx of [0, W]) {
          ctx.beginPath()
          ctx.arc(cx, cy, 12, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff'
          ctx.fill()
        }
      }
      ctx.restore()

      // judul pil "photo sticker"
      dropShadow(ctx, 50, 50, 500, 144, 0, 6, 0, PLUM, 40)
      box(ctx, 50, 50, 500, 144, '#ffffff', 40)
      border(ctx, 50, 50, 500, 144, 4, PLUM, 40)
      text(ctx, 'photo', 84, 61.5, { family: 'Unbounded', size: 54, weight: 800, color: '#FF2E8A' })
      text(ctx, 'sticker', 84, 115.5, { family: 'Unbounded', size: 54, weight: 800, color: '#FF2E8A' })

      for (const c of CARDS) {
        dropShadow(ctx, 50, c.y, 500, 332, 0, 6, 14, 'rgba(59,35,80,0.18)', 22)
        box(ctx, 50, c.y, 500, 332, c.frame, 22)
        border(ctx, 50, c.y, 500, 332, 4, '#ffffff', 22)
      }
    },
    over(ctx, { texts, W, H }) {
      const tanggal = texts.tanggal?.trim() ?? ''
      for (const c of CARDS) {
        photoInset(ctx, 66, c.y + 16, 468, 300, 12)
        // coretan spidol: garis putih tebal di bawah garis warna
        ctx.save()
        ctx.beginPath()
        ctx.rect(66, c.y + 16, 476, 300)
        ctx.clip()
        ctx.translate(66, c.y + 16)
        svg(ctx, c.doodle, 0, 0, 476, 300, 476, 300, { stroke: '#ffffff', lineWidth: 12, lineCap: 'round', lineJoin: 'round' })
        svg(ctx, c.doodle, 0, 0, 476, 300, 476, 300, { stroke: c.ink, lineWidth: 6, lineCap: 'round', lineJoin: 'round' })
        ctx.restore()
        svg(ctx, c.icon.d, c.icon.x, c.icon.y, 44, 44, 24, 24, { fill: c.ink, stroke: '#ffffff', lineWidth: 1.6, lineJoin: 'round' })
        const caption = c.caption === 'tanggal' ? shortDate(tanggal) : c.caption
        if (caption)
          text(ctx, caption, 82, c.y + 258, {
            family: 'Caveat',
            size: 40,
            weight: 700,
            color: c.ink,
            stroke: { color: '#ffffff', width: 6 },
            maxWidth: 440,
          })
      }
      pill(ctx, 'SET 04', 50, 'left')
      if (tanggal) pill(ctx, tanggal, 550, 'right')
      detailSheen(ctx, W, H)
    },
  },
})
