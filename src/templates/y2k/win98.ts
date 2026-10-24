// Komponen antarmuka ala Windows 98/2000 yang dipakai beberapa template Y2K.
import { bevel, box, dropShadow, insetShadows, measure, text, type Ctx } from '../paint'

export const FACE = '#D4D0C8'
export const INK = '#111111'

/** box-shadow: inset 2px 2px 0 #fff, inset -2px -2px 0 #404040 */
export const raised = (ctx: Ctx, x: number, y: number, w: number, h: number, s = 2) => bevel(ctx, x, y, w, h, '#ffffff', '#404040', s)
/** box-shadow: inset 2px 2px 0 #808080, inset -2px -2px 0 #fff */
export const sunken = (ctx: Ctx, x: number, y: number, w: number, h: number, s = 2) => bevel(ctx, x, y, w, h, '#808080', '#ffffff', s)

/** jendela: bayangan keras di luar, muka abu-abu, tepi timbul */
export function windowFrame(ctx: Ctx, x: number, y: number, w: number, h: number, shadow: [dx: number, dy: number, color: string]) {
  dropShadow(ctx, x, y, w, h, shadow[0], shadow[1], 0, shadow[2])
  box(ctx, x, y, w, h, FACE)
  raised(ctx, x, y, w, h)
}

/** tiga tombol judul (_ □ ×), x = sisi kiri tombol pertama */
export function titleButtons(ctx: Ctx, x: number, y: number, bw: number, bh: number, gap: number, bevelSize: number, glyphTop: number) {
  ;['_', '□', '×'].forEach((g, i) => {
    const bx = x + i * (bw + gap)
    box(ctx, bx, y, bw, bh, FACE)
    raised(ctx, bx, y, bw, bh, bevelSize)
    text(ctx, g, bx + bw / 2, glyphTop, { family: 'Space Mono', size: 16, weight: 700, color: INK, align: 'center' })
  })
}

/** bilah tugas di bawah: tombol "mulai", tugas aktif (opsional), jam di kanan */
export function taskbar(
  ctx: Ctx,
  W: number,
  y: number,
  task: { label: string; x: number; w: number; textX: number } | null,
  clock: string,
) {
  box(ctx, 0, y, W, 64, FACE)
  insetShadows(ctx, 0, y, W, 64, [{ dx: 0, dy: 2, color: '#ffffff' }])
  raised(ctx, 12, y + 10, 103.5, 44)
  text(ctx, 'mulai', 30, y + 19, { family: 'Silkscreen', size: 20, color: INK })
  if (task) {
    sunken(ctx, task.x, y + 10, task.w, 44)
    text(ctx, task.label, task.textX, y + 20, { family: 'Space Mono', size: 16, color: INK })
  }
  // jam: lebar mengikuti teks (padding 18px kiri-kanan), rata kanan 12px dari tepi
  const w = measure(ctx, clock, { family: 'Space Mono', size: 18, weight: 700 }) + 36
  const cx = W - 12 - w
  sunken(ctx, cx, y + 10, w, 44)
  text(ctx, clock, cx + 18, y + 19, { family: 'Space Mono', size: 18, weight: 700, color: INK })
}

/** kursor panah putih (viewBox 22x30) */
export const CURSOR = 'M2 2 L2 24 L8 18 L12 28 L16 26 L12 16 L20 16 Z'
