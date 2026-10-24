// Kontributor — design-reference/editorial-majalah/kontributor.html (1200x1800 4R, 6 foto bulat)
import { box } from '../paint'
import { editorial } from './define'
import { FONTS, fotoInset, INK, lineTop, MONO, SERIF, TEXTURE, txt, width } from './helpers'

const COLS = [80, 620]
const ROWS = [237.5, 689.5, 1141.5]
const CELLS = ROWS.flatMap((y) => COLS.map((x) => ({ x, y })))
/** [PERAN] · @[USER] tidak punya field: peran tetap per kontributor */
const ROLES = ['fotografer', 'penata gaya', 'penata rias', 'penulis', 'model', 'penyunting']

/** nama kontributor: nama lalu nama2; boleh beberapa nama dipisah koma / "&" (maks. 6) */
function names(nama?: string, nama2?: string) {
  return [nama, nama2].flatMap((s) => (s ?? '').split(/[,&]/)).map((s) => s.trim()).filter(Boolean)
}

export const kontributor = editorial({
  id: 'editorial-kontributor',
  name: 'kontributor',
  width: 1200,
  height: 1800,
  photoCount: 6,
  background: { type: 'solid', color: '#FFFFFF' },
  // #DCD8CF setelah grayscale(1) di desain
  placeholder: '#D8D8D8',
  // kotak FOTO di desain memakai filter: grayscale(1)
  filter: 'mono',
  fonts: FONTS,
  fields: ['nama', 'nama2'],
  texture: TEXTURE,
  slots: CELLS.map((c) => ({ x: c.x + 70, y: c.y, w: 360, h: 360, radius: 180 })),
  draw: {
    under(ctx, { texts }) {
      txt(ctx, 'Kontributor', 80, lineTop(ctx, SERIF, 110, 0.85, 80), { family: SERIF, size: 110, color: INK })
      txt(ctx, 'VOL. 07', 1120, 150.5, { family: MONO, size: 18, color: INK, align: 'right' })
      box(ctx, 80, 191.5, 1040, 2, INK)

      const list = names(texts.nama, texts.nama2)
      CELLS.forEach((c, i) => {
        // baris nama (kiri) + peran (kanan), sejajar baseline
        const role = { family: MONO, size: 14, color: INK }
        txt(ctx, ROLES[i], c.x + 500, c.y + 390, { ...role, align: 'right' })
        const roleW = width(ctx, ROLES[i], role)
        txt(ctx, list[i] ?? '', c.x, c.y + 370, { family: SERIF, size: 30, color: INK, maxWidth: 500 - roleW - 20 })
      })
    },
    over(ctx) {
      CELLS.forEach((c) => fotoInset(ctx, c.x + 70, c.y, 360, 360, 180))
    },
  },
})
