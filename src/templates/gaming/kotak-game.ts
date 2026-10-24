// Kotak Game — design-reference/gaming-pixel/kotak-game.html (1080x1350, 1 foto)
import { border, box, contentHeight, dropShadow, linear, measure, rrPath, text, type Ctx } from '../paint'
import { PIXEL, SILK, conicGradient, ellipseGradient, glare, rotated, slotInset } from './helpers'
import { gaming } from './define'

/** warna latar & sampul desain (prop bg, c, default) */
const BG = '#12122A'
const C = '#2F6BFF'
const OUTFIT = '"Outfit", sans-serif'
const GREY = '#cfcfcf'
/** kotak 720x1150 di (180, 80), rotate(-2deg) di titik tengah */
const ROT = -2
const CX = 540
const CY = 655

/** judul + "dibintangi [NAMA]": blok rata bawah (bottom 30px) di dalam area foto */
function titleBlock(ctx: Ctx, title: string, nama: string | undefined) {
  const o = { family: OUTFIT, size: 76, weight: 800, maxWidth: 604 }
  const top = nama ? 951.6 : 1054 - 68.4
  const ty = top + (68.4 - contentHeight(ctx, OUTFIT, 76, 800)) / 2
  text(ctx, title, 240, ty + 4, { ...o, color: 'rgba(0,0,0,0.5)' })
  text(ctx, title, 240, ty, { ...o, color: '#ffffff' })
  if (nama) text(ctx, `dibintangi ${nama}`, 240, 1030, { family: SILK, size: 18, color: '#ffffff', maxWidth: 604 })
}

export const kotakGame = gaming({
  id: 'gaming-kotak-game',
  name: 'kotak game',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  placeholder: '#2A2A44',
  fonts: ['Press Start 2P', 'Silkscreen', 'Space Mono:400,700', 'Outfit:700,800'],
  fields: ['nama', 'catatan'],
  slots: [{ x: 206.5, y: 176, w: 664, h: 760, rotate: ROT }],
  draw: {
    under(ctx, { W, H }) {
      ellipseGradient(ctx, 0, 0, W, H, 0.4, 0.3, [[0, '#3a3a5a'], [0.75, BG], [1, BG]])

      // cakram di belakang kotak
      dropShadow(ctx, 860, 200, 180, 180, 0, 6, 10, 'rgba(0,0,0,0.4)', 90)
      box(ctx, 860, 200, 180, 180, conicGradient(ctx, 860, 200, 180, 180, 30, 0.5, 0.5, ['#e9edf2', '#d8e8f6', '#f6d8e6', '#e6f6d8', '#e9edf2']), 90)
      // inset 0 0 0 64px rgba(255,255,255,0.1): cincin dari tepi sampai r = 26
      ctx.beginPath()
      ctx.arc(950, 290, 90, 0, Math.PI * 2)
      ctx.arc(950, 290, 26, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      ctx.fill('evenodd')
      box(ctx, 930, 270, 40, 40, BG, 20)

      rotated(ctx, CX, CY, ROT, () => {
        dropShadow(ctx, 180, 80, 720, 1150, 0, 30, 50, 'rgba(0,0,0,0.5)', 16)
        box(ctx, 180, 80, 720, 1150, linear(ctx, 180, 80, 720, 1150, 90, [[0, '#1a1a1a'], [0.06, '#2a2a2a'], [1, '#1a1a1a']]), 16)
        box(ctx, 210, 106, 664, 1098, C)
        box(ctx, 210, 106, 664, 70, '#ffffff')
        text(ctx, 'KONSOL', 234, 132, { family: PIXEL, size: 18, color: '#111111' })
        text(ctx, '17+', 850, 127, { family: OUTFIT, size: 22, weight: 800, color: '#111111', align: 'right' })

        box(ctx, 210, 1084, 664, 120, '#111111')
        text(ctx, '1–2 pemain · simpan otomatis', 234, 1135, { family: SILK, size: 14, color: GREY })
        const bw = measure(ctx, 'EDISI KOLEKTOR', { family: PIXEL, size: 10 }) + 28
        border(ctx, 850 - bw, 1129, bw, 30, 2, GREY)
        text(ctx, 'EDISI KOLEKTOR', 850 - bw + 14, 1139, { family: PIXEL, size: 10, color: GREY })
      })
    },
    over(ctx, { texts, W, H }) {
      rotated(ctx, CX, CY, ROT, () => {
        slotInset(ctx, 210, 176, 664, 760)
        box(ctx, 210, 176, 664, 908, linear(ctx, 210, 176, 664, 908, 180, [[0, 'rgba(0,0,0,0)'], [0.5, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.7)']]))
        // [JUDUL GAME] = catatan, "dibintangi [NAMA]" = nama
        ctx.save()
        ctx.beginPath()
        rrPath(ctx, 210, 106, 664, 1098)
        ctx.clip()
        titleBlock(ctx, texts.catatan?.trim() || 'Hari Libur', texts.nama?.trim())
        ctx.restore()
        // kilap plastik sampul
        box(ctx, 180, 80, 720, 1150, linear(ctx, 180, 80, 720, 1150, 120, [[0, 'rgba(255,255,255,0.18)'], [0.3, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']]), 16)
      })
      // punggung kotak (rotate(-2deg) di tengahnya sendiri)
      rotated(ctx, 170, 665, ROT, () => {
        box(ctx, 150, 90, 40, 1150, linear(ctx, 150, 90, 40, 1150, 90, [[0, 'rgba(255,255,255,0.12)'], [0.4, 'rgba(255,255,255,0.35)'], [1, 'rgba(255,255,255,0.08)']]))
      })
      glare(ctx, W, H)
    },
  },
})
