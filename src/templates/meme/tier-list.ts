// Tier List — design-reference/meme-lucu/tier-list.html (600x1800, 4 foto)
import { box, measure, text } from '../paint'
import { ANTON, MONO, TEXTURE } from './helpers'
import { meme } from './define'

const LIGHT = '#f2f2f2'
const EDGE = '#111111'
const TIERS: { ch: string; color: string }[] = [
  { ch: 'S', color: '#FF6B6B' },
  { ch: 'A', color: '#FFB347' },
  { ch: 'B', color: '#FFE066' },
  { ch: 'C', color: '#8CE99A' },
]
/** baris tier: kotak 520x326 (border 3px), jarak 22px */
const ROW_Y = TIERS.map((_, i) => 146 + i * 348)

export const tierList = meme({
  id: 'meme-tier-list',
  name: 'tier list',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#1a1a1a' },
  placeholder: '#2b2b2b',
  fonts: ['Anton', 'Space Mono:400,700'],
  fields: ['catatan', 'tanggal'],
  texture: TEXTURE,
  slots: ROW_Y.map((y) => ({ x: 156, y: y + 3, w: 401, h: 314 })),
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'TIER LIST', 300, 44, { family: ANTON, size: 64, color: LIGHT, align: 'center' })
      TIERS.forEach((t, i) => {
        const y = ROW_Y[i]
        // border 3px di empat sisi
        box(ctx, 40, y, 520, 3, EDGE)
        box(ctx, 40, y + 323, 520, 3, EDGE)
        box(ctx, 40, y, 3, 326, EDGE)
        box(ctx, 557, y, 3, 326, EDGE)
        // label tier 110px + border kanan 3px
        box(ctx, 43, y + 3, 110, 320, t.color)
        box(ctx, 153, y + 3, 3, 320, EDGE)
        text(ctx, t.ch, 98, y + 103, { family: ANTON, size: 80, color: LIGHT, align: 'center' })
      })
      // footer: [TOPIK] → catatan (kiri), tanggal (kanan)
      const foot = { family: MONO, size: 16, color: LIGHT }
      const tgl = texts.tanggal?.trim() ?? ''
      const tw = tgl ? Math.min(240, measure(ctx, tgl, foot)) : 0
      text(ctx, tgl, 560, 1732, { ...foot, align: 'right', maxWidth: 240 })
      text(ctx, texts.catatan?.trim() ?? '', 40, 1732, { ...foot, maxWidth: 520 - (tw ? tw + 24 : 0) })
    },
  },
})
