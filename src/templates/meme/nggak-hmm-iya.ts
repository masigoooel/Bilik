// Nggak Hmm Iya — design-reference/meme-lucu/nggak-hmm-iya.html (600x1800, 3 foto)
import { border, box, measure, text } from '../paint'
import { ANTON, MONO, photoInset } from './helpers'
import { meme } from './define'

const INK = '#111111'

/** baris reaksi (sc-for di desain); [TEKS] tiap baris tidak punya field sendiri: teks tetap pendek */
const ROWS = [
  { word: 'nggak.', color: '#E2483C', note: 'belum siap difoto' },
  { word: 'hmm.', color: '#E8A33C', note: 'boleh deh, sekali' },
  { word: 'iya.', color: '#18A05A', note: 'satu lagi dong' },
]
/** sisi atas bingkai tiap baris: kotak 520x478 border 4px, jarak 24px */
const ROW_Y = ROWS.map((_, i) => 122 + i * 502)

export const nggakHmmIya = meme({
  id: 'meme-nggak-hmm-iya',
  name: 'nggak hmm iya',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#E8E6E0',
  fonts: ['Anton', 'Space Mono:400,700'],
  fields: ['catatan', 'nama', 'tanggal'],
  slots: ROW_Y.map((y) => ({ x: 44, y: y + 4, w: 252, h: 462 })),
  draw: {
    under(ctx, { texts }) {
      // ketika [SITUASI] → catatan
      const situasi = texts.catatan?.trim() || 'diajak foto'
      text(ctx, `ketika ${situasi}`, 40, 38, { family: ANTON, size: 48, color: INK, maxWidth: 520 })

      ROWS.forEach((r, i) => {
        const y = ROW_Y[i]
        border(ctx, 40, y, 520, 478, 4, INK)
        box(ctx, 296, y + 4, 4, 470, INK)
        box(ctx, 300, y + 4, 256, 470, '#ffffff')
        text(ctx, r.word, 320, y + 174.5, { family: ANTON, size: 64, color: r.color, maxWidth: 216 })
        text(ctx, r.note, 320, y + 266.5, { family: MONO, size: 14, color: INK, maxWidth: 216 })
      })

      // kaki: @[USER] → nama, tanggal kanan
      const foot = { family: MONO, size: 13, color: INK }
      const tgl = texts.tanggal?.trim() ?? ''
      const tw = tgl ? Math.min(240, measure(ctx, tgl, foot)) : 0
      text(ctx, tgl, 560, 1730, { ...foot, align: 'right', maxWidth: 240 })
      const user = texts.nama?.trim().replace(/\s+/g, '') ?? ''
      text(ctx, user && `@${user}`, 40, 1730, { ...foot, maxWidth: 520 - (tw ? tw + 24 : 0) })
    },
    over(ctx) {
      for (const y of ROW_Y) photoInset(ctx, 44, y + 4, 252, 462)
    },
  },
})
