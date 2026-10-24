import { Suspense, lazy, useEffect } from 'react'
import { useApp, type Step } from './state/AppState'
import { useIdleCountdown } from './state/booth'
import { templateById } from './templates'
import { Home } from './screens/Home'

// layar selain beranda dimuat terpisah: beranda di HP tidak perlu menunggu kode kamera, filter, lensa, dst.
const screens = {
  count: () => import('./screens/CountScreen').then((m) => ({ default: m.CountScreen })),
  template: () => import('./screens/TemplateScreen').then((m) => ({ default: m.TemplateScreen })),
  gallery: () => import('./screens/GalleryScreen').then((m) => ({ default: m.GalleryScreen })),
  text: () => import('./screens/TextScreen').then((m) => ({ default: m.TextScreen })),
  permission: () => import('./screens/PermissionScreen').then((m) => ({ default: m.PermissionScreen })),
  camera: () => import('./screens/CameraScreen').then((m) => ({ default: m.CameraScreen })),
  review: () => import('./screens/ReviewScreen').then((m) => ({ default: m.ReviewScreen })),
  rendering: () => import('./screens/RenderingScreen').then((m) => ({ default: m.RenderingScreen })),
  result: () => import('./screens/ResultScreen').then((m) => ({ default: m.ResultScreen })),
  privasi: () => import('./screens/PrivacyScreen').then((m) => ({ default: m.PrivacyScreen })),
  tentang: () => import('./screens/AboutScreen').then((m) => ({ default: m.AboutScreen })),
  booth: () => import('./screens/BoothScreen').then((m) => ({ default: m.BoothScreen })),
}
const CountScreen = lazy(screens.count)
const TemplateScreen = lazy(screens.template)
const GalleryScreen = lazy(screens.gallery)
const TextScreen = lazy(screens.text)
const PermissionScreen = lazy(screens.permission)
const CameraScreen = lazy(screens.camera)
const ReviewScreen = lazy(screens.review)
const RenderingScreen = lazy(screens.rendering)
const ResultScreen = lazy(screens.result)
const PrivacyScreen = lazy(screens.privasi)
const AboutScreen = lazy(screens.tentang)
const BoothScreen = lazy(screens.booth)

/** setelah halaman pertama tampil, muat layar lain di waktu senggang supaya pindah langkah tetap instan */
function usePrefetchScreens() {
  useEffect(() => {
    const run = () => Object.values(screens).forEach((load) => void load())
    const id = 'requestIdleCallback' in window ? requestIdleCallback(run, { timeout: 3000 }) : setTimeout(run, 1500)
    return () => ('cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id))
  }, [])
}

export default function App() {
  const { step, count, templateId, result, booth, reset, go } = useApp()
  usePrefetchScreens()
  // mode booth: tamu yang pergi di tengah sesi → kembali ke awal & foto dihapus (halaman hasil punya hitungan sendiri)
  const idleLimit = booth.on && step !== 'home' && step !== 'result' && step !== 'booth' ? Math.max(180, booth.resetSeconds * 3) : null
  useIdleCountdown(idleLimit, () => {
    reset()
    go('home', { replace: true })
  })
  const hasTemplate = templateById(templateId) !== null

  // kalau data langkah sebelumnya belum ada (mis. setelah back/forward aneh), kembali ke beranda
  const allowed: Record<Step, boolean> = {
    home: true,
    count: true,
    template: count !== null,
    gallery: true,
    text: hasTemplate,
    permission: hasTemplate,
    camera: hasTemplate,
    review: hasTemplate,
    rendering: hasTemplate,
    result: hasTemplate && result !== null,
    privasi: true,
    tentang: true,
    booth: true,
  }
  // step lama dari history (mis. 'vibe' versi sebelumnya) tidak dikenal → beranda
  const current = allowed[step] ? step : 'home'

  return <Suspense fallback={<div className="min-h-dvh bg-ivory" />}>{screen(current)}</Suspense>
}

function screen(current: Step) {
  switch (current) {
    case 'count':
      return <CountScreen />
    case 'template':
      return <TemplateScreen />
    case 'gallery':
      return <GalleryScreen />
    case 'text':
      return <TextScreen />
    case 'permission':
      return <PermissionScreen />
    case 'camera':
      return <CameraScreen />
    case 'review':
      return <ReviewScreen />
    case 'rendering':
      return <RenderingScreen />
    case 'result':
      return <ResultScreen />
    case 'privasi':
      return <PrivacyScreen />
    case 'tentang':
      return <AboutScreen />
    case 'booth':
      return <BoothScreen />
    default:
      return <Home />
  }
}
