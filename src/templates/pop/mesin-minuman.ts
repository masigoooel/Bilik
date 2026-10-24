// Mesin Minuman — design-reference/bold-pop/mesin-minuman.html (1200x1800, 6 foto)
import { box, dropShadow, insetShadows, linear, rrPath, text, type Ctx } from '../paint'
import { ARCHIVO, BANGERS, INK, MONO, insetRing, photoInset, pmStops } from './helpers'
import { pop } from './define'

const C = '#E23A3A'
const METAL: [number, string][] = [[0, '#f4f6f8'], [0.3, '#b9c0c8'], [0.5, '#6f777f'], [0.7, '#d9dee3'], [1, '#8f969d']]
/** kaleng 190x260 di etalase 3 kolom x 2 baris; foto 166x170 di dalamnya */
const CANS = ['#FF3B30', '#3F7BFF', '#18C27A', '#FFD600', '#FF8FD1', '#FF8A1F'].map((color, i) => ({
  color,
  x: 186 + (i % 3) * 200,
  y: 306 + Math.floor(i / 3) * 493,
}))
const SLOTS = CANS.map((c) => ({ x: c.x + 12, y: c.y + 40, w: 166, h: 170, radius: 6 }))
/** tetes embun di kaca etalase (relatif ke kaca 150,230): [left, top, w, h] */
const DROPS = [[129,859,4,5],[499,754,8,10],[596,699,5,6],[349,435,9,12],[397,424,9,12],[600,482,5,6],[217,387,7,9],[223,433,7,9],[422,796,10,13],[259,968,10,13],[311,841,9,12],[85,574,7,9],[100,960,7,9],[440,477,7,9],[228,590,10,13],[241,111,6,8],[593,486,5,6],[465,688,5,6],[330,576,8,10],[401,829,10,13],[197,659,6,8],[494,731,10,13],[390,501,7,9],[247,722,5,6],[393,495,10,13],[401,100,5,6],[464,223,7,9],[564,939,10,13],[353,263,4,5],[573,634,10,13]]
const KEYS = ['A', 'B', 'C', '1', '2', '3', '4', '5', '6', '✕', '0', 'OK']

/** teks Bangers ber-letter-spacing dengan -webkit-text-stroke (paint-order: stroke fill), tetap ber-kerning */
function strokedSpaced(ctx: Ctx, s: string, x: number, y: number, size: number, ls: number, fill: string, stroke: number) {
  ctx.save()
  ctx.font = `400 ${size}px "${BANGERS}", sans-serif`
  ctx.letterSpacing = `${ls}px`
  ctx.textBaseline = 'alphabetic'
  const base = y + ctx.measureText('Hg').fontBoundingBoxAscent
  ctx.lineJoin = 'round'
  ctx.lineWidth = stroke
  ctx.strokeStyle = INK
  ctx.strokeText(s, x, base)
  ctx.fillStyle = fill
  ctx.fillText(s, x, base)
  ctx.restore()
}

