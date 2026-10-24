// Paket Stiker — design-reference/meme-lucu/paket-stiker.html (1200x1800, 6 foto)
import { box, dropShadow, measure, rrPath, text } from '../paint'
import { ANTON, MONO, photoInset, rotated } from './helpers'
import { meme } from './define'

const INK = '#111111'
const ACCENT = '#18A05A'

/** stiker 475x378 (padding 14, radius 40) di grid 2 kolom (jarak 40/50), tiap stiker diputar */
const STICKERS = [
  { word: 'oke.', rot: -3 },
  { word: 'hah?', rot: 2 },
  { word: 'gas.', rot: 1.5 },
  { word: 'nggak.', rot: -2 },
  { word: 'bentar.', rot: -1.5 },
  { word: 'sip.', rot: 3 },
].map((s, i) => ({ ...s, x: 100 + (i % 2) * 525, y: 220 + Math.floor(i / 2) * 418 }))
const SW = 475
const SH = 378

export const paketStiker = meme({
  id: 'meme-paket-stiker',
  name: 'paket stiker',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#F2F0EA' },
  placeholder: '#E8E6E0',
  fonts: ['Anton', 'Space Mono:400,700'],
  fields: ['nama'],
  slots: STICKERS.map((s) => ({ x: s.x + 14, y: s.y + 14, w: 447, h: 350, radius: 28, rotate: s.rot })),
  draw: {
    under(ctx, { texts, W, H }) {
      // repeating-conic-gradient(rgba(0,0,0,0.04) 0 25%, transparent 0 50%) / 40px: kotak 20px kanan-atas & kiri-bawah
      ctx.fillStyle = 'rgba(0,0,0,0.04)'
      for (let y = 0; y < H; y += 40)
        for (let x = 0; x < W; x += 40) {
          ctx.fillRect(x + 20, y, 20, 20)
          ctx.fillRect(x, y + 20, 20, 20)
        }

      // kepala: kartu putih radius 24, bayangan 0 4px 12px
      dropShadow(ctx, 80, 70, 1040, 110, 0, 4, 12, 'rgba(0,0,0,0.08)', 24)
      box(ctx, 80, 70, 1040, 110, '#ffffff', 24)
      box(ctx, 106, 90, 70, 70, ACCENT, 18)
      const pill = { family: MONO, size: 18, weight: 700 }
      const pw = measure(ctx, 'tambah', pill) + 44
      box(ctx, 1094 - pw, 102, pw, 46, ACCENT, 22)
      text(ctx, 'tambah', 1094 - pw + 22, 112, { ...pill, color: '#ffffff' })
      // paket stiker [NAMA] → nama
      const nama = texts.nama?.trim() || 'kita'
      text(ctx, `paket stiker ${nama}`, 194, 93.5, { family: MONO, size: 28, weight: 700, color: INK, maxWidth: 1094 - pw - 30 - 194 })
      text(ctx, '6 stiker · buat grup chat', 194, 134.5, { family: MONO, size: 15, color: '#666666' })

      // stiker: box-shadow 0 0 0 2px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.12)
      for (const s of STICKERS) {
        rotated(ctx, s.x + SW / 2, s.y + SH / 2, s.rot, () => {
          dropShadow(ctx, s.x, s.y, SW, SH, 0, 8, 16, 'rgba(0,0,0,0.12)', 40)
          ctx.beginPath()
          rrPath(ctx, s.x - 2, s.y - 2, SW + 4, SH + 4, 42)
          rrPath(ctx, s.x, s.y, SW, SH, 40)
          ctx.fillStyle = 'rgba(0,0,0,0.08)'
          ctx.fill('evenodd')
          box(ctx, s.x, s.y, SW, SH, '#ffffff', 40)
        })
      }
    },
    over(ctx) {
      for (const s of STICKERS) {
        rotated(ctx, s.x + SW / 2, s.y + SH / 2, s.rot, () => {
          photoInset(ctx, s.x + 14, s.y + 14, 447, 350, 28)
          // kata stiker: Anton 72px putih, text-shadow 8 arah 4px #111 (bottom 20px, line-height 1)
          const o = { family: ANTON, size: 72, align: 'center' as const }
          const cx = s.x + SW / 2
          const y = s.y + SH - 20 - 72 - 18
          for (const [dx, dy] of [[4, 4], [-4, 4], [4, -4], [-4, -4], [0, 4], [4, 0], [-4, 0], [0, -4]]) text(ctx, s.word, cx + dx, y + dy, { ...o, color: INK })
          text(ctx, s.word, cx, y, { ...o, color: '#ffffff' })
        })
      }
    },
  },
})
