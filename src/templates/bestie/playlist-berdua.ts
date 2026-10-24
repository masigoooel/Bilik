// Playlist Berdua — design-reference/bestie-couple/playlist-berdua.html (1200x1800, 6 foto)
import { box, dropShadow, ICONS, svg, text, type Ctx } from '../paint'
import { bestie } from './define'
import { MONO, SERIF } from './helpers'

const BG = '#151515'
const ACCENT = '#5FD38D'
const LIGHT = '#F1EFEA'
const GREY = '#9a968e'
const DIM = '#8a8a8a'
/** Outfit dimuat 500 & 700 saja: teks 400 di desain tampil memakai face 500 */
const OUTFIT = 'Outfit'
const CAMERA = 'M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
const SHUFFLE = 'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5'
const DOWNLOAD = 'M12 3v12M7 10l5 5 5-5M5 21h14'
const REPEAT = 'M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3'

/** 6 baris lagu (tinggi 174, jarak 2); baris 2 sedang diputar */
const ROWS = [
  { time: '3:21', liked: true, explicit: true, title: 'pertama kali ketemu' },
  { time: '4:02', liked: true, explicit: false, title: null },
  { time: '2:58', liked: false, explicit: false, title: 'jalan pulang' },
  { time: '3:45', liked: true, explicit: true, title: 'hujan sore itu' },
  { time: '3:10', liked: false, explicit: false, title: 'lagu di mobil' },
  { time: '4:17', liked: false, explicit: false, title: 'nanti kita cerita' },
].map((r, i) => ({ ...r, y: 590 + i * 176 }))
const SLOTS = ROWS.map((r) => ({ x: 128, y: r.y + 12, w: 150, h: 150, radius: 8 }))

function camera(ctx: Ctx, x: number, y: number, size: number, color: string) {
  svg(ctx, CAMERA, x, y, size, size, 24, 24, { stroke: color, lineWidth: 1.5, lineCap: 'round', lineJoin: 'round' })
  ctx.save()
  ctx.beginPath()
  ctx.arc(x + (12 * size) / 24, y + (13 * size) / 24, (4 * size) / 24, 0, Math.PI * 2)
  ctx.lineWidth = (1.5 * size) / 24
  ctx.strokeStyle = color
  ctx.stroke()
  ctx.restore()
}

