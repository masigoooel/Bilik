// Binder Kartu — design-reference/gaming-pixel/binder-kartu.html (1200x1800, 4 foto)
import { border, box, dropShadow, linear, svg, text, type Ctx } from '../paint'
import { PIXEL, SILK, bevelBorder, circleGradient, conicGradient, ellipseGradient, fauxItalic, join } from './helpers'
import { gaming } from './define'

/** warna latar desain (prop bg, default) */
const BG = '#151833'
const MUTED = '#b9bce0'
const INK = '#1a1a1a'
const OUTFIT = '"Outfit", "Helvetica Neue", sans-serif'
const MONO = '"Space Mono", monospace'

const ICON = {
  api: 'M12 2c2 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 1 3 3 4 0-3-1-5 0-8z',
  air: 'M12 2C9 7 6 10 6 14a6 6 0 0 0 12 0c0-4-3-7-6-12z',
  daun: 'M20 4C10 4 4 10 4 20c8 0 14-4 15-12M4 20 14 10',
  petir: 'M13 2 4 14h7l-1 8 9-12h-7z',
}

/** [HOBI] tidak punya field: hobi tetap yang kalem per kartu */
const CARDS = [
  { x: 154, y: 144, top: '#FFB39E', energy: '#E8553D', icon: ICON.api, hp: '120', hobi: 'foto', atk: [['Senyum Hangat', '30'], ['Pose Andalan', '80']], no: '01/04 ★' },
  { x: 641, y: 144, top: '#A8CCFF', energy: '#2E7BE2', icon: ICON.air, hp: '110', hobi: 'musik', atk: [['Tatapan Tenang', '20'], ['Gaya Bebas', '70']], no: '02/04 ★' },
  { x: 154, y: 714, top: '#B6E8B0', energy: '#2F9E5A', icon: ICON.daun, hp: '100', hobi: 'jalan', atk: [['Ketawa Lepas', '40'], ['Kompak', '60']], no: '03/04 ◆' },
  { x: 641, y: 714, top: '#FFE59A', energy: '#E2A82A', icon: ICON.petir, hp: '130', hobi: 'ngemil', atk: [['Kilat Kamera', '50'], ['Foto Terbaik', '90']], no: '04/04 ★★' },
]

/** bulatan energi: radial-gradient(circle at 35% 30%, #fff, warna 60%) + bayangan 0 1px 2px */
function energy(ctx: Ctx, x: number, y: number, d: number, color: string, icon: string, iconSize: number) {
  dropShadow(ctx, x, y, d, d, 0, 1, 2, 'rgba(0,0,0,0.4)', d / 2)
  box(ctx, x, y, d, d, circleGradient(ctx, x, y, d, d, 0.35, 0.3, [[0, '#ffffff'], [0.6, color], [1, color]]), d / 2)
  const o = (d - iconSize) / 2
  svg(ctx, icon, x + o, y + o, iconSize, iconSize, 24, 24, { fill: '#fff', stroke: '#fff', lineWidth: 1, lineJoin: 'round' })
}

