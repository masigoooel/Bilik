// Papan Menu Kopi — design-reference/kalcer/papan-menu-kopi.html (600x1800, 3 foto)
import { box, contentHeight, dropShadow, insetShadows, linear, measure, radial, svg, text, type Ctx } from '../paint'
import { MONO, ellipseGlow, insetRing, photoInset, ring, rotated } from './helpers'
import { kalcer } from './define'

const AB = 'Archivo Black'
const CAVEAT = 'Caveat'
const YELLOW = '#FFD24A'
const WHITE = '#f2f0ea'
const GREY = '#bdb8ae'
const INK = '#1c1b19'
const CARD = '#F4EFE3'

/** huruf papan menu: [huruf, translateY, rotate°]; '_' = jeda (inline-block lebar round(0.45 × size)) */
type Glyph = [ch: string, ty: number, rot: number]
const parse = (s: string): Glyph[] =>
  s.split(' ').map((g) => {
    if (g === '_') return ['_', 0, 0]
    const [ch, ty, rot] = g.split(':')
    return [ch, Number(ty), Number(rot)]
  })

/** kemiringan huruf judul dari desain ("[NAMA KEDAI]"), dipakai berulang untuk nama kedai user */
const TITLE_JITTER: [number, number][] = [[0, -2], [0, 0], [0, 1], [-1, -2], [1, 0], [0, -2], [1, 0], [0, 2], [0, 1], [-1, 2], [0, 0]]
const SUB = parse('K:0:0 O:0:0 P:0:2 I:0:-2 _ &:0:2 _ R:1:1 O:0:2 T:1:-2 I:-1:2')
const HARGA = parse('H:0:0 A:0:-2 R:0:2 G:0:0 A:0:-2 _ D:1:0 A:1:1 L:-1:-2 A:0:0 M:1:2 _ R:0:1 I:-1:1 B:-1:-2 U:-1:2')
const ANDALAN = parse('M:1:-2 E:-1:0 N:0:2 U:0:2 _ A:1:2 N:0:0 D:1:-2 A:-1:0 L:0:0 A:0:0 N:0:-2')
const BUKA = parse('B:-1:1 U:1:1 K:0:0 A:0:1 _ 0:0:0 8:1:1 .:-1:2 0:-1:2 0:-1:0 _ -:0:2 _ 2:0:-2 2:1:-2 .:0:1 0:1:0 0:0:0')
/** daftar menu: huruf nama | harga (flex space-between per huruf) */
const ITEMS: [Glyph[], Glyph[]][] = [
  ['K:-1:2 O:0:0 P:1:1 I:1:1 _ S:1:0 U:0:0 S:0:1 U:0:0 _ A:1:-2 R:-1:1 E:0:1 N:0:1', '2:1:0 8:0:0'],
  ['A:1:0 M:0:0 E:-1:2 R:-1:1 I:1:0 C:0:-2 A:1:1 N:0:2 O:0:0', '2:1:0 2:1:2'],
  ['M:0:0 A:1:0 N:-1:2 U:1:0 A:0:0 L:0:2 _ B:-1:1 R:-1:-2 E:0:2 W:0:-2', '3:1:-2 0:0:0'],
  ['E:0:0 S:-1:1 _ K:0:0 O:1:2 P:0:1 I:0:2 _ P:0:0 A:0:-2 N:0:-2 D:1:0 A:-1:1 N:1:0', '2:1:0 9:1:2'],
  ['M:1:0 A:0:0 T:0:-2 C:1:-2 H:0:0 A:1:0 _ L:0:1 A:-1:0 T:0:0 T:-1:0 E:-1:-2', '2:1:0 8:0:0'],
  ['R:-1:0 O:-1:2 T:0:2 I:0:-2 _ B:0:0 A:0:2 K:1:-2 A:0:0 R:-1:0', '2:0:0 0:-1:2'],
].map(([a, b]) => [parse(a), parse(b)])

