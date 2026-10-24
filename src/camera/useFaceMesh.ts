// Pelacak wajah untuk stiker wajah: MediaPipe Face Landmarker, sampai 3 wajah, semuanya di perangkat.
// Deteksi berjalan di Web Worker (thread terpisah) supaya preview tetap mulus walau deteksi lambat di HP;
// browser tanpa dukungan worker memakai thread utama dengan jeda adaptif. Model dari /public/models (server
// bilik sendiri), mesin wasm dari CDN MediaPipe. Gambar tidak pernah dikirim ke mana pun dan data wajah tidak disimpan.
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import type { MeshFace } from '../render/motion'
import { MAX_FACES, MODEL, MP_WASM, toFace } from './faceMeshShared'

export type MeshStatus = 'off' | 'loading' | 'ready' | 'searching' | 'error'

/** sisi panjang gambar yang dikirim ke detektor (landmark 0–1, jadi ukuran kecil cukup & lebih cepat) */
const DETECT_SIDE = 480

type Result = { faces: MeshFace[]; took: number }
type Detector = {
  /** null = detektor masih sibuk dengan frame sebelumnya (frame ini dilewati) */
  detect: (v: HTMLVideoElement, t: number) => Promise<Result | null>
}

// ---------- detektor di Web Worker ----------

function workerDetector(): Promise<Detector> {
  return new Promise((resolve, reject) => {
    if (typeof Worker === 'undefined' || typeof createImageBitmap === 'undefined' || typeof OffscreenCanvas === 'undefined') {
      return reject(new Error('worker tidak didukung'))
    }
    const w = new Worker(new URL('./faceWorker.ts', import.meta.url), { type: 'module' })
    let pending: ((r: Result | null) => void) | null = null
    w.onmessage = (e) => {
      const m = e.data
      if (m.type === 'ready') {
        resolve({
          async detect(v, t) {
            if (pending) return null
            const vw = v.videoWidth
            const vh = v.videoHeight
            const k = Math.min(1, DETECT_SIDE / Math.max(vw, vh))
            let bitmap: ImageBitmap
            try {
              bitmap = await createImageBitmap(v, { resizeWidth: Math.round(vw * k), resizeHeight: Math.round(vh * k), resizeQuality: 'low' })
            } catch {
              bitmap = await createImageBitmap(v)
            }
            return new Promise<Result | null>((done) => {
              pending = done
              w.postMessage({ type: 'frame', bitmap, t }, [bitmap])
            })
          },
        })
      } else if (m.type === 'error') {
        w.terminate()
        reject(new Error(m.message))
      } else if (m.type === 'faces') {
        const done = pending
        pending = null
        done?.(m.faces ? { faces: m.faces, took: m.took } : null)
      }
    }
    w.onerror = (e) => {
      w.terminate()
      reject(new Error(e.message || 'worker gagal'))
    }
    w.postMessage({ type: 'init', origin: location.origin })
  })
}

// ---------- cadangan: thread utama, jeda adaptif ----------

async function mainDetector(): Promise<Detector> {
  const { FilesetResolver, FaceLandmarker } = await import('@mediapipe/tasks-vision')
  const files = await FilesetResolver.forVisionTasks(MP_WASM)
  const opts = (delegate: 'GPU' | 'CPU') => ({
    baseOptions: { modelAssetPath: MODEL, delegate },
    runningMode: 'VIDEO' as const,
    numFaces: MAX_FACES,
    minFaceDetectionConfidence: 0.5,
    minFacePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  })
  const lm = await FaceLandmarker.createFromOptions(files, opts('GPU')).catch(() => FaceLandmarker.createFromOptions(files, opts('CPU')))
  let nextAt = 0
  return {
    async detect(v, t) {
      // deteksi lambat (HP): beri jeda supaya deteksi memakai paling banyak ±40% waktu, sisanya untuk preview
      if (t < nextAt) return null
      const a = performance.now()
      const res = lm.detectForVideo(v, t)
      const took = performance.now() - a
      nextAt = t + took * 1.5
      return { faces: res.faceLandmarks.map(toFace), took }
    },
  }
}

let shared: Promise<Detector> | null = null
/** gagal dimuat sekali = stiker wajah disembunyikan selama tab ini terbuka */
let failed = false
export const meshFailed = () => failed

