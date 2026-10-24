// Billboard Kota — design-reference/bold-pop/billboard-kota.html (1080x1350, 2 foto)
import { border, box, dropShadow, linear, measure, rrPath, svg, text, type Ctx } from '../paint'
import { ARCHIVO, BANGERS, INK, MONO, parseTanggal, photoInset } from './helpers'
import { pop } from './define'

const C = '#FF3EA5'
const SLOTS = [
  { x: 86, y: 136, w: 454, h: 548 },
  { x: 540, y: 136, w: 454, h: 548 },
]
/** jendela gedung 26x34: kolom x = 30 + 56i, baris y = 1000 + 58j; angka = warna */
const WINDOW_COLORS = ['#3a3550', '#ffd27a', '#ffbf6a', '#ffe9b0']
const WINDOWS = '123300 000033 200330 110200 200203 030023 012100 323120 002032 200023 000120 320322 232101 102312 012030 010332 202300 200313 122203'.split(' ')
const BIRD = 'M1 10 Q 7 1 13 9 Q 19 1 25 10'

/** clip-path: polygon(...) dalam persen kotak x,y,w,h */
function poly(ctx: Ctx, x: number, y: number, w: number, h: number, pts: [number, number][]) {
  ctx.beginPath()
  pts.forEach(([px, py], i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, x + (px / 100) * w, y + (py / 100) * h))
  ctx.closePath()
}

/** awan: pil + box-shadow (dx dy 0 spread negatif) yang tidak tampak di bawah pilnya */
function cloud(ctx: Ctx, x: number, y: number, w: number, h: number, dx: number, dy: number, spread: number) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, 1080, 1350)
  rrPath(ctx, x, y, w, h, h / 2)
  ctx.clip('evenodd')
  box(ctx, x + dx - spread, y + dy - spread, w + 2 * spread, h + 2 * spread, 'rgba(255,220,230,0.5)', h / 2 + spread)
  ctx.restore()
  box(ctx, x, y, w, h, 'rgba(255,220,230,0.55)', h / 2)
}

