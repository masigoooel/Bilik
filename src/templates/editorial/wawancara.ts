// Wawancara — design-reference/editorial-majalah/wawancara.html (1080x1350, 2 foto)
import { editorial } from './define'
import { bars, FONTS, fotoInset, INK, lines, MONO, SERIF, txt, wrap } from './helpers'

const BAR = '#C9C5BC'
/** grid 1.1fr 1fr (gap 44) di lebar 960 */
const WA = (916 * 1.1) / 2.1
const XB = 60 + WA + 44
const WB = 960 - WA - 44
const SLOTS = [
  { x: 60, y: 70, w: WA, h: 760 },
  { x: 60, y: 879, w: WA, h: 300 },
]
/** T: [PERTANYAAN] tidak punya field: pertanyaan tetap yang kalem + garis jawaban (persen lebar) */
const QA: [string, number[]][] = [
  ['T: bagaimana awalnya?', [100, 94, 70]],
  ['T: apa yang dicari?', [100, 88, 96, 60]],
  ['T: lalu, sekarang?', [100, 90, 50]],
]

export const wawancara = editorial({
  id: 'editorial-wawancara',
  name: 'wawancara',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: '#F5F2EC' },
  placeholder: '#DDD9D0',
  fonts: FONTS,
  // narasumber = nama, tempat = tempat, kutipan = catatan, pewawancara = nama2
  fields: ['nama', 'tempat', 'catatan', 'nama2'],
  // desain tanpa lapisan tekstur
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      const mono = { family: MONO, color: INK }
      const nama = texts.nama?.trim()
      const tempat = texts.tempat?.trim()
      txt(ctx, nama && tempat ? `${nama} di ${tempat}` : nama || tempat || '', 60, 846, { ...mono, size: 13, maxWidth: WA })

      // kolom kanan (flex kolom, gap 22)
      txt(ctx, 'WAWANCARA', XB, 70, { ...mono, size: 13, ls: 3.9 })
      let y = 109
      const kutipan = texts.catatan?.trim()
      if (kutipan) {
        const q = { family: SERIF, size: 64, color: INK }
        const k = wrap(ctx, `"${kutipan}"`, q, WB, 3)
        lines(ctx, k.lines, XB, y, 0.95, { ...q, size: k.size })
        y += k.lines.length * k.size * 0.95 + 22
      }
      const oleh = texts.nama2?.trim()
      txt(ctx, oleh ? `oleh ${oleh} · hal. 42` : 'hal. 42', XB, y, { ...mono, size: 14, maxWidth: WB })
      y += 18 + 22
      for (const [tanya, p] of QA) {
        txt(ctx, tanya, XB, y, { ...mono, size: 15, weight: 600 })
        bars(ctx, XB, y + 27, WB, p, 7, 8, BAR)
        y += 27 + p.length * 15 - 8 + 22
      }
    },
    over(ctx) {
      for (const s of SLOTS) fotoInset(ctx, s.x, s.y, s.w, s.h)
    },
  },
})
