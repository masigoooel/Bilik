import type { Slot } from './types'

export type Format = 'strip' | '4r' | 'portrait'

export const FORMATS: Record<Format, { width: number; height: number; label: string }> = {
  strip: { width: 600, height: 1800, label: 'strip 2x6' },
  '4r': { width: 1200, height: 1800, label: '4r' },
  portrait: { width: 1080, height: 1350, label: '4:5' },
}

export const PHOTO_COUNTS = [1, 2, 3, 4, 6] as const
export type PhotoCount = (typeof PHOTO_COUNTS)[number]

/** format yang tersedia untuk tiap jumlah foto */
export const FORMATS_BY_COUNT: Record<PhotoCount, Format[]> = {
  1: ['4r', 'portrait'],
  2: ['strip', 'portrait'],
  3: ['strip', '4r'],
  4: ['strip', '4r'],
  6: ['4r', 'portrait'],
}

export type Rect = { x: number; y: number; w: number; h: number }
export type Pad = { t: number; r: number; b: number; l: number }

function grid(area: Rect, cols: number, rows: number, gap: number): Rect[] {
  const w = (area.w - gap * (cols - 1)) / cols
  const h = (area.h - gap * (rows - 1)) / rows
  const out: Rect[] = []
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) out.push({ x: area.x + c * (w + gap), y: area.y + r * (h + gap), w, h })
  return out
}

/** susun kotak foto di dalam `area` sesuai format & jumlah foto */
export function arrange(format: Format, count: number, area: Rect, gap: number): Rect[] {
  if (format === 'strip') return grid(area, 1, count, gap)
  if (format === '4r') {
    if (count === 1) return grid(area, 1, 1, gap)
    if (count === 2) return grid(area, 1, 2, gap)
    if (count === 3) {
      const topH = (area.h - gap) * 0.56
      const top = { x: area.x, y: area.y, w: area.w, h: topH }
      const bottom = grid({ x: area.x, y: area.y + topH + gap, w: area.w, h: area.h - topH - gap }, 2, 1, gap)
      return [top, ...bottom]
    }
    if (count === 4) return grid(area, 2, 2, gap)
    return grid(area, 2, 3, gap)
  }
  if (count === 1) return grid(area, 1, 1, gap)
  if (count === 2) return grid(area, 2, 1, gap)
  if (count === 3) return grid(area, 3, 1, gap)
  if (count === 4) return grid(area, 2, 2, gap)
  return grid(area, 3, 2, gap)
}

export function slotsFor(
  format: Format,
  count: number,
  W: number,
  H: number,
  pad: Pad,
  gap: number,
  extra: (r: Rect, i: number) => Partial<Slot> = () => ({}),
): Slot[] {
  const area = { x: pad.l, y: pad.t, w: W - pad.l - pad.r, h: H - pad.t - pad.b }
  return arrange(format, count, area, gap).map((r, i) => ({
    x: Math.round(r.x),
    y: Math.round(r.y),
    w: Math.round(r.w),
    h: Math.round(r.h),
    ...extra(r, i),
  }))
}

/** PRNG deterministik supaya dekorasi acak selalu sama untuk template yang sama */
export function seeded(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
