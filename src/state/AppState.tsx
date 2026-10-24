import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { PhotoCount, TextValues } from '../templates'
import { templateById } from '../templates'
import type { FilterId } from '../render/filters'
import { NO_LENS } from '../render/lens'
import { NO_MOTION } from '../render/motion'
import type { FrameSettings } from '../render/pipeline'
import { revokePhoto, type Photo } from '../lib/photo'
import { stopCamera } from '../lib/camera'
import { todayLabel } from '../lib/date'
import { ensureFonts } from '../render/fonts'
import { loadBooth, saveBooth, type BoothSettings } from './booth'
import { cameraPermissionGranted, cameraSupport } from '../lib/camera'

export type Step =
  | 'home'
  | 'count'
  | 'template'
  | 'gallery'
  | 'text'
  | 'permission'
  | 'camera'
  | 'review'
  | 'rendering'
  | 'result'
  | 'privasi'
  | 'tentang'
  | 'booth'

export type Result = { url: string; blob: Blob }

export const TIMERS = [3, 5, 10] as const
export type Timer = (typeof TIMERS)[number]

type AppState = {
  step: Step
  count: PhotoCount | null
  /** chip kategori di layar pilih template (null = semua) */
  category: string | null
  /** filter galeri template dari beranda (null = semua) */
  galleryCount: PhotoCount | null
  galleryCategory: string | null
  /** template yang disorot di galeri, baru dipakai saat "pakai" */
  galleryPick: string | null
  templateId: string | null
  texts: TextValues
  /** saklar "tampilkan tanggal" */
  showDate: boolean
  /** teks yang benar-benar dikirim ke renderer (tanggal dikosongkan kalau saklar mati) */
  renderTexts: TextValues
  photos: (Photo | null)[]
  filter: FilterId
  /** 0–100 */
  filterStrength: number
  lensId: string
  /** 0–100 */
  lensStrength: number
  mirrorResult: boolean
  /** lensa (yang mendukung) mengikuti posisi wajah */
  faceFollow: boolean
  /** efek gerak di kamera (hiasan wajah / layar), 'tanpa' = mati */
  motionId: string
  /** hitung mundur sebelum tiap foto, detik */
  timer: Timer
  /** warna aksen template: putaran hue lapisan desain, derajat (0 = asli) */
  hue: number
  /** gabungan setelan untuk pipeline gambar */
  frame: FrameSettings
  /** index foto yang sedang diulang, null = sesi foto biasa */
  retake: number | null
  result: Result | null
  /** ada sesi tersimpan (untuk tautan "lanjutkan sesi terakhir" di beranda) */
  hasProgress: boolean
  /** setelan mode booth (kiosk acara) */
  booth: BoothSettings
  setBooth: (b: BoothSettings) => void
  /** mode booth: sesi baru yang bersih (tulisan acara terisi, template tetap kalau diatur, atau `pick` dari showcase) */
  startBoothSession: (pick?: string) => Promise<void>

  go: (step: Step, opts?: { replace?: boolean }) => void
  back: () => void
  /** kembali ke langkah terakhir sesi tersimpan (langkah yang butuh foto/hasil yang sudah hilang diganti yang terdekat) */
  resume: () => void
  setCount: (n: PhotoCount) => void
  setCategory: (id: string | null) => void
  setGalleryCount: (n: PhotoCount | null) => void
  setGalleryCategory: (id: string | null) => void
  setGalleryPick: (id: string | null) => void
  /** pilih template; jumlah foto ikut template itu */
  setTemplate: (id: string) => void
  setText: (field: keyof TextValues, value: string) => void
  setShowDate: (v: boolean) => void
  /** pilih filter (kekuatan kembali 100) */
  setFilter: (f: FilterId) => void
  setFilterStrength: (v: number) => void
  /** pilih lensa (kekuatan kembali 100) */
  setLens: (id: string) => void
  setLensStrength: (v: number) => void
  setMirrorResult: (v: boolean) => void
  setFaceFollow: (v: boolean) => void
  setMotion: (id: string) => void
  setTimer: (v: Timer) => void
  setHue: (v: number) => void
  setPhoto: (i: number, p: Photo) => void
  clearPhotos: () => void
  setRetake: (i: number | null) => void
  setResult: (r: Result | null) => void
  reset: () => void
}

