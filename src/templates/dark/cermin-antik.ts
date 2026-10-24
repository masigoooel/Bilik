// Cermin Antik — design-reference/dark-grunge/cermin-antik.html (1080x1350, 1 foto)
import { box, dropShadow, linear, setShadow, type Ctx } from '../paint'
import { dark } from './define'
import { CINZEL, ellipseGradient, rotated, txt } from './helpers'

const BG = '#1A1418'
const DARK = '#3a2608'
const PLATE_INK = '#2a1a06'
/** linear-gradient(135deg, ...) emas bingkai & papan nama */
const METAL: [number, string][] = [
  [0, '#4a3210'],
  [0.14, '#b8903a'],
  [0.24, '#f6e3a4'],
  [0.36, '#9a7228'],
  [0.5, '#e2c272'],
  [0.62, '#6e4e18'],
  [0.76, '#d4b060'],
  [0.86, '#f0d890'],
  [1, '#7a5820'],
]
/** <linearGradient id="gd" x1=0 y1=0 x2=1 y2=1> ornamen */
const GD: [number, string][] = [
  [0, '#5a3e14'],
  [0.25, '#f3dc98'],
  [0.45, '#9a7228'],
  [0.65, '#e8c878'],
  [1, '#6a4a18'],
]
/** kotak foto (persegi) di dalam cermin lonjong 608x818 (overflow hidden, radius 50%) */
const SLOT = { x: 236, y: 221, w: 608, h: 804 }
const CX = 540
const CY = 630
/** noda cermin: x, y, ukuran, alpha rgba(120,90,50,a), blur px */
const SPOTS: [number, number, number, number, number][] = [
  [751, 334, 20, 0.25, 3], [577, 378, 20, 0.24, 2], [692, 882, 20, 0.21, 1], [571, 258, 22, 0.23, 2], [671, 268, 12, 0.19, 1],
  [757, 962, 11, 0.16, 3], [479, 320, 22, 0.21, 1], [695, 281, 21, 0.29, 1], [337, 370, 11, 0.29, 1], [734, 381, 9, 0.23, 2],
  [395, 352, 20, 0.15, 3], [587, 256, 15, 0.23, 3], [378, 261, 10, 0.24, 1], [612, 326, 8, 0.16, 1], [524, 1014, 7, 0.22, 2],
  [406, 401, 18, 0.32, 1], [433, 330, 20, 0.3, 1], [477, 350, 11, 0.23, 1], [387, 992, 6, 0.2, 3], [677, 968, 22, 0.21, 1],
  [346, 919, 8, 0.26, 3], [351, 322, 7, 0.3, 1], [551, 356, 7, 0.16, 1], [564, 345, 12, 0.17, 1], [737, 335, 13, 0.27, 1],
  [762, 342, 6, 0.15, 3],
]

function ellipse(ctx: Ctx, cx: number, cy: number, rx: number, ry: number) {
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
}

/** cincin box-shadow: inset 0 0 0 Npx pada elips */
function ellipseRing(ctx: Ctx, rx: number, ry: number, n: number, color: string) {
  ctx.beginPath()
  ellipse(ctx, CX, CY, rx, ry)
  ellipse(ctx, CX, CY, rx - n, ry - n)
  ctx.fillStyle = color
  ctx.fill('evenodd')
}

/** box-shadow: inset dx dy blur color pada elips */
function ellipseInset(ctx: Ctx, rx: number, ry: number, dx: number, dy: number, blur: number, color: string) {
  ctx.save()
  ctx.beginPath()
  ellipse(ctx, CX, CY, rx, ry)
  ctx.clip()
  setShadow(ctx, dx, dy, blur, color)
  ctx.beginPath()
  ctx.rect(CX - rx - 300, CY - ry - 300, 2 * rx + 600, 2 * ry + 600)
  ellipse(ctx, CX, CY, rx, ry)
  ctx.fillStyle = '#000'
  ctx.fill('evenodd')
  ctx.restore()
}

