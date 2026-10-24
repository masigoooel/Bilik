// Buku Panduan — design-reference/travel/buku-panduan.html (1080x1350 portrait, 1 foto)
// Dirapikan dari desain: judul kota punya isi bawaan (tanpa itu ada celah kosong besar), isi sampul berhenti 30px
// sebelum tepi halaman (desain asli bingkai fotonya menempel ke tepi halaman), dan bingkai foto lebih tinggi
// supaya bagian bawah sampul tidak kosong.
import { box, dropShadow, insetShadows, linear } from '../paint'
import { travel } from './define'
import { ellipseRadial, FONTS_NO_HAND, lineTop, MONO, photoInset, rotated, rotSlot, SERIF, TEXTURE, txt } from './helpers'

const RED = '#C0392B'
const CREAM = '#F6F1E4'
/** buku 720x1100 di (180, 90), rotate -2deg di titik tengah */
const OX = 540
const OY = 640
const ROT = -2
// isi sampul (padding 46/44): header 21 + 20 + judul 86.4 + 20 + sub 24 + 20 → bingkai foto di y 327.4
const FRAME_Y = 327.4
/** tepi kanan isi sampul: 30px sebelum tepi halaman (x 860) */
const RIGHT = 830
const FRAME = { x: 274, y: FRAME_Y, w: RIGHT - 274, h: 720 }
const PHOTO = { x: FRAME.x + 10, y: FRAME.y + 10, w: FRAME.w - 20, h: FRAME.h - 20 }
/** judul kalau "tempat" belum diisi */
const JUDUL = 'jalan-jalan'

export const bukuPanduan = travel({
  id: 'travel-buku-panduan',
  name: 'buku panduan',
  width: 1080,
  height: 1350,
  photoCount: 1,
  background: { type: 'solid', color: '#D9CFBE' },
  placeholder: '#E5E0D4',
  fonts: FONTS_NO_HAND,
  fields: ['tempat', 'nama'],
  texture: TEXTURE,
  slots: [rotSlot(OX, OY, PHOTO.x + PHOTO.w / 2, PHOTO.y + PHOTO.h / 2, PHOTO.w, PHOTO.h, ROT)],
  draw: {
    under(ctx, { texts, W, H }) {
      ellipseRadial(ctx, 0, 0, W, H, W * 0.4, H * 0.3, [[0, '#f3ede2'], [0.75, '#D9CFBE']])

      rotated(ctx, OX, OY, ROT, () => {
        dropShadow(ctx, 180, 90, 720, 1100, 0, 26, 40, 'rgba(0,0,0,0.3)')
        box(ctx, 180, 90, 50, 1100, linear(ctx, 180, 90, 50, 1100, 90, [[0, '#a8332a'], [0.4, RED], [1, '#a8332a']]))
        box(ctx, 230, 90, 670, 1100, RED)
        const c = CREAM
        txt(ctx, 'PANDUAN SAKU', 274, 136, { family: MONO, size: 14, color: c, ls: 2.8 })
        txt(ctx, texts.tempat?.trim() || JUDUL, 274, lineTop(ctx, SERIF, 96, 0.9, 177, 700), {
          family: SERIF, size: 96, weight: 700, color: c, maxWidth: FRAME.w,
        })
        txt(ctx, 'tempat makan, jalan kaki, dan sudut tersembunyi', 274, 283.4, { family: MONO, size: 16, color: c, maxWidth: FRAME.w })
        box(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, CREAM)
        // kaki sampul (flex-end, baris 20px berakhir di 1144)
        const nama = texts.nama?.trim()
        if (nama) txt(ctx, `oleh ${nama}`, 274, 1124, { family: MONO, size: 13, color: c, maxWidth: 360 })
        txt(ctx, 'termasuk peta lipat', RIGHT, 1124, { family: MONO, size: 13, color: c, align: 'right' })
      })
    },
    over(ctx) {
      rotated(ctx, OX, OY, ROT, () => photoInset(ctx, PHOTO))

      // tepi halaman: repeating-linear-gradient(0deg, krem 3px / 2px) dari bawah + inset 4px 0 6px
      rotated(ctx, 872, 650, ROT, () => {
        box(ctx, 860, 120, 24, 1060, CREAM)
        ctx.fillStyle = '#e3dcc6'
        for (let b = 1180; b > 120; b -= 5) ctx.fillRect(860, b - 5, 24, 2)
        insetShadows(ctx, 860, 120, 24, 1060, [{ dx: 4, dy: 0, blur: 6, color: 'rgba(0,0,0,0.15)' }])
      })
      // pita pembatas (clip-path ekor burung)
      rotated(ctx, 657, 1246, ROT, () => {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(640, 1186)
        ctx.lineTo(674, 1186)
        ctx.lineTo(674, 1306)
        ctx.lineTo(657, 1186 + 120 * 0.86)
        ctx.lineTo(640, 1306)
        ctx.closePath()
        ctx.fillStyle = linear(ctx, 640, 1186, 34, 120, 90, [[0, '#2E5E8C'], [1, '#1E3A5A']])
        ctx.fill()
        ctx.restore()
      })
    },
    top(ctx, { W, H }) {
      // data-detail: kilau hangat kiri atas + vignet
      ellipseRadial(ctx, 0, 0, W, H, W * 0.25, H * 0.15, [[0, 'rgba(255,240,210,0.22)'], [0.45, 'rgba(255,240,210,0)']])
      ellipseRadial(ctx, 0, 0, W, H, W * 0.5, H * 0.55, [[0.6, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.14)']])
    },
  },
})
