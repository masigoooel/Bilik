// Lembar Perangko — design-reference/retro-vintage/lembar-perangko.html (1200x1800, 6 foto)
import { box, linear, measure, setShadow, text } from '../paint'
import { retro } from './define'
import { insetRing, parseTanggal, perforated, photoInset, premul } from './helpers'

const BG = '#E7DCC4'
const INK = '#2b2116'
const CREAM = '#F6EFDC'
const MONO = 'IBM Plex Mono'
const SERIF = 'Playfair Display'
/** perangko 497x450: [x, y, nilai, warna bingkai] */
const STAMPS: [number, number, string, string][] = [
  [90, 228, '25', '#b5502e'],
  [613, 228, '50', '#2e5e8c'],
  [90, 704, '75', '#3c7a55'],
  [613, 704, '100', '#7a3c6b'],
  [90, 1180, '150', '#b58a2e'],
  [613, 1180, '200', '#2b2116'],
]

export const lembarPerangko = retro({
  id: 'retro-lembar-perangko',
  name: 'lembar perangko',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: BG },
  // #e3d8bf setelah sepia(0.25)
  placeholder: '#F3E3C2',
  // kotak FOTO di desain memakai filter: sepia(0.25)
  filter: 'hangat-klasik',
  fonts: ['Playfair Display:700,900', 'IBM Plex Mono:400,600', 'Caveat:700'],
  fields: ['nama', 'tanggal'],
  slots: STAMPS.map(([x, y]) => ({ x: x + 32, y: y + 32, w: 433, h: 330 })),
  draw: {
    under(ctx, { texts }) {
      const nama = texts.nama?.trim() ?? ''
      const p = parseTanggal(texts.tanggal)
      const tahun = p ? String(p.y) : ''

      text(ctx, 'Perangko', 90, 80, { family: SERIF, size: 72, weight: 900, color: INK })
      text(ctx, 'seri peringatan', 1110, tahun ? 136 : 156, { family: MONO, size: 16, color: INK, align: 'right' })
      text(ctx, tahun, 1110, 156, { family: MONO, size: 16, color: INK, align: 'right' })
      box(ctx, 90, 192, 1020, 2, INK)

      // lembar bergerigi (lubang tiap 20px, radius 7–8) dengan filter: drop-shadow(0 2px 2px rgba(0,0,0,0.15))
      const sheet = perforated(497, 450, 20, 7, 8, CREAM)
      for (const [x, y, nilai, col] of STAMPS) {
        ctx.save()
        setShadow(ctx, 0, 2, 4, 'rgba(0,0,0,0.15)')
        ctx.drawImage(sheet, x, y, 497, 450)
        ctx.restore()
        box(ctx, x + 16, y + 16, 465, 418, CREAM)
        insetRing(ctx, x + 16, y + 16, 465, 418, 3, col)
        const vw = measure(ctx, nilai, { family: SERIF, size: 34, weight: 900 })
        text(ctx, nilai, x + 32, y + 372, { family: SERIF, size: 34, weight: 900, color: col })
        text(ctx, nama, x + 465, y + 396, { family: MONO, size: 13, color: col, align: 'right', maxWidth: 433 - vw - 16 })
      }

      text(ctx, 'lembar 6 perangko · cetakan terbatas', 90, 1702, { family: MONO, size: 14, color: INK })
      const pencetak = nama ? `DICETAK OLEH PERCETAKAN ${nama.toUpperCase()}` : 'DICETAK OLEH PERCETAKAN BILIK'
      text(ctx, pencetak, 90, 1752, { family: MONO, size: 12, color: '#6b5d48', maxWidth: 760 })
      text(ctx, tahun ? `A 0017 · ${tahun}` : 'A 0017', 1110, 1752, { family: MONO, size: 12, color: '#6b5d48', align: 'right' })
    },
    over(ctx) {
      for (const [x, y] of STAMPS) photoInset(ctx, x + 32, y + 32, 433, 330)
      // kilau diagonal di atas lembar
      box(ctx, 90, 220, 1020, 1400, linear(ctx, 90, 220, 1020, 1400, 120, premul([[0, 'rgba(255,255,255,0)'], [0.35, 'rgba(255,255,255,0)'], [0.45, 'rgba(255,255,255,0.18)'], [0.55, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']])))
    },
  },
})
