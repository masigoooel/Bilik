// frame kamera → crop cover ke rasio slot → efek lensa (WebGL) → filter warna.
// Fungsi yang sama dipakai preview (resolusi kecil), thumbnail, foto akhir (resolusi penuh), dan unggahan,
// jadi hasil PNG identik dengan yang terlihat di preview.

import { applyFilter, filterById, type FilterPreset } from './filters'
import { lensById, lensRenderer, type LensPreset } from './lens'
import type { FrameMap } from './motion'

export type FrameSettings = {
  filterId: string
  /** 0–100 */
  filterStrength: number
  /** 'tanpa' = tanpa lensa */
  lensId: string
  /** 0–100 */
  lensStrength: number
  /** hasil dicerminkan (default tidak) */
  mirrorResult: boolean
}

/** titik fokus (pusat wajah), 0–1 relatif frame sumber mentah (belum dicerminkan) */
export type Focus = { x: number; y: number }

export type Pipeline = {
  filter: FilterPreset
  filterStrength: number
  lens: LensPreset | null
  lensStrength: number
  /** cerminkan sumber sebelum lensa (preview kamera depan terlihat seperti cermin) */
  preFlip: boolean
  /** cerminkan setelah lensa, sebelum filter */
  postFlip: boolean
  /** pusat lensa yang mengikuti wajah; dibaca tiap frame (null = tengah) */
  focus?: () => Focus | null
  /**
   * stiker wajah: digambar setelah filter warna (stiker tidak ikut terfilter). `map` memetakan titik video mentah (0–1)
   * ke piksel kanvas ini (sudah memperhitungkan crop & cermin). Mengembalikan true kalau ada yang digambar
   */
  overlay?: (ctx: CanvasRenderingContext2D, w: number, h: number, map: FrameMap) => boolean | void
}

/**
 * Preview kamera depan = cermin. Lensa selalu dihitung di orientasi preview (preFlip),
 * lalu foto akhir dibalik lagi kalau "mirror hasil" mati. Dengan begitu efek asimetris
 * (cermin, light leak) tetap sama dengan preview, hanya orientasi kiri-kanannya yang mengikuti setelan.
 */
export function pipelineFor(s: FrameSettings, mode: 'preview' | 'capture' | 'upload', front: boolean): Pipeline {
  const lens = lensRenderer() ? lensById(s.lensId) : null
  const base = { filter: filterById(s.filterId), filterStrength: s.filterStrength / 100, lens, lensStrength: s.lensStrength / 100 }
  if (mode === 'upload') return { ...base, preFlip: false, postFlip: s.mirrorResult }
  if (mode === 'preview') return { ...base, preFlip: front, postFlip: false }
  return { ...base, preFlip: front, postFlip: front !== s.mirrorResult }
}

export type Crop = { x: number; y: number; w: number; h: number }

/** peta titik video mentah (0–1) → piksel kanvas keluaran outW×outH (crop cover di tengah, dicerminkan bila perlu) */
export function frameMap(srcW: number, srcH: number, outW: number, outH: number, mirrored: boolean): FrameMap {
  const crop = coverCrop(srcW, srcH, outW / outH)
  return (fx, fy) => {
    const x = ((fx * srcW - crop.x) / crop.w) * outW
    return [mirrored ? outW - x : x, ((fy * srcH - crop.y) / crop.h) * outH]
  }
}

/** hasil akhir dicerminkan? (preview kamera depan, atau "mirror hasil") */
export const isMirrored = (p: Pipeline) => p.preFlip !== p.postFlip

/** object-fit: cover, fokus di tengah */
export function coverCrop(srcW: number, srcH: number, aspect: number): Crop {
  let w = srcW
  let h = srcW / aspect
  if (h > srcH) {
    h = srcH
    w = srcH * aspect
  }
  return { x: (srcW - w) / 2, y: (srcH - h) / 2, w, h }
}

let shrinkCanvas: HTMLCanvasElement | null = null

