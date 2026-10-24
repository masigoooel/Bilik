// Folder Foto — design-reference/y2k-aesthetic/folder-foto.html (1200x1800, 4 foto)
import { border, box, linear, rrPath, svg, text, type Ctx } from '../paint'
import { CURSOR, INK, raised, sunken, taskbar, titleButtons, windowFrame } from './win98'
import { y2k } from './define'
import { detailDots, photoInset } from './helpers'

const BG = '#3A8C8C'
const ACCENT = '#1F3A8A'
const NAVY = '#1D3A7A'
const SELECT = '#316AC5'

const CELLS = [
  { x: 328, y: 203, label: 'foto_01.jpg' },
  { x: 739, y: 203, label: 'foto_02.jpg', selected: true },
  { x: 328, y: 837, label: 'foto_03.jpg' },
  { x: 739, y: 837, label: 'foto_04.jpg' },
]

function card(ctx: Ctx, y: number, h: number, title: string) {
  box(ctx, 70, y, 218, h, '#D6DFF7', [10, 10, 0, 0])
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, 70, y, 218, h, [10, 10, 0, 0])
  ctx.clip()
  box(ctx, 70, y, 218, 42, linear(ctx, 70, y, 218, 42, 90, [[0, '#ffffff'], [1, '#C6D3F7']]))
  ctx.restore()
  text(ctx, title, 82, y + 10, { family: 'Space Mono', size: 15, weight: 700, color: NAVY })
}

export const folderFoto = y2k({
  id: 'y2k-folder-foto',
  name: 'folder foto',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: BG },
  placeholder: '#ECEAE5',
  fonts: ['Silkscreen', 'Space Mono:400,700'],
  fields: ['tanggal'],
  slots: CELLS.map((c) => ({ x: c.x + 10, y: c.y + 16, w: 367, h: 540 })),
  draw: {
    under(ctx, { texts, W }) {
      const tanggal = texts.tanggal?.trim() ?? ''
      windowFrame(ctx, 50, 50, 1100, 1620, [8, 10, 'rgba(0,0,0,0.25)'])
      box(ctx, 54, 54, 1092, 44, ACCENT)
      text(ctx, 'Foto Saya', 68, 63, { family: 'Silkscreen', size: 20, color: '#ffffff' })
      titleButtons(ctx, 1040, 62, 30, 28, 4, 2, 64)
      const menu: [string, number][] = [['File', 66], ['Edit', 131.2], ['Lihat', 196.3], ['Favorit', 271.3], ['Bantuan', 365.9]]
      for (const [m, mx] of menu) text(ctx, m, mx, 103, { family: 'Space Mono', size: 16, color: INK })

      // bilah alamat: tanggal user jadi nama folder
      box(ctx, 54, 132, 1092, 1, '#808080')
      text(ctx, 'Alamat', 64, 144, { family: 'Space Mono', size: 16, color: INK })
      box(ctx, 134.8, 140, 922.1, 32, '#ffffff')
      sunken(ctx, 134.8, 140, 922.1, 32)
      text(ctx, tanggal ? `C:\\Foto\\${tanggal}` : 'C:\\Foto', 144.8, 144, { family: 'Space Mono', size: 16, color: INK, maxWidth: 900 })
      raised(ctx, 1068.8, 140, 67.2, 32)
      text(ctx, 'Buka', 1082.8, 144, { family: 'Space Mono', size: 16, color: INK })

      // panel tugas biru
      box(ctx, 54, 183, 250, 1449, linear(ctx, 54, 183, 250, 1449, 180, [[0, '#7BA2E7'], [1, '#6375D6']]))
      card(ctx, 201, 160, 'Tugas Foto')
      ;['Lihat slideshow', 'Cetak foto', 'Kirim foto'].forEach((label, i) => {
        const ry = 257 + i * 34
        box(ctx, 82, ry + 1, 20, 20, linear(ctx, 82, ry + 1, 20, 20, 180, [[0, '#ffffff'], [1, '#9cc0f0']]), 4)
        border(ctx, 82, ry + 1, 20, 20, 1, NAVY, 4)
        text(ctx, label, 112, ry, { family: 'Space Mono', size: 15, color: NAVY })
      })
      card(ctx, 379, 145, 'Detail')
      text(ctx, 'foto_02.jpg', 82, 435, { family: 'Space Mono', size: 14, weight: 700, color: NAVY })
      text(ctx, 'JPEG · 1080×1350', 82, 462, { family: 'Space Mono', size: 14, color: NAVY })
      text(ctx, tanggal ? `diambil ${tanggal} 16:20` : 'diambil 16:20', 82, 489, { family: 'Space Mono', size: 14, color: NAVY, maxWidth: 194 })

      // area file putih + 4 thumbnail
      box(ctx, 308, 183, 838, 1449, '#ffffff')
      sunken(ctx, 308, 183, 838, 1449)
      for (const c of CELLS) {
        if (c.selected) {
          box(ctx, c.x, c.y, 387, 610, 'rgba(49,106,197,0.18)')
          border(ctx, c.x - 2, c.y - 2, 391, 614, 2, SELECT, 0, [2, 2])
        }
        box(ctx, c.x + 4, c.y + 10, 379, 552, '#ffffff')
        sunken(ctx, c.x + 4, c.y + 10, 379, 552)
        const lx = c.x + 131.6
        if (c.selected) box(ctx, lx, c.y + 572, 123.7, 28, SELECT)
        text(ctx, c.label, lx + 8, c.y + 574, { family: 'Space Mono', size: 16, color: c.selected ? '#ffffff' : INK })
      }

      sunken(ctx, 54, 1636, 1092, 30)
      text(ctx, '4 objek (1 dipilih)', 64, 1640.5, { family: 'Space Mono', size: 14, color: INK })
      text(ctx, '12,4 MB', 1136, 1640.5, { family: 'Space Mono', size: 14, color: INK, align: 'right' })
      taskbar(ctx, W, 1736, { label: 'Foto Saya', x: 127.5, w: 288, textX: 141.5 }, '16:20')
    },
    over(ctx, { W, H }) {
      for (const c of CELLS) photoInset(ctx, c.x + 10, c.y + 16, 367, 540)
      svg(ctx, CURSOR, 760, 860, 44, 60, 22, 30, { fill: '#ffffff', stroke: INK, lineWidth: 1.6, lineJoin: 'round' })
      box(ctx, 640, 1000, 253.3, 35, '#FFFFE1')
      border(ctx, 640, 1000, 253.3, 35, 1, INK)
      text(ctx, 'foto_02.jpg · JPEG · 1,2 MB', 651, 1007, { family: 'Space Mono', size: 14, color: INK })
      detailDots(ctx, W, H)
    },
  },
})