/**
 * border 7px dotted pada elips. Chrome membagi tepi di sudut 45° jadi 4 sisi; titik berjarak ≈ 2× lebar.
 * Jarak & titik awal per sisi (atas, kanan, bawah, kiri) dicocokkan dengan screenshot desain.
 */
const DOT_SIDES: [spacing: number, start: number][] = [
  [14.03, 9.5],
  [14.02, 2.25],
  [13.89, 0],
  [14.01, 0],
]

function dottedEllipse(ctx: Ctx, a: number, b: number, d: number, color: string) {
  const speed = (t: number) => Math.hypot(a * Math.sin(t), b * Math.cos(t))
  ctx.fillStyle = color
  ctx.beginPath()
  for (let side = 0; side < 4; side++) {
    const t0 = ((-135 + side * 90) * Math.PI) / 180
    const t1 = t0 + Math.PI / 2
    // tabel panjang busur
    const N = 2000
    const acc = [0]
    for (let i = 1; i <= N; i++) acc.push(acc[i - 1] + (speed(t0 + ((i - 0.5) / N) * (t1 - t0)) * (t1 - t0)) / N)
    const L = acc[N]
    const [sp, start] = DOT_SIDES[side]
    let j = 0
    for (let target = start; target <= L; target += sp) {
      while (j < N && acc[j + 1] < target) j++
      const t = t0 + ((j + (target - acc[j]) / Math.max(1e-9, acc[j + 1] - acc[j])) / N) * (t1 - t0)
      const x = CX + a * Math.cos(t)
      const y = CY + b * Math.sin(t)
      // titik Chrome tampak sedikit lebih kecil dari lebar border (hasil ukur ≈ 6.4px untuk 7px)
      ctx.moveTo(x + d * 0.46, y)
      ctx.arc(x, y, d * 0.46, 0, Math.PI * 2)
    }
  }
  ctx.fill()
}

/** latar dinding + bingkai + bagian cermin yang tergambar di bawah foto */
function scene(ctx: Ctx, W: number, H: number) {
  box(ctx, 0, 0, W, H, BG)
  // garis 2px tiap 180px
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  for (let x = 0; x < W; x += 180) ctx.fillRect(x, 0, 2, H)
  // pola elips: radial-gradient(ellipse 10px 16px) tile 90x120 mulai 45px 60px, lalu ellipse 22px 34px tile 90x120
  ctx.beginPath()
  for (let x = 0; x <= W; x += 90) for (let y = 0; y <= H; y += 120) {
    ctx.moveTo(x + 6.1, y)
    ctx.ellipse(x, y, 6.1, 9.76, 0, 0, Math.PI * 2)
  }
  ctx.fillStyle = 'rgba(201,162,74,0.06)'
  ctx.fill()
  ctx.beginPath()
  for (let x = 45; x < W + 45; x += 90) for (let y = 60; y < H + 60; y += 120) {
    ctx.moveTo(x + 13.42, y)
    ctx.ellipse(x, y, 13.42, 20.74, 0, 0, Math.PI * 2)
  }
  ctx.fillStyle = 'rgba(201,162,74,0.07)'
  ctx.fill()

  ellipseGradient(ctx, 0, 0, W, H, 0.5, 0.55, [
    [0, 'rgba(0,0,0,0)'],
    [0.45, 'rgba(0,0,0,0)'],
    [1, 'rgba(0,0,0,0.7)'],
  ])
  ellipseGradient(ctx, 0, 0, W, H, 0.18, 0.12, [
    [0, 'rgba(255,190,110,0.28)'],
    [0.45, 'rgba(255,190,110,0)'],
    [1, 'rgba(255,190,110,0)'],
  ])

  // bayangan bingkai: box-shadow 18px 34px 50px rgba(0,0,0,0.75)
  ctx.save()
  const off = 20000
  setShadow(ctx, 18 + off, 34, 50, 'rgba(0,0,0,0.75)')
  ctx.beginPath()
  ellipse(ctx, CX - off, CY, 375, 480)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.restore()

  // bingkai emas 750x960
  ctx.beginPath()
  ellipse(ctx, CX, CY, 375, 480)
  ctx.fillStyle = linear(ctx, 165, 150, 750, 960, 135, METAL)
  ctx.fill()
  ellipseInset(ctx, 375, 480, -8, -10, 14, 'rgba(40,24,6,0.7)')
  ellipseInset(ctx, 375, 480, 6, 8, 10, 'rgba(255,240,190,0.5)')
  ellipseRing(ctx, 375, 480, 3, DARK)

  // cincin gelap 662x872 + garis emas 3px
  ctx.beginPath()
  ellipse(ctx, CX, CY, 331, 436)
  ctx.fillStyle = DARK
  ctx.fill()
  ellipseRing(ctx, 331, 436, 3, '#e8c878')
  // border 7px dotted (kotak 638x848)
  dottedEllipse(ctx, 315.5, 420.5, 7, '#f0d890')
}

