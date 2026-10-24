// Film Negatif — design-reference/retro-vintage/film-negatif.html (600x1800, 4 foto)
import { box, dropShadow, insetShadows, linear, text } from '../paint'
import { ellipseGlow, glyphText, insetRing, premul, rotated, spacedGlyphs } from './helpers'
import { retro } from './define'

const BG = '#111110'
const CREAM = '#f2efe8'
const ACCENT = '#F5A524'
const MONO = 'IBM Plex Mono'
const FRAMES = [101, 457, 813, 1169]

export const filmNegatif = retro({
  id: 'retro-film-negatif',
  name: 'film negatif',
  width: 600,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: BG },
  placeholder: '#2a2926',
  fonts: ['IBM Plex Mono:400,600'],
  fields: ['tanggal'],
  texture: { opacity: 0.14, blend: 'multiply' },
  slots: FRAMES.map((y) => ({ x: 80, y, w: 440, h: 310 })),
  draw: {
    under(ctx, { texts, H }) {
      // lubang sprocket kiri-kanan: 22 buah, space-evenly
      const gap = (H - 22 * 36) / 23
      for (let i = 0; i < 22; i++) {
        const y = gap * (i + 1) + 36 * i
        for (const x of [18, 558]) {
          // box-shadow: inset 0 2px 3px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.08)
          dropShadow(ctx, x, y, 24, 36, 0, 1, 0, 'rgba(255,255,255,0.08)', 5)
          box(ctx, x, y, 24, 36, CREAM, 5)
          insetShadows(ctx, x, y, 24, 36, [{ dx: 0, dy: 2, blur: 3, color: 'rgba(0,0,0,0.55)' }], 5)
        }
      }
      text(ctx, 'PHOTOBOX 400', 80, 36, { family: MONO, size: 15, weight: 600, color: ACCENT, letterSpacing: 1.8 })
      text(ctx, 'ISO 400', 444.4, 36, { family: MONO, size: 15, weight: 600, color: ACCENT, letterSpacing: 1.8 })
      FRAMES.forEach((y, i) => glyphText(ctx, '▸', 7.7, ` 0${i + 1}A`, 80, y - 26, { family: MONO, size: 14, weight: 600, color: ACCENT }))
      text(ctx, 'ROLL 01', 80, 1690, { family: MONO, size: 34, weight: 600, color: CREAM, letterSpacing: 1.36 })
      text(ctx, texts.tanggal?.trim() ?? '', 80, 1740, { family: MONO, size: 16, color: ACCENT, letterSpacing: 3.2, maxWidth: 440 })
    },
    over(ctx, { W, H }) {
      // box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 24px rgba(0,0,0,0.6) di kotak foto
      for (const y of FRAMES) {
        insetShadows(ctx, 80, y, 440, 310, [{ dx: 0, dy: 0, blur: 24, color: 'rgba(0,0,0,0.6)' }])
        insetRing(ctx, 80, y, 440, 310, 1, 'rgba(255,255,255,0.06)')
      }
      // cahaya bocor (light leak) di atas seluruh strip, termasuk foto
      ellipseGlow(ctx, 0, 0, W, H, 0, H * 0.96, 200, 300, [[0, 'rgba(255,80,60,0.1)'], [0.7, 'rgba(255,80,60,0)']])
      ellipseGlow(ctx, 0, 0, W, H, W, H * 0.06, 260, 420, [[0, 'rgba(255,120,40,0.18)'], [0.7, 'rgba(255,120,40,0)']])
    },
    top(ctx, { W, H }) {
      // teks tepi film (rotate -90deg di tengah kotak 360x14); di DOM sesudah lapisan noise
      rotated(ctx, 30, 897, -90, () => {
        text(ctx, 'PHOTOBOX 400 · SAFETY FILM · 36 EXP', 30, 890, { family: MONO, size: 11, color: '#8a8a8a', letterSpacing: 3.3, align: 'center' })
      })
      // teks tepi kanan: rotate(90deg) di tengah kotak 360x14 (left 390, top 890), opacity 0.8
      ctx.save()
      ctx.globalAlpha = 0.8
      rotated(ctx, 570, 897, 90, () => {
        spacedGlyphs(ctx, '▸ 17 ▸ 17A ▸ 18 ▸ 18A ▸ 19', '▸', 6.04, 570, 890, { family: MONO, size: 11, color: '#E8A33C', letterSpacing: 3.3, align: 'center' })
      })
      ctx.restore()
      // rona hangat atas-bawah
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 180, premul([[0, 'rgba(232,163,60,0.06)'], [0.3, 'rgba(0,0,0,0)'], [0.7, 'rgba(0,0,0,0)'], [1, 'rgba(232,163,60,0.05)']])))
    },
  },
})