export const billboardKota = pop({
  id: 'pop-billboard-kota',
  name: 'billboard kota',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: '#3a2a6a' },
  placeholder: '#F0EEE8',
  fonts: ['Bangers', 'Archivo Black', 'Space Mono:400,700'],
  fields: ['nama', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { W, H }) {
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 180, [[0, '#ff9a6a'], [0.35, '#ff7aa0'], [0.75, '#7a5cff'], [1, '#3a2a6a']]))
      cloud(ctx, 60, 60, 220, 62, 66, -22, -9)
      cloud(ctx, 420, 40, 180, 50, 54, -18, -7)
      cloud(ctx, 880, 220, 160, 45, 48, -16, -6)

      // siluet kota jauh (opacity 0.7)
      ctx.save()
      ctx.globalAlpha = 0.7
      poly(ctx, 0, 820, 1080, 160, [[0, 100], [0, 50], [5, 50], [5, 20], [9, 20], [9, 45], [15, 45], [15, 10], [18, 10], [18, 40], [30, 40], [30, 25], [36, 25], [36, 55], [48, 55], [48, 15], [52, 5], [56, 15], [56, 50], [70, 50], [70, 30], [76, 30], [76, 45], [88, 45], [88, 20], [94, 20], [94, 50], [100, 50], [100, 100]])
      ctx.fillStyle = '#5a4a8a'
      ctx.fill()
      ctx.restore()

      // matahari: radial-gradient(circle, #fff6c0, #ffd36f 60%, transparent 70%) farthest-corner
      ctx.save()
      ctx.beginPath()
      ctx.arc(840, 200, 80, 0, Math.PI * 2)
      const sun = ctx.createRadialGradient(840, 200, 0, 840, 200, 80 * Math.SQRT2)
      sun.addColorStop(0, '#fff6c0')
      sun.addColorStop(0.6, '#ffd36f')
      sun.addColorStop(0.7, 'rgba(255,211,111,0)')
      ctx.fillStyle = sun
      ctx.fill()
      ctx.restore()

      // gedung dekat + jendela
      box(ctx, 0, 960, 1080, 400, '#2a2440')
      WINDOWS.forEach((col, i) => [...col].forEach((k, j) => box(ctx, 30 + 56 * i, 1000 + 58 * j, 26, 34, WINDOW_COLORS[+k])))
      poly(ctx, 0, 900, 1080, 80, [[0, 100], [0, 40], [8, 40], [8, 0], [22, 0], [22, 50], [40, 50], [40, 20], [60, 20], [60, 60], [78, 60], [78, 10], [92, 10], [92, 50], [100, 50], [100, 100]])
      ctx.fillStyle = '#3a3058'
      ctx.fill()

      // tiang + jalan servis
      for (const px of [260, 800]) box(ctx, px, 700, 20, 300, linear(ctx, px, 700, 20, 300, 90, [[0, '#3a3a44'], [0.5, '#6a6a74'], [1, '#3a3a44']]))
      ctx.fillStyle = '#3a3a44'
      for (let x = 240; x < 840; x += 20) ctx.fillRect(x, 690, 8, 22)
      box(ctx, 240, 690, 600, 4, '#3a3a44')
      box(ctx, 240, 708, 600, 4, '#3a3a44')

      // papan: bingkai gelap + isi kuning
      dropShadow(ctx, 70, 120, 940, 580, 0, 20, 40, 'rgba(0,0,0,0.4)')
      box(ctx, 70, 120, 940, 580, '#2a2a30')
      box(ctx, 86, 136, 908, 548, '#FFE45C')
    },
    over(ctx, { texts }) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(86, 136, 908, 548)
      ctx.clip()
      for (const s of SLOTS) photoInset(ctx, s)
      box(ctx, 86, 534, 908, 150, linear(ctx, 86, 534, 908, 150, 180, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.6)']]))

      // [NAMA]! putih (stroke 3px, text-shadow 6px 6px warna c dari bentuk isi, menimpa stroke) + pil tanggal, rata bawah
      const tgl = texts.tanggal?.trim() ?? ''
      const p = parseTanggal(tgl)
      const date = p ? `${String(p.d).padStart(2, '0')}.${String(p.m).padStart(2, '0')}` : tgl
      let pillW = 0
      if (date) {
        const tw = Math.min(300, measure(ctx, date, { family: ARCHIVO, size: 22 }))
        pillW = tw + 28
        box(ctx, 968 - pillW, 618, pillW, 46, C)
        text(ctx, date, 968 - pillW + 14, 626, { family: ARCHIVO, size: 22, color: '#ffffff', maxWidth: 300 })
      }
      const nama = texts.nama?.trim() ?? ''
      if (nama) {
        const maxW = 968 - pillW - 30 - 112
        const n = { family: BANGERS, size: 92, maxWidth: maxW }
        // urutan Chrome (paint-order: stroke fill): garis tepi, bayangan isi, isi
        text(ctx, `${nama}!`, 112, 573.2, { ...n, color: 'rgba(0,0,0,0)', stroke: { color: INK, width: 3 } })
        text(ctx, `${nama}!`, 118, 579.2, { ...n, color: C })
        text(ctx, `${nama}!`, 112, 573.2, { ...n, color: '#ffffff' })
      }
      box(ctx, 540, 136, 6, 548, INK)
      // garis sambungan lembar: repeating-linear-gradient(90deg, 5% hitam 0 2px, transparan 2px 116px)
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      for (let x = 86; x < 994; x += 116) ctx.fillRect(x, 136, 2, 548)
      ctx.restore()

      // lampu sorot
      for (const lx of [200, 500, 800]) {
        box(ctx, lx + 26, 80, 8, 30, '#3a3a44')
        box(ctx, lx, 106, 60, 24, '#4a4a54', [6, 6, 30, 30])
        ctx.save()
        poly(ctx, lx + 10, 126, 40, 80, [[20, 0], [80, 0], [100, 100], [0, 100]])
        ctx.fillStyle = linear(ctx, lx + 10, 126, 40, 80, 180, [[0, 'rgba(255,250,200,0.55)'], [1, 'rgba(255,250,200,0)']])
        ctx.fill()
        ctx.restore()
      }

      const bottom = nama ? `sewa papan ini · ${nama} reklame` : 'sewa papan ini'
      text(ctx, bottom, 540, 1290, { family: ARCHIVO, size: 18, color: '#ffffff', align: 'center', maxWidth: 1000 })

      // bekas cuaca: garis lembar + luntur
      for (const x of [269, 452, 635, 818]) box(ctx, x, 136, 2, 548, 'rgba(0,0,0,0.12)')
      const drips: [number, number][] = [[423, 155], [888, 190], [189, 160], [393, 64], [499, 91], [456, 85], [826, 103], [327, 173]]
      for (const [x, h] of drips) box(ctx, x, 136, 3, h, linear(ctx, x, 136, 3, h, 180, [[0, 'rgba(60,50,40,0.25)'], [1, 'rgba(60,50,40,0)']]))
      // cahaya lampu di papan
      for (const lx of [160, 460, 760]) {
        poly(ctx, lx, 130, 140, 560, [[35, 0], [65, 0], [100, 100], [0, 100]])
        ctx.fillStyle = linear(ctx, lx, 130, 140, 560, 180, [[0, 'rgba(255,250,210,0.35)'], [1, 'rgba(255,250,210,0.05)']])
        ctx.fill()
      }

      // rangka bawah, tangga, tandon, AC, antena
      box(ctx, 60, 706, 960, 10, '#3a3a44')
      box(ctx, 900, 716, 5, 240, '#4a4a54')
      box(ctx, 945, 716, 5, 240, '#4a4a54')
      for (let y = 951; y > 716; y -= 30) box(ctx, 900, y, 50, 5, '#4a4a54')
      box(ctx, 100, 852, 100, 70, linear(ctx, 100, 852, 100, 70, 90, [[0, '#5a4a6a'], [0.5, '#8a7a9a'], [1, '#5a4a6a']]), [50, 50, 6, 6])
      box(ctx, 110, 918, 6, 44, '#3a3058')
      box(ctx, 184, 918, 6, 44, '#3a3058')
      for (const ax of [620, 700]) {
        box(ctx, ax, 922, 70, 40, linear(ctx, ax, 922, 70, 40, 180, [[0, '#6a6a7a'], [1, '#4a4a5a']]), 4)
        // kipas: repeating-conic-gradient(#3a3a4a 0 30deg, #5a5a6a 30deg 60deg) dalam elips 28x24
        const cx = ax + 35
        const cy = 942
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(cx, cy, 14, 12, 0, 0, Math.PI * 2)
        ctx.clip()
        ctx.fillStyle = '#5a5a6a'
        ctx.fillRect(cx - 14, cy - 12, 28, 24)
        ctx.fillStyle = '#3a3a4a'
        for (let i = 0; i < 6; i++) {
          const a0 = ((i * 60 - 90) * Math.PI) / 180
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.arc(cx, cy, 30, a0, a0 + Math.PI / 6)
          ctx.closePath()
          ctx.fill()
        }
        ctx.restore()
      }
      box(ctx, 980, 800, 4, 180, '#3a3058')
      box(ctx, 960, 820, 44, 4, '#3a3058')

      // burung + kucing kecil di atas papan
      for (const [bx, by] of [[300, 100], [330, 120], [360, 96], [620, 180]]) svg(ctx, BIRD, bx, by, 26, 14, 26, 14, { stroke: '#2a2440', lineWidth: 2.5, lineCap: 'round' })
      box(ctx, 720, 112, 16, 12, '#2a2440', [8, 8, 4, 4])
      box(ctx, 744, 112, 16, 12, '#2a2440', [8, 8, 4, 4])

      // label DISEWAKAN
      box(ctx, 160, 780, 86.6, 32, '#ffffff')
      border(ctx, 160, 780, 86.6, 32, 3, INK)
      text(ctx, 'DISEWAKAN', 173, 788, { family: MONO, size: 11, weight: 700, color: INK })
    },
  },
})
