// Amplop Cuci Cetak — design-reference/kalcer/amplop-cuci-cetak.html (600x1800, 3 foto)
import { border, box, dropShadow, text } from '../paint'
import { ANTON, MARKER, MONO, photoInset, rotated } from './helpers'
import { kalcer } from './define'

const BG = '#3A3A38'
const INK = '#1c1b19'
const ENV = '#E9D9B4'
const PEN = '#1F3A8A'
const RED = '#C0311F'
/** cetakan foto 424x280 (padding 12 putih), miring di titik tengah */
const PRINTS = [
  { x: 70, y: 70, rot: -5 },
  { x: 120, y: 370, rot: 4 },
  { x: 60, y: 670, rot: -2 },
]

export const amplopCuciCetak = kalcer({
  id: 'kalcer-amplop-cuci-cetak',
  name: 'amplop cuci cetak',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#E4E2DD',
  fonts: ['Anton', 'Space Mono:400,700', 'Permanent Marker'],
  fields: ['nama', 'tanggal'],
  slots: PRINTS.map((p) => ({ x: p.x + 12, y: p.y + 12, w: 400, h: 256, rotate: p.rot })),
  draw: {
    under(ctx, { texts }) {
      for (const p of PRINTS)
        rotated(ctx, p.x + 212, p.y + 140, p.rot, () => {
          dropShadow(ctx, p.x, p.y, 424, 280, 0, 6, 12, 'rgba(0,0,0,0.2)')
          box(ctx, p.x, p.y, 424, 280, '#ffffff')
        })

      // amplop + tutup (clip-path trapesium)
      dropShadow(ctx, 30, 1000, 540, 760, 0, -6, 16, 'rgba(0,0,0,0.18)')
      box(ctx, 30, 1000, 540, 760, ENV)
      ctx.beginPath()
      ctx.moveTo(30, 1020)
      ctx.lineTo(30 + 540 * 0.08, 960)
      ctx.lineTo(30 + 540 * 0.92, 960)
      ctx.lineTo(570, 1020)
      ctx.closePath()
      ctx.fillStyle = '#E0CDA2'
      ctx.fill()

      text(ctx, 'CUCI CETAK', 66, 1023, { family: ANTON, size: 54, color: INK })
      const small = { family: MONO, size: 13, color: INK }
      text(ctx, 'foto kilat', 534, 1048.6, { ...small, align: 'right' })
      text(ctx, '1 jam jadi', 534, 1068.6, { ...small, align: 'right' })
      box(ctx, 66, 1100.6, 468, 3, INK)

      // isian formulir: label mono + tulisan tangan spidol biru, garis bawah dotted 1px
      const label = { family: MONO, size: 15, color: INK }
      const hand = { family: MARKER, size: 30, color: PEN }
      const rows: [string, number, number, string][] = [
        ['nama', 1121.6, 112.7, texts.nama?.trim() ?? ''],
        ['jumlah', 1184.6, 131.1, '3 lembar'],
        ['ambil', 1319.6, 121.9, [texts.tanggal?.trim(), 'sore'].filter(Boolean).join(', ')],
      ]
      for (const [k, y, vx, v] of rows) {
        text(ctx, k, 66, y + 16, label)
        if (v) text(ctx, v, vx, y, { ...hand, maxWidth: 534 - vx })
        // border-bottom 1.5px dotted (Chrome: 1px, titik tiap 2px; hasil ukur screenshot)
        const ly = Math.round(y + 48)
        ctx.fillStyle = INK
        ctx.fillRect(66, ly, 2, 1)
        for (let x = 69; x < 534; x += 2) ctx.fillRect(x, ly, 1, 1)
      }

      // pilihan ukuran & kertas
      const opts: [string, number, number, boolean][] = [
        ['4R', 66, 1247.6, true],
        ['3R', 132.4, 1247.6, false],
        ['10R', 198.8, 1247.6, false],
        ['glossy', 66, 1283.6, false],
        ['doff', 169.1, 1283.6, true],
      ]
      for (const [k, x, y, on] of opts) {
        border(ctx, x, y + 1, 20, 20, 2, INK)
        if (on) text(ctx, '✓', x + 4, y - 0.5, { family: MARKER, size: 16, color: RED })
        text(ctx, k, x + 26, y, label)
      }

      text(ctx, 'No. 0017', 66, 1700, small)
      text(ctx, 'terima kasih', 534, 1700, { ...small, align: 'right' })
    },
    over(ctx) {
      for (const p of PRINTS) rotated(ctx, p.x + 212, p.y + 140, p.rot, () => photoInset(ctx, p.x + 12, p.y + 12, 400, 256))
    },
  },
})
