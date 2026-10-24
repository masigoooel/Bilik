// Dinding Stiker — design-reference/kalcer/dinding-stiker.html (1200x1800, 6 foto)
import { box, linear, rrPath, rrPathRaw, setShadow, svg, svgPath, text, type Ctx, type Radii } from '../paint'
import { ANTON, MARKER, MONO, insetRing, photoInset, rotated, yearOf } from './helpers'
import { kalcer } from './define'

const RUBIK = 'Rubik Mono One'
const PACIFICO = 'Pacifico'
const SERIF = 'DM Serif Display'
const INK = '#1c1b19'
const CREAM = '#efe6d2'
const CUP = ['M6 10 h14 v6 a7 7 0 0 1 -14 0 z M20 12 h3 a3 3 0 0 1 0 6 h-3', 'M10 4 q2 2 0 4 M14 4 q2 2 0 4']
const METAL: [number, string][] = [[0, '#f4f6f8'], [0.3, '#b9c0c8'], [0.5, '#6f777f'], [0.7, '#d9dee3'], [1, '#8f969d']]

// ---------- filter stiker kecil: saturate(0.8) sepia(0.1) (matriks CSS, ruang sRGB) ----------
function parseColor(c: string): [number, number, number, number] {
  if (c.startsWith('#')) return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16), 1]
  const p = c.replace(/rgba?\(|\)/g, '').split(',').map(Number)
  return [p[0], p[1], p[2], p[3] ?? 1]
}
function fx(c: string) {
  const [r, g, b, a] = parseColor(c)
  const s = 0.8
  const r1 = (0.213 + 0.787 * s) * r + (0.715 - 0.715 * s) * g + (0.072 - 0.072 * s) * b
  const g1 = (0.213 - 0.213 * s) * r + (0.715 + 0.285 * s) * g + (0.072 - 0.072 * s) * b
  const b1 = (0.213 - 0.213 * s) * r + (0.715 - 0.715 * s) * g + (0.072 + 0.928 * s) * b
  const k = 0.9 // 1 - amount sepia
  const r2 = (0.393 + 0.607 * k) * r1 + (0.769 - 0.769 * k) * g1 + (0.189 - 0.189 * k) * b1
  const g2 = (0.349 - 0.349 * k) * r1 + (0.686 + 0.314 * k) * g1 + (0.168 - 0.168 * k) * b1
  const b2 = (0.272 - 0.272 * k) * r1 + (0.534 - 0.534 * k) * g1 + (0.131 + 0.869 * k) * b1
  const cl = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  return `rgba(${cl(r2)},${cl(g2)},${cl(b2)},${a})`
}

// ---------- bentuk ----------
type Shape = { x: number; y: number; w: number; h: number; r: Radii | 'ellipse' }
function shapePath(ctx: Ctx, s: Shape, grow = 0) {
  if (s.r === 'ellipse') ctx.ellipse(s.x + s.w / 2, s.y + s.h / 2, s.w / 2 + grow, s.h / 2 + grow, 0, 0, Math.PI * 2)
  else {
    const r = typeof s.r === 'number' ? [s.r, s.r, s.r, s.r] : s.r
    const rr = r.map((v) => (v > 0 ? v + grow : 0)) as Radii
    if (grow) rrPathRaw(ctx, s.x - grow, s.y - grow, s.w + grow * 2, s.h + grow * 2, rr)
    else rrPath(ctx, s.x, s.y, s.w, s.h, rr)
  }
}
function fillShape(ctx: Ctx, s: Shape, fill: string | CanvasGradient | CanvasPattern) {
  ctx.beginPath()
  shapePath(ctx, s)
  ctx.fillStyle = fill
  ctx.fill()
}
/** box-shadow luar: bayangan bentuk (bentuk itu sendiri tidak digambar) */
function shadowOf(ctx: Ctx, s: Shape, dx: number, dy: number, blur: number, color: string) {
  ctx.save()
  const off = 20000
  setShadow(ctx, dx + off, dy, blur, color)
  ctx.translate(-off, 0)
  fillShape(ctx, s, '#000')
  ctx.restore()
}
function clipShape(ctx: Ctx, s: Shape) {
  ctx.beginPath()
  shapePath(ctx, s)
  ctx.clip()
}
function ringOut(ctx: Ctx, s: Shape, width: number, color: string) {
  ctx.beginPath()
  shapePath(ctx, s, width)
  shapePath(ctx, s)
  ctx.fillStyle = color
  ctx.fill('evenodd')
}
const rotPt = (cx: number, cy: number, deg: number, x: number, y: number) => {
  const a = (deg * Math.PI) / 180
  return { x: cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), y: cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a) }
}

