import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'

// font UI & template generator di-bundle supaya kanvas selalu dapat font yang sama.
// template hasil desain (src/templates/y2k, dst.) memuat font Google Fonts-nya sendiri saat dirender.
import '@fontsource-variable/outfit'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'
import '@fontsource/dm-serif-display/400.css'
import '@fontsource/dm-serif-display/400-italic.css'
import '@fontsource-variable/caveat'
import '@fontsource/vt323'
import '@fontsource/anton'
import './index.css'
// harus sebelum kanvas mana pun dipakai: cadangan letterSpacing untuk Safari lama
import './lib/canvasPolyfill'

import App from './App'
import { AppProvider } from './state/AppState'

const root = createRoot(document.getElementById('root')!)

// halaman uji template, hanya di dev server (tidak ikut build produksi)
if (import.meta.env.DEV && location.pathname.startsWith('/dev/templates')) {
  const DevTemplates = lazy(() => import('./dev/DevTemplates'))
  root.render(
    <StrictMode>
      <Suspense fallback={null}>
        <DevTemplates />
      </Suspense>
    </StrictMode>,
  )
} else {
  root.render(
    <StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </StrictMode>,
  )
}

// PWA: simpan aplikasi untuk dipakai offline (hanya build produksi; dev server tidak di-cache)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // tanpa service worker aplikasi tetap jalan, hanya tidak bisa offline
    })
  })
}
