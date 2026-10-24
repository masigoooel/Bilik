// Jendela Desktop — design-reference/y2k-aesthetic/jendela-desktop.html (1080x1350, 2 foto)
import { border, box, dropShadow, insetShadows, svg, text, type Ctx } from '../paint'
import { CURSOR, FACE, INK, raised, taskbar, titleButtons, windowFrame } from './win98'
import { y2k } from './define'
import { detailDots } from './helpers'

const BG = '#3A8C8C'
const ACCENT = '#1F3A8A'

const WINDOWS = [
  { x: 60, y: 60, title: 'foto_01.jpg', shadow: [4, 4, 'rgba(0,0,0,0.15)'] as [number, number, string] },
  { x: 200, y: 660, title: 'foto_02.jpg', shadow: [12, 14, 'rgba(0,0,0,0.35)'] as [number, number, string] },
]

function appWindow(ctx: Ctx, w: (typeof WINDOWS)[number]) {
  const { x, y } = w
  windowFrame(ctx, x, y, 820, 582, w.shadow)
  box(ctx, x + 4, y + 4, 812, 40, ACCENT)
  text(ctx, w.title, x + 16, y + 12, { family: 'Silkscreen', size: 18, color: '#ffffff' })
  titleButtons(ctx, x + 718, y + 11, 28, 26, 4, 1, y + 12)
  // bilah status
  insetShadows(ctx, x + 4, y + 552, 812, 26, [{ dx: 1, dy: 1, color: '#808080' }])
  text(ctx, '1080 × 1350 px · 100%', x + 14, y + 554.5, { family: 'Space Mono', size: 14, color: INK })
}

function desktopIcon(ctx: Ctx, label: string, cx: number, labelY: number, draw: () => void) {
  draw()
  text(ctx, label, cx, labelY, { family: 'Silkscreen', size: 15, color: '#ffffff', align: 'center' })
}

export const jendelaDesktop = y2k({
  id: 'y2k-jendela-desktop',
  name: 'jendela desktop',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: BG },
  placeholder: '#ECEAE5',
  fonts: ['Silkscreen', 'Space Mono:400,700'],
  fields: ['tanggal'],
  slots: [
    { x: 64, y: 108, w: 812, h: 500 },
    { x: 204, y: 708, w: 812, h: 500 },
  ],
  draw: {
    under(ctx, { texts, W }) {
      for (const w of WINDOWS) appWindow(ctx, w)
      desktopIcon(ctx, 'foto', 985, 126, () => {
        box(ctx, 953, 70, 64, 50, '#F2C94C', [4, 12, 4, 4])
        border(ctx, 953, 70, 64, 50, 2, INK, [4, 12, 4, 4])
      })
      desktopIcon(ctx, 'sampah', 985, 254, () => {
        box(ctx, 960, 190, 50, 58, FACE, [2, 2, 8, 8])
        border(ctx, 960, 190, 50, 58, 2, INK, [2, 2, 8, 8])
      })
      const clock = [texts.tanggal?.trim(), '16:20'].filter(Boolean).join(' ')
      taskbar(ctx, W, 1286, null, clock)
    },
    over(ctx, { W, H }) {
      // tepi cekung jendela foto menimpa tepi foto
      for (const w of WINDOWS) insetShadows(ctx, w.x + 4, w.y + 48, 812, 500, [{ dx: 2, dy: 2, color: '#808080' }])
      // dialog "simpan foto" di atas kedua jendela
      dropShadow(ctx, 560, 560, 400, 154, 6, 8, 0, 'rgba(0,0,0,0.25)')
      box(ctx, 560, 560, 400, 154, FACE)
      raised(ctx, 560, 560, 400, 154)
      box(ctx, 564, 564, 392, 34, ACCENT)
      text(ctx, 'simpan foto', 574, 571, { family: 'Silkscreen', size: 16, color: '#ffffff' })
      text(ctx, 'simpan 2 foto ke folder?', 582, 616, { family: 'Space Mono', size: 16, color: INK })
      raised(ctx, 779.4, 656, 63.6, 36)
      border(ctx, 779.4 + 5, 656 + 5, 63.6 - 10, 36 - 10, 1, INK, 0, [1, 1])
      text(ctx, 'Ya', 801.4, 662, { family: 'Space Mono', size: 16, color: INK })
      raised(ctx, 853, 656, 85, 36)
      text(ctx, 'Tidak', 871, 662, { family: 'Space Mono', size: 16, color: INK })
      svg(ctx, CURSOR, 770, 690, 44, 60, 22, 30, { fill: '#ffffff', stroke: INK, lineWidth: 1.6, lineJoin: 'round' })
      detailDots(ctx, W, H)
    },
  },
})
