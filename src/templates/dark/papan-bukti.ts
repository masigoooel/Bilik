// Papan Bukti — design-reference/dark-grunge/papan-bukti.html (1200x1800, 6 foto)
import { border, box, dropShadow, insetShadows, radial, setShadow, svg, type Ctx } from '../paint'
import { dark } from './define'
import { CAVEAT, FONTS, SPECIAL, TEXTURE, join, lineTop, rotated, slotInset, txt, vignette, wrap } from './helpers'

const CORK = '#7A5A3A'
const PAPER = '#f0ece0'
const INK = '#1a1a1a'
const RED = '#D7261E'
const BLUE = '#1F4FC0'

/** polaroid 450x350 (padding 10px 10px 40px): kiri, atas, rotate */
const PHOTOS: [x: number, y: number, rot: number][] = [
  [80, 230, -3],
  [640, 200, 2],
  [100, 760, 1.5],
  [660, 740, -2],
  [90, 1290, -1.5],
  [650, 1270, 3],
]
/** pusat slot sesudah rotasi (hasil ukur desain) */
const SLOTS: [number, number][] = [
  [89.2, 240],
  [650.5, 210],
  [110.4, 770],
  [669.5, 750],
  [99.6, 1300],
  [660.8, 1280],
]
/** benang merah (svg 1200x1800) */
const STRINGS = [
  'M305 236 Q 585 261 865 206',
  'M865 206 Q 875 516 885 746',
  'M305 236 Q 315 541 325 766',
  'M325 766 Q 605 796 885 746',
  'M885 746 Q 880 1051 875 1276',
  'M325 766 Q 320 1071 315 1296',
  'M315 1296 Q 595 1326 875 1276',
  'M865 206 Q 590 791 315 1296',
]

/** paku payung 26px: radial-gradient(circle at 35% 30%, #fff 0, warna 45%, #7a0f0a 100%), bayangan 0 3px 4px */
function pin(ctx: Ctx, x: number, y: number, color: string) {
  ctx.save()
  setShadow(ctx, 0, 3, 4, 'rgba(0,0,0,0.4)')
  ctx.beginPath()
  ctx.arc(x + 13, y + 13, 13, 0, Math.PI * 2)
  ctx.fillStyle = radial(ctx, x + 9.1, y + 7.8, Math.hypot(16.9, 18.2), [
    [0, '#ffffff'],
    [0.45, color],
    [1, '#7a0f0a'],
  ])
  ctx.fill()
  ctx.restore()
}

/** catatan tempel w x h (padding 14px, Caveat 26px line-height 1.05) */
function note(ctx: Ctx, x: number, y: number, w0: number, h0: number, rot: number, bg: string, s: string) {
  rotated(ctx, x + w0 / 2, y + h0 / 2, rot, () => {
    dropShadow(ctx, x, y, w0, h0, 0, 4, 8, 'rgba(0,0,0,0.4)')
    box(ctx, x, y, w0, h0, bg)
    if (s) {
      const o = { family: CAVEAT, size: 26, weight: 700, color: INK }
      // baris dibungkus di lebar konten (w - 28); satu kata panjang boleh melewati padding kanan (seperti desain) sebelum dikecilkan
      let w = wrap(ctx, s, o, w0 - 28, 4)
      if (w.size < o.size) {
        const loose = wrap(ctx, s, o, w0 - 16, 4)
        if (loose.size > w.size) w = loose
      }
      const step = w.size * 1.05
      w.lines.forEach((l, i) => txt(ctx, l, x + 14, lineTop(ctx, CAVEAT, w.size, 1.05, y + 14 + i * step, 700), { ...o, size: w.size }))
    }
    pin(ctx, x + 60, y - 10, BLUE)
  })
}

const SLOT_BOXES = PHOTOS.map(([, , rot], i) => ({ x: SLOTS[i][0], y: SLOTS[i][1], w: 430, h: 300, rotate: rot }))

