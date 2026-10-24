// CD Single — design-reference/y2k-aesthetic/cd-single.html (1080x1350, 2 foto)
import { border, box, dropShadow, linear, text, type Ctx } from '../paint'
import { y2k } from './define'
import { conic, detailSheen, photoInset, spacedText, spreadRing } from './helpers'

const BG = '#FFD0E8'
const C = '#FF3EA5'
const INK = '#2a2440'
const SOFT = '#6c5a86'
const W1 = 'rgba(255,255,255,0.7)'
/** pusat cakram */
const CX = 750
const CY = 540
/** foto 1 (sampul) & foto 2 (label cakram, bulat) */
const P1 = { x: 140, y: 244, w: 506, h: 470 }
const P2 = { x: 630, y: 420, w: 240, h: 240 }

const judulOf = (t: { catatan?: string }) => t.catatan?.trim() || 'lagu kita'

/** wadah CD bening: bayangan, isi putih transparan, tepi putih dalam, engsel kiri, kertas sampul putih */
function jewelCase(ctx: Ctx) {
  dropShadow(ctx, 70, 200, 620, 680, 0, 24, 40, 'rgba(60,30,90,0.25)', 6)
  box(ctx, 70, 200, 620, 680, 'rgba(255,255,255,0.35)', 6)
  border(ctx, 70, 200, 620, 680, 3, W1, 6)
  box(ctx, 70, 200, 30, 680, 'rgba(255,255,255,0.45)')
  box(ctx, 98, 200, 2, 680, W1)
  box(ctx, 122, 226, 542, 628, '#ffffff')
}

export const cdSingle = y2k({
  id: 'y2k-cd-single',
  name: 'cd single',
  width: 1080,
  height: 1350,
  photoCount: 2,
  background: { type: 'linear', angle: 160, stops: [[0, BG], [1, '#E8D6FF']] },
  placeholder: '#EEE8F6',
  fonts: ['Outfit:600,800', 'Space Mono:400,700', 'Bagel Fat One', 'Silkscreen'],
  fields: ['catatan', 'nama', 'tanggal'],
  slots: [P1, { ...P2, radius: 120 }],
  draw: {
    under(ctx, { texts }) {
      // cakram pelangi + cincin putih di sekeliling label
      dropShadow(ctx, 470, 260, 560, 560, 0, 20, 40, 'rgba(60,30,90,0.25)', 280)
      box(ctx, 470, 260, 560, 560, conic(ctx, 20, CX, CY, [[0, '#e9edf2'], [0.2, '#f6d8e6'], [0.4, '#d8e8f6'], [0.6, '#e6f6d8'], [0.8, '#f2e9d8'], [1, '#e9edf2']]), 280)
      border(ctx, 470, 260, 560, 560, 2, 'rgba(255,255,255,0.6)', 280)
      spreadRing(ctx, P2.x, P2.y, P2.w, P2.h, 6, W1, 120)

      jewelCase(ctx)
      const judul = judulOf(texts)
      // judul (line-height 0.9, rata bawah dengan "CD SINGLE / 2 lagu")
      text(ctx, judul, 140, 715, { family: 'Bagel Fat One', size: 46, color: C, maxWidth: 420 })
      text(ctx, 'CD SINGLE', 646, 735.4, { family: 'Space Mono', size: 12, color: INK, align: 'right' })
      text(ctx, '2 lagu', 646, 752.4, { family: 'Space Mono', size: 12, color: INK, align: 'right' })

      // daftar lagu
      text(ctx, `01. ${judul} · 3:42`, 70, 960, { family: 'Space Mono', size: 16, color: INK, maxWidth: 940 })
      text(ctx, `02. ${judul} (versi akustik) · 4:05`, 70, 992, { family: 'Space Mono', size: 16, color: INK, maxWidth: 940 })
      const nama = texts.nama?.trim()
      const tanggal = texts.tanggal?.trim()
      const credit = [nama, tanggal ? `rilis ${tanggal}` : ''].filter(Boolean).join(' · ')
      text(ctx, credit, 70, 1220, { family: 'Space Mono', size: 13, color: SOFT, maxWidth: 940 })

      // kait wadah (cincin 1px gelap transparan)
      for (const ty of [240, 820]) {
        spreadRing(ctx, 70, ty, 10, 40, 1, 'rgba(0,0,0,0.1)', 3)
        box(ctx, 70, ty, 10, 40, 'rgba(255,255,255,0.6)', 3)
      }
    },
    over(ctx, { texts, W, H }) {
      // label cakram: bayangan dalam kotak foto (terpotong lingkaran), lalu lubang tengah
      ctx.save()
      ctx.beginPath()
      ctx.arc(CX, CY, 120, 0, Math.PI * 2)
      ctx.clip()
      photoInset(ctx, P2.x, P2.y, P2.w, P2.h)
      ctx.restore()
      box(ctx, 725, 515, 50, 50, linear(ctx, 725, 515, 50, 50, 160, [[0, BG], [1, '#E8D6FF']]), 25)
      border(ctx, 725, 515, 50, 50, 3, 'rgba(0,0,0,0.12)', 25)

      // wadah CD menutupi sisi kiri label cakram (kecuali foto 1 yang ada di atasnya)
      ctx.save()
      ctx.beginPath()
      ctx.arc(CX, CY, 120, 0, Math.PI * 2)
      ctx.clip()
      ctx.beginPath()
      ctx.rect(0, 0, 1080, 1350)
      ctx.rect(P1.x, P1.y, P1.w, P1.h)
      ctx.clip('evenodd')
      jewelCase(ctx)
      ctx.restore()

      photoInset(ctx, P1.x, P1.y, P1.w, P1.h)
      // kilau wadah
      box(ctx, 70, 200, 620, 680, linear(ctx, 70, 200, 620, 680, 120, [[0, 'rgba(255,255,255,0.4)'], [0.3, 'rgba(255,255,255,0)']]))

      // punggung wadah: bayangan + judul vertikal (writing-mode vertical-rl)
      dropShadow(ctx, 640, 200, 60, 680, 0, 4, 8, 'rgba(0,0,0,0.2)')
      ctx.save()
      ctx.translate(670, 540)
      ctx.rotate(Math.PI / 2)
      spacedText(ctx, `${judulOf(texts)} · Rp 35.000`, 0, -18.5, { family: 'Bagel Fat One', size: 26, color: INK, letterSpacing: 2.6, align: 'center', maxWidth: 640 })
      ctx.restore()

      // alur cakram + kilau putar
      for (let i = 0; i < 5; i++) {
        const s = 502 - i * 40
        border(ctx, 500 + i * 20, 290 + i * 20, s, s, 1, 'rgba(255,255,255,0.35)', s / 2)
      }
      box(ctx, 470, 260, 560, 560, conic(ctx, 200, CX, CY, [
        [0, 'rgba(255,255,255,0)'],
        [20 / 360, 'rgba(255,255,255,0)'],
        [30 / 360, 'rgba(255,255,255,0.45)'],
        [50 / 360, 'rgba(255,255,255,0)'],
        [200 / 360, 'rgba(255,255,255,0)'],
        [210 / 360, 'rgba(255,255,255,0.3)'],
        [230 / 360, 'rgba(255,255,255,0)'],
        [1, 'rgba(255,255,255,0)'],
      ]), 280)
      detailSheen(ctx, W, H)
    },
  },
})
