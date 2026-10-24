// Aplikasi Gambar — design-reference/y2k-aesthetic/aplikasi-gambar.html (1080x1350, 1 foto)
import { border, box, dropShadow, rrPath, svg, text, type Ctx } from '../paint'
import { INK, raised, sunken, taskbar, titleButtons, windowFrame } from './win98'
import { y2k } from './define'
import { dashedRect, detailDots, photoInset } from './helpers'

const BG = '#3A8C8C'
const ACCENT = '#1F3A8A'
const C = '#FF2E8A'

const PALETTE = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080FF', '#004080', '#8000FF', '#804000',
  '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FFFF80', '#00FF80', '#80FFFF', '#8080FF', '#FF0080', '#FF8040',
]

const BRUSH = ['M14 4 L20 10 L12 16 L8 12 Z', 'M8 12 C 4 14, 4 20, 4 20 C 8 20, 12 18, 12 16']

/** ikon alat (viewBox 24) digambar di kotak 32x32 */
function toolIcon(ctx: Ctx, i: number, x: number, y: number) {
  const s = (d: string | string[], o: Parameters<typeof svg>[8]) => svg(ctx, d, x, y, 32, 32, 24, 24, o)
  ctx.save()
  switch (i) {
    case 0: // pilih
      s('M4 4 H20 V20 H4 Z', { stroke: INK, lineWidth: 1.6, dash: [3, 2] })
      break
    case 1: // pensil
      s('M4 20 L6 14 L16 4 L20 8 L10 18 Z', { fill: '#F2C94C', stroke: INK, lineWidth: 1.4 })
      break
    case 2: // kuas
      s(BRUSH[0], { fill: '#9aa3ae', stroke: INK, lineWidth: 1.4 })
      s(BRUSH[1], { fill: '#E2483C', stroke: INK, lineWidth: 1.4 })
      break
    case 3: // ember
      s('M6 8 L14 4 L20 12 L12 18 Z', { fill: '#cfd6df', stroke: INK, lineWidth: 1.4 })
      s('M20 12 C 22 16, 21 19, 19 19 C 17 19, 17 16, 20 12', { fill: '#3F7BFF', stroke: INK, lineWidth: 1 })
      break
    case 4: {
      // penghapus: rect 4,8,16,9 rx1 diputar -20° di (12,12)
      ctx.translate(x, y)
      ctx.scale(32 / 24, 32 / 24)
      ctx.translate(12, 12)
      ctx.rotate((-20 * Math.PI) / 180)
      ctx.translate(-12, -12)
      ctx.beginPath()
      rrPath(ctx, 4, 8, 16, 9, 1)
      ctx.fillStyle = '#FF8FD1'
      ctx.fill()
      ctx.lineWidth = 1.4
      ctx.strokeStyle = INK
      ctx.stroke()
      break
    }
    case 5: // teks "A"
      ctx.translate(x, y)
      ctx.scale(32 / 24, 32 / 24)
      ctx.font = '700 18px Georgia, serif'
      ctx.fillStyle = INK
      ctx.fillText('A', 5, 19)
      break
    case 6:
      s('M4 20 L20 4', { stroke: INK, lineWidth: 2 })
      break
    case 7:
      s('M4 6 H20 V18 H4 Z', { stroke: INK, lineWidth: 2 })
      break
    case 8:
      s('M4 12 A8 6 0 1 0 20 12 A8 6 0 1 0 4 12 Z', { stroke: INK, lineWidth: 2 })
      break
    case 9: // semprot
      ctx.translate(x, y)
      ctx.scale(32 / 24, 32 / 24)
      ctx.fillStyle = INK
      for (const [cx, cy] of [[6, 8], [10, 5], [14, 9], [8, 13], [12, 12], [16, 14], [10, 17], [15, 18], [18, 8]]) {
        ctx.beginPath()
        ctx.arc(cx, cy, 1.3, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    case 10:
      s('M18 4 L20 6 L10 16 L6 18 L8 14 Z', { fill: '#cfd6df', stroke: INK, lineWidth: 1.4 })
      break
    case 11:
      s('M16 10 A6 6 0 1 0 4 10 A6 6 0 1 0 16 10 Z', { stroke: INK, lineWidth: 2 })
      s('M14 14 L20 20', { stroke: INK, lineWidth: 2.4 })
      break
  }
  ctx.restore()
}

export const aplikasiGambar = y2k({
  id: 'y2k-aplikasi-gambar',
  name: 'aplikasi gambar',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  placeholder: '#ECEAE5',
  fonts: ['Silkscreen', 'Space Mono:400,700'],
  fields: [],
  slots: [{ x: 218, y: 142, w: 760, h: 900 }],
  draw: {
    under(ctx, { W }) {
      windowFrame(ctx, 40, 36, 1000, 1230, [8, 10, 'rgba(0,0,0,0.25)'])
      box(ctx, 44, 40, 992, 44, ACCENT)
      text(ctx, 'foto_01.bmp — Gambar', 58, 49, { family: 'Silkscreen', size: 20, color: '#ffffff' })
      titleButtons(ctx, 930, 48, 30, 28, 4, 2, 50)
      const menu: [string, number][] = [['File', 56], ['Edit', 121.2], ['Lihat', 186.3], ['Gambar', 261.3], ['Warna', 346.1], ['Bantuan', 421]]
      for (const [m, mx] of menu) text(ctx, m, mx, 89, { family: 'Space Mono', size: 16, color: INK })

      // kotak alat 2 kolom x 6 baris; kuas (index 2) sedang aktif = cekung
      for (let i = 0; i < 12; i++) {
        const bx = i % 2 ? 120 : 50
        const by = 128 + Math.floor(i / 2) * 64
        if (i === 2) sunken(ctx, bx, by, 60, 60)
        else raised(ctx, bx, by, 60, 60)
        toolIcon(ctx, i, bx + 14, by + 14)
      }
      sunken(ctx, 50, 516, 136, 110)
      box(ctx, 83, 539.5, 70, 2, INK)
      box(ctx, 83, 565, 70, 5, INK)
      box(ctx, 83, 593.5, 70, 9, INK)

      // area kanvas abu-abu + kertas putih berbayang
      box(ctx, 198, 122, 838, 1022, '#808080')
      sunken(ctx, 198, 122, 838, 1022)
      dropShadow(ctx, 218, 142, 760, 900, 4, 4, 0, 'rgba(0,0,0,0.35)')
      box(ctx, 218, 142, 760, 900, '#ffffff')

      // warna aktif + palet 14 x 2
      sunken(ctx, 52, 1158, 64, 64)
      box(ctx, 60, 1166, 32, 32, C)
      border(ctx, 60, 1166, 32, 32, 1, INK)
      box(ctx, 76, 1182, 32, 32, '#ffffff')
      border(ctx, 76, 1182, 32, 32, 1, INK)
      PALETTE.forEach((col, i) => {
        const px = 128 + (i % 14) * 64.5
        const py = i < 14 ? 1158.5 : 1191.5
        box(ctx, px, py, 61.5, 30, col)
        sunken(ctx, px, py, 61.5, 30)
      })

      sunken(ctx, 44, 1232, 992, 30)
      text(ctx, 'Untuk bantuan, klik Bantuan', 54, 1236.5, { family: 'Space Mono', size: 14, color: INK })
      text(ctx, '1080 × 1350 px', 1026, 1236.5, { family: 'Space Mono', size: 14, color: INK, align: 'right' })
      taskbar(ctx, W, 1286, { label: 'foto_01.bmp — Gambar', x: 127.5, w: 308, textX: 141.5 }, '16:20')
    },
    over(ctx, { W, H }) {
      photoInset(ctx, 218, 142, 760, 900)
      // coretan kuas, garis seleksi putus-putus, pegangan sudut, kursor kuas
      ctx.save()
      ctx.translate(218, 142)
      svg(ctx, 'M40 120 C 80 40, 160 60, 140 120 S 200 200, 260 140', 0, 0, 760, 900, 760, 900, { stroke: C, lineWidth: 8, lineCap: 'round' })
      ctx.restore()
      dashedRect(ctx, 218, 142, 760, 900, 2, INK)
      box(ctx, 972, 1036, 14, 14, INK)
      svg(ctx, BRUSH[0], 798, 502, 44, 44, 24, 24, { fill: '#9aa3ae', stroke: INK, lineWidth: 1.4 })
      svg(ctx, BRUSH[1], 798, 502, 44, 44, 24, 24, { fill: C, stroke: INK, lineWidth: 1.4 })
      detailDots(ctx, W, H)
    },
  },
})