function detector() {
  shared ??= workerDetector()
    .catch(() => mainDetector())
    .catch((e) => {
      shared = null
      failed = true
      throw e
    })
  return shared
}

/** slot wajah yang dilacak antar frame (urutan slot tetap supaya tiap wajah punya kumpulan stikernya sendiri) */
export type MeshSlot = { face: MeshFace; seenAt: number; lostAt: number | null }

type VideoWithRVFC = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number
  cancelVideoFrameCallback?: (h: number) => void
}

/**
 * Lacak sampai 3 wajah selama `enabled`. Deteksi tiap 2 frame video (atau lebih jarang kalau detektor masih sibuk);
 * posisi di antaranya dihaluskan di sisi gambar (MeshSmoother). Nilai dibaca lewat fungsi supaya loop preview
 * tidak me-render ulang React.
 */
export function useFaceMesh(videoRef: RefObject<HTMLVideoElement | null>, enabled: boolean) {
  const [status, setStatus] = useState<MeshStatus>(failed ? 'error' : 'off')
  const slots = useRef<(MeshSlot | null)[]>([])
  const get = useCallback(() => slots.current, [])
  /** lama satu deteksi (ms, dihaluskan) untuk layar debug */
  const detectMs = useRef(0)
  const getDetectMs = useCallback(() => detectMs.current, [])

  useEffect(() => {
    if (!enabled) {
      if (!failed) setStatus('off')
      slots.current = []
      return
    }
    let alive = true
    let handle = 0
    let frame = 0
    const v = videoRef.current as VideoWithRVFC | null
    setStatus('loading')

    /** cocokkan wajah baru ke slot lama (pusat terdekat), sisanya ke slot kosong */
    const update = (faces: MeshFace[], now: number) => {
      const prev = slots.current
      const next: (MeshSlot | null)[] = prev.slice(0, MAX_FACES)
      const used = new Set<number>()
      const width = (f: MeshFace) => Math.hypot(f.right.x - f.left.x, f.right.y - f.left.y)
      for (const f of faces.slice(0, MAX_FACES)) {
        let best = -1
        let bestD = Infinity
        next.forEach((s, i) => {
          if (!s || used.has(i)) return
          const d = Math.hypot(s.face.cx - f.cx, s.face.cy - f.cy)
          if (d < bestD && d < width(s.face) * 1.2) {
            best = i
            bestD = d
          }
        })
        if (best < 0) {
          best = next.findIndex((s, i) => (!s || s.lostAt !== null) && !used.has(i))
          if (best < 0) best = next.length < MAX_FACES ? next.length : -1
        }
        if (best < 0) continue
        used.add(best)
        next[best] = { face: f, seenAt: now, lostAt: null }
      }
      // wajah yang tidak terlihat lagi: tandai waktu hilang; setelah 4 detik slotnya dikosongkan
      next.forEach((s, i) => {
        if (!s || used.has(i)) return
        if (s.lostAt === null) next[i] = { ...s, lostAt: now }
        else if (now - s.lostAt > 4000) next[i] = null
      })
      slots.current = next
      setStatus(next.some((s) => s && s.lostAt === null) ? 'ready' : 'searching')
    }

    detector()
      .then((d) => {
        if (!alive) return
        setStatus('searching')
        const rvfc = !!v && typeof v.requestVideoFrameCallback === 'function'
        const schedule = () => {
          if (!alive || !v) return
          handle = rvfc ? v.requestVideoFrameCallback!(tick) : requestAnimationFrame(tick)
        }
        const tick = () => {
          // deteksi tiap 2 frame: cukup halus setelah dihaluskan, separuh beban
          if (v && v.readyState >= 2 && v.videoWidth && frame++ % 2 === 0) {
            const now = performance.now()
            d.detect(v, now)
              .then((r) => {
                if (!alive || !r) return
                detectMs.current = detectMs.current ? detectMs.current * 0.8 + r.took * 0.2 : r.took
                update(r.faces, now)
              })
              .catch(() => {
                // frame belum siap: coba lagi berikutnya
              })
          }
          schedule()
        }
        schedule()
      })
      .catch(() => alive && setStatus('error'))

    return () => {
      alive = false
      if (v && typeof v.cancelVideoFrameCallback === 'function') v.cancelVideoFrameCallback(handle)
      else cancelAnimationFrame(handle)
    }
  }, [enabled, videoRef])

  return { status, get, getDetectMs }
}
