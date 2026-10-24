// Bagian bersama pelacak wajah (thread utama & worker): alamat model/wasm dan cara membaca landmark.
import type { MeshFace } from '../render/motion'

const MP_VERSION = '0.10.35'
export const MP_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`
/** model dari server bilik sendiri (public/models) */
export const MODEL = '/models/face_landmarker.task'
export const MAX_FACES = 3

// titik landmark Face Mesh: pipi kiri/kanan (lebar wajah), dahi atas, dagu
const CHEEK_L = 234
const CHEEK_R = 454
const TOP = 10
const CHIN = 152

/** wajah dari landmark (0–1 relatif gambar) */
export function toFace(lm: { x: number; y: number }[]): MeshFace {
  const l = lm[CHEEK_L]
  const r = lm[CHEEK_R]
  const top = lm[TOP]
  const chin = lm[CHIN]
  // titik tengah kepala (bukan wajah): puncak kepala diperkirakan 30% tinggi wajah di atas dahi (rambut/tempurung)
  const skull = top.y - (chin.y - top.y) * 0.3
  return {
    cx: (l.x + r.x) / 2,
    cy: (skull + chin.y) / 2,
    left: { x: l.x, y: l.y },
    right: { x: r.x, y: r.y },
    top: { x: top.x, y: top.y },
    chin: { x: chin.x, y: chin.y },
  }
}
