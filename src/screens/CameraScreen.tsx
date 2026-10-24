import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { BackIcon } from '../components/Screen'
import { Logo } from '../components/Logo'
import { NoBreak } from '../components/NoBreak'
import { EffectStrip, EffectTabs, StrengthSlider, type EffectTab, type TileDraw } from '../camera/EffectPicker'
import { usePreviewLoop } from '../camera/usePreviewLoop'
import { useFrameThumbs } from '../camera/useFrameThumbs'
import { hasNativeFaceDetector, useFaceFocus, type FaceStatus } from '../camera/useFaceFocus'
import { BurstRecorder } from '../camera/burst'
import { FILTERS, filterById } from '../render/filters'
import { lensById, webglAvailable } from '../render/lens'
import { coverCrop, frameMap, isMirrored, pipelineFor, processFrame, type Pipeline } from '../render/pipeline'
import { MeshSmoother, NO_MOTION, headFrom } from '../render/motion'
import { overlayFace, stickerById } from '../effects/faceStickers'
import { meshFailed, useFaceMesh } from '../camera/useFaceMesh'
import { CAMERA_ERROR_TEXT, cameraErrorOf, openCamera, type CameraError } from '../lib/camera'
import { capturePhoto, revokePhoto, type Photo } from '../lib/photo'
import { templateById } from '../templates'
import type { Slot } from '../templates/types'
import { TIMERS, useApp, type Timer } from '../state/AppState'
import { UploadIcon, useUpload } from '../state/useUpload'
import { useDesktop } from '../state/useDesktop'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const DEBUG = typeof location !== 'undefined' && new URLSearchParams(location.search).has('debug')

// ---------- ikon ----------

function FlipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9a8 8 0 0114-3l2 2M20 15a8 8 0 01-14 3l-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 4v4h-4M4 20v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TimerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="13" r="7.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 9.5V13l2.5 2M9.5 3h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ---------- bagian kecil ----------

/** rasio umum yang dikenal orang (foto, layar, cetak) */
const RATIOS: [number, number][] = [
  [1, 1],
  [4, 5],
  [5, 4],
  [3, 4],
  [4, 3],
  [2, 3],
  [3, 2],
  [9, 16],
  [16, 9],
  [10, 16],
  [16, 10],
  [5, 7],
  [7, 5],
  [1, 2],
  [2, 1],
  [1, 3],
  [3, 1],
]

/** rasio slot sebagai rasio umum terdekat ("4:5", "16:10") untuk label di viewfinder; slot yang tidak umum pakai desimal */
function ratioLabel(aspect: number) {
  const [p, q] = RATIOS.reduce((a, b) => (Math.abs(b[0] / b[1] - aspect) < Math.abs(a[0] / a[1] - aspect) ? b : a))
  return Math.abs(p / q - aspect) / aspect < 0.04 ? `${p}:${q}` : aspect >= 1 ? `${aspect.toFixed(2)}:1` : `1:${(1 / aspect).toFixed(2)}`
}

/** titik progres per foto: aktif = pink & panjang, sudah diambil = putih, belum = putih transparan */
function ProgressDots({ count, active, photos }: { count: number; active: number; photos: (Photo | null)[] }) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="img"
      aria-label={`foto ${Math.min(active + 1, count)} dari ${count}, ${photos.filter(Boolean).length} sudah diambil`}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`h-2 rounded-full motion-safe:transition-all ${i === active ? 'w-[26px] bg-accent' : photos[i] ? 'w-2 bg-white' : 'w-2 bg-white/30'}`}
        />
      ))}
    </div>
  )
}

/** saklar mini 40×24 (tampilan saja; peran switch ada di tombol kartu) */
function MiniSwitch({ on }: { on: boolean }) {
  return (
    <span className={`relative inline-block h-6 w-10 shrink-0 rounded-full transition-colors ${on ? 'bg-ink' : 'bg-[#CFCCC4]'}`} aria-hidden="true">
      <span className={`absolute top-1 left-1 h-4 w-4 rounded-full motion-safe:transition-transform ${on ? 'translate-x-4 bg-accent' : 'bg-white'}`} />
    </span>
  )
}

