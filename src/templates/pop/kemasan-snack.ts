// Kemasan Snack — design-reference/bold-pop/kemasan-snack.html (600x1800, 3 foto)
import { border, box, measure, text, textMid, type Ctx } from '../paint'
import { BANGERS, FONTS, INK, MONO, TEXTURE, dashedH, detailDots, ellipseBox, photoInset, rotated } from './helpers'
import { pop } from './define'

const BG = '#FF5A36'
/** kartu foto (border 5px, radius 16) per rasa: y kartu; pil label 41px di atasnya */
const CARDS = [365, 758, 1151]

/** strip segel atas/bawah: repeating-linear-gradient(90deg, bg 0 20px, 12% hitam 20px 24px) */
function seal(ctx: Ctx, y: number, h: number) {
  ctx.fillStyle = 'rgba(0,0,0,0.12)'
  for (let x = 20; x < 600; x += 24) ctx.fillRect(x, y, 4, h)
}

const SLOTS = CARDS.map((y) => ({ x: 53, y: y + 13, w: 494, h: 300, radius: 8 }))

export const kemasanSnack = pop({
  id: 'pop-kemasan-snack',
  name: 'kemasan snack',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#F3F0E8',
  fonts: FONTS,
  fields: ['tanggal'],
  texture: TEXTURE,
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      seal(ctx, 0, 70)
      box(ctx, 0, 70, 600, 4, INK)
      seal(ctx, 1734, 66)
      box(ctx, 0, 1730, 600, 4, INK)

      // stiker "BARU!" bulat 160px, rotate 12deg
      rotated(ctx, 480, 170, 12, () => {
        ellipseBox(ctx, 400, 90, 160, 160, '#FFD600', 5, INK)
        textMid(ctx, 'BARU!', 480, 152, 36, { family: BANGERS, size: 36, color: INK, align: 'center' })
      })

      // judul KRIUK FOTO: putih, text-stroke 4px (stroke di bawah fill), text-shadow 6px 6px 0 (hasil ukur: bayangan hanya bentuk fill)
      const title = { family: BANGERS, size: 80, stroke: { color: INK, width: 4 } }
      for (const [s, y] of [['KRIUK', 97], ['FOTO', 169]] as const) {
        text(ctx, s, 46, y + 6, { family: BANGERS, size: 80, color: INK })
        text(ctx, s, 40, y, { ...title, color: '#ffffff' })
      }
      text(ctx, '3 rasa dalam 1 kemasan · tanpa pengawet', 40, 274, { family: MONO, size: 16, weight: 700, color: INK })

      CARDS.forEach((y, i) => {
        const label = `RASA ${i + 1}`
        const w = measure(ctx, label, { family: BANGERS, size: 18 }) + 34
        box(ctx, 40, y - 41, w, 33, '#ffffff', 20)
        border(ctx, 40, y - 41, w, 33, 3, INK, 20)
        text(ctx, label, 57, y - 34, { family: BANGERS, size: 18, color: INK })
        box(ctx, 40, y, 520, 326, '#ffffff', 16)
        border(ctx, 40, y, 520, 326, 5, INK, 16)
      })

      // tabel "Informasi Nilai"
      box(ctx, 40, 1580, 190, 116, '#ffffff')
      border(ctx, 40, 1580, 190, 116, 3, INK)
      text(ctx, 'Informasi Nilai', 55, 1593, { family: MONO, size: 16, weight: 700, color: INK })
      box(ctx, 55, 1617, 160, 3, INK)
      const rows: [string, string][] = [['Senyum', '100%'], ['Pose', '3x'], ['Kalori', '0']]
      rows.forEach(([k, v], i) => {
        text(ctx, k, 55, 1624 + i * 21, { family: MONO, size: 12, color: INK })
        text(ctx, v, 215, 1624 + i * 21, { family: MONO, size: 12, weight: 700, color: INK, align: 'right' })
      })

      // ISI 3 + barcode + tanggal produksi (kolom rata bawah; tanpa tanggal semuanya turun)
      const tanggal = texts.tanggal?.trim() ?? ''
      const dy = tanggal ? 0 : 23
      text(ctx, 'ISI 3', 560, 1599 + dy, { family: BANGERS, size: 26, color: INK, align: 'right' })
      ctx.fillStyle = INK
      for (let x = 0; x < 150; x += 16) {
        ctx.fillRect(410 + x, 1633 + dy, 3, 40)
        ctx.fillRect(410 + x + 5, 1633 + dy, 1, 40)
        if (x + 10 < 150) ctx.fillRect(410 + x + 10, 1633 + dy, Math.min(4, 150 - x - 10), 40)
      }
      if (tanggal) text(ctx, `diproduksi ${tanggal}`, 560, 1679, { family: MONO, size: 12, color: INK, align: 'right', maxWidth: 300 })
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s)
    },
    top(ctx, { W, H }) {
      // garis sobek putus-putus (di atas lapisan noise)
      dashedH(ctx, 0, 84, 600, 3, 'rgba(0,0,0,0.35)', [6, 3])
      dashedH(ctx, 0, 1714, 600, 3, 'rgba(0,0,0,0.35)', [6, 3])
      detailDots(ctx, W, H)
    },
  },
})