// ---------- pola kecil ----------
const tiles = new Map<string, HTMLCanvasElement>()
function tile(key: string, w: number, h: number, draw: (t: CanvasRenderingContext2D) => void) {
  let c = tiles.get(key)
  if (!c) {
    c = document.createElement('canvas')
    c.width = w
    c.height = h
    draw(c.getContext('2d')!)
    tiles.set(key, c)
  }
  return c
}
function pattern(ctx: Ctx, t: HTMLCanvasElement, ox: number, oy: number) {
  const p = ctx.createPattern(t, 'repeat')!
  p.setTransform(new DOMMatrix([1, 0, 0, 1, ox, oy]))
  return p
}

/** teks melingkar (SVG textPath pada lingkaran r, mulai di kiri, searah jarum jam lewat atas) */
function circleText(ctx: Ctx, s: string, cx: number, cy: number, r: number, size: number, ls: number, color: string) {
  ctx.save()
  ctx.font = `700 ${size}px "Space Mono", monospace`
  const chars = Array.from(s)
  const total = chars.reduce((t, ch) => t + ctx.measureText(ch).width + ls, 0)
  const k = total > Math.PI * 2 * r * 0.97 ? (Math.PI * 2 * r * 0.97) / total : 1
  if (k < 1) ctx.font = `700 ${size * k}px "Space Mono", monospace`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  let pos = 0
  for (const ch of chars) {
    const adv = ctx.measureText(ch).width
    const th = Math.PI + (pos + adv / 2) / r
    ctx.save()
    ctx.translate(cx + r * Math.cos(th), cy + r * Math.sin(th))
    ctx.rotate(th + Math.PI / 2)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
    pos += adv + ls * k
  }
  ctx.restore()
}

/** garis barcode stiker: repeating-linear-gradient(90deg, c 0 2px, transparent 2px 4px, c 4px 5px, transparent 5px 8px) */
function bars(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  for (let p = 0; p < w; p += 8) {
    ctx.fillRect(x + p, y, Math.min(2, w - p), h)
    if (p + 4 < w) ctx.fillRect(x + p + 4, y, 1, h)
  }
}

// ---------- stiker kecil (filter saturate .8 sepia .1, outline 4px, bayangan 0 1px 2px) ----------
type Small = Shape & { rot: number; bg: string; draw?: (ctx: Ctx, x: number, y: number) => void }

const t = (ctx: Ctx, s: string, x: number, y: number, family: string, size: number, color: string, o: { ls?: number; align?: CanvasTextAlign; weight?: number } = {}) =>
  text(ctx, s, x, y, { family, size, color: fx(color), letterSpacing: o.ls, align: o.align ?? 'center', weight: o.weight })

