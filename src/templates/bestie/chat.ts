// Chat — design-reference/bestie-couple/chat.html (600x1800, 3 foto)
import { box, measure, text } from '../paint'
import { bestie } from './define'
import { FONTS, INK, MONO, slotInsets } from './helpers'

const BG = '#E5DDD3'
const SENT = '#CDEBC4'
/** gelembung chat: masuk (kiri, sudut kiri bawah lancip) & keluar (kanan, sudut kanan bawah lancip) */
const BUBBLES = [
  { x: 36, y: 195, fill: '#ffffff', r: [28, 28, 28, 6] as [number, number, number, number], time: '16:20', tx: 36, align: 'left' as const },
  { x: 124, y: 656, fill: SENT, r: [28, 28, 6, 28] as [number, number, number, number], time: '16:21 · dibaca', tx: 564, align: 'right' as const },
  { x: 36, y: 1117, fill: '#ffffff', r: [28, 28, 28, 6] as [number, number, number, number], time: '16:24', tx: 36, align: 'left' as const },
]
const SLOTS = BUBBLES.map((b) => ({ x: b.x + 12, y: b.y + 12, w: 416, h: 380, radius: 18 }))

export const chat = bestie({
  id: 'bestie-chat',
  name: 'chat',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#ECEAF0',
  fonts: FONTS,
  fields: ['nama', 'tanggal'],
  texture: { opacity: 0.09, blend: 'multiply' },
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W }) {
      // kepala chat: avatar + nama + online
      box(ctx, 0, 0, W, 96, '#ffffff')
      box(ctx, 0, 95, W, 1, '#d6d3cc')
      box(ctx, 36, 22.5, 50, 50, '#DCD8CF', 25)
      text(ctx, texts.nama?.trim() || 'kita', 104, 20.5, { family: MONO, size: 22, weight: 700, color: INK, maxWidth: 460 })
      text(ctx, 'online', 104, 53.5, { family: MONO, size: 14, color: INK })

      // pil tanggal (lebar mengikuti teks, padding 6px 16px)
      const tanggal = texts.tanggal?.trim() ?? ''
      if (tanggal) {
        const o = { family: MONO, size: 14, color: INK }
        const w = Math.min(528, measure(ctx, tanggal, o) + 32)
        box(ctx, 300 - w / 2, 132, w, 33, 'rgba(255,255,255,0.7)', 12)
        text(ctx, tanggal, 300, 138, { ...o, align: 'center', maxWidth: 496 })
      }

      for (const b of BUBBLES) {
        box(ctx, b.x, b.y, 440, 404, b.fill, b.r)
        text(ctx, b.time, b.tx, b.y + 410, { family: MONO, size: 14, color: INK, align: b.align })
      }

      // sedang mengetik...
      box(ctx, 36, 1585, 110, 54, '#ffffff', [28, 28, 28, 6])
      for (const x of [65, 85, 105]) box(ctx, x, 1606, 12, 12, '#9a968e', 6)

      // kolom ketik pesan + tombol kirim
      box(ctx, 20, 1680, 560, 76, '#ffffff', 38)
      text(ctx, 'ketik pesan...', 44, 1705, { family: MONO, size: 18, color: '#8a867e' })
      box(ctx, 514, 1690, 56, 56, SENT, 28)
      text(ctx, '➤', 542, 1700, { family: MONO, size: 24, color: INK, align: 'center' })
    },
    over(ctx) {
      slotInsets(ctx, SLOTS)
    },
  },
})
