// Rak Kartu Pos — design-reference/travel/rak-kartu-pos.html (1200x1800 4R, 4 foto)
import { box, dropShadow, linear, type Ctx } from '../paint'
import { travel } from './define'
import { daftarTempat, disc, INK, lineBox, lineTop, MONO, photoInset, rotated, rotSlot, SERIF, tahun, txt } from './helpers'

const CREAM = '#F6F1E4'
const HAND = 'Caveat'
const HAND_STACK = 'Caveat, cursive'

/** kartu foto 440x330 (padding 14): x, y, rotasi, warna label kota */
const CARDS = [
  { x: 150, y: 260, rot: -3, c: '#C0392B' },
  { x: 620, y: 250, rot: 3, c: '#2E5E8C' },
  { x: 140, y: 740, rot: 2, c: '#3C7A55' },
  { x: 630, y: 750, rot: -2, c: '#E8A33C' },
]
const SLOTS = CARDS.map((c) => rotSlot(c.x + 220, c.y + 165, c.x + 220, c.y + 165, 412, 302, c.rot))
const inCard = (ctx: Ctx, c: (typeof CARDS)[number], draw: () => void) => rotated(ctx, c.x + 220, c.y + 165, c.rot, draw)

/** kartu pos kecil di rak bawah: rotasi, gradien gambar (stop keras), warna matahari, tulisan */
const MINI = [
  { rot: -3, bands: [[0.45, '#f6c9a0'], [0.7, '#6aa9c9'], [1, '#e9d9a8']], sun: '#fff6c0', word: 'salam!' },
  { rot: 2, bands: [[0.55, '#9ab8d9'], [0.8, '#6a8a5a'], [1, '#4a6a3a']], sun: '#ffffff', word: 'rindu' },
  { rot: -1, bands: [[0.5, '#f2a07a'], [0.75, '#8a6aa9'], [1, '#3a3a5a']], sun: '#ffe6a0', word: 'pulang' },
  { rot: 3, bands: [[0.6, '#c9e2f2'], [1, '#3a7aa9']], sun: '#ffffff', word: 'lagi' },
] as const

/** prangko: bingkai krem berlubang (radial-gradient 10px, lubang r≈3.5 di tiap titik kelipatan 10) */
const STAMPS = [
  { x: 520, y: 280, rot: 6, c: '#2E5E8C' },
  { x: 990, y: 270, rot: -4, c: '#C0392B' },
  { x: 510, y: 760, rot: -5, c: '#3C7A55' },
  { x: 1000, y: 770, rot: 5, c: '#E8A33C' },
]

function stamp(ctx: Ctx, s: (typeof STAMPS)[number]) {
  rotated(ctx, s.x + 30, s.y + 36, s.rot, () => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(s.x, s.y, 60, 72)
    ctx.clip()
    ctx.beginPath()
    ctx.rect(s.x, s.y, 60, 72)
    for (let i = 0; i <= 6; i++) {
      for (let j = 0; j <= 7; j++) {
        // titik di dalam isi berwarna tertutup; cukup titik di pinggir
        if (i > 0 && i < 6 && j > 0 && j < 7) continue
        ctx.moveTo(s.x + i * 10 + 3.5, s.y + j * 10)
        ctx.arc(s.x + i * 10, s.y + j * 10, 3.5, 0, Math.PI * 2)
      }
    }
    ctx.fillStyle = CREAM
    ctx.fill('evenodd')
    ctx.restore()
    box(ctx, s.x + 5, s.y + 5, 50, 62, s.c)
  })
}

function rackBar(ctx: Ctx, y: number) {
  const poly = (pts: [number, number][], c: string) => {
    ctx.beginPath()
    pts.forEach(([px, py], k) => (k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)))
    ctx.closePath()
    ctx.fillStyle = c
    ctx.fill()
  }
  const b = y + 70
  poly([[160, y], [166, y], [166, b - 8], [160, b]], '#8f969d')
  poly([[1034, y], [1040, y], [1040, b], [1034, b - 8]], '#8f969d')
  poly([[160, b], [166, b - 8], [1034, b - 8], [1040, b]], '#6f777f')
}

function mini(ctx: Ctx, i: number) {
  const m = MINI[i]
  const x = 170 + i * 220
  const y = 1230
  rotated(ctx, x + 100, y + 140, m.rot, () => {
    dropShadow(ctx, x, y, 200, 280, 0, 6, 10, 'rgba(0,0,0,0.25)')
    box(ctx, x, y, 200, 280, CREAM)
    // gambar 180x200 (overflow hidden)
    const px = x + 10
    const py = y + 10
    ctx.save()
    ctx.beginPath()
    ctx.rect(px, py, 180, 200)
    ctx.clip()
    let from = 0
    for (const [to, c] of m.bands) {
      ctx.fillStyle = c
      ctx.fillRect(px, py + from * 200, 180, (to - from) * 200)
      from = to
    }
    dropShadow(ctx, px + 120, py + 30, 46, 46, 0, 0, 20, m.sun, 23)
    disc(ctx, px + 120, py + 30, 46, m.sun)
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    for (let b = py + 200; b > py + 120; b -= 8) ctx.fillRect(px, b - 2, 180, 2)
    ctx.restore()
    txt(ctx, m.word, px, lineTop(ctx, HAND, 30, 1, y + 218, 700), { family: HAND, size: 30, weight: 700, color: INK })
    txt(ctx, 'kartu pos · Rp 5.000', px, y + 254, { family: MONO, size: 9, color: '#6b5d48' })
    box(ctx, px, py, 180, 200, linear(ctx, px, py, 180, 200, 120, [[0, 'rgba(255,255,255,0.3)'], [0.35, 'rgba(255,255,255,0)']]))
  })
}

