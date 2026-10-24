// Salam Dari — design-reference/retro-vintage/salam-dari.html (1200x1800, 4 foto)
import { border, box, contentHeight, dropShadow, setShadow, text, type Ctx } from '../paint'
import { retro } from './define'
import { ellipseRing, parseTanggal, photoInset, rotated } from './helpers'

const INK = '#2b2116'
const RUST = '#b5502e'
const C = '#E8A33C'
const MONO = 'IBM Plex Mono'
const SLOTS = [
  { x: 120, y: 387.5, w: 469, h: 560 },
  { x: 611, y: 387.5, w: 469, h: 560 },
  { x: 120, y: 969.5, w: 469, h: 560 },
  { x: 611, y: 969.5, w: 469, h: 560 },
]
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

/**
 * Judul kota: Playfair 900 150px, letter-spacing -0.02em, -webkit-text-stroke 4px + paint-order stroke fill,
 * text-shadow 8px 8px 0 (bayangan bentuk isi saja). Stroke digambar dulu baru isi (seperti paint-order), kerning tetap (ctx.letterSpacing).
 */
function cityTitle(ctx: Ctx, s: string, cx: number, y: number, maxW: number) {
  if (!s) return
  ctx.save()
  let size = 150
  const setFont = (sz: number) => {
    ctx.font = `900 ${sz}px "Playfair Display", serif`
    ctx.letterSpacing = `${-0.02 * sz}px`
  }
  setFont(size)
  // lebar CSS = lebar glyph + letter-spacing tiap huruf (canvas menambahkannya juga) + stroke luar
  let w = ctx.measureText(s).width
  if (w > maxW) {
    size = Math.max(60, (size * maxW) / w)
    setFont(size)
    w = ctx.measureText(s).width
  }
  // kotak konten tetap di y saat font dikecilkan (tengah garis 150 x 0.85)
  const ascent = ctx.measureText('Hg').fontBoundingBoxAscent
  const base = y + ascent + (contentHeight(ctx, 'Playfair Display', 150, 900) - contentHeight(ctx, 'Playfair Display', size, 900)) / 2
  setFont(size)
  const x = cx - w / 2
  ctx.textBaseline = 'alphabetic'
  ctx.lineJoin = 'miter'
  ctx.miterLimit = 4
  ctx.lineWidth = (4 * size) / 150
  ctx.strokeStyle = INK
  // text-shadow di Chrome hanya bentuk isi huruf (tanpa stroke), digeser 8px
  const o = (8 * size) / 150
  ctx.fillStyle = INK
  ctx.fillText(s, x + o, base + o)
  ctx.strokeText(s, x, base)
  ctx.fillStyle = C
  ctx.fillText(s, x, base)
  ctx.restore()
}

/** perangko: tepi bergerigi = radial-gradient(circle at 6px 6px, transparent 4px, krem 5px) -6px -6px / 12px 12px */
function stamp(ctx: Ctx) {
  rotated(ctx, 1005, 164, 5, () => {
    // tepi bergerigi: kotak dikurangi lubang tiap 12px. Digambar di kanvas terpisah seukuran kotak (lubang yang
    // keluar kotak otomatis terpotong), lalu ditempel dengan bayangan filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2))
    // (deviasi standar 2 → shadowBlur 4)
    const m = ctx.getTransform()
    const sc = Math.max(1, Math.hypot(m.a, m.b))
    const oc = document.createElement('canvas')
    oc.width = Math.ceil(110 * sc)
    oc.height = Math.ceil(136 * sc)
    const o = oc.getContext('2d')!
    o.scale(oc.width / 110, oc.height / 136)
    o.beginPath()
    o.rect(0, 0, 110, 136)
    for (let gx = 0; gx <= 120; gx += 12)
      for (let gy = 0; gy <= 144; gy += 12) {
        o.moveTo(gx + 4.5, gy)
        o.arc(gx, gy, 4.5, 0, Math.PI * 2)
      }
    o.fillStyle = '#F6EFDC'
    o.fill('evenodd')
    ctx.save()
    setShadow(ctx, 0, 2, 4, 'rgba(0,0,0,0.2)')
    ctx.drawImage(oc, 950, 96, 110, 136)
    ctx.restore()
    box(ctx, 958, 104, 94, 120, '#2E5E8C')
    text(ctx, '25', 1005, 216 - contentHeight(ctx, 'Playfair Display', 26, 900), { family: 'Playfair Display', size: 26, weight: 900, color: '#F6EFDC', align: 'center' })
  })
}

export const salamDari = retro({
  id: 'retro-salam-dari',
  name: 'salam dari',
  width: 1200,
  height: 1800,
  photoCount: 4,
  background: { type: 'solid', color: '#6b5a44' },
  // #d8cdb4 setelah sepia(0.35)
  placeholder: '#EDDBB8',
  // kotak FOTO di desain memakai filter: sepia(0.35)
  filter: 'hangat-klasik',
  fonts: ['Playfair Display:700,900', 'IBM Plex Mono:400,600', 'Caveat:700'],
  fields: ['tempat', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      dropShadow(ctx, 70, 70, 1060, 1660, 0, 20, 40, 'rgba(0,0,0,0.35)')
      box(ctx, 70, 70, 1060, 1660, '#F2E6CC')
      border(ctx, 88, 88, 1024, 1624, 3, RUST)
      text(ctx, 'salam hangat dari', 600, 120, { family: 'Caveat', size: 64, weight: 700, color: RUST, align: 'center' })
      cityTitle(ctx, texts.tempat?.trim() || 'sini', 600, 193, 940)

      text(ctx, 'kartu pos bergambar · seri 7', 120, 1660, { family: MONO, size: 16, color: INK })
      text(ctx, texts.tanggal?.trim() ?? '', 1080, 1660, { family: MONO, size: 16, color: INK, align: 'right', maxWidth: 560 })

      stamp(ctx)
      // cap pos (rotate -14deg): lingkaran 118 border 4px + "17 X 76" dari tanggal
      rotated(ctx, 939, 169, -14, () => {
        ellipseRing(ctx, 880, 110, 118, 118, 4, 'rgba(43,33,22,0.55)')
        const p = parseTanggal(texts.tanggal)
        if (p) {
          const s = `${p.d} ${ROMAN[p.m - 1]} ${String(p.y % 100).padStart(2, '0')}`
          text(ctx, s, 939, 169 - contentHeight(ctx, MONO, 13, 600) / 2, { family: MONO, size: 13, weight: 600, color: 'rgba(43,33,22,0.6)', align: 'center', maxWidth: 100 })
        }
      })
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s.x, s.y, s.w, s.h)
    },
  },
})