export const papanBukti = dark({
  id: 'dark-papan-bukti',
  name: 'papan bukti',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: CORK },
  placeholder: '#d8d4c8',
  fonts: [...FONTS, 'Caveat:700'],
  // keterangan bukti = tempat, catatan tempel = catatan ("?") & tanggal
  fields: ['tempat', 'catatan', 'tanggal'],
  texture: TEXTURE,
  slots: SLOT_BOXES,
  draw: {
    under(ctx, { W, H }) {
      // titik gabus: radial-gradient(circle, rgba(0,0,0,0.25) 1px, transparent 2px) 0 0 / 9px 9px
      const c = document.createElement('canvas')
      const k = 4
      c.width = c.height = 9 * k
      const t = c.getContext('2d')!
      t.scale(k, k)
      const g = t.createRadialGradient(4.5, 4.5, 0, 4.5, 4.5, 2)
      g.addColorStop(0, 'rgba(0,0,0,0.25)')
      g.addColorStop(0.5, 'rgba(0,0,0,0.25)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      t.fillStyle = g
      t.fillRect(0, 0, 9, 9)
      const pat = ctx.createPattern(c, 'repeat')!
      pat.setTransform(new DOMMatrix().scale(1 / k))
      ctx.fillStyle = pat
      ctx.fillRect(0, 0, W, H)

      for (const [x, y, rot] of PHOTOS)
        rotated(ctx, x + 225, y + 175, rot, () => {
          dropShadow(ctx, x, y, 450, 350, 0, 6, 14, 'rgba(0,0,0,0.5)')
          box(ctx, x, y, 450, 350, PAPER)
        })
    },
    over(ctx, { texts }) {
      for (const s of SLOT_BOXES) slotInset(ctx, s)
      const tempat = texts.tempat?.trim()
      PHOTOS.forEach(([x, y, rot], i) =>
        rotated(ctx, x + 225, y + 175, rot, () => {
          txt(ctx, join([`BUKTI #${i + 1}`, tempat]), x + 14, y + 324, { family: SPECIAL, size: 18, color: INK, maxWidth: 410 })
          pin(ctx, x + 200, y - 8, RED)
        }),
      )

      const c = texts.catatan?.trim()
      const petunjuk = c ? (/[?!.]$/.test(c) ? c : `${c}?`) : 'ada petunjuk?'
      note(ctx, 560, 70, 150, 150, 6, '#FFE873', petunjuk)
      note(ctx, 1040, 1060, 130, 130, -5, '#FFB3D1', 'siapa yang foto?')
      note(ctx, 520, 1600, 150, 150, 4, '#B6F09C', 'kasus ditutup.')
      note(ctx, 30, 1660, 130, 120, -8, '#FFE873', texts.tanggal?.trim() ?? '')

      // potongan peta 160x160, kisi 20px, rotate -7°
      rotated(ctx, 595, 1205, -7, () => {
        const x = 515
        const y = 1125
        dropShadow(ctx, x, y, 160, 160, 0, 4, 8, 'rgba(0,0,0,0.4)')
        box(ctx, x, y, 160, 160, '#e8e2cf')
        ctx.fillStyle = 'rgba(0,0,0,0.12)'
        for (let d = 0; d < 160; d += 20) ctx.fillRect(x + d, y, 1, 160)
        for (let d = 0; d < 160; d += 20) ctx.fillRect(x, y + d, 160, 1)
        // <svg> memotong goresan di luar viewport 160x160
        ctx.save()
        ctx.beginPath()
        ctx.rect(x, y, 160, 160)
        ctx.clip()
        svg(ctx, 'M0 60 C 40 50, 70 90, 160 70 M50 0 C 60 60, 40 100, 70 160', x, y, 160, 160, 160, 160, { stroke: '#7a5a3a', lineWidth: 4 })
        ctx.beginPath()
        ctx.arc(x + 78, y + 78, 26, 0, Math.PI * 2)
        ctx.strokeStyle = RED
        ctx.lineWidth = 4
        ctx.stroke()
        ctx.restore()
        pin(ctx, x + 70, y - 10, BLUE)
      })
    },
    top(ctx, { W, H }) {
      vignette(ctx, W, H)
      // di desain: benang (z 4), label kasus (z 5), bingkai papan (z 6) berada di atas lapisan noise
      svg(ctx, STRINGS, 0, 0, 1200, 1800, 1200, 1800, { stroke: RED, lineWidth: 3 })

      box(ctx, 80, 60, 363.9, 74, INK)
      border(ctx, 80, 60, 363.9, 74, 3, PAPER)
      txt(ctx, 'KASUS 0017', 107, 75, { family: SPECIAL, size: 44, ls: 6.6, color: PAPER })

      border(ctx, 0, 0, 1200, 1800, 36, '#3a2a1a')
      insetShadows(ctx, 36, 36, 1128, 1728, [{ dx: 0, dy: 0, blur: 40, color: 'rgba(0,0,0,0.6)' }])
    },
  },
})
