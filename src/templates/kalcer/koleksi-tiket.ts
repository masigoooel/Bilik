// Koleksi Tiket — design-reference/kalcer/koleksi-tiket.html (1200x1800, 6 foto)
import { border, box, contentHeight, dropShadow, measure, radial, text } from '../paint'
import { ANTON, MARKER, MONO, TEXTURE, dashedH, join, photoInset, rotated, yearOf } from './helpers'
import { kalcer } from './define'

const BG = '#6B4B2A'
const INK = '#1c1b19'
const CREAM = '#F1E9D2'
const CARD_W = 498
const CARD_H = 391

/** tiket ditempel pin (grid 2 kolom, kolom 80/622, baris 199.6/636.6/1073.6), miring di titik tengah */
const CARDS = [
  { x: 80, y: 199.6, rot: -3, bg: '#F1E9D2', no: '017', pin: 367 },
  { x: 622, y: 199.6, rot: 2, bg: '#DCE8F1', no: '027', pin: 52 },
  { x: 80, y: 636.6, rot: 1.5, bg: '#F1DCE3', no: '037', pin: 180 },
  { x: 622, y: 636.6, rot: -2, bg: '#E3F1DC', no: '047', pin: 154 },
  { x: 80, y: 1073.6, rot: -1.5, bg: '#F1E3C8', no: '057', pin: 417 },
  { x: 622, y: 1073.6, rot: 3, bg: '#E6DCF1', no: '067', pin: 386 },
]

/** pusat slot sesudah tiket diputar (kotak foto 458x270 di card.x+20, card.y+45) */
function slotOf(c: (typeof CARDS)[number]) {
  const a = (c.rot * Math.PI) / 180
  const dy = 45 + 135 - CARD_H / 2
  const cx = c.x + CARD_W / 2 - dy * Math.sin(a)
  const cy = c.y + CARD_H / 2 + dy * Math.cos(a)
  return { x: cx - 229, y: cy - 135, w: 458, h: 270, rotate: c.rot }
}

const inCard = (ctx: CanvasRenderingContext2D, c: (typeof CARDS)[number], draw: () => void) =>
  rotated(ctx, c.x + CARD_W / 2, c.y + CARD_H / 2, c.rot, draw)

export const koleksiTiket = kalcer({
  id: 'kalcer-koleksi-tiket',
  name: 'koleksi tiket',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: BG },
  placeholder: '#d8d0b8',
  fonts: ['Anton', 'Space Mono:400,700', 'Permanent Marker'],
  fields: ['nama', 'tempat', 'tanggal'],
  texture: TEXTURE,
  slots: CARDS.map(slotOf),
  draw: {
    under(ctx, { texts, W, H }) {
      // garis halus: repeating-linear-gradient(0deg, rgba(0,0,0,.05) 0 2px, transparent 2px 6px) dari bawah
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      for (let y = H - 2; y > -6; y -= 6) ctx.fillRect(0, y, W, 2)

      // judul + text-shadow 4px 4px 0
      text(ctx, 'KOLEKSI TIKET', 84, 58, { family: ANTON, size: 84, color: INK })
      text(ctx, 'KOLEKSI TIKET', 80, 54, { family: ANTON, size: 84, color: CREAM })
      // pil "6 GIG · tahun" miring 3°, lebar mengikuti teks, rata kanan di x=1120
      const year = yearOf(texts.tanggal)
      const pill = join(['6 GIG', year])
      const pw = measure(ctx, pill, { family: MONO, size: 16, weight: 700 }) + 28
      rotated(ctx, 1120 - pw / 2, 135.6, 3, () => {
        box(ctx, 1120 - pw, 115.6, pw, 40, CREAM)
        text(ctx, pill, 1120 - pw + 14, 123.6, { family: MONO, size: 16, weight: 700, color: INK })
      })

      const nama = texts.nama?.trim() ?? ''
      const venue = join([texts.tempat, year])
      for (const c of CARDS)
        inCard(ctx, c, () => {
          dropShadow(ctx, c.x, c.y, CARD_W, CARD_H, 0, 6, 12, 'rgba(0,0,0,0.25)')
          box(ctx, c.x, c.y, CARD_W, CARD_H, c.bg, 10)
          const head = { family: MONO, size: 12, weight: 700, color: INK, letterSpacing: 2.4 }
          text(ctx, 'ADMIT ONE', c.x + 20, c.y + 18, head)
          text(ctx, `No. ${c.no}`, c.x + 478, c.y + 18, { ...head, align: 'right' })
          // sobekan + [NAMA GIG] / [VENUE] · tahun + barcode
          dashedH(ctx, c.x + 20, c.y + 325, 458, 3, INK, [6, 3])
          text(ctx, nama, c.x + 20, c.y + 336 + (24 - contentHeight(ctx, ANTON, 24)) / 2, { family: ANTON, size: 24, color: INK, maxWidth: 350 })
          text(ctx, venue, c.x + 20, c.y + 360, { family: MONO, size: 12, color: INK, maxWidth: 350 })
          ctx.fillStyle = INK
          const bx = c.x + 388
          for (let px = 0; px < 90; px += 16) {
            ctx.fillRect(bx + px, c.y + 347, 3, 30)
            ctx.fillRect(bx + px + 5, c.y + 347, 1, 30)
            ctx.fillRect(bx + px + 10, c.y + 347, Math.min(4, 90 - px - 10), 30)
          }
          // pin merah
          const px = c.x + c.pin
          const py = c.y - 10
          dropShadow(ctx, px, py, 26, 26, 0, 3, 4, 'rgba(0,0,0,0.4)', 13)
          box(ctx, px, py, 26, 26, radial(ctx, px + 9.1, py + 7.8, Math.hypot(16.9, 18.2), [[0, '#ffffff'], [0.45, '#D7261E'], [1, '#7a0f0a']]), 13)
        })

      text(ctx, 'nggak ada yang kelewat.', 80, 1676, { family: MARKER, size: 30, color: CREAM })
    },
    over(ctx) {
      for (const c of CARDS)
        inCard(ctx, c, () => {
          photoInset(ctx, c.x + 23, c.y + 48, 452, 264)
          border(ctx, c.x + 20, c.y + 45, 458, 270, 3, INK)
        })
    },
  },
})
