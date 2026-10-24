// Konsol Genggam — design-reference/gaming-pixel/konsol-genggam.html (1080x1350, 1 foto)
import { border, box, dropShadow, insetShadows, linear, measure, setShadow, text, type Ctx } from '../paint'
import { PIXEL, SILK, SILK_MONO, circleGradient, insetBlur, ellipseGradient, fauxItalic, rotated } from './helpers'
import { gaming } from './define'

/** warna latar & badan desain (prop bg, c, default) */
const BG = '#E9E6DE'
const C = '#CFCCC4'
const NAVY = '#2E3A8A'
const GREY = '#6b6b74'
const LIGHT = '#d9d9e3'

/** kotak dengan box-shadow luar tanpa blur (0 dy 0 warna) */
function hardShadow(ctx: Ctx, x: number, y: number, w: number, h: number, dy: number, color: string, r: number) {
  dropShadow(ctx, x, y, w, h, 0, dy, 0, color, r)
}

/** tombol bulat A/B: radial-gradient(circle at 35% 30%, #d0508a, #A0285A 55%, #6a1438) + 0 6px 0 #4a0e28, 0 10px 12px */
function button(ctx: Ctx, x: number, y: number) {
  dropShadow(ctx, x, y, 100, 100, 0, 10, 12, 'rgba(0,0,0,0.3)', 50)
  hardShadow(ctx, x, y, 100, 100, 6, '#4a0e28', 50)
  box(ctx, x, y, 100, 100, circleGradient(ctx, x, y, 100, 100, 0.35, 0.3, [[0, '#d0508a'], [0.55, '#A0285A'], [1, '#6a1438']]), 50)
}

function screw(ctx: Ctx, x: number, y: number) {
  box(ctx, x, y, 18, 18, circleGradient(ctx, x, y, 18, 18, 0.35, 0.3, [[0, '#d9d6cf'], [1, '#8a877f']]), 9)
  border(ctx, x, y, 18, 18, 1, 'rgba(0,0,0,0.3)', 9)
  box(ctx, x + 3, y + 8, 12, 2, '#555555')
}

