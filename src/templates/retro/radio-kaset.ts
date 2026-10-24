// Radio Kaset — design-reference/retro-vintage/radio-kaset.html (1080x1350, 2 foto)
import { box, dropShadow, insetShadows, linear, measure, radial, text, type Ctx } from '../paint'
import { retro } from './define'
import {
  blurredEllipse,
  conicStripes,
  dotFill,
  ellipseGlow,
  insetRing,
  METAL,
  METAL_H,
  photoInset,
  repeatingLinear,
  rotated,
} from './helpers'

const BG = '#D9CDB8'
const LIGHT = '#e9e4d8'
const MONO = 'IBM Plex Mono'
const SPEAKERS = [100, 650]

/** speaker bulat 330: cincin logam, kisi titik, cincin hitam di sekeliling foto */
function speaker(ctx: Ctx, x: number) {
  const y = 430
  const cx = x + 165
  const cy = y + 165
  dropShadow(ctx, x, y, 330, 330, 0, 4, 8, 'rgba(0,0,0,0.5)', 165)
  box(ctx, x, y, 330, 330, linear(ctx, x, y, 330, 330, 180, METAL), 165)
  // kisi: titik radial 8x8 di atas linear-gradient(160deg, #6a6a72, #2a2a2e)
  box(ctx, x + 12, y + 12, 306, 306, linear(ctx, x + 12, y + 12, 306, 306, 160, [[0, '#6a6a72'], [1, '#2a2a2e']]), 153)
  ctx.beginPath()
  ctx.arc(cx, cy, 153, 0, Math.PI * 2)
  dotFill(ctx, x + 12, y + 12, 8, 'rgba(0,0,0,0.55)', 1.6, 2.2)
  insetRing(ctx, x + 12, y + 12, 306, 306, 3, '#1a1a1a', 153)
  // box-shadow: 0 0 0 6px #1a1a1a di wadah foto
  ctx.beginPath()
  ctx.arc(cx, cy, 123, 0, Math.PI * 2)
  ctx.fillStyle = '#1a1a1a'
  ctx.fill()
}

