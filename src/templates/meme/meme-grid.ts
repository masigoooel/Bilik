// Meme Grid — design-reference/meme-lucu/meme-grid.html (1200x1800, 6 foto)
import { border, box, measure, text, type Ctx } from '../paint'
import { ANTON, MONO, TEXTURE, disc, join, photoInset, ring } from './helpers'
import { meme } from './define'

const INK = '#111111'
const ACCENT = '#FF6A2B'
const MUTED = '#6b6862'

/** kartu postingan 505x441 (grid 2 kolom, jarak 30px) */
const POSTS = [
  { up: '1,2rb', comments: '78 komentar' },
  { up: '845', comments: '61 komentar' },
  { up: '3,4rb', comments: '54 komentar' },
  { up: '97', comments: '56 komentar' },
  { up: '2,1rb', comments: '82 komentar' },
  { up: '512', comments: '9 komentar' },
].map((p, i) => ({ ...p, x: 80 + (i % 2) * 535, y: 207 + Math.floor(i / 2) * 471, time: `${i + 1}j` }))

/** teks meme putih dengan text-shadow 4 arah ±3px hitam (tanpa blur), dikecilkan sampai muat */
function caption(ctx: Ctx, s: string, cx: number, y: number) {
  if (!s) return
  const o = { family: ANTON, size: 34, align: 'center' as const, maxWidth: 449 }
  for (const [dx, dy] of [[3, 3], [-3, 3], [3, -3], [-3, -3]]) text(ctx, s, cx + dx, y + dy, { ...o, color: '#000000' })
  text(ctx, s, cx, y, { ...o, color: '#ffffff' })
}

/** [TEKS] → catatan; "atas / bawah" (garis miring berspasi, baris baru, atau |) dibagi ke dua teks, satu bagian saja = teks bawah */
function captions(catatan: string | undefined): [string, string] {
  const parts = (catatan ?? '').split(/\s*\n\s*|\s+\/\s+|\s*\|\s*/).map((s) => s.trim()).filter(Boolean)
  if (parts.length === 0) return ['', '']
  if (parts.length === 1) return ['', parts[0]]
  return [parts[0], parts.slice(1).join(' ')]
}

export const memeGrid = meme({
  id: 'meme-meme-grid',
  name: 'meme grid',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#EEECE6' },
  placeholder: '#BDBAB2',
  fonts: ['Anton', 'Space Mono:400,700'],
  fields: ['nama', 'nama2', 'catatan', 'tanggal'],
  texture: TEXTURE,
  slots: POSTS.map((p) => ({ x: p.x + 18, y: p.y + 64, w: 469, h: 330, radius: 8 })),
  draw: {
    under(ctx, { texts }) {
      // kepala: avatar komunitas, [KOMUNITAS] → nama, tombol gabung
      disc(ctx, 80, 70, 82, ACCENT)
      ring(ctx, 80, 70, 82, 3, INK)
      const pill = { family: MONO, size: 16, weight: 700 }
      const pw = measure(ctx, 'gabung', pill) + 40
      box(ctx, 1120 - pw, 89, pw, 44, INK, 30)
      text(ctx, 'gabung', 1120 - pw + 20, 99, { ...pill, color: '#ffffff' })
      text(ctx, texts.nama?.trim() || 'meme kita', 180, 54, { family: ANTON, size: 60, color: INK, maxWidth: 1120 - pw - 30 - 180 })
      text(ctx, join(['6 postingan teratas', texts.tanggal]), 180, 130, { family: MONO, size: 15, color: INK, maxWidth: 1120 - pw - 30 - 180 })
      box(ctx, 80, 170, 1040, 3, INK)

      // @[USER] → nama2 (kosong: hanya waktu)
      const user = texts.nama2?.trim().replace(/\s+/g, '') ?? ''
      for (const p of POSTS) {
        box(ctx, p.x, p.y, 505, 441, '#ffffff', 16)
        border(ctx, p.x, p.y, 505, 441, 2, '#d9d6cf', 16)
        disc(ctx, p.x + 18, p.y + 18, 34, ACCENT)
        const head = { family: MONO, size: 14 }
        let hx = p.x + 62
        if (user) {
          hx += text(ctx, `@${user}`, hx, p.y + 24.5, { ...head, weight: 700, color: INK, maxWidth: 340 }) + 10
          text(ctx, `· ${p.time}`, Math.min(hx, p.x + 62 + 350), p.y + 24.5, { ...head, color: MUTED })
        } else text(ctx, p.time, hx, p.y + 24.5, { ...head, color: MUTED })
        const foot = { family: MONO, size: 12, weight: 700, color: MUTED }
        // ▲ dari font cadangan sistem: dipusatkan di lebar hasil ukur desain (7.2px = 1 kolom Space Mono 12px)
        let fx = p.x + 18
        text(ctx, '▲', fx + 3.6, p.y + 406, { ...foot, align: 'center' })
        fx += 7.2 + text(ctx, ` ${p.up}`, fx + 7.2, p.y + 406, foot) + 14
        for (const s of [p.comments, 'bagikan']) fx += text(ctx, s, fx, p.y + 406, foot) + 14
      }
    },
    over(ctx, { texts }) {
      const [top, bottom] = captions(texts.catatan)
      for (const p of POSTS) {
        photoInset(ctx, p.x + 18, p.y + 64, 469, 330, 8)
        const cx = p.x + 18 + 469 / 2
        caption(ctx, top, cx, p.y + 76)
        caption(ctx, bottom, cx, p.y + 331)
      }
    },
  },
})
