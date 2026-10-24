// Jendela Kereta — design-reference/travel/jendela-kereta.html (600x1800 strip, 3 foto)
// Dirapikan dari desain: jarak antarjendela & ke kedua papan sama (80px), papan biru bawah berisi rute & tanggal
// (desain asli papannya kosong dan tulisannya menggantung di bawah).
import { box, dropShadow, linear, radial, rrPath } from '../paint'
import { travel } from './define'
import { ASAL_DEFAULT, disc, FONTS_NO_HAND, insetSpread, MONO, photoInset, rute, SERIF, txt } from './helpers'

const BLUE = '#2E5E8C'
const YELLOW = '#F2D24A'
/** papan atas berakhir di 150, garis kuning bawah di 1610: 3 jendela 380px dengan 4 jarak sama 80px */
const WIN_Y = [230, 690, 1150]
const BOTTOM = 1610
const SLOTS = WIN_Y.map((y) => ({ x: 98, y: y + 18, w: 404, h: 344, radius: 26 }))

export const jendelaKereta = travel({
  id: 'travel-jendela-kereta',
  name: 'jendela kereta',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#c4ccd4' },
  placeholder: '#cfe2f2',
  fonts: FONTS_NO_HAND,
  fields: ['nama', 'tempat', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 180, [[0, '#cfd6dd'], [1, '#b9c2cb']]))
      // repeating-linear-gradient(0deg, 2px gelap / 118px bening) dari bawah
      ctx.fillStyle = 'rgba(0,0,0,0.04)'
      for (let y = H; y > 0; y -= 120) ctx.fillRect(0, y - 2, W, 2)

      // papan nama gerbong
      box(ctx, 0, 60, W, 70, BLUE)
      const nama = texts.nama?.trim()
      txt(ctx, nama ? `Kereta ${nama}` : 'Kereta', 30, 74, { family: SERIF, size: 34, weight: 700, color: '#fff', maxWidth: 420 })
      txt(ctx, 'EKS 3 · 17', 570, 84.5, { family: MONO, size: 14, weight: 700, color: '#fff', align: 'right' })
      box(ctx, 0, 140, W, 10, YELLOW)

      // jendela: bingkai hitam r40 + inset 10px abu + bayangan
      for (const y of WIN_Y) {
        dropShadow(ctx, 80, y, 440, 380, 0, 6, 10, 'rgba(0,0,0,0.35)', 40)
        box(ctx, 80, y, 440, 380, '#1a1a1a', 40)
        insetSpread(ctx, 80, y, 440, 380, 10, '#3a3a3e', 40)
      }

      box(ctx, 0, BOTTOM, W, 10, YELLOW)
      box(ctx, 0, BOTTOM + 20, W, 70, BLUE)

      // paku keling: radial-gradient(circle at 35% 30%) farthest-corner
      for (const x of [30, 560]) {
        for (let k = 0; k < 16; k++) {
          const y = 200 + k * 90
          disc(ctx, x, y, 10, radial(ctx, x + 3.5, y + 3, Math.hypot(6.5, 7), [[0, '#ffffff'], [1, '#8a8f96']]))
        }
      }

      // papan bawah: rute (atau keterangan gerbong) di kiri, tanggal di kanan
      const r = rute(texts.tempat)
      const asal = r.tujuan ? r.asal || ASAL_DEFAULT : ''
      const tgl = texts.tanggal?.trim() ?? ''
      const ty = BOTTOM + 20 + 25
      const tglW = tgl ? txt(ctx, tgl, 570, ty, { family: MONO, size: 15, weight: 700, color: '#fff', align: 'right', maxWidth: 220 }) : 0
      txt(ctx, r.tujuan ? `${asal} → ${r.tujuan}` : 'kelas ekonomi · gerbong 3', 30, ty, {
        family: MONO, size: 15, weight: 700, color: '#fff', maxWidth: 540 - tglW - (tgl ? 20 : 0),
      })

      // rel: repeating-linear-gradient(90deg, 40px / 4px)
      box(ctx, 0, 1720, W, 80, '#3a3a3e')
      ctx.fillStyle = '#2a2a2e'
      for (let x = 40; x < W; x += 44) ctx.fillRect(x, 1720, 4, 80)
    },
    over(ctx) {
      for (const s of SLOTS) {
        ctx.save()
        ctx.beginPath()
        rrPath(ctx, s.x, s.y, s.w, s.h, s.radius)
        ctx.clip()
        photoInset(ctx, s)
        // kilau kaca + bayangan atas
        box(ctx, s.x, s.y, s.w, s.h, linear(ctx, s.x, s.y, s.w, s.h, 160, [
          [0, 'rgba(255,255,255,0.3)'], [0.35, 'rgba(255,255,255,0)'], [0.7, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0.12)'],
        ]))
        box(ctx, s.x, s.y, s.w, 70, linear(ctx, s.x, s.y, s.w, 70, 180, [[0, 'rgba(40,60,90,0.45)'], [1, 'rgba(40,60,90,0)']]))
        ctx.restore()
      }
    },
  },
})
