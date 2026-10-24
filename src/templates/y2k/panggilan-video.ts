// Panggilan Video — design-reference/y2k-aesthetic/panggilan-video.html (1080x1350, 2 foto)
import { box, measure, text, type Ctx } from '../paint'
import { INK, raised, sunken, taskbar, titleButtons, windowFrame } from './win98'
import { y2k } from './define'
import { detailDots, photoInset } from './helpers'

const BG = '#3A8C8C'
const ACCENT = '#1F3A8A'
const TILES = [64, 544]
const MONO = 'Space Mono'

/** jendela ala Windows: bingkai, bilah judul aksen, tombol _ □ × */
function appWindow(ctx: Ctx, x: number, y: number, w: number, h: number, title: string) {
  windowFrame(ctx, x, y, w, h, [8, 10, 'rgba(0,0,0,0.25)'])
  box(ctx, x + 4, y + 4, w - 8, 42, ACCENT)
  text(ctx, title, x + 18, y + 13, { family: 'Silkscreen', size: 18, color: '#ffffff', maxWidth: w - 150 })
  titleButtons(ctx, x + w - 104, y + 12, 28, 26, 4, 2, y + 13)
}

export const panggilanVideo = y2k({
  id: 'y2k-panggilan-video',
  name: 'panggilan video',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: BG },
  placeholder: '#20242c',
  fonts: ['Silkscreen', 'Space Mono:400,700'],
  fields: ['nama', 'nama2'],
  slots: TILES.map((x) => ({ x, y: 146, w: 472, h: 560 })),
  draw: {
    under(ctx, { texts, W }) {
      const nama = texts.nama?.trim() ?? ''
      const nama2 = texts.nama2?.trim() ?? ''
      // jendela panggilan
      appWindow(ctx, 50, 90, 980, 728, nama ? `panggilan video — ${nama}` : 'panggilan video')
      box(ctx, 54, 136, 972, 580, '#111111')
      const btns: [string, number, number][] = [['mikrofon', 298.5, 109.5], ['kamera', 420, 91.1], ['bagikan layar', 523, 155.3], ['akhiri', 690.4, 91.1]]
      for (const [label, bx, bw] of btns) {
        const end = label === 'akhiri'
        if (end) box(ctx, bx, 729, bw, 44, '#C0392B')
        raised(ctx, bx, 729, bw, 44)
        text(ctx, label, bx + 18, 740, { family: MONO, size: 15, color: end ? '#ffffff' : INK })
      }
      sunken(ctx, 54, 786, 972, 28)
      text(ctx, 'panggilan video · 2 peserta', 64, 790, { family: MONO, size: 13, color: INK })
      text(ctx, '00:17:26', 1016, 790, { family: MONO, size: 13, color: INK, align: 'right' })

      // jendela pesan
      appWindow(ctx, 60, 840, 440, 164, 'pesan')
      box(ctx, 64, 886, 432, 114, '#ffffff')
      sunken(ctx, 64, 886, 432, 114)
      const chat: [string, string, number][] = [[nama || 'aku', ' senyum dulu', 900], [nama2 || nama || 'kamu', ' oke 3, 2, 1', 932]]
      for (const [who, msg, ly] of chat) {
        const bw = text(ctx, `${who}:`, 78, ly, { family: MONO, size: 15, weight: 700, color: INK, maxWidth: 260 })
        text(ctx, msg, 78 + bw, ly, { family: MONO, size: 15, color: INK })
      }
      text(ctx, 'sedang mengetik...', 78, 964, { family: MONO, size: 15, color: '#666666' })

      taskbar(ctx, W, 1286, { label: 'panggilan video', x: 127.5, w: 288, textX: 141.5 }, '16:20')
    },
    over(ctx, { texts, W, H }) {
      const names = [texts.nama?.trim() ?? '', texts.nama2?.trim() ?? '']
      TILES.forEach((x, i) => {
        photoInset(ctx, x, 146, 472, 560)
        // label nama peserta (lebar mengikuti teks) + lampu hijau
        const n = names[i]
        if (n) {
          const o = { family: MONO, size: 14, color: '#ffffff', maxWidth: 420 }
          const tw = Math.min(420, measure(ctx, n, o))
          box(ctx, x + 12, 665, tw + 20, 29, 'rgba(0,0,0,0.6)')
          text(ctx, n, x + 22, 669, o)
        }
        box(ctx, x + 446, 158, 14, 14, '#3fd97a', 7)
      })
      detailDots(ctx, W, H)
    },
  },
})
