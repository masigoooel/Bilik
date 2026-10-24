// Kamera Instan — design-reference/retro-vintage/kamera-instan.html (1080x1350, 1 foto)
import { box, dropShadow, insetShadows, linear, measure, radial, text, type Ctx } from '../paint'
import { retro } from './define'
import {
  conicStripes,
  ellipseGlow,
  insetRing,
  METAL,
  METAL_H,
  parseTanggal,
  photoInset,
  premul,
  repeatingLinear,
  rotated,
} from './helpers'

const MONO = 'IBM Plex Mono'
const CREAM = '#e9e4d8'
const PF = { family: 'Playfair Display', size: 22, weight: 900, italic: true }

/** elips berputar (div border-radius 50% + rotate) */
function tiltedEllipse(ctx: Ctx, x: number, y: number, w: number, h: number, deg: number, color: string) {
  rotated(ctx, x + w / 2, y + h / 2, deg, () => {
    ctx.beginPath()
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  })
}

/** badan kamera (grup dengan filter: drop-shadow(0 28px 30px rgba(0,0,0,0.45))) */
function camera(ctx: Ctx, nama: string) {
  // filter drop-shadow: blur = deviasi standar (2x nilai box-shadow)
  dropShadow(ctx, 150, 90, 780, 560, 0, 28, 60, 'rgba(0,0,0,0.45)', [46, 46, 34, 34])

  // bagian atas krem + bawah gelap
  box(ctx, 150, 90, 780, 300, linear(ctx, 150, 90, 780, 300, 180, [[0, '#f6f2e9'], [1, '#e3ddcf']]), [46, 46, 0, 0])
  insetShadows(ctx, 150, 90, 780, 300, [
    { dx: 0, dy: 4, color: '#ffffff' },
    { dx: 0, dy: -3, color: 'rgba(0,0,0,0.08)' },
  ], [46, 46, 0, 0])
  box(ctx, 150, 390, 780, 260, linear(ctx, 150, 390, 780, 260, 180, [[0, '#3a3532'], [1, '#24201e']]), [0, 0, 34, 34])
  repeatingLinear(ctx, 150, 390, 780, 260, 0, 4, [[0, 2, 'rgba(255,255,255,0.03)']], [0, 0, 34, 34])
  insetShadows(ctx, 150, 390, 780, 260, [{ dx: 0, dy: 3, color: 'rgba(255,255,255,0.12)' }], [0, 0, 34, 34])

  // garis pelangi
  const cols = ['#E2483C', '#E8A33C', '#F2D24A', '#3FA76B', '#2E7BE2', '#7A4DB0']
  const stops = [0, 0.16, 0.33, 0.5, 0.67, 0.84, 1]
  cols.forEach((c, i) => {
    ctx.fillStyle = c
    // hard stop gradien dibulatkan ke piksel penuh (seperti Chrome)
    const x0 = Math.round(64 * stops[i])
    ctx.fillRect(220 + x0, 90, Math.round(64 * stops[i + 1]) - x0, 560)
  })

  // jendela bidik
  dropShadow(ctx, 320, 130, 140, 96, 0, 2, 0, '#ffffff', 14)
  box(ctx, 320, 130, 140, 96, '#1a1a1a', 14)
  insetRing(ctx, 320, 130, 140, 96, 7, '#4a4a4a', 14)
  box(ctx, 336, 146, 108, 64, linear(ctx, 336, 146, 108, 64, 135, [[0, '#5a6a7a'], [0.6, '#1a2028'], [1, '#1a2028']]), 6)
  insetRing(ctx, 336, 146, 108, 64, 2, '#000000', 6)
  tiltedEllipse(ctx, 346, 154, 40, 16, -20, 'rgba(255,255,255,0.35)')

  // lampu kilat
  box(ctx, 670, 124, 200, 70, CREAM, 10)
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(670, 124, 200, 70, 10)
  ctx.clip()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(670, 124, 200, 14)
  ctx.restore()
  insetRing(ctx, 670, 124, 200, 70, 4, '#c9c2b0', 10)
  repeatingLinear(ctx, 684, 134, 172, 50, 90, 8, [[0, 4, 'rgba(255,255,255,0.9)'], [4, 8, 'rgba(220,215,200,0.9)']], 4)

  // lensa: cincin fokus (conic) + angka jarak
  dropShadow(ctx, 405, 210, 270, 270, 0, 10, 18, 'rgba(0,0,0,0.45)', 135)
  conicStripes(ctx, 540, 345, 135, '#2a2a2a', '#3c3c3c', 5)
  insetRing(ctx, 405, 210, 270, 270, 3, '#111111', 135)
  const marks: [string, number][] = [['∞', -90], ['10', -60], ['5', -30], ['3', 0], ['2', 30], ['1.5', 60], ['1', 90]]
  for (const [s, a] of marks) {
    const r = (a * Math.PI) / 180
    text(ctx, s, 540 + 118 * Math.sin(r), 338 - 118 * Math.cos(r), { family: MONO, size: 11, color: CREAM, align: 'center' })
  }
  box(ctx, 445, 250, 190, 190, linear(ctx, 445, 250, 190, 190, 180, METAL), 95)
  insetRing(ctx, 445, 250, 190, 190, 3, 'rgba(0,0,0,0.3)', 95)
  const R = 77 * Math.SQRT2
  box(ctx, 463, 268, 154, 154, radial(ctx, 540, 345, R, [
    [0, '#0a0a0c'], [0.3, '#0a0a0c'], [0.31, '#22283a'], [0.46, '#22283a'], [0.47, '#0d0f16'],
    [0.7, '#0d0f16'], [0.71, '#3a3f4a'], [0.73, '#3a3f4a'], [0.74, '#14161c'], [1, '#14161c'],
  ]), 77)
  insetShadows(ctx, 463, 268, 154, 154, [{ dx: 0, dy: 0, blur: 18, color: 'rgba(0,0,0,0.9)' }], 77)
  tiltedEllipse(ctx, 497, 294, 46, 28, -30, 'rgba(255,255,255,0.45)')
  tiltedEllipse(ctx, 559, 364, 16, 10, 0, 'rgba(160,200,255,0.4)')

  // tombol rana merah
  dropShadow(ctx, 750, 240, 96, 96, 0, 4, 6, 'rgba(0,0,0,0.3)', 48)
  box(ctx, 750, 240, 96, 96, linear(ctx, 750, 240, 96, 96, 180, METAL), 48)
  dropShadow(ctx, 763, 253, 70, 70, 0, 5, 0, '#7a1a10', 35)
  box(ctx, 763, 253, 70, 70, radial(ctx, 787.5, 274, Math.hypot(833 - 787.5, 323 - 274), [[0, '#ff7a6a'], [0.7, '#c42a1e'], [1, '#c42a1e']]), 35)

  // pelat "[NAMA] 1000" (lebar mengikuti teks)
  const plate = `${nama} 1000`
  const tw = Math.min(measure(ctx, plate, PF), 300)
  dropShadow(ctx, 740, 360, tw + 24, 42, 0, 2, 3, 'rgba(0,0,0,0.3)', 4)
  box(ctx, 740, 360, tw + 24, 42, linear(ctx, 740, 360, tw + 24, 42, 180, METAL), 4)
  text(ctx, plate, 752, 366, { ...PF, color: '#2a2a2e', maxWidth: 300 })

  // pengatur terang-gelap
  text(ctx, 'GELAP', 750, 430, { family: MONO, size: 11, color: '#c9c2b0' })
  box(ctx, 791, 432, 110, 10, '#111111', 5)
  insetRing(ctx, 791, 432, 110, 10, 1, '#555555', 5)
  box(ctx, 843, 427, 10, 20, linear(ctx, 843, 427, 10, 20, 90, METAL_H), 3)
  text(ctx, 'TERANG', 909, 430, { family: MONO, size: 11, color: '#c9c2b0' })

  // celah keluar film
  box(ctx, 300, 590, 480, 22, '#0a0a0a', 11)
  insetShadows(ctx, 300, 590, 480, 22, [{ dx: 0, dy: 4, blur: 6, color: 'rgba(0,0,0,0.9)' }], 11)
}

