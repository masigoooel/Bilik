// Mat Galeri — design-reference/klasik-minimalis/mat-galeri.html (1080x1350, 1 foto)
import { border, box, dropShadow, insetShadows, linear, text } from '../paint'
import { FONTS, GREY, INK, MONO, SERIF, photoInset, photoLift, yearOf } from './helpers'
import { klasik } from './define'

const SLOT = { x: 178, y: 178, w: 724, h: 800 }

export const matGaleri = klasik({
  id: 'klasik-mat-galeri',
  name: 'mat galeri',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#D9D5CC' },
  placeholder: '#E4E2DD',
  fonts: FONTS,
  fields: ['nama', 'tanggal'],
  slots: [SLOT],
  draw: {
    under(ctx, { texts }) {
      // kertas: inset 0 0 0 1px #d8d4cc, 0 20px 40px rgba(0,0,0,0.12)
      dropShadow(ctx, 70, 70, 940, 1210, 0, 20, 40, 'rgba(0,0,0,0.12)')
      box(ctx, 70, 70, 940, 1210, '#FBFAF7')
      border(ctx, 70, 70, 940, 1210, 1, '#d8d4cc')
      // passe-partout: gradien 135deg + inset 2px terang, -2px gelap, 1px #cfcac0 (paling bawah)
      box(ctx, 160, 160, 760, 836, linear(ctx, 160, 160, 760, 836, 135, [
        [0, '#ffffff'],
        [1, '#e7e3da'],
      ]))
      border(ctx, 160, 160, 760, 836, 1, '#cfcac0')
      insetShadows(ctx, 160, 160, 760, 836, [
        { dx: 2, dy: 2, color: 'rgba(255,255,255,0.9)' },
        { dx: -2, dy: -2, color: 'rgba(0,0,0,0.12)' },
      ])
      photoLift(ctx, SLOT)

      // label karya: kartu putih, garis atas 3px
      dropShadow(ctx, 584, 1096, 336, 114, 0, 6, 14, 'rgba(0,0,0,0.10)')
      dropShadow(ctx, 584, 1096, 336, 114, 0, 1, 1, 'rgba(0,0,0,0.12)')
      box(ctx, 584, 1096, 336, 114, '#ffffff')
      box(ctx, 584, 1096, 336, 3, INK)
      text(ctx, texts.nama?.trim() ?? '', 602, 1115, { family: SERIF, size: 28, color: INK, maxWidth: 300 })
      const year = yearOf(texts.tanggal)
      const o = { family: MONO, size: 13, color: GREY, maxWidth: 300 }
      text(ctx, year ? `potret, ${year}` : 'potret', 602, 1156, o)
      text(ctx, 'cetak arsip · no. 01', 602, 1177, o)
    },
    over(ctx) {
      photoInset(ctx, SLOT)
    },
  },
})
