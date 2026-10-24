// Kartu Pos — design-reference/travel/kartu-pos.html (1080x1350 portrait, 2 foto)
import { box, contentHeight, dropShadow, linear, svg } from '../paint'
import { travel } from './define'
import { dashedH, dashedV, FONTS, HAND, INK, join, MONO, photoInset, ring, rotated, tglBulan, TEXTURE, txt, width } from './helpers'

const CREAM = '#FBF8F1'
const RED = '#C0392B'
const BLUE = '#2E6DA4'
const LINE = '#c9c2b2'
const SLOTS = [
  { x: 104, y: 104, w: 426, h: 640 },
  { x: 550, y: 104, w: 426, h: 640 },
]
const WAVES = [10, 26, 42, 58].map((y) => `M0 ${y} Q 23.75 ${y - 10} 47.5 ${y} T 95.0 ${y} T 142.5 ${y} T 190 ${y}`)

/** bungkus teks per kata selebar maxW (kata tidak dipotong); kepanjangan → font dikecilkan */
function wrapHand(ctx: CanvasRenderingContext2D, s: string, maxW: number, maxLines: number) {
  const words = s.trim().split(/\s+/).filter(Boolean)
  let size = 40
  for (;;) {
    const o = { family: HAND, size, weight: 600, color: INK }
    const lines: string[] = []
    let cur = ''
    let ok = true
    for (const wd of words) {
      const next = cur ? `${cur} ${wd}` : wd
      if (!cur || width(ctx, next, o) <= maxW) cur = next
      else {
        lines.push(cur)
        cur = wd
      }
      if (width(ctx, cur, o) > maxW) ok = false
    }
    if (cur) lines.push(cur)
    if ((ok && lines.length <= maxLines) || size <= 18) return { lines, size }
    size = Math.max(18, size * 0.94)
  }
}

export const kartuPos = travel({
  id: 'travel-kartu-pos',
  name: 'kartu pos',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: '#7FA7C9' },
  placeholder: '#E5E0D4',
  fonts: FONTS,
  fields: ['tempat', 'catatan', 'tanggal'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      // kartu: bayangan + tepi airmail (repeating-linear-gradient 45deg di border-box 10px)
      dropShadow(ctx, 60, 60, 960, 1230, 0, 10, 24, 'rgba(0,0,0,0.2)')
      // gradien dengan stop keras (seperti Skia menggambar CSS gradient: tepi strip tidak di-antialias)
      const colors = [RED, CREAM, BLUE, CREAM]
      const len = (960 + 1230) * Math.SQRT1_2
      const stops: [number, string][] = []
      for (let k = 0; k * 12 < len; k++) {
        stops.push([(k * 12) / len, colors[k % 4]], [Math.min(1, ((k + 1) * 12) / len), colors[k % 4]])
      }
      box(ctx, 60, 60, 960, 1230, linear(ctx, 60, 60, 960, 1230, 45, stops))
      box(ctx, 70, 70, 940, 1210, CREAM)

      // tulisan tangan: salam + pesan (pesan dibungkus per kata)
      const hand = { family: HAND, size: 40, weight: 600, color: INK }
      const tempat = texts.tempat?.trim()
      const salam = tempat ? `salam dari ${tempat},` : 'salam hangat,'
      // kolom flex selebar 405: salam (maks. 2 baris) lalu pesan, jarak 16, sampai bawah kolom (1246)
      const s = wrapHand(ctx, salam, 405, 2)
      const lhS = (50 * s.size) / 40
      s.lines.forEach((l, i) => txt(ctx, l, 104, 774 + i * lhS, { ...hand, size: s.size }))
      const pesan = texts.catatan?.trim()
      if (pesan) {
        const top = 774 + s.lines.length * lhS + 16
        const { lines, size } = wrapHand(ctx, pesan, 405, Math.max(1, Math.floor((1246 - top) / 50)))
        const lh = (50 * size) / 40
        lines.forEach((l, i) => txt(ctx, l, 104, top + i * lh, { ...hand, size }))
      }

      box(ctx, 539, 774, 2, 472, LINE)

      // perangko: tepi putus-putus 2px + isi warna
      dashedH(ctx, 866, 774, 110, 2, INK, [6, 4])
      dashedH(ctx, 866, 902, 110, 2, INK, [6, 4])
      dashedV(ctx, 866, 774, 130, 2, INK, [6, 4])
      dashedV(ctx, 974, 774, 130, 2, INK, [6, 4])
      box(ctx, 874, 782, 94, 114, RED)

      for (const y of [926, 950, 974]) box(ctx, 571, y, 405, 2, LINE)
      txt(ctx, join(['VIA UDARA', texts.tanggal]), 571, 998, { family: MONO, size: 16, color: INK, maxWidth: 405 })

      // cap pos (rotate -10deg) + garis gelombang
      rotated(ctx, 884, 854, -10, () => {
        ring(ctx, 800, 770, 168, 4, 'rgba(30,42,58,0.55)')
        const cap = tglBulan(texts.tanggal)
        const o = { family: MONO, size: 13, weight: 700, color: 'rgba(30,42,58,0.65)', align: 'center' as const, maxWidth: 150 }
        txt(ctx, cap, 884, 854 - contentHeight(ctx, MONO, 13, 700) / 2, o)
      })
      svg(ctx, WAVES, 640, 820, 190, 70, 190, 70, { stroke: 'rgba(30,42,58,0.45)', lineWidth: 3 })
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s)
    },
  },
})