export const kameraInstan = retro({
  id: 'retro-kamera-instan',
  name: 'kamera instan',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#7a4f2a' },
  placeholder: '#E4E2DD',
  fonts: ['Playfair Display:700,900,700i', 'IBM Plex Mono:400,600', 'Caveat:700', 'VT323'],
  fields: ['nama', 'tanggal'],
  slots: [{ x: 316, y: 626, w: 448, h: 448 }],
  draw: {
    under(ctx, { texts, W, H }) {
      // meja kayu
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 180, [[0, '#7a4f2a'], [1, '#5a3518']]))
      repeatingLinear(ctx, 0, 0, W, H, 92, 23, [[9, 10, 'rgba(0,0,0,0.10)'], [22, 23, 'rgba(255,230,190,0.07)']])
      vignetteAt(ctx, W, H)

      const nama = texts.nama?.trim()
      camera(ctx, nama || 'bilik')

      // lembar foto instan
      dropShadow(ctx, 290, 600, 500, 640, 0, 18, 30, 'rgba(0,0,0,0.35)')
      box(ctx, 290, 600, 500, 640, linear(ctx, 290, 600, 500, 640, 180, [[0, '#fbfaf6'], [1, '#f1eee6']]))
      insetRing(ctx, 290, 600, 500, 640, 1, 'rgba(0,0,0,0.05)')

      // "[NAMA], 1979": tahun dari teks tanggal
      const p = parseTanggal(texts.tanggal)
      const cap = [nama, p ? String(p.y) : ''].filter(Boolean).join(', ')
      text(ctx, cap, 320, 1154, { family: 'Caveat', size: 40, weight: 700, color: '#2E5E8C', maxWidth: 370 })
      box(ctx, 704, 1182, 60, 14, 'rgba(0,0,0,0.06)', 7)

      text(ctx, 'tunggu sebentar, gambar akan muncul', 540, 1290, { family: MONO, size: 14, color: '#e9dcc4', align: 'center' })
    },
    over(ctx) {
      photoInset(ctx, 316, 626, 448, 448)
      // gambar yang belum muncul penuh: gradien kebiruan (mix-blend-mode: multiply)
      ctx.save()
      ctx.globalCompositeOperation = 'multiply'
      box(ctx, 316, 626, 448, 448, linear(ctx, 316, 626, 448, 448, 180, premul([[0, 'rgba(60,70,90,0.55)'], [0.45, 'rgba(60,70,90,0.25)'], [0.75, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0)']])))
      ctx.restore()
      // bayangan celah kamera di tepi atas lembar foto
      box(ctx, 290, 600, 500, 40, linear(ctx, 290, 600, 500, 40, 180, premul([[0, 'rgba(0,0,0,0.35)'], [1, 'rgba(0,0,0,0)']])))
    },
  },
})

/** radial-gradient(ellipse at 30% 15%, hangat 0.35, transparent 50%) di atas radial-gradient(ellipse at 50% 60%, transparent 55%, rgba(0,0,0,0.35)) */
function vignetteAt(ctx: Ctx, W: number, H: number) {
  ellipseGlow(ctx, 0, 0, W, H, 540, 810, 540 * Math.SQRT2, 810 * Math.SQRT2, premul([[0, 'rgba(0,0,0,0)'], [0.55, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.35)']]))
  ellipseGlow(ctx, 0, 0, W, H, 324, 202.5, 756 * Math.SQRT2, 1147.5 * Math.SQRT2, premul([[0, 'rgba(255,230,190,0.35)'], [0.5, 'rgba(255,230,190,0)'], [1, 'rgba(255,230,190,0)']]))
}
