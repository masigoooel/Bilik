// Messenger Gel — design-reference/y2k-aesthetic/messenger-gel.html (1200x1800, 6 foto)
import { border, box, contentHeight, dropShadow, ICON_BBOX, ICONS, linear, measure, metalGradient, radial, rrPath, svg, text, type Ctx } from '../paint'
import { y2k } from './define'
import { detailSheen, photoInset } from './helpers'

const NAVY = '#0e3a5a'
const INK = '#1f2a44'
const GEL: [number, string][] = [[0, '#bfeaff'], [0.48, '#6cc8ff'], [0.52, '#3aa8f0'], [1, '#8fdcff']]
const CARDS = [266, 686, 1106].flatMap((y) => [80, 615].map((x) => ({ x, y })))

/** lampu bulat mengilap: radial-gradient(circle at 35% 30%, #fff 0, warna 55%) + border 1px */
function light(ctx: Ctx, x: number, y: number, color: string) {
  const px = x + 1 + 22 * 0.35
  const py = y + 1 + 22 * 0.3
  const r = Math.hypot(Math.max(px - x - 1, x + 23 - px), Math.max(py - y - 1, y + 23 - py))
  box(ctx, x, y, 24, 24, radial(ctx, px, py, r, [[0, '#ffffff'], [0.55, color], [1, color]]), 12)
  border(ctx, x, y, 24, 24, 1, 'rgba(0,0,0,0.3)', 12)
}

/** kartu gel: bayangan biru lembut, isi putih transparan, tepi putih, bilah judul mengilap (terpotong radius) */
function gelCard(ctx: Ctx, x: number, y: number, w: number, h: number, r: number, barH: number, fill: string) {
  dropShadow(ctx, x, y, w, h, 0, 8, 20, 'rgba(60,80,160,0.2)', r)
  box(ctx, x, y, w, h, fill, r)
  ctx.save()
  ctx.beginPath()
  rrPath(ctx, x + 2, y + 2, w - 4, h - 4, r - 2)
  ctx.clip()
  box(ctx, x + 2, y + 2, w - 4, barH, linear(ctx, x + 2, y + 2, w - 4, barH, 180, GEL))
  ctx.restore()
  border(ctx, x, y, w, h, 2, '#ffffff', r)
}

function metal(ctx: Ctx, icon: 'heart' | 'star', x: number, y: number, size: number, rotate: number) {
  svg(ctx, ICONS[icon], x, y, size, size, 24, 24, { fill: metalGradient(ctx, ICON_BBOX[icon]), stroke: '#6b717a', lineWidth: 0.5, lineJoin: 'round', rotate })
}

