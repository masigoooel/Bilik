// Gambar stiker tempel bilik, dikelompokkan per kategori (sama dengan kategori template).
// Tiap gambar berpusat di (0,0) setinggi s; pinggiran putih & bayangan ditambahkan di stickers.ts.

type Ctx = CanvasRenderingContext2D

const INK = '#111111'
const PINK = '#FF3E8A'
const DISPLAY = '"Outfit Variable", "Outfit", system-ui, sans-serif'
const MONO = '"Space Mono", ui-monospace, monospace'

/** gambar satu stiker berpusat di (0,0) dengan tinggi s; `w` = perkiraan lebar relatif tinggi (ruang gambar) */
export type Art = { id: string; name: string; w: number; draw: (c: Ctx, s: number) => void }

// ---------- bentuk (senada dengan stiker wajah) ----------

function heartPath(c: Ctx, s: number) {
  c.save()
  c.translate(0, s * 0.25)
  c.scale(s / 17, s / 17)
  c.beginPath()
  c.moveTo(0, 5)
  c.bezierCurveTo(-14, -6, -6, -16, 0, -8)
  c.bezierCurveTo(6, -16, 14, -6, 0, 5)
  c.restore()
}

function heart(c: Ctx, s: number, col = '#ff2f7a') {
  heartPath(c, s)
  c.fillStyle = col
  c.fill()
  // kilau kecil
  c.fillStyle = 'rgba(255,255,255,.6)'
  c.beginPath()
  c.ellipse(-s * 0.3, -s * 0.27, s * 0.09, s * 0.055, -0.7, 0, 7)
  c.fill()
}

function star(c: Ctx, s: number, col = '#ffd24a') {
  c.beginPath()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? s * 0.22 : s * 0.5
    const a = (i * Math.PI) / 5 - Math.PI / 2
    c.lineTo(Math.cos(a) * r, Math.sin(a) * r + s * 0.03)
  }
  c.closePath()
  c.fillStyle = col
  c.fill()
  c.lineWidth = s * 0.035
  c.lineJoin = 'round'
  c.strokeStyle = '#e8a800'
  c.stroke()
}

function sparkle(c: Ctx, s: number, col = '#ffc6e8', edge = '#ff7ab8') {
  const r = s * 0.48
  c.beginPath()
  c.moveTo(0, -r)
  c.quadraticCurveTo(0, 0, r, 0)
  c.quadraticCurveTo(0, 0, 0, r)
  c.quadraticCurveTo(0, 0, -r, 0)
  c.quadraticCurveTo(0, 0, 0, -r)
  c.fillStyle = col
  c.fill()
  c.lineWidth = s * 0.04
  c.strokeStyle = edge
  c.stroke()
  // kilau kecil kedua
  c.save()
  c.translate(s * 0.3, -s * 0.28)
  c.scale(0.32, 0.32)
  c.beginPath()
  c.moveTo(0, -r)
  c.quadraticCurveTo(0, 0, r, 0)
  c.quadraticCurveTo(0, 0, 0, r)
  c.quadraticCurveTo(0, 0, -r, 0)
  c.quadraticCurveTo(0, 0, 0, -r)
  c.fillStyle = '#d9c4ff'
  c.fill()
  c.restore()
}

function butterfly(c: Ctx, s: number) {
  const cols = ['#ff8fd1', '#ffc6e8']
  for (const d of [-1, 1]) {
    c.save()
    c.scale(d, 1)
    c.fillStyle = cols[0]
    c.beginPath()
    c.ellipse(s * 0.22, -s * 0.12, s * 0.24, s * 0.19, -0.5, 0, 7)
    c.fill()
    c.fillStyle = cols[1]
    c.beginPath()
    c.ellipse(s * 0.17, s * 0.13, s * 0.17, s * 0.13, 0.5, 0, 7)
    c.fill()
    c.fillStyle = 'rgba(255,255,255,.7)'
    c.beginPath()
    c.arc(s * 0.27, -s * 0.15, s * 0.04, 0, 7)
    c.fill()
    c.restore()
  }
  c.fillStyle = '#3a2a3a'
  c.beginPath()
  c.ellipse(0, s * 0.02, s * 0.04, s * 0.2, 0, 0, 7)
  c.fill()
  c.strokeStyle = '#3a2a3a'
  c.lineWidth = s * 0.025
  c.lineCap = 'round'
  c.beginPath()
  c.moveTo(0, -s * 0.16)
  c.quadraticCurveTo(-s * 0.08, -s * 0.32, -s * 0.14, -s * 0.34)
  c.moveTo(0, -s * 0.16)
  c.quadraticCurveTo(s * 0.08, -s * 0.32, s * 0.14, -s * 0.34)
  c.stroke()
}

function petal(c: Ctx, s: number) {
  // bunga sakura lima kelopak
  for (let i = 0; i < 5; i++) {
    c.save()
    c.rotate((i * 2 * Math.PI) / 5)
    c.beginPath()
    c.moveTo(0, 0)
    c.bezierCurveTo(s * 0.2, -s * 0.12, s * 0.17, -s * 0.42, s * 0.04, -s * 0.46)
    c.lineTo(0, -s * 0.4)
    c.lineTo(-s * 0.04, -s * 0.46)
    c.bezierCurveTo(-s * 0.17, -s * 0.42, -s * 0.2, -s * 0.12, 0, 0)
    c.fillStyle = i % 2 ? '#ffc0d6' : '#ff9ab8'
    c.fill()
    c.restore()
  }
  c.fillStyle = '#ffd24a'
  c.beginPath()
  c.arc(0, 0, s * 0.07, 0, 7)
  c.fill()
}

function bubble(c: Ctx, s: number) {
  const r = s * 0.46
  const g = c.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r)
  g.addColorStop(0, 'rgba(255,255,255,.55)')
  g.addColorStop(0.7, 'rgba(180,220,255,.35)')
  g.addColorStop(1, 'rgba(255,160,220,.65)')
  c.fillStyle = g
  c.beginPath()
  c.arc(0, 0, r, 0, 7)
  c.fill()
  const rg = c.createLinearGradient(-r, -r, r, r)
  rg.addColorStop(0, 'rgba(255,140,200,1)')
  rg.addColorStop(0.5, 'rgba(140,220,255,1)')
  rg.addColorStop(1, 'rgba(200,255,160,1)')
  c.strokeStyle = rg
  c.lineWidth = s * 0.05
  c.stroke()
  c.fillStyle = 'rgba(255,255,255,.95)'
  c.beginPath()
  c.ellipse(-r * 0.38, -r * 0.4, r * 0.2, r * 0.11, -0.7, 0, 7)
  c.fill()
}

function bird(c: Ctx, s: number) {
  c.save()
  c.scale(s / 34, s / 34)
  c.translate(-3, 2)
  c.fillStyle = '#5fb0ff'
  c.beginPath()
  c.ellipse(0, 0, 14, 10, 0, 0, 7)
  c.fill()
  c.beginPath()
  c.arc(10, -6, 7, 0, 7)
  c.fill()
  c.fillStyle = '#ffb02e'
  c.beginPath()
  c.moveTo(16, -6)
  c.lineTo(23, -4)
  c.lineTo(16, -2)
  c.fill()
  c.fillStyle = '#111'
  c.beginPath()
  c.arc(12, -8, 1.6, 0, 7)
  c.fill()
  c.fillStyle = '#3a8ad6'
  c.beginPath()
  c.ellipse(-2, -4, 10, 6, -0.5, 0, 7)
  c.fill()
  c.restore()
}

function note(c: Ctx, s: number) {
  c.fillStyle = '#7a5cff'
  c.strokeStyle = '#7a5cff'
  c.lineWidth = s * 0.07
  c.lineCap = 'round'
  c.beginPath()
  c.ellipse(-s * 0.2, s * 0.24, s * 0.13, s * 0.095, -0.4, 0, 7)
  c.ellipse(s * 0.2, s * 0.16, s * 0.13, s * 0.095, -0.4, 0, 7)
  c.fill()
  c.beginPath()
  c.moveTo(-s * 0.09, s * 0.22)
  c.lineTo(-s * 0.09, -s * 0.3)
  c.lineTo(s * 0.31, -s * 0.38)
  c.lineTo(s * 0.31, s * 0.14)
  c.stroke()
  c.lineWidth = s * 0.1
  c.beginPath()
  c.moveTo(-s * 0.09, -s * 0.27)
  c.lineTo(s * 0.31, -s * 0.35)
  c.stroke()
}

// ---------- tulisan (gaya bilik: huruf kecil, Outfit tebal) ----------

/** pil berisi tulisan; `fsK` = ukuran huruf relatif tinggi, `radius` = sudut relatif tinggi (bawaan: bulat penuh) */
function pill(text: string, bg: string, fg: string, opts: TextOpts & { border?: string; fsK?: number; radius?: number } = {}) {
  return (c: Ctx, s: number) => {
    const fs = s * (opts.fsK ?? 0.52)
    c.font = fontOf(fs, opts)
    const tw = c.measureText(text).width
    const w = tw + s * 0.6
    const h = s * 0.86
    c.beginPath()
    c.roundRect(-w / 2, -h / 2, w, h, h * (opts.radius ?? 0.5))
    c.fillStyle = bg
    c.fill()
    if (opts.border) {
      c.lineWidth = s * 0.05
      c.strokeStyle = opts.border
      c.stroke()
    }
    c.fillStyle = fg
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillText(text, 0, s * 0.03)
  }
}

function poseDulu(c: Ctx, s: number) {
  c.font = `800 ${s * 0.7}px ${DISPLAY}`
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillStyle = INK
  const w = c.measureText('pose dulu').width
  c.fillText('pose dulu', -s * 0.08, 0)
  c.fillStyle = PINK
  c.beginPath()
  c.arc(w / 2 - s * 0.02, s * 0.16, s * 0.08, 0, 7)
  c.fill()
}

function logo(c: Ctx, s: number) {
  // ikon 2x2 bilik + tulisan
  const k = s * 0.8
  const x0 = -s * 1.05
  c.fillStyle = INK
  c.beginPath()
  c.roundRect(x0, -k / 2, k, k, k * 0.25)
  c.fill()
  const cell = k * 0.28
  const gap = k * 0.06
  const cells = [
    [x0 + k * 0.19, -k * 0.31, PINK],
    [x0 + k * 0.19 + cell + gap, -k * 0.31, '#fff'],
    [x0 + k * 0.19, -k * 0.31 + cell + gap, '#fff'],
    [x0 + k * 0.19 + cell + gap, -k * 0.31 + cell + gap, '#fff'],
  ] as const
  for (const [x, y, col] of cells) {
    c.fillStyle = col
    c.beginPath()
    c.roundRect(x, y, cell, cell, cell * 0.28)
    c.fill()
  }
  c.font = `800 ${s * 0.7}px ${DISPLAY}`
  c.textAlign = 'left'
  c.textBaseline = 'middle'
  c.fillStyle = INK
  c.fillText('bilik', x0 + k + s * 0.12, s * 0.02)
}

function cie(c: Ctx, s: number) {
  // ledakan kuning bergerigi + tulisan
  c.beginPath()
  const n = 14
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? s * 0.4 : s * 0.5
    const a = (i * Math.PI) / n
    c.lineTo(Math.cos(a) * r * 1.2, Math.sin(a) * r)
  }
  c.closePath()
  c.fillStyle = '#ffd24a'
  c.fill()
  c.font = `800 ${s * 0.36}px ${DISPLAY}`
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillStyle = INK
  c.fillText('cie!', 0, s * 0.02)
}

function sayCheese(c: Ctx, s: number) {
  // balon kata
  c.font = `800 ${s * 0.44}px ${DISPLAY}`
  const tw = c.measureText('say cheese').width
  const w = tw + s * 0.55
  const h = s * 0.74
  c.beginPath()
  c.roundRect(-w / 2, -h / 2 - s * 0.06, w, h, h * 0.4)
  c.moveTo(-w * 0.18, h / 2 - s * 0.08)
  c.lineTo(-w * 0.3, h / 2 + s * 0.16)
  c.lineTo(-w * 0.04, h / 2 - s * 0.08)
  c.fillStyle = '#ffffff'
  c.fill()
  c.lineWidth = s * 0.05
  c.lineJoin = 'round'
  c.strokeStyle = INK
  c.stroke()
  c.fillStyle = INK
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillText('say cheese', 0, -s * 0.03)
}

/** stiker umum bilik: bentuk dulu, lalu tulisan */
const BASE: Art[] = [
  { id: 'hati', name: 'hati', w: 1, draw: (c, s) => heart(c, s) },
  { id: 'bintang', name: 'bintang', w: 1, draw: (c, s) => star(c, s) },
  { id: 'kilau', name: 'kilau', w: 1, draw: (c, s) => sparkle(c, s) },
  { id: 'kupu-kupu', name: 'kupu-kupu', w: 1, draw: butterfly },
  { id: 'sakura', name: 'sakura', w: 1, draw: petal },
  { id: 'gelembung', name: 'gelembung', w: 1, draw: bubble },
  { id: 'burung', name: 'burung', w: 1.1, draw: bird },
  { id: 'not', name: 'not musik', w: 1, draw: note },
  { id: 'pose-dulu', name: 'pose dulu.', w: 3.6, draw: poseDulu },
  { id: 'bilik', name: 'bilik', w: 2.6, draw: logo },
  { id: 'bestie', name: 'bestie', w: 2.4, draw: pill('bestie', PINK, INK) },
  { id: 'xoxo', name: 'xoxo', w: 2.1, draw: pill('xoxo', '#d9c4ff', INK) },
  { id: 'cie', name: 'cie!', w: 1.25, draw: cie },
  { id: 'hari-ini', name: 'hari ini', w: 3, draw: pill('hari ini', '#f7f6f2', INK, { font: MONO, weight: 700, border: INK }) },
  { id: 'say-cheese', name: 'say cheese', w: 3.7, draw: sayCheese },
  { id: 'ootd', name: 'ootd', w: 2.1, draw: pill('ootd', INK, '#ffffff') },
]

// ---------- alat bantu umum ----------

const SERIF = '"DM Serif Display", Georgia, serif'
const HAND = '"Caveat Variable", "Caveat", cursive'
const PIXEL = 'VT323, monospace'
const IMPACT = 'Anton, Impact, sans-serif'

type TextOpts = { font?: string; weight?: number; style?: 'italic'; size?: number }
const fontOf = (px: number, o: TextOpts = {}) => `${o.style ?? ''} ${o.weight ?? 800} ${px}px ${o.font ?? DISPLAY}`.trim()

