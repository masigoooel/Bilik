// Dicari — design-reference/meme-lucu/dicari.html (1080x1350, 1 foto)
import { border, box, dropShadow, radial, text, type Ctx } from '../paint'
import { MONO, RYE, TEXTURE, dashedH, disc, join, photoInset, rotated, spacedText } from './helpers'
import { meme } from './define'

const INK = '#2A1E12'
const PAPER = '#E8D9B5'
/** [JUMLAH] tidak punya field yang cocok: teks tetap pendek */
const IMBALAN = 'Rp 17.000'

/** clip-path: polygon(...) tepi kertas sobek, koordinat relatif kertas (left 70, top 55) */
const EDGE: [number, number][] = [[0,9],[47,4],[94,5],[141,10],[188,8],[235,0],[282,7],[329,3],[376,10],[423,0],[470,2],[517,1],[564,5],[611,7],[658,3],[705,6],[752,8],[799,1],[846,9],[893,3],[940,0],[937,62],[934,124],[936,186],[938,248],[934,310],[938,372],[939,434],[938,496],[931,558],[931,620],[933,682],[938,744],[938,806],[940,868],[940,930],[937,992],[937,1054],[938,1116],[938,1178],[936,1240],[940,1235],[893,1237],[846,1232],[799,1230],[752,1230],[705,1237],[658,1238],[611,1237],[564,1234],[517,1236],[470,1240],[423,1235],[376,1234],[329,1238],[282,1238],[235,1236],[188,1239],[141,1235],[94,1236],[47,1231],[0,1231],[0,1240],[9,1178],[10,1116],[5,1054],[1,992],[4,930],[5,868],[4,806],[7,744],[5,682],[2,620],[7,558],[7,496],[2,434],[0,372],[4,310],[0,248],[5,186],[6,124],[0,62]]
const PX = 70
const PY = 55
const PW = 940
const PH = 1240

/** garis pemisah: dua garis 2px + ◆ di tengah */
function divider(ctx: Ctx, y: number) {
  box(ctx, 140, y + 9.5, 382.14, 2, INK)
  box(ctx, 557.84, y + 9.5, 382.16, 2, INK)
  text(ctx, '◆', 540, y, { family: MONO, size: 14, color: INK, align: 'center' })
}

/** paku payung: radial-gradient(circle at 35% 35%, #d8d8d8, #555 70%), bayangan 0 2px 3px */
function pin(ctx: Ctx, x: number, y: number) {
  dropShadow(ctx, x, y, 26, 26, 0, 2, 3, 'rgba(0,0,0,0.5)', 13)
  const cx = x + 9.1
  const cy = y + 9.1
  disc(ctx, x, y, 26, radial(ctx, cx, cy, Math.hypot(26 - 9.1, 26 - 9.1), [[0, '#d8d8d8'], [0.7, '#555555'], [1, '#555555']]))
}

export const dicari = meme({
  id: 'meme-dicari',
  name: 'dicari',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#2f2215' },
  placeholder: '#D8C69C',
  // kotak foto di desain: filter sepia(0.5) contrast(1.1) → preset terdekat
  filter: 'hangat-klasik',
  fonts: ['Rye', 'Space Mono:400,700'],
  fields: ['nama', 'catatan', 'tempat', 'nama2', 'tanggal'],
  texture: TEXTURE,
  // pusat kotak foto setelah rotasi -0.8° kertas (diukur dari desain)
  slots: [{ x: 259.5, y: 388, w: 560, h: 500, rotate: -0.8 }],
  draw: {
    under(ctx, { texts, W, H }) {
      // papan kayu: repeating-linear-gradient(90deg) periode 14px
      for (let x = 0; x < W; x += 14) {
        box(ctx, x, 0, 3, H, '#3a2a1a')
        box(ctx, x + 9, 0, 5, H, '#34261a')
      }

      rotated(ctx, PX + PW / 2, PY + PH / 2, -0.8, () => {
        ctx.save()
        ctx.beginPath()
        EDGE.forEach(([x, y], i) => (i ? ctx.lineTo(PX + x, PY + y) : ctx.moveTo(PX + x, PY + y)))
        ctx.closePath()
        ctx.clip()
        box(ctx, PX, PY, PW, PH, PAPER)
        // noda: radial-gradient(circle at 85% 88%, ..., transparent 35%) lalu (circle at 18% 12%, ..., transparent 30%)
        const stain = (fx: number, fy: number, a: number, stop: number) => {
          const cx = fx * PW
          const cy = fy * PH
          const r = Math.hypot(Math.max(cx, PW - cx), Math.max(cy, PH - cy))
          box(ctx, PX, PY, PW, PH, radial(ctx, PX + cx, PY + cy, r, [[0, `rgba(120,80,30,${a})`], [stop, 'rgba(120,80,30,0)'], [1, 'rgba(120,80,30,0)']]))
        }
        stain(0.85, 0.88, 0.22, 0.35)
        stain(0.18, 0.12, 0.18, 0.3)

        spacedText(ctx, 'No. 017 · PEMBERITAHUAN UMUM', 540, 109, { family: MONO, size: 15, weight: 700, color: INK, letterSpacing: 4.5, align: 'center' })
        divider(ctx, 147)
        text(ctx, 'DICARI', 540, 159, { family: RYE, size: 140, color: INK, align: 'center' })
        text(ctx, 'dengan segera', 540, 326, { family: RYE, size: 26, color: INK, align: 'center' })
        // bingkai foto: border 3px + outline 2px (offset 6px)
        border(ctx, 247, 375, 586, 526, 3, INK)
        border(ctx, 239, 367, 602, 542, 2, INK)

        text(ctx, texts.nama?.trim() ?? '', 540, 916, { family: RYE, size: 58, color: INK, align: 'center', maxWidth: 800 })
        divider(ctx, 997)
        spacedText(ctx, 'IMBALAN', 540, 1034, { family: MONO, size: 15, color: INK, letterSpacing: 4.5, align: 'center' })
        text(ctx, IMBALAN, 540, 1050, { family: RYE, size: 66, color: INK, align: 'center', maxWidth: 800 })

        // ciri-ciri ([CIRI KHAS] → catatan) & terakhir terlihat ([TEMPAT] → tempat); kolom kosong disembunyikan
        dashedH(ctx, 140, 1140, 800, 1, INK, [3, 2])
        const label = { family: MONO, size: 16, color: INK }
        const value = { ...label, weight: 700, maxWidth: 390 }
        const ciri = texts.catatan?.trim()
        if (ciri) {
          text(ctx, 'CIRI-CIRI', 140, 1153, label)
          text(ctx, ciri, 140, 1177, value)
        }
        const tempat = texts.tempat?.trim()
        if (tempat) {
          text(ctx, 'TERAKHIR TERLIHAT', 550, 1153, label)
          text(ctx, tempat, 550, 1177, value)
        }
        // [KONTAK] → nama2
        const kontak = texts.nama2?.trim()
        const tgl = texts.tanggal?.trim()
        text(ctx, join([kontak && `hubungi ${kontak}`, tgl && `dikeluarkan ${tgl}`]), 540, 1217, { family: MONO, size: 13, color: INK, align: 'center', maxWidth: 800 })
        ctx.restore()
      })

      for (const [x, y] of [[110, 85], [944, 85], [110, 1240], [944, 1240]]) pin(ctx, x, y)
    },
    over(ctx) {
      // bayangan inset kotak foto ikut rotasi kertas
      rotated(ctx, PX + PW / 2, PY + PH / 2, -0.8, () => photoInset(ctx, 260, 388, 560, 500))
    },
  },
})
