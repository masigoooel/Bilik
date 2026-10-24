// Berkas Rahasia — design-reference/dark-grunge/berkas-rahasia.html (1080x1350, 2 foto)
import { box, border, dropShadow, svg, type Ctx } from '../paint'
import { dark } from './define'
import { CINZEL, SPECIAL, ellipseGradient, romanDate, rotated, slotInset, txt, vignette } from './helpers'

const INK = '#1a1714'
const MUTED = '#6b6255'
const MANILA = '#C8A86A'
const BG = '#120F0C'
/** klip kertas (svg 40x110, viewBox 20x55) */
const CLIP = 'M6 40 V10 a4 4 0 0 1 8 0 V45 a7 7 0 0 1 -14 0 V14'
/** lampiran 357x426 (padding 12px 12px 34px): kiri, atas, rotate */
const PRINTS: [x: number, y: number, rot: number][] = [
  [166, 301, -2.5],
  [557, 301, 2],
]
/** pusat slot sesudah rotasi (hasil ukur desain) */
const SLOTS = [
  { x: 177.5, y: 313, w: 333, h: 380, rotate: -2.5 },
  { x: 569.4, y: 313, w: 333, h: 380, rotate: 2 },
]

function inPrint(ctx: Ctx, i: number, draw: (x: number, y: number) => void) {
  const [x, y, rot] = PRINTS[i]
  rotated(ctx, x + 178.5, y + 213, rot, () => draw(x, y))
}

export const berkasRahasia = dark({
  id: 'dark-berkas-rahasia',
  name: 'berkas rahasia',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: BG },
  placeholder: '#cfc9bb',
  // kotak foto desain: filter grayscale(1) contrast(1.15) → preset hitam putih
  filter: 'mono',
  fonts: ['Special Elite', 'Cinzel Decorative:700'],
  // subjek = nama, lokasi = tempat, tanggal romawi di kanan judul
  fields: ['nama', 'tempat', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      ellipseGradient(ctx, 0, 0, W, H, 0.5, 0.3, [
        [0, '#3a3026'],
        [0.7, BG],
        [1, BG],
      ])

      // map manila + tab
      dropShadow(ctx, 60, 70, 960, 1220, 0, 30, 60, 'rgba(0,0,0,0.55)', 10)
      box(ctx, 60, 70, 960, 1220, MANILA, 10)
      box(ctx, 100, 44, 260, 40, MANILA, [10, 10, 0, 0])
      txt(ctx, 'No. 0017', 183.8, 56, { family: SPECIAL, size: 16, ls: 3.2, color: INK })

      // kertas
      dropShadow(ctx, 100, 110, 880, 1140, 0, 4, 10, 'rgba(0,0,0,0.2)')
      box(ctx, 100, 110, 880, 1140, '#EFE9DC')

      txt(ctx, 'Berkas Rahasia', 160, 180, { family: CINZEL, size: 50, color: INK })
      const r = { family: SPECIAL, size: 16, color: INK, align: 'right' as const }
      const tgl = romanDate(texts.tanggal)
      txt(ctx, 'arsip pribadi', 920, tgl ? 216 : 232, r)
      txt(ctx, tgl, 920, 232, { ...r, maxWidth: 300 })
      // border-bottom 3px double
      box(ctx, 160, 262, 760, 1, INK)
      box(ctx, 160, 264, 760, 1, INK)

      // lampiran
      PRINTS.forEach((_, i) =>
        inPrint(ctx, i, (x, y) => {
          dropShadow(ctx, x, y, 357, 426, 0, 6, 12, 'rgba(0,0,0,0.25)')
          box(ctx, x, y, 357, 426, '#f3efe6')
          txt(ctx, `lampiran ${'AB'[i]}`, x + 14, y + 405, { family: SPECIAL, size: 15, color: INK })
        }),
      )

      // tabel keterangan
      const label = { family: SPECIAL, size: 20, color: MUTED }
      const val = { family: SPECIAL, size: 20, color: INK, maxWidth: 576 }
      const rows: [string, number, number][] = [
        ['subjek', 763, 789],
        ['lokasi', 804, 830],
        ['keterangan', 845, 873.4],
        ['status', 888.4, 916.8],
      ]
      for (const [s, y, line] of rows) {
        txt(ctx, s, 160, y, label)
        box(ctx, 160, line, 760, 1, 'rgba(26,23,20,0.25)')
      }
      txt(ctx, texts.nama?.trim() || 'tidak diketahui', 344, 763, val)
      txt(ctx, texts.tempat?.trim() || 'tidak diketahui', 344, 804, val)
      // teks disensor (kotak hitam 22px, vertical-align middle); x hasil ukur sudah termasuk spasi sesudah kotak
      txt(ctx, 'terlihat bersama', 344, 845, val)
      box(ctx, 523.4, 845.4, 180, 22, INK)
      txt(ctx, ' pada malam itu', 703.4, 845, val)
      box(ctx, 344, 888.8, 140, 22, INK)
      txt(ctx, ' · belum ditutup', 484, 888.4, val)

      txt(ctx, 'hanya untuk yang bersangkutan', 160, 1185, { family: SPECIAL, size: 15, color: MUTED })

      // stempel RAHASIA: padding 6px 16px, border 4px, rotate -6°, opacity 0.85
      rotated(ctx, 829.5, 1177.05, -6, () => {
        ctx.globalAlpha = 0.85
        border(ctx, 739, 1154.05, 181, 46, 4, '#9E1B32')
        txt(ctx, 'RAHASIA', 759, 1164.05, { family: SPECIAL, size: 26, ls: 5.2, color: '#9E1B32' })
        ctx.globalAlpha = 1
      })
    },
    over(ctx) {
      for (const s of SLOTS) slotInset(ctx, s)
      // klip kertas (z-index 3) menjepit foto; <svg> memotong goresan di luar viewport
      PRINTS.forEach((_, i) =>
        inPrint(ctx, i, (x, y) => {
          ctx.save()
          ctx.beginPath()
          ctx.rect(x + 150, y - 34, 40, 110)
          ctx.clip()
          svg(ctx, CLIP, x + 150, y - 34, 40, 110, 20, 55, { stroke: '#9aa0a7', lineWidth: 2.5, lineCap: 'round' })
          ctx.restore()
        }),
      )
    },
    top(ctx, { W, H }) {
      vignette(ctx, W, H)
    },
  },
})