/** tulisan lepas (tanpa latar); pinggiran putih stiker yang membuatnya terbaca */
function label(text: string, color: string, o: TextOpts & { stroke?: string; strokeW?: number; spacing?: number; shadow?: [number, number, string]; underline?: boolean } = {}) {
  return (c: Ctx, s: number) => {
    const fs = s * (o.size ?? 0.7)
    c.font = fontOf(fs, o)
    // jarak antarhuruf (font rapat seperti Anton); browser tanpa dukungan cukup mengabaikannya
    if (o.spacing) c.letterSpacing = `${fs * o.spacing}px`
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.lineJoin = 'round'
    if (o.shadow) {
      c.fillStyle = o.shadow[2]
      if (o.stroke) {
        c.lineWidth = fs * (o.strokeW ?? 0.14)
        c.strokeStyle = o.shadow[2]
        c.strokeText(text, o.shadow[0] * s, o.shadow[1] * s)
      }
      c.fillText(text, o.shadow[0] * s, o.shadow[1] * s)
    }
    if (o.stroke) {
      c.lineWidth = fs * (o.strokeW ?? 0.14)
      c.strokeStyle = o.stroke
      c.strokeText(text, 0, 0)
    }
    c.fillStyle = color
    c.fillText(text, 0, 0)
    if (o.underline) {
      const w = c.measureText(text).width
      c.fillRect(-w / 2, fs * 0.42, w, Math.max(1, fs * 0.05))
    }
  }
}

/** kartu bersudut kecil berisi tulisan */
const card = (text: string, bg: string, fg: string, o: Parameters<typeof pill>[3] = {}) => pill(text, bg, fg, { radius: 0.14, ...o })

/** gambar piksel dari baris huruf; tinggi = s */
function pixels(rows: string[], pal: Record<string, string>) {
  return (c: Ctx, s: number) => {
    const p = s / rows.length
    const cols = Math.max(...rows.map((r) => r.length))
    const x0 = (-cols * p) / 2
    const y0 = -s / 2
    rows.forEach((r, y) =>
      [...r].forEach((ch, x) => {
        const col = pal[ch]
        if (!col) return
        c.fillStyle = col
        // sedikit melebar supaya tidak ada garis tipis di antara piksel
        c.fillRect(x0 + x * p, y0 + y * p, p + 0.6, p + 0.6)
      }),
    )
  }
}

/** bentuk-bentuk yang menyatu: digaris tebal dulu lalu diisi, jadi garisnya hanya di tepi luar */
function blob(c: Ctx, paths: ((c: Ctx) => void)[], fill: string, line: string, lw: number) {
  c.lineWidth = lw
  c.strokeStyle = line
  c.lineJoin = 'round'
  for (const p of paths) {
    c.beginPath()
    p(c)
    c.stroke()
  }
  c.fillStyle = fill
  for (const p of paths) {
    c.beginPath()
    p(c)
    c.fill()
  }
}

function bow(c: Ctx, s: number, col: string, shade: string) {
  for (const d of [-1, 1]) {
    c.save()
    c.scale(d, 1)
    c.beginPath()
    c.moveTo(s * 0.02, s * 0.05)
    c.lineTo(s * 0.22, s * 0.46)
    c.lineTo(s * 0.14, s * 0.41)
    c.lineTo(s * 0.08, s * 0.5)
    c.lineTo(-s * 0.03, s * 0.08)
    c.fillStyle = shade
    c.fill()
    c.beginPath()
    c.moveTo(0, 0)
    c.bezierCurveTo(s * 0.15, -s * 0.36, s * 0.52, -s * 0.36, s * 0.5, -s * 0.02)
    c.bezierCurveTo(s * 0.5, s * 0.3, s * 0.15, s * 0.24, 0, 0)
    c.fillStyle = col
    c.fill()
    c.fillStyle = 'rgba(255,255,255,.35)'
    c.beginPath()
    c.ellipse(s * 0.3, -s * 0.12, s * 0.08, s * 0.04, -0.4, 0, 7)
    c.fill()
    c.restore()
  }
  c.fillStyle = shade
  c.beginPath()
  c.roundRect(-s * 0.08, -s * 0.09, s * 0.16, s * 0.18, s * 0.05)
  c.fill()
}

function speech(c: Ctx, s: number, text: string, bg: string, fg: string, font = DISPLAY) {
  c.font = fontOf(s * 0.46, { font })
  const w = c.measureText(text).width + s * 0.55
  const h = s * 0.78
  c.beginPath()
  c.roundRect(-w / 2, -h / 2 - s * 0.06, w, h, h * 0.45)
  c.moveTo(w * 0.1, h / 2 - s * 0.1)
  c.lineTo(w * 0.24, h / 2 + s * 0.16)
  c.lineTo(w * 0.28, h / 2 - s * 0.1)
  c.fillStyle = bg
  c.fill()
  c.fillStyle = fg
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillText(text, 0, -s * 0.04)
}

function burst(c: Ctx, s: number, n: number, rOut: number, rIn: number, fill: string, line?: string, seed = 1) {
  c.beginPath()
  for (let i = 0; i < n * 2; i++) {
    // gerigi tidak rata seperti gambar komik
    const j = 1 + 0.12 * Math.sin(i * 2.7 + seed)
    const r = (i % 2 ? rIn : rOut) * s * j
    const a = (i * Math.PI) / n
    c.lineTo(Math.cos(a) * r * 1.15, Math.sin(a) * r)
  }
  c.closePath()
  c.fillStyle = fill
  c.fill()
  if (line) {
    c.lineWidth = s * 0.04
    c.lineJoin = 'round'
    c.strokeStyle = line
    c.stroke()
  }
}

const centerText = (c: Ctx, text: string, x: number, y: number, font: string, color: string) => {
  c.font = font
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillStyle = color
  c.fillText(text, x, y)
}

// ---------- klasik: putih bersih, serif tenang ----------

const KLASIK: Art[] = [
  { id: 'k-withlove', name: 'with love', w: 3.6, draw: card('with love,', '#ffffff', INK, { font: SERIF, weight: 400, style: 'italic', border: INK }) },
  {
    id: 'k-kenangan',
    name: 'kenangan',
    w: 3.2,
    draw: (c, s) => {
      c.font = fontOf(s * 0.44, { font: SERIF, weight: 400 })
      const rx = c.measureText('kenangan').width / 2 + s * 0.36
      c.beginPath()
      c.ellipse(0, 0, rx, s * 0.46, 0, 0, 7)
      c.fillStyle = '#ffffff'
      c.fill()
      c.lineWidth = s * 0.03
      c.strokeStyle = INK
      c.stroke()
      c.beginPath()
      c.ellipse(0, 0, rx - s * 0.07, s * 0.39, 0, 0, 7)
      c.lineWidth = s * 0.012
      c.stroke()
      centerText(c, 'kenangan', 0, s * 0.02, fontOf(s * 0.44, { font: SERIF, weight: 400 }), INK)
    },
  },
  { id: 'k-pita', name: 'pita hitam', w: 1.1, draw: (c, s) => bow(c, s, '#1d1d1d', '#000000') },
  { id: 'k-no', name: 'no. 01', w: 2.4, draw: card('no. 01', '#ffffff', INK, { font: MONO, weight: 700, border: INK }) },
  {
    id: 'k-bunga',
    name: 'bunga garis',
    w: 0.9,
    draw: (c, s) => {
      c.strokeStyle = INK
      c.lineWidth = s * 0.03
      c.lineCap = 'round'
      c.beginPath()
      c.moveTo(0, s * 0.48)
      c.quadraticCurveTo(-s * 0.06, s * 0.2, 0, -s * 0.1)
      c.stroke()
      c.beginPath()
      c.ellipse(-s * 0.12, s * 0.22, s * 0.12, s * 0.05, -0.6, 0, 7)
      c.stroke()
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3
        c.beginPath()
        c.ellipse(Math.cos(a) * s * 0.14, -s * 0.24 + Math.sin(a) * s * 0.14, s * 0.1, s * 0.06, a, 0, 7)
        c.fillStyle = '#ffffff'
        c.fill()
        c.stroke()
      }
      c.beginPath()
      c.arc(0, -s * 0.24, s * 0.06, 0, 7)
      c.fillStyle = INK
      c.fill()
    },
  },
  { id: 'k-selamanya', name: 'selamanya', w: 3.6, draw: label('selamanya', INK, { font: SERIF, weight: 400, style: 'italic', size: 0.72 }) },
]

// ---------- retro: krem hangat, garis 70-an ----------

const BROWN = '#5A3A22'
const ORANGE = '#E2582B'
const MUSTARD = '#E9A83A'
const CREAM = '#F3E3C3'

const RETRO: Art[] = [
  {
    id: 'r-pelangi',
    name: 'pelangi 70-an',
    w: 1.2,
    draw: (c, s) => {
      const cols = [BROWN, ORANGE, MUSTARD, '#8DA36B']
      cols.forEach((col, i) => {
        c.beginPath()
        c.arc(0, s * 0.25, s * (0.55 - i * 0.11) - s * 0.055, Math.PI, 0)
        c.lineWidth = s * 0.11
        c.strokeStyle = col
        c.stroke()
      })
    },
  },
  { id: 'r-groovy', name: 'groovy', w: 3.2, draw: label('groovy', ORANGE, { size: 0.78, shadow: [0.06, 0.06, BROWN] }) },
  {
    id: 'r-daisy',
    name: 'daisy',
    w: 1,
    draw: (c, s) => {
      for (let i = 0; i < 12; i++) {
        c.save()
        c.rotate((i * Math.PI) / 6)
        c.beginPath()
        c.ellipse(0, -s * 0.28, s * 0.085, s * 0.2, 0, 0, 7)
        c.fillStyle = '#FFF8E8'
        c.fill()
        c.lineWidth = s * 0.018
        c.strokeStyle = BROWN
        c.stroke()
        c.restore()
      }
      c.beginPath()
      c.arc(0, 0, s * 0.15, 0, 7)
      c.fillStyle = MUSTARD
      c.fill()
      c.lineWidth = s * 0.018
      c.strokeStyle = BROWN
      c.stroke()
    },
  },
  {
    id: 'r-kaset',
    name: 'kaset',
    w: 1.5,
    draw: (c, s) => {
      c.fillStyle = BROWN
      c.beginPath()
      c.roundRect(-s * 0.7, -s * 0.45, s * 1.4, s * 0.9, s * 0.08)
      c.fill()
      c.fillStyle = CREAM
      c.beginPath()
      c.roundRect(-s * 0.6, -s * 0.37, s * 1.2, s * 0.44, s * 0.04)
      c.fill()
      c.fillStyle = ORANGE
      c.fillRect(-s * 0.6, -s * 0.12, s * 1.2, s * 0.07)
      c.fillStyle = MUSTARD
      c.fillRect(-s * 0.6, -s * 0.05, s * 1.2, s * 0.05)
      c.fillStyle = '#2a1d12'
      c.beginPath()
      c.roundRect(-s * 0.36, s * 0.12, s * 0.72, s * 0.2, s * 0.1)
      c.fill()
      for (const x of [-0.22, 0.22]) {
        c.fillStyle = CREAM
        c.beginPath()
        c.arc(x * s, s * 0.22, s * 0.075, 0, 7)
        c.fill()
        c.fillStyle = BROWN
        c.beginPath()
        c.arc(x * s, s * 0.22, s * 0.03, 0, 7)
        c.fill()
      }
      c.fillStyle = '#3f2817'
      c.beginPath()
      c.moveTo(-s * 0.42, s * 0.45)
      c.lineTo(-s * 0.34, s * 0.35)
      c.lineTo(s * 0.34, s * 0.35)
      c.lineTo(s * 0.42, s * 0.45)
      c.fill()
      centerText(c, 'mixtape', 0, -s * 0.24, fontOf(s * 0.14, { font: MONO, weight: 700 }), BROWN)
    },
  },
  { id: 'r-vibes', name: 'good vibes', w: 3.8, draw: pill('good vibes', BROWN, CREAM) },
  {
    id: 'r-piringan',
    name: 'piringan hitam',
    w: 1,
    draw: (c, s) => {
      c.fillStyle = '#1b1b1b'
      c.beginPath()
      c.arc(0, 0, s * 0.48, 0, 7)
      c.fill()
      c.strokeStyle = 'rgba(255,255,255,.12)'
      c.lineWidth = s * 0.012
      for (const r of [0.41, 0.35, 0.29]) {
        c.beginPath()
        c.arc(0, 0, s * r, 0, 7)
        c.stroke()
      }
      c.strokeStyle = 'rgba(255,255,255,.3)'
      c.lineWidth = s * 0.03
      c.beginPath()
      c.arc(0, 0, s * 0.38, -2.5, -1.7)
      c.stroke()
      c.fillStyle = ORANGE
      c.beginPath()
      c.arc(0, 0, s * 0.17, 0, 7)
      c.fill()
      c.fillStyle = CREAM
      c.beginPath()
      c.arc(0, 0, s * 0.03, 0, 7)
      c.fill()
    },
  },
]

// ---------- y2k: jendela windows, flip phone, stiker ----------

const TEAL = '#3A8C8C'
const Y2K_PINK = '#FF7EC2'
const SILVER = '#D4D0C8'

function bevel(c: Ctx, x: number, y: number, w: number, h: number, lw: number) {
  c.fillStyle = SILVER
  c.fillRect(x, y, w, h)
  c.fillStyle = '#ffffff'
  c.fillRect(x, y, w, lw)
  c.fillRect(x, y, lw, h)
  c.fillStyle = '#808080'
  c.fillRect(x, y + h - lw, w, lw)
  c.fillRect(x + w - lw, y, lw, h)
}

