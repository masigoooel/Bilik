import { useEffect, useRef, useState, type RefObject } from 'react'
import { FILTERS, applyFilter } from '../render/filters'
import { LENSES, NO_LENS } from '../render/lens'
import { pipelineFor, processFrame, type FrameSettings } from '../render/pipeline'

const SIZE = 88
const EVERY_MS = 2500

/**
 * Thumbnail filter/lensa dari frame kamera terakhir, diperbarui tiap 2,5 detik.
 * Tab filter: lensa aktif + tiap filter. Tab lensa: tiap lensa + filter aktif.
 */
export function useFrameThumbs(
  videoRef: RefObject<HTMLVideoElement | null>,
  opts: { frame: FrameSettings; front: boolean; tab: 'filter' | 'lensa'; enabled: boolean },
) {
  const [thumbs, setThumbs] = useState<Record<string, string>>({})
  const optsRef = useRef(opts)
  optsRef.current = opts
  // object URL yang sedang dipakai per thumbnail; dilepas saat diganti atau saat kamera ditutup
  const live = useRef<Record<string, string>>({})
  useEffect(
    () => () => {
      Object.values(live.current).forEach((u) => URL.revokeObjectURL(u))
      live.current = {}
    },
    [],
  )

  useEffect(() => {
    if (!opts.enabled) return
    const base = document.createElement('canvas')
    const snap = document.createElement('canvas')
    const tmp = document.createElement('canvas')
    tmp.width = tmp.height = SIZE
    const tctx = tmp.getContext('2d', { willReadFrequently: true })!

    // 38 filter / 17 lensa: dikerjakan bertahap dengan jatah waktu tetap (maks 8ms tiap 24ms) supaya
    // preview kamera tetap lancar tapi thumbnail tetap muncul walau CPU penuh; encode JPEG lewat toBlob
    // (di luar main thread), bukan toDataURL
    let busy = false
    let alive = true
    const BUDGET_MS = 8
    const GAP_MS = 24
    type Deadline = { timeRemaining: () => number }
    const later = (fn: (d: Deadline) => void) =>
      setTimeout(() => {
        const t0 = performance.now()
        fn({ timeRemaining: () => BUDGET_MS - (performance.now() - t0) })
      }, GAP_MS)

    const render = () => {
      const v = videoRef.current
      if (busy || !v || v.readyState < 2 || !v.videoWidth) return
      const { frame, front, tab } = optsRef.current
      const p = pipelineFor(frame, 'preview', front)
      // satu snapshot kecil dari video (bukan membaca frame 4K berkali-kali)
      const f = Math.min(1, (SIZE * 3) / Math.min(v.videoWidth, v.videoHeight))
      const sw = Math.round(v.videoWidth * f)
      const sh = Math.round(v.videoHeight * f)
      if (snap.width !== sw || snap.height !== sh) {
        snap.width = sw
        snap.height = sh
      }
      snap.getContext('2d')!.drawImage(v, 0, 0, sw, sh)
      const jobs: { key: string; draw: () => void }[] = []
      if (tab === 'filter') {
        processFrame(snap, sw, sh, base, SIZE, SIZE, { ...p, filter: FILTERS[0] })
        for (const fp of FILTERS)
          jobs.push({
            key: `f:${fp.id}`,
            draw: () => {
              tctx.drawImage(base, 0, 0)
              applyFilter(tctx, fp, { seed: 7 })
            },
          })
      } else {
        for (const l of [null, ...LENSES])
          jobs.push({ key: `l:${l?.id ?? NO_LENS}`, draw: () => processFrame(snap, sw, sh, tmp, SIZE, SIZE, { ...p, lens: l, lensStrength: 1 }, 7) })
      }
      busy = true
      let left = jobs.length
      const done = (entries: [string, string][]) => {
        const urls = entries.filter(([, u]) => u)
        if (!alive) return urls.forEach(([, u]) => URL.revokeObjectURL(u))
        const old = urls.map(([k]) => live.current[k]).filter(Boolean)
        for (const [k, u] of urls) live.current[k] = u
        setThumbs((prev) => ({ ...prev, ...Object.fromEntries(urls) }))
        // url lama dilepas setelah gambar baru sempat dimuat
        setTimeout(() => old.forEach((u) => URL.revokeObjectURL(u)), 2000)
        left -= entries.length
        if (left <= 0) busy = false
      }
      const step = (d: Deadline) => {
        if (!alive) return
        const chunk: Promise<[string, string]>[] = []
        // minimal satu per giliran supaya tidak kelaparan saat CPU penuh
        do {
          const job = jobs.shift()!
          job.draw()
          // toBlob menyalin isi kanvas saat dipanggil, jadi tmp aman dipakai ulang
          chunk.push(new Promise((res) => tmp.toBlob((b) => res([job.key, b ? URL.createObjectURL(b) : '']), 'image/jpeg', 0.72)))
        } while (jobs.length && d.timeRemaining() > 0)
        // hasil tiap potongan langsung tampil (thumbnail muncul bertahap)
        Promise.all(chunk).then(done)
        if (jobs.length) later(step)
      }
      const t0 = performance.now()
      step({ timeRemaining: () => BUDGET_MS - (performance.now() - t0) })
    }

    const first = setTimeout(render, 300)
    const id = setInterval(render, EVERY_MS)
    return () => {
      alive = false
      clearTimeout(first)
      clearInterval(id)
      base.width = base.height = 0
      snap.width = snap.height = 0
    }
  }, [opts.enabled, opts.tab, videoRef])

  return thumbs
}
