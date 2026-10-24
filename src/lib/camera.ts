// Satu stream kamera dibagi antar layar (izin → kamera) supaya tidak minta izin dua kali.
import { CAMERA_IDEAL } from './device'

let stream: MediaStream | null = null
let currentFacing: 'user' | 'environment' = 'user'

export type CameraError = 'unsupported' | 'insecure' | 'denied' | 'notfound' | 'busy' | 'unknown'

export function cameraSupport(): CameraError | null {
  if (typeof window !== 'undefined' && !window.isSecureContext) return 'insecure'
  if (!navigator.mediaDevices?.getUserMedia) return 'unsupported'
  return null
}

export async function cameraPermissionGranted(): Promise<boolean> {
  try {
    const status = await navigator.permissions?.query({ name: 'camera' as PermissionName })
    return status?.state === 'granted'
  } catch {
    return false
  }
}

export async function openCamera(facing: 'user' | 'environment' = currentFacing): Promise<MediaStream> {
  if (stream && stream.active && facing === currentFacing) return stream
  stopCamera()
  const s = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: facing },
      // minta resolusi setinggi mungkin (4K); perangkat bermemori terbatas cukup 1080p
      width: { ideal: CAMERA_IDEAL.width },
      height: { ideal: CAMERA_IDEAL.height },
    },
  })
  stream = s
  currentFacing = facing
  return s
}

export function facing() {
  return currentFacing
}

export function stopCamera() {
  stream?.getTracks().forEach((t) => t.stop())
  stream = null
}

export function cameraErrorOf(e: unknown): CameraError {
  const name = (e as { name?: string })?.name
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied'
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'notfound'
  if (name === 'NotReadableError' || name === 'AbortError') return 'busy'
  return 'unknown'
}

export const CAMERA_ERROR_TEXT: Record<CameraError, string> = {
  unsupported: 'browser ini belum mendukung kamera. coba chrome atau safari terbaru, atau pakai foto dari galeri.',
  insecure: 'kamera hanya bisa dibuka lewat koneksi https. untuk sementara, pakai foto dari galeri.',
  denied: 'akses kamera ditolak. kamu bisa mengizinkannya lewat pengaturan situs di browser, atau pakai foto dari galeri.',
  notfound: 'kamera tidak ditemukan di perangkat ini. pakai foto dari galeri saja.',
  busy: 'kamera sedang dipakai aplikasi lain. tutup aplikasinya lalu coba lagi.',
  unknown: 'kamera belum bisa dibuka. coba lagi, atau pakai foto dari galeri.',
}
