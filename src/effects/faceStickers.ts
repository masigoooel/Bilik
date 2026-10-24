// Stiker wajah ala Photo Booth macOS: partikel (hati, bintang, kupu-kupu, ...) yang muncul meletup di sekitar kepala,
// diam sambil bergerak pelan, lalu memudar; tiap siklus posisi, ukuran, warna, dan blur diacak ulang. Burung terbang
// melingkari kepala. Dipindahkan dari kode acuan (canvas 2D) dengan bentuk, warna, dan perilaku yang sama.
// Satu-satunya beda: tiap bentuk digambar sekali ke sprite (termasuk blur & cahayanya) lalu ditempel tiap frame.
// Hasilnya sama, jauh lebih ringan di HP daripada `c.filter = blur()` / shadowBlur per partikel tiap frame.
// Semua di perangkat: tidak ada gambar yang diunggah.

/** lebar kanvas acuan; ukuran & posisi HEAD dalam ruang ini, kanvas lain diskalakan dengan k = w / W */
export const W = 640

/** kepala dari deteksi wajah, di koordinat kanvas acuan W: titik tengah, r = setengah lebar wajah (pipi ke pipi), sudut miring */
export type Head = { x: number; y: number; r: number; angle: number }

export type StickerId = 'hearts' | 'stars' | 'birds' | 'butterfly' | 'bubbles' | 'notes' | 'sparkle' | 'petals'

/** stiker wajah, urut seperti grid 3×3 (tanpa "normal" di tengah) */
export const STICKERS: { id: StickerId; name: string }[] = [
  { id: 'hearts', name: 'hati' },
  { id: 'stars', name: 'bintang' },
  { id: 'birds', name: 'burung' },
  { id: 'butterfly', name: 'kupu-kupu' },
  { id: 'bubbles', name: 'gelembung' },
  { id: 'notes', name: 'not musik' },
  { id: 'sparkle', name: 'kilau' },
  { id: 'petals', name: 'kelopak' },
]

export const stickerById = (id: string | null | undefined) => STICKERS.find((s) => s.id === id) ?? null

type Ctx = CanvasRenderingContext2D

