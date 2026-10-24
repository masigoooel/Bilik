// Badan Hewan — design-reference/meme-lucu/badan-hewan.html (1200x1800, 6 foto)
import { border, box, linear, rrPath, svgPath, text, type Ctx } from '../paint'
import { ANTON, MONO, photoInset } from './helpers'
import { ART, type Art } from './badan-hewan-art'
import { meme } from './define'

const INK = '#111111'
/** ilustrasi 500x500 diperkecil scale(0.78) dari tengah atas */
const K = 0.78

/** kartu 531x504 (grid 2 kolom, jarak 18): warna latar, judul, keterangan, lubang foto (ruang ilustrasi) */
const CARDS = [
  { color: '#FBE6D4', title: 'versi kucing', sub: 'mode malas', hole: [152, 87, 196] },
  { color: '#E6EEF6', title: 'versi anjing', sub: 'pas dipanggil makan', hole: [152, 87, 196] },
  { color: '#E3F1DA', title: 'versi katak', sub: 'nunggu foto jadi', hole: [152, 87, 196] },
  { color: '#FFF4C8', title: 'versi bebek', sub: 'jalan bareng', hole: [152, 87, 196] },
  { color: '#F0E6DA', title: 'versi kapibara', sub: 'tenang aja', hole: [155, 95, 190] },
  { color: '#ECE4F6', title: 'versi burung hantu', sub: 'begadang', hole: [152, 87, 196] },
].map((c, i) => {
  const x = 60 + (i % 2) * 549
  // sisi atas kartu di desain 151.6 + 522n; Chrome membulatkan lapisan ilustrasi (scale 0.78) ke piksel penuh:
  // kartu di y bulat, ilustrasi di x + 71 (bukan 70.5) supaya garisnya jatuh di piksel yang sama
  const y = 152 + Math.floor(i / 2) * 522
  return { ...c, x, y, ax: x + 71, ay: y + 18, art: ART[i] }
})
const CW = 531
const CH = 504

/** gambar ulang <svg> ilustrasi: koordinat ruang 500x500, transform aktif sudah diskalakan */
function drawArt(ctx: Ctx, art: Art, layers: Art['layers']) {
  for (const l of layers) {
    ctx.save()
    ctx.translate(l.x, l.y)
    // <svg> inline memotong isi di luar viewport
    ctx.beginPath()
    ctx.rect(0, 0, l.w, l.h)
    ctx.clip()
    for (const s of l.shapes) {
      ctx.save()
      if (s.rot) {
        const [a, cx, cy] = s.rot
        ctx.translate(cx, cy)
        ctx.rotate((a * Math.PI) / 180)
        ctx.translate(-cx, -cy)
      }
      if (s.op !== undefined) ctx.globalAlpha = s.op
      let path: Path2D
      if (s.p) path = svgPath(s.p)
      else {
        path = new Path2D()
        if (s.e) path.ellipse(s.e[0], s.e[1], s.e[2], s.e[3], 0, 0, Math.PI * 2)
        else if (s.c) path.arc(s.c[0], s.c[1], s.c[2], 0, Math.PI * 2)
        else if (s.r) path.roundRect(s.r[0], s.r[1], s.r[2], s.r[3], s.r[4] ?? 0)
      }
      if (s.g && s.bb) {
        // radialGradient cx 35% cy 30% r 75% objectBoundingBox: lingkaran di ruang kotak pembatas
        const [bx, by, bw, bh] = s.bb
        ctx.save()
        ctx.clip(path)
        ctx.transform(bw, 0, 0, bh, bx, by)
        const g = ctx.createRadialGradient(0.35, 0.3, 0, 0.35, 0.3, 0.75)
        for (const [o, c] of art.grads[s.g]) g.addColorStop(o, c)
        ctx.fillStyle = g
        ctx.fillRect(-2, -2, 5, 5)
        ctx.restore()
      } else if (s.f) {
        ctx.fillStyle = s.f
        ctx.fill(path)
      }
      if (s.s) {
        ctx.strokeStyle = s.s
        ctx.lineWidth = s.w ?? 1
        ctx.lineCap = (s.cap as CanvasLineCap) ?? 'butt'
        ctx.lineJoin = (s.join as CanvasLineJoin) ?? 'miter'
        ctx.stroke(path)
      }
      ctx.restore()
    }
    ctx.restore()
  }
}