/** gradien SVG objectBoundingBox x1=0 y1=0 x2=1 y2=1 di bbox [x0, y0, x1, y1] */
function bboxGradient(ctx: Ctx, [x0, y0, x1, y1]: number[]) {
  const w = x1 - x0
  const h = y1 - y0
  const c = 2 / (1 / (w * w) + 1 / (h * h))
  const g = ctx.createLinearGradient(x0, y0, x0 + c / w, y0 + c / h)
  for (const [o, col] of GD) g.addColorStop(o, col)
  return g
}

/** bbox geometri path (hanya M/L/C/Z absolut), termasuk titik ekstrem kurva */
function bbox(d: string) {
  const tok = d.match(/[MLCZ]|-?[\d.]+/g) ?? []
  let i = 0
  let cmd = ''
  let px = 0
  let py = 0
  const xs: number[] = []
  const ys: number[] = []
  const num = () => Number(tok[i++])
  while (i < tok.length) {
    if (/[MLCZ]/.test(tok[i])) cmd = tok[i++]
    if (cmd === 'Z') continue
    if (cmd === 'M' || cmd === 'L') {
      px = num()
      py = num()
      xs.push(px)
      ys.push(py)
    } else if (cmd === 'C') {
      const p = [px, py, num(), num(), num(), num(), num(), num()]
      for (const [k, arr] of [
        [0, xs],
        [1, ys],
      ] as const) {
        const [a, b, c, e] = [p[k], p[k + 2], p[k + 4], p[k + 6]]
        arr.push(e)
        // titik ekstrem: akar turunan qa·t² + qb·t + qc = 0
        const qa = -a + 3 * b - 3 * c + e
        const qb = 2 * (a - 2 * b + c)
        const qc = b - a
        const roots: number[] = []
        if (Math.abs(qa) < 1e-9) {
          if (Math.abs(qb) > 1e-9) roots.push(-qc / qb)
        } else {
          const disc = qb * qb - 4 * qa * qc
          if (disc >= 0) roots.push((-qb + Math.sqrt(disc)) / (2 * qa), (-qb - Math.sqrt(disc)) / (2 * qa))
        }
        for (const t of roots)
          if (t > 0 && t < 1) arr.push((1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * e)
      }
      px = p[6]
      py = p[7]
    }
  }
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
}

// ornamen dasar (svg 400x180); ornamen lain = skala yang sama
const SCROLL = 'M200 165.6 C 168 126, 120 111.6, 80 126 C 32 140.4, 16 108, 48 86.4 C 80 64.8, 136 79.2, 120 100.8 C 108 115.2, 72 108, 80 93.6'
const LEAF = 'M200 153 C 176 90, 144 54, 104 32.4 C 144 36, 176 57.6, 200 90'
const BUD = 'M120 50.4 C 96 36, 96 18, 128 10.8 C 136 25.2, 144 36, 120 50.4 Z'
const FAN = 'M152 154.8 C 152 54, 248 54, 248 154.8 Z'

function scaled(d: string, sx: number, sy: number) {
  let k = 0
  return d.replace(/-?[\d.]+/g, (n) => {
    const v = Number(n) * (k++ % 2 === 0 ? sx : sy)
    return String(Math.round(v * 1000) / 1000)
  })
}

/** isi svg ornamen selebar w x h di x,y */
function ornament(ctx: Ctx, x: number, y: number, w: number, h: number) {
  const sx = w / 400
  const sy = h / 180
  const pathAt = (d: string) => {
    const p = scaled(d, sx, sy)
    const b = bbox(p)
    return { p, g: bboxGradient(ctx, b) }
  }
  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.rect(0, 0, w, h)
  ctx.clip()
  const half = () => {
    const s = pathAt(SCROLL)
    ctx.save()
    ctx.strokeStyle = s.g
    ctx.lineWidth = h * 0.07
    ctx.lineCap = 'round'
    ctx.stroke(new Path2D(s.p))
    ctx.restore()
    for (const [d, lw] of [
      [LEAF, 1.5],
      [BUD, 1.2],
    ] as const) {
      const l = pathAt(d)
      const path = new Path2D(l.p)
      ctx.fillStyle = l.g
      ctx.fill(path)
      ctx.strokeStyle = '#4a3210'
      ctx.lineWidth = lw
      ctx.stroke(path)
    }
  }
  half()
  ctx.save()
  ctx.translate(w, 0)
  ctx.scale(-1, 1)
  half()
  ctx.restore()
  const f = pathAt(FAN)
  const fan = new Path2D(f.p)
  ctx.fillStyle = f.g
  ctx.fill(fan)
  ctx.strokeStyle = '#4a3210'
  ctx.lineWidth = 2
  ctx.stroke(fan)
  ctx.strokeStyle = '#5a3e14'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let k = 0; k < 7; k++) {
    ctx.moveTo(200 * sx, 154.8 * sy)
    ctx.lineTo((158 + 14 * k) * sx, 39.6 * sy)
  }
  ctx.stroke()
  const r = h * 0.06
  ctx.beginPath()
  ctx.arc(w / 2, h * 0.18, r, 0, Math.PI * 2)
  ctx.fillStyle = bboxGradient(ctx, [w / 2 - r, h * 0.18 - r, w / 2 + r, h * 0.18 + r])
  ctx.fill()
  ctx.strokeStyle = '#4a3210'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.restore()
}