/** lapisan di atas foto bulat: inset foto, kisi titik (opacity 0.55), vignette, tutup tengah */
function speakerOver(ctx: Ctx, x: number) {
  const px = x + 48
  const py = 478
  const cx = px + 117
  const cy = py + 117
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, 117, 0, Math.PI * 2)
  ctx.clip()
  photoInset(ctx, px, py, 234, 234)
  ctx.globalAlpha = 0.55
  ctx.beginPath()
  ctx.rect(px, py, 234, 234)
  dotFill(ctx, px, py, 8, 'rgba(0,0,0,0.55)', 1.6, 2.2)
  ctx.globalAlpha = 1
  ctx.fillStyle = radial(ctx, cx, cy, 117 * Math.SQRT2, [[0, 'rgba(0,0,0,0)'], [0.5, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.45)']])
  ctx.fillRect(px, py, 234, 234)
  ctx.restore()
  dropShadow(ctx, x + 155, 585, 20, 20, 0, 2, 3, 'rgba(0,0,0,0.5)', 10)
  box(ctx, x + 155, 585, 20, 20, linear(ctx, x + 155, 585, 20, 20, 180, METAL), 10)
}

/** VU meter 120x70 (jarum rotate di titik bawah) */
function vu(ctx: Ctx, y: number, deg: number, label: string) {
  box(ctx, 480, y, 120, 70, linear(ctx, 480, y, 120, 70, 180, [[0, '#f2e6b8'], [1, '#d9c98a']]), 6)
  insetRing(ctx, 480, y, 120, 70, 3, '#1a1a1a', 6)
  repeatingLinear(ctx, 490, y + 14, 100, 2, 90, 10, [[0, 2, '#2a2a2e']])
  box(ctx, 558, y + 10, 30, 4, '#c42a1e')
  rotated(ctx, 541, y + 64, deg, () => box(ctx, 540, y + 12, 2, 52, '#1a1a1a'))
  text(ctx, label, 486, y + 55, { family: MONO, size: 9, weight: 700, color: LIGHT })
}

/** kenop kecil 40: conic 10deg + poros logam 20 */
function knob(ctx: Ctx, x: number, label: string, labelX: number) {
  dropShadow(ctx, x, 726, 40, 40, 0, 3, 4, 'rgba(0,0,0,0.5)', 20)
  conicStripes(ctx, x + 20, 746, 20, '#2a2a2e', '#4a4a4e', 10)
  box(ctx, x + 10, 736, 20, 20, linear(ctx, x + 10, 736, 20, 20, 180, METAL), 10)
  text(ctx, label, labelX, 770, { family: MONO, size: 9, color: LIGHT })
}

export const radioKaset = retro({
  id: 'retro-radio-kaset',
  name: 'radio kaset',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'solid', color: BG },
  placeholder: '#cfcac0',
  fonts: ['Playfair Display:700,900,700i', 'IBM Plex Mono:400,600', 'Caveat:700', 'VT323'],
  fields: ['nama', 'tanggal'],
  slots: SPEAKERS.map((x) => ({ x: x + 48, y: 478, w: 234, h: 234, radius: 117 })),
  draw: {
    under(ctx, { texts, W, H }) {
      // latar: radial-gradient(ellipse at 50% 30%, #f3ede2, bg 75%)
      ellipseGlow(ctx, 0, 0, W, H, 540, 405, 540 * Math.SQRT2, 945 * Math.SQRT2, [[0, '#f3ede2'], [0.75, BG], [1, BG]])

      // antena (rotate 28deg, origin bawah) + bola ujung
      rotated(ctx, 725, 380, 28, () => box(ctx, 720, 40, 10, 340, linear(ctx, 720, 40, 10, 340, 90, METAL_H), 5))
      box(ctx, 878, 64, 16, 16, linear(ctx, 878, 64, 16, 16, 180, METAL), 8)

      // gagang: border 26px (atas #9aa0a7, kanan #6f777f, kiri #c9ced6), radius 55 55 0 0, tanpa border bawah
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(300, 310)
      ctx.lineTo(300, 255)
      ctx.arcTo(300, 200, 355, 200, 55)
      ctx.lineTo(725, 200)
      ctx.arcTo(780, 200, 780, 255, 55)
      ctx.lineTo(780, 310)
      ctx.lineTo(754, 310)
      ctx.lineTo(754, 255)
      ctx.arcTo(754, 226, 725, 226, 29)
      ctx.lineTo(355, 226)
      ctx.arcTo(326, 226, 326, 255, 29)
      ctx.lineTo(326, 310)
      ctx.closePath()
      ctx.clip()
      ctx.fillStyle = '#9aa0a7'
      ctx.fillRect(300, 200, 480, 110)
      ctx.fillStyle = '#c9ced6'
      ctx.beginPath()
      // sambungan warna border di sudut: garis diagonal 45deg dari sudut luar (seperti Chrome)
      ctx.moveTo(300, 200)
      ctx.lineTo(411, 311)
      ctx.lineTo(299, 311)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#6f777f'
      ctx.beginPath()
      ctx.moveTo(780, 200)
      ctx.lineTo(669, 311)
      ctx.lineTo(781, 311)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      repeatingLinear(ctx, 330, 196, 420, 26, 90, 10, [[0, 6, '#2a2a2e'], [6, 10, '#3a3a3e']], 13)

      // badan radio
      dropShadow(ctx, 60, 290, 960, 680, 0, 30, 46, 'rgba(0,0,0,0.4)', 30)
      box(ctx, 60, 290, 960, 680, linear(ctx, 60, 290, 960, 680, 180, [[0, '#4a4a50'], [1, '#2a2a2e']]), 30)
      repeatingLinear(ctx, 60, 290, 960, 680, 0, 4, [[0, 2, 'rgba(255,255,255,0.025)']], 30)
      insetShadows(ctx, 60, 290, 960, 680, [
        { dx: 0, dy: 3, color: 'rgba(255,255,255,0.18)' },
        { dx: 0, dy: -6, blur: 12, color: 'rgba(0,0,0,0.4)' },
      ], 30)
      box(ctx, 60, 308, 960, 4, linear(ctx, 60, 308, 960, 4, 90, METAL_H))

      // layar tuner
      box(ctx, 100, 330, 880, 66, '#111111', 10)
      insetRing(ctx, 100, 330, 880, 66, 3, '#555555', 10)
      ;['88', '92', '96', '100', '104', '108'].forEach((s, i) => text(ctx, s, 126 + 58 * i, 334, { family: MONO, size: 10, color: LIGHT }))
      repeatingLinear(ctx, 114, 380, 746, 2, 90, 14, [[0, 2, LIGHT]])
      dropShadow(ctx, 576.5, 336, 3, 54, 0, 0, 6, '#ff4a3a')
      box(ctx, 576.5, 336, 3, 54, '#ff4a3a')
      text(ctx, 'FM · AM', 909.4, 352, { family: MONO, size: 13, weight: 600, color: LIGHT })

      for (const x of SPEAKERS) speaker(ctx, x)

      // dek kaset tengah
      box(ctx, 455, 430, 170, 110, '#111111', 8)
      insetRing(ctx, 455, 430, 170, 110, 4, '#5a5a5e', 8)
      box(ctx, 467, 444, 146, 82, '#2a2a2e', 4)
      box(ctx, 467, 444, 146, 82, linear(ctx, 467, 444, 146, 82, 120, [[0, 'rgba(255,255,255,0.25)'], [0.4, 'rgba(255,255,255,0.05)'], [1, 'rgba(255,255,255,0.05)']]), 4)
      box(ctx, 473, 450, 134, 22, '#f1ead8')
      text(ctx, 'sisi A', 479, 450, { family: 'Caveat', size: 15, weight: 700, color: '#2b2116' })
      for (const rx of [489, 561]) {
        const R = 15 * Math.SQRT2
        box(ctx, rx, 484, 30, 30, radial(ctx, rx + 15, 499, R, [[0, LIGHT], [0.25, LIGHT], [0.26, '#3a2416'], [1, '#3a2416']]), 15)
      }
      vu(ctx, 554, -20, 'L')
      vu(ctx, 638, -8, 'R')
      knob(ctx, 466, 'VOL', 477.9)
      knob(ctx, 520, 'TONE', 529.2)
      knob(ctx, 574, 'TUNE', 583.2)

      // tombol kaset
      const glyphs: [string, number][] = [['●', 906], ['◀◀', 906.5], ['▶', 906.5], ['▶▶', 906.5], ['■', 906], ['❚❚', 906.5]]
      glyphs.forEach(([g, gy], i) => {
        const bx = 100 + 52 * i
        const r: [number, number, number, number] = [4, 4, 2, 2]
        dropShadow(ctx, bx, 896, 46, 38, 0, 4, 0, '#3a3a3e', r)
        const fill = i === 0 ? linear(ctx, bx, 896, 46, 38, 180, [[0, '#ff6a5a'], [1, '#c42a1e']]) : linear(ctx, bx, 896, 46, 38, 180, METAL)
        box(ctx, bx, 896, 46, 38, fill, r)
        insetShadows(ctx, bx, 896, 46, 38, [{ dx: 0, dy: 1, color: '#ffffff' }], r)
        // ■ dari font cadangan di canvas jauh lebih kecil: gambar kotak hasil ukur (8x8)
        if (g === '■') box(ctx, bx + 19, 912, 8, 8, '#2a2a2e')
        else text(ctx, g, bx + 23, gy, { family: MONO, size: 14, weight: 700, color: i === 0 ? '#ffffff' : '#2a2a2e', align: 'center' })
      })

      // lampu + pelat "[NAMA] stereo" (lebar mengikuti teks, rata kanan di x 976)
      const nama = texts.nama?.trim()
      const plate = nama ? `${nama} stereo` : 'stereo'
      const pf = { family: 'Playfair Display', size: 22, weight: 900, italic: true }
      const tw = Math.min(measure(ctx, plate, pf), 380)
      const plx = 976 - (tw + 24)
      box(ctx, plx, 888, tw + 24, 42, linear(ctx, plx, 888, tw + 24, 42, 180, METAL), 4)
      text(ctx, plate, plx + 12, 894, { ...pf, color: '#2a2a2e', maxWidth: 380 })
      dropShadow(ctx, plx - 24, 904, 10, 10, 0, 0, 8, '#ff4a3a', 5)
      box(ctx, plx - 24, 904, 10, 10, '#ff4a3a', 5)

      blurredEllipse(ctx, 200, 960, 680, 40, 14, 'rgba(0,0,0,0.25)')

      const tgl = texts.tanggal?.trim()
      text(ctx, tgl ? `lagu kesukaan · ${tgl}` : 'lagu kesukaan', 540, 1060, { family: MONO, size: 15, color: '#6b5d48', align: 'center', maxWidth: 940 })
    },
    over(ctx) {
      for (const x of SPEAKERS) speakerOver(ctx, x)
    },
  },
})