/** masuk ke ruang ilustrasi kartu (translate + scale 0.78) */
function inArt(ctx: Ctx, c: (typeof CARDS)[number], draw: () => void) {
  ctx.save()
  ctx.translate(c.ax, c.ay)
  ctx.scale(K, K)
  draw()
  ctx.restore()
}

export const badanHewan = meme({
  id: 'meme-badan-hewan',
  name: 'badan hewan',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#FFFFFF' },
  placeholder: '#E8E6E0',
  fonts: ['Anton', 'Space Mono:400,700'],
  fields: ['nama', 'tanggal'],
  slots: CARDS.map((c) => {
    const [hx, hy, hd] = c.hole
    const d = hd * K
    return { x: c.ax + hx * K, y: c.ay + hy * K, w: d, h: d, radius: d / 2 }
  }),
  draw: {
    under(ctx, { texts }) {
      // kepala: judul + @[USER] (→ nama) & tanggal rata kanan-bawah, garis bawah 3px
      text(ctx, 'kalau kita jadi hewan', 60, 31, { family: ANTON, size: 68, color: INK })
      const user = texts.nama?.trim().replace(/\s+/g, '').replace(/^@/, '')
      const right = [user && `@${user}`, texts.tanggal?.trim()].filter(Boolean) as string[]
      right.forEach((s, i) => text(ctx, s, 1140, 114.6 - (right.length - i) * 20, { family: MONO, size: 13, color: INK, align: 'right', maxWidth: 380 }))
      box(ctx, 60, 126.59375, 1080, 3, '#1c1b19')

      for (const c of CARDS) {
        ctx.save()
        ctx.beginPath()
        rrPath(ctx, c.x, c.y, CW, CH, 22)
        ctx.clip()
        // radial-gradient(ellipse at 50% 30%, #fff 0, warna 65%): farthest-corner = farthest-side × √2
        ctx.save()
        const gx = CW / 2
        const gy = CH * 0.3
        const rx = Math.max(gx, CW - gx) * Math.SQRT2
        const ry = Math.max(gy, CH - gy) * Math.SQRT2
        ctx.translate(c.x + gx, c.y + gy)
        ctx.scale(rx, ry)
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
        g.addColorStop(0, '#ffffff')
        g.addColorStop(0.65, c.color)
        g.addColorStop(1, c.color)
        ctx.fillStyle = g
        ctx.fillRect(-gx / rx, -gy / ry, CW / rx, CH / ry)
        ctx.restore()
        // box-shadow inset 0 0 0 2px rgba(0,0,0,0.06)
        border(ctx, c.x, c.y, CW, CH, 2, 'rgba(0,0,0,0.06)', 22)
        // bayangan bawah 120px: linear-gradient(transparent, rgba(0,0,0,0.05))
        box(ctx, c.x, c.y + CH - 120, CW, 120, linear(ctx, c.x, c.y + CH - 120, CW, 120, 180, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.05)']]))

        inArt(ctx, c, () => {
          drawArt(ctx, c.art, c.art.layers.slice(0, 1))
          // lubang foto: box-shadow 0 0 0 4px rgba(255,255,255,0.7), 0 0 0 7px #3a2a1e
          const [hx, hy, hd] = c.hole
          const r = hd / 2
          const ring = (r0: number, r1: number, color: string) => {
            ctx.beginPath()
            ctx.arc(hx + r, hy + r, r1, 0, Math.PI * 2)
            ctx.arc(hx + r, hy + r, r0, 0, Math.PI * 2, true)
            ctx.fillStyle = color
            ctx.fill()
          }
          ring(r, r + 7, '#3a2a1e')
          ring(r, r + 4, 'rgba(255,255,255,0.7)')
          // aksesori (svg terpisah sesudah lubang foto)
          drawArt(ctx, c.art, c.art.layers.slice(1))
        })
        ctx.restore()

        text(ctx, c.title, c.x + CW / 2, c.y + 421, { family: ANTON, size: 36, color: '#1c1b19', align: 'center' })
        text(ctx, c.sub, c.x + CW / 2, c.y + 468, { family: MONO, size: 13, color: '#6b6760', align: 'center' })
      }
    },
    over(ctx) {
      for (const c of CARDS) {
        inArt(ctx, c, () => {
          const [hx, hy, hd] = c.hole
          ctx.save()
          ctx.beginPath()
          ctx.arc(hx + hd / 2, hy + hd / 2, hd / 2, 0, Math.PI * 2)
          ctx.clip()
          photoInset(ctx, hx, hy, hd, hd)
          ctx.restore()
        })
      }
    },
  },
})
