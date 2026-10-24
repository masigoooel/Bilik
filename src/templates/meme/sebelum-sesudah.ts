// Sebelum Sesudah — design-reference/meme-lucu/sebelum-sesudah.html (1080x1350, 2 foto)
import { text } from '../paint'
import { ANTON, MONO, TEXTURE } from './helpers'
import { meme } from './define'

const INK = '#111111'

export const sebelumSesudah = meme({
  id: 'meme-sebelum-sesudah',
  name: 'sebelum sesudah',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#E2E0DA',
  fonts: ['Anton', 'Space Mono:400,700'],
  fields: ['tanggal'],
  texture: TEXTURE,
  slots: [
    { x: 60, y: 176, w: 468, h: 860 },
    { x: 552, y: 176, w: 468, h: 860 },
  ],
  draw: {
    under(ctx, { texts }) {
      const head = { family: ANTON, size: 80, color: INK }
      text(ctx, 'SEBELUM', 60, 60, head)
      text(ctx, 'SESUDAH', 552, 60, head)
      const foot = { family: MONO, size: 20, weight: 700, color: INK }
      text(ctx, 'selisih: 5 menit', 60, 1261, foot)
      text(ctx, texts.tanggal?.trim() ?? '', 1020, 1261, { ...foot, align: 'right', maxWidth: 600 })
    },
  },
})
