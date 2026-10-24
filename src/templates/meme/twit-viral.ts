// Twit Viral — design-reference/meme-lucu/twit-viral.html (1080x1350, 1 foto)
import { box, dropShadow, ICONS, linear, measure, rrPath, svg, text } from '../paint'
import { photoInset, TEXTURE } from './helpers'
import { meme } from './define'

const INK = '#0f1419'
const MUTED = '#536471'
const OUTFIT = 'Outfit'

const VERIFIED = 'M12 1l2.6 2.2 3.4-.4.9 3.3 3 1.7-1.3 3.2 1.3 3.2-3 1.7-.9 3.3-3.4-.4L12 23l-2.6-2.2-3.4.4-.9-3.3-3-1.7L3.4 13 2.1 9.8l3-1.7.9-3.3 3.4.4z'
const CHECK = 'M7.5 12.3l3 3 6-6.3'
/** ikon aksi (viewBox 24, stroke 1.8) + angka di sebelahnya */
const ACTIONS = [
  { x: 114, d: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z', n: '128' },
  { x: 381.6, d: 'M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3', n: '1,7rb' },
  { x: 660.6, d: ICONS.heart, n: '9,4rb' },
  { x: 944, d: 'M12 3v12M7 8l5-5 5 5M5 21h14', n: '' },
]
/** bingkai foto: border 1px #cfd9de radius 22, overflow hidden */
const PHOTO = { x: 115, y: 397.6, w: 850, h: 620, radius: 21 }

export const twitViral = meme({
  id: 'meme-twit-viral',
  name: 'twit viral',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#E6ECF0' },
  placeholder: '#E8E6E0',
  // Outfit dimuat 500/700/800: teks 400 di desain tampil memakai face 500
  fonts: ['Anton', 'Space Mono:400,700', 'Outfit:500,700,800'],
  fields: ['nama', 'nama2', 'catatan', 'tanggal'],
  texture: TEXTURE,
  slots: [PHOTO],
  draw: {
    under(ctx, { texts }) {
      // kartu twit: radius 28, bayangan 0 20px 40px
      dropShadow(ctx, 70, 200.4, 940, 949.2, 0, 20, 40, 'rgba(0,0,0,0.12)', 28)
      box(ctx, 70, 200.4, 940, 949.2, '#ffffff', 28)

      // avatar: linear-gradient(135deg, #c96a8a, #6a8ac9)
      ctx.beginPath()
      ctx.arc(150, 276.4, 36, 0, Math.PI * 2)
      ctx.fillStyle = linear(ctx, 114, 240.4, 72, 72, 135, [[0, '#c96a8a'], [1, '#6a8ac9']])
      ctx.fill()

      // [NAMA] → nama + centang biru; @[USER] → nama2 (kosong: dari nama, huruf kecil tanpa spasi)
      const nama = texts.nama?.trim() || 'kita'
      const nameFont = { family: OUTFIT, size: 24, weight: 800 }
      const nameMax = 940 - 202 - 24 - 100
      const nw = Math.min(nameMax, measure(ctx, `${nama} `, nameFont))
      text(ctx, nama, 202, 249.8, { ...nameFont, color: INK, maxWidth: nameMax - measure(ctx, ' ', nameFont) })
      svg(ctx, VERIFIED, 202 + nw, 256, 24, 24, 24, 24, { fill: '#1D9BF0' })
      svg(ctx, CHECK, 202 + nw, 256, 24, 24, 24, 24, { stroke: '#ffffff', lineWidth: 2, lineCap: 'round', lineJoin: 'round' })
      const user = (texts.nama2?.trim() || nama.toLowerCase()).replace(/\s+/g, '').replace(/^@/, '')
      text(ctx, `@${user}`, 202, 280, { family: OUTFIT, size: 18, weight: 500, color: MUTED, maxWidth: 700 })
      text(ctx, '⋯', 942, 257.9, { family: OUTFIT, size: 28, weight: 500, color: MUTED })

      // [TEKS TWIT SINGKAT] → catatan, satu baris (dikecilkan bila panjang)
      text(ctx, texts.catatan?.trim() ?? '', 114, 332.4, { family: OUTFIT, size: 34, weight: 500, color: INK, maxWidth: 852 })

      // bingkai foto
      ctx.beginPath()
      rrPath(ctx, 114, 396.6, 852, 622, 22)
      ctx.fillStyle = '#cfd9de'
      ctx.fill()

      // 16:20 · [tanggal] · 17,2rb dilihat
      const meta = { family: OUTFIT, size: 18, weight: 500, color: MUTED }
      const tgl = texts.tanggal?.trim()
      let mx = 114
      mx += text(ctx, tgl ? `16:20 · ${tgl} · ` : '16:20 · ', mx, 1038.6, { ...meta, maxWidth: 600 })
      mx += text(ctx, '17,2rb', mx, 1038.6, { ...meta, weight: 700, color: INK })
      text(ctx, ' dilihat', mx, 1038.6, meta)

      box(ctx, 114, 1081.6, 852, 1, '#eff3f4')
      for (const a of ACTIONS) {
        svg(ctx, a.d, a.x, 1097.1, 22, 22, 24, 24, { stroke: MUTED, lineWidth: 1.8, lineCap: 'round', lineJoin: 'round' })
        text(ctx, a.n, a.x + 30, 1096.6, meta)
      }

      // bilah atas: ← Postingan
      text(ctx, '←', 70, 31, { family: OUTFIT, size: 30, weight: 800, color: INK })
      text(ctx, 'Postingan', 124, 32.5, { family: OUTFIT, size: 26, weight: 800, color: INK })
    },
    over(ctx) {
      ctx.save()
      ctx.beginPath()
      rrPath(ctx, PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h, PHOTO.radius)
      ctx.clip()
      photoInset(ctx, PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h)
      ctx.restore()
    },
  },
})