export const rakKartuPos = travel({
  id: 'travel-rak-kartu-pos',
  name: 'rak kartu pos',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#e1d9c8' },
  placeholder: '#cfe2f2',
  fonts: ['Libre Caslon Text:400,700', 'Space Mono:400,700', 'Caveat:700'],
  fields: ['tempat', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 180, [[0, '#e9e3d2'], [1, '#d9cfbe']]))
      txt(ctx, 'Kartu Pos', 600, 60, { family: SERIF, size: 80, weight: 700, color: INK, align: 'center' })
      const tempat = texts.tempat?.trim()
      txt(ctx, tempat ? `toko cendera mata ${tempat} · Rp 5.000 / lembar` : 'toko cendera mata · Rp 5.000 / lembar', 600, 163, {
        family: MONO, size: 15, color: INK, align: 'center', maxWidth: 1100,
      })

      // tiang + kaki rak
      box(ctx, 590, 230, 20, 1450, linear(ctx, 590, 230, 20, 1450, 90, [
        [0, '#8f969d'], [0.3, '#e9edf2'], [0.55, '#6f777f'], [0.8, '#d9dee3'], [1, '#8f969d'],
      ]))
      box(ctx, 470, 1660, 260, 30, linear(ctx, 470, 1660, 260, 30, 180, [
        [0, '#f4f6f8'], [0.3, '#b9c0c8'], [0.5, '#6f777f'], [0.7, '#d9dee3'], [1, '#8f969d'],
      ]), 15)

      // kartu foto (kilau & teks "© foto" di desain tertutup foto: tidak tampak)
      for (const c of CARDS) {
        inCard(ctx, c, () => {
          dropShadow(ctx, c.x, c.y, 440, 330, 0, 8, 12, 'rgba(0,0,0,0.3)')
          box(ctx, c.x, c.y, 440, 330, CREAM)
          // sudut terlipat: linear-gradient(315deg) di 40x40 kanan bawah
          box(ctx, c.x + 400, c.y + 290, 40, 40, linear(ctx, c.x + 400, c.y + 290, 40, 40, 315, [
            [0, '#d9d2c2'], [0.48, '#d9d2c2'], [0.5, 'rgba(0,0,0,0.2)'], [0.56, 'rgba(0,0,0,0)'],
          ]))
        })
      }
    },
    over(ctx, { texts }) {
      const kota = daftarTempat(texts.tempat, 4)
      CARDS.forEach((c, i) => {
        inCard(ctx, c, () => {
          photoInset(ctx, { x: c.x + 14, y: c.y + 14, w: 412, h: 302 })
          if (!kota[i]) return
          // label kota: padding 4 12, Libre Caslon 26 bold, kiri-bawah foto (14px)
          const o = { family: SERIF, size: 26, weight: 700, color: '#fff', maxWidth: 360 }
          ctx.save()
          ctx.font = `700 26px "${SERIF}"`
          const tw = Math.min(360, ctx.measureText(kota[i]).width)
          ctx.restore()
          const h = 8 + lineBox(ctx, SERIF, 26, 700)
          const by = c.y + 302 - h
          dropShadow(ctx, c.x + 28, by, tw + 24, h, 0, 2, 3, 'rgba(0,0,0,0.3)')
          box(ctx, c.x + 28, by, tw + 24, h, c.c)
          txt(ctx, kota[i], c.x + 40, by + 4, o)
        })
      })

      rackBar(ctx, 532)
      rackBar(ctx, 1024)
      for (let i = 0; i < 4; i++) mini(ctx, i)
      for (const x of [140, 1060]) box(ctx, x, 230, 2, 1430, linear(ctx, x, 230, 2, 1430, 90, [[0, '#8f969d'], [1, '#d9dee3']]))
      for (const [x, y] of [[345, 244], [815, 234], [335, 724], [825, 734]]) {
        dropShadow(ctx, x, y, 50, 26, 0, 2, 3, 'rgba(0,0,0,0.35)', 4)
        box(ctx, x, y, 50, 26, linear(ctx, x, y, 50, 26, 180, [[0, '#e9edf2'], [1, '#8f969d']]), 4)
      }
      dropShadow(ctx, 470, 193, 260, 50, 0, 3, 4, 'rgba(0,0,0,0.3)', 6)
      box(ctx, 470, 193, 260, 50, '#C0392B', 6)
      txt(ctx, '3 lembar 12rb', 600, 193 + (50 - lineBox(ctx, MONO, 16, 700)) / 2, { family: MONO, size: 16, weight: 700, color: '#fff', align: 'center' })
      for (const s of STAMPS) stamp(ctx, s)

      // stiker bawah: kota, hati, tahun, matahari
      const year = tahun(texts.tanggal)
      const stickers: [number, string, number, string][] = [
        [160, '#C0392B', 35, kota[0]], [250, '#2E5E8C', 12, '♥'], [900, '#3C7A55', 35, year], [990, '#E8A33C', 12, '☼'],
      ]
      for (const [x, c, r, t] of stickers) {
        dropShadow(ctx, x, 1660, 70, 70, 0, 4, 6, 'rgba(0,0,0,0.3)', r)
        box(ctx, x, 1660, 70, 70, c, r)
        txt(ctx, t, x + 35, 1684, { family: HAND_STACK, size: 18, weight: 700, color: '#fff', align: 'center', maxWidth: 60 })
      }
    },
  },
})
