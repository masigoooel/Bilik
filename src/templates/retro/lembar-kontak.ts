// Lembar Kontak — design-reference/retro-vintage/lembar-kontak.html (1200x1800, 6 foto)
import { border, box, dropShadow, linear, radial, text, type Ctx } from '../paint'
import { ellipseRing, glyphText, lineTop, photoInset, premul, rotated } from './helpers'
import { retro } from './define'

const PAPER = '#F4F4F2'
const INK = '#161616'
const RED = '#D7261E'
const AMBER = '#E8A33C'
const MONO = 'IBM Plex Mono'
/** tiga potongan film (blok hitam 1040x462) */
const STRIPS = [135, 633, 1131]

/** kaca pembesar: lingkaran 260 dengan border 16px empat warna (dibagi di diagonal) + gagang (rotate -40deg, origin top) */
function loupe(ctx: Ctx) {
  const cx = 990
  const cy = 1250
  dropShadow(ctx, 860, 1120, 260, 260, 0, 12, 20, 'rgba(0,0,0,0.35)', 130)
  // isi: radial-gradient(circle at 35% 30%, ...) di padding box 228x228
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, 130, 0, Math.PI * 2)
  ctx.clip()
  const px = 876 + 0.35 * 228
  const py = 1136 + 0.3 * 228
  ctx.fillStyle = radial(ctx, px, py, Math.hypot(1104 - px, 1364 - py), premul([[0, 'rgba(255,255,255,0.35)'], [0.6, 'rgba(255,255,255,0.05)'], [1, 'rgba(255,255,255,0.05)']]))
  ctx.fillRect(860, 1120, 260, 260)
  ctx.restore()
  // border: atas, kanan, bawah, kiri
  const cols = ['#e9edf2', '#8f969d', '#6f777f', '#d9dee3']
  cols.forEach((c, i) => {
    const a0 = -Math.PI * 0.75 + (i * Math.PI) / 2
    ctx.beginPath()
    ctx.arc(cx, cy, 130, a0, a0 + Math.PI / 2)
    ctx.arc(cx, cy, 114, a0 + Math.PI / 2, a0, true)
    ctx.closePath()
    ctx.fillStyle = c
    ctx.fill()
  })
  rotated(ctx, 1080, 1340, -40, () => {
    dropShadow(ctx, 1060, 1340, 40, 160, 0, 8, 12, 'rgba(0,0,0,0.35)', 20)
    box(ctx, 1060, 1340, 40, 160, linear(ctx, 1060, 1340, 40, 160, 90, [[0, '#1a1a1a'], [0.5, '#3a3a3a'], [1, '#1a1a1a']]), 20)
  })
}

export const lembarKontak = retro({
  id: 'retro-lembar-kontak',
  name: 'lembar kontak',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: PAPER },
  placeholder: '#3a3a3a',
  fonts: ['Playfair Display:700,900', 'IBM Plex Mono:400,600', 'Permanent Marker', 'VT323'],
  fields: ['tanggal'],
  texture: { opacity: 0.14, blend: 'multiply' },
  slots: STRIPS.flatMap((y) => [
    { x: 110, y: y + 50, w: 480, h: 330 },
    { x: 610, y: y + 50, w: 480, h: 330 },
  ]),
  draw: {
    under(ctx, { texts }) {
      text(ctx, 'ROLL 07 · LEMBAR KONTAK', 80, 70, { family: MONO, size: 22, weight: 600, color: INK })
      text(ctx, texts.tanggal?.trim() ?? '', 1120, 70, { family: MONO, size: 22, weight: 600, color: INK, align: 'right', maxWidth: 560 })

      STRIPS.forEach((y, s) => {
        box(ctx, 80, y, 1040, 462, INK)
        // lubang sprocket atas & bawah: 22 buah, space-between
        for (let i = 0; i < 22; i++) {
          const x = 90 + (i * (1110 - 90 - 22)) / 21
          box(ctx, x, y + 12, 22, 26, PAPER, 4)
          box(ctx, x, y + 424, 22, 26, PAPER, 4)
        }
        const o = { family: MONO, size: 16, color: AMBER }
        glyphText(ctx, '▸', 8.8, ` 0${s * 2 + 1}A`, 316.4, y + 392, o)
        glyphText(ctx, '▸', 8.8, ` 0${s * 2 + 2}A`, 836.4, y + 392, o)
      })

      // coretan spidol merah di bawah
      text(ctx, 'pilihan: 03', 80, 1672, { family: 'Permanent Marker', size: 40, color: RED })
      rotated(ctx, 1061, 1703, -6, () => {
        border(ctx, 1002, 1676, 118, 54, 4, RED)
        text(ctx, 'PROOF', 1022, 1686, { family: MONO, size: 26, weight: 600, color: RED })
      })
    },
    over(ctx) {
      for (const y of STRIPS) {
        photoInset(ctx, 110, y + 50, 480, 330)
      }
      photoInset(ctx, 610, 185, 480, 330)
      // lingkaran pilihan di foto 3 (rotate -4deg); content-box 512x362 + border 6 = 524x374
      // di DOM foto 4 digambar sesudah lingkaran, jadi lingkaran tertutup foto 4
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, 1200, 1800)
      ctx.rect(610, 683, 480, 330)
      ctx.clip('evenodd')
      rotated(ctx, 356, 854, -4, () => ellipseRing(ctx, 94, 667, 524, 374, 6, RED))
      ctx.restore()
      photoInset(ctx, 610, 683, 480, 330)
      photoInset(ctx, 610, 1181, 480, 330)
      // tanda silang di foto 6
      for (const a of [32, -32]) rotated(ctx, 850, 1345, a, () => box(ctx, 700, 1342, 300, 6, RED))
    },
    top(ctx, { W, H }) {
      // lencana ROLL 07 (rotate -10deg), menimpa tepi potongan film pertama; di DOM sesudah lapisan noise
      rotated(ctx, 105, 85, -10, () => {
        dropShadow(ctx, 50, 30, 110, 110, 0, 3, 6, 'rgba(0,0,0,0.3)', 55)
        box(ctx, 50, 30, 110, 110, AMBER, 55)
        const top = 30 + (110 - (16 * 1.1 + 34 * 1.1)) / 2
        text(ctx, 'ROLL', 105, lineTop(ctx, MONO, 16, 1.1, top, 600), { family: MONO, size: 16, weight: 600, color: INK, align: 'center' })
        text(ctx, '07', 105, lineTop(ctx, MONO, 34, 1.1, top + 16 * 1.1, 600), { family: MONO, size: 34, weight: 600, color: INK, align: 'center' })
      })
      // kilau diagonal + kaca pembesar
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 125, premul([[0, 'rgba(255,255,255,0)'], [0.3, 'rgba(255,255,255,0)'], [0.42, 'rgba(255,255,255,0.22)'], [0.55, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']])))
      loupe(ctx)
    },
  },
})