/** kartu menu berfoto 480x315 (padding 12/12/14), kolom tengah x=60, miring di titik tengah */
const CARDS = [
  { y: 675, rot: -2, item: 'kopi susu aren', price: '28rb' },
  { y: 1020, rot: 2, item: 'es kopi pandan', price: '29rb' },
  { y: 1365, rot: -1.5, item: 'manual brew', price: '30rb' },
]

const glyphW = (ctx: Ctx, g: Glyph, size: number) => (g[0] === '_' ? Math.round(size * 0.45) : measure(ctx, g[0], { family: AB, size }) + 1)

/** satu huruf inline-block (line-height 1) + text-shadow 0 2px 0 rgba(0,0,0,.6), diputar di titik tengahnya */
function letter(ctx: Ctx, g: Glyph, x: number, top: number, size: number, color: string) {
  const [ch, ty, rot] = g
  if (ch === '_') return
  const w = measure(ctx, ch, { family: AB, size })
  const t = top + ty
  rotated(ctx, x + w / 2, t + size / 2, rot, () => {
    const y = t + (size - contentHeight(ctx, AB, size)) / 2
    text(ctx, ch, x, y + 2, { family: AB, size, color: 'rgba(0,0,0,0.6)' })
    text(ctx, ch, x, y, { family: AB, size, color })
  })
}

/** baris huruf rata tengah / kanan di kolom papan (x 82, lebar 436) */
function row(ctx: Ctx, gs: Glyph[], size: number, top: number, color: string, align: 'center' | 'right' = 'center') {
  const total = gs.reduce((s, g) => s + glyphW(ctx, g, size), 0)
  let x = align === 'center' ? 82 + (436 - total) / 2 : 518 - total
  for (const g of gs) {
    letter(ctx, g, x, top, size, color)
    x += glyphW(ctx, g, size)
  }
}

/** baris menu: tiap huruf flex item (space-between), harga satu item di ujung kanan (1px lebih tinggi) */
function itemRow(ctx: Ctx, name: Glyph[], price: Glyph[], top: number) {
  const size = 26
  const pw = price.reduce((s, g) => s + glyphW(ctx, g, size), 0)
  const ws = name.map((g) => glyphW(ctx, g, size))
  const gap = (436 - pw - ws.reduce((a, b) => a + b, 0)) / name.length
  let x = 82
  name.forEach((g, i) => {
    letter(ctx, g, x, top, size, WHITE)
    x += ws[i] + gap
  })
  for (const g of price) {
    letter(ctx, g, x, top - 1, size, YELLOW)
    x += glyphW(ctx, g, size)
  }
}

/** judul = nama kedai user (huruf kapital), dikecilkan kalau tidak muat */
function titleGlyphs(s: string): Glyph[] {
  let i = 0
  return [...s.toUpperCase()].map((ch) => {
    if (/\s/.test(ch)) return ['_', 0, 0] as Glyph
    const [ty, rot] = TITLE_JITTER[i++ % TITLE_JITTER.length]
    return [ch, ty, rot] as Glyph
  })
}

/** pusat slot sesudah kartu diputar (kotak foto 456x220 di x=72, y+12) */
function slotOf(c: (typeof CARDS)[number]) {
  const a = (c.rot * Math.PI) / 180
  const dy = 12 + 110 - 157.5
  return { x: 300 - dy * Math.sin(a) - 228, y: c.y + 157.5 + dy * Math.cos(a) - 110, w: 456, h: 220, rotate: c.rot }
}

const inCard = (ctx: Ctx, c: (typeof CARDS)[number], draw: () => void) => rotated(ctx, 300, c.y + 157.5, c.rot, draw)