const Y2K: Art[] = [
  {
    id: 'y-kursor',
    name: 'kursor',
    w: 0.8,
    draw: pixels(
      [
        'B..........',
        'BB.........',
        'BWB........',
        'BWWB.......',
        'BWWWB......',
        'BWWWWB.....',
        'BWWWWWB....',
        'BWWWWWWB...',
        'BWWWWWWWB..',
        'BWWWWWWWWB.',
        'BWWWWWBBBBB',
        'BWWBWWB....',
        'BWB.BWWB...',
        'BB..BWWB...',
        'B....BWWB..',
        '.....BWWB..',
        '......BB...',
      ],
      { B: INK, W: '#ffffff' },
    ),
  },
  {
    id: 'y-popup',
    name: 'jendela pesan',
    w: 1.8,
    draw: (c, s) => {
      const x = -s * 0.8
      const y = -s * 0.45
      bevel(c, x, y, s * 1.6, s * 0.9, s * 0.025)
      c.fillStyle = TEAL
      c.fillRect(x + s * 0.05, y + s * 0.05, s * 1.5, s * 0.17)
      c.font = fontOf(s * 0.1, { font: MONO, weight: 700 })
      c.textAlign = 'left'
      c.textBaseline = 'middle'
      c.fillStyle = '#ffffff'
      c.fillText('pesan baru', x + s * 0.1, y + s * 0.14)
      bevel(c, x + s * 1.38, y + s * 0.07, s * 0.13, s * 0.12, s * 0.015)
      centerText(c, 'x', x + s * 1.445, y + s * 0.125, fontOf(s * 0.1, { font: MONO, weight: 700 }), INK)
      centerText(c, 'kamu lucu hari ini', 0, -s * 0.04, fontOf(s * 0.13, { weight: 700 }), INK)
      bevel(c, -s * 0.2, s * 0.13, s * 0.4, s * 0.18, s * 0.02)
      c.strokeStyle = INK
      c.lineWidth = s * 0.01
      c.strokeRect(-s * 0.2, s * 0.13, s * 0.4, s * 0.18)
      centerText(c, 'ok', 0, s * 0.225, fontOf(s * 0.11, { weight: 700 }), INK)
    },
  },
  {
    id: 'y-krom',
    name: 'bintang krom',
    w: 1,
    draw: (c, s) => {
      const r = s * 0.5
      const g = c.createLinearGradient(-r, -r, r, r)
      g.addColorStop(0, '#ffffff')
      g.addColorStop(0.35, '#BFE3FF')
      g.addColorStop(0.6, Y2K_PINK)
      g.addColorStop(1, '#c7c2d6')
      c.beginPath()
      c.moveTo(0, -r)
      c.quadraticCurveTo(s * 0.06, -s * 0.06, r, 0)
      c.quadraticCurveTo(s * 0.06, s * 0.06, 0, r)
      c.quadraticCurveTo(-s * 0.06, s * 0.06, -r, 0)
      c.quadraticCurveTo(-s * 0.06, -s * 0.06, 0, -r)
      c.fillStyle = g
      c.fill()
      c.lineWidth = s * 0.02
      c.strokeStyle = '#7a7896'
      c.stroke()
      c.fillStyle = 'rgba(255,255,255,.9)'
      c.beginPath()
      c.ellipse(-s * 0.06, -s * 0.16, s * 0.03, s * 0.1, 0.2, 0, 7)
      c.fill()
    },
  },
  { id: 'y-lol', name: 'lol', w: 2, draw: pill('lol', Y2K_PINK, INK, { font: PIXEL, weight: 400, fsK: 0.78 }) },
  {
    id: 'y-cd',
    name: 'cd',
    w: 1,
    draw: (c, s) => {
      const r = s * 0.48
      let g: CanvasGradient
      if (typeof c.createConicGradient === 'function') {
        g = c.createConicGradient(0.6, 0, 0)
        const cols = ['#ffd6f0', '#c9f0ff', '#e8ffd0', '#fff3c4', '#e6d4ff', '#ffd6f0']
        cols.forEach((col, i) => g.addColorStop(i / (cols.length - 1), col))
      } else {
        g = c.createLinearGradient(-r, -r, r, r)
        g.addColorStop(0, '#ffd6f0')
        g.addColorStop(0.5, '#c9f0ff')
        g.addColorStop(1, '#e6d4ff')
      }
      c.beginPath()
      c.arc(0, 0, r, 0, 7)
      c.fillStyle = g
      c.fill()
      c.lineWidth = s * 0.015
      c.strokeStyle = '#a9a3c4'
      c.stroke()
      c.beginPath()
      c.arc(0, 0, s * 0.15, 0, 7)
      c.fillStyle = '#eeeeee'
      c.fill()
      c.stroke()
      c.save()
      c.globalCompositeOperation = 'destination-out'
      c.beginPath()
      c.arc(0, 0, s * 0.06, 0, 7)
      c.fill()
      c.restore()
    },
  },
  {
    id: 'y-loading',
    name: 'loading',
    w: 1.7,
    draw: (c, s) => {
      centerText(c, 'loading...', -s * 0.2, -s * 0.24, fontOf(s * 0.2, { font: MONO, weight: 700 }), INK)
      c.beginPath()
      c.roundRect(-s * 0.75, -s * 0.04, s * 1.5, s * 0.3, s * 0.06)
      c.fillStyle = '#ffffff'
      c.fill()
      c.lineWidth = s * 0.03
      c.strokeStyle = INK
      c.stroke()
      c.fillStyle = Y2K_PINK
      for (let i = 0; i < 7; i++) c.fillRect(-s * 0.69 + i * s * 0.135, s * 0.02, s * 0.11, s * 0.18)
    },
  },
]

// ---------- cute: pastel, polkadot, hati kecil ----------

const CUTE: Art[] = [
  {
    id: 'c-stroberi',
    name: 'stroberi',
    w: 1,
    draw: (c, s) => {
      c.beginPath()
      c.moveTo(0, s * 0.46)
      c.bezierCurveTo(-s * 0.52, s * 0.12, -s * 0.46, -s * 0.3, 0, -s * 0.26)
      c.bezierCurveTo(s * 0.46, -s * 0.3, s * 0.52, s * 0.12, 0, s * 0.46)
      c.fillStyle = '#ff4d6d'
      c.fill()
      c.fillStyle = '#ffe08a'
      const seeds = [
        [-0.2, -0.08], [0, -0.1], [0.2, -0.08], [-0.26, 0.08], [-0.08, 0.06], [0.1, 0.06], [0.26, 0.08], [-0.14, 0.22], [0.04, 0.22], [0.16, 0.22], [-0.02, 0.36],
      ]
      for (const [x, y] of seeds) {
        c.beginPath()
        c.ellipse(x * s, y * s, s * 0.022, s * 0.034, 0, 0, 7)
        c.fill()
      }
      c.fillStyle = '#4caf6a'
      for (let i = 0; i < 5; i++) {
        c.save()
        c.translate(0, -s * 0.28)
        c.rotate(-Math.PI / 2 + ((i - 2) * Math.PI) / 5)
        c.beginPath()
        c.ellipse(s * 0.13, 0, s * 0.13, s * 0.05, 0, 0, 7)
        c.fill()
        c.restore()
      }
      c.fillRect(-s * 0.02, -s * 0.48, s * 0.04, s * 0.18)
    },
  },
  {
    id: 'c-awan',
    name: 'awan',
    w: 1.3,
    draw: (c, s) => {
      const parts = [
        (x: Ctx) => x.arc(-s * 0.3, s * 0.06, s * 0.22, 0, 7),
        (x: Ctx) => x.arc(0, -s * 0.08, s * 0.3, 0, 7),
        (x: Ctx) => x.arc(s * 0.3, s * 0.06, s * 0.22, 0, 7),
        (x: Ctx) => x.roundRect(-s * 0.52, s * 0.0, s * 1.04, s * 0.28, s * 0.14),
      ]
      blob(c, parts, '#eaf6ff', '#9ccfee', s * 0.06)
      c.fillStyle = INK
      for (const x of [-0.12, 0.12]) {
        c.beginPath()
        c.arc(x * s, s * 0.02, s * 0.03, 0, 7)
        c.fill()
      }
      c.strokeStyle = INK
      c.lineWidth = s * 0.022
      c.lineCap = 'round'
      c.beginPath()
      c.arc(0, s * 0.06, s * 0.05, 0.3, Math.PI - 0.3)
      c.stroke()
      c.fillStyle = 'rgba(255,122,168,.55)'
      for (const x of [-0.22, 0.22]) {
        c.beginPath()
        c.ellipse(x * s, s * 0.1, s * 0.05, s * 0.03, 0, 0, 7)
        c.fill()
      }
    },
  },
  { id: 'c-pita', name: 'pita pink', w: 1.1, draw: (c, s) => bow(c, s, '#ff9cc2', '#ff5c9a') },
  { id: 'c-gemes', name: 'gemes', w: 2.6, draw: pill('gemes', '#FF7AA8', INK) },
  {
    id: 'c-kelinci',
    name: 'kelinci',
    w: 0.9,
    draw: (c, s) => {
      const parts = [
        (x: Ctx) => x.ellipse(-s * 0.15, -s * 0.24, s * 0.09, s * 0.24, -0.15, 0, 7),
        (x: Ctx) => x.ellipse(s * 0.15, -s * 0.24, s * 0.09, s * 0.24, 0.15, 0, 7),
        (x: Ctx) => x.ellipse(0, s * 0.18, s * 0.34, s * 0.27, 0, 0, 7),
      ]
      blob(c, parts, '#ffffff', '#f2b8c6', s * 0.05)
      c.fillStyle = '#ffc2d4'
      for (const [x, r] of [[-0.15, -0.15], [0.15, 0.15]]) {
        c.beginPath()
        c.ellipse(x * s, -s * 0.24, s * 0.04, s * 0.15, r, 0, 7)
        c.fill()
      }
      c.fillStyle = INK
      for (const x of [-0.12, 0.12]) {
        c.beginPath()
        c.arc(x * s, s * 0.14, s * 0.035, 0, 7)
        c.fill()
      }
      c.fillStyle = '#ff7aa8'
      c.beginPath()
      c.ellipse(0, s * 0.21, s * 0.035, s * 0.025, 0, 0, 7)
      c.fill()
      c.fillStyle = 'rgba(255,122,168,.45)'
      for (const x of [-0.22, 0.22]) {
        c.beginPath()
        c.ellipse(x * s, s * 0.24, s * 0.05, s * 0.03, 0, 0, 7)
        c.fill()
      }
    },
  },
  {
    id: 'c-ceri',
    name: 'ceri',
    w: 1,
    draw: (c, s) => {
      c.strokeStyle = '#3f8f4f'
      c.lineWidth = s * 0.035
      c.lineCap = 'round'
      c.beginPath()
      c.moveTo(-s * 0.2, s * 0.1)
      c.quadraticCurveTo(-s * 0.1, -s * 0.2, s * 0.06, -s * 0.38)
      c.moveTo(s * 0.18, s * 0.13)
      c.quadraticCurveTo(s * 0.12, -s * 0.15, s * 0.06, -s * 0.38)
      c.stroke()
      c.fillStyle = '#4caf6a'
      c.beginPath()
      c.ellipse(s * 0.2, -s * 0.38, s * 0.16, s * 0.07, -0.4, 0, 7)
      c.fill()
      for (const [x, y] of [[-0.2, 0.26], [0.18, 0.29]]) {
        c.fillStyle = '#e8344e'
        c.beginPath()
        c.arc(x * s, y * s, s * 0.18, 0, 7)
        c.fill()
        c.fillStyle = 'rgba(255,255,255,.65)'
        c.beginPath()
        c.ellipse(x * s - s * 0.07, y * s - s * 0.07, s * 0.04, s * 0.025, -0.7, 0, 7)
        c.fill()
      }
    },
  },
]

// ---------- kalcer: kertas kraft, selotip, roll film ----------

const KRAFT = '#E8E1D3'
const KINK = '#2B2924'
const KYEL = '#F2D57E'
const MOSS = '#3D4434'

const KALCER: Art[] = [
  {
    id: 'kc-selotip',
    name: 'selotip',
    w: 2.3,
    draw: (c, s) => {
      const w = s * 1.9
      const h = s * 0.5
      c.beginPath()
      c.moveTo(-w / 2, -h / 2)
      c.lineTo(w / 2, -h / 2)
      for (let i = 0; i <= 6; i++) c.lineTo(w / 2 + (i % 2 ? -s * 0.05 : 0), -h / 2 + (h * i) / 6)
      c.lineTo(-w / 2, h / 2)
      for (let i = 6; i >= 0; i--) c.lineTo(-w / 2 + (i % 2 ? s * 0.05 : 0), -h / 2 + (h * i) / 6)
      c.closePath()
      c.fillStyle = 'rgba(242,213,126,.92)'
      c.fill()
      c.fillStyle = 'rgba(255,255,255,.25)'
      c.fillRect(-w / 2 + s * 0.05, -h / 2 + s * 0.06, w - s * 0.1, s * 0.05)
      centerText(c, 'simpan ya', 0, s * 0.02, fontOf(s * 0.36, { font: HAND, weight: 700 }), KINK)
    },
  },
  {
    id: 'kc-film',
    name: 'roll film',
    w: 2,
    draw: (c, s) => {
      c.fillStyle = KINK
      c.fillRect(-s * 0.9, -s * 0.38, s * 1.8, s * 0.76)
      c.fillStyle = KRAFT
      for (let i = 0; i < 10; i++) {
        const x = -s * 0.84 + i * s * 0.175
        c.fillRect(x, -s * 0.33, s * 0.08, s * 0.07)
        c.fillRect(x, s * 0.26, s * 0.08, s * 0.07)
      }
      const shades = ['#d9a95b', '#c9844a', '#e2c07a']
      shades.forEach((col, i) => {
        c.fillStyle = col
        c.fillRect(-s * 0.82 + i * s * 0.56, -s * 0.21, s * 0.5, s * 0.42)
      })
    },
  },
  { id: 'kc-stempel', name: 'kalcer', w: 2.6, draw: card('kalcer', KRAFT, KINK, { font: MONO, weight: 700, border: KINK }) },
  {
    id: 'kc-kopi',
    name: 'kopi',
    w: 0.8,
    draw: (c, s) => {
      const cup = (x: Ctx) => {
        x.beginPath()
        x.moveTo(-s * 0.28, -s * 0.26)
        x.lineTo(s * 0.28, -s * 0.26)
        x.lineTo(s * 0.21, s * 0.48)
        x.lineTo(-s * 0.21, s * 0.48)
        x.closePath()
      }
      cup(c)
      c.fillStyle = '#f7f1e6'
      c.fill()
      c.save()
      cup(c)
      c.clip()
      c.fillStyle = MOSS
      c.fillRect(-s * 0.4, -s * 0.02, s * 0.8, s * 0.26)
      c.restore()
      cup(c)
      c.lineWidth = s * 0.025
      c.strokeStyle = KINK
      c.stroke()
      c.fillStyle = KINK
      c.beginPath()
      c.roundRect(-s * 0.33, -s * 0.38, s * 0.66, s * 0.14, s * 0.05)
      c.fill()
      c.fillRect(-s * 0.24, -s * 0.46, s * 0.48, s * 0.09)
      centerText(c, 'kopi', 0, s * 0.11, fontOf(s * 0.12, { font: MONO, weight: 700 }), KRAFT)
    },
  },
  { id: 'kc-slow', name: 'slow living', w: 3.6, draw: label('slow living', KINK, { font: HAND, weight: 700, size: 0.8 }) },
  {
    id: 'kc-tiket',
    name: 'tiket nonton',
    w: 1.9,
    draw: (c, s) => {
      c.fillStyle = KYEL
      c.fillRect(-s * 0.85, -s * 0.4, s * 1.7, s * 0.8)
      c.save()
      c.globalCompositeOperation = 'destination-out'
      for (const x of [-0.85, 0.85]) {
        c.beginPath()
        c.arc(x * s, 0, s * 0.11, 0, 7)
        c.fill()
      }
      c.restore()
      c.setLineDash([s * 0.05, s * 0.04])
      c.lineWidth = s * 0.02
      c.strokeStyle = KINK
      c.beginPath()
      c.moveTo(s * 0.45, -s * 0.36)
      c.lineTo(s * 0.45, s * 0.36)
      c.stroke()
      c.setLineDash([])
      centerText(c, 'tiket nonton', -s * 0.18, -s * 0.06, fontOf(s * 0.18), KINK)
      centerText(c, 'no. 007', -s * 0.18, s * 0.17, fontOf(s * 0.11, { font: MONO, weight: 700 }), KINK)
      c.save()
      c.translate(s * 0.65, 0)
      c.rotate(-Math.PI / 2)
      centerText(c, 'baris a', 0, 0, fontOf(s * 0.11, { font: MONO, weight: 700 }), KINK)
      c.restore()
    },
  },
]

