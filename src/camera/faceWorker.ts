// Worker deteksi wajah (MediaPipe Face Landmarker) untuk stiker wajah. Deteksi berjalan di thread terpisah,
// jadi preview kamera tetap mulus walau deteksi lambat di HP. Hanya angka posisi wajah yang dikirim balik.
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import { MP_WASM, MODEL, MAX_FACES, toFace } from './faceMeshShared'

type InMsg = { type: 'init'; origin: string } | { type: 'frame'; bitmap: ImageBitmap; t: number }

let lm: FaceLandmarker | null = null

async function init(origin: string) {
  const files = await FilesetResolver.forVisionTasks(MP_WASM)
  const opts = (delegate: 'GPU' | 'CPU') => ({
    baseOptions: { modelAssetPath: new URL(MODEL, origin).href, delegate },
    runningMode: 'VIDEO' as const,
    numFaces: MAX_FACES,
    minFaceDetectionConfidence: 0.5,
    minFacePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  })
  // GPU (OffscreenCanvas) lebih cepat; tidak tersedia di semua browser → CPU
  lm = await FaceLandmarker.createFromOptions(files, opts('GPU')).catch(() => FaceLandmarker.createFromOptions(files, opts('CPU')))
}

self.onmessage = async (e: MessageEvent<InMsg>) => {
  const m = e.data
  if (m.type === 'init') {
    try {
      await init(m.origin)
      self.postMessage({ type: 'ready' })
    } catch (err) {
      self.postMessage({ type: 'error', message: String(err) })
    }
    return
  }
  if (m.type === 'frame') {
    if (!lm) return m.bitmap.close()
    const a = performance.now()
    try {
      const res = lm.detectForVideo(m.bitmap, m.t)
      self.postMessage({ type: 'faces', faces: res.faceLandmarks.map(toFace), took: performance.now() - a })
    } catch {
      self.postMessage({ type: 'faces', faces: null, took: performance.now() - a })
    } finally {
      m.bitmap.close()
    }
  }
}
