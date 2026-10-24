// Gelang Manik — design-reference/bestie-couple/gelang-manik.html (1080x1350, 1 foto)
import { box, dropShadow, linear, radial, rrPath, text, textMid, type Ctx } from '../paint'
import { bestie } from './define'
import { INK, MONO, SERIF, yearOf } from './helpers'

const BG = '#F6D9E3'
const NUNITO = 'Nunito'
/** 46 manik di elips (540, 640) rx 400 ry 470, langkah 360/46 derajat mulai dari atas */
const N = 46
const BEADS = Array.from({ length: N }, (_, i) => {
  const t = (i * 360) / N
  const a = (t * Math.PI) / 180
  return { t, cx: 540 + 400 * Math.sin(a), cy: 640 - 470 * Math.cos(a) }
})
const COLORS = ['#9AD6FF', '#FFE59A', '#C8F0B0', '#E0C8FF', '#FFFFFF', '#FF9ACD']
/** foto: elips 600x740 (border-radius 50%) */
const PX = 240
const PY = 270
const PW = 600
const PH = 740

function ellipsePath(ctx: Ctx, cx: number, cy: number, rx: number, ry: number) {
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
}

/** latar + elips tali gelang + bayangan & cincin putih foto (box-shadow: 0 0 0 10px #fff, 0 14px 30px rgba(0,0,0,0.2)) */
function base(ctx: Ctx, W: number, H: number) {
  box(ctx, 0, 0, W, H, radial(ctx, 540, 607.5, Math.hypot(540, 742.5), [[0, '#ffffff'], [0.75, BG], [1, BG]]))
  ctx.save()
  ctx.beginPath()
  ellipsePath(ctx, 540, 640, 400, 470)
  ctx.lineWidth = 3
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.stroke()
  ctx.restore()
  // bayangan blur: bentuk digambar jauh di luar kanvas, hanya bayangannya yang jatuh di tempat
  ctx.save()
  const off = 20000
  ctx.shadowOffsetX = off
  ctx.shadowOffsetY = 14
  ctx.shadowBlur = 30
  ctx.shadowColor = 'rgba(0,0,0,0.2)'
  ctx.beginPath()
  ellipsePath(ctx, 540 - off, 640, PW / 2, PH / 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.restore()
  ctx.beginPath()
  ellipsePath(ctx, 540, 640, PW / 2 + 10, PH / 2 + 10)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
}

/** box-shadow inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 8px rgba(0,0,0,0.16) pada elips foto */
function ellipseInset(ctx: Ctx) {
  ctx.save()
  ctx.beginPath()
  ellipsePath(ctx, 540, 640, PW / 2, PH / 2)
  ctx.clip()
  ctx.save()
  ctx.shadowOffsetY = 3
  ctx.shadowBlur = 8
  ctx.shadowColor = 'rgba(0,0,0,0.16)'
  ctx.beginPath()
  ctx.rect(0, 0, 1080, 1350)
  ellipsePath(ctx, 540, 640, PW / 2, PH / 2)
  ctx.fillStyle = '#000'
  ctx.fill('evenodd')
  ctx.restore()
  ctx.beginPath()
  ellipsePath(ctx, 540, 640, PW / 2 - 0.5, PH / 2 - 0.5)
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'
  ctx.stroke()
  ctx.restore()
}

/** huruf manik: "BESTIE·NAMA·" tanpa spasi (spasi di nama jadi ·) */
function beadLetters(nama: string | undefined) {
  const n = (nama ?? '').trim().toLocaleUpperCase('id').split(/\s+/).filter(Boolean)
  const chars = (s: string) => Array.from(s)
  if (!n.length) return chars('BESTIE·')
  const full = chars(`BESTIE·${n.join('·')}·`)
  if (full.length <= 30) return full
  const name = chars(`${n.join('·')}·`)
  if (name.length <= 30) return name
  return chars(`${n.map((w) => Array.from(w)[0]).join('·')}·`).slice(0, 30)
}

function letterBead(ctx: Ctx, cx: number, cy: number, deg: number, ch: string) {
  const x = Math.round(cx - 26)
  const y = Math.round(cy - 26)
  ctx.save()
  ctx.translate(x + 26, y + 26)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.translate(-x - 26, -y - 26)
  dropShadow(ctx, x, y, 52, 52, 0, 3, 5, 'rgba(0,0,0,0.25)', 10)
  box(ctx, x, y, 52, 52, linear(ctx, x, y, 52, 52, 160, [[0, '#ffffff'], [1, '#e9e4d8']]), 10)
  // inset 0 -3px 0 rgba(0,0,0,0.08): pita 3px di tepi bawah
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, x, y, 52, 52, 10)
  ctx.clip()
  ctx.beginPath()
  rrPath(ctx, x, y, 52, 52, 10)
  rrPath(ctx, x, y - 3, 52, 52, 10)
  ctx.fillStyle = 'rgba(0,0,0,0.08)'
  ctx.fill('evenodd')
  ctx.restore()
  textMid(ctx, ch, x + 26, y, 52, { family: NUNITO, size: 26, weight: 800, color: '#2a2440', align: 'center' })
  ctx.restore()
}

function roundBead(ctx: Ctx, cx: number, cy: number, color: string) {
  const x = Math.round(cx - 20)
  const y = Math.round(cy - 20)
  dropShadow(ctx, x, y, 40, 40, 0, 3, 4, 'rgba(0,0,0,0.25)', 20)
  // radial-gradient(circle at 35% 30%, #fff, C 55%, rgba(0,0,0,0.2)) farthest-corner
  box(ctx, x, y, 40, 40, radial(ctx, x + 14, y + 12, Math.hypot(26, 28), [[0, '#ffffff'], [0.55, color], [1, 'rgba(0,0,0,0.2)']]), 20)
}

export const gelangManik = bestie({
  id: 'bestie-gelang-manik',
  name: 'gelang manik',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  placeholder: '#ECE8E1',
  fonts: ['DM Serif Display', 'Space Mono:400,700', 'Caveat:700', 'Nunito:800'],
  fields: ['nama', 'nama2', 'tanggal'],
  // kotak foto persegi; di luar elips ditutup lagi di draw.over
  slots: [{ x: PX, y: PY, w: PW, h: PH }],
  draw: {
    under(ctx, { W, H }) {
      base(ctx, W, H)
    },
    over(ctx, { texts, W, H }) {
      // sudut kotak foto di luar elips: gambar ulang latar
      ctx.save()
      ctx.beginPath()
      ctx.rect(PX, PY, PW, PH)
      ellipsePath(ctx, 540, 640, PW / 2, PH / 2)
      ctx.clip('evenodd')
      base(ctx, W, H)
      ctx.restore()
      ellipseInset(ctx)

      const letters = beadLetters(texts.nama)
      BEADS.forEach((b, i) => {
        if (i < letters.length) letterBead(ctx, b.cx, b.cy, Math.round(b.t), letters[i])
        else roundBead(ctx, b.cx, b.cy, COLORS[(i - letters.length) % COLORS.length])
      })

      const names = [texts.nama?.trim(), texts.nama2?.trim()].filter(Boolean).join(' & ')
      text(ctx, names, 540, 1180, { family: SERIF, size: 54, color: INK, align: 'center', maxWidth: 1000 })
      const tahun = yearOf(texts.tanggal)
      text(ctx, tahun ? `DIRONCE SENDIRI · ${tahun}` : 'DIRONCE SENDIRI', 540, 1260, { family: MONO, size: 14, color: INK, align: 'center', letterSpacing: 2.8 })
    },
  },
})