// ---------- bestie: kotak-kotak, berdua lebih seru ----------

const BESTIE: Art[] = [
  { id: 'b-bff', name: 'bff', w: 2.2, draw: label('bff', '#FF7AA8', { size: 0.9, shadow: [0.06, 0.06, '#7a5cff'] }) },
  {
    id: 'b-dua-hati',
    name: 'dua hati',
    w: 1.3,
    draw: (c, s) => {
      c.save()
      c.translate(-s * 0.2, -s * 0.02)
      c.rotate(-0.25)
      heart(c, s * 0.8, '#b69cff')
      c.restore()
      c.save()
      c.translate(s * 0.2, s * 0.06)
      c.rotate(0.2)
      heart(c, s * 0.8, '#ff8fd1')
      c.restore()
    },
  },
  { id: 'b-partner', name: 'partner in crime', w: 5.2, draw: pill('partner in crime', '#D9CCFF', INK) },
  {
    id: 'b-senyum',
    name: 'senyum',
    w: 1,
    draw: (c, s) => {
      c.beginPath()
      c.arc(0, 0, s * 0.46, 0, 7)
      c.fillStyle = '#FFE45C'
      c.fill()
      c.lineWidth = s * 0.035
      c.strokeStyle = INK
      c.stroke()
      c.fillStyle = INK
      for (const x of [-0.15, 0.15]) {
        c.beginPath()
        c.ellipse(x * s, -s * 0.1, s * 0.045, s * 0.08, 0, 0, 7)
        c.fill()
      }
      c.lineWidth = s * 0.05
      c.lineCap = 'round'
      c.beginPath()
      c.arc(0, s * 0.02, s * 0.26, 0.45, Math.PI - 0.45)
      c.stroke()
    },
  },
  { id: 'b-4ever', name: 'besties 4ever', w: 4.4, draw: label('besties 4ever', '#7a5cff', { font: HAND, weight: 700, size: 0.78 }) },
  { id: 'b-bareng', name: 'bareng terus', w: 4.2, draw: pill('bareng terus', '#FFF7C2', INK, { border: INK }) },
]

// ---------- editorial: sampul majalah, masthead serif ----------

const EDITORIAL: Art[] = [
  { id: 'e-edisi', name: 'edisi spesial', w: 4.4, draw: label('edisi spesial', INK, { font: SERIF, weight: 400, size: 0.66 }) },
  {
    id: 'e-barcode',
    name: 'barcode',
    w: 1.4,
    draw: (c, s) => {
      c.fillStyle = '#ffffff'
      c.fillRect(-s * 0.62, -s * 0.42, s * 1.24, s * 0.84)
      c.strokeStyle = '#d0d0d0'
      c.lineWidth = s * 0.01
      c.strokeRect(-s * 0.62, -s * 0.42, s * 1.24, s * 0.84)
      const bars = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 1, 3, 1, 2, 1, 1, 2]
      let x = -s * 0.52
      const unit = (s * 1.04) / bars.reduce((a, b) => a + b + 1, 0)
      c.fillStyle = INK
      bars.forEach((b, i) => {
        if (i % 2 === 0) c.fillRect(x, -s * 0.34, b * unit, s * 0.5)
        x += (b + 1) * unit
      })
      centerText(c, '8 992026 000017', 0, s * 0.28, fontOf(s * 0.1, { font: MONO, weight: 400 }), INK)
    },
  },
  { id: 'e-cover', name: 'cover star', w: 3.8, draw: label('cover star', INK, { font: SERIF, weight: 400, style: 'italic', size: 0.7, underline: true }) },
  {
    id: 'e-no',
    name: 'no. 07',
    w: 1,
    draw: (c, s) => {
      c.beginPath()
      c.arc(0, 0, s * 0.46, 0, 7)
      c.fillStyle = INK
      c.fill()
      centerText(c, 'no.', 0, -s * 0.17, fontOf(s * 0.15, { font: SERIF, weight: 400, style: 'italic' }), '#ffffff')
      centerText(c, '07', 0, s * 0.08, fontOf(s * 0.4, { font: SERIF, weight: 400 }), '#ffffff')
    },
  },
  { id: 'e-eksklusif', name: 'eksklusif', w: 3.4, draw: card('eksklusif', INK, '#ffffff', { font: SERIF, weight: 400 }) },
  { id: 'e-kutipan', name: 'kutipan', w: 1.2, draw: label('“”', INK, { font: SERIF, weight: 400, size: 1.5 }) },
]

// ---------- bold & pop: kuning terang, garis tebal, halftone ----------

const YEL = '#FFD60A'

const POP: Art[] = [
  {
    id: 'p-wow',
    name: 'wow!',
    w: 1.4,
    draw: (c, s) => {
      c.save()
      c.rotate(0.2)
      burst(c, s, 12, 0.52, 0.4, PINK, INK, 3)
      c.restore()
      burst(c, s, 12, 0.44, 0.32, YEL, INK, 1)
      centerText(c, 'wow!', 0, s * 0.02, fontOf(s * 0.3, { font: IMPACT, weight: 400 }), INK)
    },
  },
  {
    id: 'p-halftone',
    name: 'halftone',
    w: 1,
    draw: (c, s) => {
      c.save()
      c.beginPath()
      c.arc(0, 0, s * 0.46, 0, 7)
      c.fillStyle = YEL
      c.fill()
      c.clip()
      c.fillStyle = PINK
      const step = s * 0.1
      for (let y = -s * 0.5; y <= s * 0.5; y += step) {
        for (let x = -s * 0.5; x <= s * 0.5; x += step) {
          const k = Math.max(0, (x + y) / s + 0.6) / 1.6
          if (k <= 0) continue
          c.beginPath()
          c.arc(x, y, step * 0.5 * Math.min(1, k), 0, 7)
          c.fill()
        }
      }
      c.restore()
      c.beginPath()
      c.arc(0, 0, s * 0.46, 0, 7)
      c.lineWidth = s * 0.04
      c.strokeStyle = INK
      c.stroke()
    },
  },
  {
    id: 'p-petir',
    name: 'petir',
    w: 0.8,
    draw: (c, s) => {
      c.beginPath()
      c.moveTo(s * 0.12, -s * 0.5)
      c.lineTo(-s * 0.28, s * 0.06)
      c.lineTo(-s * 0.02, s * 0.06)
      c.lineTo(-s * 0.14, s * 0.5)
      c.lineTo(s * 0.3, -s * 0.08)
      c.lineTo(s * 0.04, -s * 0.08)
      c.lineTo(s * 0.2, -s * 0.5)
      c.closePath()
      c.fillStyle = YEL
      c.fill()
      c.lineWidth = s * 0.045
      c.lineJoin = 'round'
      c.strokeStyle = INK
      c.stroke()
    },
  },
  { id: 'p-boom', name: 'boom!', w: 3, draw: label('boom!', PINK, { font: IMPACT, weight: 400, size: 0.8, stroke: INK, strokeW: 0.09, spacing: 0.04, shadow: [0.05, 0.05, INK] }) },
  {
    id: 'p-bibir',
    name: 'bibir',
    w: 1.2,
    draw: (c, s) => {
      c.beginPath()
      c.moveTo(-s * 0.52, 0)
      c.bezierCurveTo(-s * 0.32, -s * 0.32, -s * 0.1, -s * 0.28, 0, -s * 0.16)
      c.bezierCurveTo(s * 0.1, -s * 0.28, s * 0.32, -s * 0.32, s * 0.52, 0)
      c.bezierCurveTo(s * 0.3, s * 0.38, -s * 0.3, s * 0.38, -s * 0.52, 0)
      c.fillStyle = '#E8173C'
      c.fill()
      c.lineWidth = s * 0.035
      c.lineJoin = 'round'
      c.strokeStyle = INK
      c.stroke()
      c.beginPath()
      c.moveTo(-s * 0.5, 0)
      c.quadraticCurveTo(0, s * 0.1, s * 0.5, 0)
      c.stroke()
      c.fillStyle = 'rgba(255,255,255,.75)'
      c.beginPath()
      c.ellipse(s * 0.14, s * 0.15, s * 0.1, s * 0.035, -0.15, 0, 7)
      c.fill()
    },
  },
  { id: 'p-omg', name: 'omg', w: 2.2, draw: (c, s) => speech(c, s, 'omg', INK, YEL) },
]

// ---------- meme: teks atas, teks bawah ----------

const meme = (text: string) => label(text, '#ffffff', { font: IMPACT, weight: 400, size: 0.8, stroke: INK, strokeW: 0.11, spacing: 0.04 })

const MEME: Art[] = [
  { id: 'm-ngakak', name: 'ngakak', w: 3, draw: meme('ngakak') },
  { id: 'm-kokbisa', name: 'kok bisa?', w: 3.4, draw: meme('kok bisa?') },
  {
    id: 'm-kacamata',
    name: 'kacamata piksel',
    w: 4.9,
    draw: pixels(
      ['BBBBBBBBBBBBBBBBBBBBBBBB', '..BWWBBBBB..BWWBBBBB....', '..BBWWBBBB..BBWWBBBB....', '...BBBBBB....BBBBBB.....', '....BBBB......BBBB......'],
      { B: INK, W: '#ffffff' },
    ),
  },
  { id: 'm-plot', name: 'plot twist', w: 3.8, draw: meme('plot twist') },
  { id: 'm-bukan', name: 'bukan aku', w: 3.8, draw: meme('bukan aku') },
  { id: 'm-mood', name: 'mood', w: 2.2, draw: meme('mood') },
]

// ---------- travel: kartu pos & tiket pesawat ----------

const TCREAM = '#F4EFE6'
const TRED = '#D64545'
const TBLUE = '#2F5DA8'
const TNAVY = '#1F3A5F'

const TRAVEL: Art[] = [
  {
    id: 't-pesawat',
    name: 'pesawat',
    w: 1.1,
    draw: (c, s) => {
      c.save()
      c.rotate(-0.6)
      c.fillStyle = TBLUE
      c.beginPath()
      c.moveTo(s * 0.1, 0)
      c.lineTo(-s * 0.1, -s * 0.46)
      c.lineTo(-s * 0.2, -s * 0.46)
      c.lineTo(-s * 0.12, 0)
      c.lineTo(-s * 0.2, s * 0.46)
      c.lineTo(-s * 0.1, s * 0.46)
      c.closePath()
      c.fill()
      c.beginPath()
      c.moveTo(-s * 0.36, 0)
      c.lineTo(-s * 0.46, -s * 0.18)
      c.lineTo(-s * 0.52, -s * 0.18)
      c.lineTo(-s * 0.46, 0)
      c.lineTo(-s * 0.52, s * 0.18)
      c.lineTo(-s * 0.46, s * 0.18)
      c.closePath()
      c.fill()
      c.fillStyle = TNAVY
      c.beginPath()
      c.ellipse(0, 0, s * 0.52, s * 0.085, 0, 0, 7)
      c.fill()
      c.fillStyle = '#BFE3FF'
      c.beginPath()
      c.ellipse(s * 0.38, 0, s * 0.07, s * 0.04, 0, 0, 7)
      c.fill()
      c.restore()
    },
  },
  {
    id: 't-cap',
    name: 'cap paspor',
    w: 1,
    draw: (c, s) => {
      c.beginPath()
      c.arc(0, 0, s * 0.47, 0, 7)
      c.fillStyle = TCREAM
      c.fill()
      c.lineWidth = s * 0.04
      c.strokeStyle = TRED
      c.stroke()
      c.beginPath()
      c.arc(0, 0, s * 0.37, 0, 7)
      c.lineWidth = s * 0.015
      c.stroke()
      centerText(c, 'tiba', 0, -s * 0.03, fontOf(s * 0.24), TRED)
      centerText(c, 'hari ini', 0, s * 0.18, fontOf(s * 0.08, { font: MONO, weight: 700 }), TRED)
      centerText(c, 'bilik', 0, -s * 0.24, fontOf(s * 0.08, { font: MONO, weight: 700 }), TRED)
    },
  },
  {
    id: 't-boarding',
    name: 'boarding pass',
    w: 2,
    draw: (c, s) => {
      c.save()
      c.beginPath()
      c.roundRect(-s * 0.9, -s * 0.42, s * 1.8, s * 0.84, s * 0.06)
      c.fillStyle = TCREAM
      c.fill()
      c.clip()
      c.fillStyle = TNAVY
      c.fillRect(-s * 0.9, -s * 0.42, s * 1.8, s * 0.22)
      c.restore()
      c.font = fontOf(s * 0.1, { font: MONO, weight: 700 })
      c.textAlign = 'left'
      c.textBaseline = 'middle'
      c.fillStyle = TCREAM
      c.fillText('boarding pass', -s * 0.8, -s * 0.31)
      c.font = fontOf(s * 0.26)
      c.fillStyle = INK
      c.fillText('cgk', -s * 0.8, s * 0.04)
      c.fillText('dps', s * 0.0, s * 0.04)
      c.fillStyle = TBLUE
      c.beginPath()
      c.moveTo(-s * 0.25, s * 0.04)
      c.lineTo(-s * 0.07, s * 0.04)
      c.lineWidth = s * 0.025
      c.strokeStyle = TBLUE
      c.stroke()
      c.beginPath()
      c.moveTo(-s * 0.04, s * 0.04)
      c.lineTo(-s * 0.1, -s * 0.01)
      c.lineTo(-s * 0.1, s * 0.09)
      c.fill()
      c.font = fontOf(s * 0.09, { font: MONO, weight: 700 })
      c.fillStyle = INK
      c.fillText('gate 7  ·  kursi 7a', -s * 0.8, s * 0.27)
      c.setLineDash([s * 0.04, s * 0.03])
      c.lineWidth = s * 0.015
      c.strokeStyle = INK
      c.beginPath()
      c.moveTo(s * 0.52, -s * 0.18)
      c.lineTo(s * 0.52, s * 0.4)
      c.stroke()
      c.setLineDash([])
      centerText(c, '7a', s * 0.71, s * 0.1, fontOf(s * 0.22), TRED)
    },
  },
  {
    id: 't-pin',
    name: 'pin lokasi',
    w: 0.8,
    draw: (c, s) => {
      c.beginPath()
      c.moveTo(0, s * 0.5)
      c.bezierCurveTo(-s * 0.14, s * 0.26, -s * 0.34, s * 0.06, -s * 0.34, -s * 0.14)
      c.arc(0, -s * 0.14, s * 0.34, Math.PI, 0)
      c.bezierCurveTo(s * 0.34, s * 0.06, s * 0.14, s * 0.26, 0, s * 0.5)
      c.fillStyle = TRED
      c.fill()
      c.beginPath()
      c.arc(0, -s * 0.14, s * 0.13, 0, 7)
      c.fillStyle = '#ffffff'
      c.fill()
    },
  },
  { id: 't-wish', name: 'wish you were here', w: 5.6, draw: label('wish you were here', TNAVY, { font: HAND, weight: 700, size: 0.72 }) },
  {
    id: 't-koper',
    name: 'koper',
    w: 1,
    draw: (c, s) => {
      c.lineWidth = s * 0.05
      c.strokeStyle = TNAVY
      c.beginPath()
      c.roundRect(-s * 0.15, -s * 0.44, s * 0.3, s * 0.2, s * 0.06)
      c.stroke()
      c.fillStyle = TRED
      c.beginPath()
      c.roundRect(-s * 0.45, -s * 0.28, s * 0.9, s * 0.68, s * 0.08)
      c.fill()
      c.fillStyle = TNAVY
      c.fillRect(-s * 0.26, -s * 0.28, s * 0.07, s * 0.68)
      c.fillRect(s * 0.19, -s * 0.28, s * 0.07, s * 0.68)
      c.fillStyle = '#F2D57E'
      c.beginPath()
      c.arc(-s * 0.02, s * 0.0, s * 0.1, 0, 7)
      c.fill()
      c.fillStyle = TCREAM
      c.save()
      c.translate(s * 0.02, s * 0.22)
      c.rotate(-0.15)
      c.fillRect(-s * 0.1, -s * 0.05, s * 0.2, s * 0.1)
      c.restore()
      c.fillStyle = INK
      for (const x of [-0.3, 0.3]) {
        c.beginPath()
        c.arc(x * s, s * 0.45, s * 0.05, 0, 7)
        c.fill()
      }
    },
  },
]