/** filter: drop-shadow(dx dy blur) dari hasil gambar draw() sebagai satu lapisan (offset dalam sistem koordinat aktif) */
function withDropShadow(ctx: Ctx, dx: number, dy: number, blur: number, color: string, draw: (c: Ctx) => void) {
  const layer = document.createElement('canvas')
  layer.width = ctx.canvas.width
  layer.height = ctx.canvas.height
  const c = layer.getContext('2d')!
  c.setTransform(ctx.getTransform())
  draw(c)
  ctx.save()
  setShadow(ctx, dx, dy, blur, color)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.drawImage(layer, 0, 0)
  ctx.restore()
}

export const cerminAntik = dark({
  id: 'dark-cermin-antik',
  name: 'cermin antik',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  placeholder: '#3a3a40',
  // kotak foto desain: filter grayscale(0.35) sepia(0.25) contrast(1.05) → preset hangat klasik
  filter: 'hangat-klasik',
  fonts: ['Cinzel Decorative:700', 'Cormorant Garamond:500i', 'Special Elite'],
  fields: ['nama'],
  // kotak foto persegi; bagian di luar lonjong cermin ditutup lagi di draw.over
  slots: [SLOT],
  draw: {
    under(ctx, { texts, W, H }) {
      scene(ctx, W, H)
      // cermin 608x818: bayangan inset tergambar di bawah foto (tampak di sisa 14px bawah)
      ellipseInset(ctx, 304, 409, 0, 0, 40, 'rgba(0,0,0,0.6)')
      ellipseRing(ctx, 304, 409, 4, '#7a5820')

      // papan nama 300x87
      dropShadow(ctx, 390, 1185, 300, 87, 0, 6, 12, 'rgba(0,0,0,0.5)', 6)
      box(ctx, 390, 1185, 300, 87, linear(ctx, 390, 1185, 300, 87, 135, METAL), 6)
      ctx.beginPath()
      ctx.roundRect(390, 1185, 300, 87, 6)
      ctx.roundRect(392, 1187, 296, 83, 4)
      ctx.fillStyle = DARK
      ctx.fill('evenodd')
      const nama = texts.nama?.trim() ?? ''
      const o = { family: CINZEL, size: 26, align: 'center' as const, maxWidth: 280 }
      txt(ctx, nama, 540, 1200, { ...o, color: 'rgba(255,240,190,0.6)' })
      txt(ctx, nama, 540, 1199, { ...o, color: PLATE_INK })
      txt(ctx, 'cermin, cermin', 540, nama ? 1236 : 1218, { family: 'Cormorant Garamond', size: 18, weight: 500, italic: true, color: PLATE_INK, align: 'center' })
    },
    over(ctx, { W, H }) {
      // pojok kotak foto di luar lonjong: gambar ulang bingkai
      ctx.save()
      ctx.beginPath()
      ctx.rect(SLOT.x - 2, SLOT.y - 2, SLOT.w + 4, SLOT.h + 4)
      ellipse(ctx, CX, CY, 304, 409)
      ctx.clip('evenodd')
      scene(ctx, W, H)
      ctx.restore()

      // isi cermin (overflow hidden lonjong): vinyet, kilau, noda
      ctx.save()
      ctx.beginPath()
      ellipse(ctx, CX, CY, 304, 409)
      ctx.clip()
      ellipseGradient(ctx, 236, 221, 608, 818, 0.5, 0.5, [
        [0, 'rgba(30,22,12,0)'],
        [0.52, 'rgba(30,22,12,0)'],
        [0.78, 'rgba(30,22,12,0.55)'],
        [1, 'rgba(20,14,8,0.85)'],
      ])
      for (const [x, y, w, h, a, stop] of [
        [306, 261, 160, 520, 0.22, 0.55],
        [656, 741, 60, 220, 0.1, 0.6],
      ])
        rotated(ctx, x + w / 2, y + h / 2, 18, () => {
          ctx.beginPath()
          ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
          ctx.fillStyle = linear(ctx, x, y, w, h, 170, [
            [0, `rgba(255,255,255,${a})`],
            [stop, 'rgba(255,255,255,0)'],
            [1, 'rgba(255,255,255,0)'],
          ])
          ctx.fill()
        })
      // filter: blur(Npx) → bayangan kabur dari lingkaran di luar kanvas (shadowBlur = 2 × sigma)
      const off = 20000
      for (const [x, y, s, a, blur] of SPOTS) {
        ctx.save()
        setShadow(ctx, off, 0, blur * 2, `rgba(120,90,50,${a})`)
        ctx.beginPath()
        ctx.arc(x + s / 2 - off, y + s / 2, s / 2, 0, Math.PI * 2)
        ctx.fillStyle = '#000'
        ctx.fill()
        ctx.restore()
      }
      ctx.restore()

      // ornamen (z-index 3) dengan filter drop-shadow (blur filter = deviasi standar → shadowBlur 2×)
      const sh = 'rgba(0,0,0,0.6)'
      withDropShadow(ctx, 4, 8, 12, sh, (c) => ornament(c, 340, 50, 400, 180))
      rotated(ctx, 540, 1107.5, 180, () => withDropShadow(ctx, -4, -8, 12, sh, (c) => ornament(c, 420, 1050, 240, 110)))
      rotated(ctx, 200, 607.5, -90, () => withDropShadow(ctx, 6, 4, 12, sh, (c) => ornament(c, 110, 560, 180, 90)))
      rotated(ctx, 880, 607.5, 90, () => withDropShadow(ctx, -6, 4, 12, sh, (c) => ornament(c, 790, 560, 180, 90)))
    },
  },
})
