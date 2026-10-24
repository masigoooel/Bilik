// Mugshot — design-reference/dark-grunge/mugshot.html (1080x1350, 2 foto)
// Copy sengaja jenaka (PHOTOBOX DEPT., "pelanggaran: terlalu banyak gaya"), bukan meniru dokumen instansi sungguhan.
import { border, box, radial, type Ctx } from '../paint'
import { dark } from './define'
import { FONTS, SPECIAL, TEXTURE, join, rotated, slotInset, txt, vignette, width } from './helpers'

const WALL = '#2B2F3A'
const INK = '#f2f2f2'
const RED = '#C1121F'

/** papan nama di bawah foto: padding 10px 18px, border 2px, lebar mengikuti teks, tengah di cx */
function plate(ctx: Ctx, s: string, cx: number) {
  if (!s) return
  const o = { family: SPECIAL, size: 20, ls: 2, color: INK, maxWidth: 380 }
  const tw = Math.min(width(ctx, s, o), 380)
  const w = tw + 40
  const x = cx - w / 2
  box(ctx, x, 992, w, 44, '#1a1a1a')
  border(ctx, x, 992, w, 44, 2, INK)
  txt(ctx, s, x + 20, 1004, o)
}

export const mugshot = dark({
  id: 'dark-mugshot',
  name: 'mugshot',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: '#121212' },
  placeholder: '#1e2028',
  fonts: FONTS,
  // papan nama = nama · 0017, papan kanan = tanggal, catatan = "pelanggaran: ..."
  fields: ['nama', 'tanggal', 'catatan'],
  texture: TEXTURE,
  // foto samping di desain dimulai di x=660 dan terpotong tepi papan (overflow hidden) di x=1020
  slots: [
    { x: 120, y: 160, w: 420, h: 900 },
    { x: 660, y: 160, w: 360, h: 900 },
  ],
  draw: {
    under(ctx) {
      box(ctx, 60, 60, 960, 1230, WALL)
      // garis tinggi badan tiap 80px
      for (let i = 0; i < 12; i++) box(ctx, 60, 100 + i * 80, 960, 2, 'rgba(255,255,255,0.35)')
      box(ctx, 540, 60, 3, 1230, 'rgba(255,255,255,0.25)')
    },
    over(ctx, { texts }) {
      // bayangan inset kotak foto; kotak kanan aslinya 420 lebar, terpotong papan (overflow hidden) di x=1020
      slotInset(ctx, { x: 120, y: 160, w: 420, h: 900 })
      ctx.save()
      ctx.beginPath()
      ctx.rect(60, 60, 960, 1230)
      ctx.clip()
      slotInset(ctx, { x: 660, y: 160, w: 420, h: 900 })
      ctx.restore()
      // angka tinggi: di desain tampak menembus kotak foto transparan; digambar di atas foto supaya tidak terpotong
      for (let i = 0; i < 12; i++) txt(ctx, `${190 - i * 10} cm`, 80, 78 + i * 80, { family: SPECIAL, size: 16, color: 'rgba(255,255,255,0.6)' })
      plate(ctx, join([texts.nama?.trim().toUpperCase(), '0017']), 330)
      plate(ctx, texts.tanggal?.trim() ?? '', 870)

      // sorotan lampu + vinyet: radial-gradient(circle at 50% 38%, ...) di seluruh papan
      const cy = 60 + 1230 * 0.38
      const r = Math.hypot(480, 1230 - (cy - 60))
      box(
        ctx,
        60,
        60,
        960,
        1230,
        radial(ctx, 540, cy, r, [
          [0, 'rgba(255,255,255,0.16)'],
          [0.38, 'rgba(255,255,255,0)'],
          [0.38, 'rgba(0,0,0,0)'],
          [1, 'rgba(0,0,0,0.65)'],
        ]),
      )

      // stempel ARSIP: border 5px, padding 8px 18px, rotate -10°, opacity 0.85
      rotated(ctx, 869, 135, -10, () => {
        ctx.globalAlpha = 0.85
        border(ctx, 800, 110, 138, 50, 5, RED)
        txt(ctx, 'ARSIP', 823, 123, { family: SPECIAL, size: 24, ls: 4.8, color: RED })
        ctx.globalAlpha = 1
      })

      txt(ctx, 'PHOTOBOX DEPT.', 540, 1100, { family: SPECIAL, size: 44, ls: 8.8, color: INK, align: 'center' })
      const ulah = texts.catatan?.trim() || 'terlalu banyak gaya'
      txt(ctx, `pelanggaran: ${ulah}`, 540, 1150, { family: SPECIAL, size: 18, color: INK, align: 'center', maxWidth: 900 })
    },
    top(ctx, { W, H }) {
      vignette(ctx, W, H)
    },
  },
})