export function rnd(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

// ---------- sprite (bentuk kode acuan, blur & cahaya dipanggang sekali) ----------

type Sprite = { c: HTMLCanvasElement; k: number }
const SPRITES = new Map<string, HTMLCanvasElement>()
/** ukuran sprite: tangga ±19% di atas ukuran tampil */
const bucket = (size: number) => Math.max(6, 2 ** (Math.ceil(Math.log2(Math.max(1, size)) * 4) / 4))

/**
 * `paint` menggambar bentuk berpusat di (0,0) dengan ukuran s (s = ukuran tampil di kode acuan).
 * `box` = lebar kanvas sprite relatif s (ruang untuk cahaya/garis); `blur` dalam px tampil.
 */
function sprite(key: string, size: number, blur: number, paint: (c: Ctx, s: number) => void, box = 2.4): Sprite {
  const b = bucket(size)
  // blur dalam px sprite (sprite digambar di ukuran b lalu diskalakan ke size)
  const bs = Math.round(blur * (b / size) * 2) / 2
  const id = `${key}:${bs}@${b.toFixed(2)}`
  let c = SPRITES.get(id)
  if (!c) {
    if (SPRITES.size > 600) SPRITES.clear()
    c = document.createElement('canvas')
    c.width = c.height = Math.ceil(b * box + bs * 6)
    const x = c.getContext('2d')!
    x.translate(c.width / 2, c.height / 2)
    if (bs) x.filter = `blur(${bs}px)`
    paint(x, b)
    SPRITES.set(id, c)
  }
  return { c, k: size / b }
}

/** tempel sprite berpusat di (x, y) dengan putaran & skala horizontal (sayap / arah hadap) */
function stamp(c: Ctx, sp: Sprite, x: number, y: number, alpha: number, rot = 0, sx = 1) {
  if (alpha <= 0.005 || Math.abs(sx) < 0.02) return
  c.save()
  c.globalAlpha = alpha
  c.translate(x, y)
  if (rot) c.rotate(rot)
  c.scale(sp.k * sx, sp.k)
  c.drawImage(sp.c, -sp.c.width / 2, -sp.c.height / 2)
  c.restore()
}

// ---------- medan partikel (kode acuan) ----------

type Field = {
  n: number
  pmin: number
  pmax: number
  salt: number
  a0: number
  as: number
  d0: number
  ds: number
  sx: number
  sy: number
  oy: number
  rise: number
  s0: number
  ss: number
  blurp: number
}

/** satu partikel siap digambar: ukuran sudah termasuk efek meletup, alpha sudah termasuk pudar */
type Particle = { x: number; y: number; size: number; seed: number; u: number; blur: number; alpha: number }

export type DrawOpts = {
  /** 0–1: stiker memudar saat wajah hilang */
  vis?: number
  /** prefers-reduced-motion: partikel separuh, tanpa naik, burung lebih lambat */
  reduced?: boolean
  /** fps turun: partikel dikurangi, maksimal 6 partikel blur per wajah */
  lowPower?: boolean
}

/** partikel satu medan pada waktu t (kepala di hx, hy dengan radius r; k = skala kanvas) */
function popField(hx: number, hy: number, r: number, k: number, t: number, field: Field, opts: DrawOpts): Particle[] {
  const o = { ...field }
  if (opts.reduced) {
    o.n = Math.ceil(o.n / 2)
    o.rise = 0
  }
  if (opts.lowPower) o.n = Math.ceil(o.n * 0.7)
  const vis = opts.vis ?? 1
  const out: Particle[] = []
  let blurred = 0
  for (let i = 0; i < o.n; i++) {
    const per = o.pmin + rnd(i + o.salt) * (o.pmax - o.pmin)
    const ph = rnd(i + 50 + o.salt) * per
    const cyc = Math.floor((t + ph) / per)
    const u = ((t + ph) / per) % 1
    const seed = i * 31 + cyc * 7 + o.salt
    const ang = Math.PI * (o.a0 + rnd(seed) * o.as)
    const dist = r * (o.d0 + rnd(seed + 1) * o.ds)
    const x = hx + Math.cos(ang) * dist * o.sx
    const y = hy + o.oy * r + Math.sin(ang) * dist * o.sy - u * r * o.rise
    const size = r * (o.s0 + rnd(seed + 2) * o.ss)
    let blur = rnd(seed + 3) < o.blurp ? (1.5 + rnd(seed + 4) * 5) * k : 0
    // fps turun: maksimal 6 partikel blur per wajah (sisanya tajam)
    if (blur && opts.lowPower && ++blurred > 6) blur = 0
    const pop = u < 0.15 ? u / 0.15 : 1
    const fade = u > 0.65 ? Math.max(0, 1 - (u - 0.65) / 0.35) : 1
    const sc = pop < 1 ? 0.3 + 0.85 * pop + 0.15 * Math.sin(pop * Math.PI) : 1
    // gerak dikurangi: tanpa meletup, muncul dengan fade biasa
    const alpha = (blur ? 0.55 : 0.95) * fade * (opts.reduced ? pop : 1) * vis
    out.push({ x, y, size: size * (opts.reduced ? 1 : sc), seed, u, blur, alpha })
  }
  // yang blur (jauh) di bawah, yang tajam (dekat) di atas
  return out.sort((a, b) => (b.blur ? 1 : 0) - (a.blur ? 1 : 0))
}

const HALO: Field = { n: 12, pmin: 1.4, pmax: 2.6, salt: 0, a0: 1.05, as: 0.9, d0: 0.95, ds: 0.55, sx: 1.1, sy: 0.8, oy: -0.35, rise: 0.25, s0: 0.12, ss: 0.2, blurp: 0.45 }

// ---------- bentuk (kode acuan) ----------

function drawHeart(c: Ctx, p: Particle) {
  const col = ['#ff2f7a', '#ff5a96', '#e0206a'][p.seed % 3]
  const sp = sprite(`heart:${col}`, p.size, p.blur, (x, s) => {
    x.scale(s / 16, s / 16)
    x.beginPath()
    x.moveTo(0, 5)
    x.bezierCurveTo(-14, -6, -6, -16, 0, -8)
    x.bezierCurveTo(6, -16, 14, -6, 0, 5)
    x.fillStyle = col
    x.fill()
  })
  stamp(c, sp, p.x, p.y, p.alpha)
}

function drawStar(c: Ctx, p: Particle) {
  const col = ['#ffd24a', '#ffe680', '#ffb800'][p.seed % 3]
  const sp = sprite(
    `star:${col}`,
    p.size,
    p.blur,
    (x, s) => {
      x.beginPath()
      for (let i = 0; i < 10; i++) {
        const rr = i % 2 ? s * 0.42 : s
        const an = (i * Math.PI) / 5 - Math.PI / 2
        x.lineTo(Math.cos(an) * rr, Math.sin(an) * rr)
      }
      x.closePath()
      x.fillStyle = col
      x.shadowColor = 'rgba(255,210,74,.8)'
      x.shadowBlur = s * 0.6
      x.fill()
    },
    4,
  )
  stamp(c, sp, p.x, p.y, p.alpha, p.u * 2 + p.seed)
}

const BUTTERFLY: [string, string][] = [
  ['#ff8fd1', '#ffc6e8'],
  ['#7fd3ff', '#c6ecff'],
  ['#ffd24a', '#fff0b0'],
  ['#b98cff', '#e2d2ff'],
]

function drawButterfly(c: Ctx, p: Particle) {
  const s0 = p.size
  const f = 0.25 + 0.75 * Math.abs(Math.sin(p.u * 40 + p.seed))
  const cols = BUTTERFLY[p.seed % 4]
  // sayap satu sisi (kanan); sisi kiri = cermin. kepakan = skala horizontal
  const wing = sprite(
    `bf-wing:${cols[0]}`,
    s0,
    p.blur,
    (x, s) => {
      x.fillStyle = cols[0]
      x.beginPath()
      x.ellipse(s * 0.45, -s * 0.25, s * 0.5, s * 0.38, -0.5, 0, 7)
      x.fill()
      x.fillStyle = cols[1]
      x.beginPath()
      x.ellipse(s * 0.35, s * 0.22, s * 0.34, s * 0.26, 0.5, 0, 7)
      x.fill()
    },
    2.4,
  )
  const body = sprite('bf-body', s0, p.blur, (x, s) => {
    x.fillStyle = '#3a2a3a'
    x.beginPath()
    x.ellipse(0, 0, s * 0.08, s * 0.38, 0, 0, 7)
    x.fill()
    x.strokeStyle = '#3a2a3a'
    x.lineWidth = Math.max(1, s * 0.04)
    x.beginPath()
    x.moveTo(0, -s * 0.35)
    x.quadraticCurveTo(-s * 0.15, -s * 0.6, -s * 0.25, -s * 0.62)
    x.moveTo(0, -s * 0.35)
    x.quadraticCurveTo(s * 0.15, -s * 0.6, s * 0.25, -s * 0.62)
    x.stroke()
  })
  const rot = Math.sin(p.u * 6 + p.seed) * 0.3
  c.save()
  c.translate(p.x, p.y)
  c.rotate(rot)
  for (const d of [-1, 1]) stamp(c, wing, 0, 0, p.alpha, 0, d * f)
  stamp(c, body, 0, 0, p.alpha)
  c.restore()
}

function drawBubble(c: Ctx, p: Particle) {
  const sp = sprite(
    'bubble',
    p.size,
    p.blur,
    (x, s) => {
      const g = x.createRadialGradient(-s * 0.3, -s * 0.3, s * 0.1, 0, 0, s)
      g.addColorStop(0, 'rgba(255,255,255,.35)')
      g.addColorStop(0.7, 'rgba(180,220,255,.12)')
      g.addColorStop(1, 'rgba(255,160,220,.45)')
      x.fillStyle = g
      x.beginPath()
      x.arc(0, 0, s, 0, 7)
      x.fill()
      const rg = x.createLinearGradient(-s, -s, s, s)
      rg.addColorStop(0, 'rgba(255,140,200,.8)')
      rg.addColorStop(0.5, 'rgba(140,220,255,.8)')
      rg.addColorStop(1, 'rgba(200,255,160,.8)')
      x.strokeStyle = rg
      x.lineWidth = Math.max(1, s * 0.07)
      x.stroke()
      x.fillStyle = 'rgba(255,255,255,.85)'
      x.beginPath()
      x.ellipse(-s * 0.38, -s * 0.4, s * 0.2, s * 0.11, -0.7, 0, 7)
      x.fill()
    },
    2.4,
  )
  stamp(c, sp, p.x, p.y, p.alpha)
}

function drawNote(c: Ctx, p: Particle) {
  const col = ['#1c1b19', '#ff3e8a', '#7a5cff'][p.seed % 3]
  const single = p.seed % 2 === 1
  const sp = sprite(
    `note:${single ? 1 : 2}:${col}`,
    p.size,
    p.blur,
    (x, s) => {
      x.fillStyle = col
      x.strokeStyle = col
      x.lineWidth = Math.max(1.5, s * 0.12)
      if (single) {
        x.beginPath()
        x.ellipse(-s * 0.25, s * 0.35, s * 0.28, s * 0.2, -0.4, 0, 7)
        x.fill()
        x.beginPath()
        x.moveTo(0, s * 0.3)
        x.lineTo(0, -s * 0.6)
        x.quadraticCurveTo(s * 0.4, -s * 0.4, s * 0.35, -s * 0.05)
        x.stroke()
      } else {
        x.beginPath()
        x.ellipse(-s * 0.45, s * 0.4, s * 0.24, s * 0.17, -0.4, 0, 7)
        x.ellipse(s * 0.35, s * 0.25, s * 0.24, s * 0.17, -0.4, 0, 7)
        x.fill()
        x.beginPath()
        x.moveTo(-s * 0.24, s * 0.38)
        x.lineTo(-s * 0.24, -s * 0.5)
        x.lineTo(s * 0.56, -s * 0.65)
        x.lineTo(s * 0.56, s * 0.22)
        x.stroke()
      }
    },
    2.4,
  )
  stamp(c, sp, p.x, p.y, p.alpha, Math.sin(p.u * 8 + p.seed) * 0.25)
}

function drawSpark(c: Ctx, p: Particle) {
  const col = ['#ffffff', '#fff3c0', '#ffd6ea'][p.seed % 3]
  const sp = sprite(
    `spark:${col}`,
    p.size,
    p.blur,
    (x, s) => {
      x.fillStyle = col
      x.shadowColor = 'rgba(255,255,255,.9)'
      x.shadowBlur = s * 0.8
      x.beginPath()
      x.moveTo(0, -s)
      x.quadraticCurveTo(0, 0, s, 0)
      x.quadraticCurveTo(0, 0, 0, s)
      x.quadraticCurveTo(0, 0, -s, 0)
      x.quadraticCurveTo(0, 0, 0, -s)
      x.fill()
    },
    4.4,
  )
  stamp(c, sp, p.x, p.y, p.alpha, p.u * 1.5)
}

function drawPetal(c: Ctx, p: Particle) {
  const col = ['#ffc0d6', '#ffe3ec', '#ff9ab8'][p.seed % 3]
  const sp = sprite(`petal:${col}`, p.size, p.blur, (x, s) => {
    x.fillStyle = col
    x.beginPath()
    x.moveTo(0, -s * 0.6)
    x.bezierCurveTo(s * 0.6, -s * 0.5, s * 0.5, s * 0.4, 0, s * 0.6)
    x.bezierCurveTo(-s * 0.5, s * 0.4, -s * 0.6, -s * 0.5, 0, -s * 0.6)
    x.fill()
    x.fillStyle = 'rgba(255,255,255,.5)'
    x.beginPath()
    x.ellipse(-s * 0.1, -s * 0.15, s * 0.1, s * 0.25, 0.3, 0, 7)
    x.fill()
  })
  stamp(c, sp, p.x, p.y, p.alpha, p.u * 3 + p.seed)
}

/** burung biru kartun menghadap kanan (dir = -1 menghadap kiri); flap -1..1 = posisi sayap */
function bird(c: Ctx, x: number, y: number, s: number, a: number, flap: number, dir: number) {
  // sayap dibulatkan ke 9 posisi supaya cukup 9 sprite per ukuran
  const fq = Math.round(flap * 4) / 4
  const sp = sprite(
    `bird:${fq}`,
    s,
    0,
    (b, size) => {
      b.scale(size / 20, size / 20)
      b.fillStyle = '#5fb0ff'
      b.beginPath()
      b.ellipse(0, 0, 14, 10, 0, 0, 7)
      b.fill()
      b.beginPath()
      b.arc(10, -6, 7, 0, 7)
      b.fill()
      b.fillStyle = '#ffb02e'
      b.beginPath()
      b.moveTo(16, -6)
      b.lineTo(23, -4)
      b.lineTo(16, -2)
      b.fill()
      b.fillStyle = '#111'
      b.beginPath()
      b.arc(12, -8, 1.6, 0, 7)
      b.fill()
      b.fillStyle = '#3a8ad6'
      b.beginPath()
      b.ellipse(-2, -2, 10, 5 * Math.abs(fq) + 1, -0.5 * fq, 0, 7)
      b.fill()
    },
    2.6,
  )
  stamp(c, sp, x, y, a, 0, dir)
}

// ---------- satu wajah ----------

/**
 * Gambar stiker `fx` untuk satu wajah di kanvas w×h. `head` di koordinat kanvas acuan W; `now` detik.
 * Stiker diputar mengikuti kemiringan kepala (di sekitar titik kepala).
 */
export function overlayFace(c: Ctx, w: number, _h: number, fx: StickerId, head: Head, now: number, opts: DrawOpts = {}) {
  const k = w / W
  const hx = head.x * k
  const hy = head.y * k
  const r = head.r * k
  const t = now
  const vis = opts.vis ?? 1
  const field = (o: Partial<Field>, draw: (c: Ctx, p: Particle) => void) => {
    for (const p of popField(hx, hy, r, k, t, { ...HALO, ...o }, opts)) draw(c, p)
  }
  c.save()
  c.translate(hx, hy)
  c.rotate(head.angle)
  c.translate(-hx, -hy)
  if (fx === 'hearts') field({ n: 14, salt: 0, s0: 0.14, ss: 0.24 }, drawHeart)
  else if (fx === 'stars') field({ salt: 3, s0: 0.1, ss: 0.14 }, drawStar)
  else if (fx === 'butterfly') field({ n: 9, salt: 5, pmin: 1.8, pmax: 3, rise: 0.45, s0: 0.22, ss: 0.16, blurp: 0.35 }, drawButterfly)
  else if (fx === 'bubbles') field({ n: 13, salt: 7, a0: 0.9, as: 1.2, d0: 0.9, ds: 0.8, rise: 0.6, s0: 0.1, ss: 0.22, blurp: 0.35 }, drawBubble)
  else if (fx === 'notes') field({ n: 10, salt: 9, rise: 0.5, s0: 0.12, ss: 0.12, blurp: 0.3 }, drawNote)
  else if (fx === 'petals') field({ n: 14, salt: 11, rise: -0.35, s0: 0.13, ss: 0.12, blurp: 0.5 }, drawPetal)
  else if (fx === 'sparkle') {
    // rona pipi pink yang di-blur
    const blush = sprite(
      'blush',
      r * 0.4,
      4 * k,
      (x, s) => {
        x.fillStyle = 'rgba(255,90,130,.3)'
        x.beginPath()
        x.ellipse(0, 0, s / 2, s * 0.3, 0, 0, 7)
        x.fill()
      },
      1.6,
    )
    for (const q of [-1, 1]) stamp(c, blush, hx + q * r * 0.55, hy + r * 0.25, vis)
    field({ n: 14, salt: 13, a0: 0.85, as: 1.3, d0: 0.9, ds: 0.6, oy: -0.1, rise: 0.1, s0: 0.06, ss: 0.1, blurp: 0.3, pmin: 0.9, pmax: 1.6 }, drawSpark)
  } else if (fx === 'birds') {
    const n = 4
    const cy = hy - r * 1.05
    const rx = r * 1.25
    const ry = r * 0.32
    // gerak dikurangi: burung berputar lebih lambat
    const sp = opts.reduced ? 0.6 : 1.4
    const items = Array.from({ length: n }, (_, i) => {
      const an = t * sp + (i * Math.PI * 2) / n
      return { x: hx + Math.cos(an) * rx, y: cy + Math.sin(an) * ry, d: Math.sin(an), an, i }
    }).sort((a, b) => a.d - b.d)
    for (const o of items) {
      const sc = 0.65 + (0.35 * (o.d + 1)) / 2
      const al = 0.55 + (0.45 * (o.d + 1)) / 2
      bird(c, o.x, o.y, r * 0.2 * sc, al * vis, Math.sin(t * 14 + o.i), Math.cos(o.an) < 0 ? 1 : -1)
    }
  }
  c.restore()
}

// ---------- thumbnail ----------

/**
 * ikon stiker w×h (default persegi) pada detik `now`: kepala kartun + stikernya (null = "normal").
 * Petak lebar (grid) memakai kepala yang lebih besar & lebih rendah supaya stiker di atasnya terlihat.
 */
export function drawStickerThumb(c: Ctx, fx: StickerId | null, w: number, now: number, h = w) {
  const g = c.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#E9E2F2')
  g.addColorStop(1, '#F7EEF2')
  c.fillStyle = g
  c.fillRect(0, 0, w, h)
  const wide = w > h * 1.2
  const S = Math.min(w, h)
  const cx = w / 2
  const cy = h * (wide ? 0.84 : 0.66)
  const fw = S * (wide ? 0.52 : 0.36)
  c.fillStyle = '#3B2A33'
  c.beginPath()
  c.ellipse(cx, cy - fw * 0.12, fw * 0.62, fw * 0.66, 0, 0, Math.PI * 2)
  c.fill()
  c.fillStyle = '#F2C9AE'
  c.beginPath()
  c.ellipse(cx, cy + fw * 0.05, fw * 0.48, fw * 0.55, 0, 0, Math.PI * 2)
  c.fill()
  c.fillStyle = '#3B2A33'
  for (const s of [-1, 1]) {
    c.beginPath()
    c.arc(cx + s * fw * 0.2, cy - fw * 0.02, fw * 0.05, 0, Math.PI * 2)
    c.fill()
  }
  if (!fx) return
  const k = w / W
  overlayFace(c, w, h, fx, { x: cx / k, y: (cy - fw * 0.1) / k, r: (fw * 0.5) / k, angle: 0 }, now)
}
