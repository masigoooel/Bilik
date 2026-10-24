// Pilih Lintasan — design-reference/gaming-pixel/pilih-lintasan.html (1200x1800, 6 foto)
// Kartu: skewX(-6deg) + overflow hidden; isinya diluruskan lagi (skewX(6deg) scale(1.08)).
// Slot = isi kartu yang diperbesar 1.08 (540x324); bagian slot di luar jajaran genjang kartu digambar ulang di draw.over.
import { box, linear, measure, svg, text, type Ctx } from '../paint'
import { ellipseGradient, fauxItalic, slotInset, spread } from './helpers'
import { gaming } from './define'

/** warna aksen desain (prop c, default) */
const C = '#ff3ea5'
const YELLOW = '#FFD24A'
const LILAC = '#c9b9ff'
const RUSSO = '"Russo One", sans-serif'
const ORB = '"Orbitron", sans-serif'
const TAN = Math.tan((6 * Math.PI) / 180)
const SCALE = 1.08

type Card = { x: number; y: number; name: string; tint: string; stars: number; lap: string; track: string; active?: boolean }
const CARDS: Card[] = [
  { x: 80, y: 300, name: 'PANTAI', tint: 'rgba(255,140,60,0.35)', stars: 2, lap: '3 LAP · 1:42.17', track: 'M20 60 C 20 20, 60 10, 80 30 S 110 70, 90 85 S 40 95, 20 60 Z' },
  { x: 620, y: 300, name: 'KOTA MALAM', tint: 'rgba(120,60,255,0.35)', stars: 3, lap: '4 LAP · 2:05.88', track: 'M15 30 H 90 V 55 H 50 V 85 H 15 Z', active: true },
  { x: 80, y: 636, name: 'GUNUNG', tint: 'rgba(60,160,120,0.3)', stars: 4, lap: '3 LAP · 2:31.04', track: 'M20 80 C 30 20, 50 70, 60 30 S 90 10, 95 50 S 70 95, 20 80 Z' },
  { x: 620, y: 636, name: 'GURUN', tint: 'rgba(255,200,80,0.35)', stars: 2, lap: '5 LAP · 1:58.40', track: 'M15 50 C 15 15, 95 15, 95 50 C 95 85, 15 85, 15 50 Z' },
  { x: 80, y: 972, name: 'SALJU', tint: 'rgba(160,220,255,0.35)', stars: 5, lap: '3 LAP · 2:47.92', track: 'M20 20 L 90 30 L 70 60 L 95 85 L 25 80 L 40 50 Z' },
  { x: 620, y: 972, name: 'SIRKUIT', tint: 'rgba(255,60,90,0.3)', stars: 3, lap: '6 LAP · 1:33.61', track: 'M15 40 C 15 15, 50 15, 55 40 S 95 25, 95 55 S 60 90, 35 80 S 15 65, 15 40 Z' },
]
/** garis kecepatan latar: [x, y, lebar, alpha] (tinggi 3px) */
const STREAKS: [number, number, number, number][] = [
  [-29, 1209, 208, 0.2], [1189, 330, 325, 0.19], [701, 953, 354, 0.18], [299, 384, 309, 0.18], [245, 1620, 230, 0.13],
  [-15, 1569, 164, 0.18], [1197, 918, 398, 0.16], [590, 1141, 298, 0.13], [1137, 1778, 400, 0.13], [494, 367, 316, 0.16],
  [951, 1696, 229, 0.19], [-110, 1069, 150, 0.19], [674, 376, 395, 0.1], [906, 892, 332, 0.16], [380, 1072, 300, 0.17],
  [1038, 1785, 347, 0.16], [500, 922, 223, 0.16], [710, 1614, 300, 0.09], [648, 367, 382, 0.19], [247, 1067, 195, 0.15],
  [638, 95, 124, 0.18], [467, 1105, 201, 0.08], [1020, 853, 124, 0.19], [832, 614, 227, 0.12], [16, 832, 238, 0.11],
  [850, 865, 227, 0.13], [384, 1634, 389, 0.19], [348, 1626, 211, 0.09], [47, 1264, 331, 0.18], [2, 928, 330, 0.12],
  [745, 1288, 288, 0.14], [876, 867, 226, 0.2], [1093, 541, 214, 0.16], [-94, 1422, 321, 0.09], [128, 410, 386, 0.13],
  [512, 1709, 285, 0.14], [44, 535, 265, 0.12], [261, 1545, 182, 0.09], [708, 446, 198, 0.17], [443, 31, 199, 0.17],
]

