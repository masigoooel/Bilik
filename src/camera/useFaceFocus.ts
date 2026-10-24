// Wajah di frame kamera: titik pusat untuk lensa yang mengikuti wajah (gembung, pusaran, riak, ...),
// kotak + titik mata/hidung/mulut untuk hiasan efek gerak. Hanya wajah terbesar yang dipakai.
// Pakai FaceDetector bawaan browser kalau ada (tanpa unduhan). Kalau tidak ada, MediaPipe dimuat
// hanya saat fitur dinyalakan (wasm ±11 MB dari CDN, model ±230 KB). Gambar tidak pernah dikirim ke mana pun.
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import type { Focus } from '../render/pipeline'
import type { RawFace } from '../render/motion'

export type FaceStatus = 'off' | 'loading' | 'ready' | 'searching' | 'error'

type Detector = { detect: (v: HTMLVideoElement, t: number) => Promise<RawFace | null>; close: () => void }

const MP_VERSION = '0.10.35'
const MP_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`
const MP_MODEL = 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'

type NativeFace = { boundingBox: DOMRectReadOnly; landmarks?: { type: string; locations: { x: number; y: number }[] }[] }
type NativeDetector = { detect: (src: CanvasImageSource) => Promise<NativeFace[]> }
type NativeCtor = new (o: { maxDetectedFaces: number; fastMode: boolean }) => NativeDetector

/** browser punya deteksi wajah bawaan (Chrome Android, macOS, ChromeOS) */
export const hasNativeFaceDetector = () => typeof window !== 'undefined' && 'FaceDetector' in window

async function nativeDetector(): Promise<Detector> {
  const Ctor = (window as unknown as { FaceDetector: NativeCtor }).FaceDetector
  const d = new Ctor({ maxDetectedFaces: 3, fastMode: true })
  // uji sekali: di beberapa platform konstruktornya ada tapi tidak didukung
  return {
    async detect(v) {
      const faces = await d.detect(v)
      if (!faces.length) return null
      const f = faces.reduce((a, b) => (b.boundingBox.width * b.boundingBox.height > a.boundingBox.width * a.boundingBox.height ? b : a))
      const b = f.boundingBox
      const W = v.videoWidth
      const H = v.videoHeight
      const mid = (pts: { x: number; y: number }[]) => ({ x: pts.reduce((s, p) => s + p.x, 0) / pts.length / W, y: pts.reduce((s, p) => s + p.y, 0) / pts.length / H })
      const marks = (type: string) => (f.landmarks ?? []).filter((l) => l.type === type && l.locations.length).map((l) => mid(l.locations))
      const eyes = marks('eye')
      const [nose] = marks('nose')
      const [mouth] = marks('mouth')
      return {
        x: (b.x + b.width / 2) / W,
        y: (b.y + b.height / 2) / H,
        w: b.width / W,
        h: b.height / H,
        eyes: eyes.length >= 2 ? [eyes[0], eyes[1]] : undefined,
        nose,
        mouth,
      }
    },
    close() {},
  }
}

async function mediapipeDetector(): Promise<Detector> {
  const { FilesetResolver, FaceDetector } = await import('@mediapipe/tasks-vision')
  const files = await FilesetResolver.forVisionTasks(MP_WASM)
  const fd = await FaceDetector.createFromOptions(files, {
    baseOptions: { modelAssetPath: MP_MODEL, delegate: 'CPU' },
    runningMode: 'VIDEO',
    minDetectionConfidence: 0.5,
  })
  return {
    async detect(v, t) {
      const r = fd.detectForVideo(v, t)
      const det = r.detections.filter((d) => d.boundingBox).sort((a, b) => b.boundingBox!.width * b.boundingBox!.height - a.boundingBox!.width * a.boundingBox!.height)[0]
      const b = det?.boundingBox
      if (!b) return null
      // titik kunci BlazeFace (0–1): mata kanan, mata kiri, ujung hidung, mulut, telinga kanan, telinga kiri
      const k = det.keypoints ?? []
      const p = (i: number) => (k[i] ? { x: k[i].x, y: k[i].y } : undefined)
      return {
        x: (b.originX + b.width / 2) / v.videoWidth,
        y: (b.originY + b.height / 2) / v.videoHeight,
        w: b.width / v.videoWidth,
        h: b.height / v.videoHeight,
        eyes: k.length >= 2 ? [p(0)!, p(1)!] : undefined,
        nose: p(2),
        mouth: p(3),
      }
    },
    close: () => fd.close(),
  }
}

let shared: Promise<Detector> | null = null

function detector() {
  shared ??= (hasNativeFaceDetector() ? nativeDetector().catch(() => mediapipeDetector()) : mediapipeDetector()).catch((e) => {
    shared = null
    throw e
  })
  return shared
}

const EVERY_MS = 120
/** kalau wajah hilang selama ini, pusat kembali pelan-pelan ke tengah */
const LOST_MS = 1200

/**
 * Lacak pusat wajah selama `enabled`. Nilai dibaca lewat fungsi (bukan state) supaya loop preview
 * tidak me-render ulang React tiap deteksi. Koordinat 0–1 relatif frame video mentah (belum dicerminkan).
 */
export function useFaceFocus(videoRef: RefObject<HTMLVideoElement | null>, enabled: boolean) {
  const [status, setStatus] = useState<FaceStatus>('off')
  const focus = useRef<Focus | null>(null)
  const get = useCallback(() => focus.current, [])
  /** wajah terakhir (tanpa dihaluskan; penghalusan per frame di FaceSmoother) & kapan terakhir terlihat */
  const face = useRef<{ face: RawFace | null; seenAt: number }>({ face: null, seenAt: 0 })
  const getFace = useCallback(() => face.current, [])

  useEffect(() => {
    if (!enabled) {
      setStatus('off')
      focus.current = null
      face.current = { face: null, seenAt: 0 }
      return
    }
    let alive = true
    let timer = 0
    let lastSeen = 0
    setStatus('loading')
    detector()
      .then((d) => {
        if (!alive) return
        setStatus('searching')
        const tick = async () => {
          const v = videoRef.current
          if (v && v.readyState >= 2 && v.videoWidth) {
            try {
              const f = await d.detect(v, performance.now())
              if (!alive) return
              const now = performance.now()
              if (f) {
                lastSeen = now
                face.current = { face: f, seenAt: now }
                const c = focus.current ?? f
                // haluskan supaya efek tidak bergetar
                focus.current = { x: c.x + (f.x - c.x) * 0.45, y: c.y + (f.y - c.y) * 0.45 }
                setStatus('ready')
              } else if (focus.current && now - lastSeen > LOST_MS) {
                const c = focus.current
                focus.current = { x: c.x + (0.5 - c.x) * 0.2, y: c.y + (0.5 - c.y) * 0.2 }
                setStatus('searching')
              }
            } catch {
              // frame belum siap: coba lagi di giliran berikutnya
            }
          }
          if (alive) timer = window.setTimeout(tick, EVERY_MS)
        }
        tick()
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [enabled, videoRef])

  return { status, get, getFace }
}
