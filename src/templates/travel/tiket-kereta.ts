// Tiket Kereta — design-reference/travel/tiket-kereta.html (600x1800 strip, 3 foto)
import { box, contentHeight } from '../paint'
import { travel } from './define'
import { ASAL_DEFAULT, dashedH, disc, FONTS, INK, MONO, photoInset, rute, SERIF, TEXTURE, txt, width } from './helpers'

const BG = '#E37B3C'
const PAPER = '#F6F1E4'
/** lebar minimum garis rute di antara nama kota */
const MIN_LINE = 60

const SLOTS = [0, 1, 2].map((i) => ({ x: 70, y: 255 + i * 402, w: 460, h: 380 }))

export const tiketKereta = travel({
  id: 'travel-tiket-kereta',
  name: 'tiket kereta',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#E5E0D4',
  fonts: FONTS,
  fields: ['tempat', 'tanggal'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      box(ctx, 40, 40, 520, 1720, PAPER, 14)
      const head = { family: MONO, size: 14, weight: 700, color: INK }
      txt(ctx, 'TIKET KERETA', 70, 76, head)
      txt(ctx, 'KELAS EKONOMI', 530, 76, { ...head, align: 'right' })

      // asal → tujuan (dari tempat "jakarta → bandung"; tanpa asal: "rumah"), garis rute di antaranya
      const r = rute(texts.tempat)
      const tujuan = r.tujuan
      const asal = tujuan ? r.asal || ASAL_DEFAULT : ''
      const big = { family: SERIF, size: 40, weight: 700, color: INK }
      let wa = width(ctx, asal, big)
      let wt = width(ctx, tujuan, big)
      const gaps = (asal ? 14 : 0) + (tujuan ? 14 : 0)
      const room = 460 - gaps - MIN_LINE
      if (wa + wt > room) {
        // nama pendek tetap utuh, nama panjang dikecilkan memakai sisa tempat
        if (wa <= room / 2) wt = room - wa
        else if (wt <= room / 2) wa = room - wt
        else wa = wt = room / 2
      }
      // ukuran font mengikuti lebar jatah (tanpa batas bawah, supaya tidak pernah menabrak garis/kota lain)
      const fit = (s: string, w: number) => {
        const n = width(ctx, s, big)
        return n > w + 0.01 ? (40 * w) / n : 40
      }
      const sa = fit(asal, wa)
      const st = fit(tujuan, wt)
      // teks dikecilkan tetap dipusatkan di baris setinggi kotak konten 40px
      const mid = (sz: number) => 119 + (contentHeight(ctx, SERIF, 40, 700) - contentHeight(ctx, SERIF, sz, 700)) / 2
      txt(ctx, asal, 70, mid(sa), { ...big, size: sa })
      txt(ctx, tujuan, 530, mid(st), { ...big, size: st, align: 'right' })
      const lx = 70 + (asal ? wa + 14 : 0)
      const lw = 530 - (tujuan ? wt + 14 : 0) - lx
      ctx.save()
      ctx.beginPath()
      ctx.rect(lx, 142, lw, 4)
      ctx.clip()
      ctx.fillStyle = INK
      for (let x = lx; x < lx + lw; x += 18) ctx.fillRect(x, 142, 10, 4)
      ctx.restore()
      disc(ctx, Math.round(lx + lw * 0.3), 135, 18, INK)
      disc(ctx, Math.round(lx + lw * 0.65), 135, 18, INK)

      const info = { family: MONO, size: 15, color: INK }
      txt(ctx, 'GERBONG 3', 70, 190, info)
      txt(ctx, 'KURSI 12A', 277, 190, info)
      txt(ctx, '06:15', 530, 190, { ...info, align: 'right' })
      dashedH(ctx, 70, 230, 460, 3, INK, [6, 3])

      dashedH(ctx, 70, 1461, 460, 3, INK, [6, 3])
      txt(ctx, texts.tanggal?.trim() ?? '', 70, 1702, { ...info, maxWidth: 300 })
      txt(ctx, 'KODE: 7KJ2Q', 530, 1702, { ...info, align: 'right' })

      // lubang sobekan di tepi
      disc(ctx, 28, 720, 28, BG)
      disc(ctx, 544, 1240, 28, BG)
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s)
    },
    top(ctx) {
      // di desain sesudah div tekstur (tidak kena noise)
      // ikon kereta (svg 100x40)
      ctx.save()
      ctx.translate(440, 44)
      ctx.fillStyle = INK
      ctx.beginPath()
      ctx.roundRect(4, 6, 70, 22, 6)
      ctx.roundRect(74, 12, 20, 16, 4)
      for (const cx of [18, 60, 84]) {
        ctx.moveTo(cx + 5, 33)
        ctx.arc(cx, 33, 5, 0, Math.PI * 2)
      }
      ctx.fill()
      ctx.fillStyle = PAPER
      for (const x of [12, 30, 48]) ctx.fillRect(x, 11, 12, 9)
      ctx.restore()
    },
  },
})