// ---------- gaming: piksel, neon, player 1 siap ----------

const NIGHT = '#0E0B1F'
const NEON = '#39FF88'

const GAMING: Art[] = [
  {
    id: 'g-hati',
    name: 'hati piksel',
    w: 1.2,
    draw: pixels(['.BB...BB.', 'BRRB.BRRB', 'BRWRBRRRB', 'BRRRRRRRB', '.BRRRRRB.', '..BRRRB..', '...BRB...', '....B....'], { B: INK, R: '#ff2f5a', W: '#ffffff' }),
  },
  { id: 'g-level', name: 'level up!', w: 3.4, draw: pill('level up!', NIGHT, NEON, { font: PIXEL, weight: 400, fsK: 0.78 }) },
  {
    id: 'g-koin',
    name: 'koin',
    w: 1,
    draw: pixels(['..BBBB..', '.BYYYYB.', 'BYWYYOYB', 'BYWYOYOB', 'BYWYOYOB', 'BYYYOYOB', '.BOOOOB.', '..BBBB..'], { B: INK, Y: '#FFD60A', O: '#E09B00', W: '#FFF6B0' }),
  },
  { id: 'g-player', name: 'player 1', w: 3.2, draw: pill('player 1', PINK, INK, { font: PIXEL, weight: 400, fsK: 0.78 }) },
  {
    id: 'g-stik',
    name: 'stik game',
    w: 1.5,
    draw: (c, s) => {
      c.fillStyle = '#2a2440'
      c.beginPath()
      c.roundRect(-s * 0.6, -s * 0.26, s * 1.2, s * 0.46, s * 0.23)
      c.fill()
      for (const x of [-0.42, 0.42]) {
        c.beginPath()
        c.arc(x * s, s * 0.14, s * 0.22, 0, 7)
        c.fill()
      }
      c.fillStyle = NEON
      c.fillRect(-s * 0.48, -s * 0.06, s * 0.24, s * 0.08)
      c.fillRect(-s * 0.4, -s * 0.14, s * 0.08, s * 0.24)
      const btn: [number, number, string][] = [[0.36, -0.1, PINK], [0.48, 0.0, '#FFD60A'], [0.36, 0.1, '#5fb0ff'], [0.24, 0.0, NEON]]
      for (const [x, y, col] of btn) {
        c.fillStyle = col
        c.beginPath()
        c.arc(x * s, y * s, s * 0.05, 0, 7)
        c.fill()
      }
    },
  },
  { id: 'g-over', name: 'game over', w: 3.6, draw: pill('game over', NIGHT, PINK, { font: PIXEL, weight: 400, fsK: 0.78 }) },
]

// ---------- dark: hitam pekat, aksen pink tipis ----------

const DARK: Art[] = [
  {
    id: 'd-bulan',
    name: 'bulan',
    w: 1,
    draw: (c, s) => {
      c.beginPath()
      c.arc(0, 0, s * 0.48, 0, 7)
      c.fillStyle = INK
      c.fill()
      c.save()
      c.beginPath()
      c.arc(-s * 0.04, 0, s * 0.3, 0, 7)
      c.clip()
      c.fillStyle = '#fff3c4'
      c.fillRect(-s * 0.5, -s * 0.5, s, s)
      c.beginPath()
      c.arc(s * 0.1, -s * 0.08, s * 0.27, 0, 7)
      c.fillStyle = INK
      c.fill()
      c.restore()
      c.save()
      c.translate(s * 0.2, s * 0.18)
      c.scale(0.22, 0.22)
      sparkle(c, s, PINK, PINK)
      c.restore()
    },
  },
  { id: 'd-insomnia', name: 'insomnia', w: 3.6, draw: pill('insomnia', INK, PINK, { font: MONO, weight: 700 }) },
  {
    id: 'd-tengkorak',
    name: 'tengkorak',
    w: 0.9,
    draw: (c, s) => {
      blob(
        c,
        [(x) => x.arc(0, -s * 0.08, s * 0.36, 0, 7), (x) => x.roundRect(-s * 0.2, s * 0.1, s * 0.4, s * 0.3, s * 0.07)],
        '#f4f1e8',
        INK,
        s * 0.05,
      )
      for (const x of [-0.14, 0.14]) {
        c.save()
        c.translate(x * s, -s * 0.07)
        heart(c, s * 0.24, PINK)
        c.restore()
      }
      c.fillStyle = INK
      c.beginPath()
      c.moveTo(0, s * 0.08)
      c.lineTo(-s * 0.04, s * 0.15)
      c.lineTo(s * 0.04, s * 0.15)
      c.fill()
      c.lineWidth = s * 0.02
      c.strokeStyle = INK
      for (const x of [-0.08, 0, 0.08]) {
        c.beginPath()
        c.moveTo(x * s, s * 0.26)
        c.lineTo(x * s, s * 0.38)
        c.stroke()
      }
    },
  },
  {
    id: 'd-hati',
    name: 'hati hitam',
    w: 1,
    draw: (c, s) => {
      heartPath(c, s)
      c.fillStyle = INK
      c.fill()
      c.lineWidth = s * 0.04
      c.strokeStyle = PINK
      c.stroke()
    },
  },
  { id: 'd-afterdark', name: 'after dark', w: 3.8, draw: card('after dark', INK, PINK, { font: SERIF, weight: 400, style: 'italic' }) },
  {
    id: 'd-rahasia',
    name: 'rahasia',
    w: 2.2,
    draw: (c, s) => {
      c.save()
      c.rotate(-0.06)
      c.fillStyle = INK
      c.fillRect(-s * 0.95, -s * 0.24, s * 1.9, s * 0.48)
      centerText(c, 'rahasia', 0, s * 0.01, fontOf(s * 0.24, { font: MONO, weight: 700 }), PINK)
      c.restore()
    },
  },
]

// ---------- tambahan: 6 stiker lagi per kategori ----------

function star5(c: Ctx, s: number, r: number, fill: string, line?: string, lw = 0.04) {
  c.beginPath()
  for (let i = 0; i < 10; i++) {
    const rr = (i % 2 ? r * 0.45 : r) * s
    const a = (i * Math.PI) / 5 - Math.PI / 2
    c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr + s * 0.03)
  }
  c.closePath()
  c.fillStyle = fill
  c.fill()
  if (line) {
    c.lineWidth = s * lw
    c.lineJoin = 'round'
    c.strokeStyle = line
    c.stroke()
  }
}

function dot(c: Ctx, x: number, y: number, r: number, col: string) {
  c.fillStyle = col
  c.beginPath()
  c.arc(x, y, r, 0, 7)
  c.fill()
}

/** wajah kecil: dua mata + senyum, untuk benda imut */
function face(c: Ctx, s: number, y: number, gap: number, k = 1) {
  for (const d of [-1, 1]) dot(c, d * gap * s, y * s, s * 0.03 * k, INK)
  c.strokeStyle = INK
  c.lineWidth = s * 0.02 * k
  c.lineCap = 'round'
  c.beginPath()
  c.arc(0, y * s + s * 0.03 * k, s * 0.045 * k, 0.3, Math.PI - 0.3)
  c.stroke()
}

const MORE_BASE: Art[] = [
  {
    id: 'kamera',
    name: 'kamera',
    w: 1.2,
    draw: (c, s) => {
      c.fillStyle = INK
      c.beginPath()
      c.roundRect(-s * 0.18, -s * 0.38, s * 0.36, s * 0.14, s * 0.04)
      c.fill()
      c.beginPath()
      c.roundRect(-s * 0.55, -s * 0.28, s * 1.1, s * 0.7, s * 0.14)
      c.fill()
      dot(c, 0, s * 0.07, s * 0.24, '#ffffff')
      dot(c, 0, s * 0.07, s * 0.17, PINK)
      dot(c, -s * 0.05, s * 0.02, s * 0.05, 'rgba(255,255,255,.8)')
      dot(c, s * 0.4, -s * 0.15, s * 0.045, PINK)
    },
  },
  {
    id: 'strip',
    name: 'strip foto',
    w: 0.6,
    draw: (c, s) => {
      c.fillStyle = '#ffffff'
      c.fillRect(-s * 0.2, -s * 0.5, s * 0.4, s)
      c.strokeStyle = '#dddddd'
      c.lineWidth = s * 0.01
      c.strokeRect(-s * 0.2, -s * 0.5, s * 0.4, s)
      const cols = ['#ffc6e8', '#d9c4ff', '#ffe08a', '#BFE3FF']
      cols.forEach((col, i) => {
        c.fillStyle = col
        c.fillRect(-s * 0.16, -s * 0.46 + i * s * 0.22, s * 0.32, s * 0.19)
        face(c, s * 0.9, (-0.46 + i * 0.22 + 0.09) / 0.9, 0.05, 0.9)
      })
    },
  },
  { id: 'jepret', name: 'jepret!', w: 2.6, draw: pill('jepret!', '#FFE45C', INK, { border: INK }) },
  { id: 'senyum-dong', name: 'senyum dong', w: 3.7, draw: (c, s) => speech(c, s, 'senyum dong', '#ffc6e8', INK) },
]

const MORE_KLASIK: Art[] = [
  {
    id: 'k-amplop',
    name: 'amplop',
    w: 1.4,
    draw: (c, s) => {
      c.fillStyle = '#ffffff'
      c.fillRect(-s * 0.6, -s * 0.38, s * 1.2, s * 0.76)
      c.strokeStyle = INK
      c.lineWidth = s * 0.025
      c.lineJoin = 'round'
      c.strokeRect(-s * 0.6, -s * 0.38, s * 1.2, s * 0.76)
      c.beginPath()
      c.moveTo(-s * 0.6, -s * 0.38)
      c.lineTo(0, s * 0.06)
      c.lineTo(s * 0.6, -s * 0.38)
      c.stroke()
      dot(c, 0, s * 0.06, s * 0.13, '#b3202f')
      c.save()
      c.translate(0, s * 0.03)
      heart(c, s * 0.14, '#7d1520')
      c.restore()
    },
  },
  { id: 'k-terimakasih', name: 'terima kasih', w: 4.4, draw: label('terima kasih', INK, { font: SERIF, weight: 400, style: 'italic', size: 0.68 }) },
  {
    id: 'k-hati-garis',
    name: 'hati garis',
    w: 1,
    draw: (c, s) => {
      heartPath(c, s)
      c.fillStyle = '#ffffff'
      c.fill()
      c.lineWidth = s * 0.045
      c.strokeStyle = INK
      c.stroke()
    },
  },
  { id: 'k-dan', name: '&', w: 1, draw: label('&', INK, { font: SERIF, weight: 400, size: 1.1 }) },
  {
    id: 'k-daun',
    name: 'daun salam',
    w: 1,
    draw: (c, s) => {
      c.strokeStyle = INK
      c.lineWidth = s * 0.025
      c.lineCap = 'round'
      for (const d of [-1, 1]) {
        c.beginPath()
        c.arc(0, 0, s * 0.38, Math.PI / 2 + d * 0.25, Math.PI / 2 + d * 2.6, d < 0)
        c.stroke()
        for (let i = 0; i < 7; i++) {
          const a = Math.PI / 2 + d * (0.45 + i * 0.32)
          c.save()
          c.translate(Math.cos(a) * s * 0.38, Math.sin(a) * s * 0.38)
          c.rotate(a + (d > 0 ? 0.6 : -0.6) + Math.PI / 2)
          c.beginPath()
          c.ellipse(0, -s * 0.06, s * 0.035, s * 0.075, 0, 0, 7)
          c.fillStyle = INK
          c.fill()
          c.restore()
        }
      }
    },
  },
  { id: 'k-justus', name: 'just us', w: 3, draw: card('just us', '#ffffff', INK, { font: SERIF, weight: 400, border: INK }) },
]