const slotRect = (c: Card) => ({ x: c.x + 250 - 270, y: c.y + 150 - 162, w: 540, h: 324 })

/** jajaran genjang skewX(-6deg) untuk kotak x,y,w,h (titik asal transform di tengah) */
function paraPath(ctx: Ctx, x: number, y: number, w: number, h: number, grow = 0) {
  const d = TAN * (h / 2 + grow)
  ctx.moveTo(x - grow + d, y - grow)
  ctx.lineTo(x + w + grow + d, y - grow)
  ctx.lineTo(x + w + grow - d, y + h + grow)
  ctx.lineTo(x - grow - d, y + h + grow)
  ctx.closePath()
}

/** transform skewX(-6deg) di titik tengah kotak */
function skewed(ctx: Ctx, cx: number, cy: number, fn: () => void) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.transform(1, 0, -TAN, 1, 0, 0)
  ctx.translate(-cx, -cy)
  fn()
  ctx.restore()
}

/** latar halaman: radial + garis kecepatan + garis scan */
function page(ctx: Ctx, W: number, H: number) {
  ellipseGradient(ctx, 0, 0, W, H, 0.5, -0.1, [[0, C], [0.35, '#2a0a4a'], [0.75, '#08060f'], [1, '#08060f']])
  for (const [x, y, w, a] of STREAKS) {
    box(ctx, x, y, w, 3, linear(ctx, x, y, w, 3, 90, [[0, 'rgba(255,255,255,0)'], [0.5, `rgba(255,255,255,${a})`], [1, 'rgba(255,255,255,0)']]))
  }
  // repeating-linear-gradient(0deg, putih 0.025 0 2px, transparan 2px 4px) dari bawah
  ctx.fillStyle = 'rgba(255,255,255,0.025)'
  for (let y = H - 2; y > -2; y -= 4) ctx.fillRect(0, y, W, 2)
}

/** box-shadow kartu (di luar jajaran genjang): ring 3px putih / kartu aktif ring 5px kuning + glow 40px */
function cardFrame(ctx: Ctx, c: Card) {
  const cx = c.x + 250
  const cy = c.y + 150
  if (c.active) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, 1200, 1800)
    paraPath(ctx, c.x, c.y, 500, 300)
    ctx.clip('evenodd')
    // bentuk digambar jauh di luar; hanya bayangannya yang jatuh di kartu
    ctx.shadowOffsetX = -10000
    ctx.shadowBlur = 40
    ctx.shadowColor = 'rgba(255,210,74,0.6)'
    ctx.beginPath()
    paraPath(ctx, c.x + 10000, c.y, 500, 300)
    ctx.fillStyle = '#000'
    ctx.fill()
    ctx.restore()
  }
  skewed(ctx, cx, cy, () => spread(ctx, c.x, c.y, 500, 300, c.active ? 5 : 3, c.active ? YELLOW : 'rgba(255,255,255,0.25)'))
}

