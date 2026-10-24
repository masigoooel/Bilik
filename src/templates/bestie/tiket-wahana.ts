// Tiket Wahana — design-reference/bestie-couple/tiket-wahana.html (600x1800, 3 foto)
import { box, setShadow, text, type Ctx } from '../paint'
import { ellipseFill, MONO, photoInset, rotated, SERIF } from './helpers'
import { bestie } from './define'

const ACCENT = '#C8323A'
const ANTON = 'Anton'
const TICKETS = [
  { y: 220, no: '0117', seri: '00117', wahana: 'kincir' },
  { y: 720, no: '0217', seri: '00217', wahana: 'komidi putar' },
  { y: 1220, no: '0317', seri: '00317', wahana: 'rumah hantu' },
]
const SLOTS = TICKETS.map((t) => ({ x: 102, y: t.y + 103, w: 396, h: 260 }))
const STARS: [number, number, string][] = [
  [80, 60, '#FFD24A'],
  [200, 90, '#FF5FB7'],
  [380, 50, '#7FD3FF'],
  [520, 100, '#FFD24A'],
  [40, 1750, '#FF5FB7'],
  [560, 1720, '#7FD3FF'],
]
const BULBS = ['#FFD24A', '#FF5FB7', '#7FD3FF']

/** titik bercahaya: lingkaran d px + box-shadow 0 0 blur spread warna sama */
function glow(ctx: Ctx, x: number, y: number, d: number, blur: number, spread: number, color: string) {
  const r = d / 2
  ctx.save()
  const off = 20000
  setShadow(ctx, off, 0, blur, color)
  ctx.beginPath()
  ctx.arc(x + r - off, y + r, r + spread, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.restore()
  box(ctx, x, y, d, d, color, r)
}

/** border 3px dashed seperti Chrome (hasil ukur): dash 2×lebar, jumlah dash = round((len+lebar)/(3×lebar)), celah disesuaikan, posisi pecahan */
function dashedSide(ctx: Ctx, x: number, y: number, len: number, w: number, vertical: boolean) {
  const d = 2 * w
  const n = Math.round((len + w) / (d + w))
  const gap = (len - n * d) / (n - 1)
  for (let i = 0; i < n; i++) {
    const at = i * (d + gap)
    if (vertical) ctx.fillRect(x, y + at, w, d)
    else ctx.fillRect(x + at, y, d, w)
  }
}
function dashedFrame(ctx: Ctx, x: number, y: number, w: number, h: number, bw: number, color: string) {
  ctx.save()
  ctx.fillStyle = color
  dashedSide(ctx, x, y, w, bw, false)
  dashedSide(ctx, x, y + h - bw, w, bw, false)
  dashedSide(ctx, x, y, h, bw, true)
  dashedSide(ctx, x + w - bw, y, h, bw, true)
  ctx.restore()
}

/** border-top 3px dotted (hasil ukur Chrome, panjang 440): titik persegi di 0, lalu 5 + 6k sampai ujung */
function dottedLine(ctx: Ctx, x: number, y: number, len: number, w: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, w)
  for (let at = 5; at + w <= len; at += 2 * w) ctx.fillRect(x + at, y, w, w)
}

/** sambungan antar tiket: strip warna (opacity 0.8, berisi garis titik) */
let stripCanvas: HTMLCanvasElement | null = null
function strip(ctx: Ctx, y: number) {
  if (!stripCanvas) {
    stripCanvas = document.createElement('canvas')
    stripCanvas.width = 480
    stripCanvas.height = 30
    const s = stripCanvas.getContext('2d')!
    s.fillStyle = ACCENT
    s.fillRect(0, 0, 480, 30)
    dottedLine(s, 20, 13.5, 440, 3, 'rgba(255,255,255,0.7)')
  }
  ctx.save()
  ctx.globalAlpha = 0.8
  ctx.drawImage(stripCanvas, 60, y)
  ctx.restore()
}