function seal(ctx: Ctx, x: number, y: number, label: string, ink: string, r1: number, r2: number, rt: number, fs: number, icon: 'cup' | 'bean') {
  const c = x + 75
  const cy = y + 75
  ctx.lineWidth = 2
  ctx.strokeStyle = fx(ink)
  ctx.beginPath()
  ctx.arc(c, cy, r1, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(c, cy, r2, 0, Math.PI * 2)
  ctx.stroke()
  circleText(ctx, label, c, cy, rt, fs, 3, fx(ink))
  const k = 1.8461538461538463
  if (icon === 'cup') {
    svg(ctx, CUP[0], x + 51, y + 51, 26 * k, 26 * k, 26, 26, { stroke: fx(ink), lineWidth: 2 })
    svg(ctx, CUP[1], x + 51, y + 51, 26 * k, 26 * k, 26, 26, { stroke: fx(ink), lineWidth: 1.6 })
  } else {
    ctx.save()
    ctx.translate(x + 51, y + 51)
    ctx.scale(k, k)
    ctx.translate(13, 13)
    ctx.rotate(Math.PI / 6)
    ctx.translate(-13, -13)
    ctx.beginPath()
    ctx.ellipse(13, 13, 7, 10, 0, 0, Math.PI * 2)
    ctx.fillStyle = fx(ink)
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'
    ctx.lineWidth = 2
    ctx.stroke(svgPath('M9 6 q6 7 0 14'))
    ctx.restore()
  }
}

function badge(ctx: Ctx, x: number, y: number, w: number, h: number, r: Radii, ink: string, est: string, name: string, nameSize: number, ty: { est: number; icon: [number, number, number]; name: number; supply: number }, icon: (ix: number, iy: number, s: number) => void) {
  ctx.lineWidth = 2
  ctx.strokeStyle = fx(ink)
  ctx.beginPath()
  rrPathRaw(ctx, x + 1, y + 1, w - 2, h - 2, (r as number[]).map((v) => Math.max(0, v - 1)) as Radii)
  ctx.stroke()
  const cx = x + w / 2
  t(ctx, est, cx, ty.est, MONO, 9, ink, { ls: 1.8 })
  icon(ty.icon[0], ty.icon[1], ty.icon[2])
  t(ctx, name, cx, ty.name, SERIF, nameSize, ink)
  t(ctx, 'SUPPLY CO.', cx, ty.supply, MONO, 8, ink, { ls: 1.6 })
}

function smallStickers(nama: string): Small[] {
  return [
    {
      x: 60, y: 160, w: 120, h: 120, r: 'ellipse', rot: -8, bg: '#efe6d2',
      draw: (ctx, x, y) => {
        // stiker kopi kecil: ring r54/r30 + teks melingkar r44 + ikon cangkir
        ctx.lineWidth = 2
        ctx.strokeStyle = fx('#3a2a1e')
        ctx.beginPath()
        ctx.arc(x + 60, y + 60, 54, 0, Math.PI * 2)
        ctx.stroke()
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(x + 60, y + 60, 30, 0, Math.PI * 2)
        ctx.stroke()
        circleText(ctx, `KOPI ${nama ? nama.toUpperCase() : 'KITA'} · EST 2019 · `, x + 60, y + 60, 44, 9, 3, fx('#3a2a1e'))
        const k = 1.4769230769230768
        svg(ctx, CUP[0], x + 40.8, y + 40.8, 26 * k, 26 * k, 26, 26, { stroke: fx('#3a2a1e'), lineWidth: 2 })
        svg(ctx, CUP[1], x + 40.8, y + 40.8, 26 * k, 26 * k, 26, 26, { stroke: fx('#3a2a1e'), lineWidth: 1.6 })
      },
    },
    { x: 250, y: 180, w: 180, h: 61, r: 2, rot: 4, bg: '#2a2a2a', draw: (ctx) => t(ctx, 'SLOWDAY', 340, 183.5, ANTON, 36, CREAM, { ls: 0.72 }) },
    {
      x: 600, y: 160, w: 200, h: 90, r: 'ellipse', rot: -5, bg: '#8a3a32',
      draw: (ctx) => {
        t(ctx, 'Seduh', 700, 168.5, PACIFICO, 34, '#f2e8d8')
        t(ctx, 'ROASTERS', 700, 215.5, MONO, 9, '#f2e8d8', { ls: 2.25 })
      },
    },
    {
      x: 860, y: 190, w: 150, h: 90, r: 4, rot: 6, bg: '#3a4a6a',
      draw: (ctx) => {
        t(ctx, 'NOMADEN', 870, 196, RUBIK, 16, CREAM, { align: 'left' })
        bars(ctx, 870, 230, 130, 14, fx(CREAM))
        t(ctx, 'SS/26 · LOT 017', 870, 260, MONO, 8, CREAM, { align: 'left' })
      },
    },
    {
      x: 60, y: 672, w: 120, h: 132, r: [60, 60, 12, 12], rot: -6, bg: '#1f2a24',
      draw: (ctx) =>
        badge(ctx, 60, 672, 120, 132, [60, 60, 12, 12], '#c9a24a', 'EST. 2020', 'BERANDA', 18, { est: 689, icon: [98.5, 706, 43], name: 749, supply: 775 }, (ix, iy, s) =>
          svg(ctx, 'M4 20 C 4 8, 12 4, 22 4 C 22 14, 16 22, 4 20 Z M4 20 L 16 8', ix, iy, s, s, 26, 26, { stroke: fx('#c9a24a'), lineWidth: 2 }),
        ),
    },
    {
      x: 215, y: 705, w: 180, h: 72, r: 4, rot: 5, bg: '#2a2a2a',
      draw: (ctx) => {
        // repeating-conic-gradient(#efe6d2 0 25%, transparent 0 50%) 0 0 / 18px 18px, opacity .85
        const chk = tile('kalcer-checker', 18, 18, (c) => {
          c.fillStyle = fx(CREAM)
          c.fillRect(9, 0, 9, 9)
          c.fillRect(0, 9, 9, 9)
        })
        ctx.save()
        ctx.globalAlpha = 0.85
        ctx.fillStyle = pattern(ctx, chk, 215, 705)
        ctx.fillRect(215, 705, 180, 72)
        ctx.restore()
        box(ctx, 233, 723, 144, 36, fx('#2a2a2a'))
        t(ctx, 'LOKAL MADE', 305, 724.5, ANTON, 22, CREAM)
      },
    },
    { x: 420, y: 660, w: 150, h: 150, r: 'ellipse', rot: 8, bg: '#b8865a', draw: (ctx) => seal(ctx, 420, 660, 'RUANG TEDUH · SINGLE ORIGIN · ', '#2a1e14', 69, 45, 59, 11, 'bean') },
    { x: 630, y: 712, w: 190, h: 64, r: 2, rot: -4, bg: '#8a3a32', draw: (ctx) => t(ctx, 'SORE GOODS', 725, 715, ANTON, 38, '#f2e8d8', { ls: 0.76 }) },
    {
      x: 880, y: 690, w: 170, h: 76, r: 'ellipse', rot: 6, bg: '#d9d2c0',
      draw: (ctx) => {
        t(ctx, 'Sorean', 965, 696, PACIFICO, 29, '#8a3a32')
        t(ctx, 'COFFEE', 965, 736, MONO, 9, '#8a3a32', { ls: 2.25 })
      },
    },
    {
      x: 1060, y: 700, w: 110, h: 121, r: [55, 55, 12, 12], rot: -5, bg: '#4a5a3a',
      draw: (ctx) =>
        badge(ctx, 1060, 700, 110, 121, [55, 55, 12, 12], CREAM, 'EST. 2022', 'ANTAR', 16, { est: 714.5, icon: [1095.5, 731.5, 39], name: 771.5, supply: 794.5 }, (ix, iy, s) =>
          svg(ctx, 'M14 2 L5 15 h7 l-2 9 l9 -13 h-7 z', ix, iy, s, s, 26, 26, { fill: fx(CREAM) }),
        ),
    },
    {
      x: 70, y: 1265, w: 150, h: 90, r: 4, rot: -6, bg: '#d9d2c0',
      draw: (ctx) => {
        t(ctx, 'KAMPUNG', 80, 1271, RUBIK, 16, '#8a3a32', { align: 'left' })
        bars(ctx, 80, 1305, 130, 14, fx('#8a3a32'))
        t(ctx, 'SS/26 · LOT 017', 80, 1335, MONO, 8, '#8a3a32', { align: 'left' })
      },
    },
    { x: 250, y: 1270, w: 150, h: 150, r: 'ellipse', rot: 7, bg: '#3a4a6a', draw: (ctx) => seal(ctx, 250, 1270, 'KEDAI SORE · SEJAK 2021 · ', CREAM, 69, 45, 59, 11, 'cup') },
    {
      x: 440, y: 1255, w: 190, h: 85, r: 'ellipse', rot: -4, bg: '#efe6d2',
      draw: (ctx) => {
        t(ctx, 'Pelan', 535, 1263, PACIFICO, 32, '#3a2a1e')
        t(ctx, 'GOODS', 535, 1307, MONO, 9, '#3a2a1e', { ls: 2.25 })
      },
    },
    { x: 680, y: 1262, w: 170, h: 57, r: 2, rot: 5, bg: '#4a5a3a', draw: (ctx) => t(ctx, 'TEMU', 765, 1265, ANTON, 34, CREAM, { ls: 0.68 }) },
    {
      x: 870, y: 1250, w: 115, h: 126, r: [57, 57, 12, 12], rot: -7, bg: '#b8865a',
      draw: (ctx) =>
        badge(ctx, 870, 1250, 115, 126, [57, 57, 12, 12], '#2a1e14', 'EST. 2018', 'GARIS', 17, { est: 1265.5, icon: [907, 1282.5, 41], name: 1323.5, supply: 1348.5 }, (ix, iy, s) =>
          svg(ctx, 'M13 2 l3 7 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1 z', ix, iy, s, s, 26, 26, { fill: fx('#2a1e14') }),
        ),
    },
  ]
}

function drawSmall(ctx: Ctx, s: Small) {
  rotated(ctx, s.x + s.w / 2, s.y + s.h / 2, s.rot, () => {
    shadowOf(ctx, s, 0, 1, 2, 'rgba(0,0,0,0.3)')
    fillShape(ctx, s, fx(s.bg))
    ctx.save()
    clipShape(ctx, s)
    s.draw?.(ctx, s.x, s.y)
    // kilap: linear-gradient(125deg, rgba(255,255,255,.28), transparent 40%)
    ctx.fillStyle = linear(ctx, s.x, s.y, s.w, s.h, 125, [[0, fx('rgba(255,255,255,0.28)')], [0.4, fx('rgba(255,255,255,0)')]])
    ctx.fillRect(s.x, s.y, s.w, s.h)
    ctx.restore()
    ringOut(ctx, s, 4, fx('rgba(236,232,220,0.92)'))
  })
}

// ---------- stiker berfoto ----------
const P1 = { cx: 220, cy: 460, rot: -7 }
const P2 = { cx: 600, cy: 412, rot: 5 }
const P3 = { cx: 975, cy: 473.5, rot: -5 }
const P4 = { cx: 230, cy: 1055, rot: 6 }
const P5 = { cx: 605, cy: 1015, rot: -4 }
const P6 = { cx: 990, cy: 1065, rot: 10 }
const STAR = [[50, 0], [62, 30], [98, 32], [70, 54], [82, 92], [50, 72], [18, 92], [30, 54], [2, 32], [38, 30]]

function slotIn(p: { cx: number; cy: number; rot: number }, x: number, y: number, w: number, h: number, radius?: number) {
  const c = rotPt(p.cx, p.cy, p.rot, x + w / 2, y + h / 2)
  return { x: c.x - w / 2, y: c.y - h / 2, w, h, rotate: p.rot, ...(radius ? { radius } : {}) }
}
const inP = (ctx: Ctx, p: { cx: number; cy: number; rot: number }, draw: () => void) => rotated(ctx, p.cx, p.cy, p.rot, draw)
const gloss = (ctx: Ctx, s: Shape, deg: number, stops: [number, string][]) => {
  ctx.save()
  clipShape(ctx, s)
  ctx.fillStyle = linear(ctx, s.x, s.y, s.w, s.h, deg, stops)
  ctx.fillRect(s.x, s.y, s.w, s.h)
  ctx.restore()
}
const GLOSS: [number, string][] = [[0, 'rgba(255,255,255,0.35)'], [0.35, 'rgba(255,255,255,0)']]
function peel(ctx: Ctx, x: number, y: number) {
  box(ctx, x, y, 34, 34, linear(ctx, x, y, 34, 34, 225, [[0, '#e9e6dd'], [0.48, '#e9e6dd'], [0.5, 'rgba(0,0,0,0.25)'], [0.54, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0)']]))
}
function starPath(ctx: Ctx, x: number, y: number, w: number, h: number) {
  ctx.beginPath()
  STAR.forEach(([px, py], i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, x + (w * px) / 100, y + (h * py) / 100))
  ctx.closePath()
}

export const dindingStiker = kalcer({
  id: 'kalcer-dinding-stiker',
  name: 'dinding stiker',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#ecebe4' },
  // #d8d0b8 sesudah grayscale(1) contrast(1.2) = #e0e0e0 (mayoritas kotak FOTO)
  placeholder: '#e0e0e0',
  // 5 dari 6 kotak FOTO memakai grayscale(1) (sebagian + contrast 1.2) → foto hitam putih
  filter: 'mono',
  fonts: ['Anton', 'Space Mono:400,700', 'Permanent Marker', 'Archivo Black', 'Rubik Mono One', 'Pacifico', 'DM Serif Display'],
  fields: ['nama', 'nama2', 'tempat', 'tanggal', 'catatan'],
  slots: [
    slotIn(P1, 84, 324, 272, 272, 136),
    slotIn(P2, 452, 282, 296, 260, 12),
    slotIn(P3, 822, 431, 120, 140),
    slotIn(P4, 50, 980, 150, 150),
    slotIn(P5, 472, 872, 266, 240, 8),
    slotIn(P6, 930, 1010, 120, 120, 60),
  ],
  draw: {
    under(ctx, { texts, W, H }) {
      const nama = texts.nama?.trim() ?? ''
      const nama2 = texts.nama2?.trim() ?? ''
      const band = texts.catatan?.trim() ?? ''
      const year = yearOf(texts.tanggal)

      // ---- dinding keramik: gradien, kilap per ubin 120x60, nat 3px ----
      box(ctx, 0, 0, W, H, linear(ctx, 0, 0, W, H, 180, [[0, '#ecebe4'], [1, '#d9d6cc']]))
      const tg = linear(ctx, 0, 0, 120, 60, 135, [[0, 'rgba(255,255,255,0.35)'], [0.4, 'rgba(255,255,255,0)']])
      ctx.fillStyle = tg
      for (let y = 0; y < H; y += 60)
        for (let x = 0; x < W; x += 120) {
          ctx.save()
          ctx.translate(x, y)
          ctx.fillRect(0, 0, 120, 60)
          ctx.restore()
        }
      ctx.fillStyle = 'rgba(150,150,140,0.55)'
      for (let x = 60; x < W; x += 120) ctx.fillRect(x, 0, 3, H)
      for (let y = 57; y < H; y += 60) ctx.fillRect(0, y, W, 3)
      for (let x = 0; x < W; x += 120) ctx.fillRect(x, 0, 3, H)

      // noda + retakan
      for (const [x, y, w, h, a] of [[0, 1300, 500, 400, 0.35], [800, 1400, 500, 400, 0.3], [400, 0, 500, 200, 0.15], [1000, 500, 260, 500, 0.2]]) {
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
        ctx.clip()
        ctx.translate(x + w / 2, y + h / 2)
        ctx.scale(1, h / w)
        const R = (w / 2) * Math.SQRT2
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R)
        g.addColorStop(0, `rgba(110,100,70,${a})`)
        g.addColorStop(0.7, 'rgba(110,100,70,0)')
        g.addColorStop(1, 'rgba(110,100,70,0)')
        ctx.fillStyle = g
        ctx.fillRect(-w, -w, w * 2, w * 2)
        ctx.restore()
      }
      svg(ctx, 'M180 1180 l 30 20 l -10 30 l 24 18 M1060 240 l -20 30 l 14 26', 0, 0, 1200, 1800, 1200, 1800, { stroke: 'rgba(90,90,80,0.55)', lineWidth: 2 })
      box(ctx, 0, 1300, 1200, 500, linear(ctx, 0, 1300, 1200, 500, 180, [[0, 'rgba(90,80,50,0)'], [1, 'rgba(90,80,50,0.18)']]))

      // lampu: box-shadow 0 0 60px 30px (spread → bentuk diperbesar), lalu cahaya radial dari atas
      const lamp: Shape = { x: 300, y: 0, w: 600, h: 30, r: [0, 0, 10, 10] }
      ctx.save()
      ctx.beginPath()
      ctx.rect(-100, -100, W + 200, H + 200)
      shapePath(ctx, lamp)
      ctx.clip('evenodd')
      shadowOf(ctx, { x: 270, y: -30, w: 660, h: 90, r: [0, 0, 31.1, 31.1] }, 0, 0, 60, 'rgba(200,230,255,0.45)')
      ctx.restore()
      fillShape(ctx, lamp, linear(ctx, 300, 0, 600, 30, 180, [[0, '#e9f4ff'], [1, '#c9dcef']]))
      ctx.save()
      ctx.translate(600, 0)
      ctx.scale(1, 1800 / 600)
      const lg = ctx.createRadialGradient(0, 0, 0, 0, 0, 600 * Math.SQRT2)
      lg.addColorStop(0, 'rgba(210,235,255,0.35)')
      lg.addColorStop(0.55, 'rgba(210,235,255,0)')
      lg.addColorStop(1, 'rgba(210,235,255,0)')
      ctx.fillStyle = lg
      ctx.fillRect(-600, 0, 1200, 600)
      ctx.restore()

      // bekas lem
      for (const [x, y, w, deg] of [[300, 760, 220, -8], [760, 1260, 180, 6], [120, 1520, 240, -4]])
        rotated(ctx, x + w / 2, y + 9, deg, () => box(ctx, x, y, w, 18, 'rgba(30,30,30,0.08)', 9))

      // tulisan dinding
      ctx.save()
      ctx.globalAlpha = 0.55
      const head = ['TOILET', tempatUpper(texts.tempat)].filter(Boolean).join(' ')
      text(ctx, `${head} · JANGAN DICABUT`, 600, 40, { family: ANTON, size: 54, color: '#2a2a2a', align: 'center', maxWidth: 1140 })
      ctx.restore()

      for (const s of smallStickers(nama)) drawSmall(ctx, s)

      // lapisan multiply: noda besar + garis halus 20°
      ctx.save()
      ctx.globalCompositeOperation = 'multiply'
      ctx.save()
      ctx.translate(360, 1080)
      const ry = 1080 * Math.SQRT2
      const rx = 840 * Math.SQRT2
      ctx.scale(1, ry / rx)
      const mg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
      mg.addColorStop(0, 'rgba(120,100,60,0.18)')
      mg.addColorStop(0.6, 'rgba(120,100,60,0)')
      mg.addColorStop(1, 'rgba(120,100,60,0)')
      ctx.fillStyle = mg
      ctx.fillRect(-rx, -rx, rx * 2, rx * 2)
      ctx.restore()
      const a = (20 * Math.PI) / 180
      const L = Math.abs(W * Math.sin(a)) + Math.abs(H * Math.cos(a))
      const st: [number, string][] = []
      for (let p = 0; p + 8 <= L; p += 8) st.push([(p + 7) / L, 'rgba(0,0,0,0)'], [(p + 7) / L, 'rgba(0,0,0,0.025)'], [(p + 8) / L, 'rgba(0,0,0,0.025)'], [(p + 8) / L, 'rgba(0,0,0,0)'])
      ctx.fillStyle = linear(ctx, 0, 0, W, H, 20, st)
      ctx.fillRect(0, 0, W, H)
      ctx.restore()

      // ---- P1: pin bulat ----
      inP(ctx, P1, () => {
        const o: Shape = { x: 70, y: 310, w: 300, h: 300, r: 'ellipse' }
        shadowOf(ctx, o, 0, 3, 4, 'rgba(0,0,0,0.25)')
        fillShape(ctx, o, '#ece8dc')
        fillShape(ctx, { x: 84, y: 324, w: 272, h: 272, r: 'ellipse' }, '#8a3a32')
      })
      // ---- P2: kartu dengan bar judul ----
      inP(ctx, P2, () => {
        const o: Shape = { x: 440, y: 270, w: 320, h: 284, r: 22 }
        shadowOf(ctx, o, 0, 3, 4, 'rgba(0,0,0,0.25)')
        fillShape(ctx, o, '#ece8dc')
        box(ctx, 452, 282, 296, 260, '#3a4a6a', 12)
      })
      // ---- P3: HELLO my name is ----
      inP(ctx, P3, () => {
        const o: Shape = { x: 810, y: 350, w: 330, h: 247, r: 14 }
        shadowOf(ctx, o, 0, 3, 4, 'rgba(0,0,0,0.25)')
        ctx.save()
        clipShape(ctx, o)
        box(ctx, 810, 350, 330, 247, '#ece8dc')
        box(ctx, 810, 350, 330, 71, '#a83a32')
        box(ctx, 810, 583, 330, 14, '#a83a32')
        ctx.restore()
        text(ctx, 'HELLO', 975, 348, { family: ANTON, size: 40, color: '#f2ece0', align: 'center' })
        text(ctx, 'my name is', 975, 398, { family: MONO, size: 12, color: '#f2ece0', align: 'center' })
        if (nama) text(ctx, nama, 952, 476, { family: MARKER, size: 34, color: INK, maxWidth: 176 })
      })
      // ---- P4: stiker tur (outline putih 8px) ----
      inP(ctx, P4, () => {
        const o: Shape = { x: 50, y: 980, w: 360, h: 150, r: 0 }
        shadowOf(ctx, o, 0, 3, 4, 'rgba(0,0,0,0.25)')
        fillShape(ctx, o, '#4a5a3a')
        if (band) text(ctx, band, 214, 1007, { family: ANTON, size: 40, color: '#ffffff', maxWidth: 182 })
        text(ctx, ['tur kota-kota', year].filter(Boolean).join(' '), 214, 1055, { family: MONO, size: 11, color: '#ffffff', maxWidth: 182 })
        bars(ctx, 214, 1077, 110, 14, '#ffffff')
        peel(ctx, 378, 978)
        ringOut(ctx, o, 8, '#ffffff')
      })
      // ---- P5: kartu hologram ----
      inP(ctx, P5, () => {
        const o: Shape = { x: 460, y: 860, w: 290, h: 310, r: 16 }
        shadowOf(ctx, o, 0, 3, 4, 'rgba(0,0,0,0.25)')
        fillShape(ctx, o, linear(ctx, 460, 860, 290, 310, 135, [[0, '#d9b8c4'], [0.25, '#b8cbd9'], [0.5, '#c4d4b0'], [0.75, '#e0d0a8'], [1, '#c4b4d4']]))
        if (band) text(ctx, band, 605, 1120, { family: RUBIK, size: 18, color: INK, align: 'center', maxWidth: 266 })
        text(ctx, 'edisi terbatas · 17/50', 605, 1143, { family: MONO, size: 10, color: INK, align: 'center' })
      })
      // ---- P6: bintang emas (filter drop-shadow seluruh grup) ----
      inP(ctx, P6, () => {
        ctx.save()
        setShadow(ctx, 0, 3, 3, 'rgba(0,0,0,0.3)')
        starPath(ctx, 840, 900, 300, 330)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
        ctx.restore()
        starPath(ctx, 854, 914, 272, 302)
        ctx.fillStyle = '#c9a24a'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(990, 1070, 64, 0, Math.PI * 2)
        ctx.fillStyle = INK
        ctx.fill()
      })

      // coretan spidol
      const love = nama || nama2 ? `${[nama, nama2].filter(Boolean).join(' + ').toLowerCase()} 4ever` : 'kita 4ever'
      graffiti(ctx, love, 520, 1450, 34, '#2a2a2a', -4, 680)
      graffiti(ctx, 'gig minggu depan!!', 470, 1530, 26, '#2a3a6a', -3, 700)

      // papan WC
      rotated(ctx, 1100, 180, 3, () => {
        const o: Shape = { x: 1040, y: 120, w: 120, h: 120, r: 12 }
        shadowOf(ctx, o, 0, 4, 6, 'rgba(0,0,0,0.3)')
        fillShape(ctx, o, INK)
        text(ctx, 'WC', 1100, 139, { family: ANTON, size: 44, color: '#ffffff', align: 'center' })
        text(ctx, 'pria · wanita', 1100, 205, { family: MONO, size: 11, color: '#ffffff', align: 'center' })
      })
      // pengering tangan
      const dryer: Shape = { x: 1010, y: 1330, w: 170, h: 200, r: 14 }
      shadowOf(ctx, dryer, 0, 8, 10, 'rgba(0,0,0,0.3)')
      fillShape(ctx, dryer, linear(ctx, 1010, 1330, 170, 200, 180, METAL))
      ctx.beginPath()
      ctx.moveTo(1040, 1510)
      ctx.lineTo(1150, 1510)
      ctx.lineTo(1040 + 110 * 0.92, 1550)
      ctx.lineTo(1040 + 110 * 0.08, 1550)
      ctx.closePath()
      ctx.fillStyle = '#f4f2ec'
      ctx.fill()
      box(ctx, 1030, 1350, 130, 50, 'rgba(0,0,0,0.15)', 6)
      // pipa
      box(ctx, 0, 1620, 1200, 18, linear(ctx, 0, 1620, 1200, 18, 180, [[0, '#d9dee3'], [1, '#8f969d']]))
      // cermin
      box(ctx, -40, 1500, 400, 300, linear(ctx, -40, 1500, 400, 300, 135, [[0, '#cfd6dd'], [0.5, '#9aa3ae'], [1, '#e9edf2']]), 10)
      insetRing(ctx, -40, 1500, 400, 300, 10, '#8f969d', 10)
      rotated(ctx, 140, 1555, -20, () => box(ctx, 40, 1540, 200, 30, 'rgba(255,255,255,0.4)'))
      // wastafel / urinoir logam
      const sink: Shape = { x: 760, y: 1560, w: 200, h: 200, r: [30, 30, 50, 50] }
      shadowOf(ctx, sink, 0, 10, 14, 'rgba(0,0,0,0.35)')
      fillShape(ctx, sink, linear(ctx, 760, 1560, 200, 200, 180, METAL))
      box(ctx, 830, 1720, 60, 24, '#2a2a2e', 12)
      box(ctx, 800, 1600, 120, 20, 'rgba(0,0,0,0.2)', 4)
    },
    over(ctx, { texts }) {
      const nama = texts.nama?.trim() ?? ''
      const band = texts.catatan?.trim() ?? ''
      const year = yearOf(texts.tanggal)

      // P1: inset foto, [BAND], titik halftone (multiply), @user, kilap
      inP(ctx, P1, () => {
        const inner: Shape = { x: 84, y: 324, w: 272, h: 272, r: 'ellipse' }
        ctx.save()
        clipShape(ctx, inner)
        photoInset(ctx, 84, 324, 272, 272)
        if (band) {
          text(ctx, band, 222, 535, { family: ANTON, size: 30, color: '#000000', align: 'center', maxWidth: 240 })
          text(ctx, band, 220, 533, { family: ANTON, size: 30, color: '#ffffff', align: 'center', maxWidth: 240 })
        }
        // radial-gradient(rgba(0,0,0,.18) 1px, transparent 1.5px) 0 0 / 5px 5px
        const ht = tile('kalcer-halftone', 5, 5, (c) => {
          c.fillStyle = 'rgba(0,0,0,0.18)'
          for (const [x, y] of [[2, 2], [1, 2], [3, 2], [2, 1], [2, 3]]) c.fillRect(x, y, 1, 1)
          c.fillStyle = 'rgba(0,0,0,0.031)'
          for (const [x, y] of [[1, 1], [3, 1], [1, 3], [3, 3]]) c.fillRect(x, y, 1, 1)
        })
        ctx.globalCompositeOperation = 'multiply'
        ctx.fillStyle = pattern(ctx, ht, 84, 324)
        ctx.fillRect(84, 324, 272, 272)
        ctx.globalCompositeOperation = 'source-over'
        const handle = nama ? `@${nama.toLowerCase().replace(/\s+/g, '')}` : ''
        text(ctx, [handle, year].filter(Boolean).join(' · '), 220, 340, { family: MONO, size: 10, color: '#ffffff', align: 'center', maxWidth: 200 })
        ctx.restore()
        gloss(ctx, { x: 70, y: 310, w: 300, h: 300, r: 'ellipse' }, 120, GLOSS)
      })
      // P2: inset foto, bar [BAND] di atas foto, sudut terkelupas, kilap
      inP(ctx, P2, () => {
        ctx.save()
        clipShape(ctx, { x: 452, y: 282, w: 296, h: 260, r: 12 })
        photoInset(ctx, 452, 282, 296, 260)
        box(ctx, 452, 282, 296, 41, '#3a4a6a')
        if (band) text(ctx, band, 464, 290, { family: RUBIK, size: 20, color: '#ffffff', maxWidth: 272 })
        ctx.restore()
        peel(ctx, 728, 268)
        gloss(ctx, { x: 440, y: 270, w: 320, h: 284, r: 22 }, 120, GLOSS)
      })
      inP(ctx, P3, () => {
        photoInset(ctx, 822, 431, 120, 140)
        gloss(ctx, { x: 810, y: 350, w: 330, h: 247, r: 14 }, 120, GLOSS)
      })
      inP(ctx, P4, () => {
        photoInset(ctx, 50, 980, 150, 150)
        gloss(ctx, { x: 50, y: 980, w: 360, h: 150, r: 0 }, 120, GLOSS)
      })
      inP(ctx, P5, () => {
        ctx.save()
        clipShape(ctx, { x: 472, y: 872, w: 266, h: 240, r: 8 })
        photoInset(ctx, 472, 872, 266, 240)
        ctx.restore()
        gloss(ctx, { x: 460, y: 860, w: 290, h: 310, r: 16 }, 115, [[0.3, 'rgba(255,255,255,0)'], [0.45, 'rgba(255,255,255,0.55)'], [0.6, 'rgba(255,255,255,0)']])
      })
      inP(ctx, P6, () => {
        ctx.save()
        clipShape(ctx, { x: 930, y: 1010, w: 120, h: 120, r: 'ellipse' })
        photoInset(ctx, 930, 1010, 120, 120)
        ctx.restore()
      })
    },
  },
})

function tempatUpper(s: string | undefined) {
  return s?.trim().toUpperCase() ?? ''
}

/** teks SVG (x,y = garis dasar) Permanent Marker, opacity .8, rotate(deg x y) */
function graffiti(ctx: Ctx, s: string, x: number, y: number, size: number, color: string, deg: number, maxW: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.font = `400 ${size}px "Permanent Marker", cursive`
  const w = ctx.measureText(s).width
  if (w > maxW) ctx.font = `400 ${(size * maxW) / w}px "Permanent Marker", cursive`
  ctx.globalAlpha = 0.8
  ctx.fillStyle = color
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(s, 0, 0)
  ctx.restore()
}