const MORE_RETRO: Art[] = [
  {
    id: 'r-senja',
    name: 'senja',
    w: 1,
    draw: (c, s) => {
      c.save()
      c.beginPath()
      c.arc(0, 0, s * 0.46, 0, 7)
      c.clip()
      const cols = [MUSTARD, '#EC8A32', ORANGE, '#C2442A', BROWN]
      cols.forEach((col, i) => {
        c.fillStyle = col
        const y = -s * 0.46 + i * s * 0.2
        c.fillRect(-s * 0.5, y, s, i < 2 ? s * 0.2 : s * 0.2 - s * 0.04 * (i - 1))
      })
      c.restore()
    },
  },
  {
    id: 'r-bunga',
    name: 'flower power',
    w: 1,
    draw: (c, s) => {
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3
        dot(c, Math.cos(a) * s * 0.27, Math.sin(a) * s * 0.27, s * 0.19, i % 2 ? ORANGE : '#EC8A32')
      }
      dot(c, 0, 0, s * 0.2, MUSTARD)
      face(c, s, -0.02, 0.07)
    },
  },
  { id: 'r-farout', name: 'far out', w: 3, draw: label('far out', MUSTARD, { size: 0.78, shadow: [0.06, 0.06, BROWN] }) },
  {
    id: 'r-kamera',
    name: 'kamera lawas',
    w: 1.3,
    draw: (c, s) => {
      c.fillStyle = BROWN
      c.beginPath()
      c.roundRect(-s * 0.58, -s * 0.26, s * 1.16, s * 0.66, s * 0.08)
      c.fill()
      c.fillStyle = '#cfc6b4'
      c.beginPath()
      c.roundRect(-s * 0.58, -s * 0.4, s * 1.16, s * 0.24, s * 0.06)
      c.fill()
      c.fillStyle = INK
      c.fillRect(-s * 0.44, -s * 0.47, s * 0.2, s * 0.08)
      dot(c, 0, s * 0.08, s * 0.26, '#cfc6b4')
      dot(c, 0, s * 0.08, s * 0.19, INK)
      dot(c, -s * 0.06, s * 0.02, s * 0.05, 'rgba(255,255,255,.55)')
      dot(c, s * 0.42, -s * 0.28, s * 0.05, ORANGE)
    },
  },
  {
    id: 'r-jamur',
    name: 'jamur',
    w: 0.9,
    draw: (c, s) => {
      c.fillStyle = CREAM
      c.beginPath()
      c.roundRect(-s * 0.14, -s * 0.02, s * 0.28, s * 0.48, s * 0.1)
      c.fill()
      c.strokeStyle = BROWN
      c.lineWidth = s * 0.025
      c.stroke()
      c.beginPath()
      c.moveTo(-s * 0.46, s * 0.04)
      c.bezierCurveTo(-s * 0.46, -s * 0.5, s * 0.46, -s * 0.5, s * 0.46, s * 0.04)
      c.closePath()
      c.fillStyle = ORANGE
      c.fill()
      c.stroke()
      for (const [x, y, r] of [[-0.22, -0.12, 0.07], [0.05, -0.26, 0.06], [0.26, -0.08, 0.07], [-0.02, -0.04, 0.04]]) dot(c, x * s, y * s, r * s, CREAM)
    },
  },
  { id: 'r-peace', name: 'peace & love', w: 4.4, draw: pill('peace & love', MUSTARD, BROWN) },
]

const MORE_Y2K: Art[] = [
  {
    id: 'y-flip',
    name: 'flip phone',
    w: 0.7,
    draw: (c, s) => {
      c.fillStyle = Y2K_PINK
      c.beginPath()
      c.roundRect(-s * 0.2, -s * 0.5, s * 0.4, s * 0.48, s * 0.08)
      c.fill()
      c.fillStyle = '#e65aa6'
      c.beginPath()
      c.roundRect(-s * 0.2, s * 0.0, s * 0.4, s * 0.5, s * 0.08)
      c.fill()
      c.fillStyle = '#BFE3FF'
      c.fillRect(-s * 0.13, -s * 0.42, s * 0.26, s * 0.3)
      c.fillStyle = SILVER
      c.fillRect(-s * 0.2, -s * 0.03, s * 0.4, s * 0.05)
      c.fillStyle = '#ffffff'
      for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) c.fillRect(-s * 0.12 + k * s * 0.09, s * 0.1 + r * s * 0.085, s * 0.06, s * 0.05)
      c.save()
      c.translate(0, -s * 0.27)
      heart(c, s * 0.12, Y2K_PINK)
      c.restore()
    },
  },
  {
    id: 'y-kupu',
    name: 'kupu krom',
    w: 1.1,
    draw: (c, s) => {
      const g = c.createLinearGradient(-s * 0.5, -s * 0.4, s * 0.5, s * 0.4)
      g.addColorStop(0, '#BFE3FF')
      g.addColorStop(0.5, '#ffffff')
      g.addColorStop(1, Y2K_PINK)
      for (const d of [-1, 1]) {
        c.save()
        c.scale(d, 1)
        c.beginPath()
        c.ellipse(s * 0.24, -s * 0.14, s * 0.25, s * 0.2, -0.5, 0, 7)
        c.ellipse(s * 0.18, s * 0.15, s * 0.17, s * 0.14, 0.5, 0, 7)
        c.fillStyle = g
        c.fill()
        c.lineWidth = s * 0.025
        c.strokeStyle = '#7a7896'
        c.stroke()
        c.restore()
      }
      c.fillStyle = '#7a7896'
      c.beginPath()
      c.ellipse(0, s * 0.02, s * 0.04, s * 0.22, 0, 0, 7)
      c.fill()
    },
  },
  {
    id: 'y-folder',
    name: 'folder',
    w: 1.2,
    draw: (c, s) => {
      c.fillStyle = '#e8b830'
      c.beginPath()
      c.moveTo(-s * 0.55, -s * 0.36)
      c.lineTo(-s * 0.15, -s * 0.36)
      c.lineTo(-s * 0.05, -s * 0.26)
      c.lineTo(s * 0.55, -s * 0.26)
      c.lineTo(s * 0.55, s * 0.38)
      c.lineTo(-s * 0.55, s * 0.38)
      c.closePath()
      c.fill()
      c.fillStyle = '#ffd64d'
      c.fillRect(-s * 0.55, -s * 0.16, s * 1.1, s * 0.54)
      c.strokeStyle = '#a07a10'
      c.lineWidth = s * 0.02
      c.strokeRect(-s * 0.55, -s * 0.16, s * 1.1, s * 0.54)
      centerText(c, 'foto_kita', 0, s * 0.11, fontOf(s * 0.12, { font: MONO, weight: 700 }), INK)
    },
  },
  {
    id: 'y-online',
    name: 'online',
    w: 2.8,
    draw: (c, s) => {
      pill('   online', '#ffffff', INK, { font: MONO, weight: 700, border: INK })(c, s)
      c.font = fontOf(s * 0.52, { font: MONO, weight: 700 })
      const w = c.measureText('   online').width
      dot(c, -w / 2 + s * 0.13, s * 0.0, s * 0.12, '#2fd36a')
    },
  },
  {
    id: 'y-hati-krom',
    name: 'hati krom',
    w: 1,
    draw: (c, s) => {
      const g = c.createLinearGradient(-s * 0.4, -s * 0.5, s * 0.4, s * 0.5)
      g.addColorStop(0, '#ffffff')
      g.addColorStop(0.4, '#c7c2d6')
      g.addColorStop(0.7, Y2K_PINK)
      g.addColorStop(1, '#8d86b0')
      heartPath(c, s)
      c.fillStyle = g
      c.fill()
      c.lineWidth = s * 0.025
      c.strokeStyle = '#6d6890'
      c.stroke()
      c.fillStyle = 'rgba(255,255,255,.9)'
      c.beginPath()
      c.ellipse(-s * 0.28, -s * 0.28, s * 0.1, s * 0.05, -0.7, 0, 7)
      c.fill()
    },
  },
  { id: 'y-sms', name: '1 pesan baru', w: 4.4, draw: pill('1 pesan baru', '#BFE3FF', INK, { font: MONO, weight: 700 }) },
]

const MORE_CUTE: Art[] = [
  {
    id: 'c-kucing',
    name: 'kucing',
    w: 1,
    draw: (c, s) => {
      const ear = (d: number) => (x: Ctx) => {
        x.moveTo(d * s * 0.36, -s * 0.05)
        x.lineTo(d * s * 0.3, -s * 0.42)
        x.lineTo(d * s * 0.05, -s * 0.22)
        x.closePath()
      }
      blob(c, [ear(-1), ear(1), (x) => x.ellipse(0, s * 0.08, s * 0.4, s * 0.32, 0, 0, 7)], '#ffe2c4', '#e8a87c', s * 0.045)
      face(c, s, 0.05, 0.14, 1.1)
      c.fillStyle = '#ff9ab8'
      c.beginPath()
      c.ellipse(0, s * 0.1, s * 0.03, s * 0.02, 0, 0, 7)
      c.fill()
      c.strokeStyle = '#c98a62'
      c.lineWidth = s * 0.012
      for (const d of [-1, 1]) {
        c.beginPath()
        c.moveTo(d * s * 0.2, s * 0.12)
        c.lineTo(d * s * 0.38, s * 0.08)
        c.moveTo(d * s * 0.2, s * 0.16)
        c.lineTo(d * s * 0.38, s * 0.18)
        c.stroke()
      }
    },
  },
  {
    id: 'c-pelangi',
    name: 'pelangi pastel',
    w: 1.3,
    draw: (c, s) => {
      const cols = ['#ffb3c7', '#ffd9a8', '#fff3a8', '#c8f0c8', '#c4dcff']
      cols.forEach((col, i) => {
        c.beginPath()
        c.arc(0, s * 0.25, s * (0.58 - i * 0.08) - s * 0.04, Math.PI, 0)
        c.lineWidth = s * 0.08
        c.strokeStyle = col
        c.stroke()
      })
      for (const d of [-1, 1]) {
        blob(
          c,
          [(x) => x.arc(d * s * 0.44, s * 0.24, s * 0.12, 0, 7), (x) => x.arc(d * s * 0.3, s * 0.27, s * 0.1, 0, 7), (x) => x.arc(d * s * 0.57, s * 0.28, s * 0.09, 0, 7)],
          '#ffffff',
          '#c4dcff',
          s * 0.035,
        )
      }
    },
  },
  {
    id: 'c-hati-dot',
    name: 'hati polkadot',
    w: 1,
    draw: (c, s) => {
      heartPath(c, s)
      c.fillStyle = '#FF7AA8'
      c.fill()
      c.save()
      heartPath(c, s)
      c.clip()
      for (let y = -0.5; y < 0.6; y += 0.17) for (let x = -0.6; x < 0.6; x += 0.17) dot(c, (x + (Math.round(y / 0.17) % 2 ? 0.085 : 0)) * s, y * s, s * 0.035, '#ffffff')
      c.restore()
    },
  },
  {
    id: 'c-cupcake',
    name: 'cupcake',
    w: 0.9,
    draw: (c, s) => {
      c.fillStyle = '#ffb3c7'
      c.beginPath()
      c.moveTo(-s * 0.3, s * 0.05)
      c.lineTo(s * 0.3, s * 0.05)
      c.lineTo(s * 0.22, s * 0.46)
      c.lineTo(-s * 0.22, s * 0.46)
      c.closePath()
      c.fill()
      c.strokeStyle = '#ff8fab'
      c.lineWidth = s * 0.02
      for (const x of [-0.14, 0, 0.14]) {
        c.beginPath()
        c.moveTo(x * s, s * 0.07)
        c.lineTo(x * s * 0.8, s * 0.44)
        c.stroke()
      }
      blob(c, [(x) => x.arc(-s * 0.18, -s * 0.02, s * 0.17, 0, 7), (x) => x.arc(s * 0.18, -s * 0.02, s * 0.17, 0, 7), (x) => x.arc(0, -s * 0.16, s * 0.2, 0, 7)], '#fff7fb', '#ffd0e0', s * 0.03)
      dot(c, 0, -s * 0.38, s * 0.07, '#e8344e')
      const sprinkles = ['#7ad0ff', '#ffd24a', '#b69cff', '#7ad0ff']
      sprinkles.forEach((col, i) => {
        c.save()
        c.translate((-0.18 + i * 0.12) * s, (-0.1 + (i % 2) * 0.08) * s)
        c.rotate(i)
        c.fillStyle = col
        c.fillRect(-s * 0.03, -s * 0.01, s * 0.06, s * 0.02)
        c.restore()
      })
    },
  },
  {
    id: 'c-bintang',
    name: 'bintang senyum',
    w: 1,
    draw: (c, s) => {
      star5(c, s, 0.5, '#ffe27a', '#f2b600', 0.035)
      face(c, s, 0.05, 0.1, 1.1)
      c.fillStyle = 'rgba(255,122,168,.5)'
      for (const d of [-1, 1]) {
        c.beginPath()
        c.ellipse(d * s * 0.18, s * 0.12, s * 0.045, s * 0.028, 0, 0, 7)
        c.fill()
      }
    },
  },
  { id: 'c-imut', name: 'imut banget', w: 4, draw: pill('imut banget', '#FFE3EC', INK, { border: '#FF7AA8' }) },
]

