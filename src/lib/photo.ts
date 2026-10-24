import { coverCrop, frameMap, isMirrored, processFrame, type Pipeline } from '../render/pipeline'
import { applyFilter, filterById } from '../render/filters'
import type { PhotoSource } from '../render/renderTemplate'
import { PHOTO_MAX_SIDE } from './device'

export type Photo = {
  url: string
  blob: Blob
  width: number
  height: number
  filter: string
  /** kekuatan filter 0–1 */
  filterStrength: number
  lens: string | null
  /** versi tanpa filter (lensa & orientasi sama), supaya filter bisa diganti di cek hasil */
  raw?: Blob
  /** rekaman pendek sebelum jepret (JPEG kecil, tanpa filter, lama → baru) untuk boomerang; tidak ada untuk foto unggahan */
  burst?: Blob[]
  /** stiker wajah (PNG transparan seukuran foto), digambar di atas filter */
  stickers?: Blob
  /** stiker wajah per frame rekaman boomerang (PNG transparan, sejajar `burst`) */
  burstStickers?: Blob[]
}

/** batas aman sisi terpanjang foto yang diproses (memori HP); lihat device.ts */
const MAX_SIDE = PHOTO_MAX_SIDE

function toBlob(canvas: HTMLCanvasElement, type = 'image/jpeg', quality = 0.92) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('gagal membuat gambar'))), type, quality),
  )
}

/**
 * Ambil foto di resolusi penuh sumber: crop ke rasio slot (cover, tengah),
 * lalu lensa + filter lewat pipeline yang sama dengan preview.
 * Hasilnya JPEG di memori, tidak pernah diunggah.
 */
export async function capturePhoto(
  source: CanvasImageSource & TexImageSource,
  srcW: number,
  srcH: number,
  aspect: number,
  p: Pipeline,
): Promise<Photo> {
  const crop = coverCrop(srcW, srcH, aspect)
  const k = Math.min(1, MAX_SIDE / Math.max(crop.w, crop.h))
  const w = Math.round(crop.w * k)
  const h = Math.round(crop.h * k)
  const canvas = document.createElement('canvas')
  // versi mentah dulu (lensa tanpa filter & tanpa stiker), lalu filter, lalu stiker di atasnya: hasil identik dengan preview
  processFrame(source, srcW, srcH, canvas, w, h, { ...p, filter: filterById('normal'), overlay: undefined })
  const raw = await toBlob(canvas)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  applyFilter(ctx, p.filter, { strength: p.filterStrength })
  let stickers: Blob | undefined
  if (p.overlay) {
    const layer = document.createElement('canvas')
    layer.width = w
    layer.height = h
    if (p.overlay(layer.getContext('2d')!, w, h, frameMap(srcW, srcH, w, h, isMirrored(p)))) {
      ctx.drawImage(layer, 0, 0)
      stickers = await toBlob(layer, 'image/png')
    }
    layer.width = layer.height = 0
  }
  const blob = await toBlob(canvas)
  canvas.width = canvas.height = 0
  return { blob, url: URL.createObjectURL(blob), width: w, height: h, filter: p.filter.id, filterStrength: p.filterStrength, lens: p.lens?.id ?? null, raw, stickers }
}

/** gambar blob ke kanvas baru */
export async function blobToCanvas(blob: Blob): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(blob)
  try {
    const img = await loadImage(url)
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    c.getContext('2d', { willReadFrequently: true })!.drawImage(img, 0, 0)
    return c
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Ganti filter foto yang sudah diambil (dari versi mentahnya, resolusi penuh). Foto lama tidak diubah;
 * pemanggil yang melepas url lama. Tanpa versi mentah, foto dikembalikan apa adanya.
 */
export async function refilterPhoto(photo: Photo, filterId: string, strength = 1): Promise<Photo> {
  if (!photo.raw) return photo
  const c = await blobToCanvas(photo.raw)
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  applyFilter(ctx, filterById(filterId), { strength })
  // stiker wajah tetap di atas, tidak ikut filter baru
  if (photo.stickers) {
    const s = await blobToCanvas(photo.stickers)
    ctx.drawImage(s, 0, 0, c.width, c.height)
    s.width = s.height = 0
  }
  const blob = await toBlob(c)
  c.width = c.height = 0
  return { ...photo, blob, url: URL.createObjectURL(blob), filter: filterId, filterStrength: strength }
}

export function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('gagal memuat gambar'))
    img.src = url
  })
}

/** foto dari galeri/file: dibaca lokal (orientasi EXIF dihormati browser), lalu lewat pipeline yang sama */
export async function photoFromFile(file: File, aspect: number, p: Pipeline): Promise<Photo> {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    return await capturePhoto(img, img.naturalWidth, img.naturalHeight, aspect, p)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function toPhotoSources(photos: (Photo | null)[]): Promise<(PhotoSource | null)[]> {
  return Promise.all(
    photos.map(async (p) => {
      if (!p) return null
      const img = await loadImage(p.url)
      return { source: img, width: img.naturalWidth, height: img.naturalHeight }
    }),
  )
}

export function revokePhoto(p: Photo | null | undefined) {
  if (p) URL.revokeObjectURL(p.url)
}

/** hasil render selalu tertutup latar, jadi disalin ke canvas opaque: PNG jadi RGB (lebih kecil dari RGBA) */
export function canvasToPng(canvas: HTMLCanvasElement) {
  const flat = document.createElement('canvas')
  flat.width = canvas.width
  flat.height = canvas.height
  flat.getContext('2d', { alpha: false })!.drawImage(canvas, 0, 0)
  return toBlob(flat, 'image/png')
}
