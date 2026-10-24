// Boomerang: GIF template utuh, tiap slot memutar rekaman pose-nya maju lalu mundur.
import { GIFEncoder, applyPalette, quantize } from 'gifenc'
import { renderTemplate, type PhotoSource } from '../render/renderTemplate'
import type { Template, TextValues } from '../templates/types'
import { blobToCanvas, type Photo } from './photo'
import { applyFilter, filterById } from '../render/filters'
import { lowMemory } from './device'
import { drawStickers, type Sticker } from './stickers'

/** sisi terpanjang GIF: cukup tajam untuk dibagikan, file tetap ringan (lebih kecil di perangkat bermemori terbatas) */
const LONG_SIDE = lowMemory ? 540 : 720
const DELAY_MS = 80

export const canBoomerang = (photos: (Photo | null)[], count: number) =>
  photos.length >= count && photos.slice(0, count).every((p) => !!p?.burst && p.burst.length >= 3)

/** frame rekaman (tanpa filter) + filter foto itu, lalu stiker wajah di atasnya: sama dengan fotonya (juga setelah filter diganti) */
async function frame(blob: Blob, p: Photo, stickers?: Blob): Promise<PhotoSource> {
  const c = await blobToCanvas(blob)
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  applyFilter(ctx, filterById(p.filter), { strength: p.filterStrength, seed: 7 })
  if (stickers) {
    const s = await blobToCanvas(stickers)
    ctx.drawImage(s, 0, 0, c.width, c.height)
    s.width = s.height = 0
  }
  return { source: c, width: c.width, height: c.height }
}

const tick = () => new Promise((r) => setTimeout(r, 0))

export const BOOMERANG_SIDE = LONG_SIDE

export async function makeBoomerang(
  t: Template,
  photos: Photo[],
  texts: Partial<TextValues>,
  hue: number,
  stickers: Sticker[],
  onProgress?: (p: number) => void,
): Promise<Blob> {
  const bursts = await Promise.all(photos.slice(0, t.photoCount).map((p) => Promise.all(p.burst!.map((b, i) => frame(b, p, p.burstStickers?.[i])))))
  const n = Math.min(...bursts.map((b) => b.length))
  // maju lalu mundur tanpa mengulang frame ujung
  const order = [...Array(n).keys(), ...[...Array(n).keys()].reverse().slice(1, -1)]
  const scale = LONG_SIDE / Math.max(t.width, t.height)
  const enc = GIFEncoder()
  for (const [k, i] of order.entries()) {
    const canvas = await renderTemplate(t, { photos: bursts.map((b) => b[i]), texts, scale, hue })
    const { width: w, height: h } = canvas
    const cx = canvas.getContext('2d')!
    cx.setTransform(1, 0, 0, 1, 0, 0)
    drawStickers(cx, stickers, w, h)
    const rgba = canvas.getContext('2d')!.getImageData(0, 0, w, h).data
    const palette = quantize(rgba, 256)
    enc.writeFrame(applyPalette(rgba, palette), w, h, { palette, delay: DELAY_MS, repeat: 0 })
    canvas.width = canvas.height = 0
    onProgress?.((k + 1) / order.length)
    // beri napas ke UI (progress) di sela frame
    await tick()
  }
  enc.finish()
  return new Blob([enc.bytes()], { type: 'image/gif' })
}