/** perkecil sumber besar (mis. video 4K untuk preview kecil) sebelum diunggah ke GPU */
function shrinkSource(source: CanvasImageSource, srcW: number, srcH: number, f: number) {
  shrinkCanvas ??= document.createElement('canvas')
  const w = Math.max(1, Math.round(srcW * f))
  const h = Math.max(1, Math.round(srcH * f))
  if (shrinkCanvas.width !== w || shrinkCanvas.height !== h) {
    shrinkCanvas.width = w
    shrinkCanvas.height = h
  }
  shrinkCanvas.getContext('2d')!.drawImage(source, 0, 0, w, h)
  return { source: shrinkCanvas, srcW: w, srcH: h }
}

let stageCanvas: HTMLCanvasElement | null = null

/** kanvas perantara (GPU) seukuran output */
function stageCtx(w: number, h: number) {
  stageCanvas ??= document.createElement('canvas')
  if (stageCanvas.width !== w || stageCanvas.height !== h) {
    stageCanvas.width = w
    stageCanvas.height = h
  }
  return stageCanvas.getContext('2d')!
}

/**
 * Proses satu frame ke `out` berukuran outW x outH.
 * `seed` membuat grain deterministik (thumbnail); tanpa seed grain acak per frame.
 */
export function processFrame(
  source: CanvasImageSource & TexImageSource,
  srcW: number,
  srcH: number,
  out: HTMLCanvasElement,
  outW: number,
  outH: number,
  p: Pipeline,
  seed?: number,
) {
  if (out.width !== outW || out.height !== outH) {
    out.width = outW
    out.height = outH
  }
  const ctx = out.getContext('2d', { willReadFrequently: true })!
  const gl = p.lens ? lensRenderer() : null
  const crop = coverCrop(srcW, srcH, outW / outH)
  // < 1 artinya sumber (mis. video 4K) jauh lebih besar dari output (preview)
  const ratio = Math.max(outW / crop.w, outH / crop.h)

  if (gl && p.lens) {
    // lensa butuh area di luar crop, jadi sisakan margin 1,5x. sumber besar diperkecil dulu di GPU
    let src: CanvasImageSource & TexImageSource = source
    let sw = srcW
    let sh = srcH
    const f = Math.min(ratio * 1.5 < 0.75 ? ratio * 1.5 : 1, gl.maxTexture / Math.max(sw, sh))
    if (f < 1) {
      const s = shrinkSource(source, sw, sh, f)
      src = s.source
      sw = s.srcW
      sh = s.srcH
    }
    const lc = coverCrop(sw, sh, outW / outH)
    // pusat wajah → koordinat di dalam area crop (0–1)
    const fo = p.lens.follow ? p.focus?.() : null
    const center = fo ? { x: (fo.x * sw - lc.x) / lc.w, y: (fo.y * sh - lc.y) / lc.h } : null
    gl.draw({ source: src, srcW: sw, srcH: sh, crop: lc, outW, outH, lens: p.lens, strength: p.lensStrength, preFlip: p.preFlip, postFlip: p.postFlip, center })
    ctx.drawImage(gl.canvas, 0, 0)
  } else {
    // sumber besar: skala turun di kanvas GPU dulu, baru salin hasil kecil ke kanvas CPU.
    // menggambar video 4K langsung ke kanvas CPU memaksa membaca seluruh frame dari GPU tiap frame
    const target = ratio < 0.75 ? stageCtx(outW, outH) : ctx
    target.save()
    target.imageSmoothingEnabled = true
    target.imageSmoothingQuality = 'high'
    if (p.preFlip !== p.postFlip) {
      target.translate(outW, 0)
      target.scale(-1, 1)
    }
    target.drawImage(source, crop.x, crop.y, crop.w, crop.h, 0, 0, outW, outH)
    target.restore()
    if (target !== ctx) ctx.drawImage(target.canvas, 0, 0)
  }
  applyFilter(ctx, p.filter, { strength: p.filterStrength, seed })
  // stiker wajah di atas filter: warnanya tetap
  p.overlay?.(ctx, outW, outH, frameMap(srcW, srcH, outW, outH, isMirrored(p)))
}
