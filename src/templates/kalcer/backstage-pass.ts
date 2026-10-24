// Backstage Pass — design-reference/kalcer/backstage-pass.html (1080x1350, 1 foto)
import { border, box, dropShadow, linear, rrPath, text } from '../paint'
import { ANTON, MARKER, MONO, barcode, ellipseGlow, photoInset, rotated, yearOf } from './helpers'
import { kalcer } from './define'

const BG = '#2a2a2a'
const C = '#E8553D'
const INK = '#1c1b19'
const PAPER = '#F4EFE3'
const MUTED = '#6b6255'
const ZONES: [string, number, boolean][] = [
  ['PANGGUNG', 278, true],
  ['BACKSTAGE', 411, true],
  ['GREEN ROOM', 544, true],
  ['FOH', 677, false],
]

export const backstagePass = kalcer({
  id: 'kalcer-backstage-pass',
  name: 'backstage pass',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  // #d8d0b8 sesudah grayscale(1) contrast(1.15) = #dcdcdc (hasil ukur)
  placeholder: '#dcdcdc',
  // kotak FOTO di desain: filter grayscale(1) contrast(1.15) → foto hitam putih
  filter: 'mono',
  fonts: ['Anton', 'Space Mono:400,700', 'Permanent Marker'],
  fields: ['nama', 'nama2', 'tanggal'],
  slots: [{ x: 278, y: 502, w: 260, h: 330 }],
  draw: {
    under(ctx, { texts, W, H }) {
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 160, [[0, BG], [1, '#1a1a1a']]))
      // cahaya panggung: radial-gradient(ellipse at 70% 15% / 20% 80%, warna, transparent 45%)
      ellipseGlow(ctx, 0, 0, W, H, 0.7, 0.15, [255, 80, 60], 0.25)
      ellipseGlow(ctx, 0, 0, W, H, 0.2, 0.8, [60, 120, 255], 0.18)

      // tali lanyard: repeating-linear-gradient(0deg, #111 0 30px, c 30px 60px), diputar di sisi bawah
      for (const [x, deg] of [[420, -14], [610, 14]] as const)
        rotated(ctx, x + 25, 260, deg, () => {
          for (let i = 0; i < 10; i++) box(ctx, x, 260 - 30 * (i + 1), 50, 30, i % 2 ? C : '#111111')
        })

      // penjepit logam
      dropShadow(ctx, 495, 220, 90, 60, 0, 4, 6, 'rgba(0,0,0,0.5)', 10)
      box(ctx, 495, 220, 90, 60, linear(ctx, 495, 220, 90, 60, 180, [[0, '#f4f6f8'], [0.3, '#b9c0c8'], [0.5, '#6f777f'], [0.7, '#d9dee3'], [1, '#8f969d']]), 10)
      border(ctx, 515, 238, 50, 32, 5, '#6f777f', 11)

      // kartu plastik bening
      dropShadow(ctx, 230, 290, 620, 960, 0, 30, 50, 'rgba(0,0,0,0.6)', 26)
      box(ctx, 230, 290, 620, 960, linear(ctx, 230, 290, 620, 960, 115, [[0, 'rgba(255,255,255,0.35)'], [0.35, 'rgba(255,255,255,0.08)'], [1, 'rgba(255,255,255,0.15)']]), 26)
      ctx.beginPath()
      rrPath(ctx, 230, 290, 620, 960, 26)
      rrPath(ctx, 233, 293, 614, 954, 23)
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.fill('evenodd')

      // isi pass (overflow hidden, radius 14)
      ctx.save()
      ctx.beginPath()
      rrPath(ctx, 248, 308, 584, 924, 14)
      ctx.clip()
      box(ctx, 248, 308, 584, 924, PAPER)
      box(ctx, 248, 308, 584, 168, C)
      ctx.restore()
      text(ctx, 'ALL ACCESS', 278, 354.6, { family: ANTON, size: 86, color: '#ffffff', maxWidth: 524 })
      // lubang slot di atas kartu
      box(ctx, 500, 314, 80, 18, 'rgba(0,0,0,0.6)', 9)

      // data pemegang pass
      const label = { family: MONO, size: 11, color: MUTED }
      const value = { family: MONO, size: 14, weight: 700, color: INK, maxWidth: 242 }
      const nama = texts.nama?.trim()
      if (nama) {
        text(ctx, 'NAMA', 560, 502, label)
        text(ctx, nama, 560, 521, { family: MARKER, size: 32, color: INK, maxWidth: 242 })
      }
      text(ctx, 'PERAN', 560, 570, label)
      text(ctx, 'kru panggung', 560, 596, value)
      text(ctx, 'TUR', 560, 627, label)
      const tur = [texts.nama2?.trim(), yearOf(texts.tanggal)].filter(Boolean).join(' ')
      text(ctx, tur || 'tur kecil-kecilan', 560, 653, value)

      // akses area
      for (const [z, x, on] of ZONES) {
        if (on) box(ctx, x, 856, 125, 55, INK)
        border(ctx, x, 856, 125, 55, 2, INK)
        text(ctx, z, x + 62.5, 868, { family: ANTON, size: 20, color: on ? PAPER : INK, align: 'center' })
      }

      barcode(ctx, 278, 1136, 220, 50, INK)

      // stiker hologram: conic-gradient + inset 0 0 0 6px putih .5, opacity .8 (dihitung per area supaya sama dengan opacity grup)
      const conic = ctx.createConicGradient(-Math.PI / 2, 757, 1161)
      ;['#ff9acd', '#9ad6ff', '#c8ff9a', '#ffe59a', '#ff9acd'].forEach((c, i) => conic.addColorStop(i / 4, c))
      ctx.save()
      ctx.beginPath()
      ctx.arc(757, 1161, 45, 0, Math.PI * 2)
      ctx.arc(757, 1161, 39, 0, Math.PI * 2)
      ctx.globalAlpha = 2 / 3
      ctx.fillStyle = '#ffffff'
      ctx.fill('evenodd')
      ctx.restore()
      ctx.save()
      ctx.beginPath()
      ctx.arc(757, 1161, 39, 0, Math.PI * 2)
      ctx.globalAlpha = 0.8
      ctx.fillStyle = conic
      ctx.fill()
      ctx.beginPath()
      ctx.arc(757, 1161, 45, 0, Math.PI * 2)
      ctx.arc(757, 1161, 39, 0, Math.PI * 2)
      ctx.globalAlpha = 0.4
      ctx.fill('evenodd')
      ctx.restore()
    },
    over(ctx) {
      photoInset(ctx, 278, 502, 260, 330)
    },
  },
})