export const binderKartu = gaming({
  id: 'gaming-binder-kartu',
  name: 'binder kartu',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: BG },
  placeholder: '#E8E6E0',
  fonts: ['Press Start 2P', 'Silkscreen', 'Space Mono:400,700', 'Outfit:600,800'],
  fields: ['nama', 'nama2', 'catatan'],
  slots: CARDS.map(({ x, y }) => ({ x: x + 46, y: y + 92, w: 373, h: 250 })),
  draw: {
    under(ctx, { texts, W, H }) {
      ellipseGradient(ctx, 0, 0, W, H, 0.4, 0.2, [[0, '#3a3f78'], [0.7, BG], [1, BG]])

      // sampul binder
      dropShadow(ctx, 40, 40, 1120, 1720, 0, 24, 40, 'rgba(0,0,0,0.5)', 22)
      box(ctx, 40, 40, 1120, 1720, linear(ctx, 40, 40, 1120, 1720, 90, [[0, '#1a1d3a'], [0.06, '#23284a'], [1, '#23284a']]), 22)
      border(ctx, 40, 40, 1120, 1720, 2, 'rgba(255,255,255,0.06)', 22)
      box(ctx, 70, 40, 40, 1720, linear(ctx, 70, 40, 40, 1720, 90, [[0, 'rgba(0,0,0,0.35)'], [1, 'rgba(0,0,0,0)']]))
      // ring binder
      for (const y of [260, 760, 1260]) {
        dropShadow(ctx, -26, y, 80, 56, 0, 3, 4, 'rgba(0,0,0,0.4)', 20)
        bevelBorder(ctx, -26, y, 80, 56, 8, '#e9edf2', '#8f969d', 20)
      }

      text(ctx, 'BINDER KOLEKSI', 130, 60, { family: PIXEL, size: 34, color: '#ffffff' })
      // [NAMA GENG] = catatan; kosong → "hal. 1" saja
      const geng = texts.catatan?.trim()
      text(ctx, join(['hal. 1', geng && `set ${geng}`]), 1130, 70, { family: MONO, size: 16, color: MUTED, align: 'right', maxWidth: 520 })

      // halaman sleeve
      box(ctx, 130, 120, 1000, 1166, 'rgba(255,255,255,0.05)', 18)
      border(ctx, 130, 120, 1000, 1166, 2, 'rgba(255,255,255,0.12)', 18)

      // [NAMA] kartu 1 = nama, kartu 2 = nama2, kartu 3-4 tanpa field
      const names = [texts.nama?.trim() || 'Pemain 1', texts.nama2?.trim() || 'Pemain 2', 'Pemain 3', 'Pemain 4']
      CARDS.forEach((c, i) => {
        const { x, y } = c
        box(ctx, x, y, 465, 548, 'rgba(255,255,255,0.12)', 10)
        border(ctx, x, y, 465, 548, 2, 'rgba(255,255,255,0.35)', 10)
        box(ctx, x + 16, y + 8, 433, 10, 'rgba(255,255,255,0.25)', [0, 0, 6, 6])

        // kartu emas
        dropShadow(ctx, x + 16, y + 16, 433, 516, 0, 6, 12, 'rgba(0,0,0,0.4)', 16)
        box(ctx, x + 16, y + 16, 433, 516, linear(ctx, x + 16, y + 16, 433, 516, 135, [[0, '#f6dd7a'], [0.4, '#c8952a'], [0.6, '#f2d36e'], [1, '#b5821e']]), 16)
        box(ctx, x + 30, y + 30, 405, 488, linear(ctx, x + 30, y + 30, 405, 488, 180, [[0, c.top], [0.7, '#fbf8f0'], [1, '#fbf8f0']]), 8)

        const L = x + 42
        const R = x + 423
        text(ctx, 'DASAR', L, y + 40, { family: SILK, size: 11, color: '#555555' })
        energy(ctx, x + 393, y + 45, 30, c.energy, c.icon, 19)
        text(ctx, c.hp, x + 387, y + 47.5, { family: OUTFIT, size: 20, weight: 800, color: '#c0311f', align: 'right' })
        text(ctx, names[i], L, y + 50, { family: OUTFIT, size: 26, weight: 800, color: INK, maxWidth: 300 })

        // bingkai foto
        box(ctx, L, y + 88, 381, 258, linear(ctx, L, y + 88, 381, 258, 135, [[0, '#e9e2c8'], [1, '#b9ae88']]))
        border(ctx, L, y + 88, 381, 258, 1, 'rgba(0,0,0,0.25)')

        box(ctx, L, y + 354, 381, 22, linear(ctx, L, y + 354, 381, 22, 90, [[0, '#c8952a'], [0.5, '#f2d36e'], [1, '#c8952a']]))
        fauxItalic(ctx, `tinggi: 160 cm · hobi: ${c.hobi}`, x + 232.5, y + 357, { family: MONO, size: 11, color: INK, align: 'center', maxWidth: 365 })

        c.atk.forEach(([name, dmg], j) => {
          const ry = y + 384 + j * 43
          for (let k = 0; k <= j; k++) energy(ctx, L + k * 23, ry + 4, 20, c.energy, c.icon, 12)
          text(ctx, name, L + 28 + j * 23, ry + 2.5, { family: OUTFIT, size: 18, weight: 800, color: INK, maxWidth: 300 })
          text(ctx, dmg, R, ry, { family: OUTFIT, size: 22, weight: 800, color: INK, align: 'right' })
          box(ctx, L, ry + 34, 381, 1, 'rgba(0,0,0,0.12)')
        })

        const small = { family: MONO, size: 10, color: '#444444' }
        text(ctx, 'lemah: ×2', L, y + 470, small)
        text(ctx, 'tahan: −20', x + 202.2, y + 470, small)
        text(ctx, 'mundur: ●', R, y + 470, { ...small, align: 'right' })
        const tiny = { family: MONO, size: 9, color: '#666666' }
        text(ctx, c.no, R, y + 493, { ...tiny, align: 'right' })
        text(ctx, `ilus. ${names[i]}`, L, y + 493, { ...tiny, maxWidth: 300 })
      })

      text(ctx, 'set lengkap 4/4', 130, 1716, { family: MONO, size: 16, color: MUTED })
      text(ctx, 'disimpan dalam sleeve', 1130, 1716, { family: MONO, size: 16, color: MUTED, align: 'right' })
    },
    over(ctx) {
      for (const { x, y } of CARDS) {
        const sx = x + 46
        const sy = y + 92
        // kilau hologram di atas foto
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        box(ctx, sx, sy, 373, 250, conicGradient(ctx, sx, sy, 373, 250, 210, 0.7, 0.2, [
          'rgba(255,0,150,0.18)', 'rgba(0,200,255,0.18)', 'rgba(255,240,0,0.18)', 'rgba(0,255,120,0.15)', 'rgba(255,0,150,0.18)',
        ]))
        ctx.restore()
        box(ctx, sx, sy, 373, 250, linear(ctx, sx, sy, 373, 250, 115, [
          [0, 'rgba(255,255,255,0)'], [0.35, 'rgba(255,255,255,0)'], [0.46, 'rgba(255,255,255,0.5)'], [0.57, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)'],
        ]))
        // kilap plastik sleeve di atas seluruh kartu
        box(ctx, x + 16, y + 16, 433, 516, linear(ctx, x + 16, y + 16, 433, 516, 160, [
          [0, 'rgba(255,255,255,0.35)'], [0.25, 'rgba(255,255,255,0)'], [0.7, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0.12)'],
        ]), 8)
      }
    },
  },
})