/** radial-gradient(rgba(255,255,255,.05) .8px, transparent 1.2px) 0 0 / 3px 3px: titik di tengah tile + tepi 4 tetangga */
let dotTile: HTMLCanvasElement | null = null
function dots(ctx: Ctx, x: number, y: number, w: number, h: number) {
  if (!dotTile) {
    dotTile = document.createElement('canvas')
    dotTile.width = dotTile.height = 3
    const t = dotTile.getContext('2d')!
    t.fillStyle = 'rgba(255,255,255,0.025)'
    t.fillRect(1, 0, 1, 1)
    t.fillRect(0, 1, 1, 1)
    t.fillRect(2, 1, 1, 1)
    t.fillRect(1, 2, 1, 1)
    t.fillStyle = 'rgba(255,255,255,0.05)'
    t.fillRect(1, 1, 1, 1)
  }
  const p = ctx.createPattern(dotTile, 'repeat')!
  p.setTransform(new DOMMatrix([1, 0, 0, 1, x, y]))
  ctx.fillStyle = p
  ctx.fillRect(x, y, w, h)
}

function pin(ctx: Ctx, x: number, y: number) {
  const r = Math.hypot(14 - 4.9, 14 - 4.2)
  box(ctx, x, y, 14, 14, radial(ctx, x + 4.9, y + 4.2, r, [[0, '#fff4c0'], [0.6, '#b8903a'], [1, '#6a4a18']]), 7)
}

