import { useCallback } from 'react'
import { cameraPermissionGranted, cameraSupport } from '../lib/camera'
import { templateById } from '../templates'
import { useApp } from './AppState'

/**
 * Lanjut ke sesi foto tanpa menghapus foto yang sudah ada:
 * semua slot terisi → langsung cek hasil, izin kamera sudah ada → kamera, belum → layar izin.
 */
export function useStartCamera() {
  const { templateId, photos, go } = useApp()
  /** fresh: sesi baru ("foto lagi"), foto lama sudah dihapus pemanggil */
  return useCallback(async (opts?: { fresh?: boolean }) => {
    const t = templateById(templateId)
    if (!opts?.fresh && t && t.slots.every((_, i) => photos[i])) return go('review')
    const ok = cameraSupport() === null && (await cameraPermissionGranted())
    go(ok ? 'camera' : 'permission')
  }, [templateId, photos, go])
}
