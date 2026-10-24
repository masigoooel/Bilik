// Peta Rute — design-reference/travel/peta-rute.html (1200x1800 4R, 6 foto)
import { border, box, dropShadow, svgPath } from '../paint'
import { travel } from './define'
import { daftarTempat, disc, FONTS, INK, lineTop, MONO, MONO_STACK, photoInset, rotated, SERIF, TEXTURE, txt } from './helpers'

const PIN = '#D7261E'
const CW = 490
const CH = 442
const ROUTE = 'M300 360 C 700 300, 500 600, 900 640 S 300 900, 320 1060 S 900 1200, 880 1480'

/** foto polaroid: grid 2 kolom (x 80 / 630), baris 211 / 703 / 1195, miring di titik tengah */
const CARDS = [-2, 1.5, 1, -1.5, -1, 2].map((rot, i) => ({ x: i % 2 ? 630 : 80, y: 211 + Math.floor(i / 2) * 492, rot }))

/** pusat kotak foto (466x380 di x+12, y+12) sesudah kartu diputar */
function slotOf(c: (typeof CARDS)[number]) {
  const a = (c.rot * Math.PI) / 180
  const dy = 12 + 190 - CH / 2
  const cx = c.x + CW / 2 - dy * Math.sin(a)
  const cy = c.y + CH / 2 + dy * Math.cos(a)
  return { x: cx - 233, y: cy - 190, w: 466, h: 380, rotate: c.rot }
}

const inCard = (ctx: CanvasRenderingContext2D, c: (typeof CARDS)[number], draw: () => void) =>
  rotated(ctx, c.x + CW / 2, c.y + CH / 2, c.rot, draw)

export const petaRute = travel({
  id: 'travel-peta-rute',
  name: 'peta rute',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#E9E3D2' },
  placeholder: '#E5E0D4',
  fonts: FONTS,
  fields: ['tempat'],
  texture: TEXTURE,
  slots: CARDS.map(slotOf),
  draw: {
    under(ctx, { texts, W, H }) {
      // kertas peta: garis grid 2px tiap 80px
      ctx.fillStyle = 'rgba(30,42,58,0.06)'
      for (let y = 0; y < H; y += 80) ctx.fillRect(0, y, W, 2)
      for (let x = 0; x < W; x += 80) ctx.fillRect(x, 0, 2, H)

      // rute putus-putus
      ctx.save()
      ctx.strokeStyle = INK
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.setLineDash([4, 14])
      ctx.stroke(svgPath(ROUTE))
      ctx.restore()

      txt(ctx, 'Rute Kita', 80, lineTop(ctx, SERIF, 90, 0.9, 80, 700), { family: SERIF, size: 90, weight: 700, color: INK })
      txt(ctx, '6 PEMBERHENTIAN', 1120, 135, { family: MONO, size: 18, color: INK, align: 'right' })

      // kartu foto + label "01 · kota" (kota dari tempat, dipisah koma)
      const kota = daftarTempat(texts.tempat, 6)
      CARDS.forEach((c, i) => {
        inCard(ctx, c, () => {
          dropShadow(ctx, c.x, c.y, CW, CH, 0, 4, 10, 'rgba(0,0,0,0.15)')
          box(ctx, c.x, c.y, CW, CH, '#ffffff')
          const label = kota[i] ? `0${i + 1} · ${kota[i]}` : `0${i + 1}`
          txt(ctx, label, c.x + 16, c.y + 406, { family: MONO, size: 18, weight: 700, color: INK, maxWidth: CW - 32 })
        })
      })

      // kompas (svg 80x80, viewBox 100)
      ctx.save()
      ctx.translate(1060, 1660)
      ctx.scale(0.8, 0.8)
      ctx.strokeStyle = INK
      ctx.fillStyle = INK
      ctx.lineWidth = 2
      // SVG: stroke-miterlimit default 4 (canvas 10)
      ctx.miterLimit = 4
      ctx.beginPath()
      ctx.arc(50, 50, 40, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fill(svgPath('M50 8 L58 50 L50 92 L42 50 Z'))
      ctx.stroke(svgPath('M8 50 L50 42 L92 50 L50 58 Z'))
      ctx.font = `700 10px "${MONO}", monospace`
      ctx.textAlign = 'center'
      ctx.fillText('U', 50, 6)
      ctx.restore()

      // legenda
      box(ctx, 80, 1650, 378.2, 52, 'rgba(255,255,255,0.8)')
      border(ctx, 80, 1650, 378.2, 52, 2, INK)
      const leg = { family: MONO_STACK, size: 13, color: INK }
      txt(ctx, '- - - rute', 102, 1666, leg)
      txt(ctx, '● pemberhentian', 201.6, 1666, leg)
      txt(ctx, 'skala: dekat', 340.8, 1666, leg)
    },
    over(ctx) {
      // bayangan inset kotak foto + pin (menimpa tepi atas foto)
      for (const c of CARDS) {
        inCard(ctx, c, () => {
          photoInset(ctx, { x: c.x + 12, y: c.y + 12, w: 466, h: 380 })
          disc(ctx, c.x + 231, c.y - 14, 34, INK)
          disc(ctx, c.x + 234, c.y - 11, 28, PIN)
        })
      }
    },
  },
})