const Ctx = createContext<AppState | null>(null)

const emptyTexts = (): TextValues => ({ nama: '', nama2: '', tempat: '', tanggal: todayLabel(), catatan: '' })

// ---------- simpan pilihan di sessionStorage ----------
// pilihan (bukan foto) bertahan saat halaman dimuat ulang, mis. setelah mengubah izin kamera.
// foto tidak pernah disimpan: tetap hanya di memori.

const STORE_KEY = 'bilik:pilihan:v1'

type Saved = {
  /** langkah terakhir selain beranda */
  lastStep: Step | null
  count: PhotoCount | null
  category: string | null
  galleryCount: PhotoCount | null
  galleryCategory: string | null
  galleryPick: string | null
  templateId: string | null
  texts: TextValues
  showDate: boolean
  filter: FilterId
  filterStrength: number
  lensId: string
  lensStrength: number
  mirrorResult: boolean
  faceFollow: boolean
  motionId: string
  timer: Timer
  hue: number
}

function loadSaved(): Partial<Saved> {
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY) ?? '{}') as Partial<Saved>
  } catch {
    return {}
  }
}

/** langkah yang aman dipulihkan setelah reload (tidak butuh foto / hasil di memori) */
const RESTORABLE: Step[] = ['count', 'template', 'gallery', 'text', 'permission', 'camera', 'privasi', 'tentang', 'booth']

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = useMemo(loadSaved, [])
  const [step, setStep] = useState<Step>(() => {
    // /?booth membuka setelan mode booth
    if (new URLSearchParams(location.search).has('booth')) {
      history.replaceState({ step: 'booth' }, '', location.pathname)
      return 'booth'
    }
    const s = history.state?.step as Step | undefined
    return s && RESTORABLE.includes(s) ? s : 'home'
  })
  const [booth, setBoothState] = useState<BoothSettings>(loadBooth)
  const setBooth = useCallback((b: BoothSettings) => {
    saveBooth(b)
    setBoothState(b)
  }, [])
  const [count, setCountState] = useState<PhotoCount | null>(saved.count ?? null)
  const [lastStep, setLastStep] = useState<Step | null>(saved.lastStep ?? null)
  const [category, setCategory] = useState<string | null>(saved.category ?? null)
  const [galleryCount, setGalleryCount] = useState<PhotoCount | null>(saved.galleryCount ?? null)
  const [galleryCategory, setGalleryCategory] = useState<string | null>(saved.galleryCategory ?? null)
  const [galleryPick, setGalleryPick] = useState<string | null>(saved.galleryPick ?? null)
  const [templateId, setTemplateId] = useState<string | null>(
    templateById(saved.templateId ?? null) ? (saved.templateId ?? null) : null,
  )
  const [texts, setTexts] = useState<TextValues>(() => ({ ...emptyTexts(), ...saved.texts }))
  const [showDate, setShowDate] = useState(saved.showDate ?? true)
  const [photos, setPhotos] = useState<(Photo | null)[]>([])
  const [filter, setFilterState] = useState<FilterId>(saved.filter ?? 'normal')
  const [filterStrength, setFilterStrength] = useState(saved.filterStrength ?? 100)
  const [lensId, setLensState] = useState(saved.lensId ?? NO_LENS)
  const [lensStrength, setLensStrength] = useState(saved.lensStrength ?? 100)
  const [mirrorResult, setMirrorResult] = useState(saved.mirrorResult ?? false)
  const [faceFollow, setFaceFollow] = useState(saved.faceFollow ?? false)
  const [motionId, setMotion] = useState(saved.motionId ?? NO_MOTION)
  const [hue, setHue] = useState(saved.hue ?? 0)
  const [timer, setTimer] = useState<Timer>(TIMERS.includes(saved.timer as Timer) ? (saved.timer as Timer) : 3)
  const [retake, setRetake] = useState<number | null>(null)
  const [result, setResultState] = useState<Result | null>(null)

  const photosRef = useRef(photos)
  photosRef.current = photos
  const resultRef = useRef(result)
  resultRef.current = result

  useEffect(() => {
    try {
      const data: Saved = { lastStep, count, category, galleryCount, galleryCategory, galleryPick, templateId, texts, showDate, filter, filterStrength, lensId, lensStrength, mirrorResult, faceFollow, motionId, timer, hue }
      sessionStorage.setItem(STORE_KEY, JSON.stringify(data))
    } catch {
      // mode privat / storage diblokir: pilihan tetap jalan di memori
    }
  }, [lastStep, count, category, galleryCount, galleryCategory, galleryPick, templateId, texts, showDate, filter, filterStrength, lensId, lensStrength, mirrorResult, faceFollow, motionId, timer, hue])

  // sinkron dengan tombol/gesture back di HP & browser
  useEffect(() => {
    history.replaceState({ step }, '')
    const onPop = (e: PopStateEvent) => setStep((e.state?.step as Step) ?? 'home')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // kamera hanya menyala di layar kamera & izin; mode ulang foto berakhir saat kamera ditinggalkan
  useEffect(() => {
    if (step !== 'home' && step !== 'privasi' && step !== 'tentang' && step !== 'booth') setLastStep(step)
    if (step !== 'camera' && step !== 'permission') stopCamera()
    if (step !== 'camera') setRetake(null)
    window.scrollTo(0, 0)
  }, [step])

  const go = useCallback((next: Step, opts?: { replace?: boolean }) => {
    if (opts?.replace) history.replaceState({ step: next }, '')
    else history.pushState({ step: next }, '')
    setStep(next)
  }, [])

  const back = useCallback(() => history.back(), [])

  const clearPhotos = useCallback(() => {
    photosRef.current.forEach(revokePhoto)
    setPhotos([])
  }, [])

  const setResult = useCallback((r: Result | null) => {
    if (resultRef.current && resultRef.current.url !== r?.url) URL.revokeObjectURL(resultRef.current.url)
    setResultState(r)
  }, [])

  // template mengikat jumlah foto; template yang tidak cocok dilepas, foto tetap disimpan
  const setCount = useCallback((n: PhotoCount) => {
    setTemplateId((id) => (templateById(id)?.photoCount === n ? id : null))
    setCountState(n)
  }, [])

  const setFilter = useCallback((f: FilterId) => {
    setFilterState(f)
    setFilterStrength(100)
  }, [])

  const setLens = useCallback((id: string) => {
    setLensState(id)
    setLensStrength(100)
  }, [])

  // font Google template dimuat begitu template dipilih (juga setelah reload), jauh sebelum render akhir
  useEffect(() => {
    const t = templateById(templateId)
    if (t) void ensureFonts(t)
  }, [templateId])

  // template baru → filter default template itu (user tetap bisa ganti setelahnya)
  const setTemplate = useCallback(
    (id: string) => {
      const t = templateById(id)
      if (!t) return
      // template baru: filter default template itu & warna aksen kembali asli
      if (id !== templateId) {
        setFilter(t.filter ?? 'normal')
        setHue(0)
      }
      setTemplateId(id)
      setCountState(t.photoCount as PhotoCount)
    },
    [templateId, setFilter],
  )

  const setPhoto = useCallback((i: number, p: Photo) => {
    setPhotos((prev) => {
      const next = [...prev]
      if (next[i] && next[i] !== p) revokePhoto(next[i])
      next[i] = p
      return next
    })
  }, [])

  const setText = useCallback((field: keyof TextValues, value: string) => {
    setTexts((t) => ({ ...t, [field]: value }))
  }, [])

  const reset = useCallback(() => {
    clearPhotos()
    setResult(null)
    setLastStep(null)
    setCountState(null)
    setCategory(null)
    setGalleryPick(null)
    setTemplateId(null)
    setTexts(emptyTexts())
    setShowDate(true)
    setRetake(null)
    setFilter('normal')
    setLens(NO_LENS)
    setMotion(NO_MOTION)
    setMirrorResult(false)
    setHue(0)
  }, [clearPhotos, setResult, setFilter, setLens])

  const renderTexts = useMemo(() => (showDate ? texts : { ...texts, tanggal: '' }), [texts, showDate])
  const startBoothSession = useCallback(async (pick?: string) => {
    if (booth.fullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => undefined)
    reset()
    const fields = Object.entries(booth.texts).filter(([, v]) => v) as [keyof TextValues, string][]
    for (const [k, v] of fields) setText(k, v)
    const t = templateById(booth.templateId) ?? templateById(pick ?? null)
    if (!t) return go('count')
    setTemplate(t.id)
    if (booth.editText) return go('text')
    const ok = cameraSupport() === null && (await cameraPermissionGranted())
    go(ok ? 'camera' : 'permission')
  }, [booth, reset, setText, setTemplate, go])

  // mode booth: tidak ada "lanjutkan sesi terakhir" (tiap tamu mulai dari awal)
  const hasProgress = lastStep !== null && !booth.on

  const resume = useCallback(() => {
    const t = templateById(templateId)
    const full = !!t && photos.filter(Boolean).length >= t.photoCount
    let s: Step = lastStep ?? 'count'
    if (s === 'result' && !result) s = 'review'
    if (s === 'rendering') s = 'review'
    if (s === 'review' && !full) s = 'camera'
    // langkah yang butuh template / jumlah foto
    if (!t && !['count', 'template', 'gallery'].includes(s)) s = count ? 'template' : 'count'
    if (s === 'template' && !count) s = 'count'
    go(s)
  }, [lastStep, templateId, photos, result, count, go])
  const frame = useMemo<FrameSettings>(
    () => ({ filterId: filter, filterStrength, lensId, lensStrength, mirrorResult }),
    [filter, filterStrength, lensId, lensStrength, mirrorResult],
  )

  const value = useMemo<AppState>(
    () => ({
      step,
      count,
      category,
      galleryCount,
      galleryCategory,
      galleryPick,
      templateId,
      texts,
      showDate,
      renderTexts,
      photos,
      filter,
      filterStrength,
      lensId,
      lensStrength,
      mirrorResult,
      faceFollow,
      motionId,
      timer,
      hue,
      frame,
      retake,
      result,
      hasProgress,
      go,
      back,
      resume,
      booth,
      setBooth,
      startBoothSession,
      setCount,
      setCategory,
      setGalleryCount,
      setGalleryCategory,
      setGalleryPick,
      setTemplate,
      setText,
      setShowDate,
      setFilter,
      setFilterStrength,
      setLens,
      setLensStrength,
      setMirrorResult,
      setFaceFollow,
      setMotion,
      setTimer,
      setHue,
      setPhoto,
      clearPhotos,
      setRetake,
      setResult,
      reset,
    }),
    [step, count, category, galleryCount, galleryCategory, galleryPick, templateId, texts, showDate, renderTexts, photos, filter, filterStrength, lensId, lensStrength, mirrorResult, faceFollow, motionId, timer, hue, frame, retake, result, hasProgress, booth, setBooth, startBoothSession, go, back, resume, setCount, setTemplate, setText, setFilter, setLens, setPhoto, clearPhotos, setResult, reset],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp harus di dalam <AppProvider>')
  return v
}
