// Paspor — design-reference/travel/paspor.html (1080x1350 portrait, 1 foto)
import { box, radial } from '../paint'
import { travel } from './define'
import {
  ASAL_DEFAULT, FONTS, HAND, INK, lineTop, MONO, photoInset, ring, rotated, rute, SERIF, tambahTahun, TEXTURE, tglMrz, tglTitik, txt,
} from './helpers'

const RED = '#B03A2E'
const SLOT = { x: 110, y: 209, w: 460, h: 620 }

/** nama untuk baris MRZ: kapital, spasi jadi '<', dipanjangkan dengan '<' sampai 24 karakter */
function mrzLine1(nama: string | undefined) {
  const n = (nama ?? '').trim().toUpperCase().replace(/\s+/g, '<')
  const s = `P<FOTO<<${n}`
  return s + '<'.repeat(Math.max(2, 24 - s.length))
}

export const paspor = travel({
  id: 'travel-paspor',
  name: 'paspor',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#1E2A4A' },
  placeholder: '#C9D3C7',
  fonts: FONTS,
  fields: ['nama', 'tempat', 'tanggal'],
  texture: TEXTURE,
  slots: [SLOT],
  draw: {
    under(ctx, { texts }) {
      // halaman paspor: repeating-radial-gradient(circle at 70% 30%, 6px / 6px), radius farthest-corner
      const cx = 732
      const cy = 429
      const r = Math.hypot(cx - 60, 1290 - cy)
      const stops: [number, string][] = []
      for (let k = 0; k * 6 < r; k++) {
        const c = k % 2 ? '#DCE6DA' : '#E7EEE6'
        stops.push([(k * 6) / r, c], [Math.min(1, ((k + 1) * 6) / r), c])
      }
      box(ctx, 60, 60, 960, 1230, radial(ctx, cx, cy, r, stops), 18)

      txt(ctx, 'PASPOR FOTO', 110, 110, { family: SERIF, size: 56, weight: 700, color: INK })
      txt(ctx, 'No. A0001017', 970, 155, { family: MONO, size: 16, color: INK, align: 'right' })

      // data: baris yang kosong disembunyikan, sisanya merapat ke atas (flex kolom, langkah 80px)
      const { asal, tujuan } = rute(texts.tempat)
      const tanggal = texts.tanggal?.trim() ?? ''
      const rows: [string, string][] = [
        ['NAMA', texts.nama?.trim() ?? ''],
        ['ASAL', tujuan ? asal || ASAL_DEFAULT : ''],
        ['TUJUAN', tujuan],
        ['TANGGAL', tanggal],
        ['BERLAKU HINGGA', tambahTahun(tanggal, 10)],
      ]
      rows
        .filter(([, v]) => v)
        .forEach(([k, v], i) => {
          txt(ctx, k, 610, 219 + i * 80, { family: MONO, size: 13, color: INK, ls: 1.3 })
          txt(ctx, v, 610, 241 + i * 80, { family: MONO, size: 24, weight: 700, color: INK, maxWidth: 360 })
        })

      // baris MRZ (line-height 1.35)
      const mrz = { family: MONO, size: 38, color: INK, ls: 3.8, maxWidth: 860 }
      const top = lineTop(ctx, MONO, 38, 1.35, 1137.4)
      txt(ctx, mrzLine1(texts.nama), 110, top, mrz)
      txt(ctx, `A0001017<0IDN${tglMrz(tanggal) || '<<<<<<'}<<<<<<`, 110, top + 51.3, mrz)

      // stempel TIBA (rotate -14deg, opacity 0.85)
      ctx.save()
      ctx.globalAlpha = 0.85
      rotated(ctx, 815, 735, -14, () => {
        ring(ctx, 700, 620, 230, 5, RED)
        const o = { family: MONO, weight: 700, color: RED, align: 'center' as const }
        const tgl = tglTitik(tanggal)
        if (tgl) {
          txt(ctx, 'TIBA', 815, 706.5, { ...o, size: 22 })
          txt(ctx, tgl, 815, 741.5, { ...o, size: 15, maxWidth: 200 })
        } else txt(ctx, 'TIBA', 815, 718.5, { ...o, size: 22 })
      })
      ctx.restore()

      // cap "FOTO" (border 4px double, opacity 0.7)
      ctx.save()
      ctx.globalAlpha = 0.7
      ring(ctx, 880, 150, 98, 1, INK)
      ring(ctx, 883, 153, 92, 1, INK)
      txt(ctx, 'FOTO', 929, 188, { family: SERIF, size: 18, weight: 700, color: INK, align: 'center' })
      ctx.restore()

      // tanda tangan = nama (tulisan tangan) di atas garis
      txt(ctx, texts.nama?.trim() ?? '', 650, 930, { family: HAND, size: 40, weight: 600, color: INK, maxWidth: 280 })
      box(ctx, 650, 982, 280, 2, INK)
    },
    over(ctx) {
      photoInset(ctx, SLOT)
    },
  },
})
