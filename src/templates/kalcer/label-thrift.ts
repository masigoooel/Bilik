// Label Thrift — design-reference/kalcer/label-thrift.html (1080x1350, 2 foto)
import { border, box, insetShadows, svg, text } from '../paint'
import { ANTON, MARKER, MONO, TEXTURE, disc, rotated } from './helpers'
import { kalcer } from './define'

const BG = '#2F3A52'
const INK = '#2a2118'
const TAG = '#D9C4A0'
const ACCENT = '#C0311F'
const PHOTOS = [294, 714]

export const labelThrift = kalcer({
  id: 'kalcer-label-thrift',
  name: 'label thrift',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: BG },
  placeholder: '#EDE6D6',
  fonts: ['Anton', 'Space Mono:400,700', 'Permanent Marker'],
  fields: [],
  texture: TEXTURE,
  slots: PHOTOS.map((y) => ({ x: 170, y, w: 740, h: 400 })),
  draw: {
    under(ctx) {
      // tali gantungan (di belakang label)
      svg(ctx, 'M70 0 C 40 40, 100 60, 70 112', 470, 0, 140, 120, 140, 120, { stroke: '#EDE6D6', lineWidth: 5, lineCap: 'round' })

      // label kertas: clip-path polygon dengan sudut atas terpotong
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(240, 50)
      ctx.lineTo(840, 50)
      ctx.lineTo(950, 160)
      ctx.lineTo(950, 1300)
      ctx.lineTo(130, 1300)
      ctx.lineTo(130, 160)
      ctx.closePath()
      ctx.clip()
      ctx.fillStyle = TAG
      ctx.fillRect(130, 50, 820, 1250)
      // lubang tali: cincin (box-shadow 0 0 0 10px) + bayangan dalam
      disc(ctx, 500, 86, 80, '#c6ad83')
      disc(ctx, 510, 96, 60, BG)
      insetShadows(ctx, 510, 96, 60, 60, [{ dx: 0, dy: 4, blur: 8, color: 'rgba(0,0,0,0.45)' }], 30)

      text(ctx, 'PRELOVED · THRIFT', 170, 190, { family: MONO, size: 16, weight: 700, color: INK, letterSpacing: 4.8 })
      text(ctx, 'ARSIP', 170, 201, { family: ANTON, size: 58, color: INK })
      // cap "1 OF 1" miring -5°: kotak 100x48, pusat (859.95, 249.95)
      rotated(ctx, 859.95, 249.95, -5, () => {
        border(ctx, 809.95, 225.95, 100, 48, 3, INK)
        text(ctx, '1 OF 1', 826.95, 236.95, { family: MONO, size: 18, weight: 700, color: INK })
      })

      box(ctx, 170, 1134, 740, 3, INK)
      const label = { family: MONO, size: 14, color: INK }
      const value = { family: MONO, size: 22, weight: 700, color: INK }
      text(ctx, 'SIZE', 170, 1151, label)
      text(ctx, 'ALL SIZE', 170, 1174, value)
      text(ctx, 'KONDISI', 422, 1151, label)
      text(ctx, '9/10', 422, 1174, value)
      text(ctx, 'HARGA', 674, 1151, label)
      text(ctx, 'NFS', 674, 1174, { family: MARKER, size: 28, color: ACCENT })
      ctx.restore()

      // jepitan kertas: svg 200x60 (viewBox 120x50, meet → skala 1.2, geser 28px), rotate 28° di tengah
      rotated(ctx, 860, 180, 28, () => {
        ctx.beginPath()
        ctx.rect(760, 150, 200, 60)
        ctx.clip()
        ctx.translate(788, 150)
        ctx.scale(1.2, 1.2)
        svg(ctx, 'M10 25 C 10 10, 30 10, 30 25 L 100 25 C 112 25, 112 40, 100 40 L 30 40', 0, 0, 120, 50, 120, 50, { stroke: '#C9CDD3', lineWidth: 5, lineCap: 'round' })
        box(ctx, 96, 18, 20, 28, '#C9CDD3', 4)
      })
      rotated(ctx, 230.5, 152, -4, () => text(ctx, 'no. 017', 180, 130, { family: MARKER, size: 30, color: INK }))
    },
    over(ctx) {
      for (const y of PHOTOS) border(ctx, 170, y, 740, 400, 3, INK)
    },
  },
})