export const papanMenuKopi = kalcer({
  id: 'kalcer-papan-menu-kopi',
  name: 'papan menu kopi',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#e9e2d4' },
  // #e3dcc6 sesudah saturate(1.05) contrast(1.05) = #e9e2c9 (hasil ukur)
  placeholder: '#e9e2c9',
  // kotak FOTO di desain: saturate(1.05) contrast(1.05) → hampir tanpa filter
  filter: 'normal',
  fonts: ['Anton', 'Space Mono:400,700', 'Archivo Black', 'Caveat:700'],
  fields: ['tempat', 'nama'],
  slots: CARDS.map(slotOf),
  draw: {
    under(ctx, { texts, W, H }) {
      // dinding: gradien + garis tegak tiap 16px + cahaya lampu di kanan atas
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 180, [[0, '#e9e2d4'], [1, '#d9cfbc']]))
      ctx.fillStyle = 'rgba(0,0,0,0.035)'
      for (let x = 0; x < W; x += 16) ctx.fillRect(x, 0, 2, H)
      ellipseGlow(ctx, 480, 0, 120, 300, 0.6, 0.1, [255, 230, 170], 0.45, 0.7)
      // kawat gantungan + paku
      svg(ctx, 'M80 112 L300 20 L520 112', 0, 0, 600, 120, 600, 120, { stroke: '#6a5a46', lineWidth: 3 })
      ctx.beginPath()
      ctx.arc(300, 20, 9, 0, Math.PI * 2)
      ctx.fillStyle = '#8f969d'
      ctx.fill()

      // bingkai kayu: serat repeating-linear-gradient(92deg) di atas gradien cokelat
      dropShadow(ctx, 30, 100, 540, 1660, 0, 24, 40, 'rgba(0,0,0,0.35)')
      box(ctx, 30, 100, 540, 1660, linear(ctx, 30, 100, 540, 1660, 180, [[0, '#8a5a32'], [1, '#5a3518']]))
      const a = (92 * Math.PI) / 180
      const L = Math.abs(540 * Math.sin(a)) + Math.abs(1660 * Math.cos(a))
      const grain: [number, string][] = []
      for (let p = 0; p < L; p += 23) {
        const o = (v: number) => Math.min(1, (p + v) / L)
        grain.push([o(9), 'rgba(0,0,0,0)'], [o(9), 'rgba(0,0,0,0.1)'], [o(10), 'rgba(0,0,0,0.1)'], [o(10), 'rgba(0,0,0,0)'])
        grain.push([o(22), 'rgba(255,230,190,0)'], [o(22), 'rgba(255,230,190,0.07)'], [o(23), 'rgba(255,230,190,0.07)'], [o(23), 'rgba(255,230,190,0)'])
      }
      box(ctx, 30, 100, 540, 1660, linear(ctx, 30, 100, 540, 1660, 92, grain))
      insetRing(ctx, 30, 100, 540, 1660, 3, 'rgba(0,0,0,0.25)')

      // papan huruf: alur horizontal tiap 22px (dari bawah) + bayangan dalam
      box(ctx, 56, 126, 488, 1608, '#1c1c1c')
      ctx.fillStyle = '#0e0e0e'
      for (let y = 1734 - 2; y > 126 - 2; y -= 22) ctx.fillRect(56, Math.max(126, y), 488, Math.min(2, y + 2 - 126))
      insetShadows(ctx, 56, 126, 488, 1608, [{ dx: 0, dy: 0, blur: 20, color: 'rgba(0,0,0,0.8)' }])

      // judul = nama kedai
      const tempat = texts.tempat?.trim()
      if (tempat) {
        const gs = titleGlyphs(tempat)
        const w = gs.reduce((s, g) => s + glyphW(ctx, g, 34), 0)
        const size = w > 436 ? Math.floor((34 * 436) / w) : 34
        row(ctx, gs, size, 152 + (34 - size) / 2, YELLOW)
      }
      row(ctx, SUB, 22, 203, WHITE)
      ITEMS.forEach(([n, p], i) => itemRow(ctx, n, p, 267.5 + i * 49.725))
      row(ctx, HARGA, 14, 569, GREY, 'right')
      row(ctx, ANDALAN, 24, 616, YELLOW)
      row(ctx, BUKA, 16, 1694, GREY)

      // kartu menu berfoto
      const nama = texts.nama?.trim()
      for (const c of CARDS)
        inCard(ctx, c, () => {
          dropShadow(ctx, 60, c.y, 480, 315, 0, 8, 12, 'rgba(0,0,0,0.55)')
          box(ctx, 60, c.y, 480, 315, CARD)
          // jepitan logam: di DOM sebelum kotak foto ber-filter (filter = lapisan sendiri) → tertutup foto
          dropShadow(ctx, 260, c.y - 18, 80, 30, 0, 2, 3, 'rgba(0,0,0,0.4)', 4)
          box(ctx, 260, c.y - 18, 80, 30, linear(ctx, 260, c.y - 18, 80, 30, 180, [[0, '#e9edf2'], [1, '#8f969d']]), 4)
          // nama menu (Caveat hanya dimuat 700) + harga, rata garis dasar
          text(ctx, c.item, 72, c.y + 237, { family: CAVEAT, size: 34, weight: 700, color: INK, maxWidth: 380 })
          text(ctx, c.price, 528, c.y + 247, { family: AB, size: 22, color: INK, align: 'right' })
          text(ctx, nama ? `favorit ${nama}` : 'favorit pelanggan', 72, c.y + 283, { family: MONO, size: 11, color: '#6b6255', maxWidth: 456 })
        })
    },
    over(ctx) {
      for (const [i, c] of CARDS.entries())
        inCard(ctx, c, () => {
          photoInset(ctx, 72, c.y + 12, 456, 220)
          // bekas gelas kopi (kartu 2) dan stiker "baru!" (kartu 3)
          if (i === 1) ring(ctx, 436, c.y + 215, 80, 5, 'rgba(120,70,30,0.22)')
          if (i === 2)
            rotated(ctx, 527.8, c.y + 56.5, 8, () => {
              dropShadow(ctx, 501.59, c.y + 40, 52.41, 33, 0, 2, 3, 'rgba(0,0,0,0.3)')
              box(ctx, 501.59, c.y + 40, 52.41, 33, '#FFE45C')
              text(ctx, 'baru!', 509.59, c.y + 44, { family: CAVEAT, size: 20, weight: 700, color: '#000000' })
            })
        })
      // titik halus di seluruh papan (di atas kartu & foto)
      dots(ctx, 56, 126, 488, 1608)
      // stiker huruf "K O" miring -8°
      rotated(ctx, 504, 1675, -8, () => {
        const k = measure(ctx, 'K', { family: AB, size: 18 })
        letter(ctx, ['K', 0, 1], 482, 1666, 18, WHITE)
        letter(ctx, ['O', 0, 0], 482 + k + 1 + 2 + 8 + 2, 1666, 18, WHITE)
      })
      for (const [x, y] of [[38, 108], [548, 108], [38, 1738], [548, 1738]]) pin(ctx, x, y)
    },
  },
})

