// Deteksi perangkat bermemori terbatas: iPhone/iPad (Safari membatasi memori kanvas per tab)
// atau perangkat dengan RAM ≤ 4 GB. Di sana resolusi foto & rekaman diturunkan supaya tab tidak crash.

const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''

/** iPhone/iPad, termasuk iPad yang mengaku Mac */
export const isIOS = /iP(hone|ad|od)/.test(ua) || (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

const deviceMemory = typeof navigator !== 'undefined' ? ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) : 8

export const lowMemory = isIOS || deviceMemory <= 4

/**
 * Sisi terpanjang foto yang disimpan. Template terbesar 1200×1800, jadi 2048 px masih lebih tajam dari hasil akhir;
 * perangkat lain tetap resolusi penuh kamera (≤ 4K).
 */
export const PHOTO_MAX_SIDE = lowMemory ? 2048 : 3840

/** resolusi kamera yang diminta */
export const CAMERA_IDEAL = lowMemory ? { width: 1920, height: 1080 } : { width: 3840, height: 2160 }
