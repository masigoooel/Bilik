// Kartu Remi — design-reference/dark-grunge/kartu-remi.html (600x1800 strip, 3 foto)
import { border, box, dropShadow, rrPath, type Ctx } from '../paint'
import { dark } from './define'
import { CINZEL, SPECIAL, ellipseGradient, join, lineTop, roman, rotated, slotInset, tahun, txt, vignette, width } from './helpers'

const BG = '#0B1410'
const GOLD = '#C9A24A'
const PAPER = '#F4EFE3'
const PLAYFAIR = 'Playfair Display'
/** kartu 410x470 (padding 24px 66px): atas, rotate, kartu, simbol, warna */
const CARDS: [y: number, rot: number, rank: string, suit: string, color: string][] = [
  [167, -4, 'K', '♠', '#111111'],
  [671, 3, 'Q', '♥', '#9E1B32'],
  [1175, -2, 'J', '♣', '#111111'],
]
/** pusat slot sesudah rotasi (hasil ukur desain) */
const SLOTS = [
  { x: 166.7, y: 199.1, w: 262, h: 340, rotate: -4 },
  { x: 170.7, y: 703, w: 262, h: 340, rotate: 3 },
  { x: 167.8, y: 1207, w: 262, h: 340, rotate: -2 },
]

/** indeks pojok: flex column (line-height 0.9) huruf Playfair 44px + simbol 34px, rata tengah */
function corner(ctx: Ctx, x: number, y: number, rank: string, suit: string, color: string, alignRight: boolean) {
  const r = { family: PLAYFAIR, size: 44, weight: 900, color }
  const s = { family: SPECIAL, size: 34, color }
  const gw = Math.max(width(ctx, rank, r), width(ctx, suit, s))
  const gh = 44 * 0.9 + 34 * 0.9
  const gx = alignRight ? x - gw : x
  const gy = alignRight ? y - gh : y
  const draw = () => {
    txt(ctx, rank, gx + gw / 2, lineTop(ctx, PLAYFAIR, 44, 0.9, gy, 900), { ...r, align: 'center' })
    txt(ctx, suit, gx + gw / 2, lineTop(ctx, SPECIAL, 34, 0.9, gy + 44 * 0.9), { ...s, align: 'center' })
  }
  if (alignRight) rotated(ctx, gx + gw / 2, gy + gh / 2, 180, draw)
  else draw()
}

export const kartuRemi = dark({
  id: 'dark-kartu-remi',
  name: 'kartu remi',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: BG },
  placeholder: '#2a2622',
  // kotak foto desain: filter grayscale(0.4) contrast(1.1) → preset hitam putih
  filter: 'mono',
  fonts: ['Cinzel Decorative:700', 'Special Elite', 'Playfair Display:700,900'],
  // nama di judul & di bawah foto (kartu Q memakai nama2 kalau ada), tahun romawi dari tanggal
  fields: ['nama', 'nama2', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      ellipseGradient(ctx, 0, 0, W, H, 0.5, 0.3, [
        [0, '#1e3a2a'],
        [0.7, BG],
        [1, BG],
      ])
      const nama = texts.nama?.trim() ?? ''
      const nama2 = texts.nama2?.trim() || nama
      const th = tahun(texts.tanggal)
      txt(ctx, 'Satu Dek', 300, 60, { family: CINZEL, size: 40, color: GOLD, align: 'center' })
      txt(ctx, join([nama.toUpperCase(), th && roman(Number(th))]), 300, 120, {
        family: SPECIAL,
        size: 13,
        ls: 3.9,
        color: GOLD,
        align: 'center',
        maxWidth: 520,
      })

      const names = [nama, nama2, nama]
      CARDS.forEach(([y, rot, rank, suit, color], i) =>
        rotated(ctx, 300, y + 235, rot, () => {
          dropShadow(ctx, 95, y, 410, 470, 0, 16, 30, 'rgba(0,0,0,0.55)', 22)
          box(ctx, 95, y, 410, 470, PAPER, 22)
          // inset 0 0 0 2px rgba(0,0,0,0.08)
          ctx.beginPath()
          rrPath(ctx, 95, y, 410, 470, 22)
          rrPath(ctx, 97, y + 2, 406, 466, 20)
          ctx.fillStyle = 'rgba(0,0,0,0.08)'
          ctx.fill('evenodd')
          corner(ctx, 115, y + 18, rank, suit, color, false)
          corner(ctx, 485, y + 452, rank, suit, color, true)
          border(ctx, 161, y + 24, 278, 356, 2, GOLD)
          txt(ctx, names[i], 300, y + 390, { family: CINZEL, size: 18, color, align: 'center', maxWidth: 360 })
        }),
      )

      txt(ctx, 'KARTU DIBAGIKAN', 300, 1743, { family: SPECIAL, size: 13, ls: 3.9, color: GOLD, align: 'center' })
    },
    over(ctx) {
      for (const s of SLOTS) slotInset(ctx, s)
    },
    top(ctx, { W, H }) {
      vignette(ctx, W, H)
    },
  },
})
