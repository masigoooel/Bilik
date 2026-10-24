// Kalender — design-reference/bestie-couple/kalender.html (1080x1350, 1 foto)
import { box, contentHeight, dropShadow, snap, text, textMid } from '../paint'
import { bestie } from './define'
import { BULAN, FONTS, HAND, INK, MONO, parseTanggal, rotated, SERIF, slotInsets, wrapFit } from './helpers'

const RED = '#D7261E'
const DAYS = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN']
const COL = 860 / 7
const SLOTS = [{ x: 110, y: 206, w: 860, h: 620 }]

export const kalender = bestie({
  id: 'bestie-kalender',
  name: 'kalender',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#E9E4DA' },
  placeholder: '#ECE8E1',
  fonts: FONTS,
  fields: ['tanggal', 'catatan'],
  texture: { opacity: 0.09, blend: 'multiply' },
  slots: SLOTS,
  draw: {
    under(ctx, { texts }) {
      box(ctx, 60, 60, 960, 1230, '#FFFFFF')
      // jilid spiral: repeating-linear-gradient(90deg, ink 0 10px, transparent 10px 40px)
      for (let x = 120; x < 960; x += 40) box(ctx, x, 60, 10, 26, INK)

      // bulan & tahun dari tanggal user (tanpa tanggal: bulan berjalan, tanpa lingkaran)
      const p = parseTanggal(texts.tanggal)
      const now = new Date()
      const m = p?.m ?? now.getMonth() + 1
      const y = p?.y ?? now.getFullYear()
      text(ctx, BULAN[m - 1], 110, 96, { family: SERIF, size: 72, color: INK, maxWidth: 700 })
      text(ctx, String(y), 970, 149, { family: MONO, size: 22, weight: 700, color: INK, align: 'right' })

      // kisi hari (Senin pertama); baris yang memuat hari bertanda 6px lebih tinggi (border 3px)
      DAYS.forEach((d, i) => text(ctx, d, 110 + COL * (i + 0.5), 850, { family: MONO, size: 16, weight: 700, color: INK, align: 'center' }))
      const lead = (new Date(y, m - 1, 1).getDay() + 6) % 7
      const count = new Date(y, m, 0).getDate()
      const rows = Math.ceil((lead + count) / 7)
      let rowY = 880
      for (let r = 0; r < rows; r++) {
        const mark = p ? Math.floor((lead + p.d - 1) / 7) === r : false
        const h = mark ? 50 : 44
        for (let c = 0; c < 7; c++) {
          const day = r * 7 + c - lead + 1
          if (day < 1 || day > count) continue
          const cx = 110 + COL * c
          const marked = mark && day === p!.d
          if (marked) {
            // border 3px + radius 50% pada sel 123x50: cincin elips
            const b = snap(cx, rowY, COL, 50)
            ctx.beginPath()
            ctx.ellipse(b.x + b.w / 2, b.y + 25, b.w / 2, 25, 0, 0, Math.PI * 2)
            ctx.ellipse(b.x + b.w / 2, b.y + 25, b.w / 2 - 3, 22, 0, 0, Math.PI * 2)
            ctx.fillStyle = RED
            ctx.fill('evenodd')
          }
          textMid(ctx, String(day), cx + COL / 2, rowY + (marked ? 3 : 0), 44, { family: MONO, size: 22, weight: marked ? 700 : 400, color: INK, align: 'center' })
        }
        rowY += h + 6
      }

      // catatan tempel 220x160 (rotate -4deg di titik tengah) + selotip terpisah di atasnya
      rotated(ctx, 170, 1250, -4, () => {
        dropShadow(ctx, 60, 1170, 220, 160, 0, 6, 12, 'rgba(0,0,0,0.15)')
        box(ctx, 60, 1170, 220, 160, '#FFE873')
        const o = { family: HAND, size: 36, weight: 400 }
        const note = texts.catatan?.trim()
        const { lines, size } = note ? wrapFit(ctx, note, 184, 2, o) : { lines: [], size: 36 }
        let ly = 1187
        const put = (s: string, sz: number) => {
          const lh = sz * 1.05
          text(ctx, s, 78, ly + (lh - contentHeight(ctx, HAND, sz, 400)) / 2, { ...o, size: sz, color: INK })
          ly += lh
        }
        for (const l of lines) put(l, size)
        put('jangan lupa', 36)
      })
      rotated(ctx, 175, 1110, -4, () => box(ctx, 120, 1090, 110, 40, 'rgba(232,220,170,0.85)'))
    },
    over(ctx) {
      slotInsets(ctx, SLOTS)
    },
  },
})