/** badan tiket: clip-path polygon dengan takik kiri-kanan di 46–54% tinggi */
function ticketShape(ctx: Ctx, y: number) {
  const x = 60
  const w = 480
  const h = 470
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w, y)
  ctx.lineTo(x + w, y + h * 0.46)
  ctx.lineTo(x + w * 0.96, y + h * 0.5)
  ctx.lineTo(x + w, y + h * 0.54)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x, y + h)
  ctx.lineTo(x, y + h * 0.54)
  ctx.lineTo(x + w * 0.04, y + h * 0.5)
  ctx.lineTo(x, y + h * 0.46)
  ctx.closePath()
}

export const tiketWahana = bestie({
  id: 'bestie-tiket-wahana',
  name: 'tiket wahana',
  width: 600,
  height: 1800,
  photoCount: 3,
  background: { type: 'solid', color: '#120c1c' },
  placeholder: '#f6e6d6',
  fonts: ['DM Serif Display', 'Space Mono:400,700', 'Anton'],
  fields: ['nama', 'nama2', 'tanggal'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts, W, H }) {
      ellipseFill(ctx, W, H, 0.5, 0.2, [[0, '#2a1e3a'], [0.7, '#120c1c'], [1, '#120c1c']])
      for (const [x, y, c] of STARS) glow(ctx, x, y, 8, 12, 4, c)

      // judul bercahaya (text-shadow 0 0 16px)
      ctx.save()
      ctx.shadowColor = 'rgba(255,210,100,0.6)'
      ctx.shadowBlur = 16
      text(ctx, 'pasar malam', 300, 70, { family: SERIF, size: 54, color: '#FFE6A0', align: 'center' })
      ctx.restore()
      const names = [texts.nama?.trim(), texts.nama2?.trim()].filter(Boolean).join(' & ')
      const sub = [names, texts.tanggal?.trim()].filter(Boolean).join(' · ')
      text(ctx, sub, 300, 140, { family: MONO, size: 13, color: '#d9c9e9', align: 'center', maxWidth: 520 })

      for (const t of TICKETS) {
        // box-shadow ikut terpotong clip-path, jadi tidak tampak
        ticketShape(ctx, t.y)
        ctx.fillStyle = ACCENT
        ctx.fill()
        dashedFrame(ctx, 82, t.y + 22, 436, 426, 3, 'rgba(255,255,255,0.7)')
        const head = { family: ANTON, size: 34, color: '#ffffff', letterSpacing: 2.72 }
        text(ctx, 'ADMIT ONE', 99, t.y + 39, head)
        text(ctx, `№ ${t.no}`, 501, t.y + 39, { ...head, align: 'right' })
        box(ctx, 99, t.y + 100, 402, 266, '#ffffff')
        const foot = { family: MONO, size: 14, color: '#ffffff' }
        text(ctx, `wahana: ${t.wahana}`, 99, t.y + 376, foot)
        text(ctx, '2 orang', 501, t.y + 376, { ...foot, align: 'right' })
      }
      for (const y of [690, 1190]) strip(ctx, y)

      // untaian lampu di atas
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(0, 10)
      ctx.quadraticCurveTo(300, 50, 600, 10)
      ctx.lineWidth = 2
      ctx.strokeStyle = '#5a4a6a'
      ctx.stroke()
      ctx.restore()
      for (let i = 0; i < 15; i++) glow(ctx, 20 + i * 40, 20, 10, 10, 3, BULBS[i % 3])
    },
    over(ctx) {
      for (const s of SLOTS) photoInset(ctx, s.x, s.y, s.w, s.h)
      // nomor seri tegak (rotate 90deg di kiri atas), menimpa tepi foto
      for (const t of TICKETS)
        rotated(ctx, 470, t.y + 20, 90, () =>
          text(ctx, `SERI A · ${t.seri} · TIDAK DAPAT DIUANGKAN`, 470, t.y + 20, { family: MONO, size: 11, color: 'rgba(255,255,255,0.85)' }),
        )
    },
  },
})