/** kartu opsi kecil: judul, status, saklar mini. seluruh kartu adalah switch */
function OptionCard({
  title,
  status,
  dot,
  on,
  onChange,
  disabled,
}: {
  title: string
  status: string
  dot?: 'green' | 'gray'
  on: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`${title}, ${status}`}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className="flex min-w-0 items-center justify-between gap-2 rounded-[14px] border border-line bg-white px-3.5 py-3 text-left disabled:opacity-50"
    >
      <span className="min-w-0">
        <span className="block text-[14px] font-bold leading-tight">{title}</span>
        <span className="mt-1 flex items-center gap-1.5 text-[12px] leading-tight text-muted">
          {dot && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot === 'green' ? 'bg-[#1F9D55]' : 'bg-[#B5B2AA]'}`} aria-hidden="true" />}
          <span className="truncate">{status}</span>
        </span>
      </span>
      <MiniSwitch on={on} />
    </button>
  )
}

/** tombol segmen kecil (timer) */
function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  format,
  disabled,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  format: (v: T) => string
  disabled?: boolean
}) {
  return (
    <div className="inline-flex rounded-full border border-line bg-white p-1" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={String(o)}
          type="button"
          role="radio"
          aria-checked={value === o}
          disabled={disabled}
          onClick={() => onChange(o)}
          className={`h-8 min-w-11 rounded-full px-3 font-mono text-[13px] transition-colors disabled:opacity-50 ${value === o ? 'bg-ink text-white' : 'text-ink hover:bg-ivory'}`}
        >
          {format(o)}
        </button>
      ))}
    </div>
  )
}

/**
 * "hasil sementara": satu kotak berukuran sama per foto. ≤3 foto satu baris; 4–6 foto 3 kolom (lebih kecil).
 * sudah diambil: foto + nomor + "ulang"; berikutnya: garis pink; belum: abu.
 */
function ResultTiles({
  slots,
  photos,
  next,
  running,
  onRetake,
  small,
}: {
  slots: Slot[]
  photos: (Photo | null)[]
  next: number
  running: boolean
  onRetake: (i: number) => void
  small?: boolean
}) {
  const many = slots.length > 3
  // desktop: tinggi mengikuti tinggi layar supaya panel tetap muat di laptop 768px (maks 150 / 92px)
  const h = small ? (many ? 'h-[52px]' : 'h-[64px]') : many ? 'h-[clamp(56px,8.5dvh,92px)]' : 'h-[clamp(96px,15dvh,150px)]'
  return (
    <div className={`grid gap-2.5 ${many ? 'grid-cols-3' : ''}`} style={many ? undefined : { gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))` }}>
      {slots.map((_, i) => {
        const p = photos[i]
        const isNext = !p && i === next
        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-[10px] ${h} ${p ? 'bg-line' : isNext ? 'border-2 border-accent bg-white' : 'bg-[#E9E7E1]'}`}
            aria-label={p ? `foto ${i + 1} sudah diambil` : isNext ? `foto ${i + 1}, berikutnya` : `foto ${i + 1} belum diambil`}
            role="group"
          >
            {p && <img src={p.url} alt={`foto ${i + 1}`} className="h-full w-full object-cover" />}
            <span
              className={`absolute top-1.5 left-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-[11px] leading-none ${
                p ? 'bg-ink text-white' : isNext ? 'text-accent' : 'text-muted'
              }`}
            >
              {i + 1}
            </span>
            {isNext && !small && <span className="absolute inset-x-0 bottom-2 text-center text-[12px] font-semibold text-accent">berikutnya</span>}
            {p && (
              <button
                type="button"
                onClick={() => onRetake(i)}
                disabled={running}
                aria-label={`ulang foto ${i + 1}`}
                className={`absolute right-1.5 bottom-1.5 flex items-center gap-1 rounded-full bg-white text-ink shadow-[0_1px_4px_rgba(0,0,0,0.2)] disabled:opacity-50 ${small ? 'h-6 px-1.5 text-[11px]' : 'h-7 px-2.5 text-[12px] font-semibold'}`}
              >
                ↺{!small && ' ulang'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

const FACE_STATUS: Record<FaceStatus, string> = {
  off: 'mati',
  loading: 'memuat…',
  searching: 'tidak terdeteksi',
  ready: 'terdeteksi',
  error: 'gagal dimuat',
}

// ---------- layar ----------

export function CameraScreen() {
  const app = useApp()
  const { templateId, photos, retake, setPhoto, setRetake, go, back } = app
  const { frame, setFilter, setFilterStrength, setLens, setLensStrength, setMirrorResult, faceFollow, setFaceFollow, timer, setTimer, motionId, setMotion } = app
  const timerRef = useRef(timer)
  timerRef.current = timer
  const nextTimer = useCallback(() => setTimer(TIMERS[(TIMERS.indexOf(timerRef.current) + 1) % TIMERS.length]), [setTimer])
  const t = templateById(templateId)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const burstRef = useRef(new BurstRecorder())
  useEffect(() => {
    const b = burstRef.current
    return () => b.dispose()
  }, [])
  const [facing, setFacing] = useState<'user' | 'environment'>('user')
  const [attempt, setAttempt] = useState(0)
  const [canFlip, setCanFlip] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<CameraError | null>(null)
  const [running, setRunning] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [shooting, setShooting] = useState<number | null>(null)
  const [flashKey, setFlashKey] = useState(0)
  const [tab, setTab] = useState<EffectTab>('filter')
  const [notice, setNotice] = useState<string | null>(null)
  const lensAvailable = useMemo(webglAvailable, [])
  const desktop = useDesktop()
  const { upload, busy: uploading, error: uploadError } = useUpload()

  // ref untuk dibaca di dalam loop async
  const tokenRef = useRef(0)
  const photosRef = useRef(photos)
  photosRef.current = photos
  const frameRef = useRef(frame)
  frameRef.current = frame
  const lastRef = useRef<number | null>(null)

  // ---------- buka kamera ----------
  useEffect(() => {
    let alive = true
    setReady(false)
    setError(null)
    openCamera(facing)
      .then(async (stream) => {
        const v = videoRef.current
        if (!alive || !v) return
        v.srcObject = stream
        await v.play().catch(() => undefined)
        const devices = await navigator.mediaDevices.enumerateDevices().catch(() => [])
        if (alive) setCanFlip(devices.filter((d) => d.kind === 'videoinput').length > 1)
      })
      .catch((e) => alive && setError(cameraErrorOf(e)))
    return () => {
      alive = false
    }
  }, [facing, attempt])

  useEffect(() => {
    if (!notice) return
    const id = setTimeout(() => setNotice(null), 2000)
    return () => clearTimeout(id)
  }, [notice])

  // hentikan hitung mundur kalau layar ditinggalkan
  useEffect(() => () => void tokenRef.current++, [])

  const count = t?.photoCount ?? 0
  const firstEmpty = () => {
    for (let i = 0; i < count; i++) if (!photosRef.current[i]) return i
    return -1
  }
  const idleIndex = retake ?? (firstEmpty() === -1 ? count - 1 : firstEmpty())
  const active = shooting ?? idleIndex
  const slot = t?.slots[Math.max(0, active)]
  const aspect = slot ? slot.w / slot.h : 1
  const front = facing === 'user'

  // ---------- lensa yang mengikuti wajah ----------
  const followable = lensAvailable && !!lensById(frame.lensId)?.follow
  // ---------- stiker wajah (Face Landmarker, sampai 3 wajah) ----------
  const sticker = stickerById(motionId)
  // deteksi wajah biasa hanya untuk lensa "ikuti wajah"
  const face = useFaceFocus(videoRef, ready && followable && faceFollow)
  // deteksi wajah juga jalan selama grid stiker terbuka (petak grid menampilkan stiker di wajah sungguhan)
  const mesh = useFaceMesh(videoRef, ready && (!!sticker || tab === 'stiker') && !meshFailed())
  const stickerRef = useRef(sticker)
  stickerRef.current = sticker
  const meshSmoother = useRef(new MeshSmoother())
  /** fps preview < 24: stiker mengurangi partikel & partikel blur */
  const lowPowerRef = useRef(false)
  const reduced = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  // model wajah gagal dimuat: halaman stiker wajah disembunyikan & stiker dimatikan
  const stickersHidden = mesh.status === 'error' || meshFailed()
  useEffect(() => {
    if (!stickersHidden) return
    if (sticker) {
      setMotion(NO_MOTION)
      setNotice('stiker wajah tidak bisa dimuat di perangkat ini')
    }
    setTab((t) => (t === 'stiker' ? 'filter' : t))
  }, [stickersHidden, sticker, setMotion])
  // fungsi gambar yang sama untuk preview, jepret, dan rekaman boomerang: waktu animasi sama → hasil sama dengan yang terlihat.
  // hanya preview yang memajukan penghalus wajah; jepret & rekaman memakai keadaan yang sedang tampil
  const makeOverlay = useCallback(
    (advance: boolean): NonNullable<Pipeline['overlay']> =>
      (ctx, w, h, map) => {
        const now = performance.now()
        // penghalus wajah tetap maju walau "normal" (dipakai petak grid stiker)
        const faces = advance ? meshSmoother.current.sample(mesh.get(), now) : meshSmoother.current.peek()
        const st = stickerRef.current
        if (!st) return false
        for (const f of faces) overlayFace(ctx, w, h, st.id, headFrom(f.face, map, w), now / 1000, { vis: f.vis, reduced, lowPower: lowPowerRef.current })
        return faces.length > 0
      },
    [mesh.get, reduced],
  )
  const overlay = useMemo(() => makeOverlay(true), [makeOverlay])
  // petak grid stiker: kamera langsung (dicerminkan seperti preview) + stiker petak itu di wajah yang terdeteksi
  const frontRef = useRef(front)
  frontRef.current = front
  const liveTile = useCallback<TileDraw>(
    (ctx, id, w, h, now) => {
      const v = videoRef.current
      if (!v || v.readyState < 2 || !v.videoWidth) return false
      const mirrored = frontRef.current
      const crop = coverCrop(v.videoWidth, v.videoHeight, w / h)
      ctx.save()
      if (mirrored) {
        ctx.translate(w, 0)
        ctx.scale(-1, 1)
      }
      ctx.drawImage(v, crop.x, crop.y, crop.w, crop.h, 0, 0, w, h)
      ctx.restore()
      if (id) {
        const map = frameMap(v.videoWidth, v.videoHeight, w, h, mirrored)
        for (const f of meshSmoother.current.peek()) overlayFace(ctx, w, h, id, headFrom(f.face, map, w), now / 1000, { vis: f.vis, reduced, lowPower: true })
      }
      return true
    },
    [reduced],
  )
  const captureOverlay = useMemo(() => makeOverlay(false), [makeOverlay])

  // ---------- preview & thumbnail lewat pipeline yang sama dengan foto akhir ----------
  const previewPipeline = useMemo(() => ({ ...pipelineFor(frame, 'preview', front), focus: face.get, overlay }), [frame, front, face.get, overlay])
  const stats = usePreviewLoop(videoRef, canvasRef, { aspect, pipeline: previewPipeline, enabled: ready })
  lowPowerRef.current = !!stats && stats.fps < 24
  const thumbs = useFrameThumbs(videoRef, { frame, front, tab: tab === 'lensa' ? 'lensa' : 'filter', enabled: ready && tab !== 'stiker' })

  const cancel = useCallback(() => {
    tokenRef.current++
    setRunning(false)
    setCountdown(null)
    setShooting(null)
  }, [])

  const finish = useCallback(() => {
    if (retake !== null) {
      setRetake(null)
      back()
    } else if (firstEmpty() === -1) go('review', { replace: true })
  }, [retake, setRetake, back, go])

  /** ambil foto untuk slot-slot ini berurutan, masing-masing dengan hitung mundur sesuai timer (3/5/10 detik) */
  const run = useCallback(
    async (indices: number[]) => {
      const v = videoRef.current
      if (!t || running || !ready || !v || indices.length === 0) return
      const token = ++tokenRef.current
      setRunning(true)
      try {
        for (const i of indices) {
          setShooting(i)
          // rekam preview selama hitung mundur untuk boomerang (orientasi mengikuti foto akhir)
          // frame tanpa filter & tanpa stiker; stiker di lapisan terpisah (digambar di atas filter saat boomerang dibuat)
          burstRef.current.start((dst, layer, w, h) => {
            if (v.readyState < 2 || !v.videoWidth) return false
            const pl = { ...pipelineFor(frameRef.current, 'capture', front), filter: filterById('normal'), focus: face.get }
            processFrame(v, v.videoWidth, v.videoHeight, dst, w, h, pl, 7)
            const stickers = !!captureOverlay(layer.getContext('2d')!, w, h, frameMap(v.videoWidth, v.videoHeight, w, h, isMirrored(pl)))
            return { stickers }
          }, t.slots[i].w / t.slots[i].h)
          for (let n = timerRef.current; n >= 1; n--) {
            setCountdown(n)
            await sleep(1000)
            if (token !== tokenRef.current) return burstRef.current.stop()
          }
          setCountdown(null)
          const s = t.slots[i]
          burstRef.current.stop()
          const burst = burstRef.current.take(10)
          // resolusi penuh kamera (videoWidth x videoHeight), bukan ukuran preview
          const p: Photo = await capturePhoto(v, v.videoWidth, v.videoHeight, s.w / s.h, {
            ...pipelineFor(frameRef.current, 'capture', front),
            focus: face.get,
            overlay: captureOverlay,
          })
          const rec = await burst
          p.burst = rec.frames
          p.burstStickers = rec.stickers
          if (token !== tokenRef.current) return revokePhoto(p)
          setPhoto(i, p)
          photosRef.current = Object.assign([...photosRef.current], { [i]: p })
          lastRef.current = i
          setFlashKey((k) => k + 1)
          await sleep(650)
          if (token !== tokenRef.current) return
        }
      } catch {
        setError('unknown')
        return
      } finally {
        if (token === tokenRef.current) {
          setRunning(false)
          setCountdown(null)
          setShooting(null)
        }
      }
      if (token === tokenRef.current) finish()
    },
    [t, running, ready, front, setPhoto, finish, face.get, captureOverlay],
  )

  const shutter = useCallback(() => {
    if (!t) return
    if (running) return cancel()
    if (retake !== null) return void run([retake])
    const empty = t.slots.map((_, i) => i).filter((i) => !photosRef.current[i])
    if (empty.length === 0) return go('review', { replace: true })
    run(empty)
  }, [t, running, retake, run, cancel, go])

  const retakeLast = useCallback(() => {
    if (running) return
    const last = lastRef.current ?? photosRef.current.reduce<number>((acc, p, i) => (p ? i : acc), -1)
    if (last >= 0) run([last])
  }, [running, run])

  const stepFilter = useCallback(
    (dir: 1 | -1) => {
      const i = FILTERS.findIndex((f) => f.id === frameRef.current.filterId)
      setFilter(FILTERS[(i + dir + FILTERS.length) % FILTERS.length].id)
    },
    [setFilter],
  )

  // ---------- pintasan keyboard (desktop) ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      // sudah ditangani elemen yang fokus (mis. panah di grid stiker): jangan ikut ganti filter
      if (e.defaultPrevented || e.repeat || e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return
      const key = e.key.toLowerCase()
      if (e.code === 'Space') {
        e.preventDefault()
        ;(document.activeElement as HTMLElement | null)?.blur()
        if (!running) shutter()
      } else if (key === 'r') {
        e.preventDefault()
        retakeLast()
      } else if (key === 'escape') {
        e.preventDefault()
        if (running) cancel()
        else back()
      } else if (key === 'arrowright' || key === 'arrowleft') {
        e.preventDefault()
        setTab('filter')
        stepFilter(key === 'arrowright' ? 1 : -1)
      } else if (key === 'l' && lensAvailable) {
        e.preventDefault()
        setTab('lensa')
      } else if (key === 'f') {
        e.preventDefault()
        setTab('filter')
      } else if (key === 's' && !stickersHidden) {
        e.preventDefault()
        setTab('stiker')
      } else if (key === 't' && !running) {
        e.preventDefault()
        nextTimer()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [running, shutter, retakeLast, cancel, back, stepFilter, lensAvailable, nextTimer, stickersHidden])

  const onUpload = async (files: FileList | null) => {
    const placed = await upload(files, retake ?? undefined)
    if (!placed) return
    if (retake !== null) {
      setRetake(null)
      back()
    } else if (photosRef.current.filter(Boolean).length + placed >= count) go('review', { replace: true })
  }

  if (!t) return null
  const taken = photos.filter(Boolean).length
  const nextIndex = retake ?? firstEmpty()
  const title = `foto ${Math.min(active + 1, count)} dari ${count}`
  const hint = running
    ? countdown
      ? 'senyum…'
      : 'tahan posenya'
    : retake !== null
      ? `ulang foto ${retake + 1}, lihat ke kamera.`
      : 'lihat ke kamera, siap-siap pose.'
  const lens = lensAvailable ? lensById(frame.lensId) : null
  const effectLabel = [filterById(frame.filterId).name, lens?.name, sticker?.name].filter(Boolean).join(' + ')
  const flip = () => setFacing((f) => (f === 'user' ? 'environment' : 'user'))
  const retakeOne = (i: number) => void run([i])

  const faceStatus = !faceFollow ? (!hasNativeFaceDetector() ? 'mati · unduh ±4 MB' : 'mati') : !followable ? 'lensa wajah saja' : FACE_STATUS[face.status]
  const faceDot: 'green' | 'gray' | undefined = faceFollow && followable ? (face.status === 'ready' ? 'green' : 'gray') : undefined

  // ---------- potongan yang dipakai desktop & HP ----------
  const resultsHeader = (
    <div className="mb-2.5 flex items-baseline justify-between">
      <h2 className="text-[14px] font-bold">hasil sementara</h2>
      <span className="font-mono text-[12px] text-muted">
        {taken}/{count}
      </span>
    </div>
  )
  const timerRow = (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[14px] font-semibold">timer</span>
      <Segmented<Timer> label="timer" options={TIMERS} value={timer} onChange={setTimer} format={(n) => `${n}d`} disabled={running} />
    </div>
  )
  const effectRow = (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[14px] font-semibold">efek</span>
      <EffectTabs tab={tab} onTab={setTab} lensAvailable={lensAvailable} stickers={!stickersHidden} />
    </div>
  )
  const strip = (
    <EffectStrip
      tab={tab}
      lensAvailable={lensAvailable}
      thumbs={thumbs}
      filterId={frame.filterId}
      onFilter={setFilter}
      lensId={frame.lensId}
      onLens={setLens}
      motionId={motionId}
      onMotion={setMotion}
      liveTile={liveTile}
      disabled={running}
    />
  )
  const stickerStatus = !sticker
    ? 'stiker ikut gerak kepala, sampai 3 wajah.'
    : mesh.status === 'ready'
      ? 'wajah terdeteksi (sampai 3 wajah)'
      : mesh.status === 'error'
        ? 'deteksi wajah gagal dimuat.'
        : mesh.status === 'loading'
          ? 'memuat deteksi wajah (±8 MB, sekali saja)…'
          : 'mencari wajah… hadap ke kamera.'
  const slider = tab === 'stiker' ? (
    <p className="flex min-h-[43px] items-center gap-2 text-[13px] leading-snug text-muted" aria-live="polite">
      {sticker && <span className={`h-2 w-2 shrink-0 rounded-full ${mesh.status === 'ready' ? 'bg-[#2EAD5B]' : 'bg-[#CFCCC4]'}`} aria-hidden="true" />}
      {stickerStatus}
    </p>
  ) : (
    <StrengthSlider
      tab={tab}
      filterId={frame.filterId}
      filterStrength={frame.filterStrength}
      onFilterStrength={setFilterStrength}
      lensId={lensAvailable ? frame.lensId : 'tanpa'}
      lensStrength={frame.lensStrength}
      onLensStrength={setLensStrength}
    />
  )
  const cards = (
    <div className="grid grid-cols-2 gap-2.5">
      <OptionCard title="ikuti wajah" status={faceStatus} dot={faceDot} on={faceFollow} onChange={setFaceFollow} disabled={!lensAvailable} />
      <OptionCard
        title="mirror hasil"
        status={frame.mirrorResult ? 'nyala' : 'mati'}
        on={frame.mirrorResult}
        onChange={(v) => {
          setMirrorResult(v)
          setNotice(v ? 'hasil akan di-mirror' : 'hasil tidak di-mirror')
        }}
      />
    </div>
  )
  const uploadButton = (size: string) => (
    <button
      type="button"
      onClick={() => fileRef.current?.click()}
      disabled={running || uploading}
      aria-label="unggah dari file"
      title="unggah dari file"
      className={`flex shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 active:bg-white/15 disabled:opacity-40 ${size}`}
    >
      <UploadIcon />
    </button>
  )
  const shutterButton = (
    <button
      type="button"
      onClick={shutter}
      disabled={!ready && !running}
      aria-label={running ? 'batal' : retake !== null ? `ulang foto ${retake + 1}` : 'ambil foto'}
      className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-full border-[5px] border-white/35 disabled:opacity-40"
    >
      <span className={`bg-accent motion-safe:transition-all ${running ? 'h-7 w-7 rounded-md' : 'h-[58px] w-[58px] rounded-full active:scale-95'}`} />
    </button>
  )

  const viewfinder = (
    <div className="relative min-h-0 flex-1 [container-type:size]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative overflow-hidden rounded-[22px] bg-[#1C1C1C] shadow-[0_18px_50px_-20px_rgba(0,0,0,0.7)]"
          style={{ aspectRatio: `${aspect}`, width: `min(100cqw, calc(100cqh * ${aspect}))` }}
        >
          {/* video hanya sumber frame; yang terlihat adalah kanvas hasil pipeline */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            onLoadedMetadata={() => setReady(true)}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
          />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label={`preview kamera, efek ${effectLabel}`} />
          {ready && !error && (
            <>
              <span className="absolute top-3 left-3 rounded-md bg-black/50 px-2 py-1 font-mono text-[11px] leading-none text-white">{effectLabel}</span>
              <span className="absolute top-3 right-3 rounded-md bg-black/50 px-2 py-1 font-mono text-[11px] leading-none text-white">
                {ratioLabel(aspect)}
              </span>
            </>
          )}
          {!ready && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="label-mono text-white/70">membuka kamera…</span>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="max-w-[34ch] text-[15px] leading-snug text-white/85">{CAMERA_ERROR_TEXT[error]}</p>
              <Button variant="light" full={false} onClick={() => setAttempt((a) => a + 1)} className="h-11 px-5 text-[15px]">
                coba lagi
              </Button>
            </div>
          )}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                key={countdown}
                className="heading animate-pop text-[clamp(88px,30cqh,150px)] font-extrabold text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.45)]"
              >
                {countdown}
              </span>
            </div>
          )}
          {flashKey > 0 && <div key={flashKey} className="animate-flash pointer-events-none absolute inset-0 bg-white opacity-0" />}
          {DEBUG && stats && (
            <div className="label-mono absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] leading-tight text-white">
              {stats.fps.toFixed(0)} fps · {stats.procMs.toFixed(1)} ms{sticker ? ` · deteksi ${mesh.getDetectMs().toFixed(1)} ms` : ''}
              <br />
              preview {stats.w}×{stats.h} · kamera {stats.camW}×{stats.camH}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const fileInput = (
    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      multiple={retake === null && count > 1}
      className="hidden"
      onChange={(e) => {
        onUpload(e.target.files)
        e.target.value = ''
      }}
    />
  )

  const status = (
    <p className="text-[15px] leading-snug text-muted" aria-live="polite">
      <NoBreak text={notice ?? hint} />
    </p>
  )

  return (
    <div className="fixed inset-0 bg-[#121212] text-white [&_:focus-visible]:outline-offset-3 lg:grid lg:grid-cols-[minmax(0,1fr)_440px]">
      {/* ================= kiri / HP: kamera ================= */}
      <section className="pt-safe flex h-full flex-col lg:pt-0" style={{ paddingBottom: 'var(--sheet-h, 0px)' }}>
        {/* header desktop */}
        <header className="hidden h-[84px] shrink-0 items-center justify-between px-9 lg:flex">
          <Logo size={26} tone="light" />
          <ProgressDots count={count} active={active} photos={photos} />
          {canFlip ? (
            <button
              type="button"
              onClick={flip}
              disabled={running}
              className="flex h-10 items-center gap-2 rounded-full border border-white/25 px-4 text-[14px] text-white hover:bg-white/10 disabled:opacity-40"
            >
              <FlipIcon /> ganti kamera
            </button>
          ) : (
            <span className="w-[120px]" aria-hidden="true" />
          )}
        </header>
        {/* header HP ringkas */}
        <header className="flex h-14 shrink-0 items-center justify-between px-3 lg:hidden">
          <button
            type="button"
            onClick={running ? cancel : back}
            className="flex h-11 w-11 items-center justify-center rounded-full active:bg-white/10"
            aria-label={running ? 'batal' : 'kembali'}
          >
            <BackIcon />
          </button>
          <ProgressDots count={count} active={active} photos={photos} />
          {canFlip ? (
            <button
              type="button"
              onClick={flip}
              disabled={running}
              className="flex h-11 w-11 items-center justify-center rounded-full active:bg-white/10 disabled:opacity-40"
              aria-label="ganti kamera"
            >
              <FlipIcon />
            </button>
          ) : (
            <span className="w-11" aria-hidden="true" />
          )}
        </header>

        <div className="flex min-h-0 flex-1 flex-col px-4 lg:px-9">{viewfinder}</div>

        {/* baris kontrol: unggah · shutter · (desktop) petunjuk spasi / (HP) timer */}
        <div className="flex h-[112px] shrink-0 items-center justify-center gap-10 lg:h-[130px]">
          {uploadButton('h-[52px] w-[52px]')}
          {shutterButton}
          <span className="hidden h-[52px] w-[52px] items-center justify-center lg:flex" aria-hidden="true">
            <span className="rounded-md border border-white/25 px-1.5 py-1 font-mono text-[11px] leading-none text-white/70">spasi</span>
          </span>
          <button
            type="button"
            onClick={nextTimer}
            disabled={running}
            aria-label={`timer ${timer} detik, ketuk untuk ganti`}
            className="flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center rounded-full border border-white/30 leading-none text-white active:bg-white/15 disabled:opacity-40 lg:hidden"
          >
            <TimerIcon />
            <span className="mt-0.5 font-mono text-[10px]">{timer}d</span>
          </button>
        </div>
        {uploadError && (
          <p role="alert" className="-mt-3 pb-3 text-center text-[13px] text-[#FF8DB8]">
            {uploadError}
          </p>
        )}
      </section>

      {/* ================= kanan (desktop) ================= */}
      {desktop && (
        <aside className="hidden h-dvh min-h-0 flex-col bg-ivory px-8 pt-7 text-ink lg:flex">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={running ? cancel : back}
              className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white hover:bg-[#EFEDE8]"
              aria-label={running ? 'batal' : 'kembali'}
            >
              <BackIcon />
            </button>
            <p className="min-w-0 truncate font-mono text-[12px] text-muted">
              {t.name} · {count} foto ·{' '}
              <button type="button" onClick={() => go('template')} disabled={running} className="text-ink underline underline-offset-2 disabled:opacity-50">
                ganti
              </button>
            </p>
          </div>

          {/* isi panel: di 1440×900 muat tanpa scroll; di layar pendek isi tengah boleh digeser */}
          {/* isi tidak boleh mengecil (baris thumbnail sempat tergencet); kalau layar terlalu pendek, panel ini yang digeser */}
          <div className="-mx-8 flex min-h-0 flex-1 flex-col gap-[clamp(8px,1.8dvh,18px)] overflow-y-auto px-8 pt-[clamp(12px,2.2dvh,20px)] pb-4 [scrollbar-width:thin] [&>*]:shrink-0">
            <div>
              <h1 className="heading text-[clamp(34px,5dvh,44px)] leading-[1.02] font-extrabold tracking-[-0.04em]">{title}</h1>
              <div className="mt-1.5">{status}</div>
            </div>
            <section>
              {resultsHeader}
              <ResultTiles slots={t.slots} photos={photos} next={nextIndex} running={running} onRetake={retakeOne} />
            </section>
            {timerRow}
            {effectRow}
            {strip}
            {slider}
            {cards}
            {!lensAvailable && <p className="text-[12px] leading-snug text-muted">efek lensa butuh webgl; browser ini belum mendukungnya.</p>}
          </div>

          <p className="-mx-8 shrink-0 overflow-hidden border-t border-line px-8 py-3.5 font-mono text-[11px] tracking-[-0.03em] whitespace-nowrap text-muted">
            spasi ambil · R ulang terakhir · ← → filter · esc batal
          </p>
        </aside>
      )}

      {/* ================= HP: lembar bawah ================= */}
      {!desktop && (
        <MobileSheet
          peek={
            <>
              <div className="flex items-baseline justify-between gap-3">
                <h1 className="heading text-[24px] leading-none font-extrabold tracking-[-0.04em]">{title}</h1>
                <span className="truncate text-[13px] text-muted" aria-live="polite">
                  {notice ?? (running ? hint : `${taken}/${count} diambil`)}
                </span>
              </div>
              <ResultTiles slots={t.slots} photos={photos} next={nextIndex} running={running} onRetake={retakeOne} small />
              {strip}
            </>
          }
        >
          {timerRow}
          {effectRow}
          {slider}
          {cards}
        </MobileSheet>
      )}
      {fileInput}
    </div>
  )
}

/**
 * Lembar bawah HP: awalnya hanya bagian `peek`; ditarik (atau diketuk pegangannya) ke atas untuk pengaturan lain.
 * Tinggi bagian `peek` disimpan di --sheet-h supaya viewfinder & shutter tidak tertutup.
 */
function MobileSheet({ peek, children }: { peek: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [dy, setDy] = useState(0)
  const drag = useRef<{ y: number; moved: boolean } | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(open)
  openRef.current = open

  // ruang untuk kamera = tinggi lembar saat tertutup (saat terbuka, lembar menimpa kamera tanpa menggesernya)
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const set = () => !openRef.current && document.documentElement.style.setProperty('--sheet-h', `${el.offsetHeight}px`)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => {
      ro.disconnect()
      document.documentElement.style.removeProperty('--sheet-h')
    }
  }, [])

  const onDown = (e: RPointerEvent) => {
    drag.current = { y: e.clientY, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: RPointerEvent) => {
    const d = drag.current
    if (!d) return
    const v = e.clientY - d.y
    if (Math.abs(v) > 6) d.moved = true
    setDy(v)
  }
  const onUp = () => {
    const d = drag.current
    drag.current = null
    if (!d) return
    if (!d.moved) setOpen((o) => !o)
    else if (dy < -40) setOpen(true)
    else if (dy > 40) setOpen(false)
    setDy(0)
  }

  // saat ditarik, isi tambahan ikut terbuka sebagian mengikuti jari
  const extraStyle = drag.current?.moved ? { maxHeight: Math.max(0, (open ? 520 : 0) - dy), transition: 'none' } : undefined

  return (
    <div
      ref={rootRef}
      className="fixed inset-x-0 bottom-0 z-20 rounded-t-[22px] bg-ivory text-ink shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.5)] lg:hidden"
      role="region"
      aria-label="pengaturan foto"
    >
      <div className={`flex flex-col gap-3 px-4 pt-1 ${open ? 'pb-3' : 'pb-[max(12px,env(safe-area-inset-bottom))]'}`}>
        <button
          type="button"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setOpen((o) => !o))}
          aria-expanded={open}
          aria-label={open ? 'tutup pengaturan' : 'buka pengaturan (timer, efek, kekuatan, opsi)'}
          className="mx-auto flex h-6 w-24 touch-none items-center justify-center"
        >
          <span className="h-1.5 w-10 rounded-full bg-[#CFCCC4]" />
        </button>
        {peek}
      </div>
      <div
        className={`overflow-hidden motion-safe:transition-[max-height] motion-safe:duration-300 ${open ? 'max-h-[520px]' : 'max-h-0'}`}
        style={extraStyle}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="flex flex-col gap-4 border-t border-line px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]">{children}</div>
      </div>
    </div>
  )
}