export const konsolGenggam = gaming({
  id: 'gaming-konsol-genggam',
  name: 'konsol genggam',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  placeholder: '#BDD3A3', // #9BB46A setelah filter desain
  // desain: filter grayscale(0.8) sepia(0.6) hue-rotate(40deg) contrast(1.2) di kotak FOTO → preset terdekat
  filter: 'sepia',
  fonts: ['Press Start 2P', 'Silkscreen', 'Space Mono:400,700'],
  fields: ['nama', 'catatan'],
  slots: [{ x: 290, y: 234, w: 500, h: 474 }],
  draw: {
    under(ctx, { texts, W, H }) {
      ellipseGradient(ctx, 0, 0, W, H, 0.5, 0.35, [[0, '#fbfaf7'], [0.7, BG], [1, BG]])

      // kartrid yang tertancap
      box(ctx, 230, 40, 620, 90, linear(ctx, 230, 40, 620, 90, 180, [[0, '#5a5a66'], [1, '#3a3a44']]), [10, 10, 0, 0])
      border(ctx, 230, 40, 620, 90, 3, 'rgba(0,0,0,0.3)', [10, 10, 0, 0])
      box(ctx, 330, 58, 420, 40, '#EDEAE4', 6)
      // [JUDUL GAME] = catatan
      text(ctx, texts.catatan?.trim() || 'KENANGAN', 540, 71, { family: PIXEL, size: 14, color: '#2b2b3a', align: 'center', maxWidth: 400 })

      // badan konsol
      const R: [number, number, number, number] = [34, 34, 150, 34]
      dropShadow(ctx, 160, 110, 760, 1160, 0, 30, 46, 'rgba(0,0,0,0.3)', R)
      box(ctx, 160, 110, 760, 1160, C, R)
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(160, 110, 760, 1160, R)
      ctx.clip()
      // repeating-linear-gradient(0deg, gelap 0.015 0 2px, transparan 2px 4px) dari bawah
      ctx.fillStyle = 'rgba(0,0,0,0.015)'
      for (let y = 110 + 1160 - 2; y > 108; y -= 4) ctx.fillRect(160, y, 760, 2)
      ctx.restore()
      box(ctx, 160, 110, 760, 1160, circleGradient(ctx, 160, 110, 760, 1160, 0.3, 0.15, [[0, 'rgba(255,255,255,0.35)'], [0.4, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']]), R)
      insetShadows(ctx, 160, 110, 760, 1160, [
        { dx: -12, dy: -16, color: 'rgba(0,0,0,0.12)' },
        { dx: 6, dy: 6, color: 'rgba(255,255,255,0.5)' },
      ], R)

      box(ctx, 160, 156, 760, 3, 'rgba(0,0,0,0.12)')
      text(ctx, '◀ OFF · ON ▶', 200, 129, { family: SILK_MONO, size: 13, color: GREY })

      // bingkai layar
      const BR: [number, number, number, number] = [22, 22, 80, 22]
      box(ctx, 210, 190, 660, 560, linear(ctx, 210, 190, 660, 560, 180, [[0, '#6e6e80'], [1, '#5a5a6c']]), BR)
      insetBlur(ctx, 210, 190, 660, 560, 0, 3, 6, 'rgba(0,0,0,0.4)', BR)
      box(ctx, 230, 209.5, 335.8, 3, '#A0285A')
      text(ctx, 'LAYAR TITIK · SUARA STEREO', 575.8, 204, { family: SILK, size: 11, color: LIGHT })
      box(ctx, 770, 209.5, 80, 3, '#2E5BA0')
      // lampu daya + glow 0 0 10px
      ctx.save()
      setShadow(ctx, 0, 0, 10, '#ff3b5c')
      box(ctx, 240.6, 390, 14, 14, '#ff3b5c', 7)
      ctx.restore()
      text(ctx, 'DAYA', 232, 410, { family: SILK, size: 10, color: LIGHT })
      // LCD
      box(ctx, 280, 224, 520, 496, '#8BA05A')
      insetBlur(ctx, 280, 224, 520, 496, 0, 4, 10, 'rgba(0,0,0,0.45)')

      // merek: [NAMA] (italic sintetis) + " SAKU"
      const nama = texts.nama?.trim() || 'BILIK'
      const big = { family: PIXEL, size: 22, color: NAVY }
      const nw = Math.min(measure(ctx, nama, big), 560)
      fauxItalic(ctx, nama, 220, 770, { ...big, maxWidth: 560 })
      text(ctx, ' SAKU', 220 + nw, 780, { family: PIXEL, size: 12, color: GREY })

      // d-pad
      box(ctx, 220, 870, 200, 200, 'rgba(0,0,0,0.08)', 100)
      insetBlur(ctx, 220, 870, 200, 200, 0, 3, 6, 'rgba(0,0,0,0.2)', 100)
      hardShadow(ctx, 290, 880, 60, 180, 4, '#111111', 8)
      box(ctx, 290, 880, 60, 180, linear(ctx, 290, 880, 60, 180, 90, [[0, '#1f1f28'], [0.5, '#3a3a46'], [1, '#1f1f28']]), 8)
      hardShadow(ctx, 230, 940, 180, 60, 4, '#111111', 8)
      box(ctx, 230, 940, 180, 60, linear(ctx, 230, 940, 180, 60, 180, [[0, '#3a3a46'], [1, '#1f1f28']]), 8)
      box(ctx, 306, 956, 28, 28, circleGradient(ctx, 306, 956, 28, 28, 0.5, 0.5, [[0, '#1a1a22'], [1, '#2a2a34']]), 14)

      // tombol A/B: grup 260x170 di (610, 870), rotate(-25deg)
      rotated(ctx, 740, 955, -25, () => {
        box(ctx, 600, 890, 280, 120, 'rgba(0,0,0,0.08)', 60)
        insetBlur(ctx, 600, 890, 280, 120, 0, 3, 6, 'rgba(0,0,0,0.2)', 60)
        button(ctx, 620, 900)
        button(ctx, 760, 900)
      })
      // huruf diputar balik +25deg → tegak
      text(ctx, 'B', 695.9, 1040, { family: PIXEL, size: 16, color: NAVY })
      text(ctx, 'A', 822.8, 980.8, { family: PIXEL, size: 16, color: NAVY })

      // PILIH / MULAI: kolom 90x52, rotate(-25deg) di tengahnya
      ;[
        [390, 'PILIH'],
        [530, 'MULAI'],
      ].forEach(([x0, label]) => {
        const x = x0 as number
        rotated(ctx, x + 45, 1146, -25, () => {
          hardShadow(ctx, x, 1120, 90, 24, 3, '#3a3a44', 12)
          box(ctx, x, 1120, 90, 24, linear(ctx, x, 1120, 90, 24, 180, [[0, '#8a8a96'], [1, '#5a5a66']]), 12)
          text(ctx, label as string, x + 45, 1156, { family: SILK, size: 13, color: NAVY, align: 'center' })
        })
      })

      // kisi speaker: 6 batang 12x110, rotate(-28deg)
      for (let i = 0; i < 6; i++) {
        const x = 700 + i * 26
        rotated(ctx, x + 6, 1155, -28, () => {
          box(ctx, x, 1100, 12, 110, '#8a877f', 6)
          insetBlur(ctx, x, 1100, 12, 110, 0, 3, 4, 'rgba(0,0,0,0.5)', 6)
        })
      }

      screw(ctx, 190, 1210)
      screw(ctx, 872, 670)
    },
    over(ctx) {
      // kisi titik LCD di atas foto: garis 1px tiap 3px (0deg dari bawah, 90deg dari kiri)
      ctx.fillStyle = 'rgba(0,0,0,0.07)'
      for (let y = 234 + 476 - 1; y >= 234; y -= 3) ctx.fillRect(290, y, 500, 1)
      for (let x = 290; x < 790; x += 3) ctx.fillRect(x, 234, 1, 476)
    },
  },
})