const MORE_KALCER: Art[] = [
  {
    id: 'kc-polaroid',
    name: 'polaroid',
    w: 0.9,
    draw: (c, s) => {
      c.save()
      c.rotate(-0.06)
      c.fillStyle = '#fbfaf6'
      c.fillRect(-s * 0.36, -s * 0.46, s * 0.72, s * 0.9)
      c.strokeStyle = '#d8d2c4'
      c.lineWidth = s * 0.01
      c.strokeRect(-s * 0.36, -s * 0.46, s * 0.72, s * 0.9)
      const g = c.createLinearGradient(0, -s * 0.4, 0, s * 0.2)
      g.addColorStop(0, '#9fb3c8')
      g.addColorStop(1, KYEL)
      c.fillStyle = g
      c.fillRect(-s * 0.3, -s * 0.4, s * 0.6, s * 0.6)
      dot(c, s * 0.1, -s * 0.12, s * 0.08, '#fff4d0')
      c.fillStyle = MOSS
      c.beginPath()
      c.moveTo(-s * 0.3, s * 0.2)
      c.lineTo(-s * 0.1, -s * 0.02)
      c.lineTo(s * 0.05, s * 0.1)
      c.lineTo(s * 0.18, s * 0.0)
      c.lineTo(s * 0.3, s * 0.2)
      c.fill()
      centerText(c, 'sore itu', 0, s * 0.32, fontOf(s * 0.13, { font: HAND, weight: 700 }), KINK)
      c.restore()
    },
  },
  { id: 'kc-label', name: 'label maker', w: 3.8, draw: card('jangan lupa', INK, '#ffffff', { font: MONO, weight: 700, radius: 0.06 }) },
  {
    id: 'kc-tanaman',
    name: 'tanaman',
    w: 0.9,
    draw: (c, s) => {
      c.fillStyle = MOSS
      const leaves: [number, number, number][] = [[-0.16, -0.18, -0.6], [0.16, -0.2, 0.6], [0, -0.3, 0], [-0.24, -0.02, -1.1], [0.24, -0.02, 1.1]]
      for (const [x, y, r] of leaves) {
        c.save()
        c.translate(x * s, y * s)
        c.rotate(r)
        c.beginPath()
        c.ellipse(0, 0, s * 0.08, s * 0.18, 0, 0, 7)
        c.fillStyle = r === 0 ? '#5d6b4c' : MOSS
        c.fill()
        c.restore()
      }
      c.fillStyle = '#c8714a'
      c.beginPath()
      c.moveTo(-s * 0.26, s * 0.08)
      c.lineTo(s * 0.26, s * 0.08)
      c.lineTo(s * 0.2, s * 0.48)
      c.lineTo(-s * 0.2, s * 0.48)
      c.closePath()
      c.fill()
      c.fillStyle = '#a95a37'
      c.fillRect(-s * 0.28, s * 0.06, s * 0.56, s * 0.1)
    },
  },
  {
    id: 'kc-kamera',
    name: 'kamera sekali pakai',
    w: 1.4,
    draw: (c, s) => {
      c.fillStyle = KYEL
      c.beginPath()
      c.roundRect(-s * 0.62, -s * 0.32, s * 1.24, s * 0.64, s * 0.06)
      c.fill()
      c.fillStyle = KINK
      c.fillRect(-s * 0.62, -s * 0.06, s * 1.24, s * 0.22)
      dot(c, s * 0.12, s * 0.04, s * 0.22, '#3a3732')
      dot(c, s * 0.12, s * 0.04, s * 0.14, '#111111')
      dot(c, s * 0.07, -s * 0.01, s * 0.04, 'rgba(255,255,255,.6)')
      c.fillStyle = '#f7f1e6'
      c.fillRect(-s * 0.52, -s * 0.24, s * 0.22, s * 0.12)
      c.fillStyle = KINK
      c.fillRect(s * 0.36, -s * 0.24, s * 0.16, s * 0.1)
      centerText(c, 'iso 400', -s * 0.36, s * 0.22, fontOf(s * 0.09, { font: MONO, weight: 700 }), KINK)
    },
  },
  {
    id: 'kc-klip',
    name: 'klip kertas',
    w: 0.5,
    draw: (c, s) => {
      c.strokeStyle = '#8f949c'
      c.lineWidth = s * 0.05
      c.lineCap = 'round'
      c.beginPath()
      c.moveTo(s * 0.04, -s * 0.15)
      c.lineTo(s * 0.04, s * 0.3)
      c.arc(-s * 0.04, s * 0.3, s * 0.08, 0, Math.PI)
      c.lineTo(-s * 0.12, -s * 0.36)
      c.arc(0, -s * 0.36, s * 0.12, Math.PI, 0)
      c.lineTo(s * 0.12, s * 0.4)
      c.stroke()
    },
  },
  {
    id: 'kc-dicek',
    name: 'sudah dicek',
    w: 3.6,
    draw: (c, s) => {
      c.save()
      c.rotate(-0.08)
      c.font = fontOf(s * 0.4, { font: MONO, weight: 700 })
      const w = c.measureText('sudah dicek').width + s * 0.5
      c.fillStyle = 'rgba(232,225,211,.9)'
      c.fillRect(-w / 2, -s * 0.36, w, s * 0.72)
      c.lineWidth = s * 0.05
      c.strokeStyle = MOSS
      c.strokeRect(-w / 2, -s * 0.36, w, s * 0.72)
      c.lineWidth = s * 0.015
      c.strokeRect(-w / 2 + s * 0.08, -s * 0.28, w - s * 0.16, s * 0.56)
      centerText(c, 'sudah dicek', 0, s * 0.02, fontOf(s * 0.4, { font: MONO, weight: 700 }), MOSS)
      c.restore()
    },
  },
]

const MORE_BESTIE: Art[] = [
  {
    id: 'b-gelang',
    name: 'gelang bff',
    w: 1.6,
    draw: (c, s) => {
      const cols = ['#ffb3c7', '#D9CCFF', '#FFF7C2', '#c8f0c8', '#c4dcff']
      const n = 13
      for (let i = 0; i < n; i++) {
        const a = Math.PI * 0.08 + (i / (n - 1)) * Math.PI * 0.84
        const x = -Math.cos(a) * s * 0.66
        const y = Math.sin(a) * s * 0.44 - s * 0.16
        const letter = { 5: 'b', 6: 'f', 7: 'f' }[i]
        if (letter) {
          c.fillStyle = '#ffffff'
          c.beginPath()
          c.roundRect(x - s * 0.1, y - s * 0.1, s * 0.2, s * 0.2, s * 0.03)
          c.fill()
          c.strokeStyle = '#d0c8e0'
          c.lineWidth = s * 0.012
          c.stroke()
          centerText(c, letter, x, y + s * 0.01, fontOf(s * 0.15), INK)
        } else dot(c, x, y, s * 0.075, cols[i % cols.length])
      }
    },
  },
  { id: 'b-duomaut', name: 'duo maut', w: 3.2, draw: pill('duo maut', '#D9CCFF', INK) },
  {
    id: 'b-dua-bintang',
    name: 'dua bintang',
    w: 1.3,
    draw: (c, s) => {
      c.save()
      c.translate(-s * 0.2, -s * 0.06)
      c.rotate(-0.2)
      star5(c, s * 0.8, 0.5, '#FFF7C2', '#e8c840', 0.04)
      c.restore()
      c.save()
      c.translate(s * 0.24, s * 0.12)
      c.rotate(0.25)
      star5(c, s * 0.62, 0.5, '#FFD8E8', '#ff8fb8', 0.05)
      c.restore()
    },
  },
  {
    id: 'b-eskrim',
    name: 'es krim',
    w: 0.8,
    draw: (c, s) => {
      c.fillStyle = '#e0a868'
      c.beginPath()
      c.moveTo(-s * 0.2, s * 0.0)
      c.lineTo(s * 0.2, s * 0.0)
      c.lineTo(0, s * 0.5)
      c.closePath()
      c.fill()
      c.strokeStyle = '#c4874a'
      c.lineWidth = s * 0.015
      for (const k of [0.1, 0.22]) {
        c.beginPath()
        c.moveTo(-s * 0.2 + k * s * 0.6, s * 0.0)
        c.lineTo(s * 0.05 + k * s * 0.3, s * 0.3)
        c.stroke()
      }
      dot(c, 0, -s * 0.1, s * 0.2, '#ffb3c7')
      dot(c, 0, -s * 0.32, s * 0.17, '#D9CCFF')
      dot(c, -s * 0.06, -s * 0.38, s * 0.04, 'rgba(255,255,255,.7)')
    },
  },
  { id: 'b-ayofoto', name: 'ayo foto!', w: 3.4, draw: (c, s) => speech(c, s, 'ayo foto!', '#D9CCFF', INK) },
  {
    id: 'b-gembok',
    name: 'gembok hati',
    w: 0.9,
    draw: (c, s) => {
      c.strokeStyle = '#a9a3c4'
      c.lineWidth = s * 0.07
      c.beginPath()
      c.arc(0, -s * 0.12, s * 0.17, Math.PI, 0)
      c.lineTo(s * 0.17, s * 0.0)
      c.moveTo(-s * 0.17, -s * 0.12)
      c.lineTo(-s * 0.17, s * 0.0)
      c.stroke()
      c.save()
      c.translate(0, s * 0.12)
      heart(c, s * 0.75, '#ff8fd1')
      c.restore()
      dot(c, 0, s * 0.1, s * 0.05, '#7a3f62')
      c.fillStyle = '#7a3f62'
      c.fillRect(-s * 0.015, s * 0.1, s * 0.03, s * 0.1)
    },
  },
]

const MORE_EDITORIAL: Art[] = [
  { id: 'e-majalah', name: 'majalah bilik', w: 4.6, draw: label('majalah bilik', INK, { font: SERIF, weight: 400, size: 0.66 }) },
  { id: 'e-hal', name: 'hal. 24', w: 2.4, draw: card('hal. 24', '#ffffff', INK, { font: MONO, weight: 400, border: INK }) },
  { id: 'e-tren', name: 'tren minggu ini', w: 5, draw: card('tren minggu ini', INK, '#ffffff', { font: SERIF, weight: 400, style: 'italic' }) },
  {
    id: 'e-baru',
    name: 'baru!',
    w: 1,
    draw: (c, s) => {
      burst(c, s, 16, 0.44, 0.38, '#D7263D', undefined, 2)
      centerText(c, 'baru!', 0, s * 0.02, fontOf(s * 0.24), '#ffffff')
    },
  },
  { id: 'e-tertanda', name: 'tertanda, aku', w: 4.2, draw: label('tertanda, aku', INK, { font: HAND, weight: 700, size: 0.76 }) },
  {
    id: 'e-panah',
    name: 'ini aku',
    w: 2.2,
    draw: (c, s) => {
      c.strokeStyle = INK
      c.lineWidth = s * 0.04
      c.lineCap = 'round'
      c.lineJoin = 'round'
      c.beginPath()
      c.moveTo(s * 0.16, -s * 0.2)
      c.bezierCurveTo(s * 0.42, -s * 0.2, s * 0.56, s * 0.0, s * 0.62, s * 0.32)
      c.moveTo(s * 0.62, s * 0.32)
      c.lineTo(s * 0.48, s * 0.24)
      c.moveTo(s * 0.62, s * 0.32)
      c.lineTo(s * 0.66, s * 0.17)
      c.stroke()
      centerText(c, 'ini aku', -s * 0.42, -s * 0.2, fontOf(s * 0.42, { font: HAND, weight: 700 }), INK)
    },
  },
]

const MORE_POP: Art[] = [
  {
    id: 'p-zap',
    name: 'zap!',
    w: 1.4,
    draw: (c, s) => {
      burst(c, s, 10, 0.5, 0.3, PINK, INK, 5)
      centerText(c, 'zap!', 0, s * 0.02, fontOf(s * 0.3, { font: IMPACT, weight: 400 }), YEL)
    },
  },
  { id: 'p-bintang', name: 'bintang pop', w: 1, draw: (c, s) => star5(c, s, 0.5, PINK, INK, 0.045) },
  {
    id: 'p-kacamata',
    name: 'kacamata hati',
    w: 1.5,
    draw: (c, s) => {
      c.strokeStyle = INK
      c.lineWidth = s * 0.045
      c.beginPath()
      c.moveTo(-s * 0.1, -s * 0.06)
      c.quadraticCurveTo(0, -s * 0.14, s * 0.1, -s * 0.06)
      c.moveTo(-s * 0.6, -s * 0.08)
      c.lineTo(-s * 0.72, -s * 0.16)
      c.moveTo(s * 0.6, -s * 0.08)
      c.lineTo(s * 0.72, -s * 0.16)
      c.stroke()
      for (const d of [-1, 1]) {
        c.save()
        c.translate(d * s * 0.34, 0)
        heartPath(c, s * 0.58)
        c.fillStyle = PINK
        c.fill()
        c.lineWidth = s * 0.04
        c.strokeStyle = INK
        c.stroke()
        c.restore()
      }
    },
  },
  {
    id: 'p-panah',
    name: 'lihat!',
    w: 2.2,
    draw: (c, s) => {
      c.beginPath()
      c.moveTo(-s * 0.9, -s * 0.2)
      c.lineTo(s * 0.4, -s * 0.2)
      c.lineTo(s * 0.4, -s * 0.42)
      c.lineTo(s * 0.92, 0)
      c.lineTo(s * 0.4, s * 0.42)
      c.lineTo(s * 0.4, s * 0.2)
      c.lineTo(-s * 0.9, s * 0.2)
      c.closePath()
      c.fillStyle = YEL
      c.fill()
      c.lineWidth = s * 0.045
      c.lineJoin = 'round'
      c.strokeStyle = INK
      c.stroke()
      centerText(c, 'lihat!', -s * 0.24, s * 0.01, fontOf(s * 0.28, { font: IMPACT, weight: 400 }), INK)
    },
  },
  {
    id: 'p-pisang',
    name: 'pisang',
    w: 1.2,
    draw: (c, s) => {
      c.beginPath()
      c.moveTo(-s * 0.5, -s * 0.2)
      c.quadraticCurveTo(-s * 0.2, s * 0.5, s * 0.52, s * 0.0)
      c.quadraticCurveTo(-s * 0.05, s * 0.22, -s * 0.38, -s * 0.28)
      c.closePath()
      c.fillStyle = YEL
      c.fill()
      c.lineWidth = s * 0.04
      c.lineJoin = 'round'
      c.strokeStyle = INK
      c.stroke()
      c.fillStyle = INK
      c.beginPath()
      c.roundRect(-s * 0.52, -s * 0.34, s * 0.1, s * 0.1, s * 0.02)
      c.fill()
    },
  },
  { id: 'p-yes', name: 'yes!', w: 2.2, draw: (c, s) => speech(c, s, 'yes!', PINK, INK, IMPACT) },
]

const MORE_MEME: Art[] = [
  { id: 'm-wkwk', name: 'wkwkwk', w: 3.4, draw: meme('wkwkwk') },
  { id: 'm-sabar', name: 'sabar', w: 2.6, draw: meme('sabar') },
  { id: 'm-noted', name: 'noted', w: 2.6, draw: meme('noted') },
  { id: 'm-tanya', name: '???', w: 2, draw: meme('???') },
  { id: 'm-aman', name: 'aman', w: 2.4, draw: meme('aman') },
  { id: 'm-valid', name: 'valid', w: 2.4, draw: meme('valid') },
]