export const mesinMinuman = pop({
  id: 'pop-mesin-minuman',
  name: 'mesin minuman',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#d9d6cf' },
  placeholder: '#F4F2EC',
  fonts: ['Bangers', 'Archivo Black', 'Space Mono:400,700'],
  fields: ['nama'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      // lantai: ubin repeating-linear-gradient(90deg, #b9b5ad 0 148px, #9a968e 148px 150px)
      box(ctx, 0, 1440, 1200, 360, '#b9b5ad')
      ctx.fillStyle = '#9a968e'
      for (let x = 148; x < 1200; x += 150) ctx.fillRect(x, 1440, 2, 360)

      // badan mesin
      dropShadow(ctx, 120, 60, 960, 1560, 0, 40, 60, 'rgba(0,0,0,0.35)', 18)
      box(ctx, 120, 60, 960, 1560, linear(ctx, 120, 60, 960, 1560, 90, [[0, '#9e1e1e'], [0.08, C], [0.92, C], [1, '#9e1e1e']]), 18)
      insetShadows(ctx, 120, 60, 960, 1560, [{ dx: 0, dy: 3, color: 'rgba(255,255,255,0.3)' }], 18)

      // papan judul
      dropShadow(ctx, 150, 86, 900, 120, 0, 0, 30, 'rgba(255,255,255,0.6)', 10)
      box(ctx, 150, 86, 900, 120, linear(ctx, 150, 86, 900, 120, 180, [[0, '#ffffff'], [1, '#f1f1f1']]), 10)
      insetRing(ctx, 150, 86, 900, 120, 4, 'rgba(0,0,0,0.15)', 10)
      strokedSpaced(ctx, 'DINGIN!', 403.4, 98.5, 90, 3.6, C, 3)
      text(ctx, 'minuman', 674.4, 118.8, { family: ARCHIVO, size: 22, color: INK })
      text(ctx, '& camilan', 674.4, 143, { family: ARCHIVO, size: 22, color: INK })

      // etalase kaca
      box(ctx, 150, 230, 650, 1060, '#2a2a30', 8)
      insetRing(ctx, 150, 230, 650, 1060, 12, '#6f777f', 8)
      insetRing(ctx, 150, 230, 650, 1060, 10, '#c9ced6', 8)
      box(ctx, 172, 252, 606, 1016, linear(ctx, 172, 252, 606, 1016, 180, [[0, '#3a3a44'], [1, '#24242a']]))
      const sheen = pmStops([[0, 'rgba(0,0,0,0.18)'], [0.28, 'rgba(255,255,255,0.35)'], [0.55, 'rgba(0,0,0,0.04)'], [1, 'rgba(0,0,0,0.22)']])
      CANS.forEach((c, i) => {
        const r: [number, number, number, number] = [12, 12, 6, 6]
        dropShadow(ctx, c.x, c.y, 190, 260, 0, 6, 8, 'rgba(0,0,0,0.35)', r)
        box(ctx, c.x, c.y, 190, 260, c.color, r)
        box(ctx, c.x, c.y, 190, 260, linear(ctx, c.x, c.y, 190, 260, 90, sheen), r)
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        for (let x = 0; x < 190; x += 10) ctx.fillRect(c.x + x, c.y + 16, Math.min(6, 190 - x), 14)
        // bingkai putih foto (box-shadow 0 0 0 3px #fff, radius 6)
        box(ctx, c.x + 9, c.y + 37, 172, 176, '#ffffff', 9)
        // rel spiral: transparan 0-10, #c9ced6 10-13, #6f777f 13-15, transparan 15-22
        const rx = c.x + 10
        const ry = c.y + 264
        ctx.save()
        ctx.beginPath()
        rrPath(ctx, rx, ry, 170, 26, 4)
        ctx.clip()
        for (let x = 0; x < 170; x += 22) {
          ctx.fillStyle = '#c9ced6'
          ctx.fillRect(rx + x + 10, ry, 3, 26)
          ctx.fillStyle = '#6f777f'
          ctx.fillRect(rx + x + 13, ry, 2, 26)
        }
        ctx.restore()
        // label harga
        box(ctx, c.x - 4.8 + 50, c.y + 270, 99.6, 26, '#111111', 3)
        text(ctx, `A${i + 1} · 8.000`, c.x + 95, c.y + 273, { family: MONO, size: 13, weight: 700, color: '#6fff8f', align: 'center' })
      })
      box(ctx, 172, 760, 606, 10, linear(ctx, 172, 760, 606, 10, 180, [[0, '#c9ced6'], [1, '#6f777f']]))

      // panel kanan
      box(ctx, 830, 230, 220, 1060, linear(ctx, 830, 230, 220, 1060, 180, [[0, '#2a2a30'], [1, '#1a1a20']]), 8)
      insetRing(ctx, 830, 230, 220, 1060, 4, '#555555', 8)
      box(ctx, 850, 250, 180, 80, '#0a1a0a', 6)
      insetRing(ctx, 850, 250, 180, 80, 3, '#444444', 6)
      text(ctx, 'PILIH', 1018, 259.5, { family: MONO, size: 11, color: '#6fff8f', align: 'right' })
      text(ctx, 'A4', 1018, 275.5, { family: MONO, size: 30, weight: 700, color: '#6fff8f', align: 'right' })
      const kw = 54.666
      KEYS.forEach((k, i) => {
        const x = 850 + (i % 3) * (kw + 8)
        const y = 348 + Math.floor(i / 3) * 54
        dropShadow(ctx, x, y, kw, 46, 0, 3, 0, '#6f777f', 6)
        box(ctx, x, y, kw, 46, linear(ctx, x, y, kw, 46, 180, [[0, '#f4f6f8'], [1, '#b9c0c8']]), 6)
        text(ctx, k, x + kw / 2, y + 10, { family: MONO, size: 18, weight: 700, color: '#2a2a2e', align: 'center' })
      })
      dropShadow(ctx, 850, 574, 180, 120, 0, 3, 4, 'rgba(0,0,0,0.4)', 8)
      box(ctx, 850, 574, 180, 120, linear(ctx, 850, 574, 180, 120, 180, METAL), 8)
      box(ctx, 934, 591, 12, 60, '#111111', 4)
      text(ctx, 'KOIN', 940, 661, { family: MONO, size: 11, weight: 700, color: '#2a2a2e', align: 'center' })
      box(ctx, 850, 712, 180, 80, linear(ctx, 850, 712, 180, 80, 180, METAL), 8)
      box(ctx, 880, 747, 120, 10, '#111111', 4)
      text(ctx, 'kartu · uang kertas · koin', 940, 810, { family: MONO, size: 11, color: '#9a9aa8', align: 'center' })
      box(ctx, 850, 1180, 180, 90, '#111111', 8)
      insetShadows(ctx, 850, 1180, 180, 90, [{ dx: 0, dy: 6, blur: 10, color: 'rgba(0,0,0,0.8)' }], 8)
      text(ctx, 'kembalian', 940, 1217, { family: MONO, size: 11, color: '#9a9aa8', align: 'center' })

      // pintu ambil
      box(ctx, 150, 1320, 650, 190, '#1a1a20', 10)
      insetRing(ctx, 150, 1320, 650, 190, 6, '#555555', 10)
      box(ctx, 180, 1350, 590, 120, linear(ctx, 180, 1350, 590, 120, 180, [[0, 'rgba(255,255,255,0.25)'], [1, 'rgba(255,255,255,0.05)']]), 8)
      insetRing(ctx, 180, 1350, 590, 120, 3, 'rgba(255,255,255,0.3)', 8)
      text(ctx, 'DORONG', 475, 1398, { family: MONO, size: 16, color: '#dddddd', align: 'center' })

      // [NAMA] + keterangan (kolom di tengah vertikal); tanpa nama keterangan saja
      const nama = texts.nama?.trim() ?? ''
      if (nama) text(ctx, nama, 940, 1386, { family: ARCHIVO, size: 26, color: '#ffffff', align: 'center', maxWidth: 210 })
      text(ctx, '6 rasa · 24 jam', 940, nama ? 1427 : 1406.5, { family: MONO, size: 12, color: '#ffffff', align: 'center' })

      // kaki
      box(ctx, 180, 1620, 60, 30, '#333333', [0, 0, 6, 6])
      box(ctx, 960, 1620, 60, 30, '#333333', [0, 0, 6, 6])
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s)
      // pantulan kaca + embun (menimpa foto)
      box(ctx, 172, 252, 606, 1016, linear(ctx, 172, 252, 606, 1016, 115, [[0, 'rgba(255,255,255,0.22)'], [0.3, 'rgba(255,255,255,0.03)'], [0.55, 'rgba(255,255,255,0)'], [0.75, 'rgba(255,255,255,0.08)'], [0.85, 'rgba(255,255,255,0)']]))
      for (const [l, t, w, h] of DROPS) {
        const x = 150 + l
        const y = 230 + t
        const g = ctx.createRadialGradient(x + 0.35 * w, y + 0.3 * h, 0, x + 0.35 * w, y + 0.3 * h, Math.hypot(0.65 * w, 0.7 * h))
        g.addColorStop(0, 'rgba(255,255,255,0.7)')
        g.addColorStop(0.6, 'rgba(255,255,255,0.05)')
        ctx.beginPath()
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }
    },
  },
})
