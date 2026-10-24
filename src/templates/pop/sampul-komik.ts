// Sampul Komik — design-reference/bold-pop/sampul-komik.html (1080x1350, 1 foto)
import { border, box, linear, measure, text } from '../paint'
import { ARCHIVO, BANGERS, BULAN, INK, MONO, TEXTURE, detailDots, parseTanggal, photoInset, pmStops, rotated } from './helpers'
import { pop } from './define'

const BG = '#FFD600'
const RED = '#E23A3A'
const SLOT = { x: 48, y: 256, w: 984, h: 900 }

export const sampulKomik = pop({
  id: 'pop-sampul-komik',
  name: 'sampul komik',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: BG },
  placeholder: '#F0EEE8',
  fonts: ['Bangers', 'Archivo Black', 'Space Mono:400,700'],
  fields: ['nama', 'tempat', 'tanggal'],
  texture: TEXTURE,
  slots: [SLOT],
  draw: {
    under(ctx, { texts }) {
      // sampul: border 8px, isi putih (overflow hidden: 48..1032 x 48..1318)
      box(ctx, 40, 40, 1000, 1286, '#ffffff')
      border(ctx, 40, 40, 1000, 1286, 8, INK)
      ctx.save()
      ctx.beginPath()
      ctx.rect(48, 48, 984, 1270)
      ctx.clip()

      // kepala merah + judul BILIK! (stroke 5px di bawah isi, text-shadow 8px 8px hanya bentuk isi)
      box(ctx, 48, 48, 984, 192, RED)
      box(ctx, 48, 240, 984, 8, INK)
      text(ctx, 'BILIK!', 86, 72, { family: BANGERS, size: 150, color: INK })
      text(ctx, 'BILIK!', 78, 64, { family: BANGERS, size: 150, color: '#FFE45C', stroke: { color: INK, width: 5 } })

      // kotak "NO." = tanggal (hari) dari teks tanggal; lebar mengikuti angka
      const tgl = texts.tanggal?.trim() ?? ''
      const p = parseTanggal(tgl)
      const no = p ? String(p.d).padStart(2, '0') : '01'
      const nw = Math.max(22, measure(ctx, no, { family: ARCHIVO, size: 40 })) + 36
      const nx = 1002 - nw
      box(ctx, nx, 101.5, nw, 85, '#ffffff')
      border(ctx, nx, 101.5, nw, 85, 4, INK)
      text(ctx, 'NO.', nx + nw / 2, 115.5, { family: MONO, size: 12, weight: 700, color: INK, align: 'center' })
      text(ctx, no, nx + nw / 2, 125.5, { family: ARCHIVO, size: 40, color: INK, align: 'center' })

      // panel bawah: [NAMA] + "dan petualangan di [TEMPAT]" (kolom di tengah vertikal), kotak harga kanan
      box(ctx, 48, 1156, 984, 162, '#ffffff')
      box(ctx, 48, 1156, 984, 8, INK)
      const nama = texts.nama?.trim() ?? ''
      const tempat = texts.tempat?.trim() ?? ''
      const colH = (nama ? 46 : 0) + (tempat ? 21 : 0)
      const top = 1241 - colH / 2
      if (nama) text(ctx, nama, 78, top - 8, { family: ARCHIVO, size: 46, color: INK, maxWidth: 740 })
      if (tempat) text(ctx, `dan petualangan di ${tempat}`, 78, top + (nama ? 46 : 0), { family: MONO, size: 14, color: INK, maxWidth: 740 })

      // harga + bulan tahun dari tanggal (teks tanggal apa adanya kalau tidak dikenali)
      const lines = ['Rp 5.000']
      if (p) lines.push(`${BULAN[p.m - 1]} ${p.y}`)
      else if (tgl) lines.push(tgl.toUpperCase())
      const o = { family: MONO, size: 13, weight: 700, color: INK, align: 'center' as const }
      const tw = Math.min(260, Math.max(...lines.map((l) => measure(ctx, l, o))))
      const bw = tw + 30
      const bh = 22 + lines.length * 20
      const bx = 1002 - bw
      const by = 1241 - bh / 2
      border(ctx, bx, by, bw, bh, 3, INK)
      lines.forEach((l, i) => text(ctx, l, bx + bw / 2, by + 11 + i * 20, { ...o, maxWidth: 260 }))
      ctx.restore()
    },
    over(ctx) {
      photoInset(ctx, SLOT)
      ctx.save()
      ctx.beginPath()
      ctx.rect(48, 48, 984, 1270)
      ctx.clip()
      // sinar: repeating-conic-gradient(rgba(0,0,0,0.04) 0 4deg, transparent 4deg 12deg) di tengah foto
      ctx.save()
      ctx.beginPath()
      ctx.rect(SLOT.x, SLOT.y, SLOT.w, SLOT.h)
      ctx.clip()
      ctx.fillStyle = 'rgba(0,0,0,0.04)'
      const cx = SLOT.x + SLOT.w / 2
      const cy = SLOT.y + SLOT.h / 2
      for (let i = 0; i < 30; i++) {
        const a0 = ((i * 12 - 90) * Math.PI) / 180
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, 1000, a0, a0 + (4 * Math.PI) / 180)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
      // label "PERTAMA KALI!" (padding 12px 20px, border 5px, rotate -4deg)
      rotated(ctx, 199.5, 346, -4, () => {
        box(ctx, 78, 308, 243, 76, '#FFE45C')
        border(ctx, 78, 308, 243, 76, 5, INK)
        text(ctx, 'PERTAMA KALI!', 103, 325, { family: BANGERS, size: 40, color: INK })
      })
      ctx.restore()

      // punggung buku, lipatan sudut, kilap sampul
      box(ctx, 48, 48, 26, 1254, linear(ctx, 48, 48, 26, 1254, 90, pmStops([[0, 'rgba(0,0,0,0.25)'], [0.5, 'rgba(255,255,255,0.15)'], [1, 'rgba(255,255,255,0)']])))
      box(ctx, 940, 1180, 100, 100, linear(ctx, 940, 1180, 100, 100, 315, [[0, 'rgba(255,255,255,0)'], [0.5, 'rgba(255,255,255,0)'], [0.51, 'rgba(0,0,0,0.12)'], [0.7, 'rgba(0,0,0,0)']]))
      box(ctx, 48, 48, 984, 1254, linear(ctx, 48, 48, 984, 1254, 120, [[0, 'rgba(255,255,255,0.15)'], [0.3, 'rgba(255,255,255,0)']]))
    },
    top(ctx, { W, H }) {
      detailDots(ctx, W, H)
    },
  },
})