const MORE_TRAVEL: Art[] = [
  {
    id: 't-perangko',
    name: 'perangko',
    w: 0.9,
    draw: (c, s) => {
      const w = s * 0.72
      const h = s * 0.9
      c.fillStyle = '#ffffff'
      c.fillRect(-w / 2, -h / 2, w, h)
      c.save()
      c.globalCompositeOperation = 'destination-out'
      const r = s * 0.035
      for (let x = -w / 2; x <= w / 2 + 1; x += r * 2.6) {
        dot(c, x, -h / 2, r, '#000')
        dot(c, x, h / 2, r, '#000')
      }
      for (let y = -h / 2; y <= h / 2 + 1; y += r * 2.6) {
        dot(c, -w / 2, y, r, '#000')
        dot(c, w / 2, y, r, '#000')
      }
      c.restore()
      c.fillStyle = '#BFE3FF'
      c.fillRect(-w / 2 + s * 0.08, -h / 2 + s * 0.08, w - s * 0.16, h - s * 0.26)
      c.fillStyle = TBLUE
      c.beginPath()
      c.moveTo(-w / 2 + s * 0.08, s * 0.19)
      c.lineTo(-s * 0.1, -s * 0.12)
      c.lineTo(s * 0.02, s * 0.02)
      c.lineTo(s * 0.12, -s * 0.06)
      c.lineTo(w / 2 - s * 0.08, s * 0.19)
      c.fill()
      dot(c, s * 0.14, -s * 0.24, s * 0.06, '#F2D57E')
      centerText(c, 'rp 5000', 0, h / 2 - s * 0.1, fontOf(s * 0.09, { font: MONO, weight: 700 }), TNAVY)
    },
  },
  {
    id: 't-dunia',
    name: 'bola dunia',
    w: 1,
    draw: (c, s) => {
      dot(c, 0, 0, s * 0.46, TBLUE)
      c.save()
      c.beginPath()
      c.arc(0, 0, s * 0.46, 0, 7)
      c.clip()
      c.fillStyle = '#7cc47a'
      for (const [x, y, rx, ry, r] of [[-0.18, -0.2, 0.2, 0.14, 0.4], [0.2, 0.08, 0.16, 0.24, -0.3], [-0.2, 0.25, 0.14, 0.1, 0]]) {
        c.beginPath()
        c.ellipse(x * s, y * s, rx * s, ry * s, r, 0, 7)
        c.fill()
      }
      c.restore()
      c.lineWidth = s * 0.025
      c.strokeStyle = TNAVY
      c.beginPath()
      c.arc(0, 0, s * 0.46, 0, 7)
      c.stroke()
    },
  },
  {
    id: 't-kompas',
    name: 'kompas',
    w: 1,
    draw: (c, s) => {
      dot(c, 0, 0, s * 0.46, TCREAM)
      c.lineWidth = s * 0.04
      c.strokeStyle = TNAVY
      c.beginPath()
      c.arc(0, 0, s * 0.46, 0, 7)
      c.stroke()
      c.fillStyle = TRED
      c.beginPath()
      c.moveTo(0, -s * 0.34)
      c.lineTo(s * 0.08, 0)
      c.lineTo(-s * 0.08, 0)
      c.fill()
      c.fillStyle = TNAVY
      c.beginPath()
      c.moveTo(0, s * 0.34)
      c.lineTo(s * 0.08, 0)
      c.lineTo(-s * 0.08, 0)
      c.fill()
      dot(c, 0, 0, s * 0.04, '#ffffff')
    },
  },
  {
    id: 't-payung',
    name: 'payung pantai',
    w: 1.1,
    draw: (c, s) => {
      c.strokeStyle = TNAVY
      c.lineWidth = s * 0.04
      c.lineCap = 'round'
      c.beginPath()
      c.moveTo(0, -s * 0.1)
      c.lineTo(s * 0.12, s * 0.48)
      c.stroke()
      const n = 6
      for (let i = 0; i < n; i++) {
        c.beginPath()
        c.moveTo(0, s * 0.02)
        c.arc(0, s * 0.02, s * 0.52, Math.PI + (i * Math.PI) / n, Math.PI + ((i + 1) * Math.PI) / n)
        c.closePath()
        c.fillStyle = i % 2 ? TCREAM : TRED
        c.fill()
      }
      c.lineWidth = s * 0.02
      c.beginPath()
      c.arc(0, s * 0.02, s * 0.52, Math.PI, 0)
      c.closePath()
      c.stroke()
    },
  },
  { id: 't-libur', name: 'libur dulu', w: 3.6, draw: pill('libur dulu', TBLUE, '#ffffff') },
  {
    id: 't-gunung',
    name: 'gunung',
    w: 1,
    draw: (c, s) => {
      c.save()
      c.beginPath()
      c.arc(0, 0, s * 0.46, 0, 7)
      c.clip()
      c.fillStyle = '#ffd9a8'
      c.fillRect(-s * 0.5, -s * 0.5, s, s)
      dot(c, s * 0.14, -s * 0.06, s * 0.13, '#ff9a5a')
      c.fillStyle = TNAVY
      c.beginPath()
      c.moveTo(-s * 0.5, s * 0.3)
      c.lineTo(-s * 0.12, -s * 0.14)
      c.lineTo(s * 0.08, s * 0.08)
      c.lineTo(s * 0.24, -s * 0.04)
      c.lineTo(s * 0.5, s * 0.3)
      c.lineTo(s * 0.5, s * 0.5)
      c.lineTo(-s * 0.5, s * 0.5)
      c.fill()
      c.fillStyle = '#ffffff'
      c.beginPath()
      c.moveTo(-s * 0.12, -s * 0.14)
      c.lineTo(-s * 0.2, -s * 0.05)
      c.lineTo(-s * 0.04, -s * 0.05)
      c.fill()
      c.restore()
      c.lineWidth = s * 0.03
      c.strokeStyle = TNAVY
      c.beginPath()
      c.arc(0, 0, s * 0.46, 0, 7)
      c.stroke()
    },
  },
]

const heartRow = ['.BB.BB.', 'BRRBRRB', 'BRRRRRB', '.BRRRB.', '..BRB..', '...B...']

const MORE_GAMING: Art[] = [
  {
    id: 'g-jamur',
    name: 'jamur piksel',
    w: 1,
    draw: pixels(
      ['...BBBB...', '.BBRRRRBB.', 'BRRWWRRRRB', 'BRWWWRRWWB', 'BRRWRRRWWB', 'BRRRRRRRRB', '.BBBBBBBB.', '..BWWWWB..', '..BWWWWB..', '...BBBB...'],
      { B: INK, R: '#e8344e', W: '#ffffff' },
    ),
  },
  {
    id: 'g-bintang',
    name: 'bintang piksel',
    w: 1.1,
    draw: pixels(
      ['.....B.....', '....BYB....', '....BYB....', 'BBBBBYBBBBB', 'BYYYYYYYYYB', '.BYYBYBYYB.', '..BYYYYYB..', '..BYYYYYB..', '.BYYYBYYYB.', '.BYYB.BYYB.', 'BBBB...BBBB'],
      { B: INK, Y: '#FFD60A' },
    ),
  },
  {
    id: 'g-nyawa',
    name: 'nyawa',
    w: 3.8,
    draw: pixels(
      heartRow.map((r) => `${r}.${r}.${r.replace(/R/g, 'G')}`),
      { B: INK, R: '#ff2f5a', G: '#8a8a9a' },
    ),
  },
  { id: 'g-gg', name: 'gg', w: 2, draw: pill('gg', NEON, NIGHT, { font: PIXEL, weight: 400, fsK: 0.8 }) },
  {
    id: 'g-pedang',
    name: 'pedang piksel',
    w: 1,
    draw: pixels(
      ['..........BB', '.........BWB', '........BWB.', '.......BWB..', '......BWB...', '.....BWB....', '.B..BWB.....', '.BBBWB......', '..BYB.......', '.BYBBB......', 'BYB..B......', 'BB..........'],
      { B: INK, W: '#dfe6ee', Y: '#c9844a' },
    ),
  },
  {
    id: 'g-hantu',
    name: 'hantu piksel',
    w: 1,
    draw: pixels(
      ['...BBBB...', '.BBPPPPBB.', 'BPPPPPPPPB', 'BPWWPPWWPB', 'BPWBPPWBPB', 'BPPPPPPPPB', 'BPPPPPPPPB', 'BPPPPPPPPB', 'BPPBBPPBPB', 'BB..BB..BB'],
      { B: INK, P: '#ff8fd1', W: '#ffffff' },
    ),
  },
]

const MORE_DARK: Art[] = [
  {
    id: 'd-kelelawar',
    name: 'kelelawar',
    w: 1.6,
    draw: (c, s) => {
      c.fillStyle = INK
      c.beginPath()
      c.moveTo(0, -s * 0.12)
      c.quadraticCurveTo(s * 0.3, -s * 0.4, s * 0.72, -s * 0.2)
      c.quadraticCurveTo(s * 0.6, -s * 0.05, s * 0.62, s * 0.12)
      c.quadraticCurveTo(s * 0.48, s * 0.0, s * 0.38, s * 0.12)
      c.quadraticCurveTo(s * 0.26, s * 0.02, s * 0.14, s * 0.18)
      c.lineTo(0, s * 0.26)
      c.lineTo(-s * 0.14, s * 0.18)
      c.quadraticCurveTo(-s * 0.26, s * 0.02, -s * 0.38, s * 0.12)
      c.quadraticCurveTo(-s * 0.48, s * 0.0, -s * 0.62, s * 0.12)
      c.quadraticCurveTo(-s * 0.6, -s * 0.05, -s * 0.72, -s * 0.2)
      c.quadraticCurveTo(-s * 0.3, -s * 0.4, 0, -s * 0.12)
      c.fill()
      c.beginPath()
      c.moveTo(-s * 0.1, -s * 0.1)
      c.lineTo(-s * 0.08, -s * 0.24)
      c.lineTo(-s * 0.02, -s * 0.14)
      c.lineTo(s * 0.02, -s * 0.14)
      c.lineTo(s * 0.08, -s * 0.24)
      c.lineTo(s * 0.1, -s * 0.1)
      c.fill()
      for (const d of [-1, 1]) dot(c, d * s * 0.05, -s * 0.04, s * 0.025, PINK)
    },
  },
  {
    id: 'd-mata',
    name: 'mata',
    w: 1.3,
    draw: (c, s) => {
      c.beginPath()
      c.moveTo(-s * 0.6, 0)
      c.quadraticCurveTo(0, -s * 0.5, s * 0.6, 0)
      c.quadraticCurveTo(0, s * 0.5, -s * 0.6, 0)
      c.fillStyle = INK
      c.fill()
      dot(c, 0, 0, s * 0.2, PINK)
      dot(c, 0, 0, s * 0.09, INK)
      dot(c, -s * 0.06, -s * 0.06, s * 0.04, '#ffffff')
    },
  },
  { id: 'd-bintang', name: 'bintang hitam', w: 1, draw: (c, s) => star5(c, s, 0.5, INK, PINK, 0.04) },
  {
    id: 'd-kartu',
    name: 'kartu bulan',
    w: 0.7,
    draw: (c, s) => {
      c.fillStyle = INK
      c.beginPath()
      c.roundRect(-s * 0.3, -s * 0.48, s * 0.6, s * 0.96, s * 0.04)
      c.fill()
      c.strokeStyle = PINK
      c.lineWidth = s * 0.015
      c.strokeRect(-s * 0.25, -s * 0.43, s * 0.5, s * 0.86)
      c.save()
      c.beginPath()
      c.arc(0, -s * 0.06, s * 0.16, 0, 7)
      c.clip()
      c.fillStyle = '#fff3c4'
      c.fillRect(-s * 0.2, -s * 0.25, s * 0.4, s * 0.4)
      dot(c, s * 0.07, -s * 0.11, s * 0.14, INK)
      c.restore()
      centerText(c, 'bulan', 0, s * 0.3, fontOf(s * 0.1, { font: SERIF, weight: 400 }), PINK)
      for (const [x, y] of [[-0.15, -0.3], [0.16, 0.12], [-0.12, 0.14]]) dot(c, x * s, y * s, s * 0.015, PINK)
    },
  },
  { id: 'd-zzz', name: 'zzz', w: 2, draw: label('zzz', PINK, { font: MONO, weight: 700, size: 0.8, stroke: INK, strokeW: 0.16 }) },
  { id: 'd-jangan', name: 'jangan ganggu', w: 4.6, draw: pill('jangan ganggu', INK, PINK, { font: MONO, weight: 700, border: PINK }) },
]

export type StickerPack = { id: string; name: string; items: Art[] }

/** kelompok stiker di palet: "bilik" dulu, lalu urut seperti kategori template */
export const STICKER_PACKS: StickerPack[] = [
  { id: 'bilik', name: 'bilik', items: [...BASE, ...MORE_BASE] },
  { id: 'klasik', name: 'klasik', items: [...KLASIK, ...MORE_KLASIK] },
  { id: 'retro', name: 'retro', items: [...RETRO, ...MORE_RETRO] },
  { id: 'cute', name: 'cute', items: [...CUTE, ...MORE_CUTE] },
  { id: 'kalcer', name: 'kalcer', items: [...KALCER, ...MORE_KALCER] },
  { id: 'bestie', name: 'bestie', items: [...BESTIE, ...MORE_BESTIE] },
  { id: 'editorial', name: 'editorial', items: [...EDITORIAL, ...MORE_EDITORIAL] },
  { id: 'pop', name: 'bold & pop', items: [...POP, ...MORE_POP] },
  { id: 'meme', name: 'meme', items: [...MEME, ...MORE_MEME] },
  { id: 'travel', name: 'travel', items: [...TRAVEL, ...MORE_TRAVEL] },
  { id: 'gaming', name: 'gaming', items: [...GAMING, ...MORE_GAMING] },
  { id: 'dark', name: 'dark', items: [...DARK, ...MORE_DARK] },
  { id: 'y2k', name: 'y2k', items: [...Y2K, ...MORE_Y2K] },
]

export const STICKER_SET: Art[] = STICKER_PACKS.flatMap((p) => p.items)

/** font yang dipakai stiker tulisan (ditunggu sebelum digambar supaya tidak memakai font cadangan) */
export const STICKER_FONTS = [
  '800 40px "Outfit Variable"',
  '700 40px "Space Mono"',
  '400 40px "Space Mono"',
  '400 40px "DM Serif Display"',
  'italic 400 40px "DM Serif Display"',
  '700 40px "Caveat Variable"',
  '400 40px VT323',
  '400 40px Anton',
]

// ---------- stiker tulisan sendiri ----------

export const TEXT_STYLES = [
  { id: 'pil', name: 'pil' },
  { id: 'serif', name: 'serif' },
  { id: 'tangan', name: 'tulisan tangan' },
  { id: 'meme', name: 'meme' },
  { id: 'piksel', name: 'piksel' },
  { id: 'label', name: 'label' },
] as const
export type TextStyle = (typeof TEXT_STYLES)[number]['id']

/** jenis stiker tulisan sendiri disimpan sebagai "teks:<gaya>:<tulisan>" */
export const textKind = (style: TextStyle, text: string) => `teks:${style}:${text}`

const textArts = new Map<string, Art>()
/** gambar untuk stiker tulisan sendiri; null kalau `kind` bukan stiker tulisan */
export function textArt(kind: string): Art | null {
  if (!kind.startsWith('teks:')) return null
  const hit = textArts.get(kind)
  if (hit) return hit
  const i = kind.indexOf(':', 5)
  const style = kind.slice(5, i) as TextStyle
  const text = kind.slice(i + 1)
  const n = [...text].length
  // `w` = perkiraan lebar (dilebihkan; hasil akhirnya dipotong rapat ke isi)
  const make = (k: number, pad: number, draw: Art['draw']): Art => ({ id: kind, name: `tulisan "${text}"`, w: n * k + pad, draw })
  const art =
    style === 'serif'
      ? make(0.45, 0.6, label(text, INK, { font: SERIF, weight: 400, style: 'italic', size: 0.72 }))
      : style === 'tangan'
        ? make(0.42, 0.6, label(text, INK, { font: HAND, weight: 700, size: 0.8 }))
        : style === 'meme'
          ? make(0.5, 0.6, meme(text))
          : style === 'piksel'
            ? make(0.5, 1, pill(text, NIGHT, NEON, { font: PIXEL, weight: 400, fsK: 0.78 }))
            : style === 'label'
              ? make(0.4, 1, card(text, INK, '#ffffff', { font: MONO, weight: 700, radius: 0.06 }))
              : make(0.4, 1, pill(text, PINK, INK))
  if (textArts.size > 200) textArts.clear()
  textArts.set(kind, art)
  return art
}
