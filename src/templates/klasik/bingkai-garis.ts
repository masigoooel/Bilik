// Bingkai Garis — design-reference/klasik-minimalis/bingkai-garis.html (1080x1350, 1 foto)
import { border, text } from '../paint'
import { FONTS, GREY, INK, MONO, SERIF, TEXTURE_09, cornerMarks, engraved, hline, photoInset, photoLift } from './helpers'
import { klasik } from './define'

const SLOT = { x: 108, y: 152, w: 864, h: 900 }

export const bingkaiGaris = klasik({
  id: 'klasik-bingkai-garis',
  name: 'bingkai garis',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#E4E2DD',
  fonts: FONTS,
  fields: ['tanggal', 'tempat'],
  texture: TEXTURE_09,
  slots: [SLOT],
  draw: {
    under(ctx, { texts }) {
      cornerMarks(ctx, 28, 28, 1018, 1288)
      border(ctx, 70, 70, 940, 1210, 2, INK)
      const head = { family: MONO, size: 14, color: INK, letterSpacing: 2.8 }
      text(ctx, 'PHOTOBOX', 108, 108, head)
      text(ctx, 'FRAME 1/1', 972, 108, { ...head, align: 'right' })
      photoLift(ctx, SLOT)
      hline(ctx, 108, 1078, 864, 1, INK)
      engraved(ctx, 'No. 01', 108, 1088, { family: SERIF, size: 60, color: INK })
      // tanggal · jam · tempat (field kosong dilewati)
      const info = [texts.tanggal?.trim(), '16:20', texts.tempat?.trim()].filter(Boolean).join(' · ')
      text(ctx, info, 972, 1137, { family: MONO, size: 16, color: GREY, align: 'right', maxWidth: 680 })
    },
    over(ctx) {
      photoInset(ctx, SLOT)
    },
  },
})
