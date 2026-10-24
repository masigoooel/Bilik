import { useEffect, useRef, useState, type RefObject } from 'react'
import { coverCrop, processFrame, type Pipeline } from '../render/pipeline'

export type PreviewStats = { fps: number; procMs: number; w: number; h: number; camW: number; camH: number }

/** sisi terpanjang preview per level; makin berat → turun level (foto akhir tetap resolusi penuh) */
const LEVELS = [960, 720, 560, 420, 320]
/** batas waktu proses per frame. 24 fps = 41ms per frame, sisakan ruang untuk browser */
const SLOW_MS = 26
const FAST_MS = 11

type VideoWithRVFC = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number
  cancelVideoFrameCallback?: (h: number) => void
}

/**
 * Loop preview: tiap frame video baru diproses lewat pipeline yang sama dengan foto akhir
 * ke <canvas>. Resolusi preview turun otomatis kalau proses terlalu lama.
 */
export function usePreviewLoop(
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  opts: { aspect: number; pipeline: Pipeline; enabled: boolean },
) {
  const optsRef = useRef(opts)
  optsRef.current = opts
  const [stats, setStats] = useState<PreviewStats | null>(null)

  useEffect(() => {
    const v = videoRef.current as VideoWithRVFC | null
    if (!opts.enabled || !v) return
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const minLevel = coarse ? 1 : 0
    let level = minLevel
    let ema = 0
    let sinceAdapt = 0
    let frames = 0
    let windowStart = performance.now()
    let alive = true
    let handle = 0
    const rvfc = typeof v.requestVideoFrameCallback === 'function'

    const schedule = () => {
      if (!alive) return
      handle = rvfc ? v.requestVideoFrameCallback!(tick) : requestAnimationFrame(tick)
    }

    const tick = () => {
      const c = canvasRef.current
      const { aspect, pipeline } = optsRef.current
      if (c && v.readyState >= 2 && v.videoWidth) {
        const crop = coverCrop(v.videoWidth, v.videoHeight, aspect)
        const L = Math.min(LEVELS[level], Math.max(crop.w, crop.h))
        const w = Math.round(aspect >= 1 ? L : L * aspect)
        const h = Math.round(aspect >= 1 ? L / aspect : L)
        const t0 = performance.now()
        processFrame(v, v.videoWidth, v.videoHeight, c, w, h, pipeline)
        const dt = performance.now() - t0
        ema = ema ? ema * 0.85 + dt * 0.15 : dt
        frames++
        sinceAdapt++
        if (sinceAdapt > 15 && ema > SLOW_MS && level < LEVELS.length - 1) {
          level++
          sinceAdapt = 0
          ema = 0
        } else if (sinceAdapt > 120 && ema < FAST_MS && level > minLevel) {
          level--
          sinceAdapt = 0
          ema = 0
        }
        const now = performance.now()
        if (now - windowStart >= 1000) {
          setStats({ fps: (frames * 1000) / (now - windowStart), procMs: ema, w, h, camW: v.videoWidth, camH: v.videoHeight })
          frames = 0
          windowStart = now
        }
      }
      schedule()
    }

    schedule()
    return () => {
      alive = false
      if (rvfc) v.cancelVideoFrameCallback?.(handle)
      else cancelAnimationFrame(handle)
    }
  }, [opts.enabled, videoRef, canvasRef])

  return stats
}
