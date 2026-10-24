// Zine Fotokopian — design-reference/kalcer/zine-fotokopian.html (1200x1800, 4 foto)
import { border, box, contentHeight, linear, text } from '../paint'
import { ANTON, MONO, TEXTURE, disc, fauxItalic, join, monthName, rotated, yearOf } from './helpers'
import { kalcer } from './define'

const INK = '#141414'
const PAPER = '#ECEBE6'
const ACCENT = '#FF4FA3'
const SERIF = 'DM Serif Display'

/** huruf potongan "ZINE NO.07": kotak (padding 6px 14px, line-height 1) hasil ukur, rotate di titik tengah */
const LETTERS: { ch: string; bg: string; fg: string; font: string; size: number; rot: number; x: number; w: number; h: number }[] = [
  { ch: 'Z', bg: INK, fg: PAPER, font: ANTON, size: 88, rot: -4, x: 70.05, w: 64, h: 100 },
  { ch: 'I', bg: PAPER, fg: INK, font: SERIF, size: 96, rot: 3, x: 142.05, w: 57, h: 108 },
  { ch: 'N', bg: ACCENT, fg: INK, font: ANTON, size: 83, rot: -2, x: 207.2, w: 69, h: 95 },
  { ch: 'E', bg: '#ffffff', fg: INK, font: MONO, size: 76, rot: 5, x: 284.15, w: 75, h: 88 },
  { ch: 'N', bg: INK, fg: PAPER, font: SERIF, size: 80, rot: -3, x: 367, w: 80, h: 92 },
  { ch: 'O', bg: '#ffffff', fg: INK, font: ANTON, size: 88, rot: 2, x: 455, w: 71, h: 100 },
  { ch: '.', bg: PAPER, fg: INK, font: SERIF, size: 76, rot: 0, x: 533.9, w: 50.8, h: 88 },
  { ch: '0', bg: ACCENT, fg: INK, font: MONO, size: 83, rot: -5, x: 592.6, w: 79, h: 95 },
  { ch: '7', bg: INK, fg: PAPER, font: ANTON, size: 94, rot: 4, x: 679.75, w: 74, h: 106 },
]
const LETTER_BOTTOM = 271

/** kotak foto 508x578 (grid 2 kolom) dengan kemiringan + selotip di tepi atas */
const PHOTOS = [
  { x: 70, y: 370, tilt: -1.5, tapeX: 32, tapeRot: -6 },
  { x: 622, y: 370, tilt: 1.2, tapeX: 240, tapeRot: 5 },
  { x: 70, y: 992, tilt: 1, tapeX: 144, tapeRot: -3 },
  { x: 622, y: 992, tilt: -1.8, tapeX: 48, tapeRot: 7 },
]

export const zineFotokopian = kalcer({
  id: 'kalcer-zine-fotokopian',
  name: 'zine fotokopian',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: PAPER },
  placeholder: '#CFCDC6',
  fonts: ['Anton', 'DM Serif Display', 'Space Mono:400,700'],
  fields: ['nama', 'tanggal'],
  texture: TEXTURE,
  slots: PHOTOS.map((p) => ({ x: p.x, y: p.y, w: 508, h: 578, rotate: p.tilt })),
  draw: {
    under(ctx, { texts }) {
      for (const l of LETTERS) {
        const y = LETTER_BOTTOM - l.h
        rotated(ctx, l.x + l.w / 2, y + l.h / 2, l.rot, () => {
          box(ctx, l.x, y, l.w, l.h, l.bg)
          text(ctx, l.ch, l.x + l.w / 2, y + 6 + (l.size - contentHeight(ctx, l.font, l.size)) / 2, { family: l.font, size: l.size, color: l.fg, align: 'center' })
        })
      }
      box(ctx, 70, 289, 131.7, 41, ACCENT)
      text(ctx, 'edisi 07', 82, 293, { family: MONO, size: 22, weight: 700, color: INK })
      text(ctx, 'terbit tidak tentu', 217.7, 296.5, { family: MONO, size: 18, color: INK })

      // footer: hal. 07 / [NAMA GENG] · bulan tahun (dari tanggal)
      text(ctx, join(['hal. 07', texts.nama], ' / '), 70, 1704, { family: MONO, size: 18, color: INK, maxWidth: 560 })
      const bulan = join([monthName(texts.tanggal), yearOf(texts.tanggal)], ' ')
      fauxItalic(ctx, bulan, 1130, 1684, { family: SERIF, size: 34, color: INK, align: 'right', maxWidth: 440 })

      // staples
      for (const sx of [360, 760]) box(ctx, sx, 28, 80, 8, linear(ctx, sx, 28, 80, 8, 180, [[0, '#d9d9d9'], [1, '#8a8a8a']]))
      // stiker harga bulat, rotate 10°
      rotated(ctx, 1043, 163, 10, () => {
        disc(ctx, 960, 80, 166, ACCENT)
        border(ctx, 960, 80, 166, 166, 3, INK, 83)
        text(ctx, 'HARGA', 1043, 133.5, { family: MONO, size: 14, weight: 700, color: INK, align: 'center' })
        text(ctx, 'Rp 10rb', 1043, 154.5, { family: MONO, size: 26, weight: 700, color: INK, align: 'center' })
      })
    },
    over(ctx) {
      for (const p of PHOTOS)
        rotated(ctx, p.x + 254, p.y + 289, p.tilt, () => {
          border(ctx, p.x, p.y, 508, 578, 3, INK)
          const tx = p.x + p.tapeX
          const ty = p.y - 22
          rotated(ctx, tx + 75, ty + 22, p.tapeRot, () => box(ctx, tx, ty, 150, 44, 'rgba(240,232,200,0.75)'))
        })
    },
  },
})