/** isi kartu yang tergambar di atas foto (dalam bingkai lurus yang diperbesar 1.08) */
function cardOverlay(ctx: Ctx, c: Card) {
  const { x, y } = c
  ctx.save()
  ctx.beginPath()
  paraPath(ctx, x, y, 500, 300)
  ctx.clip()
  ctx.translate(x + 250, y + 150)
  ctx.scale(SCALE, SCALE)
  ctx.translate(-x - 250, -y - 150)

  slotInset(ctx, x, y, 500, 300)
  box(ctx, x, y, 500, 300, linear(ctx, x, y, 500, 300, 180, [[0, c.tint], [0.4, c.tint.replace(/[\d.]+\)$/, '0)')], [0.4, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.75)']]))
  // ikon lintasan: svg 90x80, viewBox 110x100 (meet → 88x80 di tengah)
  box(ctx, x + 397, y + 14, 88, 80, 'rgba(0,0,0,0.55)', 8)
  svg(ctx, c.track, x + 397, y + 14, 88, 80, 110, 100, { stroke: '#fff', lineWidth: 5, lineJoin: 'round' })

  const tag = `STAGE 0${CARDS.indexOf(c) + 1}`
  const tw = measure(ctx, tag, { family: ORB, size: 14, weight: 900 })
  box(ctx, x + 16, y + 14, tw + 20, 25, c.active ? YELLOW : 'rgba(0,0,0,0.6)')
  text(ctx, tag, x + 26, y + 18, { family: ORB, size: 14, weight: 900, color: c.active ? '#111111' : '#ffffff' })

  const no = { family: RUSSO, size: 34, maxWidth: 468 }
  fauxItalic(ctx, c.name, x + 18, y + 208, { ...no, color: '#000000' })
  fauxItalic(ctx, c.name, x + 16, y + 206, { ...no, color: '#ffffff' })
  for (let k = 0; k < 5; k++) {
    text(ctx, '◆', x + 16 + k * 12, y + 269, { family: `${ORB}, monospace`, size: 13, weight: 700, color: k < c.stars ? YELLOW : 'rgba(255,255,255,0.25)' })
  }
  text(ctx, c.lap, x + 484, y + 269, { family: ORB, size: 13, weight: 700, color: '#e9e9ef', align: 'right' })
  if (c.active) {
    box(ctx, x, y, 500, 300, linear(ctx, x, y, 500, 300, 115, [
      [0, 'rgba(255,255,255,0)'], [0.3, 'rgba(255,255,255,0)'], [0.42, 'rgba(255,255,255,0.22)'], [0.54, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)'],
    ]))
  }
  ctx.restore()
}

export const pilihLintasan = gaming({
  id: 'gaming-pilih-lintasan',
  name: 'pilih lintasan',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#08060f' },
  placeholder: '#2A2A44',
  fonts: ['Russo One', 'Orbitron:700,900', 'Space Mono:400,700'],
  fields: ['nama', 'tanggal'],
  slots: CARDS.map(slotRect),
  draw: {
    under(ctx, { texts, W, H }) {
      page(ctx, W, H)

      const hud = { family: `${ORB}, monospace`, size: 18, weight: 700, color: LILAC }
      text(ctx, '◀ L1', 60, 61, hud)
      text(ctx, 'MODE: BALAP BEBAS', 600, 61, { ...hud, align: 'center' })
      text(ctx, 'R1 ▶', 1140, 61, { ...hud, align: 'right' })

      // judul: gradien teks + drop-shadow(4px 6px 0 rgba(0,0,0,0.6)), italic sintetis
      const t = { family: RUSSO, size: 110, align: 'center' as const }
      fauxItalic(ctx, 'PILIH LINTASAN', 604, 114, { ...t, color: 'rgba(0,0,0,0.6)' })
      const g = linear(ctx, 0, 108, W, 133, 180, [[0, '#ffffff'], [0.4, '#ffe9a0'], [0.6, '#ff8a3c'], [1, '#ff3ea5']])
      fauxItalic(ctx, 'PILIH LINTASAN', 600, 108, { ...t, color: g as unknown as string })
      box(ctx, 0, 250, W, 6, linear(ctx, 0, 250, W, 6, 90, [[0, 'rgba(255,210,74,0)'], [1 / 3, YELLOW], [2 / 3, C], [1, 'rgba(255,62,165,0)']]))

      for (const c of CARDS) {
        cardFrame(ctx, c)
        ctx.beginPath()
        paraPath(ctx, c.x, c.y, 500, 300)
        ctx.fillStyle = '#0a0a14'
        ctx.fill()
      }

      // panel pembalap: skewX(-6deg)
      skewed(ctx, 600, 1555, () => {
        box(ctx, 60, 1430, 1080, 250, linear(ctx, 60, 1430, 1080, 250, 90, [[0, 'rgba(10,10,20,0.85)'], [1, 'rgba(40,10,60,0.85)']]))
        ctx.save()
        ctx.beginPath()
        ctx.rect(60, 1430, 1080, 250)
        ctx.rect(63, 1433, 1074, 244)
        ctx.fillStyle = 'rgba(255,210,74,0.5)'
        ctx.fill('evenodd')
        ctx.restore()
      })
      const nama = texts.nama?.trim()
      text(ctx, 'PEMBALAP', 100, 1506, { family: ORB, size: 14, weight: 700, color: LILAC })
      fauxItalic(ctx, nama || 'PEMAIN 1', 100, 1531, { family: RUSSO, size: 40, color: '#ffffff', maxWidth: 352 })
      // [MOBIL] tanpa field: nama mobil tetap
      text(ctx, 'MOBIL: KILAT · NO. 17', 100, 1587, { family: ORB, size: 14, weight: 700, color: YELLOW, maxWidth: 352 })
      ;[
        ['KECEPATAN', 0.88],
        ['AKSELERASI', 0.72],
        ['HANDLING', 0.64],
      ].forEach(([label, v], i) => {
        const y = 1498.5 + i * 41
        text(ctx, label as string, 482.5, y, { family: ORB, size: 12, weight: 700, color: LILAC })
        box(ctx, 482.5, y + 19, 293.8, 12, 'rgba(255,255,255,0.12)')
        const w = 293.8 * (v as number)
        box(ctx, 482.5, y + 19, w, 12, linear(ctx, 482.5, y + 19, w, 12, 90, [[0, YELLOW], [1, C]]))
      })
      box(ctx, 861.7, 1514.5, 182.8, 67, '#9a7a1a')
      box(ctx, 861.7, 1508.5, 182.8, 67, YELLOW)
      text(ctx, '✕ MULAI', 953.1, 1526.5, { family: `${ORB}, sans-serif`, size: 26, weight: 900, color: '#111111', align: 'center' })
      text(ctx, '○ KEMBALI', 953.1, 1585.5, { family: `${ORB}, sans-serif`, size: 13, weight: 700, color: LILAC, align: 'center' })

      // skor: "SKOR TERBAIK: [NAMA]" + tanggal, flex center gap 40
      const f = { family: ORB, size: 14, weight: 700, color: '#9a8acb' }
      const a = nama ? `SKOR TERBAIK: ${nama}` : 'SKOR TERBAIK'
      const b = texts.tanggal?.trim() ?? ''
      const wa = Math.min(measure(ctx, a, f), 700)
      const wb = b ? measure(ctx, b, f) : 0
      const x0 = 600 - (wa + (b ? 40 + wb : 0)) / 2
      text(ctx, a, x0, 1720, { ...f, maxWidth: 700 })
      if (b) text(ctx, b, x0 + wa + 40, 1720, f)
    },
    over(ctx, { W, H }) {
      // bagian slot di luar kartu: latar halaman + bingkai kartu, digambar ulang
      ctx.save()
      ctx.beginPath()
      for (const c of CARDS) {
        const r = slotRect(c)
        ctx.rect(r.x, r.y, r.w, r.h)
      }
      ctx.clip()
      ctx.beginPath()
      ctx.rect(0, 0, W, H)
      for (const c of CARDS) paraPath(ctx, c.x, c.y, 500, 300)
      ctx.clip('evenodd')
      page(ctx, W, H)
      ctx.restore()

      CARDS.forEach((c, i) => {
        // bingkai/glow kartu ini: di dalam area slot saja, tidak menimpa kartu berikutnya (urutan DOM)
        ctx.save()
        ctx.beginPath()
        for (const s of CARDS) {
          const r = slotRect(s)
          ctx.rect(r.x, r.y, r.w, r.h)
        }
        ctx.clip()
        ctx.beginPath()
        ctx.rect(0, 0, W, H)
        CARDS.slice(i + 1).forEach((n) => paraPath(ctx, n.x, n.y, 500, 300))
        ctx.clip('evenodd')
        cardFrame(ctx, c)
        ctx.restore()
        cardOverlay(ctx, c)
      })
    },
  },
})