export const messengerGel = y2k({
  id: 'y2k-messenger-gel',
  name: 'messenger gel',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'linear', angle: 135, stops: [[0, '#F6D6EC'], [0.3, '#D6E4FA'], [0.55, '#DDF6EA'], [0.78, '#F8F0D2'], [1, '#E6D6F8']] },
  placeholder: '#EEF2FA',
  fonts: ['Silkscreen', 'Unbounded:800'],
  fields: ['nama', 'nama2', 'catatan', 'tanggal'],
  slots: CARDS.map((c) => ({ x: c.x + 14, y: c.y + 56, w: 477, h: 320, radius: 12 })),
  draw: {
    under(ctx, { texts }) {
      const nama = texts.nama?.trim() ?? ''
      // kilau putih di kiri atas (radial-gradient circle at 15% 10%, 25% farthest-corner)
      box(ctx, 0, 0, 1200, 1800, radial(ctx, 180, 180, Math.hypot(1020, 1620) * 0.25, [[0, 'rgba(255,255,255,0.8)'], [1, 'rgba(255,255,255,0)']]))

      // kepala percakapan
      gelCard(ctx, 80, 70, 1040, 166, 26, 50, 'rgba(0,0,0,0)')
      ctx.save()
      ctx.beginPath()
      rrPath(ctx, 82, 72, 1036, 162, 24)
      ctx.clip()
      box(ctx, 82, 122, 1036, 112, 'rgba(255,255,255,0.8)')
      ctx.restore()
      border(ctx, 80, 70, 1040, 166, 2, '#ffffff', 26)
      text(ctx, nama ? `${nama} — percakapan` : 'percakapan', 100, 85, { family: 'Silkscreen', size: 18, color: NAVY, maxWidth: 880 })
      light(ctx, 1012, 85, '#7CE07C')
      light(ctx, 1044, 85, '#ffd34d')
      light(ctx, 1076, 85, '#ff5a6e')
      box(ctx, 104, 140, 76, 76, linear(ctx, 104, 140, 76, 76, 135, [[0, '#ffb3dd'], [1, '#b3d9ff']]), 18)
      border(ctx, 104, 140, 76, 76, 3, '#ffffff', 18)
      // "online" krom: bayangan, isi gradien logam, garis tepi
      const word = { family: 'Unbounded', size: 64, weight: 800 }
      const ow = measure(ctx, 'online', word)
      // line-height 1: kotak baris 146..210, kotak konten font dipusatkan di dalamnya
      const top = 146 + (64 - contentHeight(ctx, word.family, word.size, word.weight)) / 2
      const chrome = linear(ctx, 202, 146, ow, 64, 180, [[0, '#ffffff'], [0.38, '#d7dce3'], [0.5, '#6f7784'], [0.62, '#eef1f5'], [1, '#a3abb6']])
      // filter drop-shadow(0 6px 0): siluet teks + garis tepi digeser 6px
      text(ctx, 'online', 202, top + 6, { ...word, color: 'rgba(40,20,60,0.25)', stroke: { color: 'rgba(40,20,60,0.25)', width: 2 } })
      text(ctx, 'online', 202, top, { ...word, color: chrome })
      text(ctx, 'online', 202, top, { ...word, color: 'rgba(0,0,0,0)', stroke: { color: '#3a4a6a', width: 2 } })
      text(ctx, '6 foto dikirim', 1096, 166, { family: 'Silkscreen', size: 18, color: INK, align: 'right' })

      // 6 jendela foto
      CARDS.forEach((c, i) => {
        gelCard(ctx, c.x, c.y, 505, 390, 22, 42, 'rgba(255,255,255,0.75)')
        text(ctx, `foto_0${i + 1}.jpg`, c.x + 16, c.y + 13, { family: 'Silkscreen', size: 16, color: NAVY })
        light(ctx, c.x + 435, c.y + 11, '#ffd34d')
        light(ctx, c.x + 465, c.y + 11, '#ff5a6e')
      })
    },
    over(ctx, { texts, W, H }) {
      for (const c of CARDS) photoInset(ctx, c.x + 14, c.y + 56, 477, 320, 12)
      const catatan = texts.catatan?.trim() ?? ''
      const tanggal = texts.tanggal?.trim() ?? ''
      // pesan status (lebar mengikuti teks)
      const status = catatan ? `pesan status: ${catatan} :)` : 'pesan status: :)'
      const sw = Math.min(700, measure(ctx, status, { family: 'Silkscreen', size: 18 }) + 48)
      box(ctx, 80, 1674, sw, 56, 'rgba(255,255,255,0.85)', 20)
      border(ctx, 80, 1674, sw, 56, 2, '#ffffff', 20)
      text(ctx, status, 104, 1690, { family: 'Silkscreen', size: 18, color: INK, maxWidth: sw - 48 })
      if (tanggal) text(ctx, tanggal, 1120, 1706, { family: 'Silkscreen', size: 18, color: INK, align: 'right' })

      // stiker logam & kilau
      metal(ctx, 'star', 1050, 40, 110, 14)
      metal(ctx, 'heart', 20, 1640, 100, -10)
      svg(ctx, ICONS.sparkle, 560, 840, 40, 40, 24, 24, { fill: '#ffffff' })
      svg(ctx, ICONS.sparkle, 1110, 1180, 30, 30, 24, 24, { fill: '#ffffff' })

      // daftar teman online (3 baris): nama, nama 2, lalu "kamu"
      const friends = [texts.nama?.trim(), texts.nama2?.trim()].filter((v): v is string => !!v)
      const list = [...friends, 'kamu']
      const h = 4 + 34 + 10 + list.length * 18 + (list.length - 1) * 8 + 10
      gelCard(ctx, 820, 1520, 304, h, 18, 34, 'rgba(0,0,0,0)')
      ctx.save()
      ctx.beginPath()
      rrPath(ctx, 822, 1522, 300, h - 4, 16)
      ctx.clip()
      box(ctx, 822, 1556, 300, h - 38, 'rgba(255,255,255,0.85)')
      ctx.restore()
      border(ctx, 820, 1520, 304, h, 2, '#ffffff', 18)
      text(ctx, `teman online (${list.length})`, 834, 1530, { family: 'Silkscreen', size: 14, color: NAVY })
      list.forEach((n, i) => {
        const ry = 1566 + i * 26
        box(ctx, 834, ry + 4, 10, 10, '#3fd97a', 5)
        text(ctx, n, 852, ry, { family: 'Silkscreen', size: 14, color: INK, maxWidth: 256 })
      })
      detailSheen(ctx, W, H)
    },
  },
})
