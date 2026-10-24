// Boarding Pass — design-reference/travel/boarding-pass.html (600x1800 strip, 4 foto)
import { box } from '../paint'
import { travel } from './define'
import { dashedH, disc, FONTS_NO_HAND, INK, kodeKota, lineTop, MONO, photoInset, rute, SERIF, TEXTURE, txt, width } from './helpers'

const BG = '#2E5E8C'
const ACCENT = '#E37B3C'
const SLOTS = [0, 1, 2, 3].map((i) => ({ x: 70, y: 272 + i * 310, w: 460, h: 290 }))
const BARS = [6, 2, 4, 8, 2, 6, 2, 4, 4, 2, 8, 2, 6, 4, 2, 4, 8, 2, 4, 6, 2]

export const boardingPass = travel({
  id: 'travel-boarding-pass',
  name: 'boarding pass',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: BG },
  placeholder: '#E4E8EE',
  fonts: FONTS_NO_HAND,
  fields: ['tempat', 'tanggal'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      box(ctx, 40, 40, 520, 1720, '#FFFFFF', 16)
      const head = { family: MONO, size: 14, weight: 700, color: INK }
      txt(ctx, 'BOARDING PASS', 70, 74, head)
      txt(ctx, 'PB 017 · KELAS 1', 530, 74, { ...head, align: 'right' })

      // kode bandara: dari tempat ("jakarta → bali" / "bali"), kosong → CGK → DPS seperti desain
      const r = rute(texts.tempat)
      const to = kodeKota(r.tujuan) || 'DPS'
      const from = kodeKota(r.asal) || 'CGK'
      const big = { family: SERIF, size: 64, weight: 700, color: INK }
      const top = lineTop(ctx, SERIF, 64, 1, 115, 700)
      const wl = txt(ctx, from, 70, top, big)
      const wr = width(ctx, to, big)
      txt(ctx, to, 530, top, { ...big, align: 'right' })
      // garis rute putus-putus 8/8 + titik di kedua ujung
      const lx = 70 + wl + 16
      const lw = 530 - wr - 16 - lx
      // Chrome membulatkan kotak latar & titik ke piksel penuh
      ctx.save()
      ctx.beginPath()
      ctx.rect(Math.round(lx), 145, Math.round(lx + lw) - Math.round(lx), 4)
      ctx.clip()
      ctx.fillStyle = ACCENT
      for (let x = Math.round(lx); x < lx + lw; x += 16) ctx.fillRect(x, 145, 8, 4)
      ctx.restore()
      disc(ctx, Math.round(lx - 6), 139, 16, ACCENT)
      disc(ctx, Math.round(lx + lw - 10), 139, 16, ACCENT)

      const label = { family: MONO, size: 13, color: INK }
      const value = { family: MONO, size: 22, weight: 700, color: INK }
      ;[['GATE', 'B7'], ['KURSI', '21A'], ['BOARDING', '07:40']].forEach(([k, v], i) => {
        const x = [70, 226.7, 383.3][i]
        txt(ctx, k, x, 199, label)
        txt(ctx, v, x, 219, value)
      })

      // sobekan
      dashedH(ctx, 70, 1600, 460, 4, INK, [8, 4])
      disc(ctx, 40, 1586, 30, BG)
      disc(ctx, 530, 1586, 30, BG)

      let bx = 70
      for (const w of BARS) {
        box(ctx, bx, 1656, w, 70, INK)
        bx += w + 2
      }
      txt(ctx, texts.tanggal?.trim() ?? '', 530, 1705, { family: MONO, size: 14, color: INK, align: 'right', maxWidth: 300 })
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s)
    },
  },
})