export const playlistBerdua = bestie({
  id: 'bestie-playlist-berdua',
  name: 'playlist berdua',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'linear', angle: 180, stops: [[0, '#5a3a6a'], [420 / 1800, '#2a1e34'], [760 / 1800, BG], [1, BG]] },
  placeholder: '#2a2a2a',
  fonts: ['DM Serif Display', 'Space Mono:400,700', 'Outfit:500,700'],
  fields: ['nama', 'nama2', 'catatan'],
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      text(ctx, '‹ kembali', 60, 40, { family: MONO, size: 16, color: '#cfcfcf' })
      text(ctx, '⋯', 1140, 40, { family: MONO, size: 16, color: '#cfcfcf', align: 'right' })

      // sampul playlist: 4 kotak warna
      dropShadow(ctx, 80, 120, 300, 300, 0, 20, 40, 'rgba(0,0,0,0.55)', 10)
      box(ctx, 80, 120, 150, 150, '#c96a8a', [10, 0, 0, 0])
      box(ctx, 230, 120, 150, 150, '#6a8ac9', [0, 10, 0, 0])
      box(ctx, 80, 270, 150, 150, '#8ac96a', [0, 0, 0, 10])
      box(ctx, 230, 270, 150, 150, '#c9a86a', [0, 0, 10, 0])

      text(ctx, 'PLAYLIST BERSAMA', 420, 252.2, { family: MONO, size: 14, color: '#cfcfcf', letterSpacing: 2.8 })
      text(ctx, 'lagu kita', 420, 263.2, { family: SERIF, size: 92, color: LIGHT })
      // dua avatar bertumpuk + pemilik playlist
      for (const [x, c] of [[420, '#c96a8a'], [446, '#6a8ac9']] as const) {
        box(ctx, x, 380, 34, 34, '#2a1e34', 15)
        box(ctx, x + 2, 382, 30, 30, c, 13)
      }
      const names = [texts.nama?.trim(), texts.nama2?.trim()].filter(Boolean).join(' dan ')
      text(ctx, [names, '6 lagu, 21 mnt'].filter(Boolean).join(' · '), 490, 385.5, { family: OUTFIT, size: 18, weight: 500, color: '#cfcfcf', maxWidth: 650 })

      // tombol putar + ikon
      dropShadow(ctx, 80, 470, 86, 86, 0, 8, 18, 'rgba(0,0,0,0.4)', 43)
      box(ctx, 80, 470, 86, 86, ACCENT, 43)
      text(ctx, '❚❚', 123, 493, { family: OUTFIT, size: 34, weight: 500, color: '#111111', align: 'center' })
      const line = { stroke: '#cfcfcf', lineWidth: 1.8, lineCap: 'round' as const, lineJoin: 'round' as const }
      svg(ctx, SHUFFLE, 192, 498, 30, 30, 24, 24, line)
      svg(ctx, ICONS.heart, 248, 496, 34, 34, 24, 24, { fill: ACCENT, stroke: ACCENT, lineWidth: 1.6 })
      svg(ctx, DOWNLOAD, 308, 498, 30, 30, 24, 24, line)
      text(ctx, 'diurutkan: tanggal ditambah', 1120, 502.5, { family: MONO, size: 14, color: GREY, align: 'right' })

      const judul = texts.catatan?.trim() || 'lagu kita'
      ROWS.forEach((r, i) => {
        const playing = i === 1
        if (playing) box(ctx, 66, r.y, 1068, 174, 'rgba(255,255,255,0.07)', 14)
        text(ctx, playing ? '▶' : String(i + 1), 93, r.y + 74, { family: MONO, size: 18, color: playing ? ACCENT : DIM, align: 'center' })
        dropShadow(ctx, 128, r.y + 12, 150, 150, 0, 4, 10, 'rgba(0,0,0,0.4)', 8)
        text(ctx, r.title ?? judul, 300, r.y + 57.5, { family: OUTFIT, size: 26, weight: 700, color: playing ? ACCENT : LIGHT, maxWidth: 649 })
        // penyanyi: bergantian nama & nama2
        const singer = (i % 2 === 0 ? texts.nama : texts.nama2)?.trim() || (i % 2 === 0 ? texts.nama2 : texts.nama)?.trim() || 'kita berdua'
        let sx = 300
        if (r.explicit) {
          box(ctx, 300, r.y + 98.5, 18.8, 16, GREY, 3)
          text(ctx, 'E', 306, r.y + 99.5, { family: OUTFIT, size: 11, weight: 700, color: '#151515' })
          sx = 326.8
        }
        text(ctx, singer, sx, r.y + 96.5, { family: OUTFIT, size: 16, weight: 500, color: GREY, maxWidth: 949.2 - sx })
        if (r.liked) svg(ctx, ICONS.heart, 971.2, r.y + 74, 26, 26, 24, 24, { fill: ACCENT, stroke: ACCENT, lineWidth: 1.6 })
        else svg(ctx, ICONS.heart, 971.2, r.y + 74, 26, 26, 24, 24, { stroke: DIM, lineWidth: 1.6 })
        text(ctx, r.time, 1079.2, r.y + 75, { family: MONO, size: 16, color: GREY, align: 'right' })
        text(ctx, '⋯', 1101.2, r.y + 72.5, { family: OUTFIT, size: 22, weight: 500, color: DIM })
      })

      // pemutar mini di bawah
      dropShadow(ctx, 40, 1640, 1120, 120, 0, -6, 20, 'rgba(0,0,0,0.3)', 18)
      box(ctx, 40, 1640, 1120, 120, '#3a2a44', 18)
      box(ctx, 62, 1658, 84, 84, '#2a2a2a', 8)
      camera(ctx, 81, 1672, 46, DIM)
      text(ctx, judul, 166, 1680, { family: OUTFIT, size: 22, weight: 700, color: LIGHT, maxWidth: 875 })
      box(ctx, 166, 1716, 875.4, 4, 'rgba(255,255,255,0.2)', 2)
      box(ctx, 166, 1716, 875.4 * 0.42, 4, '#ffffff', 2)
      svg(ctx, REPEAT, 1061.4, 1685, 30, 30, 24, 24, line)
      text(ctx, '❚❚', 1111.4, 1682, { family: OUTFIT, size: 30, weight: 500, color: LIGHT })
    },
  },
})
