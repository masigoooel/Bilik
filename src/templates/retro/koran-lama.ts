// Koran Lama — design-reference/retro-vintage/koran-lama.html (1080x1350, 1 foto)
import { border, box, insetShadows, linear, measure, text } from '../paint'
import { insetRing, premul, vignette } from './helpers'
import { retro } from './define'

const BG = '#EDE7D9'
const INK = '#1d1b17'
const MONO = 'IBM Plex Mono'
const SERIF = 'Playfair Display'

/** garis border-bottom double 4px = 1px garis, 2px celah, 1px garis */
function doubleRule(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  box(ctx, x, y, w, 1, INK)
  box(ctx, x, y + 3, w, 1, INK)
}

/** span-span justify-content: space-between di baris x=70 lebar 940 (span kosong dilewati); maxW per span: dikecilkan */
function spread(ctx: CanvasRenderingContext2D, items: { s: string; maxW?: number }[], y: number, size: number, italic = false) {
  const list = items.filter((it) => it.s)
  const f = { family: MONO, size, italic }
  const ws = list.map((it) => Math.min(measure(ctx, it.s, f), it.maxW ?? Infinity))
  const gap = (940 - ws.reduce((a, b) => a + b, 0)) / Math.max(1, list.length - 1)
  // tinggal satu span (span kiri kosong): tetap di posisi kanannya
  let x = list.length === 1 && list[0] === items[items.length - 1] ? 1010 - ws[0] : 70
  list.forEach((it, i) => {
    text(ctx, it.s, x, y, { ...f, color: INK, maxWidth: it.maxW })
    x += ws[i] + gap
  })
}

/** pola kolom berita: repeating-linear-gradient(#b9b2a2 0 6px, transparent 6px 18px) */
function columnLines(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  for (let ly = y; ly < y + h; ly += 18) {
    ctx.fillStyle = '#b9b2a2'
    ctx.fillRect(x, ly, w, 6)
  }
  ctx.restore()
}

export const koranLama = retro({
  id: 'retro-koran-lama',
  name: 'koran lama',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  // #D6D0C2 setelah grayscale(1) di desain
  placeholder: '#CCCCCC',
  // kotak FOTO di desain memakai filter: grayscale(1)
  filter: 'mono',
  fonts: ['Playfair Display:700,900', 'IBM Plex Mono:400,600', 'Permanent Marker', 'VT323'],
  fields: ['tanggal', 'catatan', 'nama', 'tempat'],
  texture: { opacity: 0.14, blend: 'multiply' },
  slots: [{ x: 70, y: 369.9, w: 940, h: 640 }],
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'HARIAN FOTO', 540, 40, { family: SERIF, size: 116, weight: 900, color: INK, align: 'center' })
      doubleRule(ctx, 70, 190, 940)

      // baris tanggal · cuaca · edisi
      spread(ctx, [{ s: texts.tanggal?.trim() ?? '', maxW: 300 }, { s: 'cerah berawan, 31°C' }, { s: 'Edisi 07 · Rp 5.000' }], 212, 16)
      box(ctx, 70, 242, 940, 1, INK)

      // label + judul berita
      box(ctx, 70, 261, 176.8, 24, INK)
      text(ctx, 'LAPORAN KHUSUS', 80, 264, { family: MONO, size: 14, weight: 600, color: BG, letterSpacing: 2.8 })
      const judul = texts.catatan?.trim() || 'kabar baik hari ini'
      text(ctx, judul, 70, 282, { family: SERIF, size: 58, weight: 700, color: INK, maxWidth: 940 })

      // keterangan foto
      const nama = texts.nama?.trim()
      spread(ctx, [{ s: nama ? `Foto: ${nama}` : '', maxW: 640 }, { s: 'hal. 1 · bersambung ke hal. 7' }], 1027.9, 15, true)
      box(ctx, 70, 1055, 940, 1, INK)

      // kolom berita + iklan
      columnLines(ctx, 70, 1073.9, 297.3, 216.1)
      columnLines(ctx, 391.3, 1073.9, 297.3, 216.1)
      columnLines(ctx, 712.7, 1073.9, 297.3, 116.9)
      border(ctx, 712.7, 1202.8, 297.3, 87.2, 1, INK)
      border(ctx, 712.7 + 2, 1202.8 + 2, 297.3 - 4, 87.2 - 4, 1, INK)
      text(ctx, 'IKLAN', 861.35, 1217.8, { family: MONO, size: 18, weight: 700, color: INK, align: 'center' })
      const toko = texts.tempat?.trim() || 'bilik foto'
      text(ctx, toko, 861.35, 1240.2, { family: MONO, size: 13, color: INK, align: 'center', maxWidth: 267 })
      text(ctx, 'buka tiap hari', 861.35, 1257.1, { family: MONO, size: 13, color: INK, align: 'center' })
    },
    over(ctx) {
      // box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 8px rgba(0,0,0,0.16) di kotak foto
      insetShadows(ctx, 70, 369.9, 940, 640, [{ dx: 0, dy: 3, blur: 8, color: 'rgba(0,0,0,0.16)' }])
      insetRing(ctx, 70, 369.9, 940, 640, 1, 'rgba(0,0,0,0.12)')
    },
    top(ctx, { W, H }) {
      // lipatan koran (top 664, tinggi 24)
      box(ctx, 0, 664, W, 24, linear(ctx, 0, 664, W, 24, 180, premul([[0, 'rgba(0,0,0,0)'], [0.45, 'rgba(0,0,0,0.10)'], [0.55, 'rgba(255,255,255,0.35)'], [1, 'rgba(0,0,0,0)']])))
      vignette(ctx, 0, 0, W, H, [[0, 'rgba(150,110,40,0)'], [0.6, 'rgba(150,110,40,0)'], [1, 'rgba(150,110,40,0.22)']])
    },
  },
})
